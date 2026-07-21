import { redirect } from '@sveltejs/kit';
import { roleOf } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import type { AuthRecord } from 'pocketbase';

const STATE_COOKIE = 'pb_oauth_state';

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const raw = cookies.get(STATE_COOKIE);
	cookies.delete(STATE_COOKIE, { path: '/admin/login/google' });

	if (!code || !state || !raw) throw redirect(303, '/admin?error=oauth_failed');

	let stored: { state: string; codeVerifier: string };
	try {
		stored = JSON.parse(raw);
	} catch {
		throw redirect(303, '/admin?error=oauth_failed');
	}

	if (stored.state !== state) throw redirect(303, '/admin?error=state_mismatch');

	// This is the same URI passed to Google when the flow was initiated in
	// login/google/+server.ts - it must match exactly for the code exchange
	// to succeed.
	const redirectUrl = `${url.origin}/admin/login/google/callback`;

	let record: AuthRecord;
	try {
		({ record } = await locals.pb
			.collection('users')
			.authWithOAuth2Code('google', code, stored.codeVerifier, redirectUrl));
	} catch {
		// Covers both a failed Google exchange and PocketBase refusing to
		// auto-create an account for an unrecognized email (the users
		// collection's createRule is admin-only, so unknown Google accounts
		// are rejected here rather than silently signing themselves up).
		throw redirect(303, '/admin?error=no_account');
	}

	if (!roleOf(record)) {
		// A record exists but has no assigned role - deny access without
		// touching the record itself (an admin may still need to configure it).
		locals.pb.authStore.clear();
		throw redirect(303, '/admin?error=no_account');
	}

	throw redirect(303, '/admin/dashboard');
};
