<script>
  import { page } from '$app/stores';
<<<<<<< HEAD
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { formatCountdown } from '$lib/format';
  import { revealOnce } from '$lib/motion';

  let { nextEvent = null } = $props();

=======
  import { fade, slide } from 'svelte/transition';
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
  let logo = '/ctftc.png';
  let isMobileMenuOpen = $state(false);

  const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'Teams', href: '/teams' },
    { name: 'Volunteer', href: '/volunteer' }, // Matched perfectly to your file route!
   
  ];

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMenu() {
    isMobileMenuOpen = false;
  }
<<<<<<< HEAD

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
      <span class="flex items-center justify-center w-20 h-20 rounded-full bg-white/70 shrink-0">
        <img src={logo} alt="CT FIRST Tech Challenge logo" class="w-[70%] h-[70%] object-contain invert" />
      </span>
      <img src={ftcLogo} alt="FIRST Tech Challenge logo" class="hidden sm:block h-10 md:h-12 object-contain" />
    </a>
=======
</script>

<div class="fixed top-4 left-0 right-0 z-[200] px-4 md:px-6 flex justify-center pointer-events-none">
  <nav class="w-full max-w-5xl pointer-events-auto bg-[#eef2f7]/90 backdrop-blur-xl border-3 border-black shadow-neumorphic-nav rounded-2xl md:rounded-full px-3 py-2.5 md:py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 relative box-shadow-flat transition-all">
    
    <div class="flex items-center justify-between w-full md:w-auto">
      <a href="/" onclick={closeMenu} class="flex items-center justify-center w-25 h-15 bg-white border-2 border-black rounded-xl md:rounded-full shadow-skeuo hover:translate-y-[1px] active:translate-y-[2px] transition-all shrink-0">
        <img src={logo} alt="CT Logo" class="w-full h-[90%] object-contain invert">
      </a>

      <button 
        onclick={toggleMenu}
        aria-label="Toggle Core Navigation Menu"
        class="md:hidden w-10 h-10 rounded-xl bg-white border-2 border-black flex flex-col items-center justify-center gap-1 shadow-skeuo active:translate-y-[3px] transition-all"
      >
        {#if isMobileMenuOpen}
          <span class="font-mono text-xs font-black text-black">X</span>
        {:else}
          <div class="w-5 h-0.5 bg-black rounded-full transition-transform"></div>
          <div class="w-5 h-0.5 bg-black rounded-full transition-transform"></div>
          <div class="w-5 h-0.5 bg-black rounded-full transition-transform"></div>
        {/if}
      </button>
    </div>
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)

    <div class="hidden md:flex items-center gap-1 bg-[#eef2f7] shadow-neumorphic-inner px-2 py-1 rounded-full border border-slate-200/50">
      {#each navLinks as link}
        <a 
          href={link.href} 
          class="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all
          {$page.url.pathname.startsWith(link.href) 
            ? 'bg-[#2563eb] text-white border-2 border-black box-shadow-mini translate-y-[-1px]' 
            : 'text-slate-700 hover:text-[#2563eb] border-2 border-transparent hover:bg-white/60'}"
        >
          {link.name}
        </a>
      {/each}
    </div>

    <a 
      href="/contact" 
      class="hidden md:inline-flex items-center justify-center bg-[#facc15] text-black border-2 border-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest box-shadow-mini hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
    >
      Contact
    </a>

<<<<<<< HEAD
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
=======
    {#if isMobileMenuOpen}
      <div 
        transition:slide={{ duration: 250 }} 
        class="w-full md:hidden flex flex-col gap-2 pt-2 pb-1 border-t-2 border-dashed border-black/10 mt-1"
      >
        {#each navLinks as link}
          <a 
            href={link.href} 
            onclick={closeMenu}
            class="w-full p-3 rounded-xl font-black text-sm uppercase tracking-wide border-2 transition-all flex items-center justify-between
            {$page.url.pathname.startsWith(link.href) 
              ? 'bg-[#2563eb] text-white border-black shadow-inner' 
              : 'bg-white text-slate-700 border-black box-shadow-mini active:translate-y-[2px]'}"
          >
            <span>{link.name}</span>
            <span class="opacity-30 font-mono text-[10px]">&lt;//01&gt;</span>
          </a>
        {/each}

        <a 
          href="https://atlas.robotics-catalyst.org/" 
          target="_blank"
          rel="noopener noreferrer"
          onclick={closeMenu}
          class="w-full p-3 bg-[#facc15] text-black border-2 border-black font-black text-sm uppercase tracking-widest text-center rounded-xl box-shadow-mini active:translate-y-[2px] transition-all block mt-2"
        >
          Launch Atlas Deck ↗
        </a>
      </div>
    {/if}

  </nav>
</div>

<div class="h-28 md:h-24"></div>

<style>
  /* Inverted Inner Channel Shadow */
  .shadow-neumorphic-inner {
    box-shadow: 
      inset 4px 4px 8px #cad4e2, 
      inset -4px -4px 8px #ffffff;
  }

  /* Soft Ambient Soft Outer Shadow Trim */
  .shadow-neumorphic-nav {
    box-shadow: 0px 12px 32px rgba(189, 199, 212, 0.5);
  }

  /* Tactile Mechanical Button Accents */
  .shadow-skeuo {
    box-shadow: 0px 3px 0px #000000;
  }

  /* Micro Flat Brutalist Blocking */
  .box-shadow-flat {
    box-shadow: 6px 6px 0px 0px #000000;
  }

  .box-shadow-mini {
    box-shadow: 3px 3px 0px 0px #000000;
  }
</style>
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
