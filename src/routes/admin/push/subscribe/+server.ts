import { json, error } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// Only the 'admin' role gets pushed contact-message notifications (mirrors
// the recipient list the email notification already uses), so subscribing
// from any other role would just create a subscription nothing ever sends to.
const CAN_SUBSCRIBE = ['admin'] as const;

export const POST: RequestHandler = async ({ request, locals }) => {
	requireRole(locals.user, CAN_SUBSCRIBE);

	const body = await request.json().catch(() => null);
	const endpoint = body?.endpoint as string | undefined;
	const p256dh = body?.keys?.p256dh as string | undefined;
	const auth = body?.keys?.auth as string | undefined;

	if (!endpoint || !p256dh || !auth) {
		throw error(400, 'Invalid push subscription.');
	}

	try {
		const existing = await locals.pb
			.collection('push_subscriptions')
			.getFirstListItem(locals.pb.filter('endpoint = {:endpoint}', { endpoint }))
			.catch(() => null);

		if (existing) {
			await locals.pb.collection('push_subscriptions').update(existing.id, { p256dh, auth });
		} else {
			await locals.pb.collection('push_subscriptions').create({
				user: locals.user!.id,
				endpoint,
				p256dh,
				auth
			});
		}
	} catch (err: any) {
		throw error(500, err?.message ?? 'Failed to save push subscription.');
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	requireRole(locals.user, CAN_SUBSCRIBE);

	const body = await request.json().catch(() => null);
	const endpoint = body?.endpoint as string | undefined;
	if (!endpoint) throw error(400, 'Missing endpoint.');

	try {
		const existing = await locals.pb
			.collection('push_subscriptions')
			.getFirstListItem(locals.pb.filter('endpoint = {:endpoint}', { endpoint }))
			.catch(() => null);
		if (existing) await locals.pb.collection('push_subscriptions').delete(existing.id);
	} catch (err: any) {
		throw error(500, err?.message ?? 'Failed to remove push subscription.');
	}

	return json({ success: true });
};
