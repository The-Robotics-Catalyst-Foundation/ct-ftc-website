import type { PageServerLoad } from './$types';
import { getCtTeams } from '$lib/server/ftc-events';
import { coordsForCity } from '$lib/data/ct-town-coords';

interface TownGroup {
	lat: number;
	lng: number;
	city: string;
	teams: { teamNumber: number; name: string }[];
}

export const load: PageServerLoad = async ({ locals }) => {
	let teamGroups: TownGroup[] = [];

	try {
		const teams = await getCtTeams(3);
		const byKey = new Map<string, TownGroup>();

		for (const team of teams) {
			const coords = coordsForCity(team.city);
			if (!coords) continue;

			const key = `${coords[0]},${coords[1]}`;
			let group = byKey.get(key);
			if (!group) {
				group = { lat: coords[0], lng: coords[1], city: team.city, teams: [] };
				byKey.set(key, group);
			}
			group.teams.push({ teamNumber: team.teamNumber, name: team.name });
		}

		teamGroups = Array.from(byKey.values());
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
