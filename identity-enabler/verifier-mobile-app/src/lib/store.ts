import { writable } from 'svelte/store';
import { persistent } from './helpers';
import init from './init';
import type { VerifiableCredentialEnrichment } from '../models/types/identity';
import type { IScan } from '../models/types/IScan';
import type { ScanError } from './scan';

init();

/**
 * Creates a scans store
 * @returns A LocalStorage backed writable scan store
 */
function createScansStore() {
	const { subscribe, set, update } = persistent<IScan[]>("scans", []);

	return {
		subscribe,
		delete: (scanId: string) => {
            update(current => {
                current.splice(current.findIndex(s => s.id === scanId), 1);
                return current;
            });
        },
        add: (scan: IScan) => {
            update(current => {
                current.push(scan);
                return current;
            });
        },
		reset: () => set([])
	};
}

export const scans = createScansStore();

/**
 * Store to track ScanInfo screen state
 */
export const scanScreen = writable<{ visible: true, scan: IScan } | { visible: false }>({ visible: false });

/**
 * Store to track FullScreenLoader screen state
 */
export const loaderScreen = writable<{ visible: true, message?: string } | { visible: false }>({ visible: false });

/**
 * Store to track InvalidCredential screen state
 */
export const invalidCredentialScreen = writable<{ visible: true, error: ScanError } | { visible: false }>({ visible: false });

/**
 * Error string
 */
export const error = writable<string>(null);

let errorTimeout: any;

error.subscribe((item) => {
    clearTimeout(errorTimeout);
    if (item) {
        errorTimeout = setTimeout(() => {
            error.set(null);
        }, 3500);
    }
});
