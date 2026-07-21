<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { slide } from 'svelte/transition';
  import Head from '$lib/components/head.svelte';

  // State Management
  let isLoaded = $state(false);
  let scrollY = $state(0);
  /** @type {string | null} */
  let activeRoleCategory = $state('tech');

  const roleCategories = [
    {
      key: 'tech',
      icon: '🛠️',
      title: 'Technical Roles',
      subtitle: 'Referees, FTAs, Robot Inspectors...',
      tag: 'Field Operations',
      description: 'Ideal for mentors, alumni, or engineers who want to manage match rule enforcement, electronics, and field setup directly.',
      roles: ['Referee', 'Field Technical Advisor (FTA)', 'Robot Inspector']
    },
    {
      key: 'judges',
      icon: '⚖️',
      title: 'Judges & Award Staff',
      subtitle: 'Panel Judges, Judge Match Observers...',
      tag: 'Evaluation Team',
      description: 'Interview student teams, review their engineering documentation, and collaborate with other judges to determine award winners. Great for professionals of all backgrounds.',
      roles: ['Panel Judge', 'Judge Advisor', 'Judge Match Observer']
    },
    {
      key: 'logistics',
      icon: '📋',
      title: 'Event Logistics',
      subtitle: 'Queuers, Scorekeepers, Emcees...',
      tag: 'Event Flow',
      description: 'Help keep the tournament running on schedule, coordinate team queuing movement, or energize the audience on the microphone.',
      roles: ['Queuer', 'Scorekeeper', 'Emcee']
    },
    {
      key: 'support',
      icon: '☕',
      title: 'Support & Setup',
      subtitle: 'Field Reset, Team Check-in...',
      tag: 'Event Support',
      description: 'Perfect for parents, siblings, or newcomers looking for a straightforward way to assist during the event without requiring complex training.',
      roles: ['Team Registration', 'Volunteer Check-in', 'Field Reset Crew']
    }
  ];

  /** @param {string} key */
  function toggleRoleCategory(key) {
    activeRoleCategory = activeRoleCategory === key ? null : key;
  }

  // Parallax Values
  let parallaxHeroY = $derived(scrollY * 0.3);
  let backgroundScrollX = $derived(scrollY * 0.05);

  onMount(() => {
    setTimeout(() => isLoaded = true, 100);
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>Volunteer Registration | Connecticut FTC</title>
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
        Volunteer in Connecticut
      </span>

      <h1 class="text-4xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        How to Volunteer <br />
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
        <span class="text-xs font-black text-[#2563eb] bg-white border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">Registration Process</span>
        <h2 class="text-3xl font-black text-black uppercase tracking-tight mt-3">How to Register as a Volunteer</h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch mb-12">
        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">1</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Create an Account</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Go to firstinspires.org and create an account (for new volunteers) or login to your existing account.</p>
          </div>
        </div>

        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">2</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Find Your Role</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Once you are on the FIRST Dashboard, click on "My Roles" and then "Event Volunteer".</p>
          </div>
        </div>

        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">3</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Find a CT Event</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Click "Register to Volunteer" then search for a FIRST Tech Challenge event in Connecticut.</p>
          </div>
        </div>

        <div class="bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between relative">
          <div class="absolute -top-5 left-6 bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xl border-2 border-white shadow-md">4</div>
          <div class="pt-4 space-y-2">
            <h3 class="text-lg font-black text-black uppercase">Complete Registration</h3>
            <p class="text-slate-600 text-xs font-semibold leading-relaxed">Follow the steps to complete your volunteer registration.</p>
          </div>
        </div>
      </div>

      <div class="text-center pt-4 space-y-4">
        <a href="https://www.firstinspires.org" target="_blank" rel="noopener noreferrer"
           class="skeuo-button bg-[#2563eb] text-white text-sm font-black uppercase tracking-wider px-10 py-5 rounded-2xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] inline-flex items-center gap-3 transition-all">
          Go to FIRST Dashboard <span class="text-base">↗</span>
        </a>
        <p class="text-xs font-semibold text-slate-500">
          Questions? Email <a href="mailto:youssefmmacary@gmail.com" class="text-[#2563eb] font-black hover:underline">youssefmmacary@gmail.com</a>
        </p>
      </div>

    </div>
  </section>

  <section class="max-w-4xl mx-auto px-6 py-8 relative z-20">
    <div class="text-left mb-6">
      <span class="text-xs font-black text-white bg-black border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">Volunteer Roles</span>
      <h2 class="text-2xl font-black text-black uppercase mt-3">Find Your Perfect Role</h2>
      <p class="text-xs font-bold text-slate-500 mt-1">Tap a category to see the specific roles. Free online training is provided for all roles prior to the event.</p>
    </div>

    <div class="space-y-4">
      {#each roleCategories as role (role.key)}
        <div class="bg-white border-3 border-black rounded-2xl box-shadow-flat overflow-hidden">
          <button
            onclick={() => toggleRoleCategory(role.key)}
            aria-expanded={activeRoleCategory === role.key}
            class="w-full text-left p-4 flex items-center gap-4 transition-colors {activeRoleCategory === role.key ? 'bg-[#eef2f7]' : 'bg-white hover:bg-slate-50'}"
          >
            <div class="w-10 h-10 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl border border-slate-200">{role.icon}</div>
            <div class="flex-1 min-w-0">
              <span class="block text-xs font-black uppercase tracking-wide text-black">{role.title}</span>
              <span class="block text-[10px] font-bold text-slate-400 truncate">{role.subtitle}</span>
            </div>
            <span class="shrink-0 text-black text-lg font-black transition-transform duration-200 {activeRoleCategory === role.key ? 'rotate-180' : ''}">⌄</span>
          </button>

          {#if activeRoleCategory === role.key}
            <div transition:slide={{ duration: 250 }}>
              <div class="px-4 pb-5 pt-1 border-t-2 border-black/10 space-y-3">
                <span class="inline-block text-[10px] font-mono font-black uppercase text-[#2563eb] tracking-widest bg-[#eef2f7] px-2.5 py-1 rounded border border-black/10">{role.tag}</span>
                <p class="text-sm font-semibold text-slate-700 leading-relaxed">{role.description}</p>
                <div class="flex flex-wrap gap-2 pt-1">
                  {#each role.roles as specificRole}
                    <span class="text-[10px] font-black uppercase tracking-wide text-black bg-[#facc15] border-2 border-black px-2.5 py-1 rounded-lg">{specificRole}</span>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>
</main>

<style>
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .shadow-neumorphic-outer {
    box-shadow: 
      12px 12px 28px #bebebe, 
      -12px -12px 28px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  .shadow-neumorphic-inner {
    box-shadow: 
      inset 6px 6px 12px #d1d9e6, 
      inset -6px -6px 12px #ffffff;
  }

  .shadow-skeuo {
    box-shadow: 0px 4px 0px #1d4ed8, 4px 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  .skeuo-button:hover {
    box-shadow: 0px 3px 0px #1d4ed8, 2px 6px 12px rgba(0, 0, 0, 0.12);
  }

  .skeuo-button:active {
    box-shadow: 0px 0px 0px #1d4ed8, 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>