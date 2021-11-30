import { Plugins } from '@capacitor/core';
import { navigate } from 'svelte-routing';
import { ServiceFactory } from '../factories/serviceFactory';
import type { IdentityService } from '../services/identityService';
import { invalidCredentialScreen, loaderScreen, scans } from './store';

export class ScanError extends Error {
  readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.originalError = originalError;
  }
}

export function handleScanError(e: ScanError) {
  console.error(e);
  loaderScreen.set({ visible: false });
  invalidCredentialScreen.set({ visible: true, error: e });
}

export async function handleScannerData(scanData: string, method: 'Camera' | 'Image' | 'DataWedge') {
  loaderScreen.set({ visible: true, message: 'Verifying credential...' });
  let scannedData;
  try {
    scannedData = JSON.parse(scanData);
  } catch (e) {
    return handleScanError(new ScanError("Invalid JSON", e));
  }

  const identityService = ServiceFactory.get<IdentityService>('identity');
  let verificationResult: boolean;
  try {
    verificationResult = await identityService.verifyVerifiablePresentation(scannedData);
  } catch (e) {
    return handleScanError(new ScanError("Verification error", e));
  }

  if (!verificationResult) {
    return handleScanError(new ScanError("Credential is invalid"));
  }

  // TODO: check whether we also want to save scans that failed verification
  scans.add({ id: `${Date.now()}`, method, vp: scannedData, verificationResult });
  loaderScreen.set({ visible: false });
  const { Toast } = Plugins;
  await Toast.show({
    text: 'Credential verified!',
    position: 'center',
  });
  navigate("/home");
}
