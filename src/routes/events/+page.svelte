<script lang="ts">
    import { fade } from 'svelte/transition';

    // Svelte 5 direct destructuring without explicit interface types
    let { data = { upcoming: [], past: [] } } = $props();
    
    // Svelte 5 state management
    let currentTab = $state('upcoming'); 
    
    // Highly efficient reactive derivation
    let activeEvents = $derived(currentTab === 'upcoming' ? data.upcoming : data.past);

    function formatDate(dateString: string) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Modern badge styling map
    const typeStyles: Record<string, string> = {
        'Scrimmage': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        'Qualifier': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'Championship': 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    };
</script>

<div class="w-full min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-20 selection:bg-blue-500 selection:text-white relative">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10 relative z-10">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Tournament Schedule</h1>
                <p class="text-sm font-medium text-slate-500 mt-1">Explore upcoming events and register to support our teams.</p>
            </div>

            <div class="bg-slate-200/80 p-1 rounded-xl flex items-center border border-slate-300/30 backdrop-blur-sm">
                <button 
                    onclick={() => currentTab = 'upcoming'}
                    class="px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200
                    {currentTab === 'upcoming' ? 'bg-white text-blue-600 shadow-md shadow-slate-300/50' : 'text-slate-600 hover:text-slate-900'}"
                >
                    Upcoming
                </button>
                <button 
                    onclick={() => currentTab = 'past'}
                    class="px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200
                    {currentTab === 'past' ? 'bg-white text-blue-600 shadow-md shadow-slate-300/50' : 'text-slate-600 hover:text-slate-900'}"
                >
                    Archived
                </button>
            </div>
        </div>

        {#if activeEvents.length === 0}
            <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto" in:fade>
                <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <h3 class="font-bold text-slate-800 text-lg">No sessions available</h3>
                <p class="text-sm text-slate-500 mt-1 max-w-xs mx-auto">There are currently no {currentTab} events listed.</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {#each activeEvents as event (event.id)}
                    {@const current = event.volunteersCurrent ?? 0}
                    {@const required = event.volunteersNeeded ?? 0}
                    {@const pct = required > 0 ? Math.min((current / required) * 100, 100) : 0}
                    {@const needsVolunteers = required > current}

                    <div class="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group">
                        <div>
                            <div class="flex justify-between items-center mb-5">
                                <span class="px-2.5 py-1 text-xs font-bold border rounded-md tracking-wide shadow-sm {typeStyles[event.type] || 'bg-slate-100 text-slate-600 border-slate-200'}">
                                    {event.type || 'Tournament'}
                                </span>
                                {#if needsVolunteers && currentTab === 'upcoming'}
                                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md animate-pulse">
                                        Volunteer Needed
                                    </span>
                                {/if}
                            </div>

                            <h3 class="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                {event.name}
                            </h3>
                            
                            <div class="mt-4 space-y-2.5 text-sm font-semibold text-slate-600">
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-slate-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    <span class="truncate">{event.location}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-slate-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>
                                    <span class="text-slate-500">{formatDate(event.startDate)}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 pt-5 border-t border-slate-100 space-y-2">
                            <div class="flex justify-between items-center text-xs font-bold">
                                <span class="text-slate-500">Volunteer Staffing</span>
                                {#if required === 0}
                                    <span class="text-slate-400">No slots open</span>
                                {:else if pct >= 100}
                                    <span class="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Filled ✓</span>
                                {:else}
                                    <span class="text-slate-700">{current} / {required} full</span>
                                {/if}
                            </div>

                            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30">
                                <div 
                                    class="h-full rounded-full transition-all duration-500 bg-gradient-to-r"
                                    class:from-amber-400={pct < 50}
                                    class:to-orange-400={pct < 50}
                                    class:from-blue-500={pct >= 50 && pct < 100}
                                    class:to-indigo-500={pct >= 50 && pct < 100}
                                    class:from-emerald-500={pct >= 100}
                                    class:to-teal-500={pct >= 100}
                                    style="width: {required > 0 ? pct : 0}%"
                                ></div>
                            </div>
                        </div>

                        <div class="mt-6">
                            <a 
                                href="/events/{event.id}" 
                                class="flex items-center justify-center gap-1.5 w-full bg-slate-900 hover:bg-blue-600 text-white text-center font-bold py-3 px-4 text-xs tracking-wide rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
                            >
                                <span>View Event Details</span>
                                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>