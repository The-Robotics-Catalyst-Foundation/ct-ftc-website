import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;
const CAN_UPLOAD = ['admin', 'event_manager', 'photographer'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	const events = await locals.pb.collection('events').getFullList({ sort: '-date_time' });
	return { events };
};

function eventFormData(form: FormData) {
	const out = new FormData();
	out.append('name', String(form.get('name') ?? ''));
	out.append('location', String(form.get('location') ?? ''));

	const dateTime = String(form.get('date_time') ?? '');
	if (dateTime) out.append('date_time', new Date(dateTime).toISOString());

	out.append('volunteersAttending', String(Number(form.get('volunteersAttending') ?? 0)));
	out.append('volunteersNeeded', String(Number(form.get('volunteersNeeded') ?? 0)));

	const pdf = form.get('event_pdf');
	if (pdf instanceof File && pdf.size > 0) out.append('event_pdf', pdf);

	return out;
}

export const actions: Actions = {
	createEvent: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();

		if (!String(form.get('name') ?? '').trim()) {
			return fail(400, { error: 'Event name is required.' });
		}

		try {
			await locals.pb.collection('events').create(eventFormData(form));
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to create event.' });
		}
	},

	updateEvent: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing event id.' });

		try {
			await locals.pb.collection('events').update(id, eventFormData(form));
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to update event.' });
		}
	},

	deleteEvent: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing event id.' });

		try {
			await locals.pb.collection('events').delete(id);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to delete event.' });
		}
	},

	uploadPhotos: async ({ request, locals }) => {
		requireRole(locals.user, CAN_UPLOAD);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing event id.' });

		const files = form.getAll('pics').filter((f): f is File => f instanceof File && f.size > 0);
		if (!files.length) return fail(400, { error: 'Select at least one photo.' });

		// Only ever forwards the pics field, appended (never replaced), so a
		// photographer's request can never touch any other event field even
		// if the submitted form is tampered with.
		const out = new FormData();
		for (const file of files) out.append('pics+', file);

		try {
			await locals.pb.collection('events').update(id, out);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to upload photos.' });
		}
	}
};
