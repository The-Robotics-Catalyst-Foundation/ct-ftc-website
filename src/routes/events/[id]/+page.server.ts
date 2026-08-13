import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageServerLoad } from './$types';

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map<string, { fetchedAt: number; event: Record<string, any> }>();

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' });

	const cached = cache.get(params.id);
	if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
		return buildData(cached.event);
	}

	let event: Record<string, any>;
	try {
		event = await pb.collection('events').getOne(params.id);
	} catch {
		try {
			event = await pb.collection('events').getFirstListItem(pb.filter('slug = {:slug}', { slug: params.id }));
		} catch {
			throw error(404, 'Event not found');
		}
	}

	cache.set(params.id, { fetchedAt: Date.now(), event });
	return buildData(event);
};

function buildData(event: Record<string, any>) {
	const dateLabel = event.date_time ? new Date(event.date_time).toLocaleDateString() : 'TBD';
	// Events answer on both the record id and the slug - point both at the slug
	// so the two URLs don't compete as duplicates.
	const path = `/events/${event.slug || event.id}`;
	return {
		event,
		title: event.name,
		description: `${event.name} - ${event.location || 'Connecticut FTC event'} on ${dateLabel}.`,
		image: `${path}/og.png`,
		imageAlt: `${event.name} - Connecticut FTC event`,
		canonical: path
	};
}
