import webpush from 'web-push';
import PocketBase from 'pocketbase';
import {
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY,
	VAPID_SUBJECT,
	PB_ADMIN_EMAIL,
	PB_ADMIN_PASSWORD
} from '$env/static/private';
import { PB_URL } from '$lib/pocketbase';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

interface PushSubscriptionRecord {
	id: string;
	endpoint: string;
	p256dh: string;
	auth: string;
	expand?: { user?: { authLevel?: string } };
}

// Reading every admin's push subscriptions is a privileged, cross-user query -
// the public contact form that triggers it has no logged-in session, so this
// needs its own superuser-authenticated client rather than the request-scoped
// or anonymous one.
let superuserAuth: Promise<PocketBase> | null = null;
function getSuperuserPb(): Promise<PocketBase> {
	if (!superuserAuth) {
		const client = new PocketBase(PB_URL);
		superuserAuth = client
			.collection('_superusers')
			.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD)
			.then(() => client)
			.catch((err) => {
				superuserAuth = null;
				throw err;
			});
	}
	return superuserAuth;
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
		const pb = await getSuperuserPb();
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
