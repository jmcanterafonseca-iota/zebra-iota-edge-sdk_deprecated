import { writable } from "svelte/store";
import { persistent } from "./helpers";
// import init from './init';
import { ServiceFactory } from "../factories/serviceFactory";
import type { VerifiableCredentialEnrichment } from "../models/types/identity";
import type { IdentityService } from "../services/identityService";

// init();
const identityService = ServiceFactory.get<IdentityService>("identity");

export const updateStorage = (key, value) => {
    try {
        let stored = {};
        let updated = {};
        if (localStorage.getItem(key)) {
            stored = JSON.parse(localStorage.getItem(key));
            updated = { ...stored, ...value };
        } else {
            updated = value;
        }
        localStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
        console.error(err);
    }
};

export const getFromStorage = key => {
    try {
        const json = localStorage.getItem(key);
        if (json) {
            return JSON.parse(json);
        }
        return null;
    } catch (err) {
        console.error(err);
    }
};

/**
 * Determines if use has completed onboarding
 */
export const hasSetupAccount = persistent<boolean>("hasSetupAccount", false);

export const listOfCredentials = persistent<{ init: boolean; values: string[] }>(
    "listOfCredentials",
    {
        init: false,
        values: []
    },
    value => ({ ...value, init: false })
);

export const credentials = persistent<{ personal: string; health: string; blood: string; organization: string }>(
    "credentials",
    {
        personal: "",
        health: "",
        blood: "",
        organization: ""
    }
);

export const account = persistent<{ name: string } | null>("account", null);

/**
 * Modal status
 */
export type ModalStatus = {
    active: boolean;
    type: "share" | null;
    props?: any;
};

export const modalStatus = writable<ModalStatus>({ active: false, type: null, props: null });

export const landingIndex = writable<number>(0);

export interface InternalCredentialDataModel {
    id: string;
    metaInformation: {
        issuer: string;
        receivedAt: string;
    };
    enrichment: VerifiableCredentialEnrichment | null;
    credentialDocument: any;
}

export const storedCredentials = writable<InternalCredentialDataModel[]>([]);

storedCredentials.subscribe(value => {
    listOfCredentials.update(prev => {
        if (prev.init) {
            const idsToDelete = prev.values.filter(id => !value.find(credential => credential.id === id));
            idsToDelete.map(id => identityService.removeCredential(id));
            return { ...prev, values: value.map(credential => credential.id) };
        }
        return { ...prev, init: true };
    });
    value.map(credential => {
        if (!credential.enrichment) {
            const enrichment = identityService.enrichCredential(credential.credentialDocument);
            storedCredentials.update(prev =>
                prev.map(prevCredential =>
                    prevCredential.id === credential.id ? { ...prevCredential, enrichment } : prevCredential
                )
            );
        }
        return identityService.storeCredential(credential.id, credential);
    });
});

export const currentPresentation = writable<{
    enrichment: VerifiableCredentialEnrichment | null;
    presentationDocument: any;
}>(null);

currentPresentation.subscribe(presentation => {
    if (presentation && !presentation.enrichment) {
        // TODO: which document to use for enrichment
        const enrichment = identityService.enrichCredential(presentation.presentationDocument.verifiableCredential[0]);
        currentPresentation.update(prev => ({ ...prev, enrichment }));
    }
});

export const currentCredentialToAccept = writable<InternalCredentialDataModel>(null);

currentCredentialToAccept.subscribe(credential => {
    if (credential && !credential.enrichment) {
        const enrichment = identityService.enrichCredential(credential.credentialDocument);
        currentCredentialToAccept.update(prev => ({ ...prev, enrichment }));
    }
});

export const unconfirmedCredentials = writable<InternalCredentialDataModel[]>([]);

export const unconfirmedRequests = writable<InternalCredentialDataModel[]>([]);

/**
 * Error string
 */
export const error = writable<string>(null);

let errorTimeout: any;

error.subscribe(item => {
    clearTimeout(errorTimeout);
    if (item) {
        errorTimeout = setTimeout(() => {
            error.set(null);
        }, 3500);
    }
});
