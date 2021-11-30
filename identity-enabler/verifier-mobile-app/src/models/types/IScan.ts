interface IVerifiableCredential {
    type: string[];
    issuanceDate: string;
    credentialSubject: any;
}

interface IVerifiablePresentation {
    holder: string;
    verifiableCredential: IVerifiableCredential;
}

export interface IScan {
    id: string; // ms timestamp of scan
    method: "DataWedge" | "Image" | "Camera";
    vp: IVerifiablePresentation;
    verificationResult: boolean;
}
