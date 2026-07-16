import { fail, redirect } from '@sveltejs/kit';
import { roleOf } from '$lib/server/auth';
import { checkRateLimit } from '$lib/server/rate-limit';
import type { PageServerLoad, Actions } from './$types';

const OAUTH_ERRORS: Record<string, string> = {
	no_account: 'No dashboard account is associated with that Google account. Contact an administrator.',
	state_mismatch: 'Your sign-in session expired. Please try again.',
	oauth_failed: 'Google sign-in failed. Please try again.'
};

export const load: PageServerLoad = async ({ locals, url }) => {
	if (roleOf(locals.user)) throw redirect(303, '/admin/dashboard');

	const code = url.searchParams.get('error');
	return { oauthError: code ? (OAUTH_ERRORS[code] ?? 'Sign-in failed. Please try again.') : null };
};

export const actions: Actions = {
	default: async ({ request, locals, getClientAddress }) => {
		if (!checkRateLimit(`login:${getClientAddress()}`)) {
			return fail(429, { error: 'Too many attempts. Please wait a few minutes and try again.' });
		}

		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		try {
			const { record } = await locals.pb.collection('users').authWithPassword(email, password);

			if (!roleOf(record)) {
				locals.pb.authStore.clear();
				return fail(403, { error: 'This account does not have dashboard access.' });
			}
		} catch {
			return fail(400, { error: 'Invalid email or password.' });
		}

		throw redirect(303, '/admin/dashboard');
	}
};
