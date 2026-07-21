<script>
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { formatCountdown } from '$lib/format';
  import { revealOnce } from '$lib/motion';

  let { nextEvent = null } = $props();

  let logo = '/ctftc.png';
  let ftcLogo = 'https://wpafbstem.com/FTC/img/FTC_logo.png';
  let isMobileMenuOpen = $state(false);

  const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'Teams', href: '/teams' },
    { name: 'Volunteer', href: '/volunteer' }
  ];

  const countdown = $derived(nextEvent ? formatCountdown(nextEvent.startDate) : null);

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMenu() {
    isMobileMenuOpen = false;
  }

  onMount(() => {
    revealOnce('#site-nav', { distance: -14 });
  });

  $effect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  });
</script>

<div class="fixed top-4 left-0 right-0 z-[200] px-4 md:px-6 flex justify-center pointer-events-none">
  <nav
    id="site-nav"
    class="glass-tile glass-tile-strong w-full max-w-5xl pointer-events-auto rounded-3xl md:rounded-full p-2.5 flex items-center gap-3 relative"
  >
    <a
      href="/"
      onclick={closeMenu}
      class="flex items-center gap-3 shrink-0 transition-transform hover:-translate-y-0.5"
    >
      <span class="flex items-center justify-center w-20 h-20 rounded-full glass-tile shrink-0">
        <img src={logo} alt="CT FIRST Tech Challenge logo" class="w-[70%] h-[70%] object-contain invert" />
      </span>
      <img src={ftcLogo} alt="FIRST Tech Challenge logo" class="hidden sm:block h-10 md:h-12 object-contain" />
    </a>

    <div class="hidden md:flex items-center gap-1 flex-1 justify-center">
      {#each navLinks as link}
        <a
          href={link.href}
          class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out
          {$page.url.pathname.startsWith(link.href)
            ? 'bg-robotics-blue text-white shadow-ambient'
            : 'text-ink-600 hover:bg-white/50 hover:text-ink-900'}"
        >
          {link.name}
        </a>
      {/each}
    </div>

    {#if nextEvent && countdown}
      <a
        href="/events"
        class="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full glass-tile text-xs font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-aurora-gold shrink-0"></span>
        <span class="text-ink-900 truncate max-w-[9rem]">{nextEvent.name}</span>
        <span class="text-ink-400">&middot; {countdown}</span>
      </a>
    {/if}

    <a
      href="/contact"
      class="hidden md:inline-flex items-center justify-center glass-tile rounded-full px-5 py-2.5 text-sm font-semibold text-ink-900 transition-transform hover:-translate-y-0.5"
    >
      Contact
    </a>

    <button
      onclick={toggleMenu}
      aria-label="Toggle navigation menu"
      aria-expanded={isMobileMenuOpen}
      class="md:hidden ml-auto w-11 h-11 rounded-full glass-tile flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 shrink-0"
    >
      <div class="w-4 h-0.5 rounded-full bg-ink-900"></div>
      <div class="w-4 h-0.5 rounded-full bg-ink-900"></div>
      <div class="w-4 h-0.5 rounded-full bg-ink-900"></div>
    </button>
  </nav>
</div>

{#if isMobileMenuOpen}
  <div class="fixed inset-0 z-[250] md:hidden">
    <button
      aria-label="Close navigation menu"
      onclick={closeMenu}
      transition:fade={{ duration: 200 }}
      class="absolute inset-0 w-full bg-ink-900/40 backdrop-blur-sm cursor-default"
    ></button>

    <div
      transition:fly={{ x: 320, duration: 300, opacity: 1 }}
      class="glass-tile glass-tile-strong absolute top-0 right-0 h-full w-[82%] max-w-xs rounded-l-[2rem] p-5 pt-6 flex flex-col gap-2 overflow-y-auto"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold tracking-wide text-ink-400">Menu</span>
        <button
          onclick={closeMenu}
          aria-label="Close navigation menu"
          class="w-9 h-9 rounded-full glass-tile flex items-center justify-center text-ink-900"
        >
          <span class="text-base font-semibold">&times;</span>
        </button>
      </div>

      {#if nextEvent && countdown}
        <a
          href="/events"
          onclick={closeMenu}
          class="w-full p-3 rounded-2xl glass-tile flex items-center gap-2 text-xs font-semibold text-ink-600"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-aurora-gold shrink-0"></span>
          <span class="text-ink-900">{nextEvent.name}</span>
          <span class="text-ink-400">&middot; {countdown}</span>
        </a>
      {/if}

      {#each navLinks as link}
        <a
          href={link.href}
          onclick={closeMenu}
          class="w-full p-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-between
          {$page.url.pathname.startsWith(link.href)
            ? 'bg-robotics-blue text-white shadow-ambient'
            : 'glass-tile text-ink-900'}"
        >
          <span>{link.name}</span>
        </a>
      {/each}

      <a
        href="/contact"
        onclick={closeMenu}
        class="w-full p-3 rounded-2xl glass-tile font-semibold text-sm text-center text-ink-900"
      >
        Contact
      </a>

      <a
        href="https://atlas.robotics-catalyst.org/"
        target="_blank"
        rel="noopener noreferrer"
        onclick={closeMenu}
        class="w-full p-3 mt-auto bg-robotics-blue text-white font-semibold text-sm text-center rounded-2xl shadow-ambient block"
      >
        Launch Atlas Deck &nearr;
      </a>
    </div>
  </div>
{/if}

<div class="h-32 md:h-28"></div>
