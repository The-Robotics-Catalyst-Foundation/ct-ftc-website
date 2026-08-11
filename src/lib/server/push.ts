import webpush from 'web-push';
import { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } from '$env/static/private';
import { pb } from '$lib/pocketbase';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

interface PushSubscriptionRecord {
	id: string;
	endpoint: string;
	p256dh: string;
	auth: string;
	expand?: { user?: { authLevel?: string } };
}

/**
 * Push a notification to every subscribed admin. Best-effort and run from the
 * unauthenticated public contact-form path, so a dead subscription (browser
 * revoked it, user cleared site data, ...) is just logged and skipped rather
 * than deleted here - it self-heals next time that admin's device resubscribes
 * (see admin/push/subscribe, which upserts by endpoint).
 */
export async function notifyAdmins(payload: { title: string; body: string; url?: string }): Promise<void> {
	let subs: PushSubscriptionRecord[];
	try {
		subs = await pb.collection('push_subscriptions').getFullList<PushSubscriptionRecord>({
			filter: "user.authLevel = 'admin'",
			expand: 'user'
		});
	} catch (err) {
		// Collection may not exist yet in this PocketBase instance - push is an
		// enhancement on top of the email notification, never a hard dependency.
		console.error('Could not load push subscriptions:', err);
		return;
	}

	await Promise.all(
		subs.map(async (sub) => {
			try {
				await webpush.sendNotification(
					{
						endpoint: sub.endpoint,
						keys: { p256dh: sub.p256dh, auth: sub.auth }
					},
					JSON.stringify(payload)
				);
			} catch (err: any) {
				console.error('Failed to send push notification:', err?.statusCode ?? '', err?.message ?? err);
			}
		})
	);
}
