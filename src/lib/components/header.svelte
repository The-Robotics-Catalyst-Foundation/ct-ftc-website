<script>
  import { page } from '$app/stores';
  import { fade, slide } from 'svelte/transition';
  let logo = "https://lh3.googleusercontent.com/sitesv/AA5AbUDcft2fe3r0v2rj-KjAjbrS_Cz5klXAvM62IfSlSrFezmc6BfIjx4gTVn_oZlYs3ghwErgOvzXYQebgDYF6wU8dCZMiBWyPw0Sa598HfR6VRzVtH8xTNyzAI_Enm4csGxwzws8yWdUnqQOQ-c_nbLF5v6KriQR4vSgWQZlQo9F-j1WJOQvmotaK2uk=w16383";
  // Svelte 5 State Rune for Mobile Control Deck Toggle
  let isMobileMenuOpen = $state(false);

  const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'Teams', href: '/teams' },
    { name: 'Volunteers', href: '/volunteer' }, // Matched perfectly to your file route!
    { name: 'Contact', href: '/contact' }
  ];

  function toggleMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMenu() {
    isMobileMenuOpen = false;
  }
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
      href="https://atlas.robotics-catalyst.org/" 
      target="_blank"
      rel="noopener noreferrer"
      class="hidden md:inline-flex items-center justify-center bg-[#facc15] text-black border-2 border-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest box-shadow-mini hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
    >
      Atlas ↗
    </a>

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