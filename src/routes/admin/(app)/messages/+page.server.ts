import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import { sendBulkEmail } from '$lib/server/email';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, CAN_MANAGE);
	const messages = await locals.pb.collection('contact').getFullList({ sort: '-created' });
	return { messages };
};

export const actions: Actions = {
	setResponded: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const responded = form.get('responded') === '1';
		if (!id) return fail(400, { error: 'Missing message id.' });

		try {
			await locals.pb.collection('contact').update(id, { responded });
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to update message.' });
		}
	},

	reply: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const to = String(form.get('to') ?? '').trim();
		const replyBody = String(form.get('reply') ?? '').trim();
		if (!id || !to) return fail(400, { error: 'Missing message id or recipient.' });
		if (!replyBody) return fail(400, { error: 'Write a reply first.' });

		try {
			await sendBulkEmail({
				subject: 'Re: Your message to CT FTC',
				text: replyBody,
				recipients: [to]
			});
			await locals.pb.collection('contact').update(id, { responded: true });
		} catch (err: any) {
			return fail(500, { error: err?.message ?? 'Failed to send reply.' });
		}

		return { success: true };
	}
};
