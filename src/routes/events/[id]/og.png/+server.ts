import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { renderEventOgImage } from '$lib/server/og/render';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
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

	const png = await renderEventOgImage(event);

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
		}
	});
};
