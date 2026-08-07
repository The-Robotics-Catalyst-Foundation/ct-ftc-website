import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';

const resend = new Resend(RESEND_API_KEY);

// singul.tech must be a verified sending domain in the Resend dashboard for
// this address to actually deliver - otherwise Resend will reject the send.
// Override with RESEND_FROM_EMAIL if that changes.
const FROM = env.RESEND_FROM_EMAIL || 'CT FIRST Tech Challenge <ctftc@singul.tech>';

/**
 * Single choke point for outbound bulk email, sent one-by-one so no
 * recipient's address is ever exposed to another in a shared `to` list.
 * Returns each message's Resend id so a send batch can later be correlated
 * with open-tracking webhook events.
 */
export async function sendBulkEmail(opts: {
	subject: string;
	text: string;
	recipients: string[];
}): Promise<string[]> {
	const ids: string[] = [];
	for (const to of opts.recipients) {
		const { data, error } = await resend.emails.send({
			from: FROM,
			to,
			subject: opts.subject,
			text: opts.text
		});
		if (error) {
			throw new Error(`Failed to send to ${to}: ${error.message}`);
		}
		if (data?.id) ids.push(data.id);
	}
	return ids;
}
