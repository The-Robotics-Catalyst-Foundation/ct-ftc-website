import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

const CAN_MANAGE = ['admin', 'event_manager'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	const [events, signups] = await Promise.all([
		locals.pb.collection('events').getFullList({ sort: '-date_time' }),
		locals.pb.collection('volunteer_signups').getFullList({ sort: '-created' })
	]);

	const signupsByEvent = new Map<string, typeof signups>();
	for (const signup of signups) {
		const eventId = signup.event as string;
		const bucket = signupsByEvent.get(eventId) ?? [];
		bucket.push(signup);
		signupsByEvent.set(eventId, bucket);
	}

	const groups = events.map((event) => ({
		event,
		signups: signupsByEvent.get(event.id) ?? []
	}));

	// A signup whose event was deleted (or never resolved) would otherwise be
	// silently dropped from the page - surface it instead of hiding it.
	const eventIds = new Set(events.map((e) => e.id));
	const orphaned = signups.filter((s) => !eventIds.has(s.event as string));

	return { groups, orphaned, totalSignups: signups.length };
};

export const actions: Actions = {
	deleteSignup: async ({ request, locals }) => {
		requireRole(locals.user, CAN_MANAGE);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'Missing signup id.' });

		try {
			await locals.pb.collection('volunteer_signups').delete(id);
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Failed to delete signup.' });
		}
	}
};
