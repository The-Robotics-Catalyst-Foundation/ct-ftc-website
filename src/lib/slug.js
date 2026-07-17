/**
 * Lowercase, hyphenated, URL-safe slug from arbitrary text.
 * @param {string} text
 */
export function slugify(text) {
	return String(text)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
