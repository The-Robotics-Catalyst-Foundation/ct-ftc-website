import type { PageServerLoad } from './$types';
import { getCtTeams } from '$lib/server/ftc-events';
import { buildTeamGroups, type TownGroup } from '$lib/server/team-groups';

type Sponsor = { id: string; Name: string; Website?: string; Logo?: string };

// Sponsors change rarely - a short in-memory cache keeps every homepage
// request from round-tripping to PocketBase, mirroring the pattern already
// used for the FTC Events API team list in ftc-events.ts.
let sponsorCache: { sponsors: Sponsor[]; fetchedAt: number } | null = null;
const SPONSOR_CACHE_TTL_MS = 5 * 60 * 1000;

async function getSponsors(pb: App.Locals['pb']): Promise<Sponsor[]> {
	if (sponsorCache && Date.now() - sponsorCache.fetchedAt < SPONSOR_CACHE_TTL_MS) {
		return sponsorCache.sponsors;
	}
	const sponsors = await pb.collection('sponsors').getFullList<Sponsor>({ sort: 'Name' });
	sponsorCache = { sponsors, fetchedAt: Date.now() };
	return sponsors;
}

export const load: PageServerLoad = async ({ locals }) => {
	const [teamGroupsResult, sponsorsResult] = await Promise.allSettled([
		getCtTeams(3).then(buildTeamGroups),
		getSponsors(locals.pb)
	]);

	let teamGroups: TownGroup[] = [];
	if (teamGroupsResult.status === 'fulfilled') {
		teamGroups = teamGroupsResult.value;
	} else {
		console.error('Failed to load CT FTC teams for the hero map:', teamGroupsResult.reason);
	}

	let sponsors: Sponsor[] = [];
	if (sponsorsResult.status === 'fulfilled') {
		sponsors = sponsorsResult.value;
	} else {
		console.error('Failed to load sponsors for the homepage reel:', sponsorsResult.reason);
	}

	return { teamGroups, sponsors };
};
