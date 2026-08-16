import { fail } from '@sveltejs/kit';
import { checkRateLimit } from '$lib/server/rate-limit';
import type { Actions } from './$types';

// Mechanically identical to /admin/forgot-password (PocketBase has one
// password-reset token type - there's no separate "create password" flow on
// its end), but shown to brand-new, just-verified users instead of people
// who forgot an existing password, so the copy fits that context instead.
export const actions: Actions = {
	default: async ({ request, locals, getClientAddress }) => {
		if (!checkRateLimit(`create-password:${getClientAddress()}`)) {
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
