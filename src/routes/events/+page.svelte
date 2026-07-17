<script lang="ts">
    import { onMount } from 'svelte';
    import { formatEventDate } from '$lib/format';
    import { revealTiles } from '$lib/motion';
    import GlassTile from '$lib/components/ui/GlassTile.svelte';
    import BentoGrid from '$lib/components/ui/BentoGrid.svelte';

    let { data } = $props();

    let currentTab = $state('upcoming');

    let activeEvents = $derived(currentTab === 'upcoming' ? data.upcoming : data.past);
    let featured = $derived(currentTab === 'upcoming' && activeEvents.length > 0 ? activeEvents[0] : null);
    let rest = $derived(featured ? activeEvents.slice(1) : activeEvents);

    const typeStyles: Record<string, string> = {
        'Scrimmage': 'text-emerald-700',
        'Qualifier': 'text-robotics-blue',
        'Championship': 'text-amber-700'
    };

    function volunteerStats(event: any) {
        const current = event.volunteersCurrent ?? 0;
        const required = event.volunteersNeeded ?? 0;
        const pct = required > 0 ? Math.min((current / required) * 100, 100) : 0;
        return { current, required, pct, needsVolunteers: required > current };
    }

    onMount(() => {
        revealTiles('.bento-tile');
    });
</script>

<main class="aurora-field w-full min-h-screen pb-32">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-6">

        <GlassTile strong class="bento-tile" rounded="rounded-[2.5rem]" padding="p-8 md:p-10">
            <h1 class="text-4xl md:text-5xl font-bold text-ink-900 tracking-tight">
                Event schedule
            </h1>
            <p class="mt-3 text-base text-ink-600 max-w-2xl">
                Find upcoming competitions, view event details, and sign up to volunteer for our teams.
            </p>

            <div class="mt-8 inline-flex items-center gap-1 p-1 rounded-full bg-white/40">
                <button
                    onclick={() => currentTab = 'upcoming'}
                    class="px-6 py-2 rounded-full text-sm font-semibold transition-all
                    {currentTab === 'upcoming' ? 'bg-robotics-blue text-white shadow-ambient' : 'text-ink-600 hover:text-ink-900'}"
                >
                    Upcoming
                </button>
                <button
                    onclick={() => currentTab = 'past'}
                    class="px-6 py-2 rounded-full text-sm font-semibold transition-all
                    {currentTab === 'past' ? 'bg-robotics-blue text-white shadow-ambient' : 'text-ink-600 hover:text-ink-900'}"
                >
                    Past
                </button>
            </div>
        </GlassTile>

        {#if activeEvents.length === 0}
            <GlassTile class="bento-tile text-center max-w-xl mx-auto space-y-4" rounded="rounded-[2.5rem]" padding="p-12">
                <div class="w-16 h-16 glass-tile rounded-full flex items-center justify-center mx-auto text-ink-600">
                    <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-ink-900 text-lg">No events found</h3>
                    <p class="text-sm text-ink-600 mt-2">There are currently no events listed under the {currentTab} tab.</p>
                </div>
            </GlassTile>
        {:else}
            {#if featured}
                {@const stats = volunteerStats(featured)}
                <GlassTile strong class="bento-tile" rounded="rounded-[2.5rem]" padding="p-8 md:p-12">
                    <div class="grid lg:grid-cols-12 gap-8 items-center">
                        <div class="lg:col-span-8 text-left space-y-4">
                            <div class="flex items-center gap-3 flex-wrap">
                                <span class="text-xs font-semibold text-robotics-blue bg-white/60 px-3 py-1 rounded-full">Next up</span>
                                <span class="text-xs font-semibold {typeStyles[featured.type] || 'text-ink-400'}">{featured.type || 'Tournament'}</span>
                                {#if stats.needsVolunteers}
                                    <span class="text-xs font-semibold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">Needs volunteers</span>
                                {/if}
                            </div>

                            <h2 class="text-3xl md:text-4xl font-bold text-ink-900 tracking-tight">{featured.name}</h2>

                            <div class="flex flex-wrap gap-4 text-sm text-ink-600">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>
                                    {formatEventDate(featured.startDate)}
                                </span>
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    {featured.location}
                                </span>
                            </div>

                            <a
                                href="/events/{featured.slug || featured.id}"
                                class="inline-flex items-center gap-2 bg-robotics-blue text-white font-semibold text-sm py-3 px-6 rounded-full shadow-ambient shadow-ambient-hover transition-all hover:-translate-y-0.5"
                            >
                                View details &amp; volunteer
                            </a>
                        </div>

                        <div class="lg:col-span-4">
                            <div class="glass-tile !p-6 rounded-3xl text-center space-y-3">
                                <div>
                                    {#if stats.required === 0}
                                        <span class="text-sm font-semibold text-ink-400">No volunteers needed</span>
                                    {:else}
                                        <div class="text-3xl font-bold text-robotics-blue tracking-tight">{stats.current}<span class="text-ink-400 text-lg font-semibold"> / {stats.required}</span></div>
                                        <span class="text-xs font-semibold text-ink-400">volunteers signed up</span>
                                    {/if}
                                </div>
                                {#if stats.required > 0}
                                    <div class="w-full h-2 rounded-full bg-white/50 overflow-hidden">
                                        <div
                                            class="h-full rounded-full transition-all duration-700 ease-out"
                                            class:bg-amber-400={stats.pct < 50}
                                            class:bg-robotics-blue={stats.pct >= 50 && stats.pct < 100}
                                            class:bg-emerald-500={stats.pct >= 100}
                                            style="width: {stats.pct}%"
                                        ></div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </GlassTile>
            {/if}

            {#if rest.length > 0}
                <BentoGrid minTile="280px" class="pb-12">
                    {#each rest as event (event.id)}
                        {@const stats = volunteerStats(event)}

                        <GlassTile class="bento-tile flex flex-col justify-between text-left" rounded="rounded-[2rem]" padding="p-6">
                            <div>
                                <div class="flex justify-between items-start mb-5 gap-2">
                                    <span class="text-xs font-semibold {typeStyles[event.type] || 'text-ink-400'}">
                                        {event.type || 'Tournament'}
                                    </span>
                                    {#if stats.needsVolunteers && currentTab === 'upcoming'}
                                        <span class="text-xs font-semibold text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-full">
                                            Needs volunteers
                                        </span>
                                    {/if}
                                </div>

                                <h3 class="text-xl font-semibold text-ink-900 leading-tight mb-1">
                                    {event.name}
                                </h3>

                                <div class="mt-4 space-y-3 text-sm text-ink-600">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60">
                                            <svg class="w-4 h-4 text-ink-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z" />
                                            </svg>
                                        </div>
                                        <span>{formatEventDate(event.startDate)}</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60">
                                            <svg class="w-4 h-4 text-ink-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                        </div>
                                        <span class="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-8 pt-5 border-t border-white/60">
                                <div class="flex justify-between items-center text-xs mb-3 font-semibold text-ink-600">
                                    <span>Volunteers</span>
                                    {#if stats.required === 0}
                                        <span class="text-ink-400">None needed</span>
                                    {:else if stats.pct >= 100}
                                        <span class="text-emerald-700">Filled &#10003;</span>
                                    {:else}
                                        <span>{stats.current} / {stats.required}</span>
                                    {/if}
                                </div>

                                <div class="w-full h-2 rounded-full bg-white/50 overflow-hidden">
                                    <div
                                        class="h-full rounded-full transition-all duration-700 ease-out"
                                        class:bg-amber-400={stats.pct < 50}
                                        class:bg-robotics-blue={stats.pct >= 50 && stats.pct < 100}
                                        class:bg-emerald-500={stats.pct >= 100}
                                        style="width: {stats.required > 0 ? stats.pct : 0}%"
                                    ></div>
                                </div>
                            </div>

                            <div class="mt-8">
                                <a
                                    href="/events/{event.slug || event.id}"
                                    class="flex items-center justify-center w-full bg-robotics-blue text-white font-semibold text-sm py-3 px-4 rounded-full shadow-ambient shadow-ambient-hover transition-all hover:-translate-y-0.5"
                                >
                                    View details
                                </a>
                            </div>
                        </GlassTile>
                    {/each}
                </BentoGrid>
            {/if}
        {/if}
    </div>
</main>
