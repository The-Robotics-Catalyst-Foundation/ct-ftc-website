/**
 * Serializes a JSON-LD object into a literal `<script>` tag for use with
 * `{@html}`. Svelte treats any `<script>` element's contents as raw/opaque
 * text (no `{expression}` interpolation happens inside one, even nested
 * ones), so the tag has to be built as a plain string and injected whole -
 * writing `{@html}` *inside* a `<script>` tag renders the literal text
 * "{@html ...}" instead of evaluating it.
 * @param {object} data
 */
export function jsonLdScript(data) {
	// `</script>` inside a string value would otherwise terminate the tag early.
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
