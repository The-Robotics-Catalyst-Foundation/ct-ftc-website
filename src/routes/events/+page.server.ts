import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

const CACHE_TTL_MS = 60 * 1000;
let cache: { fetchedAt: number; data: { upcoming: unknown[]; past: unknown[] } } | null = null;

export const load: PageServerLoad = async ({ setHeaders }) => {
    setHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' });

    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
        return { ...cache.data, title: 'Events', description: 'Upcoming and past Connecticut FIRST Tech Challenge competitions, scrimmages, and meetups.' };
    }

    try {
        // 1. Fetch upcoming events (Comparing against your actual 'date_time' field)
        const upcomingRecords = await pb.collection('events').getFullList({
            filter: 'date_time >= @now',
            sort: 'date_time'
        });

        // 2. Fetch past events
        const pastRecords = await pb.collection('events').getFullList({
            filter: 'date_time < @now',
            sort: '-date_time'
        });

        // 3. Map your exact PocketBase schema fields cleanly to the frontend expectations
        const data = {
            upcoming: upcomingRecords.map(record => ({
                id: record.id,
                slug: record.slug || '',
                name: record.name || 'Untitled Event',
                type: record.type || 'Scrimmage', // If 'type' doesn't exist yet, it safely fallbacks
                location: record.location || 'Location Pending',
                startDate: record.date_time || '', // Maps 'date_time' to frontend
                registerLink: record.registerLink || '#',
                volunteerLink: record.volunteerLink || '#',
                volunteersNeeded: record.volunteersNeeded ?? 0
            })),
            past: pastRecords.map(record => ({
                id: record.id,
                slug: record.slug || '',
                name: record.name || 'Untitled Event',
                type: record.type || 'Scrimmage',
                location: record.location || 'Location Pending',
                startDate: record.date_time || '',
                registerLink: record.registerLink || '#',
                volunteerLink: record.volunteerLink || '#',
                volunteersNeeded: record.volunteersNeeded ?? 0
            }))
        };

        cache = { fetchedAt: Date.now(), data };
        return { ...data, title: 'Events', description: 'Upcoming and past Connecticut FIRST Tech Challenge competitions, scrimmages, and meetups.' };
    } catch (err) {
        console.error('Error loading events from PocketBase data layer:', err);
        return {
            upcoming: [],
            past: [],
            title: 'Events',
            description: 'Upcoming and past Connecticut FIRST Tech Challenge competitions, scrimmages, and meetups.'
        };
    }
};