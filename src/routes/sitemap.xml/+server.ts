import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';

const STATIC_PATHS = ['/', '/events', '/teams', '/volunteer', '/contact', '/faq'];

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;

	let entries: { path: string; lastmod?: string }[] = STATIC_PATHS.map((path) => ({ path }));

	try {
		const events = await pb.collection('events').getFullList({ fields: 'id,slug,updated' });
		entries = entries.concat(
			events.map((e) => ({
				path: `/events/${e.slug || e.id}`,
				lastmod: e.updated ? new Date(e.updated).toISOString() : undefined
			}))
		);
	} catch (err) {
		console.error('Failed to load events for sitemap:', err);
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		({ path, lastmod }) =>
			`  <url><loc>${origin}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
