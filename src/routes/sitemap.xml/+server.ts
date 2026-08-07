import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';

const STATIC_PATHS = ['/', '/events', '/teams', '/volunteer', '/contact', '/faq'];

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;

	let eventPaths: string[] = [];
	try {
		const events = await pb.collection('events').getFullList({ fields: 'id,slug' });
		eventPaths = events.map((e) => `/events/${e.slug || e.id}`);
	} catch (err) {
		console.error('Failed to load events for sitemap:', err);
	}

	const urls = [...STATIC_PATHS, ...eventPaths];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
