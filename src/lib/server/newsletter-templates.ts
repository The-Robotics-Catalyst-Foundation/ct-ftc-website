export interface NewsletterEventInfo {
	name: string;
	location: string;
	dateLabel: string;
	link: string;
}

export interface RenderNewsletterOpts {
	message: string;
	event?: NewsletterEventInfo | null;
	origin: string;
	// `cid:...` when actually sending (matches the inline Resend attachment),
	// or a `data:` URL for the live preview - either renders fine in an <img>.
	imageUrl?: string | null;
}

export interface NewsletterTemplate {
	id: string;
	name: string;
	description: string;
	render(opts: RenderNewsletterOpts): { subject: string; html: string };
}

function escapeHtml(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

// Wraps whatever an admin types with a standard greeting and sign-off, so
// every broadcast reads as a proper letter regardless of template chosen.
export function composeMessage(message: string): string {
	return `Dear Volunteers,\n\n${message.trim()}\n\nThank you,\nSincerely,\nCT FTC`;
}

// Plain-text message -> paragraph HTML, one <p> per blank-line-separated
// block, single newlines within a block become <br>.
function messageToHtml(message: string): string {
	return message
		.trim()
		.split(/\n{2,}/)
		.map((block) => `<p style="margin:0 0 16px;">${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
		.join('\n');
}

const FOOTER = (origin: string) => `
	<tr>
		<td style="padding:24px 32px;background:#0f172a;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;text-align:center;">
			<p style="margin:0 0 6px;">CT FIRST Tech Challenge &mdash; Connecticut's volunteer-run robotics community</p>
			<p style="margin:0;">
				<a href="mailto:youseffmmacary@gmail.com" style="color:#93c5fd;text-decoration:none;">youseffmmacary@gmail.com</a>
				&nbsp;&middot;&nbsp;
				<a href="${origin}/volunteer" style="color:#93c5fd;text-decoration:none;">Manage volunteer info</a>
			</p>
		</td>
	</tr>
`;

const WRAPPER_OPEN = `
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#eef2f7;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:32px 16px;">
		<tr>
			<td align="center">
				<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
`;

const bannerImage = (imageUrl?: string | null) =>
	imageUrl
		? `<tr>
				<td style="padding:0;">
					<img src="${imageUrl}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;">
				</td>
			</tr>`
		: '';

const WRAPPER_CLOSE = `
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`;

const simple: NewsletterTemplate = {
	id: 'simple',
	name: 'Simple Update',
	description: 'Clean, minimal letter format. Best for quick reminders and short notes.',
	render({ message, origin, imageUrl }) {
		return {
			subject: 'CT FTC Volunteer Update',
			html: `${WRAPPER_OPEN}
				${bannerImage(imageUrl)}
				<tr>
					<td style="padding:32px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
						<p style="margin:0;font-size:12px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;">CT FIRST Tech Challenge</p>
						<h1 style="margin:8px 0 0;font-size:22px;color:#0f172a;">Volunteer Update</h1>
					</td>
				</tr>
				<tr>
					<td style="padding:16px 32px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e293b;">
						${messageToHtml(message)}
					</td>
				</tr>
				${FOOTER(origin)}
			${WRAPPER_CLOSE}`
		};
	}
};

const eventAnnouncement: NewsletterTemplate = {
	id: 'event',
	name: 'Event Announcement',
	description: 'Highlights one event in a card with a register button. Best when you pick an event above.',
	render({ message, event, origin, imageUrl }) {
		const link = event?.link || `${origin}/volunteer`;
		return {
			subject: event ? `Volunteers needed: ${event.name}` : 'CT FTC Volunteer Update',
			html: `${WRAPPER_OPEN}
				${bannerImage(imageUrl)}
				<tr>
					<td style="padding:32px 32px 0;font-family:Arial,Helvetica,sans-serif;">
						<p style="margin:0;font-size:12px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;">CT FIRST Tech Challenge</p>
					</td>
				</tr>
				${
					event
						? `<tr>
					<td style="padding:16px 32px;">
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:2px solid #2563eb;border-radius:10px;">
							<tr>
								<td style="padding:20px 24px;font-family:Arial,Helvetica,sans-serif;">
									<p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:#2563eb;">Volunteers Needed</p>
									<h1 style="margin:0 0 10px;font-size:22px;color:#0f172a;">${escapeHtml(event.name)}</h1>
									<p style="margin:0;font-size:14px;color:#334155;">${escapeHtml(event.dateLabel)}${event.location ? ' &middot; ' + escapeHtml(event.location) : ''}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>`
						: ''
				}
				<tr>
					<td style="padding:16px 32px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e293b;">
						${messageToHtml(message)}
					</td>
				</tr>
				<tr>
					<td style="padding:0 32px 32px;">
						<table role="presentation" cellpadding="0" cellspacing="0">
							<tr>
								<td style="border-radius:8px;background:#2563eb;">
									<a href="${link}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;letter-spacing:0.04em;text-transform:uppercase;color:#ffffff;text-decoration:none;">Register to Volunteer &rarr;</a>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				${FOOTER(origin)}
			${WRAPPER_CLOSE}`
		};
	}
};

const bold: NewsletterTemplate = {
	id: 'bold',
	name: 'Bold Announcement',
	description: 'High-contrast, brand-matched design with a black header and yellow accent. Best for big calls to action.',
	render({ message, event, origin, imageUrl }) {
		const link = event?.link || `${origin}/volunteer`;
		return {
			subject: event ? `${event.name} needs volunteers!` : 'CT FTC Volunteer Update',
			html: `${WRAPPER_OPEN}
				${bannerImage(imageUrl)}
				<tr>
					<td style="padding:28px 32px;background:#0f172a;">
						<p style="margin:0;font-size:12px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#facc15;font-family:Arial,Helvetica,sans-serif;">CT First Tech Challenge</p>
						<h1 style="margin:6px 0 0;font-size:26px;font-weight:900;text-transform:uppercase;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">${event ? escapeHtml(event.name) : 'Volunteer Update'}</h1>
						${event ? `<p style="margin:8px 0 0;font-size:13px;color:#cbd5e1;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(event.dateLabel)}${event.location ? ' &middot; ' + escapeHtml(event.location) : ''}</p>` : ''}
					</td>
				</tr>
				<tr>
					<td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1e293b;">
						${messageToHtml(message)}
					</td>
				</tr>
				<tr>
					<td style="padding:8px 32px 32px;">
						<table role="presentation" cellpadding="0" cellspacing="0">
							<tr>
								<td style="border-radius:10px;background:#facc15;border:2px solid #0f172a;">
									<a href="${link}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;color:#0f172a;text-decoration:none;">Sign Up Now &rarr;</a>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				${FOOTER(origin)}
			${WRAPPER_CLOSE}`
		};
	}
};

export const NEWSLETTER_TEMPLATES: NewsletterTemplate[] = [simple, eventAnnouncement, bold];

export function getTemplate(id: string): NewsletterTemplate {
	return NEWSLETTER_TEMPLATES.find((t) => t.id === id) ?? simple;
}
