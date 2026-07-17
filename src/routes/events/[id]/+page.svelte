<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import { pb } from '$lib/pocketbase';
  import { fade, fly } from 'svelte/transition';
  import { revealTiles } from '$lib/motion';
  import GlassTile from '$lib/components/ui/GlassTile.svelte';

  let { data } = $props();

  const volunteerSteps = [
    'Review the roles needed for this event and pick what fits you.',
    'Register your role through the official FIRST Dashboard.',
    "Come back here and confirm you've registered so organizers know to expect you."
  ];

  let event: any = $state(null);
  let isLoaded = $state(false);
  let timeStr = $state('');
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

  function updateCountdown(dateISO: string) {
    const diff = new Date(dateISO).getTime() - Date.now();
    if (diff <= 0) return (timeStr = 'Event concluded');
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    timeStr = `${d}d ${h}h ${m}m remaining`;
  }

  onMount(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    async function fetchEventNode() {
      const id = $page.params.id;
      if (!id) return;
      try {
        try {
          event = await pb.collection('events').getOne(id);
        } catch {
          event = await pb.collection('events').getFirstListItem(pb.filter('slug = {:slug}', { slug: id }));
        }
        updateCountdown(event.date_time);
        timer = setInterval(() => updateCountdown(event.date_time), 60000);
        setTimeout(() => {
          isLoaded = true;
          revealTiles('.bento-tile');
        }, 50);
      } catch (e) {
        console.error('Failed to fetch event data:', e);
      }
    }

    fetchEventNode();

    return () => {
      if (timer) clearInterval(timer);
    };
  });

  let isPastEvent = $derived(event ? event.date_time < now : false);
  let pdfUrl = $derived(event && event.event_pdf ? pb.files.getURL(event, event.event_pdf) : null);
</script>

<svelte:window onkeydown={showVolunteerModal ? handleModalKeydown : undefined} />

{#if event}
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
          {event.name}
        </h1>

        <div class="inline-flex flex-col sm:flex-row items-center gap-3 p-2 glass-tile rounded-full">
          <div class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 text-xs font-semibold text-ink-600">
            <span class="w-1.5 h-1.5 rounded-full {isPastEvent ? 'bg-ink-400' : 'bg-emerald-500 animate-pulse'}"></span>
            <span>{isPastEvent ? 'Concluded' : timeStr}</span>
          </div>

          <div class="flex gap-2">
            <a href="#details-section" class="px-5 py-2 bg-robotics-blue text-white text-xs font-semibold rounded-full shadow-ambient shadow-ambient-hover transition-all whitespace-nowrap">
              Details
            </a>
            {#if pdfUrl}
              <a href="#pdf-section" class="flex items-center gap-1.5 px-5 py-2 glass-tile rounded-full text-xs font-semibold text-ink-900 transition-all whitespace-nowrap">
                <span>View rules/PDF</span>
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </section>

  <section id="details-section" class="max-w-5xl mx-auto px-6 py-10">
    <GlassTile class="bento-tile" rounded="rounded-[2.5rem]" padding="p-6 md:p-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-7 space-y-6 text-left">
          <p class="text-xl font-semibold text-ink-900 leading-tight">
            {isPastEvent ? 'This tournament has ended.' : 'Tournament schedule and information details.'}
          </p>

          <div class="glass-tile !p-6 rounded-3xl space-y-1">
            <span class="flex items-center gap-1.5 text-xs font-semibold text-ink-400">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Date &amp; time
            </span>
            <div class="text-4xl md:text-5xl font-bold text-robotics-blue tracking-tight leading-none py-1">
              {new Date(event.date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </div>
            <span class="block text-xs font-semibold text-ink-600">
              {new Date(event.date_time).toLocaleDateString(undefined, { dateStyle: 'full' })}
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
            </div>

            <a href="https://www.google.com/maps/search/?api=1&query={encodeURIComponent(event.location)}"
               target="_blank"
               rel="noopener noreferrer"
               class="sm:shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-robotics-blue text-white text-xs font-semibold rounded-full shadow-ambient shadow-ambient-hover transition-all">
              <span>Open maps &#8599;</span>
            </a>
          </div>

          {#if !isPastEvent}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onclick={openVolunteerModal} class="flex items-center justify-center gap-2 px-6 py-3.5 bg-robotics-blue text-white text-sm font-semibold rounded-full shadow-ambient shadow-ambient-hover transition-all">
                <span>Volunteer at this event</span>
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </button>

              <a href="/contact/#volunteer" class="flex items-center justify-center gap-2 px-6 py-3.5 glass-tile rounded-full text-sm font-semibold text-ink-900 transition-all">
                <span>Contact coordinator</span>
                <svg class="w-4 h-4 text-ink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>

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
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <a href="#collage-section" class="absolute inset-0 bg-ink-900/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                  <span class="text-xs font-semibold text-white mt-1">View gallery</span>
                </a>
              </div>
            {:else}
              <svg class="w-12 h-12 text-ink-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12.75a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 3.75 0 11-.75 0 .375 3.75 0 01.75 0z" />
              </svg>
              <span class="text-xs font-semibold text-ink-400">No media available</span>
            {/if}
          </div>
        </div>
      </div>
    </GlassTile>
  </section>

  {#if showVolunteerModal}
    <div class="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onclick={closeVolunteerModal}
        class="absolute inset-0 bg-ink-900/40 backdrop-blur-sm cursor-default"
      ></button>

      <div
        transition:fly={{ y: 16, duration: 250 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="volunteer-modal-title"
        class="glass-tile glass-tile-strong relative w-full max-w-md rounded-[2rem] p-6 md:p-8 text-left"
      >
        <button
          onclick={closeVolunteerModal}
          aria-label="Close"
          class="absolute top-4 right-4 w-8 h-8 rounded-full glass-tile flex items-center justify-center text-ink-600 hover:text-robotics-blue transition-colors"
        >
          <span class="text-sm">&times;</span>
        </button>

        <span class="text-xs font-semibold text-robotics-blue bg-white/60 px-2.5 py-1 rounded-full">Volunteering</span>
        <h2 id="volunteer-modal-title" class="text-xl font-semibold text-ink-900 tracking-tight mt-3 mb-5">Volunteer at this event</h2>

        {#if hasVolunteered}
          <div class="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500/15 text-emerald-700 text-sm font-semibold">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            You're on the list for this event
          </div>
        {:else}
          <ol class="space-y-3 mb-6">
            {#each volunteerSteps as step, i}
              <li class="flex items-start gap-3">
                <span class="w-6 h-6 shrink-0 rounded-full bg-robotics-blue text-white text-xs font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span class="text-sm text-ink-600 leading-relaxed">{step}</span>
              </li>
            {/each}
          </ol>

          <a href="/volunteer" class="inline-flex items-center gap-1.5 text-sm font-semibold text-robotics-blue hover:underline mb-6">
            See volunteer roles &amp; official registration &rarr;
          </a>

          <div class="glass-tile !p-5 rounded-2xl text-center space-y-4">
            {#if !confirmedRegistration}
              <p class="text-sm font-medium text-ink-900">
                Have you completed your registration on the FIRST Dashboard for this event?
              </p>
              <p class="text-xs text-ink-400">
                We only count confirmed volunteers, so organizers can plan around a real headcount.
              </p>
              <button
                onclick={() => (confirmedRegistration = true)}
                class="w-full px-6 py-3 glass-tile rounded-full text-sm font-semibold text-ink-900 transition-all"
              >
                Yes, I've registered
              </button>
            {:else}
              <p class="text-sm font-medium text-ink-900">Great — let organizers know to expect you.</p>

              <form
                method="POST"
                action="?/volunteer"
                use:enhance={() => {
                  isSubmittingRsvp = true;
                  rsvpError = '';
                  return async ({ result }) => {
                    isSubmittingRsvp = false;
                    if (result.type === 'success') {
                      hasVolunteered = true;
                      if (result.data?.volunteersAttending != null) {
                        event.volunteersAttending = result.data.volunteersAttending;
                      }
                    } else if (result.type === 'failure') {
                      rsvpError = (result.data?.error as string) ?? 'Something went wrong.';
                    }
                  };
                }}
                class="space-y-3"
              >
                <input
                  type="email"
                  name="email"
                  bind:value={rsvpEmail}
                  required
                  placeholder="you@example.com"
                  class="w-full rounded-full bg-white/60 px-5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:ring-2 focus:ring-robotics-blue"
                />
                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-robotics-blue text-white text-sm font-semibold rounded-full shadow-ambient shadow-ambient-hover transition-all disabled:opacity-60"
                >
                  {isSubmittingRsvp ? 'Counting you in…' : 'Count me in'}
                </button>
              </form>

              {#if rsvpError}
                <p class="text-xs text-rose-600">{rsvpError}</p>
              {/if}

              <p class="text-[11px] text-ink-400 leading-relaxed">
                This just tells organizers to expect you — it's not the official FIRST volunteer registration.
              </p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if pdfUrl}
    <section id="pdf-section" class="max-w-5xl mx-auto px-6 py-8">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold text-robotics-blue bg-white/60 px-2.5 py-1 rounded-full">Documentation</span>
          <h2 class="text-3xl font-bold text-ink-900 tracking-tight mt-2">Event guide &amp; rules</h2>
        </div>
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-robotics-blue text-white text-xs font-semibold rounded-full shadow-ambient shadow-ambient-hover transition-all"
        >
          <span>Download PDF</span>
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </a>
      </div>

      <GlassTile rounded="rounded-[2rem]" padding="p-2 md:p-4">
        <div class="w-full h-[500px] md:h-[750px] rounded-[1.5rem] overflow-hidden bg-white/50 relative">
          <object
            title="Event guide and rules PDF"
            data={`${pdfUrl}#toolbar=1&navpanes=0`}
            type="application/pdf"
            class="w-full h-full"
          >
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <svg class="w-12 h-12 text-ink-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
              <h4 class="text-lg font-semibold text-ink-900">Unable to preview PDF directly</h4>
              <p class="text-xs text-ink-600 max-w-sm mt-2 mb-6">
                Your device or browser doesn't support interactive inline embeds. Click below to read it instead.
              </p>
              <a href={pdfUrl} target="_blank" rel="noreferrer" class="px-6 py-2.5 bg-robotics-blue text-white font-semibold text-xs rounded-full shadow-ambient">
                Open document in new window &#8599;
              </a>
            </div>
          </object>
        </div>
      </GlassTile>
    </section>
  {/if}

  {#if event.pics && event.pics.length > 0}
    <section id="collage-section" class="max-w-7xl mx-auto px-6 py-8" in:fade={{ duration: 400 }}>
      <div class="mb-8 flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-ink-900 bg-white/60 px-2.5 py-1 rounded-full">Gallery</span>
          <h2 class="text-3xl font-bold text-ink-900 tracking-tight mt-2">Event photos</h2>
        </div>
        <div class="glass-tile !p-3 rounded-xl text-xs font-semibold text-ink-600">
          {event.pics.length} images
        </div>
      </div>

      <GlassTile rounded="rounded-[2rem]" padding="p-6 md:p-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 select-none">
          {#each event.pics as img, idx}
            <div class="glass-tile !p-2 rounded-2xl transition-all duration-300 hover:scale-[1.02] group">
              <div class="aspect-[4/3] w-full rounded-xl overflow-hidden bg-white/40 relative">
                <img
                  src={pb.files.getURL(event, img)}
                  alt="Event thumbnail {idx + 1}"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <span class="absolute top-2 right-2 bg-ink-900/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {idx + 1}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </GlassTile>
    </section>
  {/if}

</main>
{/if}

<style>
  :global(html) { scroll-behavior: smooth; }
</style>
