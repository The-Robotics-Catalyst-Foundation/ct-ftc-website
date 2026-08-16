import http from 'node:http';
import { handler } from './build/handler.js';

// adapter-node only sets long-lived Cache-Control on hashed /_app/immutable/
// build output - everything copied verbatim from static/ (logos, icons,
// favicons) gets served with no caching at all. These are unhashed, so if
// one of them is ever replaced, bump its filename (or add a ?v= query
// string in the referencing markup) rather than shortening this further.
const CACHEABLE_STATIC = /\.(png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf)$/i;
const STATIC_CACHE_CONTROL = 'public, max-age=2592000, stale-while-revalidate=86400';

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url && CACHEABLE_STATIC.test(req.url.split('?')[0])) {
		res.setHeader('Cache-Control', STATIC_CACHE_CONTROL);
	}

	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not found');
	});
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
