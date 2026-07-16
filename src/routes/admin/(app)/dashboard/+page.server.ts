import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [upcoming, past] = await Promise.all([
		locals.pb.collection('events').getList(1, 1, { filter: 'date_time >= @now', requestKey: 'dashboard-upcoming' }),
		locals.pb.collection('events').getList(1, 1, { filter: 'date_time < @now', requestKey: 'dashboard-past' })
	]);

	return {
		upcomingCount: upcoming.totalItems,
		pastCount: past.totalItems
	};
};
