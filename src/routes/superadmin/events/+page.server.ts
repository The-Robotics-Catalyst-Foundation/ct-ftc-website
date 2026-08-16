import {
	getCtEventsDetailed,
	getSeasonInfo,
	getVolunteerSearchInfoForEvents
} from '$lib/server/ftc-events';
import type { PageServerLoad } from './$types';

// Matches the season-labeling convention used everywhere else in the app
// (src/lib/server/ftc-events.ts, the admin events importer, robolyst.ts):
// a season is named for the year it kicks off in every August.
function currentSeason(): number {
	const now = new Date();
	return now.getUTCMonth() + 1 >= 8 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

export const load: PageServerLoad = async () => {
	const season = currentSeason();

	let events: Awaited<ReturnType<typeof getCtEventsDetailed>> = [];
	let seasonEventCount: number | null = null;
	let error = '';
	try {
		[events, { eventCount: seasonEventCount }] = await Promise.all([
			getCtEventsDetailed(season),
			getSeasonInfo(season)
		]);
	} catch (err: any) {
		error = err?.message ?? 'Failed to fetch events from the FTC Events API.';
	}

	const now = Date.now();
	const upcoming = events
		.filter((e) => !e.dateEnd || new Date(e.dateEnd).getTime() >= now)
		.sort((a, b) => new Date(a.dateStart || 0).getTime() - new Date(b.dateStart || 0).getTime());

	const volunteerInfo = await getVolunteerSearchInfoForEvents(upcoming, season);
	const eventsWithVolunteerInfo = upcoming.map((e) => ({
		...e,
		vimsId: volunteerInfo.get(e.code)?.id ?? null,
		dashboardVolunteerDeeplink: volunteerInfo.get(e.code)?.dashboardVolunteerDeeplink ?? null
	}));

	return { season, events: eventsWithVolunteerInfo, seasonEventCount, error };
};
