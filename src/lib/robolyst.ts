// FTC seasons are named for the year they kick off in (roughly Aug-July) -
// mirrors the season logic in $lib/server/ftc-events.ts, but for an
// arbitrary event date rather than "now".
const SEASON_KICKOFF_MONTH = 8; // August

export function ftcSeasonForDate(date: Date): number {
	const year = date.getUTCFullYear();
	return date.getUTCMonth() + 1 >= SEASON_KICKOFF_MONTH ? year : year - 1;
}

// Events created with no admin-supplied code get a random 8-char hex slug
// (see randomSlug() in admin/events/+page.server.ts) purely to keep the URL
// unique - that's never a real FTC event code, so treat it as "no code".
const AUTO_GENERATED_SLUG = /^[0-9a-f]{8}$/;

// The event's own URL slug doubles as the Robolyst/FTC event code - both are
// the same plain alphanumeric code (e.g. "USCTSTQ"), just cased differently:
// slugify() lowercases it for the site's own /events/{slug} URL, so it's
// upper-cased back here to match FTC's own casing for the Robolyst link.
export function robolystEventUrl(dateTime?: string, slug?: string): string | null {
	const code = slug?.trim();
	if (!code || AUTO_GENERATED_SLUG.test(code)) return null;
	const season = ftcSeasonForDate(dateTime ? new Date(dateTime) : new Date());
	return `https://robolyst.org/event/${season}/ftc/${code.toUpperCase()}`;
}
