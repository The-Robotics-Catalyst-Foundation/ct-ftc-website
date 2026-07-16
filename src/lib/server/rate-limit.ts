// In-memory sliding-window limiter. Valid because adapter-node runs this
// app as a single long-lived process - it would need a shared store
// (e.g. Redis) behind a multi-instance deployment.
const attempts = new Map<string, number[]>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export function checkRateLimit(key: string): boolean {
	const now = Date.now();
	const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

	if (recent.length >= MAX_ATTEMPTS) {
		attempts.set(key, recent);
		return false;
	}

	recent.push(now);
	attempts.set(key, recent);
	return true;
}
