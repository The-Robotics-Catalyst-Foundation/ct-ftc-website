import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/admin/dashboard');
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

		if (![...payload.keys()].length) {
			return fail(400, { error: 'Nothing to update.' });
		}

		try {
			await locals.pb.collection('users').update(locals.user.id, payload);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to update profile.' });
		}

		return { success: true };
	}
};
