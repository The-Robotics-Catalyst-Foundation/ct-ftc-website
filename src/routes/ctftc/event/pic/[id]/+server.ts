import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { decodePicToken } from '$lib/server/photo-proxy';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	let token: { e: string; f: string };
	try {
		token = decodePicToken(params.id);
	} catch {
		throw error(400, 'Invalid photo reference');
	}

	const record = await pb
		.collection('events')
		.getOne(token.e)
		.catch(() => null);
	if (!record) throw error(404, 'Not found');

	const thumb = url.searchParams.get('thumb') ?? undefined;
	const realUrl = pb.files.getURL(record, token.f, thumb ? { thumb } : undefined);

	const upstream = await fetch(realUrl);
	if (!upstream.ok || !upstream.body) throw error(404, 'Not found');

	return new Response(upstream.body, {
		headers: {
			'Content-Type': upstream.headers.get('content-type') || 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
