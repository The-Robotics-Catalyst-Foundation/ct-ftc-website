<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { pb } from '$lib/pocketbase';
  import { fade, fly } from 'svelte/transition';
  import { Share2, CodeXml, Radar } from '@lucide/svelte';
  import Modal from '$lib/components/modal.svelte';
  import EmbedBuilder from '$lib/components/embed-builder.svelte';
  import { robolystEventUrl } from '$lib/robolyst';

  let { data } = $props();

  // --- SVELTE 5 STATE RUNES ---
  let event: any = $state(data.event);
  let isLoaded = $state(false);
  let scrollY = $state(0);
  let mousePos = $state({ x: 0, y: 0 });
  let timeStr = $state('');
  let embedOpen = $state(false);
  let shareCopied = $state(false);
  let shareCopyTimeout: ReturnType<typeof setTimeout> | null = null;
  let eventShareCopied = $state(false);
  let eventShareCopyTimeout: ReturnType<typeof setTimeout> | null = null;

  async function copyPhotosLink() {
    if (!event) return;
    const url = `${$page.url.origin}/events/${event.slug || event.id}/photos`;
    try {
      await navigator.clipboard.writeText(url);
      shareCopied = true;
      if (shareCopyTimeout) clearTimeout(shareCopyTimeout);
      shareCopyTimeout = setTimeout(() => (shareCopied = false), 1800);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  async function shareEvent() {
    if (!event) return;
    const url = `${$page.url.origin}/events/${event.slug || event.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.name, url });
      } catch {
        // user cancelled the native share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      eventShareCopied = true;
      if (eventShareCopyTimeout) clearTimeout(eventShareCopyTimeout);
      eventShareCopyTimeout = setTimeout(() => (eventShareCopied = false), 1800);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  onDestroy(() => {
    if (shareCopyTimeout) clearTimeout(shareCopyTimeout);
    if (eventShareCopyTimeout) clearTimeout(eventShareCopyTimeout);
  });

  const eventJsonLd = $derived(
    event
      ? JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.name,
            startDate: event.date_time,
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: event.location,
              address: event.location
            },
            organizer: {
              '@type': 'Organization',
              name: 'Connecticut FIRST Tech Challenge',
              url: $page.url.origin
            },
            url: `${$page.url.origin}/events/${event.slug || event.id}`
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${$page.url.origin}/` },
              { '@type': 'ListItem', position: 2, name: 'Events', item: `${$page.url.origin}/events` },
              {
                '@type': 'ListItem',
                position: 3,
                name: event.name,
                item: `${$page.url.origin}/events/${event.slug || event.id}`
              }
            ]
          }
        ]).replace(/</g, '\\u003c')
      : ''
  );

  const now = new Date().toISOString();

  // Optimized Mouse Move Parallax
  function handleMouseMove(e: MouseEvent) {
    mousePos = {
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10
    };
  }

  function updateCountdown(dateISO: string) {
    const diff = new Date(dateISO).getTime() - Date.now();
    if (diff <= 0) return (timeStr = 'Event Concluded');
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    timeStr = `${d}d ${h}h ${m}m Remaining`;
  }

  onMount(() => {
    updateCountdown(event.date_time);
    const timer = setInterval(() => updateCountdown(event.date_time), 60000);
    setTimeout(() => (isLoaded = true), 50);

    return () => clearInterval(timer);
  });

  // --- DERIVED PROPERTY RUNES ---
  let isPastEvent = $derived(event ? event.date_time < now : false);
  // The live "Xd Xh Xm remaining" countdown is only meaningful close to the
  // event - hide it until the event is within 2 weeks out.
  let daysUntilEvent = $derived(event ? (new Date(event.date_time).getTime() - Date.now()) / 86400000 : Infinity);
  let showCountdownPill = $derived(isPastEvent || daysUntilEvent <= 14);
  let parallaxHeroY = $derived(scrollY * 0.20);
  let parallaxHeadlineY = $derived(scrollY * 0.35);

  // Safe extraction of PocketBase PDF URL
  let pdfUrl = $derived(event && event.event_pdf ? pb.files.getURL(event, event.event_pdf) : null);
  let robolystUrl = $derived(event ? robolystEventUrl(event.date_time, event.slug) : null);
</script>

<svelte:window bind:scrollY onmousemove={handleMouseMove} />

<svelte:head>
  {@html `<script type="application/ld+json">${eventJsonLd}</script>`}
</svelte:head>

{#if event}
<main class="min-h-screen bg-[#eef2f7] text-[#1a1a1a] pb-24 overflow-x-hidden relative perspective-1000">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none z-0"></div>

  <section class="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden pt-20 pb-12 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7]">
    <div class="w-full max-w-5xl z-20 mb-auto" style="transform: translateY({parallaxHeroY}px)">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" class="inline-flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini">
          <a href="/" class="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#2563eb] transition-colors">Home</a>
          <span class="text-[10px] font-mono text-slate-400 font-black">/</span>
          <a href="/events" class="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-[#2563eb] transition-colors">Events</a>
          <span class="text-[10px] font-mono text-slate-400 font-black">/</span>
          <span class="text-xs font-black uppercase tracking-wider text-[#2563eb] max-w-[150px] sm:max-w-xs truncate" aria-current="page">
            {event.name}
          </span>
        </nav>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={shareEvent}
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini text-xs font-black uppercase tracking-wide text-slate-700 hover:text-[#2563eb] transition-all active:translate-y-[2px]"
          >
            <Share2 class="w-3.5 h-3.5" strokeWidth={2.5} />
            {eventShareCopied ? 'Copied!' : 'Share Event'}
          </button>
          {#if robolystUrl}
            <a
              href={robolystUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini text-xs font-black uppercase tracking-wide text-slate-700 hover:text-[#2563eb] transition-all active:translate-y-[2px]"
            >
              <Radar class="w-3.5 h-3.5" strokeWidth={2.5} />
              Robolyst
            </a>
          {/if}
          {#if event.pics && event.pics.length > 0}
            <button
              type="button"
              onclick={copyPhotosLink}
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini text-xs font-black uppercase tracking-wide text-slate-700 hover:text-[#2563eb] transition-all active:translate-y-[2px]"
            >
              <Share2 class="w-3.5 h-3.5" strokeWidth={2.5} />
              {shareCopied ? 'Copied!' : 'Share Photos'}
            </button>
          {/if}
          <button
            type="button"
            onclick={() => (embedOpen = true)}
            class="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini text-xs font-black uppercase tracking-wide text-slate-700 hover:text-[#2563eb] transition-all active:translate-y-[2px]"
          >
            <CodeXml class="w-3.5 h-3.5" strokeWidth={2.5} />
            Embed
          </button>
        </div>
      </div>
    </div>

    <div class="w-full max-w-5xl z-10 text-center my-auto pt-8" style="transform: translateY({parallaxHeadlineY}px)">
      {#if isLoaded}
        <div in:fly={{ y: 30, duration: 600 }}>
          <span class="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black box-shadow-mini transform -rotate-1">
            {isPastEvent ? 'Past Event' : 'Upcoming Event'}
          </span>
          {#if event.type}
            <span class="inline-block px-4 py-1.5 mb-6 ml-2 text-xs font-black uppercase tracking-widest text-slate-900 bg-white border-2 border-black box-shadow-mini transform rotate-1">
              {event.type}
            </span>
          {/if}

          <h1 class="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.95] mb-8 max-w-4xl mx-auto">
            {#each event.name.split(' ') as word}
              <span class="hover-word inline-block mr-3 transform transition-transform duration-200">{word}</span>
            {/each}
          </h1>

          <div class="inline-flex flex-col sm:flex-row items-center gap-4 p-3 bg-white border-3 border-black rounded-2xl box-shadow-flat">
            {#if showCountdownPill}
              <div class="flex items-center gap-2 px-3 py-1 bg-slate-900 text-emerald-400 font-mono text-xs font-bold rounded-lg border-2 border-black shadow-inner">
                <span class="w-2 h-2 rounded-full {isPastEvent ? 'bg-slate-400' : 'bg-emerald-400 animate-pulse'}"></span>
                <span>{isPastEvent ? 'Concluded' : timeStr}</span>
              </div>
            {/if}

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

        <div class="flex flex-col items-center gap-8 text-center">
          <div class="w-full space-y-8">
            <div class="space-y-1">
              <p class="text-2xl font-black text-black uppercase tracking-tight leading-tight">
                {isPastEvent ? 'This tournament has ended.' : 'Tournament schedule and information details.'}
              </p>
            </div>

            <div class="p-6 bg-[#eef2f7] rounded-3xl shadow-neumorphic-card-inner border border-white/50 space-y-1">
              <span class="block text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Date
              </span>
              <div class="text-2xl md:text-4xl font-black text-[#2563eb] tracking-tight leading-tight py-1">
                {new Date(event.date_time).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-center gap-4 p-5 bg-white border-2 border-black rounded-2xl box-shadow-mini">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-[#eef2f7] rounded-xl shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div class="text-left">
                  <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Location</span>
                  <span class="text-sm font-black text-black uppercase">{event.location}</span>
                </div>
              </div>

              <a href="https://maps.google.com/?q={encodeURIComponent(event.location)}"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="sm:shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#facc15] text-black text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black box-shadow-mini active:translate-y-[2px] transition-all">
                <span>Open Maps ↗</span>
              </a>
            </div>

            {#if !isPastEvent}
              <div class="p-5 bg-white border-2 border-black rounded-2xl box-shadow-mini space-y-4">
                <div>
                  <span class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Volunteer for this event</span>
                  <p class="text-xs font-bold text-slate-500 mt-0.5">No experience required — just show up ready to help.</p>
                </div>

                <a
                  href={event.volunteerLink || '/volunteer'}
                  target={event.volunteerLink ? '_blank' : undefined}
                  rel={event.volunteerLink ? 'noopener noreferrer' : undefined}
                  class="skeuo-button flex items-center justify-center gap-2 px-6 py-3 bg-[#2563eb] text-white text-sm font-black uppercase tracking-wider text-center rounded-xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all"
                >
                  Register to Volunteer on FIRST ↗
                </a>

                <a href="/contact/#volunteer" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-slate-500 hover:text-black transition-colors">
                  Have questions? Contact the coordinator <span>&rarr;</span>
                </a>
              </div>
            {/if}

            {#if event.imgLink}
              <a
                href={event.imgLink}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 w-full px-5 py-3 bg-emerald-400 text-black text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black box-shadow-mini hover:translate-y-[1px] active:translate-y-[2px] transition-all"
              >
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 6v12.75a1.5 1.5 0 0 0 1.5 1.5Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 8.25a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span>View Photos Here</span>
              </a>
            {/if}
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

  <Modal open={embedOpen} onClose={() => (embedOpen = false)} title="Embed this event">
    <EmbedBuilder
      id={event.id}
      slug={event.slug}
      name={event.name}
      type={event.type}
      location={event.location}
      dateTime={event.date_time}
      volunteersNeeded={event.volunteersNeeded}
    />
  </Modal>

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
</style>
