import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

const CAN_VIEW = ['admin', 'event_manager'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, CAN_VIEW);
	const messages = await locals.pb.collection('contact').getFullList({ sort: '-created' });
	return { messages };
};

export const actions: Actions = {
	// Requires a `responded` bool field on the contact collection - dropped
	// silently by PocketBase until that field is added, safe to send either way.
	toggleResponded: async ({ request, locals }) => {
		requireRole(locals.user, CAN_VIEW);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing message id.' });

		const responded = form.get('responded') === '1';

		try {
			await locals.pb.collection('contact').update(id, { responded: !responded });
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to update message.' });
		}
	}
};
