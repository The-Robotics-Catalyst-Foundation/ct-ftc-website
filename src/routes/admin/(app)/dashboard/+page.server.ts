import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [upcoming, past, subscribers, sends] = await Promise.all([
		locals.pb.collection('events').getList(1, 1, { filter: 'date_time >= @now', requestKey: 'dashboard-upcoming' }),
		locals.pb.collection('events').getList(1, 1, { filter: 'date_time < @now', requestKey: 'dashboard-past' }),
		locals.pb
			.collection('volunteer_newsletter')
			.getList(1, 1, { requestKey: 'dashboard-subs' })
			.catch(() => null),
		// Requires the newsletter_sends collection (see the newsletter send
		// action) - quietly falls back to empty if it doesn't exist yet.
		locals.pb
			.collection('newsletter_sends')
			.getFullList({ sort: '-sentAt', requestKey: 'dashboard-sends' })
			.catch(() => [] as any[])
	]);

	const lastSend = sends[0] ?? null;
	const totalOpens = sends.reduce((sum, s) => sum + (Number(s.openCount) || 0), 0);
	const totalRecipients = sends.reduce((sum, s) => sum + (Number(s.recipientCount) || 0), 0);

	return {
		upcomingCount: upcoming.totalItems,
		pastCount: past.totalItems,
		subscriberCount: subscribers?.totalItems ?? 0,
		lastSend: lastSend
			? {
					sentAt: lastSend.sentAt as string,
					recipientCount: (lastSend.recipientCount as number) ?? 0,
					openCount: (lastSend.openCount as number) ?? 0
				}
			: null,
		sendCount: sends.length,
		totalOpens,
		totalRecipients
	};
};
