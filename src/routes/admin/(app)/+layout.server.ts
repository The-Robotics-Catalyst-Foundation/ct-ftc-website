import { ROLES, requireRole } from '$lib/server/auth';
import { pb } from '$lib/pocketbase';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const role = requireRole(locals.user, ROLES);
	const user = locals.user;
	const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar as string) : undefined;

	let unrespondedCount = 0;
	if (role === 'admin' || role === 'event_manager') {
		try {
			const result = await locals.pb
				.collection('contact')
				.getList(1, 1, { filter: 'responded = false', requestKey: 'layout-unresponded' });
			unrespondedCount = result.totalItems;
		} catch {
			// contact collection may not exist yet - nav badge just stays at 0.
		}
	}

	return {
		role,
		email: user?.email as string,
		userId: user?.id as string,
		name: user?.name as string | undefined,
		avatarUrl,
		unrespondedCount
	};
};
