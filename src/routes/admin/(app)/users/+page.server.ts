import { fail } from '@sveltejs/kit';
import { ROLES, requireRole } from '$lib/server/auth';
import { pbErrorMessage } from '$lib/server/pb-error';
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
		const authLevel = form.get('authLevel');

		if (!email) return fail(400, { error: 'Email is required.' });
		if (!isValidRole(authLevel)) return fail(400, { error: 'Invalid role.' });

		// PocketBase requires a password to create the account, but the
		// invitee never sees it - they set their own later via "Forgot
		// password" on the admin login page. A single UUID (36 chars) is
		// plenty of entropy and stays under PocketBase's 71-char
		// (bcrypt-backed) password length limit.
		const tempPassword = crypto.randomUUID();

		const out = new FormData();
		out.append('email', email);
		out.append('name', name);
		out.append('password', tempPassword);
		out.append('passwordConfirm', tempPassword);
		out.append('authLevel', authLevel);
		out.append('emailVisibility', 'true');

		try {
			await locals.pb.collection('users').create(out);
		} catch (err: any) {
			return fail(400, { error: pbErrorMessage(err, 'Failed to create account.') });
		}

		// The account exists even if the verification email fails to send
		// (e.g. mail isn't configured in PocketBase yet) - surface that
		// separately so an admin doesn't think account creation itself failed.
		// PocketBase's own confirmVerification() flips `verified` to true once
		// they click the link - see /admin/verify-email.
		try {
			await locals.pb.collection('users').requestVerification(email);
		} catch (err: any) {
			return fail(500, { error: `Account created, but the verification email failed to send: ${pbErrorMessage(err, 'unknown error')}.` });
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
			return fail(400, { error: pbErrorMessage(err, 'Failed to update account.') });
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
			return fail(400, { error: pbErrorMessage(err, 'Failed to delete account.') });
		}
	}
};
