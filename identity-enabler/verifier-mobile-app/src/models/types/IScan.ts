import type { IVerifiablePresentation } from './IVerifiablePresentation';

export interface IScan {
  id: string; // ms timestamp of scan
  method: 'DataWedge' | 'Image' | 'Camera';
  vp: IVerifiablePresentation;
  verificationResult: boolean;
}
