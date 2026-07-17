<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import GlassTile from '$lib/components/ui/GlassTile.svelte';
	import { revealTiles } from '$lib/motion';

	let iframeHeight = $state('850px');
	let showHelp = $state(false);

	onMount(() => {
		revealTiles('.bento-tile');
	});
</script>

<svelte:head>
	<title>Team Directory - CT FTC</title>
</svelte:head>

<main class="aurora-field min-h-screen pb-24">
	<section class="max-w-7xl mx-auto px-6 pt-24 pb-10">
		<GlassTile strong class="bento-tile relative space-y-6 text-left" rounded="rounded-[2.5rem]" padding="p-10 md:p-14">
			<div class="absolute top-6 right-6 sm:top-8 sm:right-8">
				<button
					onclick={() => (showHelp = !showHelp)}
					aria-expanded={showHelp}
					aria-label="Didn't find your team?"
					class="w-10 h-10 rounded-full glass-tile flex items-center justify-center text-ink-600 hover:text-robotics-blue transition-colors"
				>
					<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 17.25h.008v.008H12v-.008Z" />
					</svg>
				</button>

				{#if showHelp}
					<div
						transition:scale={{ duration: 180, start: 0.95 }}
						class="glass-tile glass-tile-strong absolute right-0 mt-3 w-72 rounded-2xl p-5 text-left z-30"
					>
						<h3 class="text-sm font-semibold text-ink-900 mb-2">Didn't find your team?</h3>
						<p class="text-xs text-ink-600 leading-relaxed mb-4">
							Make sure your team's registration is fully processed on the official <span class="text-robotics-blue font-medium">FIRST Dashboard</span>.
						</p>
						<a
							href="https://firstinspires.org"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 text-xs font-semibold text-robotics-blue hover:underline"
						>
							Official dashboard &rarr;
						</a>
					</div>
				{/if}
			</div>

			<h1 class="text-4xl md:text-6xl font-bold text-ink-900 tracking-tight">
				Team <span class="text-robotics-blue">Directory</span>
			</h1>
			<p class="max-w-2xl text-ink-600 text-base md:text-lg leading-relaxed">
				Powered by Robolyst — browse every team in Connecticut, their match history, and event performance.
			</p>
		</GlassTile>
	</section>

	<section class="max-w-7xl mx-auto px-6 py-6">
		<GlassTile class="bento-tile" rounded="rounded-[2.5rem]" padding="p-4 md:p-6">
			<div class="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl glass-tile !p-4 mb-4">
				<div class="flex items-center gap-3">
					<div class="flex gap-1.5">
						<div class="h-3 w-3 rounded-full bg-white/70"></div>
						<div class="h-3 w-3 rounded-full bg-white/70"></div>
						<div class="h-3 w-3 rounded-full bg-white/70"></div>
					</div>
					<span class="pl-2 text-xs font-semibold tracking-wide text-ink-400">Team list</span>
				</div>

				<a
					href="https://robolyst.org"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-full glass-tile !p-0 px-4 py-1.5 text-xs font-semibold text-robotics-blue"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-aurora-gold animate-pulse"></span>
					robolyst.org
				</a>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-white">
				<iframe
					src="https://robolyst.org/location/connecticut/ftc/teams"
					title="CT FTC Team Atlas"
					width="100%"
					height={iframeHeight}
					frameborder="0"
					allowfullscreen
					class="block w-full bg-white"
				></iframe>
			</div>
		</GlassTile>
	</section>
</main>
