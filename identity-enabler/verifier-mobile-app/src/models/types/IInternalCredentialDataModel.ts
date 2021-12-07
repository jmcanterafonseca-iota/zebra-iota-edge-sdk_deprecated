import type { VerifiableCredentialEnrichment } from './identity';

export interface IInternalCredentialDataModel {
  id: string;
  metaInformation: {
    issuer: string;
    receivedAt: string;
  };
  enrichment: VerifiableCredentialEnrichment | null;
  credentialDocument: {
    [key: string]: unknown;
  };
}
