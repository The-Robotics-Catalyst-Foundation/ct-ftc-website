<script>
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';

  let logo = '/ctftc.png';
  let ftcLogo = '/ftc-logo.png';
  let isMobileMenuOpen = $state(false);
  let scrollY = $state(0);
  let atTop = $derived(scrollY <= 4);
  // Measured from the real nav instead of a hardcoded height - the nav's
  // fixed positioning takes it out of flow, so this spacer reserves the
  // matching space below it. A static guess drifts out of sync any time
  // the nav's padding/size changes; this can't.
  let navWrapperHeight = $state(0);

  const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'Teams', href: '/teams' },
    { name: 'Volunteer', href: '/volunteer' }
  ];

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMenu() {
    isMobileMenuOpen = false;
  }

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<svelte:window bind:scrollY />

<div
  bind:clientHeight={navWrapperHeight}
  class="fixed left-0 right-0 z-[200] flex justify-center pointer-events-none transition-all duration-300 {atTop ? 'top-0 px-0' : 'top-4 px-4 md:px-6'}"
>
  <nav
    id="site-nav"
    class="pointer-events-auto bg-[#eef2f7]/90 backdrop-blur-xl border-3 border-black shadow-neumorphic-nav px-3 py-2.5 md:py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 relative box-shadow-flat transition-all duration-300 {atTop ? 'w-full rounded-none' : 'w-full max-w-5xl rounded-2xl md:rounded-full'}"
  >
    <div class="flex items-center justify-between w-full md:w-auto">
      <a
        href="/"
        onclick={closeMenu}
        class="flex items-center gap-3 shrink-0 transition-transform hover:-translate-y-0.5"
      >
        <span class="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-black shadow-skeuo shrink-0">
          <img src={logo} alt="CT FIRST Tech Challenge logo" width="400" height="272" fetchpriority="high" class="w-[70%] h-[70%] object-contain invert" />
        </span>
        <img src={ftcLogo} alt="FIRST Tech Challenge logo" width="744" height="188" class="hidden sm:block h-10 w-auto md:h-8 object-contain" />
      </a>

      <button
        onclick={toggleMenu}
        aria-label="Toggle Core Navigation Menu"
        aria-expanded={isMobileMenuOpen}
        class="md:hidden w-11 h-11 rounded-xl bg-white border-2 border-black flex flex-col items-center justify-center gap-1 shadow-skeuo active:translate-y-[2px] transition-all"
      >
        {#if isMobileMenuOpen}
          <span class="font-mono text-xs font-black text-black">&times;</span>
        {:else}
          <div class="w-5 h-0.5 bg-black rounded-full"></div>
          <div class="w-5 h-0.5 bg-black rounded-full"></div>
          <div class="w-5 h-0.5 bg-black rounded-full"></div>
        {/if}
      </button>
    </div>

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
      target="_blank"
      rel="noopener noreferrer"
      class="hidden md:inline-flex items-center justify-center bg-[#facc15] text-black border-2 border-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest box-shadow-mini hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
    >
        Contact
    </a>
  </nav>
</div>

{#if isMobileMenuOpen}
  <div
    transition:slide={{ duration: 250 }}
    class="fixed inset-0 z-[190] md:hidden bg-[#eef2f7] flex flex-col items-stretch justify-center gap-3 px-6 pt-24 pb-10"
  >
    {#each navLinks as link}
      <a
        href={link.href}
        onclick={closeMenu}
        class="w-full p-5 rounded-2xl font-black text-xl uppercase tracking-wide border-2 transition-all flex items-center justify-between
        {$page.url.pathname.startsWith(link.href)
          ? 'bg-[#2563eb] text-white border-black shadow-inner'
          : 'bg-white text-slate-700 border-black box-shadow-mini active:translate-y-[2px]'}"
      >
        <span>{link.name}</span>
        <span class="opacity-30 font-mono text-xs">&lt;//01&gt;</span>
      </a>
    {/each}

    <a
      href="/contact"
      target="_blank"
      rel="noopener noreferrer"
      onclick={closeMenu}
      class="w-full p-5 bg-[#facc15] text-black border-2 border-black font-black text-xl uppercase tracking-widest text-center rounded-2xl box-shadow-mini active:translate-y-[2px] transition-all block mt-2"
    >
      Contact
    </a>
  </div>
{/if}

<div style="height: {navWrapperHeight}px"></div>

<style>
  /* Inverted Inner Channel Shadow */
  .shadow-neumorphic-inner {
    box-shadow:
      inset 4px 4px 8px #cad4e2,
      inset -4px -4px 8px #ffffff;
  }

  /* Soft Ambient Outer Shadow Trim */
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

  /* One-time reveal on load: fade + slide down from -14px */
  #site-nav {
    animation: nav-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes nav-reveal {
    from {
      opacity: 0;
      transform: translateY(-14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #site-nav {
      animation: none;
    }
  }
</style>
