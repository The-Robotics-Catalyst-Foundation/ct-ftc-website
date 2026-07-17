/**
 * Human countdown for an ISO date string: "Today" / "Tomorrow" / "in N days" / "Mon D". Null if past or invalid.
 * @param {string | null | undefined} dateString
 */
export function formatCountdown(dateString) {
	if (!dateString) return null;
	const target = new Date(dateString);
	if (Number.isNaN(target.getTime())) return null;

	const now = new Date();
	const dayMs = 24 * 60 * 60 * 1000;
	const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
	const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const diffDays = Math.round((startOfTarget - startOfNow) / dayMs);

	if (diffDays < 0) return null;
	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Tomorrow';
	if (diffDays <= 30) return `in ${diffDays} days`;

	return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Full readable event date, e.g. "Sat, Mar 14, 2026". "TBD" if missing/invalid.
 * @param {string | null | undefined} dateString
 */
export function formatEventDate(dateString) {
	if (!dateString) return 'TBD';
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return 'TBD';
	return date.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});
}
