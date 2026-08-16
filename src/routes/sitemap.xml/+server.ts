import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';

const STATIC_PATHS = ['/', '/events', '/teams', '/volunteer', '/contact', '/faq'];

// `slug` is admin-controlled free text (the event code, e.g. "USCTCMP") with
// no character restrictions - escape it before it lands in this public,
// unauthenticated XML response.
function escapeXml(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

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
			`  <url><loc>${escapeXml(origin + path)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''}</url>`
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
