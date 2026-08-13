<script>
  import { browser } from '$app/environment';
  import { pb } from '$lib/pocketbase';
  import Head from '$lib/components/head.svelte';
  import Carousel from '$lib/components/carousel.svelte';
  import TeamMap from '$lib/components/team-map.svelte';
  import { Calendar, ChartColumn, Handshake, Wrench, Megaphone, Users, Share2 } from '@lucide/svelte';

  const socials = [
    {
      name: 'Discord',
      href: 'https://discord.com/invite/GTPU98nWY9',
      icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.298 12.298 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/ctfirsttechchallenge/',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61553396255140',
      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    }
  ];

  let { data } = $props();

  // --- SVELTE 5 STATE RUNES ---
  let scrollY = $state(0);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let townInput = $state('');

  /** @param {SubmitEvent} e */
  function searchTown(e) {
    e.preventDefault();
    const slug = townInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!slug) return;
    window.open(`https://robolyst.org/location/${slug}-ct/ftc`, '_blank', 'noopener,noreferrer');
  }

  // --- DERIVED RUNES (2030 SCROLL ANIMATIONS MATRIX) ---
  // Calculates real-time 3D rotation, depth offsets, and scale matrices based on page scroll depth
  let parallaxHeroY = $derived(scrollY * 0.35);
  let mapRotateY = $derived(Math.min(scrollY * 0.02, 8));
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

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] font-sans perspective-container overflow-x-hidden">

  <section class="relative min-h-[100vh] flex items-center justify-center py-20 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#d8e2ef] overflow-hidden">

    <div class="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10 w-full">

      <div class="lg:col-span-6 space-y-8 text-left" style="transform: translateY({parallaxHeroY}px)">
        <img
          src="/ftc-logo.png"
          alt="FIRST Tech Challenge"
          width="744"
          height="188"
          fetchpriority="high"
          class="w-full object-contain max-h-20 object-left"
        />

        <h1 class="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter uppercase">
          FIRST Tech Challenge <br />
          <span class="text-[#2563eb] bg-white border-4 border-black px-3 inline-block my-2 box-shadow-flat transform rotate-1">Right Here in Connecticut!</span>
        </h1>

        <p class="text-slate-800 text-base md:text-xl font-bold leading-relaxed max-w-xl bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl">
          FIRST Tech Challenge is a robotics competition for students in grades 7–12, who design, build, and program a robot to compete in an alliance format against other teams.
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
            <TeamMap teamGroups={data.teamGroups} />
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <form onsubmit={searchTown} class="flex items-center gap-0 rounded-xl border-[3px] border-black box-shadow-flat overflow-hidden">
            <input
              type="text"
              bind:value={townInput}
              placeholder="Your CT town..."
              aria-label="Your CT town name"
              class="bg-white text-black text-xs font-black uppercase tracking-wider placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal px-4 py-3 outline-none w-40"
            />
            <button
              type="submit"
              class="brutalist-btn bg-white text-black text-xs font-black uppercase tracking-wider px-4 py-3 border-l-[3px] border-black transition-colors hover:bg-[#eef2f7] whitespace-nowrap"
            >

              Search Town &rarr;
            </button>
          </form>
        </div>
      </div>

    </div>
  </section>

  <section class="pt-24 px-6 max-w-7xl mx-auto">
    <div class="grid sm:grid-cols-2 gap-8">

      <div class="bg-white border-[3px] border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group">
        <div>
          <img src="https://wpafbstem.com/FTC/img/FTC_logo.png" alt="FIRST Logo" width="744" height="188" loading="lazy" class="h-14 w-auto object-contain mb-6" />
          <h3 class="text-xl font-black text-black uppercase mb-3">What is FIRST?</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed">
            FIRST (For Inspiration and Recognition of Science and Technology) is a global nonprofit founded by inventor Dean Kamen in 1989. It runs a family of robotics programs for students from kindergarten through high school, all built around inspiring young people to become science and technology leaders.
          </p>
        </div>
      </div>

      <div class="bg-white border-[3px] border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group">
        <div>
          <img src="https://wpafbstem.com/FTC/img/FTC_logo.png" alt="FIRST Tech Challenge Logo" width="744" height="188" loading="lazy" class="h-14 w-auto object-contain mb-6" />
          <h3 class="text-xl font-black text-black uppercase mb-3">What is FTC?</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed">
            FIRST Tech Challenge (FTC) is FIRST's program for students in grades 7&ndash;12. Teams design, build, and program a robot from scratch each season, then compete head-to-head in alliance matches while also keeping an engineering notebook and running community outreach.
          </p>
        </div>
      </div>

    </div>
  </section>

  <section class="px-6 max-w-7xl mx-auto pt-8">
    <div class="bg-white border-[3px] border-black rounded-[2.5rem] p-8 md:p-10 box-shadow-flat flex flex-col md:flex-row items-center gap-8">
      <div class="flex-1 text-center md:text-left space-y-2">
        <div class="inline-flex items-center gap-3 justify-center md:justify-start">
          <div class="w-10 h-10 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center shrink-0">
            <Share2 class="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <h3 class="text-xl font-black text-black uppercase tracking-tight">Follow Us Online</h3>
        </div>
        <p class="text-slate-600 text-sm font-semibold leading-relaxed max-w-lg mx-auto md:mx-0">
          Get match updates, event photos, and season announcements as they happen &mdash; join our Discord and follow along on Instagram and Facebook.
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        {#each socials as social}
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            class="w-16 h-15 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-black hover:text-[#2563eb] hover:-translate-y-0.5 transition-all md:w-30"
          >
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d={social.icon} /></svg>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[3rem] p-8 md:p-16 border-2 border-white/60 grid lg:grid-cols-12 gap-16 items-center">

      <div class="lg:col-span-7 space-y-6 text-left">
        <span class="text-xs font-black text-[#2563eb] bg-white border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">More Than Robots</span>
        <h2 class="text-4xl font-black text-black uppercase tracking-tight">The FIRST Experience</h2>
        <p class="text-slate-700 leading-relaxed font-semibold text-base">
          FIRST Tech Challenge is more than a robot on a field. Guided by professional engineers, students build real engineering skills alongside the confidence and leadership that come with them.
        </p>

        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <span class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border-2 border-black">
              <Wrench class="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </span>
            <p class="text-slate-700 font-semibold text-sm leading-relaxed"><b class="text-black font-black">Build the robot.</b> Teams design, build, and program an Android-platform competition robot from scratch each season, then drive it head-to-head in alliance matches.</p>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border-2 border-black">
              <Megaphone class="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </span>
            <p class="text-slate-700 font-semibold text-sm leading-relaxed"><b class="text-black font-black">Give back through outreach.</b> Every team runs STEM outreach in its own community, spreading robotics and engineering to younger students.</p>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border-2 border-black">
              <Users class="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </span>
            <p class="text-slate-700 font-semibold text-sm leading-relaxed"><b class="text-black font-black">Connect with the community.</b> Compete alongside mentors, volunteers, and fellow CT teams under <span class="text-[#2563eb]">gracious professionalism</span> &mdash; competing fiercely while treating every participant with respect.</p>
          </li>
        </ul>
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
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center mb-6">
            <Calendar class="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
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
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center mb-6">
            <ChartColumn class="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h3 class="text-xl font-black text-black uppercase mb-3">CT Team List</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            Robolyst provides an open-source interactive directory of all CT FTC teams, showcasing their match history, awards, and key statistics to analyze performance trends across the state.
          </p>
        </div>
        <a href="/teams" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          Launch Team Directory <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="bg-white border-[3px] border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group sm:col-span-2 lg:col-span-1">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center mb-6">
            <Handshake class="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
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

  {#if data.sponsors?.length}
    <section class="py-16 px-6 border-t-4 border-black bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto text-center mb-8">
        <span class="text-xs font-black text-[#2563eb] bg-[#eef2f7] border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">Thank You</span>
        <h3 class="text-2xl font-black text-black uppercase tracking-tight mt-3">Our Sponsors</h3>
      </div>
      <div class="sponsor-marquee">
        <div class="sponsor-track" style="animation-duration: {Math.max(data.sponsors.length * 8, 20)}s">
          {#each [...data.sponsors, ...data.sponsors] as sponsor, i (sponsor.id + '-' + i)}
            {#if sponsor.Website}
              <a
                href={sponsor.Website}
                target="_blank"
                rel="noopener noreferrer"
                class="sponsor-chip"
                tabindex={i < data.sponsors.length ? 0 : -1}
              >
                {#if sponsor.Logo}
                  <img src={pb.files.getUrl(sponsor, sponsor.Logo, { thumb: '200x200' })} alt="" class="sponsor-logo" loading="lazy" />
                {/if}
                <span class="sponsor-name">{sponsor.Name}</span>
              </a>
            {:else}
              <div class="sponsor-chip" aria-hidden={i >= data.sponsors.length}>
                {#if sponsor.Logo}
                  <img src={pb.files.getUrl(sponsor, sponsor.Logo, { thumb: '200x200' })} alt="" class="sponsor-logo" loading="lazy" />
                {/if}
                <span class="sponsor-name">{sponsor.Name}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    </section>
  {/if}

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

  /* Sponsor Reel - Continuous Left-to-Right Sliding Marquee */
  .sponsor-marquee {
    width: 100%;
    -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
    mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  }

  .sponsor-track {
    display: flex;
    align-items: center;
    gap: 2rem;
    width: max-content;
    animation-name: sponsor-scroll;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .sponsor-track:hover {
    animation-play-state: paused;
  }

  @keyframes sponsor-scroll {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0%);
    }
  }

  .sponsor-chip {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1.5rem;
    border: 2px solid #000;
    border-radius: 9999px;
    background: #eef2f7;
    box-shadow: 4px 4px 0px 0px #000;
    white-space: nowrap;
    flex-shrink: 0;
    text-decoration: none;
    transition: transform 0.2s ease;
  }

  a.sponsor-chip:hover {
    transform: translateY(-2px);
  }

  .sponsor-logo {
    height: 2.25rem;
    width: 2.25rem;
    object-fit: contain;
    border-radius: 0.4rem;
    background: white;
  }

  .sponsor-name {
    font-weight: 900;
    font-size: 0.8125rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #1a1a1a;
  }
</style>
