<script lang="ts">
    import { fade } from 'svelte/transition';
    import { Radar } from '@lucide/svelte';
    import { robolystEventUrl } from '$lib/robolyst';

    interface EventItem {
        id: string | number;
        name: string;
        type?: string;
        startDate?: string;
        location?: string;
        volunteersNeeded?: number;
        slug?: string;
    }

    interface PageData {
        upcoming: EventItem[];
        past: EventItem[];
    }

    let { data = { upcoming: [], past: [] } }: { data?: PageData } = $props();

    let currentTab = $state<'upcoming' | 'past'>('upcoming');

    let activeEvents = $derived(currentTab === 'upcoming' ? data.upcoming : data.past);

    function formatDate(dateString?: string) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Exact brand mapping per event type. Keyed lowercase since PocketBase
    // data casing isn't guaranteed to match ("scrimmage" vs "Scrimmage") -
    // matching case-sensitively silently fell through to the grey default.
    const typeStyles: Record<string, string> = {
        scrimmage: 'bg-[#FF8C00] text-slate-900 border-2 border-slate-900',
        qualifier: 'bg-[#0066FF] text-white border-2 border-slate-900',
        championship: 'bg-[#FFD700] text-slate-900 border-2 border-slate-900'
    };

    // Top accent bar color per event type - same mapping as the badge, just
    // the raw hex since it's used as a plain background color, not a class.
    const typeAccent: Record<string, string> = {
        scrimmage: '#FF8C00',
        qualifier: '#0066FF',
        championship: '#FFD700'
    };

    function typeKey(type?: string): string {
        return (type || 'scrimmage').trim().toLowerCase();
    }
</script>

<div class="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-32 selection:bg-slate-900 selection:text-white relative overflow-x-hidden">

    <div class="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_2px,transparent_2px),linear-gradient(to_bottom,#cbd5e1_2px,transparent_2px)] bg-[size:40px_40px] opacity-40 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-12 relative z-10">

        <div class="border-b-4 border-slate-900 pb-8 bg-white/80 backdrop-blur-sm p-8 border-2 shadow-[8px_8px_0_0_rgba(15,23,42,1)] rounded-xl">
            <h1 class="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
                Event Schedule
            </h1>
            <p class="mt-3 text-lg font-bold text-slate-700 max-w-2xl">
                Find upcoming competitions, view event details, and sign up to volunteer for our teams.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
                <button
                    onclick={() => currentTab = 'upcoming'}
                    class="px-8 py-3 text-sm font-black uppercase tracking-wide border-2 border-slate-900 rounded-lg transition-all duration-150
                    {currentTab === 'upcoming'
                        ? 'bg-[#fde047] translate-x-[4px] translate-y-[4px] shadow-[0px_0px_0_0_rgba(15,23,42,1)]'
                        : 'bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)]'}"
                >
                    Upcoming
                </button>
                <button
                    onclick={() => currentTab = 'past'}
                    class="px-8 py-3 text-sm font-black uppercase tracking-wide border-2 border-slate-900 rounded-lg transition-all duration-150
                    {currentTab === 'past'
                        ? 'bg-[#fde047] translate-x-[4px] translate-y-[4px] shadow-[0px_0px_0_0_rgba(15,23,42,1)]'
                        : 'bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)]'}"
                >
                    Past
                </button>
            </div>
        </div>

        {#if activeEvents.length === 0}
            <div class="bg-white border-4 border-slate-900 rounded-xl p-12 text-center shadow-[8px_8px_0_0_rgba(15,23,42,1)] max-w-xl mx-auto space-y-4" in:fade>
                <div class="w-16 h-16 bg-[#fca5a5] border-4 border-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
                    <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-black text-slate-900 text-xl uppercase">No events found</h3>
                    <p class="text-base font-bold text-slate-600 mt-2">There are currently no events listed under the {currentTab} tab.</p>
                </div>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-12">
                {#each activeEvents as event (event.id)}
                    {@const required = event.volunteersNeeded ?? 0}
                    {@const needsVolunteers = required > 0}
                    {@const robolystUrl = robolystEventUrl(event.startDate, event.slug)}

                    <a
                        href="/events/{event.slug || event.id}"
                        class="scroll-animate-card bg-white border-4 border-slate-900 rounded-xl overflow-hidden shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all duration-200 group flex flex-col"
                    >
                        <div
                            class="flex items-start justify-between gap-2 px-6 py-4 border-b-4 border-slate-900"
                            style="background-color: {typeAccent[typeKey(event.type)] ?? '#cbd5e1'}"
                        >
                            <span class="px-3 py-1 text-xs font-black uppercase tracking-wide {typeStyles[typeKey(event.type)] || 'bg-slate-200 text-slate-900 border-2 border-slate-900'}">
                                {event.type || 'Scrimmage'}
                            </span>
                            {#if needsVolunteers && currentTab === 'upcoming'}
                                <span class="text-xs font-black uppercase tracking-wide text-slate-900 bg-[#fca5a5] border-2 border-slate-900 px-3 py-1">
                                    Needs Volunteers
                                </span>
                            {/if}
                        </div>

                        <div class="p-6 flex flex-col justify-between flex-1">
                        <div>
                            <h3 class="text-2xl font-black text-slate-900 leading-tight border-b-2 border-transparent group-hover:border-slate-900 transition-colors inline-block mb-1">
                                {event.name}
                            </h3>

                            <div class="mt-4 space-y-3 text-sm font-bold text-slate-700">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 flex items-center justify-center border-2 border-slate-900 bg-slate-100 rounded-md">
                                        <svg class="w-4 h-4 text-slate-900 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                    </div>
                                    <span>{formatDate(event.startDate)}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 flex items-center justify-center border-2 border-slate-900 bg-slate-100 rounded-md">
                                        <svg class="w-4 h-4 text-slate-900 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </div>
                                    <span class="truncate">{event.location || 'Location TBD'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 pt-5 border-t-4 border-slate-900">
                            <div class="flex justify-between items-center text-sm font-black uppercase">
                                <span>Volunteers needed</span>
                                {#if required === 0}
                                    <span class="text-slate-500">None</span>
                                {:else}
                                    <span class="text-slate-900 bg-[#fde047] border-2 border-slate-900 px-2 py-0.5">{required}</span>
                                {/if}
                            </div>
                        </div>

                        <div class="mt-8 flex gap-2">
                            {#if robolystUrl}
                                <button
                                    type="button"
                                    onclick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(robolystUrl, '_blank', 'noopener,noreferrer'); }}
                                    class="flex shrink-0 items-center justify-center gap-1.5 bg-white text-slate-900 font-black uppercase tracking-widest py-3 px-4 border-2 border-slate-900 rounded-lg shadow-[3px_3px_0_0_rgba(15,23,42,1)] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_0_rgba(15,23,42,1)] transition-all duration-150"
                                    aria-label="View on Robolyst"
                                    title="View on Robolyst"
                                >
                                    <Radar class="h-4 w-4" strokeWidth={2.5} />
                                </button>
                            {/if}
                            <span
                                class="flex flex-1 items-center justify-center bg-slate-900 text-white font-black uppercase tracking-widest py-3 px-4 border-2 border-slate-900 rounded-lg group-hover:bg-[#fde047] group-hover:text-slate-900 transition-colors duration-200"
                            >
                                View Details
                            </span>
                        </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    /* CSS Native Scroll-Driven Animations - Harder pop for brutalism */
    @keyframes card-reveal-brutal {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .scroll-animate-card {
        animation-name: card-reveal-brutal;
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation-fill-mode: both;
        animation-timeline: view();
        animation-range: entry 5% entry 20%;
    }

    @supports not (animation-timeline: view()) {
        .scroll-animate-card {
            animation: none;
            opacity: 1;
            transform: none;
        }
    }
</style>
