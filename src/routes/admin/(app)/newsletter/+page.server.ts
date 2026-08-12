import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import { sendBulkEmail } from '$lib/server/email';
import { NEWSLETTER_TEMPLATES, getTemplate, composeMessage } from '$lib/server/newsletter-templates';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;

const DEFAULT_TEMPLATE =
	'An event {Event Name} is {Time Until} away at {Location} on {Date}. Sign up here: {Event Link}';

function formatDate(value: string) {
	if (!value) return 'Date TBD';
	return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export const load: PageServerLoad = async ({ locals, url }) => {
	requireRole(locals.user, CAN_MANAGE);

	const [subscribers, events] = await Promise.all([
		locals.pb.collection('volunteer_newsletter').getFullList({ sort: '-created' }),
		locals.pb.collection('events').getFullList({ filter: 'date_time >= @now', sort: 'date_time' })
	]);

	return {
		subscriberCount: subscribers.length,
		subscribers: subscribers.map((s) => ({
			id: s.id,
			email: s.email as string,
			created: s.created as string
		})),
		events: events.map((e) => ({
			id: e.id,
			name: e.name as string,
			location: e.location as string,
			date_time: e.date_time as string,
			slug: e.slug as string
		})),
		templates: NEWSLETTER_TEMPLATES.map((t) => ({ id: t.id, name: t.name, description: t.description })),
		defaultTemplate: DEFAULT_TEMPLATE,
		origin: url.origin
	};
};

export const actions: Actions = {
	send: async ({ request, locals, url }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const message = String(form.get('message') ?? '').trim();
		const templateId = String(form.get('template') ?? 'simple');
		const eventId = String(form.get('eventId') ?? '');
		if (!message) return fail(400, { error: 'Write a message first.' });

		const subscribers = await locals.pb.collection('volunteer_newsletter').getFullList();
		const recipients = subscribers.map((s) => s.email as string).filter(Boolean);

		if (!recipients.length) return fail(400, { error: 'There are no subscribers yet.' });

		let eventInfo = null;
		if (eventId) {
			try {
				const record = await locals.pb.collection('events').getOne(eventId);
				eventInfo = {
					name: record.name as string,
					location: (record.location as string) || '',
					dateLabel: formatDate(record.date_time as string),
					link: `${url.origin}/events/${(record.slug as string) || record.id}`
				};
			} catch {
				// Event may have been deleted between page load and send - fall
				// back to a template with no event card rather than failing the send.
			}
		}

		const fullMessage = composeMessage(message);
		const template = getTemplate(templateId);
		const { subject, html } = template.render({ message: fullMessage, event: eventInfo, origin: url.origin });

		let resendIds: string[];
		try {
			resendIds = await sendBulkEmail({ subject, text: fullMessage, html, recipients });
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
				message: fullMessage,
				resendIds,
				openCount: 0
			});
		} catch (err) {
			console.error('Failed to log newsletter send (does the newsletter_sends collection exist?):', err);
		}

		return { success: true, sentCount: recipients.length };
	}
};
