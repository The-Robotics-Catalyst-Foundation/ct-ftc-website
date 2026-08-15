import { getCtEventsDetailed } from '$lib/server/ftc-events';
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
	let error = '';
	try {
		events = await getCtEventsDetailed(season);
	} catch (err: any) {
		error = err?.message ?? 'Failed to fetch events from the FTC Events API.';
	}

	const now = Date.now();
	const upcoming = events
		.filter((e) => !e.dateEnd || new Date(e.dateEnd).getTime() >= now)
		.sort((a, b) => new Date(a.dateStart || 0).getTime() - new Date(b.dateStart || 0).getTime());

	return { season, events: upcoming, error };
};
