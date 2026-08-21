import { marked } from 'marked';
import changelogSource from '$lib/content/changelog.md?raw';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		title: 'Changelog',
		html: await marked.parse(changelogSource)
	};
};
