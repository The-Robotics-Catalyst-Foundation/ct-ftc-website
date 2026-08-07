import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: PageServerLoad = async () => {
	try {
		const records = await pb.collection('events').getList(1, 3, {
			filter: 'date_time >= @now',
			sort: 'date_time'
		});

		return {
			upcomingEvents: records.items.map((record) => ({
				id: record.id,
				slug: record.slug || '',
				name: record.name || 'Untitled Event',
				location: record.location || 'Location Pending',
				dateTime: record.date_time || '',
				volunteersCurrent: record.volunteersAttending ?? 0,
				volunteersNeeded: record.volunteersNeeded ?? 0
			}))
		};
	} catch (err) {
		console.error('Failed to load upcoming events for the volunteer page:', err);
		return { upcomingEvents: [] };
	}
};
