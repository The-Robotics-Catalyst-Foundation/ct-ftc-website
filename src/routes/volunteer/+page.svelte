<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import Head from '$lib/components/head.svelte';
  import GlassTile from '$lib/components/ui/GlassTile.svelte';
  import GlassButton from '$lib/components/ui/GlassButton.svelte';
  import BentoGrid from '$lib/components/ui/BentoGrid.svelte';
  import { revealTiles } from '$lib/motion';

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

  const registrationSteps = [
    { title: 'Create an account', copy: 'Go to firstinspires.org and create an account (for new volunteers) or login to your existing account.' },
    { title: 'Find your role', copy: 'Once you are on the FIRST Dashboard, click on "My Roles" and then "Event Volunteer".' },
    { title: 'Find a CT event', copy: 'Click "Register to Volunteer" then search for a FIRST Tech Challenge event in Connecticut.' },
    { title: 'Complete registration', copy: 'Follow the steps to complete your volunteer registration.' }
  ];

  /** @param {string} key */
  function toggleRoleCategory(key) {
    activeRoleCategory = activeRoleCategory === key ? null : key;
  }

  onMount(() => {
    revealTiles('.bento-tile');
  });
</script>

<svelte:head>
  <title>Volunteer Registration | Connecticut FTC</title>
</svelte:head>

<Head
  title="Volunteer Opportunities"
  description="Join our team of dedicated volunteers making a difference in the lives of young robotics enthusiasts across Connecticut."
/>

<main class="aurora-field min-h-screen pb-24">

  <section class="max-w-4xl mx-auto px-6 pt-24 pb-10 text-center">
    <GlassTile strong class="bento-tile space-y-6" rounded="rounded-[2.5rem]" padding="p-10 md:p-14">
      <span class="inline-flex items-center gap-2 text-xs font-semibold text-robotics-blue bg-white/60 px-4 py-2 rounded-full">
        Volunteer in Connecticut
      </span>

      <h1 class="text-4xl md:text-6xl font-bold text-ink-900 leading-[1.03] tracking-tight">
        How to volunteer <br />
        <span class="text-robotics-blue">at CT robotics competitions</span>
      </h1>

      <p class="text-ink-600 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
        Our tournaments are completely volunteer-driven. Whether you are an experienced engineer, a parent, or a student, we have a vital role for you. <span class="text-robotics-blue font-medium">No technical experience required.</span>
      </p>
    </GlassTile>
  </section>

  <section class="max-w-6xl mx-auto px-6 py-10">
    <GlassTile class="bento-tile" rounded="rounded-[2.5rem]" padding="p-8 md:p-14">

      <div class="mb-10 text-center md:text-left">
        <span class="text-xs font-semibold text-robotics-blue bg-white/60 px-3 py-1 rounded-full inline-block">Registration process</span>
        <h2 class="text-2xl font-bold text-ink-900 tracking-tight mt-3">How to register as a volunteer</h2>
      </div>

      <BentoGrid minTile="220px" class="mb-10">
        {#each registrationSteps as step, i}
          <div class="glass-tile !p-6 rounded-2xl flex flex-col justify-between relative">
            <div class="absolute -top-4 left-6 w-9 h-9 rounded-full bg-robotics-blue text-white flex items-center justify-center text-sm font-semibold shadow-ambient">{i + 1}</div>
            <div class="pt-4 space-y-2 text-left">
              <h3 class="text-base font-semibold text-ink-900">{step.title}</h3>
              <p class="text-ink-600 text-xs leading-relaxed">{step.copy}</p>
            </div>
          </div>
        {/each}
      </BentoGrid>

      <div class="text-center pt-2 space-y-4">
        <GlassButton variant="primary" href="https://www.firstinspires.org">
          Go to FIRST Dashboard <span class="text-base">&#8599;</span>
        </GlassButton>
        <p class="text-xs text-ink-400">
          Questions? Email <a href="mailto:youssefmmacary@gmail.com" class="text-robotics-blue font-medium hover:underline">youssefmmacary@gmail.com</a>
        </p>
      </div>

    </GlassTile>
  </section>

  <section class="max-w-4xl mx-auto px-6 py-10">
    <div class="text-left mb-6">
      <span class="text-xs font-semibold text-robotics-blue bg-white/60 px-3 py-1 rounded-full inline-block">Volunteer roles</span>
      <h2 class="text-2xl font-bold text-ink-900 tracking-tight mt-3">Find your perfect role</h2>
      <p class="text-xs text-ink-400 mt-1">Tap a category to see the specific roles. Free online training is provided for all roles prior to the event.</p>
    </div>

    <div class="space-y-4">
      {#each roleCategories as role (role.key)}
        <GlassTile class="bento-tile !p-0 overflow-hidden" rounded="rounded-[1.75rem]">
          <button
            onclick={() => toggleRoleCategory(role.key)}
            aria-expanded={activeRoleCategory === role.key}
            class="w-full text-left p-4 flex items-center gap-4 transition-colors {activeRoleCategory === role.key ? 'bg-white/40' : 'hover:bg-white/30'}"
          >
            <div class="w-10 h-10 shrink-0 rounded-xl bg-white/60 flex items-center justify-center text-xl">{role.icon}</div>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-semibold text-ink-900">{role.title}</span>
              <span class="block text-xs text-ink-400 truncate">{role.subtitle}</span>
            </div>
            <span class="shrink-0 text-ink-400 text-lg transition-transform duration-300 {activeRoleCategory === role.key ? 'rotate-180' : ''}">&#8964;</span>
          </button>

          {#if activeRoleCategory === role.key}
            <div transition:slide={{ duration: 250 }}>
              <div class="px-4 pb-5 pt-1 border-t border-white/60 space-y-3">
                <span class="inline-block text-xs font-semibold text-robotics-blue bg-white/60 px-2.5 py-1 rounded-full">{role.tag}</span>
                <p class="text-sm text-ink-600 leading-relaxed">{role.description}</p>
                <div class="flex flex-wrap gap-2 pt-1">
                  {#each role.roles as specificRole}
                    <span class="text-xs font-medium text-ink-900 bg-white/60 px-2.5 py-1 rounded-full">{specificRole}</span>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </GlassTile>
      {/each}
    </div>
  </section>
</main>
