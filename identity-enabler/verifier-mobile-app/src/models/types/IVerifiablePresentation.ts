import type { IVerifiableCredential } from './IVerifiableCredential';

export interface IVerifiablePresentation {
  holder: string;
  verifiableCredential: IVerifiableCredential;
}
