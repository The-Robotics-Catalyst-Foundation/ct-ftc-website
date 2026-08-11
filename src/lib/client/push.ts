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
	await fetch('/admin/push/subscribe', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys })
	});
}

/** Explicit opt-in: requests Notification permission, then subscribes. */
export async function subscribeToPush(vapidPublicKey: string): Promise<'granted' | 'denied' | 'unsupported'> {
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
	await postSubscription(sub);
	return 'granted';
}

/** Silent re-sync for a device that already granted permission earlier - keeps
 *  the server's copy of the subscription current without prompting again. */
export async function syncPushSubscription(): Promise<void> {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
	if (Notification.permission !== 'granted') return;

	const registration = await navigator.serviceWorker.ready;
	const sub = await registration.pushManager.getSubscription();
	if (sub) await postSubscription(sub).catch(() => {});
}
