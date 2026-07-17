<script>
  import { onMount } from 'svelte';
  import Head from '$lib/components/head.svelte';
  import Carousel from '$lib/components/carousel.svelte';
  import GlassTile from '$lib/components/ui/GlassTile.svelte';
  import GlassButton from '$lib/components/ui/GlassButton.svelte';
  import BentoGrid from '$lib/components/ui/BentoGrid.svelte';
  import { revealTiles } from '$lib/motion';

  const quickFacts = [
    {
      label: 'Grades 7–12',
      icon: 'M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443'
    },
    {
      label: 'Build a real robot',
      icon: 'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.184 1.743-.04a3.375 3.375 0 0 0 4.396-4.396c-.163-.694-.526-1.362-1.043-1.879a1.5 1.5 0 0 0-2.121 0l-2.5 2.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 0 1 0-1.06l2.5-2.5a1.5 1.5 0 0 0 0-2.122 3.375 3.375 0 0 0-4.396 1.043 3.375 3.375 0 0 0-.04 1.743M8.25 16.5l.938-2.815a1.5 1.5 0 0 1 .858-.858l4.19-1.396'
    },
    {
      label: 'Compete statewide',
      icon: 'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5'
    }
  ];

  const experience = [
    {
      title: 'Design & build',
      copy: 'Engineer, wire, and program an Android-platform robot from the ground up.',
      icon: 'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.184 1.743-.04a3.375 3.375 0 0 0 4.396-4.396c-.163-.694-.526-1.362-1.043-1.879a1.5 1.5 0 0 0-2.121 0l-2.5 2.5a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 0 1 0-1.06l2.5-2.5a1.5 1.5 0 0 0 0-2.122 3.375 3.375 0 0 0-4.396 1.043 3.375 3.375 0 0 0-.04 1.743M8.25 16.5l.938-2.815a1.5 1.5 0 0 1 .858-.858l4.19-1.396'
    },
    {
      title: 'Compete head-to-head',
      copy: 'Battle in alliance-format matches against other Connecticut teams.',
      icon: 'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5'
    },
    {
      title: 'Gracious professionalism',
      copy: 'Compete fiercely while treating every participant with respect and kindness.',
      icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
    }
  ];

  const quickLinks = [
    {
      icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9 3.75h.008v.008H12v-.008Z',
      title: 'Tournaments & scrimmages',
      copy: 'See upcoming events, plus recaps and media from past qualifiers, regionals, and the state championship.',
      href: '/events',
      cta: 'Explore events'
    },
    {
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
      title: 'CT team list',
      copy: 'An open-source directory of every CT FTC team — match history, awards, and performance trends.',
      href: 'http://robolyst.org/stateprov/connecticut/ftc/teams',
      cta: 'Launch team directory'
    },
    {
      icon: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
      title: 'Volunteer "how to"',
      copy: 'The roles that support CT FTC events, from coaching to judging, and how to contribute your time.',
      href: '/volunteer',
      cta: 'See how to join'
    }
  ];

  onMount(() => {
    revealTiles('.bento-tile');
  });
</script>

<Head
  title="Home"
  description="Connecticut FIRST Tech Challenge - Inspiring the Next Generation of Innovators and Engineers. Explore our events, teams, and volunteer opportunities to get involved in the excitement of robotics competitions across the state."
/>

<main class="aurora-field min-h-screen font-sans overflow-x-hidden">

  <section class="min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-7rem)] flex items-center px-6 py-10">
    <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-6 items-stretch">

      <GlassTile strong class="bento-tile lg:col-span-7 flex flex-col justify-center gap-8" rounded="rounded-[2.5rem]" padding="p-10 md:p-14">
        <div class="space-y-6 text-left">
          <img src="https://wpafbstem.com/FTC/img/FTC_logo.png" alt="FIRST Tech Challenge logo" class="w-56 max-w-full object-contain" />

          <h1 class="text-4xl md:text-6xl font-bold text-ink-900 leading-[1.03] tracking-tight">
            Right here in <span class="text-robotics-blue">Connecticut</span>.
          </h1>

          <p class="text-ink-600 text-base md:text-lg leading-relaxed max-w-xl">
            Design, build, and program competition robots — then battle head-to-head against teams across the state.
          </p>

          <div class="flex flex-wrap gap-3">
            {#each quickFacts as fact}
              <span class="inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-white/60 text-xs font-semibold text-ink-900">
                <span class="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center shrink-0 text-robotics-blue">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d={fact.icon} />
                  </svg>
                </span>
                {fact.label}
              </span>
            {/each}
          </div>

          <div class="flex flex-wrap gap-4 pt-2">
            <GlassButton variant="primary" href="/events">View local events</GlassButton>
            <GlassButton variant="glass" href="/volunteer">Get involved &rarr;</GlassButton>
          </div>
        </div>
      </GlassTile>

      <GlassTile class="bento-tile lg:col-span-5 flex items-center justify-center" rounded="rounded-[2.5rem]" padding="p-4">
        <img src="map.png" alt="Map of Connecticut FTC teams" class="w-full h-full object-cover rounded-[2rem] aspect-square" />
      </GlassTile>
    </div>
  </section>

  <section class="px-6 py-10 max-w-7xl mx-auto">
    <div class="grid lg:grid-cols-12 gap-6 items-stretch">

      <GlassTile class="bento-tile lg:col-span-7 space-y-6 text-left" rounded="rounded-[2.5rem]" padding="p-8 md:p-12">
        <span class="text-xs font-semibold text-robotics-blue bg-white/60 px-3 py-1 rounded-full inline-block">More than robots</span>
        <h2 class="text-3xl font-bold text-ink-900 tracking-tight">The FIRST experience</h2>

        <ul class="space-y-5">
          {#each experience as item}
            <li class="flex items-start gap-4">
              <span class="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0 text-robotics-blue">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
                </svg>
              </span>
              <div>
                <h3 class="text-sm font-semibold text-ink-900">{item.title}</h3>
                <p class="text-ink-600 text-sm leading-relaxed mt-0.5">{item.copy}</p>
              </div>
            </li>
          {/each}
        </ul>
      </GlassTile>

      <GlassTile class="bento-tile lg:col-span-5 aspect-video flex items-center justify-center overflow-hidden" rounded="rounded-[2.5rem]" padding="p-4">
        <Carousel />
      </GlassTile>
    </div>
  </section>

  <section class="px-6 py-16 max-w-7xl mx-auto">
    <div class="text-left mb-6">
      <h2 class="text-2xl font-bold text-ink-900 tracking-tight">Get involved</h2>
      <p class="text-ink-600 text-sm mt-1">Three ways to jump in, wherever you're starting from.</p>
    </div>

    <BentoGrid minTile="280px">
      {#each quickLinks as link}
        <GlassTile class="bento-tile flex flex-col justify-between text-left" rounded="rounded-[2rem]" padding="p-8">
          <div>
            <div class="w-12 h-12 rounded-2xl glass-tile flex items-center justify-center mb-6 text-robotics-blue">
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d={link.icon} />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-ink-900 mb-3">{link.title}</h3>
            <p class="text-ink-600 text-sm leading-relaxed mb-6">{link.copy}</p>
          </div>
          <a href={link.href} class="inline-flex items-center gap-1.5 text-sm font-semibold text-robotics-blue hover:underline">
            {link.cta} <span>&rarr;</span>
          </a>
        </GlassTile>
      {/each}
    </BentoGrid>
  </section>
</main>
