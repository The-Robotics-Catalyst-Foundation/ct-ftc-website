<script lang="ts">
	import './admin.css';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);
	let errorMessage = $derived(form?.error ?? data.oauthError ?? '');
</script>

<div class="admin-shell aurora-field flex items-center justify-center overflow-hidden px-4 py-16 font-sans">
	<div class="lanyard-rig flex flex-col items-center">
		<div class="lanyard-strings">
			<div class="lanyard-strap lanyard-strap--left"></div>
			<div class="lanyard-strap lanyard-strap--right"></div>
		</div>
		<div class="lanyard-clip"></div>

		<div class="glass-panel relative w-80 pt-7 pb-6">
			<div class="badge-hole absolute top-2 left-1/2 -translate-x-1/2"></div>

			<div class="flex flex-col items-center gap-2 px-6">
				<div class="flex h-16 w-16 items-center justify-center rounded-full border border-glass-border bg-base-mist p-2.5">
					<img src="/ctftc.png" alt="CT FIRST Tech Challenge logo" class="h-full w-full object-contain invert" />
				</div>
				<p class="text-lg font-bold text-ink-900">CTFTC</p>
				<p class="text-[0.65rem] font-semibold tracking-[0.2em] text-robotics-blue uppercase">Admin sign in</p>
			</div>

			<div class="badge-perforation my-5"></div>

			<div class="flex flex-col gap-4 px-6">
				{#if errorMessage}
					<div class="error-banner text-left">{errorMessage}</div>
				{/if}

				<a href="/admin/login/google" data-sveltekit-reload class="btn-secondary w-full">
					<svg viewBox="0 0 48 48" class="h-4 w-4 shrink-0" aria-hidden="true">
						<path fill="#4285f4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h11.9c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.6Z" />
						<path fill="#34a853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41 15.4 46 24 46Z" />
						<path fill="#fbbc05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5A22 22 0 0 0 2 24c0 3.5.8 6.9 2.5 9.9l7.3-5.6Z" />
						<path fill="#eb4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8.1 7 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9.1 12.2-9.1Z" />
					</svg>
					Continue with Google
				</a>

				<div class="flex items-center gap-3">
					<div class="h-px flex-1 bg-border-subtle"></div>
					<span class="text-[11px] font-semibold tracking-wide text-ink-400 uppercase">or</span>
					<div class="h-px flex-1 bg-border-subtle"></div>
				</div>

				<form
					method="POST"
					class="space-y-3 text-left"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<div>
						<label for="email" class="admin-label">Email</label>
						<input id="email" name="email" type="email" required autocomplete="email" class="glass-input" />
					</div>
					<div>
						<label for="password" class="admin-label">Password</label>
						<input id="password" name="password" type="password" required autocomplete="current-password" class="glass-input" />
					</div>
					<button type="submit" disabled={loading} class="btn-primary w-full">
						{loading ? 'Signing in…' : 'Sign in'}
					</button>
				</form>
			</div>

			<div class="badge-barcode mt-5 px-6" aria-hidden="true"></div>
		</div>
	</div>
</div>

<style>
	.lanyard-rig {
		transform: translateX(0) translateY(0) rotate(0deg);
		transform-origin: top center;
		animation: lanyard-drop 1100ms cubic-bezier(0.32, 0.72, 0.35, 1) both;
	}

	.lanyard-strings {
		position: relative;
		width: 3.25rem;
		height: 18vh;
	}

	.lanyard-strap {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0.9rem;
		height: 18vh;
		margin-left: -0.45rem;
		transform-origin: bottom center;
		background: repeating-linear-gradient(
			to bottom,
			var(--color-robotics-blue) 0px,
			var(--color-robotics-blue) 22px,
			var(--color-robotics-blue-deep) 22px,
			var(--color-robotics-blue-deep) 26px
		);
		box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.25);
	}

	/* the pair meets at the clip and fans out 15deg either side (30deg total),
	   like a strap that splits in two on its way up around the neck */
	.lanyard-strap--left {
		transform: rotate(-15deg);
	}
	.lanyard-strap--right {
		transform: rotate(15deg);
	}

	.lanyard-clip {
		width: 3.25rem;
		height: 1.1rem;
		margin-top: -2px;
		border-radius: 0.25rem;
		background: #334155;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.badge-hole {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 999px;
		background: var(--color-base-mist);
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
	}

	.badge-perforation {
		border-top: 1.5px dashed var(--color-glass-border);
		position: relative;
	}
	.badge-perforation::before,
	.badge-perforation::after {
		content: '';
		position: absolute;
		top: -5px;
		width: 10px;
		height: 10px;
		border-radius: 999px;
		background: var(--color-base-mist);
	}
	.badge-perforation::before {
		left: -5px;
	}
	.badge-perforation::after {
		right: -5px;
	}

	.badge-barcode {
		height: 1.75rem;
		background: repeating-linear-gradient(
			to right,
			var(--color-ink-400) 0px,
			var(--color-ink-400) 2px,
			transparent 2px,
			transparent 5px
		);
		opacity: 0.4;
	}

	@keyframes lanyard-drop {
		0% {
			transform: translateY(-60vh) rotate(0deg);
			opacity: 0;
		}
		8% {
			opacity: 1;
		}
		52% {
			transform: translateY(0) rotate(-9deg);
		}
		68% {
			transform: translateY(0) rotate(6deg);
		}
		81% {
			transform: translateY(0) rotate(-3deg);
		}
		91% {
			transform: translateY(0) rotate(1.5deg);
		}
		100% {
			transform: translateY(0) rotate(0deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lanyard-rig {
			animation: none;
		}
	}
</style>
