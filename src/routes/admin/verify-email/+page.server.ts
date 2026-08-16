import type { PageServerLoad } from './$types';

// PocketBase verification tokens are plain (unencrypted) JWTs - reading the
// `email` claim ourselves after confirmVerification() has already validated
// the token's signature lets us kick off password creation without asking
// the just-verified user to retype their email.
function emailFromToken(token: string): string | null {
	try {
		const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'));
		return typeof payload.email === 'string' ? payload.email : null;
	} catch {
		return null;
	}
}

// PocketBase's verification link points here with ?token=... - confirming it
// is what flips the account's `verified` field to true, no form/auth needed,
// the token itself is the credential.
export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token') ?? '';
	if (!token) return { success: false, error: 'This verification link is missing its token.' };

	try {
		await locals.pb.collection('users').confirmVerification(token);
	} catch (err: any) {
		return { success: false, error: err?.message ?? 'This verification link is invalid or has expired.' };
	}

	// Best-effort - if this fails (e.g. mail misconfigured), /admin/create-password lets them retry.
	const email = emailFromToken(token);
	if (email) {
		try {
			await locals.pb.collection('users').requestPasswordReset(email);
		} catch {
			// ignore
		}
	}

	return { success: true };
};
