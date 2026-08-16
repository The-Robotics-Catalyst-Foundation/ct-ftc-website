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
	eventId?: string;
	code: string;
	divisionCode?: string | null;
	name?: string;
	remote?: boolean;
	hybrid?: boolean;
	fieldCount?: number;
	published?: boolean;
	type?: string;
	typeName?: string;
	regionCode?: string;
	leagueCode?: string | null;
	districtCode?: string;
	venue?: string;
	address?: string;
	city?: string;
	stateprov?: string;
	country?: string;
	website?: string | null;
	liveStreamUrl?: string | null;
	coordinates?: { type: string; coordinates: [number, number] } | null;
	webcasts?: unknown;
	timezone?: string;
	dateStart?: string;
	dateEnd?: string;
}

// Every field the API returns for an event, unfiltered - used by the
// superadmin events table, unlike `FtcEvent` above which only keeps the
// handful of fields the season-import flow actually needs.
export type DetailedFtcEvent = RawEvent;

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

function toFtcTeam(t: TeamsResponse['teams'][number]): FtcTeam {
	return {
		teamNumber: t.teamNumber,
		name: t.nameShort || t.nameFull || `Team ${t.teamNumber}`,
		city: t.city ?? '',
		schoolName: t.schoolName ?? ''
	};
}

async function fetchSeasonTeams(season: number): Promise<FtcTeam[]> {
	const first = await fetchPage(season, 1);
	const teams = first.teams.map(toFtcTeam);
	const pageTotal = first.pageTotal || 1;

	if (pageTotal > 1) {
		const rest = await Promise.all(
			Array.from({ length: pageTotal - 1 }, (_, i) => fetchPage(season, i + 2))
		);
		for (const data of rest) teams.push(...data.teams.map(toFtcTeam));
	}

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

	// Fetch every season concurrently - order no longer matters for the
	// merge below since each result carries its own season alongside it.
	const results = await Promise.all(
		seasons.map(async (season) => {
			try {
				return { season, teams: await fetchSeasonTeams(season) };
			} catch (err) {
				console.error(`Failed to fetch FTC teams for season ${season}:`, err);
				return { season, teams: [] as FtcTeam[] };
			}
		})
	);

	// Oldest season first so that when a team appears in more than one
	// season, the most recent season's name/city overwrites older data.
	const byTeamNumber = new Map<number, FtcTeam>();
	for (const { teams } of [...results].sort((a, b) => a.season - b.season)) {
		for (const team of teams) byTeamNumber.set(team.teamNumber, team);
	}

	const teams = Array.from(byTeamNumber.values());
	cache = { key: cacheKey, teams, fetchedAt: Date.now() };
	return teams;
}

export interface SeasonInfo {
	eventCount: number;
	teamCount: number;
	gameName: string;
	kickoff: string;
}

// GET /v2.0/{season} (the root season endpoint, distinct from /events) -
// its `eventCount`/`teamCount` are worldwide season totals, not tied to any
// single event.
export async function getSeasonInfo(season: number): Promise<SeasonInfo> {
	const token = Buffer.from(`${FTC_API_USERNAME}:${FTC_API_KEY}`).toString('base64');
	const res = await fetch(`${BASE_URL}/${season}`, {
		headers: {
			Authorization: `Basic ${token}`,
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error(`FTC Events API returned ${res.status} for season ${season}`);
	}

	return res.json();
}

async function fetchCtEventsRaw(season: number): Promise<RawEvent[]> {
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
	return data.events.filter((e) => e.stateprov === 'CT');
}

export async function getCtEvents(season: number): Promise<FtcEvent[]> {
	const events = await fetchCtEventsRaw(season);
	return events.map((e) => ({
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

// Unfiltered event data straight from the API, for the superadmin events
// table - every field the API exposes, not just the season-import subset.
export async function getCtEventsDetailed(season: number): Promise<DetailedFtcEvent[]> {
	return fetchCtEventsRaw(season);
}

export interface VolunteerSearchInfo {
	id: string;
	dashboardVolunteerDeeplink: string;
}

const FIRST_SEARCH_URL = 'https://yifkx4foih.execute-api.us-east-2.amazonaws.com/prod/first-search';

interface FirstSearchResult {
	id?: string;
	dashboard_volunteer_deeplink?: string;
}

interface FirstSearchResponse {
	results?: FirstSearchResult[];
}

// Looks up the FIRST search index (separate from the FTC Events API) for a
// single event's VIMS id and volunteer-dashboard deeplink.
export async function getVolunteerSearchInfo(
	eventCode: string,
	season: number
): Promise<VolunteerSearchInfo | null> {
	const res = await fetch(FIRST_SEARCH_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			index: 'events_*',
			query: {
				size: 1,
				query: {
					bool: {
						should: [
							{ term: { event_code: eventCode } },
							{ term: { event_season: String(season) } }
						],
						minimum_should_match: 2
					}
				}
			}
		})
	});

	if (!res.ok) {
		throw new Error(`first-search API returned ${res.status} for event ${eventCode}`);
	}

	const data: FirstSearchResponse = await res.json();
	const hit = data.results?.[0];
	if (!hit) return null;

	return {
		id: hit.id ?? '',
		dashboardVolunteerDeeplink: hit.dashboard_volunteer_deeplink ?? ''
	};
}

// Same lookup as getVolunteerSearchInfo, but for a batch of events - fetched
// one event at a time in parallel; a failure on one event doesn't drop the
// others.
export async function getVolunteerSearchInfoForEvents(
	events: Pick<DetailedFtcEvent, 'code'>[],
	season: number
): Promise<Map<string, VolunteerSearchInfo>> {
	const map = new Map<string, VolunteerSearchInfo>();

	await Promise.all(
		events.map(async (e) => {
			try {
				const info = await getVolunteerSearchInfo(e.code, season);
				if (info) map.set(e.code, info);
			} catch (err) {
				console.error(`Failed to fetch volunteer search info for event ${e.code}:`, err);
			}
		})
	);

	return map;
}
