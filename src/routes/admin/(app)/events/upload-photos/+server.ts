import { json } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import { pbErrorMessage } from '$lib/server/pb-error';
import type { RequestHandler } from './$types';

const CAN_UPLOAD = ['admin', 'event_manager', 'photographer'] as const;

// Bulk photo uploads (200+ files) are split into batches on the client and
// posted here one batch at a time, rather than as one giant multipart
// request - keeps each request well under BODY_SIZE_LIMIT and lets the
// admin see progress instead of one long request that either fully succeeds
// or fully times out.
export const POST: RequestHandler = async ({ request, locals }) => {
	requireRole(locals.user, CAN_UPLOAD);
	const form = await request.formData();
	const id = String(form.get('id') ?? '');
	if (!id) return json({ error: 'Missing event id.' }, { status: 400 });

	const files = form.getAll('pics').filter((f): f is File => f instanceof File && f.size > 0);
	if (!files.length) return json({ error: 'No photos in this batch.' }, { status: 400 });

	// Only ever forwards the pics field, appended (never replaced), so this
	// request can never touch any other event field even if tampered with.
	const out = new FormData();
	for (const file of files) out.append('pics+', file);

	try {
		await locals.pb.collection('events').update(id, out);
	} catch (err: any) {
		return json({ error: pbErrorMessage(err, 'Failed to upload this batch.') }, { status: 400 });
	}

	return json({ success: true, uploaded: files.length });
};
