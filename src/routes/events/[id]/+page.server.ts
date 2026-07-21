import { fail } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { checkRateLimit } from '$lib/server/rate-limit';
import type { PageServerLoad, Actions } from './$types';

// The route param may be a real PocketBase record id or a human slug -
// resolve to the actual id either way so cookie keys and updates stay
// consistent regardless of which one is in the URL.
async function resolveEventId(param: string): Promise<string> {
	try {
		const record = await pb.collection('events').getOne(param);
		return record.id;
	} catch {
		const record = await pb.collection('events').getFirstListItem(pb.filter('slug = {:slug}', { slug: param }));
		return record.id;
	}
}

export const load: PageServerLoad = async ({ params, cookies }) => {
	try {
		const id = await resolveEventId(params.id);
		return { alreadyVolunteered: !!cookies.get(`volunteered_${id}`) };
	} catch {
		return { alreadyVolunteered: false };
	}
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
	volunteer: async ({ request, params, cookies, getClientAddress }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();

		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid email address.' });
		}

		let id: string;
		try {
			id = await resolveEventId(params.id);
		} catch {
			return fail(404, { error: 'Event not found.' });
		}

		if (cookies.get(`volunteered_${id}`)) {
			return fail(409, { error: "You're already signed up to volunteer for this event." });
		}

		if (!checkRateLimit(`volunteer:${getClientAddress()}`)) {
			return fail(429, { error: 'Too many attempts. Please wait a few minutes and try again.' });
		}

		try {
			// Logged in the same `contact` collection the contact form already
			// writes to (public createRule already permits it) so every RSVP
			// is a reviewable, named record - not just an anonymous click.
			await pb.collection('contact').create({
				name: '',
				email,
				category: 'volunteer',
				message: `RSVP'd to volunteer at event ID ${id}.`
			});

			const updated = await pb.collection('events').update(id, { 'volunteersAttending+': 1 });

			cookies.set(`volunteered_${id}`, '1', {
				path: `/events/${params.id}`,
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 180
			});

			return { success: true, volunteersAttending: updated.volunteersAttending as number };
		} catch (err: any) {
			// Covers the PocketBase `events` collection rejecting an anonymous
			// update - if that happens, its updateRule needs to allow public
			// writes to volunteersAttending for this feature to work at all.
			return fail(400, { error: err?.message ?? 'Could not register your RSVP right now.' });
		}
	}
};
