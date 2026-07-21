import { ROLES, requireRole } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const role = requireRole(locals.user, ROLES);
	return {
		role,
		email: locals.user?.email as string,
		userId: locals.user?.id as string,
		name: locals.user?.name as string,
		avatar: locals.user?.avatar as string
	};
};
