export function registerAdminServiceWorker(): void {
	if (!('serviceWorker' in navigator)) return;
	navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin/' }).catch((err) => {
		console.error('Admin service worker registration failed:', err);
	});
}

export function isStandalone(): boolean {
	return (
		window.matchMedia('(display-mode: standalone)').matches ||
		// iOS Safari has never implemented display-mode - this is its own flag
		// for "launched from a home screen icon" instead.
		(navigator as unknown as { standalone?: boolean }).standalone === true
	);
}

export function isIos(): boolean {
	return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
