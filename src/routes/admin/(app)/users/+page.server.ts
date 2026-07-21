import { fail } from '@sveltejs/kit';
import { ROLES, requireRole } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, ['admin']);
	const users = await locals.pb.collection('users').getFullList({ sort: '-created' });
	return { users };
};

function isValidRole(value: FormDataEntryValue | null): value is (typeof ROLES)[number] {
	return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export const actions: Actions = {
	createUser: async ({ request, locals }) => {
		requireRole(locals.user, ['admin']);
		const form = await request.formData();

		const email = String(form.get('email') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const authLevel = form.get('authLevel');

		if (!email || !password) return fail(400, { error: 'Email and password are required.' });
		if (!isValidRole(authLevel)) return fail(400, { error: 'Invalid role.' });

		const out = new FormData();
		out.append('email', email);
		out.append('name', name);
		out.append('password', password);
		out.append('passwordConfirm', password);
		out.append('authLevel', authLevel);
		out.append('emailVisibility', 'true');

		try {
			await locals.pb.collection('users').create(out);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to create account.' });
		}
	},

	updateUser: async ({ request, locals }) => {
		requireRole(locals.user, ['admin']);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing user id.' });

		const name = String(form.get('name') ?? '').trim();
		const authLevel = form.get('authLevel');
		if (!isValidRole(authLevel)) return fail(400, { error: 'Invalid role.' });

		if (id === locals.user?.id && authLevel !== 'admin') {
			return fail(400, { error: 'You cannot change your own role.' });
		}

		const out = new FormData();
		out.append('name', name);
		out.append('authLevel', authLevel);

		const password = String(form.get('password') ?? '');
		if (password) {
			out.append('password', password);
			out.append('passwordConfirm', password);
		}

		try {
			await locals.pb.collection('users').update(id, out);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to update account.' });
		}
	},

	deleteUser: async ({ request, locals }) => {
		requireRole(locals.user, ['admin']);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing user id.' });

		if (id === locals.user?.id) {
			return fail(400, { error: 'You cannot delete your own account.' });
		}

		try {
			await locals.pb.collection('users').delete(id);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to delete account.' });
		}
	}
};
