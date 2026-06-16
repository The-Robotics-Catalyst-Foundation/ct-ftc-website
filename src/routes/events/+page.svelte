<script lang="ts">
    import { fade } from 'svelte/transition';

    let { data = { upcoming: [], past: [] } } = $props();
    
    let currentTab = $state('upcoming'); 
    
    let activeEvents = $derived(currentTab === 'upcoming' ? data.upcoming : data.past);

    function formatDate(dateString: string) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Neo-brutalist badge styling: Bright colors, thick borders, dark text
    const typeStyles: Record<string, string> = {
        'Scrimmage': 'bg-[#86efac] text-slate-900 border-2 border-slate-900', // Bright Green
        'Qualifier': 'bg-[#93c5fd] text-slate-900 border-2 border-slate-900', // Bright Blue
        'Championship': 'bg-[#fde047] text-slate-900 border-2 border-slate-900' // Bright Yellow
    };
</script>

<div class="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased pb-32 selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
    
    <!-- Brutalist Grid Background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_2px,transparent_2px),linear-gradient(to_bottom,#cbd5e1_2px,transparent_2px)] bg-[size:40px_40px] opacity-40 pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-12 relative z-10">
        
        <!-- Brutalist Header & Navigation -->
        <div class="border-b-4 border-slate-900 pb-8 bg-white/80 backdrop-blur-sm p-8 border-2 shadow-[8px_8px_0_0_rgba(15,23,42,1)] rounded-xl">
            <h1 class="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
                Event Schedule
            </h1>
            <p class="mt-3 text-lg font-bold text-slate-700 max-w-2xl">
                Find upcoming competitions, view event details, and sign up to volunteer for our teams.
            </p>

            <!-- Brutalist Tab Switcher -->
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
            <!-- Brutalist Empty State -->
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
            <!-- Event Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-12">
                {#each activeEvents as event (event.id)}
                    {@const current = event.volunteersCurrent ?? 0}
                    {@const required = event.volunteersNeeded ?? 0}
                    {@const pct = required > 0 ? Math.min((current / required) * 100, 100) : 0}
                    {@const needsVolunteers = required > current}

                    <!-- Brutalist Scroll-Animated Card Elements -->
                    <div class="scroll-animate-card bg-white border-4 border-slate-900 rounded-xl p-6 flex flex-col justify-between shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all duration-200 group">
                        
                        <div>
                            <!-- Tags Row -->
                            <div class="flex justify-between items-start mb-5 gap-2">
                                <span class="px-3 py-1 text-xs font-black uppercase tracking-wide {typeStyles[event.type] || 'bg-slate-200 text-slate-900 border-2 border-slate-900'}">
                                    {event.type || 'Tournament'}
                                </span>
                                {#if needsVolunteers && currentTab === 'upcoming'}
                                    <span class="text-xs font-black uppercase tracking-wide text-slate-900 bg-[#fca5a5] border-2 border-slate-900 px-3 py-1">
                                        Needs Volunteers
                                    </span>
                                {/if}
                            </div>

                            <!-- Title -->
                            <h3 class="text-2xl font-black text-slate-900 leading-tight border-b-2 border-transparent group-hover:border-slate-900 transition-colors inline-block mb-1">
                                {event.name}
                            </h3>
                            
                            <!-- Date & Location -->
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
                                    <span class="truncate">{event.location}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Brutalist Volunteer Status Bar -->
                        <div class="mt-8 pt-5 border-t-4 border-slate-900">
                            <div class="flex justify-between items-center text-sm mb-3 font-black uppercase">
                                <span>Volunteers</span>
                                {#if required === 0}
                                    <span class="text-slate-500">None</span>
                                {:else if pct >= 100}
                                    <span class="text-slate-900 bg-[#86efac] border-2 border-slate-900 px-2 py-0.5">Filled ✓</span>
                                {:else}
                                    <span>{current} / {required}</span>
                                {/if}
                            </div>

                            <!-- Hard Box Progress Bar -->
                            <div class="w-full h-4 bg-slate-100 border-2 border-slate-900 overflow-hidden relative">
                                <div 
                                    class="h-full border-r-2 border-slate-900 transition-all duration-700 ease-out absolute left-0 top-0"
                                    class:bg-[#fde047]={pct < 50}
                                    class:bg-[#93c5fd]={pct >= 50 && pct < 100}
                                    class:bg-[#86efac]={pct >= 100}
                                    style="width: {required > 0 ? pct : 0}%"
                                ></div>
                            </div>
                        </div>

                        <!-- Brutalist Action Button -->
                        <div class="mt-8">
                            <a 
                                href="/events/{event.id}" 
                                class="flex items-center justify-center w-full bg-slate-900 text-white font-black uppercase tracking-widest py-3 px-4 border-2 border-slate-900 rounded-lg hover:bg-[#fde047] hover:text-slate-900 transition-colors duration-200"
                            >
                                View Details
                            </a>
                        </div>
                    </div>
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
        /* Snappier bezier curve for a "harder" mechanical feel */
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation-fill-mode: both;
        animation-timeline: view();
        /* Triggers exactly as it enters the viewport */
        animation-range: entry 5% entry 20%;
    }

    /* Fallback for browsers that do not support view-driven animations */
    @supports not (animation-timeline: view()) {
        .scroll-animate-card {
            animation: none;
            opacity: 1;
            transform: none;
        }
    }
</style>