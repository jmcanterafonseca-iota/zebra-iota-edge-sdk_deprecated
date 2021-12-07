import { writable} from "svelte/store";
import type { Subscriber, Unsubscriber, Updater, Writable } from "svelte/store";
import type { ILoaderScreen } from "../../models/types/ILoaderScreen";

/**
 * A  writable store to keep track of the loader screen state
 */
 export class LoaderScreenSvelteStore implements Writable<ILoaderScreen> {
    set: (value: ILoaderScreen) => void;
    subscribe: (run: Subscriber<ILoaderScreen>, invalidate?: (value?: ILoaderScreen) => void) => Unsubscriber;
    update: (updater: Updater<ILoaderScreen>) => void;

    constructor() {
        const {set, subscribe, update} = writable<ILoaderScreen>({ visible: false });
        this.set = set.bind(this);
        this.subscribe = subscribe.bind(this);
        this.update = update.bind(this);
    }
    
    /**
     * Open the loader screen.
     * @param message Message to display in loader screen.
     */
    public open(message?: string): void {
        this.set({visible: true, message });
    }
    
    /**
     * Close the loader screen.
     */
    public close(): void {
        this.set({visible: false });
    }
 }
 