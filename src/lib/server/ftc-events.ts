import { FTC_API_KEY, FTC_API_USERNAME } from '$env/static/private';

export interface FtcTeam {
	teamNumber: number;
	name: string;
	city: string;
	schoolName: string;
}

export interface FtcEvent {
	code: string;
	name: string;
	typeName: string;
	venue: string;
	city: string;
	stateprov: string;
	dateStart: string;
	dateEnd: string;
}

interface RawEvent {
	code: string;
	name?: string;
	typeName?: string;
	venue?: string;
	city?: string;
	stateprov?: string;
	dateStart?: string;
	dateEnd?: string;
}

interface EventsResponse {
	events: RawEvent[];
	eventCount: number;
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

let cache: { key: string; teams: FtcTeam[]; fetchedAt: number } | null = null;
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

async function fetchSeasonTeams(season: number): Promise<FtcTeam[]> {
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

	return teams;
}

// Pulls CT teams across the last `seasonsBack` seasons (default 3) rather than
// just the current one, so the homepage map still shows teams that competed
// recently but haven't registered yet for the season currently in progress.
export async function getCtTeams(seasonsBack = 3): Promise<FtcTeam[]> {
	const latestSeason = currentSeason();
	const cacheKey = `${latestSeason}:${seasonsBack}`;

	if (cache && cache.key === cacheKey && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
		return cache.teams;
	}

	const seasons = Array.from({ length: seasonsBack }, (_, i) => latestSeason - i);

	// Oldest season first so that when a team appears in more than one
	// season, the most recent season's name/city overwrites older data.
	const byTeamNumber = new Map<number, FtcTeam>();
	for (const season of [...seasons].reverse()) {
		try {
			const teams = await fetchSeasonTeams(season);
			for (const team of teams) byTeamNumber.set(team.teamNumber, team);
		} catch (err) {
			console.error(`Failed to fetch FTC teams for season ${season}:`, err);
		}
	}

	const teams = Array.from(byTeamNumber.values());
	cache = { key: cacheKey, teams, fetchedAt: Date.now() };
	return teams;
}

export async function getCtEvents(season: number): Promise<FtcEvent[]> {
	const token = Buffer.from(`${FTC_API_USERNAME}:${FTC_API_KEY}`).toString('base64');
	// Unlike /teams, the /events endpoint's `state` query param is silently
	// ignored by the FTC API - it always returns every event worldwide for
	// the season, so CT has to be filtered client-side below.
	const url = `${BASE_URL}/${season}/events`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${token}`,
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error(`FTC Events API returned ${res.status} for season ${season}`);
	}

	const data: EventsResponse = await res.json();

	return data.events.filter((e) => e.stateprov === 'CT').map((e) => ({
		code: e.code,
		name: e.name || e.code,
		typeName: e.typeName ?? '',
		venue: e.venue ?? '',
		city: e.city ?? '',
		stateprov: e.stateprov ?? '',
		dateStart: e.dateStart ?? '',
		dateEnd: e.dateEnd ?? ''
	}));
}
