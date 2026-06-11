import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: PageServerLoad = async () => {
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
        return {
            upcoming: upcomingRecords.map(record => ({
                id: record.id,
                name: record.name || 'Untitled Event',
                type: record.type || 'Tournament', // If 'type' doesn't exist yet, it safely fallbacks
                location: record.location || 'Location Pending',
                startDate: record.date_time || '', // Maps 'date_time' to frontend
                registerLink: record.registerLink || '#',
                volunteerLink: record.volunteerLink || '#',
                volunteersCurrent: record.volunteersAttending ?? 0, // Maps 'volunteersAttending'
                volunteersNeeded: record.volunteersNeeded ?? 0
            })),
            past: pastRecords.map(record => ({
                id: record.id,
                name: record.name || 'Untitled Event',
                type: record.type || 'Tournament',
                location: record.location || 'Location Pending',
                startDate: record.date_time || '',
                registerLink: record.registerLink || '#',
                volunteerLink: record.volunteerLink || '#',
                volunteersCurrent: record.volunteersAttending ?? 0,
                volunteersNeeded: record.volunteersNeeded ?? 0
            }))
        };
    } catch (err) {
        console.error('Error loading events from PocketBase data layer:', err);
        return {
            upcoming: [],
            past: []
        };
    }
};