<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import GlassTile from '$lib/components/ui/GlassTile.svelte';
  import GlassButton from '$lib/components/ui/GlassButton.svelte';

  let isLoaded = $state(false);

  onMount(() => {
    isLoaded = true;
  });
</script>

<svelte:head>
  <title>Page Not Found | Connecticut FTC</title>
</svelte:head>

<main class="aurora-field min-h-screen flex items-center justify-center p-6">
  {#if isLoaded}
    <div in:fly={{ y: 20, duration: 500 }} class="max-w-2xl w-full">
      <GlassTile strong class="text-center space-y-8" rounded="rounded-[2.5rem]" padding="p-10 md:p-14">
        <span class="inline-flex items-center gap-2 text-xs font-semibold text-robotics-blue bg-white/60 px-4 py-2 rounded-full">
          Error 404
        </span>

        <h1 class="text-5xl md:text-7xl font-bold text-ink-900 leading-[1.03] tracking-tight">
          Page not <span class="text-robotics-blue">found</span>
        </h1>

        <p class="text-ink-600 text-sm md:text-base leading-relaxed max-w-md mx-auto">
          The link you followed might be broken, or the page has been moved. Use the links below to get back on track.
        </p>

        <div class="glass-tile !p-6 rounded-[2rem] max-w-md mx-auto space-y-3 text-left">
          <span class="text-xs font-semibold text-ink-400 block mb-2">Navigation</span>

          <div class="grid grid-cols-1 gap-2">
            <a href="/" class="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all font-medium text-sm text-ink-900">
              <span>&#127968; Home</span>
              <span class="text-xs text-ink-400">&rarr;</span>
            </a>

            <a href="/volunteer" class="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all font-medium text-sm text-ink-900">
              <span>&#128295; Volunteer registration</span>
              <span class="text-xs text-ink-400">&rarr;</span>
            </a>

            <a href="/contact" class="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all font-medium text-sm text-ink-900">
              <span>&#9993;&#65039; Contact us</span>
              <span class="text-xs text-ink-400">&rarr;</span>
            </a>
          </div>
        </div>

        <div class="pt-2">
          <GlassButton variant="primary" onclick={() => history.back()}>
            &larr; Go back
          </GlassButton>
        </div>
      </GlassTile>
    </div>
  {/if}
</main>
