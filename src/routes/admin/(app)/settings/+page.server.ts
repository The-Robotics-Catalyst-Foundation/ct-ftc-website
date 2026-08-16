import { redirect, fail } from '@sveltejs/kit';
import { pbErrorMessage } from '$lib/server/pb-error';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/admin/events');
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { error: 'Not signed in.' });

		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const avatar = form.get('avatar');

		const payload = new FormData();
		if (name) payload.append('name', name);
		if (avatar instanceof File && avatar.size > 0) payload.append('avatar', avatar);
		// Checkbox - present in the form data only when checked, so its
		// absence means the user turned visibility off.
		payload.append('emailVisibility', form.has('emailVisibility') ? 'true' : 'false');

		try {
			await locals.pb.collection('users').update(locals.user.id, payload);
		} catch (err: any) {
			return fail(400, { error: pbErrorMessage(err, 'Failed to update profile.') });
		}

		return { success: true };
	},

	deleteAccount: async ({ locals }) => {
		if (!locals.user) return fail(401, { error: 'Not signed in.' });

		try {
			await locals.pb.collection('users').delete(locals.user.id);
		} catch (err: any) {
			return fail(400, { error: pbErrorMessage(err, 'Failed to delete account.') });
		}

		locals.pb.authStore.clear();
		throw redirect(303, '/admin');
	}
};
