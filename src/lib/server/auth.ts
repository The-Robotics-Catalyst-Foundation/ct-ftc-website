import { error, redirect } from '@sveltejs/kit';
import type { AuthRecord } from 'pocketbase';

export const ROLES = ['admin', 'event_manager', 'photographer'] as const;
export type Role = (typeof ROLES)[number];

export function roleOf(user: AuthRecord): Role | null {
	const level = user?.authLevel;
	return ROLES.includes(level) ? (level as Role) : null;
}

// Route-access guard: use in load functions so an unauthorized user never
// receives the page HTML/JS in the first place. This is defense in depth -
// the PocketBase collection rules remain the authoritative check on the
// actual data operations performed with locals.pb.
export function requireRole(user: AuthRecord, allowed: readonly Role[]): Role {
	const role = roleOf(user);
	if (!role) throw redirect(303, '/admin');
	if (!allowed.includes(role)) throw error(403, 'Insufficient permissions.');
	return role;
}
