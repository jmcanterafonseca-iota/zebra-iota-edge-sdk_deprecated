import { writable } from 'svelte/store';
import { persistent } from './helpers';
import init from './init';
import type { IScan } from '../models/types/IScan';

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
 * Store to track FullScreenLoader screen state
 */
export const loaderScreen = writable<{ visible: true, message?: string } | { visible: false }>({ visible: false });

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
