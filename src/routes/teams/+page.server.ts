import type { PageServerLoad } from './$types';
import { getCtTeams, type FtcTeam } from '$lib/server/ftc-events';

export const load: PageServerLoad = async () => {
	let teams: FtcTeam[] = [];

	try {
		teams = (await getCtTeams()).sort((a, b) => a.teamNumber - b.teamNumber);
	} catch (err) {
		console.error('Failed to load CT FTC teams for the directory:', err);
	}

	return {
		teams,
		title: 'Team Directory',
		description:
			'Every FIRST Tech Challenge team in Connecticut - team numbers, names, and hometowns, plus match history and stats via Robolyst.'
	};
};
