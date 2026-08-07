import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import { sendBulkEmail } from '$lib/server/email';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;

const DEFAULT_TEMPLATE =
	'Hello Volunteers, an event {Event Name} is 2 weeks away at {Location} on {Date}. Sign up here: {Event Link}';

export const load: PageServerLoad = async ({ locals, url }) => {
	requireRole(locals.user, CAN_MANAGE);

	const [subscribers, events] = await Promise.all([
		locals.pb.collection('volunteer_newsletter').getList(1, 1),
		locals.pb.collection('events').getFullList({ filter: 'date_time >= @now', sort: 'date_time' })
	]);

	return {
		subscriberCount: subscribers.totalItems,
		events: events.map((e) => ({
			id: e.id,
			name: e.name as string,
			location: e.location as string,
			date_time: e.date_time as string,
			slug: e.slug as string
		})),
		defaultTemplate: DEFAULT_TEMPLATE,
		origin: url.origin
	};
};

export const actions: Actions = {
	send: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const message = String(form.get('message') ?? '').trim();
		if (!message) return fail(400, { error: 'Write a message first.' });

		const subscribers = await locals.pb.collection('volunteer_newsletter').getFullList();
		const recipients = subscribers.map((s) => s.email as string).filter(Boolean);

		if (!recipients.length) return fail(400, { error: 'There are no subscribers yet.' });

		let resendIds: string[];
		try {
			resendIds = await sendBulkEmail({ subject: 'CT FTC Volunteer Update', text: message, recipients });
		} catch (err: any) {
			return fail(500, { error: err?.message ?? 'Failed to send the broadcast.' });
		}

		// Log the send so the dashboard can show "last sent" + open analytics.
		// Requires a `newsletter_sends` collection (sentAt: date, recipientCount:
		// number, message: text, resendIds: json, openCount: number) - if it
		// doesn't exist yet this just quietly skips logging, the send itself
		// already succeeded above.
		try {
			await locals.pb.collection('newsletter_sends').create({
				sentAt: new Date().toISOString(),
				recipientCount: recipients.length,
				message,
				resendIds,
				openCount: 0
			});
		} catch (err) {
			console.error('Failed to log newsletter send (does the newsletter_sends collection exist?):', err);
		}

		return { success: true, sentCount: recipients.length };
	}
};
