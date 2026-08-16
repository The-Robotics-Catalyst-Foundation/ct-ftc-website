import { fail } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { checkRateLimit } from '$lib/server/rate-limit';
import { sendBulkEmail } from '$lib/server/email';
import { notifyAdmins } from '$lib/server/push';
import type { Actions, PageServerLoad } from './$types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATEGORIES = ['general', 'team', 'volunteer', 'sponsorship'];

export const load: PageServerLoad = () => ({
	title: 'Contact Us',
	description: 'Get in touch with Connecticut FIRST Tech Challenge - questions, team support, volunteering, and sponsorship.'
});

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const category = String(form.get('category') ?? 'general');
		const message = String(form.get('message') ?? '').trim();

		if (!name) return fail(400, { error: 'Enter your name.' });
		if (!EMAIL_PATTERN.test(email)) return fail(400, { error: 'Enter a valid email address.' });
		if (!VALID_CATEGORIES.includes(category)) return fail(400, { error: 'Invalid category.' });
		if (!message) return fail(400, { error: 'Enter a message.' });

		if (!checkRateLimit(`contact:${getClientAddress()}`)) {
			return fail(429, { error: 'Too many attempts. Please wait a few minutes and try again.' });
		}

		try {
			await pb.collection('contact').create({ name, email, category, message, responded: false });
		} catch (err: any) {
			return fail(400, { error: err?.message ?? 'Could not send your message right now.' });
		}

		// Notify every admin so a new message is never missed - failure to
		// notify shouldn't fail the submission itself, the message is already
		// saved and visible in the admin panel either way.
		try {
			const admins = await pb.collection('users').getFullList({ filter: "authLevel = 'admin'" });
			const recipients = admins.map((a) => a.email as string).filter(Boolean);
			if (recipients.length) {
				await sendBulkEmail({
					subject: `New contact message from ${name}`,
					text: `${name} (${email}) sent a ${category} message:\n\n${message}\n\nRespond from the admin panel: /admin/messages`,
					recipients
				});
			}
		} catch (err) {
			console.error('Failed to notify admins of new contact message:', err);
		}

		notifyAdmins({
			title: `1 new notification from ${name}`,
			body: message.length > 120 ? `${message.slice(0, 117)}...` : message,
			url: '/admin/messages'
		}).catch((err) => console.error('Failed to push-notify admins of new contact message:', err));

		return { success: true };
	}
};
