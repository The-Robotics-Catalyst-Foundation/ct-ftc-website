import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import { getCtEvents } from '$lib/server/ftc-events';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;

// Must match the PocketBase `events.type` select field's options exactly
// (lowercase) - PocketBase rejects any value not in that list.
function mapEventType(typeName: string): string {
	const name = typeName.toLowerCase();
	if (name.includes('championship')) return 'championship';
	if (name.includes('qualifier')) return 'qualifier';
	return 'scrimmage';
}

export const load: PageServerLoad = async ({ locals }) => {
	const events = await locals.pb.collection('events').getFullList({ sort: '-date_time' });
	return { events };
};

function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function randomSlug(): string {
	return crypto.randomUUID().slice(0, 8);
}

function describeError(err: any): string {
	const message = err?.response?.message || err?.message || 'Unknown error';
	const data = err?.response?.data;
	if (data && typeof data === 'object' && Object.keys(data).length) {
		const fieldMessages = Object.entries(data)
			.map(([field, info]: [string, any]) => `${field}: ${info?.message ?? JSON.stringify(info)}`)
			.join('; ');
		return `${message} (${fieldMessages})`;
	}
	return message;
}

function eventFormData(form: FormData) {
	const out = new FormData();
	out.append('name', String(form.get('name') ?? ''));
	out.append('type', String(form.get('type') ?? 'scrimmage'));
	out.append('location', String(form.get('location') ?? ''));

	const dateTime = String(form.get('date_time') ?? '');
	if (dateTime) out.append('date_time', new Date(dateTime).toISOString());

	out.append('volunteersNeeded', String(Number(form.get('volunteersNeeded') ?? 0)));

	const pdf = form.get('event_pdf');
	if (pdf instanceof File && pdf.size > 0) out.append('event_pdf', pdf);

	out.append('imgLink', String(form.get('imgLink') ?? ''));

	const eventCode = String(form.get('eventCode') ?? '').trim();
	out.append('eventCode', eventCode);
	out.append('slug', eventCode ? slugify(eventCode) : randomSlug());

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

	importSeason: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const season = Number(form.get('season'));
		if (!season || season < 2000) return fail(400, { error: 'Enter a valid season year.' });

		let ftcEvents;
		try {
			ftcEvents = await getCtEvents(season);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to fetch events from the FTC Events API.' });
		}

		let imported = 0;
		const errors: string[] = [];
		for (const ev of ftcEvents) {
			try {
				await locals.pb.collection('events').create({
					name: ev.name,
					type: mapEventType(ev.typeName),
					location: [ev.venue, ev.city, ev.stateprov].filter(Boolean).join(', '),
					date_time: ev.dateStart ? new Date(ev.dateStart).toISOString() : undefined,
					volunteersNeeded: 0,
					eventCode: ev.code,
					slug: slugify(ev.code)
				});
				imported += 1;
			} catch (err: any) {
				errors.push(`${ev.code} (${ev.name}): ${describeError(err)}`);
			}
		}

		return { imported, total: ftcEvents.length, errors };
	}
};
