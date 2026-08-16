// Service worker for the /admin PWA. Deliberately minimal - this app is
// almost always online when in use, so there's no offline cache strategy
// here, just what's needed for installability and Web Push delivery.

self.addEventListener('install', (event) => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

// No caching - just let every request go to the network as normal. A fetch
// handler still needs to exist for some browsers' installability checks.
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
	let payload = { title: 'CT FTC Admin', body: 'You have a new notification.', url: '/admin/messages' };
	if (event.data) {
		try {
			payload = { ...payload, ...event.data.json() };
		} catch {
			payload.body = event.data.text();
		}
	}

	event.waitUntil(
		self.registration.showNotification(payload.title, {
			body: payload.body,
			icon: '/logo.png',
			badge: '/logo.png',
			data: { url: payload.url },
			// Unsupported platforms (e.g. iOS Safari) just ignore this and fall
			// back to the notification itself being fully clickable, per the
			// notificationclick handler below.
			actions: [{ action: 'view', title: 'View in CTFTC' }]
		})
	);
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	const url = event.notification.data?.url || '/admin/messages';

	event.waitUntil(
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
			for (const client of clients) {
				if (client.url.includes(url) && 'focus' in client) return client.focus();
			}
			for (const client of clients) {
				if ('navigate' in client && 'focus' in client) return client.focus().then(() => client.navigate(url));
			}
			if (self.clients.openWindow) return self.clients.openWindow(url);
		})
	);
});
