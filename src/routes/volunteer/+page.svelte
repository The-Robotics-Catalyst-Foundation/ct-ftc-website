<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Head from '$lib/components/head.svelte';

  // --- SVELTE 5 STATE RUNES ---
  let isLoaded = $state(false);
  let scrollY = $state(0);
  let activeRoleCategory = $state('tech'); // Dynamic control state for the skeuomorphic panel

  // --- DERIVED RUNES (PARALLAX MATRIX) ---
  let parallaxHeroY = $derived(scrollY * 0.3);
  let backgroundScrollX = $derived(scrollY * 0.05);

  onMount(() => {
    setTimeout(() => isLoaded = true, 100);
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>Volunteer Control Deck | Connecticut FTC</title>
</svelte:head>
<Head 
  title="Volunteer Opportunities" 
  description="Join our team of dedicated volunteers making a difference in the lives of young robotics enthusiasts across Connecticut." 
/>
<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] pb-24 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" style="background-position: {backgroundScrollX}px 0px;"></div>

  <section class="relative min-h-[50vh] flex items-center justify-center pt-24 pb-16 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e2ebf5]">
    <div class="max-w-4xl mx-auto text-center space-y-6 z-10" style="transform: translateY({parallaxHeroY}px)">
      
      <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-2 box-shadow-flat transform -rotate-1">
        Volunteer in Ct
      </span>

      <h1 class="text-4xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter uppercase">
       "How to Volunteer" <br />
        <span class="text-[#2563eb] bg-white border-4 border-black px-4 inline-block my-2 box-shadow-flat transform rotate-1">CT Robotics Competitions</span>
      </h1>

      <p class="text-slate-800 text-sm md:text-xl font-bold leading-relaxed max-w-2xl mx-auto bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl">
        Our tournaments are completely volunteer-driven. Whether you are an experienced engineer, a parent, or a student, we have a vital role for you. <span class="text-[#2563eb]">No technical experience required!</span>
      </p>
    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-20 relative z-20">
    <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[3rem] p-8 md:p-14 border-2 border-white/60">
      
      <div class="mb-12 text-center md:text-left">
        <span class="text-xs font-black text-[#2563eb] bg-white border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">Protocol Overview</span>
        <h2 class="text-3xl font-black text-black uppercase tracking-tight mt-3">How to Register as a Volunteer</h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8 items-stretch mb-12">
        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">1</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Create an Account</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Head to the official FIRST Inspires dashboard and sign up or log in to establish your profile.</p>
          </div>
        </div>

        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">2</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Pass Screening</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Complete the standard, secure FIRST Youth Protection Screening (YPP). It takes just a few minutes online and keeps our students safe.</p>
          </div>
        </div>

        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">3</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Apply to a CT Event</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Search the event listings inside your dashboard, filter by Connecticut, select your preferred event, and pick your top roles!</p>
          </div>
        </div>
      </div>

      <div class="text-center pt-4">
        <a href="https://www.firstinspires.org" target="_blank" rel="noopener noreferrer" 
           class="skeuo-button bg-[#2563eb] text-white text-sm font-black uppercase tracking-wider px-10 py-5 rounded-2xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] inline-flex items-center gap-3 transition-all">
          Go to FIRST Dashboard <span class="text-base">↗</span>
        </a>
      </div>

    </div>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-8 relative z-20">
    <div class="grid lg:grid-cols-12 gap-12 items-start">
      
      <div class="lg:col-span-5 space-y-4">
        <div class="text-left mb-6">
          <span class="text-xs font-black text-white bg-black border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">Classification Matrix</span>
          <h2 class="text-2xl font-black text-black uppercase mt-3">Find Your Perfect Role</h2>
          <p class="text-xs font-bold text-slate-500 mt-1">We divide roles based on background, but training is provided online for everything.</p>
        </div>

        <button onclick={() => activeRoleCategory = 'tech'} 
                class="w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 {activeRoleCategory === 'tech' ? 'bg-[#eef2f7] shadow-neumorphic-inner border-slate-300' : 'bg-white border-border-subtle shadow-sm hover:border-slate-400'}">
          <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl border border-slate-200">🛠️</div>
          <div>
            <span class="block text-xs font-black uppercase tracking-wide text-black">Technical Roles</span>
            <span class="block text-[10px] font-bold text-slate-400">Referees, FTAs, Inspectors...</span>
          </div>
        </button>

        <button onclick={() => activeRoleCategory = 'judges'} 
                class="w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 {activeRoleCategory === 'judges' ? 'bg-[#eef2f7] shadow-neumorphic-inner border-slate-300' : 'bg-white border-border-subtle shadow-sm hover:border-slate-400'}">
          <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl border border-slate-200">⚖️</div>
          <div>
            <span class="block text-xs font-black uppercase tracking-wide text-black">Judges & Award Staff</span>
            <span class="block text-[10px] font-bold text-slate-400">Panel Judges, Portfolio Analysts...</span>
          </div>
        </button>

        <button onclick={() => activeRoleCategory = 'logistics'} 
                class="w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 {activeRoleCategory === 'logistics' ? 'bg-[#eef2f7] shadow-neumorphic-inner border-slate-300' : 'bg-white border-border-subtle shadow-sm hover:border-slate-400'}">
          <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl border border-slate-200">📋</div>
          <div>
            <span class="block text-xs font-black uppercase tracking-wide text-black">Event Logistics</span>
            <span class="block text-[10px] font-bold text-slate-400">Queuers, Scorekeepers, Emcees...</span>
          </div>
        </button>

        <button onclick={() => activeRoleCategory = 'support'} 
                class="w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 {activeRoleCategory === 'support' ? 'bg-[#eef2f7] shadow-neumorphic-inner border-slate-300' : 'bg-white border-border-subtle shadow-sm hover:border-slate-400'}">
          <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl border border-slate-200">☕</div>
          <div>
            <span class="block text-xs font-black uppercase tracking-wide text-black">Support & Planning</span>
            <span class="block text-[10px] font-bold text-slate-400">Field Reset, Check-in Desks...</span>
          </div>
        </button>
      </div>

      <div class="lg:col-span-7 w-full h-full min-h-[300px]">
        <div class="bg-white/40 backdrop-blur-xl border border-white/70 rounded-[2.5rem] p-8 md:p-12 shadow-2xl h-full flex flex-col justify-center text-left relative overflow-hidden box-shadow-flat border-3 border-black">
          
          {#if activeRoleCategory === 'tech'}
            <div in:fly={{ x: 20, duration: 300 }} class="space-y-4">
              <span class="text-[10px] font-mono font-black uppercase text-[#2563eb] tracking-widest bg-white px-2.5 py-1 rounded border border-black/10">Sub-Circuit Base // Field Operations</span>
              <h3 class="text-2xl font-black text-black uppercase">🛠️ Technical Fleet Roles</h3>
              <p class="text-sm font-semibold text-slate-700 leading-relaxed">
                Referees, Field Technical Advisors (FTAs), Inspectors. Best for mentors, alumni, or engineers who want to be down on the field handling the electronics, structural tracking, and enforcement of match game rules.
              </p>
            </div>
          {:else}
            {#if activeRoleCategory === 'judges'}
              <div in:fly={{ x: 20, duration: 300 }} class="space-y-4">
                <span class="text-[10px] font-mono font-black uppercase text-[#2563eb] tracking-widest bg-white px-2.5 py-1 rounded border border-black/10">Sub-Circuit Base // Evaluation Suite</span>
                <h3 class="text-2xl font-black text-black uppercase">⚖️ Judges & Award Staff</h3>
                <p class="text-sm font-semibold text-slate-700 leading-relaxed">
                  Panel Judges, Judge Match Observers. Interview teams in the morning, review engineering portfolios, and deliberate to hand out prestigious advancement awards. Great for professionals of all backgrounds!
                </p>
              </div>
            {:else}
              {#if activeRoleCategory === 'logistics'}
                <div in:fly={{ x: 20, duration: 300 }} class="space-y-4">
                  <span class="text-[10px] font-mono font-black uppercase text-[#2563eb] tracking-widest bg-white px-2.5 py-1 rounded border border-black/10">Sub-Circuit Base // Flow Control</span>
                  <h3 class="text-2xl font-black text-black uppercase">📋 Event Logistics Squad</h3>
                  <p class="text-sm font-semibold text-slate-700 leading-relaxed">
                    Queuers, Scorekeepers, Emcees. Keep the tournament flowing exactly on schedule, manage field pit traffic routing loops, or pump up the team crowd on the main system mic!
                  </p>
                </div>
              {:else}
                {#if activeRoleCategory === 'support'}
                  <div in:fly={{ x: 20, duration: 300 }} class="space-y-4">
                    <span class="text-[10px] font-mono font-black uppercase text-[#2563eb] tracking-widest bg-white px-2.5 py-1 rounded border border-black/10">Sub-Circuit Base // Baseline Maintenance</span>
                    <h3 class="text-2xl font-black text-black uppercase">☕ Support & Auxiliary Planning</h3>
                    <p class="text-sm font-semibold text-slate-700 leading-relaxed">
                      Team Registration, Volunteer Check-in, Field Reset. Perfect for parents or younger siblings who want a quick, simple way to help out for a short morning shift without any complex training tracks.
                    </p>
                  </div>
                {/if}
              {/if}
            {/if}
          {/if}

        </div>
      </div>

    </div>
  </section>
</main>

<style>
  /* Blueprint Grid Underlay Matrix Layout CSS mapping */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  /* Tactile Neomorphic Soft Shadows */
  .shadow-neumorphic-outer {
    box-shadow: 
      12px 12px 28px #bebebe, 
      -12px -12px 28px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  /* Deep Neomorphic Recessed Inner Tray Shading */
  .shadow-neumorphic-inner {
    box-shadow: 
      inset 6px 6px 12px #d1d9e6, 
      inset -6px -6px 12px #ffffff;
  }

  /* Convex Skeuomorphic Button Mechanical Depress Effects */
  .shadow-skeuo {
    box-shadow: 
      0px 4px 0px #1d4ed8,
      4px 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  .skeuo-button:hover {
    box-shadow: 
      0px 3px 0px #1d4ed8,
      2px 6px 12px rgba(0, 0, 0, 0.12);
  }

  .skeuo-button:active {
    box-shadow: 
      0px 0px 0px #1d4ed8,
      0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Heavy Brutalist Outline Flat Shadows */
  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>