import type { IScan } from '../../models/types/IScan';
import { persistent } from '../helpers';
import type { Subscriber, Unsubscriber, Updater, Writable } from 'svelte/store';

/**
 * A LocalStorage backed writable Svelte store for scans.
 */
export class ScanSvelteStore implements Writable<IScan[]> {
  set: (value: IScan[]) => void;
  subscribe: (run: Subscriber<IScan[]>, invalidate?: (value?: IScan[]) => void) => Unsubscriber;
  update: (updater: Updater<IScan[]>) => void;

  constructor(localStorageKey: string) {
    const { subscribe, set, update } = persistent<IScan[]>(localStorageKey, []);
    this.set = set;
    this.subscribe = subscribe;
    this.update = update;
  }

  /**
   * Delete a specific scan from the Svelte store.
   * @param scanId The ID of the scan to delete.
   */
  public delete(scanId: string): void {
    this.update((current) => {
      const idx = current.findIndex((s) => s.id === scanId);
      if (idx > -1) {
        current.splice(idx, 1);
      }
      return current;
    });
  }

  /**
   * Add a new scan to the Svelte store.
   * @param scan The scan to add.
   */
  public add(scan: IScan): void {
    this.update((current) => {
      current.push(scan);
      return current;
    });
  }

  /**
   * Empty the Svelte store.
   */
  public reset(): void {
    this.set([]);
  }
}
