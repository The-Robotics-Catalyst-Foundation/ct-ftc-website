import { ROLES, requireRole } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const role = requireRole(locals.user, ROLES);
	return { role, email: locals.user?.email as string, userId: locals.user?.id as string };
};
