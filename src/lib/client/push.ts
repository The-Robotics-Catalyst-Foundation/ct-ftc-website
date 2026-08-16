function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
	const padding = '='.repeat((4 - (base64.length % 4)) % 4);
	const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
	const raw = atob(b64);
	const bytes = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
	return bytes;
}

async function postSubscription(sub: PushSubscription): Promise<void> {
	const json = sub.toJSON();
	const res = await fetch('/admin/push/subscribe', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys })
	});
	if (!res.ok) {
		throw new Error(`Failed to save push subscription (${res.status})`);
	}
}

/** Explicit opt-in: requests Notification permission, then subscribes. */
export async function subscribeToPush(
	vapidPublicKey: string
): Promise<'granted' | 'denied' | 'unsupported' | 'error'> {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported';

	const permission = await Notification.requestPermission();
	if (permission !== 'granted') return 'denied';

	const registration = await navigator.serviceWorker.ready;
	let sub = await registration.pushManager.getSubscription();
	if (!sub) {
		sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
		});
	}

	try {
		await postSubscription(sub);
	} catch (err) {
		console.error('Failed to persist push subscription:', err);
		return 'error';
	}
	return 'granted';
}

/** Silent re-sync for a device that already granted permission earlier - keeps
 *  the server's copy of the subscription current without prompting again.
 *  Returns whether an active subscription actually exists, since browser
 *  permission staying "granted" after the user turns notifications off in
 *  Settings doesn't mean they're still subscribed. */
export async function syncPushSubscription(): Promise<boolean> {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
	if (Notification.permission !== 'granted') return false;

	const registration = await navigator.serviceWorker.ready;
	const sub = await registration.pushManager.getSubscription();
	if (!sub) return false;
	try {
		await postSubscription(sub);
	} catch (err) {
		console.error('Failed to re-sync push subscription:', err);
	}
	return true;
}

/** Explicit opt-out: browsers don't let a page revoke its own Notification
 * permission, so this removes the active subscription (both locally and
 * server-side) instead - no more pushes are sent even though the permission
 * itself stays "granted" until the user changes it in browser settings. */
export async function unsubscribeFromPush(): Promise<void> {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

	const registration = await navigator.serviceWorker.ready;
	const sub = await registration.pushManager.getSubscription();
	if (!sub) return;

	const endpoint = sub.endpoint;
	await sub.unsubscribe();

	try {
		await fetch('/admin/push/subscribe', {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ endpoint })
		});
	} catch (err) {
		console.error('Failed to remove push subscription from the server:', err);
	}
}
