import { fail } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return { token: url.searchParams.get('token') ?? '' };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const token = String(form.get('token') ?? '');
		const password = String(form.get('password') ?? '');
		const passwordConfirm = String(form.get('passwordConfirm') ?? '');

		if (!token) return fail(400, { error: 'Missing or expired invite link.' });
		if (password.length < 8) return fail(400, { error: 'Password must be at least 8 characters.' });
		if (password !== passwordConfirm) return fail(400, { error: 'Passwords do not match.' });

		try {
			await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'This invite link is invalid or has expired.' });
		}

		return { success: true };
	}
};
