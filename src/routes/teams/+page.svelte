<script>
    import { onMount } from 'svelte';

    // --- SVELTE 5 STATE RUNES ---
    let isLoaded = $state(false);
    let scrollY = $state(0);
    let iframeHeight = $state('850px');

    // --- DERIVED PARALLAX RUNES ---
    let parallaxHeaderY = $derived(scrollY * 0.25);
    let consoleTilt = $derived(Math.min(scrollY * 0.05, 12));

    onMount(() => {
        setTimeout(() => (isLoaded = true), 50);
    });
</script>

<svelte:window bind:scrollY />

<svelte:head>
    <title>CT Team Explorer Control Deck - CT FTC</title>
</svelte:head>

<main class="relative min-h-screen overflow-x-hidden bg-[#eef2f7] pb-24 text-[#1a1a1a]">
    <div class="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.03]"></div>

    <section
        class="relative border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7] px-6 pt-20 pb-12"
    >
        <div
            class="z-10 mx-auto max-w-7xl space-y-6 text-left"
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
                Powered by Robolyst, analyze all teams in CT see their match history as well as info about
                their team.
            </p>
        </div>
    </section>

    <section class="relative z-20 mx-auto max-w-7xl px-6 py-16">
        <div
            class="shadow-neumorphic-outer relative w-full rounded-[3.5rem] border-2 border-white/60 bg-[#eef2f7] p-5 transition-transform duration-300 ease-out"
            style="transform: rotateX({consoleTilt}deg)"
        >
            <div
                class="shadow-neumorphic-inner relative flex h-full w-full flex-col overflow-hidden rounded-[2.8rem] border border-slate-200/60 bg-[#eef2f7] p-4"
            >
                <div
                    class="box-shadow-flat mb-4 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-black bg-white bg-gradient-to-r from-white to-slate-50 px-6 py-4 sm:flex-row"
                >
                    <div class="flex items-center gap-3">
                        <div class="flex gap-1.5">
                            <div
                                class="h-3.5 w-3.5 rounded-full border border-slate-300 bg-[#eef2f7] shadow-inner"
                            ></div>
                            <div
                                class="h-3.5 w-3.5 rounded-full border border-slate-300 bg-[#eef2f7] shadow-inner"
                            ></div>
                            <div
                                class="h-3.5 w-3.5 rounded-full border border-slate-300 bg-[#eef2f7] shadow-inner"
                            ></div>
                        </div>
                        <span
                            class="pl-2 font-mono text-[11px] font-black tracking-widest text-slate-400 uppercase"
                            >Team List</span
                        >
                    </div>

                    <div
                        class="flex items-center gap-2 rounded-lg border-2 border-black bg-slate-900 px-4 py-1.5 font-mono text-xs font-bold tracking-tight text-emerald-400 shadow-inner"
                    >
                        <span class="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400"></span>
                        <a href="https://robolyst.org" target="_blank" rel="noopener noreferrer">
                            robolyst.org
                        </a>
                    </div>
                </div>

                <div
                    class="relative z-10 overflow-hidden rounded-2xl border-4 border-black bg-white shadow-2xl"
                >
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
            </div>
        </div>
    </section>

    <section class="relative z-20 mx-auto max-w-5xl px-1 py-4">
        <div
            class="box-shadow-flat group flex flex-col items-center justify-between gap-2 rounded-[2.5rem] border-4 border-black bg-white p-8 text-left md:flex-row md:p-12"
        >
            <div class="space-y-2">
                <h3 class="text-2xl font-black tracking-tight text-black uppercase">
                    Didn't find your team?
                </h3>
                <p class="max-w-xl text-sm leading-relaxed font-semibold text-slate-600">
                    Ensure your team information registration fields are completely processed on the central <span
                        class="text-[#2563eb]">FIRST Dashboard</span
                    >
                </p>
            </div>

            <a
                href="https://firstinspires.org"
                target="_blank"
                rel="noopener noreferrer"
                class="skeuo-button shadow-skeuo min-w-[200px] shrink-0 rounded-2xl border-2 border-black bg-[#facc15] px-8 py-4.5 text-center text-sm font-black tracking-wider text-black uppercase transition-all hover:translate-y-[1px] active:translate-y-[4px]"
            >
                Official Dashboard &rarr;
            </a>
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

    /* Tactile Soft Raised Neomorphic Chassis Shadow Layers */
    .shadow-neumorphic-outer {
        box-shadow:
            14px 14px 32px #bdc7d4,
            -14px -14px 32px #ffffff,
            inset 1px 1px 0px rgba(255, 255, 255, 0.9);
    }

    /* Deep Recessed Inverted Neomorphic Well Insets */
    .shadow-neumorphic-inner {
        box-shadow:
            inset 6px 6px 14px #cad4e2,
            inset -6px -6px 14px #ffffff;
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
