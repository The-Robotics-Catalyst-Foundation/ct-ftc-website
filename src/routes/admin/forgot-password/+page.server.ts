import { fail } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/server/rate-limit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals, getClientAddress }) => {
		if (!checkRateLimit(`forgot-password:${getClientAddress()}`)) {
			return fail(429, { error: 'Too many attempts. Please wait a few minutes and try again.' });
		}

		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		if (!email) return fail(400, { error: 'Email is required.' });

		// Always report success regardless of whether the email exists or the
		// send failed - this is a public form, so it must not reveal which
		// email addresses have accounts.
		try {
			await locals.pb.collection('users').requestPasswordReset(email);
		} catch {
			// ignore
		}

		return { success: true };
	}
};
