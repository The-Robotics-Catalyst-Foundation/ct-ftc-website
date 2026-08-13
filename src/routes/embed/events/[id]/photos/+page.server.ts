import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { proxyPicUrl } from '$lib/server/photo-proxy';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	let record;
	try {
		record = await pb.collection('events').getOne(params.id);
	} catch {
		try {
			record = await pb
				.collection('events')
				.getFirstListItem(pb.filter('slug = {:slug}', { slug: params.id }));
		} catch {
			throw error(404, 'Event not found');
		}
	}

	const pics = ((record.pics as string[]) || []).map((pic) => ({
		thumb: proxyPicUrl(record.id, pic, '400x400'),
		full: proxyPicUrl(record.id, pic)
	}));

	return {
		name: record.name || 'Untitled Event',
		title: `${record.name || 'Untitled Event'} - Photos`,
		eventPath: `/events/${record.slug || record.id}`,
		pics,
		showNav: url.searchParams.get('nav') !== '0',
		showName: url.searchParams.get('name') !== '0',
		showFooter: url.searchParams.get('footer') === '1',
		showBreadcrumb: url.searchParams.get('breadcrumb') !== '0'
	};
};
