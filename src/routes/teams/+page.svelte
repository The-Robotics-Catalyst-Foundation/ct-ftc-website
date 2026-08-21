<script>
    import { onMount } from 'svelte';
    import { CircleHelp, X } from '@lucide/svelte';
    import TeamMap from '$lib/components/team-map.svelte';

    let { data } = $props();

    // --- SVELTE 5 STATE RUNES ---
    let isLoaded = $state(false);
    let scrollY = $state(0);
    let helpOpen = $state(false);
    let helpWrapper = $state();

    // --- DERIVED PARALLAX RUNES ---
    let parallaxHeaderY = $derived(scrollY * 0.25);

    onMount(() => {
        setTimeout(() => (isLoaded = true), 50);

        // Robolyst's embed widget expects its own <script> tag to run after
        // the data-robolyst-embed div is in the DOM - Svelte doesn't execute
        // <script> tags written directly in markup, so it's added manually.
        const script = document.createElement('script');
        script.src = 'https://robolyst.org/embed.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    });

    function toggleHelp() {
        helpOpen = !helpOpen;
    }

    /** @param {MouseEvent} e */
    function handleWindowClick(e) {
        if (helpOpen && helpWrapper && !helpWrapper.contains(e.target)) {
            helpOpen = false;
        }
    }

    /** @param {KeyboardEvent} e */
    function handleWindowKeydown(e) {
        if (e.key === 'Escape') helpOpen = false;
    }
</script>

<svelte:window bind:scrollY onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<main class="relative min-h-screen overflow-x-clip bg-[#eef2f7] pb-24 text-[#1a1a1a]">
    <div class="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.03]"></div>

    <section
        class="relative border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7] px-6 pt-20 pb-12"
    >
        <div class="relative mx-auto max-w-7xl" bind:this={helpWrapper}>
            <button
                type="button"
                onclick={toggleHelp}
                aria-expanded={helpOpen}
                aria-controls="team-directory-help"
                aria-label="Didn't find your team? Get help"
                class="box-shadow-flat absolute top-0 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-white text-black transition-transform hover:-translate-y-0.5"
            >
                <CircleHelp class="h-5 w-5" strokeWidth={2.5} />
            </button>

            {#if helpOpen}
                <div
                    id="team-directory-help"
                    role="dialog"
                    aria-label="Didn't find your team?"
                    class="box-shadow-flat absolute top-14 right-6 z-30 w-[min(20rem,calc(100vw-3rem))] rounded-[1.75rem] border-4 border-black bg-white p-6 text-left"
                >
                    <button
                        type="button"
                        onclick={toggleHelp}
                        aria-label="Close"
                        class="absolute top-2 right-2 flex h-11 w-11 items-center justify-center text-slate-400 transition-colors hover:text-black"
                    >
                        <X class="h-4 w-4" strokeWidth={2.5} />
                    </button>

                    <p class="pr-6 text-lg font-black tracking-tight text-black uppercase">
                        Didn't find your team?
                    </p>
                    <p class="mt-2 text-sm leading-relaxed font-semibold text-slate-600">
                        Ensure your team information registration fields are completely processed on the
                        central <span class="text-[#2563eb]">FIRST Dashboard</span>
                    </p>

                    <a
                        href="https://firstinspires.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="skeuo-button shadow-skeuo mt-4 block rounded-2xl border-2 border-black bg-[#facc15] px-6 py-3 text-center text-xs font-black tracking-wider text-black uppercase transition-all hover:translate-y-[1px] active:translate-y-[4px]"
                    >
                        Official Dashboard &rarr;
                    </a>
                </div>
            {/if}

            <div
                class="z-10 space-y-6 pr-16 text-left"
                style="transform: translateY({parallaxHeaderY}px)"
            >
                <h1
                    class="text-5xl leading-[0.95] font-black tracking-tighter text-black uppercase md:text-7xl"
                >
                    CT Team <span
                        class="box-shadow-flat my-1 inline-block rotate-1 transform border-4 border-black bg-white px-3 text-[#2563eb]"
                        >Directory</span
                    >
                </h1>

                <p
                    class="max-w-2xl rounded-xl border-2 border-black bg-white/40 p-4 text-sm leading-relaxed font-bold text-slate-800 backdrop-blur-sm md:text-lg"
                >
                    Powered by <a href="https://robolyst.org" class="inline-flex items-center gap-1.5 align-middle text-black underline"><img src="/robolyst-icon.svg" alt="" width="40" height="40" class="h-6 w-6 object-contain" />Robolyst</a>, analyze all teams in CT see their match history as well as info
                    about their team.
                </p>
            </div>
        </div>
    </section>

    {#if data.teamGroups.length}
        <section class="relative z-10 mx-auto max-w-7xl px-6 pt-12">
            <div class="h-[32rem] w-full md:h-[42rem]">
                <TeamMap teamGroups={data.teamGroups} />
            </div>
        </section>
    {/if}

    <section class="relative z-20 mx-auto max-w-7xl px-6 pt-16 pb-16">
        <div data-robolyst-embed="https://robolyst.org/e/5sdnavv" data-height="600">
          <a href="https://robolyst.org/location/connecticut/ftc">Robolyst — Connecticut</a>
        </div>
    </section>


</main>

<style>
    /* Blueprint Background Vector Mesh Matrix Generator rules */
    .bg-grid-pattern {
        background-size: 40px 40px;
        background-image:
            linear-gradient(to right, #000000 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px);
    }

    /* Analog Mechanical Convex Button Press Shading offsets */
    .shadow-skeuo {
        box-shadow:
            0px 4px 0px #000000,
            4px 8px 16px rgba(0, 0, 0, 0.1);
    }

    .skeuo-button:hover {
        box-shadow:
            0px 3px 0px #000000,
            2px 6px 12px rgba(0, 0, 0, 0.08);
    }

    .skeuo-button:active {
        box-shadow:
            0px 0px 0px #000000,
            0px 2px 4px rgba(0, 0, 0, 0.05);
    }

    /* Flat Brutalist Static Shadow Trims */
    .box-shadow-flat {
        box-shadow: 6px 6px 0px 0px #000000;
    }
</style>
