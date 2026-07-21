import PocketBase from 'pocketbase';
import { dev } from '$app/environment';
import { PB_URL } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';

const AUTH_COOKIE_KEY = 'pb_auth';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase(PB_URL);
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '', AUTH_COOKIE_KEY);

	// Only spend a round-trip re-validating the session on requests that
	// actually carry one - public pages never touch PocketBase here.
	if (pb.authStore.isValid) {
		try {
			await pb.collection('users').authRefresh();
		} catch {
			pb.authStore.clear();
		}
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.record;

	const response = await resolve(event);

	// Re-issue the cookie so a refreshed token (or a cleared/invalid one) is
	// persisted. Scoped to /admin so the session token is never sent on
	// public-site requests. httpOnly + secure + sameSite=strict are the
	// library defaults - this cookie is unreadable by any client-side JS,
	// which is what actually stops XSS from being able to steal the session.
	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({ secure: !dev, path: '/admin' }, AUTH_COOKIE_KEY)
	);

	return response;
};
