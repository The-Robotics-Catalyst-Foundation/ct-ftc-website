import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'; // Keeps secrets completely hidden from the browser
import {pb} from '$lib/pocketbase';

// Admin authentication might be required depending on your collection API rules
// await pb.admins.authWithPassword(env.PB_ADMIN_EMAIL, env.PB_ADMIN_PASSWORD);

let lastSyncTime = 0;
const SYNC_COOLDOWN = 1000 * 60 * 60; // 1 Hour Cooldown to prevent server overload

export async function POST() {
    const currentTime = Date.now();

    // 1. Guard against server overload / API rate-limiting
    if (currentTime - lastSyncTime < SYNC_COOLDOWN) {
        return json({ success: true, message: 'Synced recently. Skipping to save resources.' });
    }

    try {
        // 2. Fetch data from official FTC API safely using server-side env variables
        const response = await fetch(`https://ftc-api.firstinspires.org/v3.0/2026/events?regionCode=CT`, {
            headers: {
                'Authorization': `Basic ${env.FTC_API_TOKEN}` // Encrypted/hidden secret token
            }
        });

        if (!response.ok) throw new Error('Failed to fetch from FTC API');
        const data = await response.json();

        // 3. Process and automatically upsert into PocketBase
        for (const ftcEvent of data.events) {
            const eventData = {
                eventCode: ftcEvent.code,
                name: ftcEvent.name,
                type: ftcEvent.typeName, // e.g., Qualifier, Scrimmage
                location: `${ftcEvent.city}, ${ftcEvent.stateprov}`,
                startDate: new Date(ftcEvent.dateStart).toISOString(),
                registerLink: `https://ftc-events.firstinspires.org/2026/${ftcEvent.code}`,
                volunteerLink: 'https://www.firstinspires.org/volunteer'
            };

            try {
                // Check if event already exists
                const existing = await pb.collection('events').getFirstListItem(`eventCode="${ftcEvent.code}"`);
                // If it exists, update it if info changed
                await pb.collection('events').update(existing.id, eventData);
            } catch {
                // If getFirstListItem fails, the record doesn't exist yet -> Create it
                await pb.collection('events').create(eventData);
            }
        }

        lastSyncTime = currentTime; // Update cooldown timestamp
        return json({ success: true, message: 'Database successfully populated!' });

    } catch (error) {
        console.error('Sync Error:', error);
        return json({ success: false, error: error.message }, { status: 500 });
    }
}