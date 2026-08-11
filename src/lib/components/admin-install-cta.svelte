<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Download, X, Share } from '@lucide/svelte';
	import { isStandalone, isIos } from '$lib/client/pwa';

	const DISMISS_KEY = 'admin-install-cta-dismissed';

	let visible = $state(false);
	let showIosSteps = $state(false);
	let deferredPrompt: any = null;
	let reduceMotion = $state(false);

	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return;

		if (isIos()) {
			// Safari never fires beforeinstallprompt - show static instructions.
			visible = true;
			return;
		}

		const onBeforeInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			visible = true;
		};
		window.addEventListener('beforeinstallprompt', onBeforeInstall);
		return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
	});

	function dismiss() {
		visible = false;
		showIosSteps = false;
		sessionStorage.setItem(DISMISS_KEY, '1');
	}

	async function install() {
		if (isIos()) {
			showIosSteps = true;
			return;
		}
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		await deferredPrompt.userChoice;
		deferredPrompt = null;
		visible = false;
	}
</script>

{#if visible}
	<div
		class="admin-install-cta md:hidden"
		role="status"
		transition:fly={{ y: -24, duration: reduceMotion ? 0 : 220 }}
	>
		{#if showIosSteps}
			<p class="admin-install-cta-text">
				Tap <Share class="inline h-3.5 w-3.5 -translate-y-0.5" strokeWidth={2.5} /> then "Add to Home Screen".
			</p>
		{:else}
			<button type="button" class="admin-install-cta-action dock-tap" onclick={install}>
				<Download class="h-4 w-4" strokeWidth={2.5} />
				Add to home screen
			</button>
		{/if}
		<button type="button" class="admin-install-cta-dismiss dock-tap" onclick={dismiss} aria-label="Dismiss">
			<X class="h-3.5 w-3.5" strokeWidth={2.5} />
		</button>
	</div>
{/if}

<style>
	.admin-install-cta {
		position: sticky;
		top: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin: 0.75rem 1rem 0;
		padding: 0.55rem 0.75rem;
		border-radius: 0.85rem;
		background: rgba(29, 78, 216, 0.92);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		color: #fff;
		box-shadow: 0 6px 20px rgba(29, 78, 216, 0.35);
	}

	.admin-install-cta-text {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.admin-install-cta-action {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: #fff;
	}

	.admin-install-cta-dismiss {
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.8);
	}
</style>
