import { pb } from '$lib/pocketbase';

/** @type {import('./$types').PageLoad} */
export const load = async () => {
    try {
        const records = await pb.collection('events').getFullList({
            sort: '-date_time',
        });

        return {
            events: JSON.parse(JSON.stringify(records)),
            error: null
        };
    } catch (err) {
        console.error("Database communication matrix failure:", err);
        return {
            events: [],
            error: 'Database communication matrix failure.'
        };
    }
};