import type { PageServerLoad } from './$types';
import { getCtTeams, type FtcTeam } from '$lib/server/ftc-events';
import { buildTeamGroups, type TownGroup } from '$lib/server/team-groups';

export const load: PageServerLoad = async () => {
	let teams: FtcTeam[] = [];
	let teamGroups: TownGroup[] = [];

	try {
		teams = (await getCtTeams()).sort((a, b) => a.teamNumber - b.teamNumber);
		teamGroups = buildTeamGroups(teams);
	} catch (err) {
		console.error('Failed to load CT FTC teams for the directory:', err);
	}

	return {
		teamGroups,
		title: 'Team Directory',
		description:
			'Every FIRST Tech Challenge team in Connecticut - team numbers, names, and hometowns, plus match history and stats via Robolyst.'
	};
};
