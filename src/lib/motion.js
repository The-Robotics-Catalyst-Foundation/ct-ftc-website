import { animate, stagger } from 'animejs';

/**
 * Staggered fade + rise for a set of bento tiles. Exponential ease-out only —
 * no bounce/elastic, per the motion rules in DESIGN.md. Respects
 * prefers-reduced-motion by skipping the animation and leaving tiles at
 * their visible resting state (they must never be hidden by default).
 * @param {string | NodeListOf<Element> | Element[]} selector
 */
export function revealTiles(selector, { delay = 70, duration = 600, distance = 16 } = {}) {
	if (typeof window === 'undefined') return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const targets = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
	if (!targets || targets.length === 0) return;

	animate(targets, {
		opacity: [0, 1],
		translateY: [distance, 0],
		duration,
		delay: stagger(delay),
		ease: 'outExpo'
	});
}

/**
 * One-off entrance for a single hero element (no stagger).
 * @param {string | Element} selector
 */
export function revealOnce(selector, { duration = 700, distance = 20 } = {}) {
	if (typeof window === 'undefined') return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
	if (!target) return;

	animate(target, {
		opacity: [0, 1],
		translateY: [distance, 0],
		duration,
		ease: 'outExpo'
	});
}
