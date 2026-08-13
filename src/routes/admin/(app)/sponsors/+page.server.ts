import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	const sponsors = await locals.pb.collection('sponsors').getFullList({ sort: 'Name' });
	return { sponsors };
};

function sponsorFormData(form: FormData) {
	const out = new FormData();
	out.append('Name', String(form.get('Name') ?? ''));
	out.append('Website', String(form.get('Website') ?? ''));

	const logo = form.get('Logo');
	if (logo instanceof File && logo.size > 0) out.append('Logo', logo);

	return out;
}

export const actions: Actions = {
	createSponsor: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();

		if (!String(form.get('Name') ?? '').trim()) {
			return fail(400, { error: 'Sponsor name is required.' });
		}

		const logo = form.get('Logo');
		if (!(logo instanceof File) || logo.size === 0) {
			return fail(400, { error: 'A logo image is required.' });
		}

		try {
			await locals.pb.collection('sponsors').create(sponsorFormData(form));
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to create sponsor.' });
		}
	},

	deleteSponsor: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing sponsor id.' });

		try {
			await locals.pb.collection('sponsors').delete(id);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to delete sponsor.' });
		}
	}
};
