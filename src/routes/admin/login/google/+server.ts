import { error, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

const STATE_COOKIE = 'pb_oauth_state';

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
	const methods = await locals.pb.collection('users').listAuthMethods();
	const provider = methods.oauth2.providers.find((p) => p.name === 'google');

	if (!provider) throw error(500, 'Google sign-in is not configured.');

	cookies.set(
		STATE_COOKIE,
		JSON.stringify({ state: provider.state, codeVerifier: provider.codeVerifier }),
		{
			path: '/admin/login/google',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 300
		}
	);

	const redirectUrl = `${url.origin}/admin/login/google/callback`;
	throw redirect(303, provider.authURL + encodeURIComponent(redirectUrl));
};
