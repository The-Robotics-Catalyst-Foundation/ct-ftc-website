import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// Point this to your hosting destination URL (local or cloud)
export const PB_URL = 'https://pb.ctftc.robolyst.dev';

export const pb = new PocketBase(PB_URL);

// A global Svelte store to track the logged-in user state reactively
export const currentUser = writable(pb.authStore.model);

// Monitor session changes dynamically
pb.authStore.onChange((auth) => {
    currentUser.set(pb.authStore.model);
});