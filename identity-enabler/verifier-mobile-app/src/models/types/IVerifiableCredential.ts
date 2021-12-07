export interface IVerifiableCredential {
  type: string[];
  issuanceDate: string;
  credentialSubject: {
    [key: string]: unknown;
  };
}
