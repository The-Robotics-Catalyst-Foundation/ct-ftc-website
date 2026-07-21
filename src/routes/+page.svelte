<script>
  import { browser } from '$app/environment';
  import Head from '$lib/components/head.svelte';
  import Carousel from '$lib/components/carousel.svelte';

  // --- SVELTE 5 STATE RUNES ---
  let scrollY = $state(0);
  let mouseX = $state(0);
  let mouseY = $state(0);

  // --- DERIVED RUNES (2030 SCROLL ANIMATIONS MATRIX) ---
  // Calculates real-time 3D rotation, depth offsets, and scale matrices based on page scroll depth
  let parallaxHeroY = $derived(scrollY * 0.35);
  let mapRotateY = $derived((scrollY * 0.1) % 360);
  let mapTiltX = $derived(Math.min(scrollY * 0.08, 15));
  let structuralScale = $derived(Math.max(1 - scrollY * 0.0005, 0.9));

  function handleMouseMove(e) {
    if (!browser) return;
    // Maps pointer offsets to slight coordinate variances for continuous 3D lighting tilts
    mouseX = (e.clientX / window.innerWidth - 0.5) * 25;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 25;
  }
</script>

<svelte:window bind:scrollY on:mousemove={handleMouseMove} />

<Head
  title="Home"
  description="Connecticut FIRST Tech Challenge - Inspiring the Next Generation of Innovators and Engineers. Explore our events, teams, and volunteer opportunities to get involved in the excitement of robotics competitions across the state."
/>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] font-sans perspective-container overflow-x-hidden">

  <section class="relative min-h-[100vh] flex items-center justify-center py-20 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#d8e2ef] overflow-hidden">

    <div class="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10 w-full">

      <div class="lg:col-span-6 space-y-8 text-left" style="transform: translateY({parallaxHeroY}px)">
        <h1 class="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter uppercase">
          <img src="https://wpafbstem.com/FTC/img/FTC_logo.png" alt="FIRST Tech Challenge Logo" class="w-full object-contain max-h-32"> <br />
          <span class="text-[#2563eb] bg-white border-4 border-black px-3 inline-block my-2 box-shadow-flat transform rotate-1">Right Here in Connecticut!</span>
        </h1>

        <p class="text-slate-800 text-base md:text-xl font-bold leading-relaxed max-w-xl bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl">
          FIRST Tech Challenge is a robotics competition for students in grades 7–12 to compete head to head, by designing, building, and programming a robot to compete in an alliance format against other teams.
        </p>

        <div class="flex flex-wrap gap-6 pt-4">
          <a href="/events" class="skeuo-button bg-[#2563eb] text-white text-sm font-black uppercase tracking-wider px-8 py-4 rounded-2xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] transition-all">
            View Local Events
          </a>
          <a href="/volunteer" class="brutalist-btn bg-[#facc15] text-black text-sm font-black uppercase tracking-wider px-8 py-4 border-[3px] border-black box-shadow-flat transition-transform hover:-translate-y-1">
            Get Involved &rarr;
          </a>
        </div>
      </div>

      <div class="lg:col-span-6 flex flex-col justify-center items-center w-full relative">
        <div
          class="relative w-full max-w-lg aspect-square bg-[#eef2f7] rounded-[3.5rem] p-4 border-2 border-white/60 shadow-neumorphic-outer group transition-all duration-300 ease-out"
          style="transform: scale({structuralScale}) rotateY({mouseX + mapRotateY}deg) rotateX({-mouseY + mapTiltX}deg)"
        >
          <div class="w-full h-full rounded-[2.8rem] bg-[#eef2f7] shadow-neumorphic-inner p-4 relative overflow-hidden border border-slate-200/50">
            <img src="map.png" alt="CT Map" class="w-full h-full object-cover rounded-[2.5rem] shadow-neumorphic-inner border border-slate-200/50">
          </div>
        </div>
      </div>

    </div>
  </section>

  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[3rem] p-8 md:p-16 border-2 border-white/60 grid lg:grid-cols-12 gap-16 items-center">

      <div class="lg:col-span-7 space-y-6 text-left">
        <span class="text-xs font-black text-[#2563eb] bg-white border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">More Than Robots</span>
        <h2 class="text-4xl font-black text-black uppercase tracking-tight">The FIRST Experience</h2>
        <p class="text-slate-700 leading-relaxed font-semibold text-base">
          FIRST Tech Challenge teams engineer, program, and operate Android-platform robots to compete in events to reach fame. Guided by professional engineers, students learn to think like scientists and engineers, while also developing self-confidence, communication skills, and leadership abilities. The program emphasizes the importance of gracious professionalism, encouraging students to compete fiercely while treating all participants with respect and kindness.
        </p>

        <div class="border-l-8 border-black pl-5 py-3 bg-[#facc15]/20 border-2 border-black rounded-xl box-shadow-flat text-left">
          <p class="font-mono text-sm text-black">
            <b>Gracious Professionalism</b> is a core FIRST ethos that encourages high-quality work, mutual respect, and community value without being rigidly defined. In practice, it drives participants to compete intensely while ensuring everyone is treated with kindness and feels included.
          </p>
        </div>
      </div>

      <div class="lg:col-span-5 bg-black border-4 border-black p-4 rounded-2xl shadow-skeuo aspect-video flex flex-col items-center justify-center text-center relative overflow-hidden group/crt">
        <Carousel />
      </div>

    </div>
  </section>

  <section class="py-16 px-6 max-w-7xl mx-auto border-t-4 border-black">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

      <div class="bg-white border-[3px] border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-2xl mb-6">📅</div>
          <h3 class="text-xl font-black text-black uppercase mb-3">Tournaments & Scrimmages</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            See upcoming events, as well as recaps and media from past tournaments across Connecticut, including qualifiers, regionals, and the state championship.
          </p>
        </div>
        <a href="/events" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          Explore Events <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="bg-white border-[3px] border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-2xl mb-6">📊</div>
          <h3 class="text-xl font-black text-black uppercase mb-3">CT Team List</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            Robolyst provides an open-source interactive directory of all CT FTC teams, showcasing their match history, awards, and key statistics to analyze performance trends across the state.
          </p>
        </div>
        <a href="http://robolyst.org/stateprov/connecticut/ftc/teams" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          Launch Team Directory <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="bg-white border-[3px] border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group sm:col-span-2 lg:col-span-1">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-2xl mb-6">🤝</div>
          <h3 class="text-xl font-black text-black uppercase mb-3">Volunteer "How to"</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            Learn about the various volunteer roles that support CT FTC events, from coaching teams to judging matches, and how you can contribute your time and expertise to inspire the next generation of STEM leaders.
          </p>
        </div>
        <a href="/volunteer" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          See how to join <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

    </div>
  </section>

</main>

<style>
  /* --- CUSTOM HYBRID ARCHITECTURE STRUCTURAL GLASS/NEU RELEASES --- */

  .perspective-container {
    perspective: 1600px;
  }

  /* Blueprint Grid Pattern Generation Overlay */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  /* Tactile Neomorphic Soft Outward Convex Shadow Matrices */
  .shadow-neumorphic-outer {
    box-shadow:
      12px 12px 28px #bebebe,
      -12px -12px 28px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  /* Deep Neomorphic Recessed Inward Concave Intaglio Channels */
  .shadow-neumorphic-inner {
    box-shadow:
      inset 6px 6px 12px #d1d9e6,
      inset -6px -6px 12px #ffffff;
  }

  /* Mechanical Convex Skeuomorphic Push-Buttons */
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

  /* Hard Heavy-Edged Neo-Brutalism Shadow Blocks */
  .box-shadow-flat {
    box-shadow: 6px 6px 0px 0px #000000;
  }

  .box-shadow-flat-hover {
    box-shadow: 10px 10px 0px 0px #000000;
  }
</style>
