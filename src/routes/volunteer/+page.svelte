<script>
  import { onMount } from 'svelte';
  import { slide, fly } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import { Wrench, Scale, ClipboardList, Coffee, Mail, Calendar, MapPin, ChevronLeft, ChevronRight } from '@lucide/svelte';

  let { data, form: newsletterForm } = $props();

  // State Management
  let isLoaded = $state(false);
  let scrollY = $state(0);
  let newsletterBusy = $state(false);
  /** @type {string | null} */
  let activeRoleCategory = $state('tech');

  /** @type {HTMLDivElement | undefined} */
  let carouselEl = $state();

  /** @param {string} value */
  function formatEventDate(value) {
    if (!value) return 'Date TBD';
    return new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  /** @param {1 | -1} direction */
  function scrollCarousel(direction) {
    if (!carouselEl) return;
    carouselEl.scrollBy({ left: direction * (carouselEl.clientWidth * 0.85), behavior: 'smooth' });
  }

  const roleCategories = [
    {
      key: 'tech',
      icon: Wrench,
      title: 'Technical Roles',
      subtitle: 'Referees, FTAs, Robot Inspectors...',
      tag: 'Field Operations',
      description: 'Ideal for mentors, alumni, or engineers who want to manage match rule enforcement, electronics, and field setup directly.',
      roles: ['Referee', 'Field Technical Advisor (FTA)', 'Robot Inspector']
    },
    {
      key: 'judges',
      icon: Scale,
      title: 'Judges & Award Staff',
      subtitle: 'Panel Judges, Judge Match Observers...',
      tag: 'Evaluation Team',
      description: 'Interview student teams, review their engineering documentation, and collaborate with other judges to determine award winners. Great for professionals of all backgrounds.',
      roles: ['Panel Judge', 'Judge Advisor', 'Judge Match Observer']
    },
    {
      key: 'logistics',
      icon: ClipboardList,
      title: 'Event Logistics',
      subtitle: 'Queuers, Scorekeepers, Emcees...',
      tag: 'Event Flow',
      description: 'Help keep the tournament running on schedule, coordinate team queuing movement, or energize the audience on the microphone.',
      roles: ['Queuer', 'Scorekeeper', 'Emcee']
    },
    {
      key: 'support',
      icon: Coffee,
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

  let showFloatingCta = $derived(isLoaded && scrollY > 500);

  onMount(() => {
    setTimeout(() => isLoaded = true, 100);
  });
</script>

<svelte:window bind:scrollY />

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

      {#if data.events.length > 0}
        <div class="pt-4 pb-8">
          <h3 class="text-center md:text-left text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Upcoming Events Needing Volunteers</h3>
          <div class="relative">
            <div bind:this={carouselEl} class="volunteer-carousel">
              {#each data.events as event (event.id)}
                <div class="volunteer-event-card">
                  <h4 class="text-lg font-black text-black uppercase leading-tight">{event.name}</h4>
                  <div class="mt-3 space-y-1.5 text-xs font-bold text-slate-600">
                    <div class="flex items-center gap-2">
                      <Calendar class="w-3.5 h-3.5 shrink-0 text-slate-400" strokeWidth={2.5} />
                      <span>{formatEventDate(event.date_time)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <MapPin class="w-3.5 h-3.5 shrink-0 text-slate-400" strokeWidth={2.5} />
                      <span class="truncate">{event.location}</span>
                    </div>
                  </div>
                  <a
                    href={event.volunteerLink || '/volunteer'}
                    target={event.volunteerLink ? '_blank' : undefined}
                    rel={event.volunteerLink ? 'noopener noreferrer' : undefined}
                    class="skeuo-button bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] inline-flex items-center justify-center gap-2 transition-all mt-4 w-full"
                  >
                    Register Now
                  </a>
                </div>
              {/each}
            </div>

            {#if data.events.length > 1}
              <button type="button" onclick={() => scrollCarousel(-1)} aria-label="Previous events" class="volunteer-carousel-arrow left-0 -translate-x-1/2">
                <ChevronLeft class="w-4 h-4" strokeWidth={3} />
              </button>
              <button type="button" onclick={() => scrollCarousel(1)} aria-label="Next events" class="volunteer-carousel-arrow right-0 translate-x-1/2">
                <ChevronRight class="w-4 h-4" strokeWidth={3} />
              </button>
            {/if}
          </div>
        </div>
      {/if}

      <div class="text-center pt-4 space-y-4">
        <p class="text-xs font-semibold text-slate-500">
          Questions? Email <a href="mailto:youseffmmacary@gmail.com" class="text-[#2563eb] font-black hover:underline">youseffmmacary@gmail.com</a>
        </p>
      </div>

    </div>
  </section>

  <section id="newsletter" class="max-w-4xl mx-auto px-6 pb-16 relative z-20 scroll-mt-28">
    <div class="bg-black text-white rounded-[2.5rem] p-8 md:p-12 box-shadow-flat border-3 border-black text-center space-y-5">
      <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tight">
        Sign up for updates and notifications on volunteer opportunities in CT
      </h2>
      <p class="text-sm font-bold text-slate-300 max-w-lg mx-auto">
        Get an email when a new event needs volunteers &mdash; no spam, just the opportunities.
      </p>

      {#if newsletterForm?.success}
        <p class="inline-flex items-center gap-2 bg-emerald-400 text-black font-black uppercase text-sm px-5 py-3 rounded-xl border-2 border-black">
          Thank you for subscribing!
        </p>
      {:else}
        <form
          method="POST"
          action="?/subscribe"
          use:enhance={() => {
            newsletterBusy = true;
            return async ({ update }) => {
              await update();
              newsletterBusy = false;
            };
          }}
          class="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            autocomplete="email"
            required
            placeholder="you@email.com"
            disabled={newsletterBusy}
            class="w-full flex-1 bg-white text-black border-2 border-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#facc15] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={newsletterBusy}
            class="w-full sm:w-auto shrink-0 skeuo-button bg-[#facc15] text-black text-sm font-black uppercase tracking-wider px-6 py-3 rounded-xl border-2 border-black box-shadow-flat hover:translate-y-[1px] active:translate-y-[4px] transition-all disabled:opacity-60"
          >
            {newsletterBusy ? 'Subscribing…' : 'Get Updates'}
          </button>
        </form>

        {#if newsletterForm?.error}
          <p class="text-rose-400 text-xs font-bold">{newsletterForm.error}</p>
        {/if}
      {/if}
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
            <div class="w-10 h-10 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
              <role.icon class="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
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

  <section class="max-w-4xl mx-auto px-6 py-8 relative z-20 text-center md:text-left">
    <p class="text-sm font-bold text-slate-500">
      Have more questions? See our <a href="/faq" class="text-[#2563eb] font-black hover:underline">full FAQ</a>.
    </p>
  </section>

  {#if showFloatingCta}
    <a
      href="#newsletter"
      transition:fly={{ y: 20, duration: 200 }}
      class="fixed bottom-6 right-6 z-[150] skeuo-button bg-[#facc15] text-black text-xs md:text-sm font-black uppercase tracking-wider pl-4 pr-5 py-4 rounded-2xl border-2 border-black box-shadow-flat hover:translate-y-[1px] active:translate-y-[4px] transition-all flex items-center gap-2"
    >
      <Mail class="w-4 h-4" strokeWidth={2.5} />
      Get Updates
    </a>
  {/if}
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

  .volunteer-carousel {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 1px;
    padding: 0.25rem 0.25rem 0.75rem;
    scrollbar-width: none;
  }

  .volunteer-carousel::-webkit-scrollbar {
    display: none;
  }

  .volunteer-event-card {
    flex: 0 0 260px;
    scroll-snap-align: start;
    background: #fff;
    border: 3px solid #000;
    border-radius: 1rem;
    box-shadow: 5px 5px 0px 0px #000;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
  }

  .volunteer-carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background: #fff;
    border: 2px solid #000;
    box-shadow: 3px 3px 0px 0px #000;
    color: #000;
    transition: transform 0.15s ease;
  }

  .volunteer-carousel-arrow:hover {
    transform: translateY(-50%) scale(1.05);
  }

  .volunteer-carousel-arrow:active {
    transform: translateY(-50%) translate(2px, 2px);
    box-shadow: none;
  }

  .volunteer-carousel-arrow.left-0 {
    transform: translateY(-50%) translateX(-50%);
  }

  .volunteer-carousel-arrow.right-0 {
    transform: translateY(-50%) translateX(50%);
  }
</style>
