import type { PageServerLoad } from './$types';
import { getCtTeams } from '$lib/server/ftc-events';
import { buildTeamGroups, type TownGroup } from '$lib/server/team-groups';

export const load: PageServerLoad = async ({ locals }) => {
	let teamGroups: TownGroup[] = [];

	try {
		teamGroups = buildTeamGroups(await getCtTeams(3));
	} catch (err) {
		console.error('Failed to load CT FTC teams for the hero map:', err);
	}

	let sponsors: { id: string; Name: string; Website?: string; Logo?: string }[] = [];
	try {
		sponsors = await locals.pb.collection('sponsors').getFullList({ sort: 'Name' });
	} catch (err) {
		console.error('Failed to load sponsors for the homepage reel:', err);
	}

	return { teamGroups, sponsors };
};
