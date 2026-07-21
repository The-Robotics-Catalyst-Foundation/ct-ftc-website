import type { RequestHandler } from './$types';

const STATIC_ROUTES = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/events', priority: '0.9', changefreq: 'daily' },
	{ path: '/teams', priority: '0.7', changefreq: 'weekly' },
	{ path: '/volunteer', priority: '0.7', changefreq: 'monthly' },
	{ path: '/contact', priority: '0.5', changefreq: 'monthly' }
];

function escapeXml(value: string) {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const urls = STATIC_ROUTES.map(
		(route) =>
			`<url><loc>${escapeXml(url.origin + route.path)}</loc><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`
	);

	try {
		const events = await locals.pb.collection('events').getFullList({ fields: 'id,slug,updated' });
		for (const event of events) {
			const loc = escapeXml(`${url.origin}/events/${event.slug || event.id}`);
			urls.push(`<url><loc>${loc}</loc><lastmod>${new Date(event.updated).toISOString()}</lastmod><priority>0.6</priority></url>`);
		}
	} catch {
		// Sitemap still works with just the static routes if PocketBase is unreachable.
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
