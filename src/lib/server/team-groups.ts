import type { FtcTeam } from '$lib/server/ftc-events';
import { coordsForCity } from '$lib/data/ct-town-coords';

export interface TownGroup {
	lat: number;
	lng: number;
	city: string;
	teams: { teamNumber: number; name: string }[];
}

export function buildTeamGroups(teams: FtcTeam[]): TownGroup[] {
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

	return Array.from(byKey.values());
}
