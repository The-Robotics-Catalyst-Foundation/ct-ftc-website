// FTC seasons are named for the year they kick off in (roughly Aug-July) -
// mirrors the season logic in $lib/server/ftc-events.ts, but for an
// arbitrary event date rather than "now".
const SEASON_KICKOFF_MONTH = 8; // August

export function ftcSeasonForDate(date: Date): number {
	const year = date.getUTCFullYear();
	return date.getUTCMonth() + 1 >= SEASON_KICKOFF_MONTH ? year : year - 1;
}

// Built from the event's own `eventCode` field (the real FTC event code,
// e.g. "USCTSTQ") - upper-cased to match FTC's own casing for the link.
export function robolystEventUrl(dateTime?: string, eventCode?: string): string | null {
	const code = eventCode?.trim();
	if (!code) return null;
	const season = ftcSeasonForDate(dateTime ? new Date(dateTime) : new Date());
	return `https://robolyst.org/event/${season}/ftc/${code.toUpperCase()}`;
}
