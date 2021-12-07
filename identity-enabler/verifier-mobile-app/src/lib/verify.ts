import { Plugins } from '@capacitor/core';
import { ServiceFactory } from '../factories/serviceFactory';
import type { IdentityService } from '../services/identityService';
import type { LoaderScreenSvelteStore } from './stores/LoaderScreenStore';
import type { ScanSvelteStore } from './stores/ScanStore';

export class CredentialVerificationError extends Error {
  readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.originalError = originalError;
  }
}

export async function verifyCredential(scanData: string, method: 'Camera' | 'Image' | 'DataWedge') {
  const loaderScreen = ServiceFactory.get<LoaderScreenSvelteStore>('loaderScreen');
  loaderScreen.open('Verifying credential...');
  let scannedData;
  try {
    scannedData = JSON.parse(scanData);
  } catch (e) {
    loaderScreen.close();
    throw new CredentialVerificationError('Invalid JSON', e);
  }

  const identityService = ServiceFactory.get<IdentityService>('identity');
  let verificationResult: boolean;
  try {
    verificationResult = await identityService.verifyVerifiablePresentation(scannedData);
  } catch (e) {
    loaderScreen.close();
    throw new CredentialVerificationError('Verification error', e);
  }

  if (!verificationResult) {
    loaderScreen.close();
    throw new CredentialVerificationError('Credential is invalid');
  }

  // TODO: check whether we also want to save scans that failed verification
  const scans = ServiceFactory.get<ScanSvelteStore>('scans');
  scans.add({ id: `${Date.now()}`, method, vp: scannedData, verificationResult });
  loaderScreen.close();
  const { Toast } = Plugins;
  await Toast.show({
    text: 'Credential verified!',
    position: 'center',
  });
}
