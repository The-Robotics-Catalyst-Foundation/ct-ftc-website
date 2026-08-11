import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	let record;
	try {
		record = await pb.collection('events').getOne(params.id);
	} catch {
		try {
			record = await pb
				.collection('events')
				.getFirstListItem(pb.filter('slug = {:slug}', { slug: params.id }));
		} catch {
			throw error(404, 'Event not found');
		}
	}

	return {
		event: {
			id: record.id,
			slug: record.slug || '',
			name: record.name || 'Untitled Event',
			type: record.type || 'Scrimmage',
			location: record.location || '',
			dateTime: record.date_time || '',
			volunteersNeeded: record.volunteersNeeded ?? 0
		},
		showName: url.searchParams.get('name') !== '0'
	};
};
