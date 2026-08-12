import { writable } from 'svelte/store';

// Lets an admin page register what the layout's mobile "+" button should do,
// since the button lives in a parent layout and Svelte context can't flow
// upward from the page into it. Pages set this on mount and clear it on
// unmount; the layout just renders whatever's currently registered.
export const adminCreateAction = writable<{ label: string; run: () => void } | null>(null);
