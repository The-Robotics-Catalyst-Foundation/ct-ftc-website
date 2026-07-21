<script lang="ts">
  import { onMount } from 'svelte';
<<<<<<< HEAD
  import { enhance } from '$app/forms';
  import { pb } from '$lib/pocketbase';
  import { fade, fly } from 'svelte/transition';
  import { revealTiles } from '$lib/motion';
  import { formatCountdown } from '$lib/format';
  import { jsonLdScript } from '$lib/seo.js';
  import GlassTile from '$lib/components/ui/GlassTile.svelte';

  let { data } = $props();

  const volunteerSteps = [
    'Review the roles needed for this event and pick what fits you.',
    'Register your role through the official FIRST Dashboard.',
    "Come back here and confirm you've registered so organizers know to expect you."
  ];

  // Rendered server-side already (see +page.server.ts), so crawlers and
  // no-JS clients get the real event content on first paint.
  let event: any = $derived(data.event);
  let isLoaded = $state(false);
  let hasVolunteered = $state(data.alreadyVolunteered);
  let isSubmittingRsvp = $state(false);
  let rsvpError = $state('');
  let showVolunteerModal = $state(false);
  let confirmedRegistration = $state(false);
  let rsvpEmail = $state('');

  function openVolunteerModal() {
    showVolunteerModal = true;
  }

  function closeVolunteerModal() {
    showVolunteerModal = false;
    confirmedRegistration = false;
    rsvpEmail = '';
    rsvpError = '';
  }

  function handleModalKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeVolunteerModal();
  }

  const now = new Date().toISOString();

  onMount(() => {
    setTimeout(() => {
      isLoaded = true;
      revealTiles('.bento-tile');
    }, 50);
  });

  let isPastEvent = $derived(event.date_time < now);
  let countdown = $derived(formatCountdown(event.date_time));
  let pdfUrl = $derived(event.event_pdf ? pb.files.getURL(event, event.event_pdf) : null);

  const eventSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.name,
    startDate: new Date(event.date_time).toISOString(),
    eventStatus: isPastEvent ? 'https://schema.org/EventCompleted' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location || 'Location TBD'
    },
    organizer: {
      '@type': 'Organization',
      name: 'Connecticut FIRST Tech Challenge',
      url: 'https://ctftc.org'
    }
  });
</script>

<svelte:head>
  {@html jsonLdScript(eventSchema)}
</svelte:head>

<svelte:window onkeydown={showVolunteerModal ? handleModalKeydown : undefined} />

<main class="aurora-field min-h-screen pb-24">

  <section class="max-w-5xl mx-auto px-6 pt-24 pb-6">
    <nav aria-label="Breadcrumb" class="inline-flex items-center gap-2.5 px-4 py-2 glass-tile rounded-full text-xs font-semibold">
      <a href="/" class="text-ink-400 hover:text-robotics-blue transition-colors">Home</a>
      <span class="text-ink-400">/</span>
      <a href="/events" class="text-ink-400 hover:text-robotics-blue transition-colors">Events</a>
      <span class="text-ink-400">/</span>
      <span class="text-robotics-blue max-w-[150px] sm:max-w-xs truncate" aria-current="page">{event.name}</span>
    </nav>
  </section>

  <section class="max-w-5xl mx-auto px-6 pb-6 text-center">
    {#if isLoaded}
      <div in:fly={{ y: 20, duration: 500 }}>
        <span class="inline-block px-4 py-1.5 mb-6 text-xs font-semibold text-ink-900 bg-white/60 rounded-full">
          {isPastEvent ? 'Past event' : 'Upcoming event'}
        </span>

        <h1 class="text-4xl md:text-6xl font-bold text-ink-900 tracking-tight leading-[1.05] mb-8 max-w-4xl mx-auto">
=======
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

  // Optimized Mouse Move Parallax 
  function handleMouseMove(e) {
    mousePos = {
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10
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
  let parallaxHeroY = $derived(scrollY * 0.20);
  let parallaxHeadlineY = $derived(scrollY * 0.35);
  
  // Safe extraction of PocketBase PDF URL
  let pdfUrl = $derived(event && event.event_pdf ? pb.files.getURL(event, event.event_pdf) : null);
</script>

<svelte:window bind:scrollY onmousemove={handleMouseMove} />

{#if event}
<main class="min-h-screen bg-[#eef2f7] text-[#1a1a1a] pb-24 overflow-x-hidden relative perspective-1000">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none z-0"></div>
  
  <section class="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden pt-20 pb-12 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7]">
    <div class="w-full max-w-5xl z-20 mb-auto" style="transform: translateY({parallaxHeroY}px)">
      <nav aria-label="Breadcrumb" class="inline-flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini">
        <a href="/" class="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#2563eb] transition-colors">Home</a>
        <span class="text-[10px] font-mono text-slate-400 font-black">/</span>
        <a href="/events" class="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#2563eb] transition-colors">Events</a>
        <span class="text-[10px] font-mono text-slate-400 font-black">/</span>
        <span class="text-xs font-black uppercase tracking-wider text-[#2563eb] max-w-[150px] sm:max-w-xs truncate" aria-current="page">
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
          {event.name}
        </span>
      </nav>
    </div>

<<<<<<< HEAD
        <div class="inline-flex flex-col sm:flex-row items-center gap-3 p-2 glass-tile rounded-full">
          <div class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 text-xs font-semibold text-ink-600">
            <span class="w-1.5 h-1.5 rounded-full {isPastEvent ? 'bg-ink-400' : 'bg-emerald-500 animate-pulse'}"></span>
            <span>{isPastEvent ? 'Concluded' : (countdown ?? 'Upcoming')}</span>
          </div>
=======
    <div class="w-full max-w-5xl z-10 text-center my-auto pt-8" style="transform: translateY({parallaxHeadlineY}px)">
      {#if isLoaded}
        <div in:fly={{ y: 30, duration: 600 }}>
          <span class="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black box-shadow-mini transform -rotate-1">
            {isPastEvent ? 'Past Event' : 'Upcoming Event'}
          </span>
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)

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
            
            <div class="flex gap-2">
              <a href="#details-section" class="skeuo-button px-5 py-2.5 bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all whitespace-nowrap">
                Details
              </a>
              {#if pdfUrl}
                <a href="#pdf-section" class="skeuo-button-yellow flex items-center gap-1.5 px-5 py-2.5 bg-[#facc15] text-black text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-skeuo-black hover:translate-y-[1px] active:translate-y-[3px] transition-all whitespace-nowrap">
                  <span>View Rules/PDF</span>
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </a>
              {/if}
            </div>
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

<<<<<<< HEAD
          <div class="glass-tile !p-6 rounded-3xl space-y-1">
            <span class="flex items-center gap-1.5 text-xs font-semibold text-ink-400">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              Date
            </span>
            <div class="text-3xl md:text-4xl font-bold text-robotics-blue tracking-tight leading-tight py-1">
              {new Date(event.date_time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <span class="block text-xs font-semibold text-ink-600">
              {new Date(event.date_time).getFullYear()}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-tile !p-5 rounded-2xl">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-ink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div>
                <span class="block text-xs font-semibold text-ink-400">Location</span>
                <span class="text-sm font-semibold text-ink-900">{event.location}</span>
              </div>
=======
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-8 text-left">
            <div class="space-y-1">
              <p class="text-2xl font-black text-black uppercase tracking-tight leading-tight">
                {isPastEvent ? 'This tournament has ended.' : 'Tournament schedule and information details.'}
              </p>
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
            </div>

            <div class="p-6 bg-[#eef2f7] rounded-3xl shadow-neumorphic-card-inner border border-white/50 space-y-1">
              <span class="block text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Date & Time
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
                <div class="w-12 h-12 bg-[#eef2f7] rounded-xl shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
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

<<<<<<< HEAD
            <p class="text-xs text-ink-400">
              {event.volunteersAttending ?? 0}{#if event.volunteersNeeded} / {event.volunteersNeeded}{/if} volunteers signed up so far{#if hasVolunteered} &middot; <span class="text-emerald-700 font-semibold">you're on the list</span>{/if}
            </p>
          {/if}
        </div>

        <div class="lg:col-span-5 relative aspect-square w-full max-w-[300px] mx-auto lg:max-w-none">
          <div class="relative h-full w-full glass-tile rounded-[2rem] p-2 flex flex-col items-center justify-center text-center overflow-hidden">
            {#if event.pics && event.pics.length > 0}
              <div class="w-full h-full rounded-[1.6rem] overflow-hidden bg-white/40 relative group">
                <img
                  src={pb.files.getURL(event, event.pics[0])}
                  alt="Event cover"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <a href="#collage-section" class="absolute inset-0 bg-ink-900/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
=======
            {#if !isPastEvent}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="/volunteer" class="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white text-sm font-black uppercase tracking-wider rounded-2xl border-2 border-black box-shadow-flat hover:bg-blue-600 active:translate-y-[2px] transition-all">
                  <span>Sign Up to Volunteer</span>
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                  </svg>
                </a>

                <a href="/contact/#volunteer" class="flex items-center justify-center gap-2 px-6 py-4 bg-white text-black text-sm font-black uppercase tracking-wider rounded-2xl border-2 border-black box-shadow-mini hover:bg-slate-50 active:translate-y-[2px] transition-all">
                  <span>Contact Coordinator</span>
                  <svg class="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
                  </svg>
                </a>
              </div>
            {/if}
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
                    <a href="#collage-section" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        <span class="text-xs font-black uppercase text-white mt-1">View Gallery</span>
                    </a>
                  </div>
               {:else}
                  <svg class="w-12 h-12 text-slate-300 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12.75a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 3.75 0 11-.75 0 .375 3.75 0 01.75 0z" />
                  </svg>
                  <span class="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">No Media Available</span>
               {/if}
             </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  {#if pdfUrl}
    <section id="pdf-section" class="max-w-5xl mx-auto px-6 py-12 relative z-20">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <span class="text-xs font-black text-white bg-[#2563eb] px-2 py-0.5 rounded uppercase tracking-wider font-mono">Documentation</span>
          <h2 class="text-4xl font-black text-black uppercase tracking-tighter mt-1">Event Guide & Rules</h2>
        </div>
        <a 
          href={pdfUrl} 
          download 
          target="_blank" 
          rel="noopener noreferrer" 
          class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-[#facc15] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black box-shadow-mini-yellow hover:bg-slate-900 active:translate-y-[2px] transition-all"
        >
          <span>Download PDF</span>
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </a>
      </div>

      <div class="w-full bg-white border-4 border-black rounded-3xl box-shadow-flat p-2 md:p-4 overflow-hidden relative">
        <div class="absolute top-2 left-4 flex gap-1.5 z-30 pointer-events-none md:flex hidden">
          <div class="w-3 h-3 rounded-full bg-[#ef4444] border border-black"></div>
          <div class="w-3 h-3 rounded-full bg-[#facc15] border border-black"></div>
          <div class="w-3 h-3 rounded-full bg-[#22c55e] border border-black"></div>
        </div>
        
        <div class="w-full h-[500px] md:h-[750px] rounded-2xl overflow-hidden border-2 border-black bg-slate-100 mt-0 md:mt-4 relative">
          <object 
            data={`${pdfUrl}#toolbar=1&navpanes=0`} 
            type="application/pdf" 
            class="w-full h-full"
          >
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50">
              <svg class="w-12 h-12 text-slate-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
              <h4 class="text-xl font-black uppercase text-black">Unable to preview PDF directly</h4>
              <p class="text-xs text-slate-500 font-bold max-w-sm mt-2 mb-6 uppercase tracking-tight">
                Your device or browser doesn't support interactive inline embeds. Click below to read easily!
              </p>
              <a href={pdfUrl} target="_blank" rel="noreferrer" class="px-6 py-3 bg-[#2563eb] border-2 border-black text-white font-black uppercase tracking-wide text-xs box-shadow-mini rounded-xl">
                Open Document in New Window ↗
              </a>
            </div>
          </object>
        </div>
      </div>
    </section>
  {/if}

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
                class="bg-white border-3 border-black p-2 rounded-2xl box-shadow-mini transform transition-all duration-300 hover:scale-[1.03] hover:rotate-1 hover:box-shadow-mini-hover group"
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

  /* Neo-Brutalist Utility Classes */
  .box-shadow-flat { box-shadow: 6px 6px 0px 0px #000000; }
  .box-shadow-mini { box-shadow: 3px 3px 0px 0px #000000; }
  .box-shadow-mini-hover { box-shadow: 6px 6px 0px 0px #000000; }
  .box-shadow-mini-yellow { box-shadow: 3px 3px 0px 0px #facc15; }

  .shadow-skeuo { box-shadow: 0px 4px 0px #1d4ed8, 4px 8px 12px rgba(0, 0, 0, 0.1); }
  .shadow-skeuo-black { box-shadow: 0px 4px 0px #000000, 4px 8px 12px rgba(0, 0, 0, 0.1); }
  
  .skeuo-button:hover { box-shadow: 0px 3px 0px #1d4ed8, 2px 5px 8px rgba(0, 0, 0, 0.08); }
  .skeuo-button:active { box-shadow: 0px 0px 0px #1d4ed8, 0px 1px 2px rgba(0, 0, 0, 0.05); }

  .skeuo-button-yellow:hover { box-shadow: 0px 3px 0px #000000, 2px 5px 8px rgba(0, 0, 0, 0.08); }
  .skeuo-button-yellow:active { box-shadow: 0px 0px 0px #000000, 0px 1px 2px rgba(0, 0, 0, 0.05); }

  /* Neumorphism Classes */
  .shadow-neumorphic-outer {
    box-shadow: 
      14px 14px 32px #bdc7d4, 
      -14px -14px 32px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }
  .shadow-neumorphic-inner { box-shadow: inset 5px 5px 10px #cad4e2, inset -5px -5px 10px #ffffff; }
  .shadow-neumorphic-card-inner { box-shadow: inset 4px 4px 8px #cad4e2, inset -4px -4px 8px #ffffff; }

  .animate-bounce-slow { animation: floating-widget 6s infinite ease-in-out; }

  @keyframes floating-widget {
    0%, 100% { transform: translateY(0) rotate(12deg); }
    50% { transform: translateY(-14px) rotate(15deg); }
  }
</style>