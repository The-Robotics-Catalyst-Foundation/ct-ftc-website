<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { slide, fly } from 'svelte/transition';

  // --- SVELTE 5 STATE RUNES ---
  let events = $state([]);
  let isMapLoading = $state(true);
  let scrollY = $state(0);
  
  const now = new Date().toISOString();

  onMount(async () => {
    try {
      events = await pb.collection('events').getFullList({
        sort: '-date_time'
      });
    } catch (err) {
      console.error('Failed syncing public datastore clusters:', err);
    } finally {
      isMapLoading = false;
    }
  });

  // --- DERIVED DATA STRINGS ---
  let futureEvents = $derived(events.filter(event => event.date_time >= now).reverse());
  let pastEvents = $derived(events.filter(event => event.date_time < now));
  let parallaxHeaderY = $derived(scrollY * 0.25);
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>Tournament Schedule Control Deck | CT FTC</title>
</svelte:head>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] pb-24 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  <section class="relative pt-20 pb-12 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7]">
    <div class="max-w-6xl mx-auto text-left space-y-5 z-10" style="transform: translateY({parallaxHeaderY}px)">
      
      <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-1.5 box-shadow-flat transform -rotate-1">
        <span class="w-2.5 h-2.5 rounded-full bg-black {isMapLoading ? 'animate-ping' : 'animate-pulse'}"></span>
        Active Season Schedule Logs
      </span>
      
      <h1 class="text-4xl md:text-6xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        Tournament <span class="text-[#2563eb] bg-white border-4 border-black px-3 inline-block my-1 box-shadow-flat transform rotate-1">Schedule Deck</span>
      </h1>
      
      <p class="text-slate-800 text-sm md:text-base font-bold max-w-xl bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl leading-relaxed">
        Track synchronized regional tournament calendars, structured qualifiers, local arena map coordinates, and advancement pathways directly across the state sector.
      </p>
    </div>
  </section>

  <div class="max-w-6xl mx-auto px-6 py-12 relative z-20">
    {#if isMapLoading}
      <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[2.5rem] p-8 border-2 border-white/60 space-y-6 animate-pulse">
        <div class="h-6 w-48 bg-slate-400/40 rounded-full"></div>
        <div class="h-24 w-full bg-white border-3 border-black rounded-2xl box-shadow-flat"></div>
        <div class="h-24 w-full bg-white border-3 border-black rounded-2xl box-shadow-flat"></div>
      </div>
    {:else}
      
      <section class="mb-16">
        <div class="mb-6 flex items-center justify-between border-b-2 border-black/10 pb-3">
          <h2 class="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse border border-black/20"></span>
            Upcoming Tournament Pipelines
          </h2>
          <span class="font-mono text-xs font-black opacity-40">[{futureEvents.length} LOOPS FOUND]</span>
        </div>
        
        <div class="space-y-6">
          {#each futureEvents as event}
            <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat hover:translate-y-[-3px] hover:box-shadow-flat-hover transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
              
              <div class="flex items-start gap-4 text-left">
                <div class="w-14 h-14 rounded-2xl bg-[#eef2f7] shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  📅
                </div>
                <div class="space-y-1">
                  <h3 class="text-lg font-black text-black uppercase tracking-tight leading-tight group-hover:text-[#2563eb] transition-colors">
                    {event.name}
                  </h3>
                  <div class="text-xs font-bold text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span class="flex items-center gap-1">📍 {typeof event.location === 'object' ? event.location?.name || event.location?.address : event.location}</span>
                    <span class="text-slate-300 hidden sm:inline">|</span>
                    <span class="font-mono font-black text-[#2563eb] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {new Date(event.date_time).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              </div>

              <div class="shrink-0 w-full md:w-auto">
                <a href="/events/{event.id}" class="skeuo-button w-full md:w-auto block text-center text-xs font-black uppercase tracking-wider text-white bg-[#2563eb] border-2 border-[#1d4ed8] px-6 py-3.5 rounded-xl shadow-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all">
                  Match Details &rarr;
                </a>
              </div>

            </div>
          {:else}
            <div class="text-center p-12 bg-[#eef2f7] shadow-neumorphic-inner border border-dashed border-slate-300 rounded-2xl">
              <span class="text-3xl block mb-2">📡</span>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">No active upcoming sync routines located inside structural data tables.</p>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <div class="mb-6 flex items-center justify-between border-b-2 border-black/10 pb-3">
          <h2 class="text-xl font-black text-slate-500 uppercase tracking-tight flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full bg-slate-400 border border-black/10"></span>
            Historical Match Registry
          </h2>
          <span class="font-mono text-xs font-black opacity-30">[{pastEvents.length} CORES INDEXED]</span>
        </div>
        
        <div class="space-y-4 opacity-90">
          {#each pastEvents as event}
            <div class="bg-white/50 backdrop-blur-sm border-2 border-black/40 p-5 rounded-xl box-shadow-mini hover:translate-y-[-2px] hover:box-shadow-mini-hover transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left group">
              
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-inner border border-slate-300 flex items-center justify-center text-xl shrink-0 grayscale opacity-60">
                  📦
                </div>
                <div class="space-y-0.5">
                  <h3 class="text-base font-black text-slate-700 uppercase tracking-tight line-clamp-1 group-hover:text-black transition-colors">
                    {event.name}
                  </h3>
                  <p class="text-xs font-bold text-slate-500 flex flex-wrap items-center gap-x-2">
                    <span>📍 {typeof event.location === 'object' ? event.location?.name || event.location?.address : event.location}</span>
                    <span class="text-slate-300 font-normal">—</span>
                    <span class="font-mono font-black">{new Date(event.date_time).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </p>
                </div>
              </div>

              <div class="shrink-0 w-full md:w-auto">
                <a href="/events/{event.id}" class="w-full md:w-auto block text-center text-xs font-black uppercase tracking-wider text-slate-700 bg-white border-2 border-black px-5 py-2.5 rounded-lg box-shadow-mini hover:bg-slate-50 active:translate-y-[2px] transition-all">
                  Archived Telemetry
                </a>
              </div>

            </div>
          {:else}
            <div class="text-center p-12 bg-[#eef2f7] shadow-neumorphic-inner border border-dashed border-slate-300 rounded-2xl">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">No archival node streams compiled inside historical data indexes.</p>
            </div>
          {/each}
        </div>
      </section>

    {/if}
  </div>
</main>

<style>
  /* Engineering Vector Blueprint Grid Overlay Mesh */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  /* Soft Outward Neomorphic Ambient Shell Shading */
  .shadow-neumorphic-outer {
    box-shadow: 
      12px 12px 28px #bebebe, 
      -12px -12px 28px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  /* Deep Recessed Inverted Neomorphic Well Insets */
  .shadow-neumorphic-inner {
    box-shadow: 
      inset 5px 5px 10px #cad4e2, 
      inset -5px -5px 10px #ffffff;
  }

  /* Mechanical Skeuomorphic Convex Click Actions */
  .shadow-skeuo {
    box-shadow: 
      0px 4px 0px #1d4ed8,
      4px 8px 12px rgba(0, 0, 0, 0.12);
  }
  
  .skeuo-button:hover {
    box-shadow: 
      0px 3px 0px #1d4ed8,
      2px 5px 8px rgba(0, 0, 0, 0.1);
  }

  .skeuo-button:active {
    box-shadow: 
      0px 0px 0px #1d4ed8,
      0px 1px 3px rgba(0, 0, 0, 0.05);
  }

  /* Structural Heavy Neo-Brutalist Outer Drop Shadows */
  .box-shadow-flat {
    box-shadow: 6px 6px 0px 0px #000000;
  }
  
  .box-shadow-flat-hover {
    box-shadow: 10px 10px 0px 0px #000000;
  }

  .box-shadow-mini {
    box-shadow: 3px 3px 0px 0px #000000;
  }

  .box-shadow-mini-hover {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>