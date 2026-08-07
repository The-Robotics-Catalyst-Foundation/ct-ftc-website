import { json, error } from '@sveltejs/kit';
import { Webhook } from 'svix';
import { env } from '$env/dynamic/private';
import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';

/**
 * Resend calls this whenever a tracked event fires on an email we sent
 * (opens, in particular). Configure the webhook URL in the Resend dashboard
 * as <your-domain>/api/webhooks/resend and set RESEND_WEBHOOK_SECRET to the
 * signing secret it gives you - without that secret this endpoint accepts
 * requests unverified, which is fine for initial testing but not for prod.
 */
export const POST: RequestHandler = async ({ request }) => {
	const secret = env.RESEND_WEBHOOK_SECRET;
	const payload = await request.text();

	let event: any;
	if (secret) {
		const svixId = request.headers.get('svix-id');
		const svixTimestamp = request.headers.get('svix-timestamp');
		const svixSignature = request.headers.get('svix-signature');
		if (!svixId || !svixTimestamp || !svixSignature) {
			throw error(400, 'Missing signature headers');
		}
		try {
			event = new Webhook(secret).verify(payload, {
				'svix-id': svixId,
				'svix-timestamp': svixTimestamp,
				'svix-signature': svixSignature
			});
		} catch {
			throw error(401, 'Invalid signature');
		}
	} else {
		event = JSON.parse(payload);
	}

	if (event?.type === 'email.opened') {
		const emailId = event.data?.email_id;
		if (emailId) {
			try {
				const record = await pb
					.collection('newsletter_sends')
					.getFirstListItem(pb.filter('resendIds ~ {:id}', { id: emailId }));
				await pb.collection('newsletter_sends').update(record.id, { 'openCount+': 1 });
			} catch {
				// No matching send record (or the collection doesn't exist yet) - ignore.
			}
		}
	}

	return json({ received: true });
};
