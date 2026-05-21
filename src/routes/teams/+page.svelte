<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // --- SVELTE 5 STATE RUNES ---
  let isLoaded = $state(false);
  let scrollY = $state(0);
  let iframeHeight = $state("850px");

  // --- DERIVED PARALLAX RUNES ---
  let parallaxHeaderY = $derived(scrollY * 0.25);
  let consoleTilt = $derived(Math.min(scrollY * 0.05, 12));

  onMount(() => {
    setTimeout(() => isLoaded = true, 50);
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>CT Team Explorer - CT FTC</title>
</svelte:head>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] pb-24 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  <section class="relative pt-20 pb-12 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7]">
    <div class="max-w-7xl mx-auto text-left space-y-6 z-10" style="transform: translateY({parallaxHeaderY}px)">
      
      
      <h1 class="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        CT Team <span class="text-[#2563eb] bg-white border-4 border-black px-3 inline-block my-1 box-shadow-flat transform rotate-1">Explorer Console</span>
      </h1>
      
      <p class="text-slate-800 text-sm md:text-lg font-bold max-w-2xl bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl leading-relaxed">
 Powered by Atlas, analyze all teams in CT see their match history as well as info about their team.
      </p>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-6 py-16 relative z-20">
    
    <div class="relative w-full bg-[#eef2f7] rounded-[3.5rem] p-5 border-2 border-white/60 shadow-neumorphic-outer transition-transform duration-300 ease-out"
         style="transform: rotateX({consoleTilt}deg)">
      
      <div class="w-full h-full rounded-[2.8rem] bg-[#eef2f7] shadow-neumorphic-inner p-4 relative overflow-hidden border border-slate-200/60 flex flex-col">
        
        <div class="bg-white border-2 border-black rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 box-shadow-flat bg-gradient-to-r from-white to-slate-50">
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <div class="w-3.5 h-3.5 rounded-full bg-[#eef2f7] shadow-inner border border-slate-300"></div>
              <div class="w-3.5 h-3.5 rounded-full bg-[#eef2f7] shadow-inner border border-slate-300"></div>
              <div class="w-3.5 h-3.5 rounded-full bg-[#eef2f7] shadow-inner border border-slate-300"></div>
            </div>
            <span class="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest pl-2">Team List</span>
          </div>
          
          <div class="px-4 py-1.5 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded-lg border-2 border-black shadow-inner tracking-tight flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
           robolyst.org
          </div>
        </div>

        <div class="border-4 border-black rounded-2xl overflow-hidden bg-white shadow-2xl relative z-10">
          <iframe
            src="https://robolyst.org/"
            title="CT FTC Team Atlas"
            width="100%"
            height={iframeHeight}
            frameborder="0"
            allowfullscreen
            class="w-full bg-white block" 
          ></iframe>
        </div>

      </div>

    </div>
  </section>

  <section class="max-w-5xl mx-auto px-1 py-4 relative z-20">
    <div class="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-12 box-shadow-flat flex flex-col md:flex-row items-center justify-between gap-2 text-left group">
      
      <div class="space-y-2">
        <h3 class="text-2xl font-black text-black uppercase tracking-tight">Didn't find your team?</h3>
        <p class="text-slate-600 text-sm font-semibold max-w-xl leading-relaxed">
          Ensure your team information registration fields are completely processed on the central <span class="text-[#2563eb]">FIRST Dashboard</span>
        </p>
      </div>
      
      <a href="https://firstinspires.org" target="_blank" rel="noopener noreferrer" 
         class="skeuo-button bg-[#facc15] text-black text-sm font-black uppercase tracking-wider px-8 py-4.5 rounded-2xl border-2 border-black shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] shrink-0 transition-all text-center min-w-[200px]">
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
      inset 1px 1px 0px rgba(255,255,255,0.9);
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