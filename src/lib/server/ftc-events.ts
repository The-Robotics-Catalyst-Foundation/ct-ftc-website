import { FTC_API_KEY, FTC_API_USERNAME } from '$env/static/private';

export interface FtcTeam {
	teamNumber: number;
	name: string;
	city: string;
	schoolName: string;
}

interface RawTeam {
	teamNumber: number;
	nameShort?: string;
	nameFull?: string;
	schoolName?: string;
	city?: string;
	stateProv?: string;
}

interface TeamsResponse {
	teams: RawTeam[];
	teamCountTotal: number;
	pageCurrent: number;
	pageTotal: number;
}

const BASE_URL = 'https://ftc-api.firstinspires.org/v2.0';

// FTC seasons are named for the year they kick off in (roughly Aug-July);
// before that season's August kickoff, the previous season's team list is
// still the current one.
function currentSeason(): number {
	const now = new Date();
	const year = now.getUTCFullYear();
	return now.getUTCMonth() + 1 >= 8 ? year : year - 1;
}

let cache: { season: number; teams: FtcTeam[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000;

async function fetchPage(season: number, page: number): Promise<TeamsResponse> {
	const token = Buffer.from(`${FTC_API_USERNAME}:${FTC_API_KEY}`).toString('base64');
	const url = `${BASE_URL}/${season}/teams?state=CT&page=${page}`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${token}`,
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error(`FTC Events API returned ${res.status} for page ${page}`);
	}

	return res.json();
}

export async function getCtTeams(): Promise<FtcTeam[]> {
	const season = currentSeason();

	if (cache && cache.season === season && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache.teams;
	}

	const teams: FtcTeam[] = [];
	let page = 1;
	let pageTotal = 1;

	do {
		const data = await fetchPage(season, page);
		for (const t of data.teams) {
			teams.push({
				teamNumber: t.teamNumber,
				name: t.nameShort || t.nameFull || `Team ${t.teamNumber}`,
				city: t.city ?? '',
				schoolName: t.schoolName ?? ''
			});
		}
		pageTotal = data.pageTotal || 1;
		page += 1;
	} while (page <= pageTotal);

	cache = { season, teams, fetchedAt: Date.now() };
	return teams;
}
