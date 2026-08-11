import { json } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import { getTemplate } from '$lib/server/newsletter-templates';
import type { RequestHandler } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;

function formatDate(value: string) {
	if (!value) return 'Date TBD';
	return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export const POST: RequestHandler = async ({ request, locals, url }) => {
	requireRole(locals.user, CAN_MANAGE);
	const body = await request.json();
	const message = String(body.message ?? '').trim() || 'Your message will appear here.';
	const templateId = String(body.template ?? 'simple');
	const eventId = String(body.eventId ?? '');

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
			// Event may not exist (yet, or anymore) - preview without the event card.
		}
	}

	const { html } = getTemplate(templateId).render({ message, event: eventInfo, origin: url.origin });
	return json({ html });
};
