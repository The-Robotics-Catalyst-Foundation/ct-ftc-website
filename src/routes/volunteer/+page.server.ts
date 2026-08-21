import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';
import { checkRateLimit } from '$lib/server/rate-limit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const load: PageServerLoad = async () => {
	let events: { id: string; name: string; location: string; date_time: string; volunteerLink: string }[] = [];

	try {
		const records = await pb.collection('events').getFullList({
			filter: 'date_time >= @now',
		sort: 'date_time'
		});
		events = records.map((record) => ({
			id: record.id,
			name: record.name || 'Untitled Event',
			location: record.location || 'Location TBD',
			date_time: record.date_time || '',
			volunteerLink: record.volunteer_link || ''
		}));
	} catch (err) {
		console.error('Failed to load upcoming events for the volunteer carousel:', err);
	}

	return {
		events,
		title: 'Volunteer Opportunities',
		description:
			'Volunteer at Connecticut FIRST Tech Challenge events - referee, judge, inspector, or event support. No robotics experience needed, training provided.'
	};
};

export const actions: Actions = {
	subscribe: async ({ request, getClientAddress }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();

		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid email address.' });
		}

		if (!checkRateLimit(`newsletter:${getClientAddress()}`)) {
			return fail(429, { error: 'Too many attempts. Please wait a few minutes and try again.' });
		}

		try {
			await pb.collection('volunteer_newsletter').create({ email });
		} catch (err: any) {
			// Someone subscribing twice with the same address hits PocketBase's
			// unique-field validation - treat that as a success too, since the
			// visitor's intent (being on the list) is already satisfied.
			if (err?.response?.data?.email?.code === 'validation_not_unique') {
				return { success: true };
			}
			return fail(400, { error: err?.message ?? 'Could not subscribe right now.' });
		}

		return { success: true };
	}
};
