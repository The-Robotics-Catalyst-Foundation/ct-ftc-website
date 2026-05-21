<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  let scrollY = $state(0);
  let isLoaded = $state(false);

  onMount(() => {
    isLoaded = true;
  });

  let parallaxY = $derived(scrollY * 0.2);
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>Page Not Found | Connecticut FTC</title>
</svelte:head>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] flex items-center justify-center p-6 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  {#if isLoaded}
    <div in:fly={{ y: 30, duration: 500 }} class="max-w-2xl w-full text-center space-y-8 z-10 my-12" style="transform: translateY({parallaxY}px)">
      
      <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-2 box-shadow-flat transform -rotate-2">
        Error 404
      </span>

      <h1 class="text-6xl md:text-8xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        Page Not <br />
        <span class="text-[#2563eb] bg-white border-4 border-black px-5 inline-block my-2 box-shadow-flat transform rotate-2">Found</span>
      </h1>

      <p class="text-slate-800 text-sm md:text-base font-bold leading-relaxed max-w-md mx-auto bg-white/40 backdrop-blur-sm p-5 border-2 border-black rounded-xl">
        The link you followed might be broken, or the page has been moved. Use the links below to get back on track.
      </p>

      <div class="bg-white border-3 border-black p-6 rounded-[2rem] box-shadow-flat max-w-md mx-auto space-y-4 text-left">
        <span class="text-[10px] font-mono font-black uppercase text-[#2563eb] tracking-widest block mb-2">Navigation</span>
        
        <div class="grid grid-cols-1 gap-3">
          <a href="/" class="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-black hover:bg-slate-50 transition-all font-bold text-sm">
            <span>🏠 Home</span>
            <span class="text-xs opacity-60">→</span>
          </a>
          
          <a href="/volunteer" class="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-black hover:bg-slate-50 transition-all font-bold text-sm">
            <span>🛠️ Volunteer Registration</span>
            <span class="text-xs opacity-60">→</span>
          </a>

          <a href="/contact" class="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-black hover:bg-slate-50 transition-all font-bold text-sm">
            <span>✉️ Contact Us</span>
            <span class="text-xs opacity-60">→</span>
          </a>
        </div>
      </div>

      <div class="pt-4">
        <button onclick={() => history.back()} 
           class="skeuo-button bg-[#2563eb] text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] inline-flex items-center gap-2 transition-all cursor-pointer">
          &larr; Go Back
        </button>
      </div>

    </div>
  {/if}
</main>

<style>
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .shadow-skeuo {
    box-shadow: 0px 4px 0px #1d4ed8, 4px 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  .skeuo-button:hover {
    box-shadow: 0px 3px 0px #1d4ed8, 2px 6px 12px rgba(0, 0, 0, 0.1);
  }

  .skeuo-button:active {
    box-shadow: 0px 0px 0px #1d4ed8, 0px 1px 3px rgba(0, 0, 0, 0.05);
  }

  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>