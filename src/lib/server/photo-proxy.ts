/**
 * Public photo URLs never expose the raw PocketBase host - callers build a
 * link through here instead of using pb.files.getURL() directly, and the
 * /ctftc/event/pic/[id] route on the other end resolves + streams the file.
 */
export function proxyPicUrl(eventId: string, filename: string, thumb?: string): string {
	const token = Buffer.from(JSON.stringify({ e: eventId, f: filename })).toString('base64url');
	return thumb ? `/ctftc/event/pic/${token}?thumb=${thumb}` : `/ctftc/event/pic/${token}`;
}

export function decodePicToken(token: string): { e: string; f: string } {
	const parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
	if (typeof parsed?.e !== 'string' || typeof parsed?.f !== 'string') {
		throw new Error('Malformed photo token');
	}
	return parsed;
}
