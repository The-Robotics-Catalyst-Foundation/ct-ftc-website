import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const EMAIL_PATTERN = /[^\s,;<>"']+@[^\s,;<>"']+\.[^\s,;<>"']+/g;
const COLLECTION = 'volunteer_newsletter';

export const load: PageServerLoad = async ({ locals }) => {
	const subscriberCount = await locals.pb.collection(COLLECTION).getFullList().then((r) => r.length);
	return { subscriberCount };
};

export const actions: Actions = {
	import: async ({ request, locals }) => {
		const form = await request.formData();
		const pasted = String(form.get('emails') ?? '');
		const file = form.get('file');

		let fileText = '';
		if (file instanceof File && file.size > 0) {
			fileText = await file.text();
		}

		const matches = `${pasted}\n${fileText}`.match(EMAIL_PATTERN) ?? [];
		const emails = [...new Set(matches.map((e) => e.trim().toLowerCase()))];

		if (!emails.length) return fail(400, { error: 'No email addresses found in the pasted text or file.' });

		let added = 0;
		let skipped = 0;
		const errors: string[] = [];

		for (const email of emails) {
			try {
				await locals.pb.collection(COLLECTION).create({ email });
				added += 1;
			} catch (err: any) {
				// Already subscribed - PocketBase's unique-field validation on
				// `email` rejects the duplicate, which is fine here.
				if (err?.response?.data?.email?.code === 'validation_not_unique') {
					skipped += 1;
				} else {
					errors.push(`${email}: ${err?.message ?? 'Failed to add.'}`);
				}
			}
		}

		return { success: true, total: emails.length, added, skipped, errors };
	}
};
