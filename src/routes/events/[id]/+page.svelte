<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { pb } from '$lib/pocketbase';
  import { fade, fly } from 'svelte/transition';

  // --- SVELTE 5 STATE RUNES ---
  let event = $state(null);
  let isLoaded = $state(false);
  let scrollY = $state(0);
  let mousePos = $state({ x: 0, y: 0 });
  let timeStr = $state(''); 

  const now = new Date().toISOString();

  function handleMouseMove(e) {
    mousePos = {
      x: (e.clientX / window.innerWidth - 0.5) * 14,
      y: (e.clientY / window.innerHeight - 0.5) * 14
    };
  }

  function updateCountdown(dateISO) {
    const diff = new Date(dateISO).getTime() - Date.now();
    if (diff <= 0) return timeStr = "Event Concluded";
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    timeStr = `${d}d ${h}h ${m}m Remaining`;
  }

  onMount(() => {
    let timer;
    
    async function fetchEventNode() {
      try {
        event = await pb.collection('events').getOne($page.params.id);
        updateCountdown(event.date_time);
        timer = setInterval(() => updateCountdown(event.date_time), 60000);
        setTimeout(() => isLoaded = true, 50);
      } catch (e) { 
        console.error("Failed to fetch event data:", e); 
      }
    }

    fetchEventNode();

    return () => {
      if (timer) clearInterval(timer);
    };
  });

  // --- DERIVED PROPERTY RUNES ---
  let isPastEvent = $derived(event ? event.date_time < now : false);
  let parallaxHeroY = $derived(scrollY * 0.25);
  let parallaxHeadlineY = $derived(scrollY * 0.4);
</script>

<svelte:window bind:scrollY onmousemove={handleMouseMove} />

{#if event}
<main class="min-h-screen bg-[#eef2f7] text-[#1a1a1a] pb-24 overflow-x-hidden relative perspective-1000">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none z-0"></div>
  
  <section class="relative min-h-[75vh] flex flex-col justify-center items-center overflow-hidden pt-20 pb-12 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7]">
    <div class="w-full max-w-5xl z-20 mb-auto" style="transform: translateY({parallaxHeroY}px)">
      <nav aria-label="Breadcrumb" class="inline-flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini">
        <a href="/" class="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#2563eb] transition-colors">Home</a>
        <span class="text-[10px] font-mono text-slate-400 font-black">/</span>
        <a href="/events" class="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#2563eb] transition-colors">Events</a>
        <span class="text-[10px] font-mono text-slate-400 font-black">/</span>
        <span class="text-xs font-black uppercase tracking-wider text-[#2563eb] max-w-[150px] sm:max-w-xs truncate" aria-current="page">
          {event.name}
        </span>
      </nav>
    </div>

    <div class="w-full max-w-5xl z-10 text-center my-auto pt-8" style="transform: translateY({parallaxHeadlineY}px)">
      {#if isLoaded}
        <div in:fly={{ y: 30, duration: 600 }}>
          <span class="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black box-shadow-mini transform -rotate-1">
            {isPastEvent ? 'Past Event' : 'Upcoming Event'}
          </span>

          <h1 class="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.95] mb-8 max-w-4xl mx-auto">
            {#each event.name.split(' ') as word}
              <span class="hover-word inline-block mr-3 transform transition-transform duration-200">{word}</span>
            {/each}
          </h1>

          <div class="inline-flex flex-col sm:flex-row items-center gap-4 p-3 bg-white border-3 border-black rounded-2xl box-shadow-flat">
            <div class="flex items-center gap-2 px-3 py-1 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded-lg border-2 border-black shadow-inner">
              <span class="w-2 h-2 rounded-full {isPastEvent ? 'bg-slate-400' : 'bg-emerald-400 animate-pulse'}"></span>
              <span>{isPastEvent ? 'Concluded' : timeStr}</span>
            </div>
            <a href="#details-section" class="skeuo-button px-6 py-2.5 bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all whitespace-nowrap">
              View Details ↓
            </a>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <section id="details-section" class="max-w-5xl mx-auto px-6 py-16 relative z-20">
    <div class="relative w-full bg-[#eef2f7] rounded-[3.5rem] p-5 border-2 border-white/60 shadow-neumorphic-outer transition-transform duration-300 ease-out"
         style="transform: rotateY({mousePos.x}deg) rotateX({-mousePos.y}deg)">
      
      <div class="w-full h-full rounded-[2.8rem] bg-[#eef2f7] shadow-neumorphic-inner p-6 md:p-12 relative overflow-hidden border border-slate-200/60">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/5 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-8 text-left">
            <div class="space-y-1">
              <p class="text-2xl font-black text-black uppercase tracking-tight leading-tight">
                {isPastEvent ? 'This tournament has ended.' : 'Tournament schedule and information details.'}
              </p>
            </div>

            <div class="p-6 bg-[#eef2f7] rounded-3xl shadow-neumorphic-card-inner border border-white/50 space-y-1">
              <span class="block text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                ⏱️ Date & Time
              </span>
              <div class="text-4xl md:text-6xl font-black text-[#2563eb] tracking-tight font-mono leading-none py-1">
                {new Date(event.date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span class="block text-xs font-black text-slate-700 uppercase tracking-wide">
                {new Date(event.date_time).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border-2 border-black rounded-2xl box-shadow-mini">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-[#eef2f7] rounded-xl shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center text-xl shrink-0">
                  📍
                </div>
                <div>
                  <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Location</span>
                  <span class="text-sm font-black text-black uppercase">{event.location}</span>
                </div>
              </div>
              
              <a href="https://www.google.com/maps/search/?api=1&query={encodeURIComponent(event.location)}" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="sm:shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#facc15] text-black text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black box-shadow-mini active:translate-y-[2px] transition-all">
                <span>Open Maps ↗</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-5 relative aspect-square w-full max-w-[300px] mx-auto lg:max-w-none">
             <div class="absolute -top-3 -right-3 w-16 h-16 bg-[#facc15] rounded-2xl rotate-12 border-2 border-black box-shadow-mini z-0 animate-bounce-slow"></div>
             <div class="relative h-full w-full bg-white border-4 border-black rounded-[2rem] p-2 box-shadow-flat z-10 flex flex-col items-center justify-center text-center overflow-hidden">
               <div class="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
               {#if event.pics && event.pics.length > 0}
                  <div class="w-full h-full rounded-[1.6rem] overflow-hidden border-2 border-black bg-slate-50 relative group">
                    <img 
                      src={pb.files.getURL(event, event.pics[0])} 
                      alt="Event Cover" 
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-3xl">📸</span>
                        <span class="text-xs font-black uppercase text-white mt-1">View Gallery ↓</span>
                    </div>
                  </div>
               {:else}
                  <span class="text-5xl mb-2">📅</span>
                  <span class="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">No Media Available</span>
               {/if}
             </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  {#if event.pics && event.pics.length > 0}
    <section id="collage-section" class="max-w-7xl mx-auto px-6 py-12 relative z-20" in:fade={{ duration: 400 }}>
      
      <div class="mb-10 flex items-center justify-between border-b-4 border-black pb-4">
        <div>
          <span class="text-xs font-black text-white bg-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">Gallery</span>
          <h2 class="text-4xl font-black text-black uppercase tracking-tighter mt-1">Event Photos</h2>
        </div>
        <div class="p-3 bg-white border-2 border-black rounded-lg box-shadow-mini font-mono text-xs font-black">
            Total Images: {event.pics.length}
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 select-none bg-white border-3 border-black p-8 rounded-3xl box-shadow-flat relative">
         <div class="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
         
         {#each event.pics as img, idx}
            <div 
                class="bg-white border-3 border-black p-2 rounded-2xl box-shadow-mini transform transition-all duration-300 hover:scale-[1.05] hover:rotate-1 hover:box-shadow-mini-hover group"
                style="animation-delay: {idx * 50}ms"
            >
              <div class="aspect-[4/3] w-full bg-slate-200 rounded-xl overflow-hidden border-2 border-black relative">
                <img 
                  src={pb.files.getURL(event, img)} 
                  alt="Event thumbnail {idx + 1}" 
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span class="font-mono text-[9px] font-black text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-400/30">
                        IMAGE_{String(idx + 1).padStart(3, '0')}
                    </span>
                </div>
                
                <span class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                  {idx + 1}
                </span>
              </div>
            </div>
          {/each}
      </div>
    </section>
  {/if}

</main>
{/if}

<style>
  :global(html) { scroll-behavior: smooth; }

  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .perspective-1000 { perspective: 1500px; }

  .hover-word:hover {
    transform: scale(1.08) translateY(-6px) rotate(-1.5deg);
    color: #2563eb;
  }

  .box-shadow-flat {
    box-shadow: 6px 6px 0px 0px #000000;
  }

  .box-shadow-mini {
    box-shadow: 3px 3px 0px 0px #000000;
  }
  
  .box-shadow-mini-hover {
    box-shadow: 6px 6px 0px 0px #000000;
  }

  .shadow-skeuo {
    box-shadow: 
      0px 4px 0px #1d4ed8,
      4px 8px 12px rgba(0, 0, 0, 0.1);
  }
  
  .skeuo-button:hover {
    box-shadow: 
      0px 3px 0px #1d4ed8,
      2px 5px 8px rgba(0, 0, 0, 0.08);
  }

  .skeuo-button:active {
    box-shadow: 
      0px 0px 0px #1d4ed8,
      0px 1px 2px rgba(0, 0, 0, 0.05);
  }

  .shadow-neumorphic-outer {
    box-shadow: 
      14px 14px 32px #bdc7d4, 
      -14px -14px 32px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  .shadow-neumorphic-inner {
    box-shadow: 
      inset 5px 5px 10px #cad4e2, 
      inset -5px -5px 10px #ffffff;
  }

  .shadow-neumorphic-card-inner {
    box-shadow: 
      inset 4px 4px 8px #cad4e2, 
      inset -4px -4px 8px #ffffff;
  }

  .animate-bounce-slow {
    animation: floating-widget 6s infinite ease-in-out;
  }

  @keyframes floating-widget {
    0%, 100% { transform: translateY(0) rotate(12deg); }
    50% { transform: translateY(-14px) rotate(15deg); }
  }
</style>