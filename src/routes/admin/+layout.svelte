<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import '../layout.css';

  let { children } = $props(); 

  // --- RUNES FOR GLOBAL REACTIVITY ---
  let currentUser = $derived(pb.authStore.model);
  let activeRoute = $derived($page.url.pathname);

  // Auto-calculating profile strings directly from the reactive authStore model
  let avatarUrl = $derived(currentUser && currentUser.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : "");
  let profileName = $derived(currentUser ? currentUser.name || "Operator" : "");

  // Local state loop for structural micro-interactions
  let showDropdown = $state(false);

  onMount(() => {
    if (!pb.authStore.isValid && activeRoute !== '/admin/login') {
      goto('/admin/login');
    }
  });

  function handleLogOut() {
    showDropdown = false;
    pb.authStore.clear();
    goto('/admin/login');
  }

  // Close drop menus if clicked outside
  function toggleDropdown(e) {
    e.stopPropagation();
    showDropdown = !showDropdown;
  }
</script>

<svelte:window onclick={() => showDropdown = false} />

{#if activeRoute === '/admin/login'}
  {@render children()}
{:else}
  <div class="h-screen w-screen bg-[#f4f7fa] text-[#1a1a1a] flex flex-col md:flex-row font-sans overflow-hidden antialiased">
    
    <aside class="hidden md:flex flex-col justify-between items-center h-screen w-20 hover:w-64 bg-white border-r border-slate-200 py-8 px-3 shrink-0 z-30 transition-all duration-[450ms] ease-in-out group/sidebar overflow-hidden">
      
      <div class="flex flex-col items-center justify-center relative w-full transition-all duration-[450ms] ease-in-out">
        <div class="mb-8 w-full px-4 flex items-center gap-4 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span class="text-sm font-black uppercase tracking-wider text-slate-800 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
           CT FTC
          </span>
        </div>

        <article class="border border-solid border-slate-200 w-full ease-in-out duration-500 rounded-2xl inline-block shadow-sm bg-white overflow-hidden">
          <a
            href="/admin"
            class="relative w-full h-16 ease-in-out duration-300 border-b border-slate-100 group flex flex-row items-center justify-start px-[18px] text-slate-500 hover:bg-slate-50 transition-colors gap-4
            {activeRoute === '/admin' ? 'bg-blue-50/60 text-blue-500 shadow-inner' : ''}"
          >
            <div class="shrink-0 w-6 h-6 flex items-center justify-center">
              <svg
                class="scale-110 group-hover:scale-125 transition-transform ease-in-out duration-300 {activeRoute === '/admin' ? 'text-blue-500 fill-blue-500 scale-125' : ''}"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
              </svg>
            </div>
            <span class="text-sm font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Home
            </span>
          </a>
          
          <a
            href="/admin/events"
            class="relative w-full h-16 ease-in-out duration-300 group flex flex-row items-center justify-start px-[18px] text-slate-500 hover:bg-slate-50 transition-colors gap-4
            {activeRoute.startsWith('/admin/events') ? 'bg-blue-50/60 text-blue-500 shadow-inner' : ''}"
          >
            <div class="shrink-0 w-6 h-6 flex items-center justify-center">
              <svg
                class="scale-110 group-hover:scale-125 transition-transform ease-in-out duration-300 {activeRoute.startsWith('/admin/events') ? 'text-blue-500 scale-125' : ''}"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span class="text-sm font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Events
            </span>
          </a>
        </article>
      </div>

    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      
      <header class="w-full h-20 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between shrink-0 z-20">
        
        <div class="text-left select-none">
          <span class="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-0.5">Amin Page</span>
          <h1 class="text-base font-black text-slate-800 tracking-tight">
            {activeRoute === '/admin' ? 'Home' : activeRoute.startsWith('/admin/events') ? 'Events' : 'Home'}
          </h1>
        </div>

        <div class="flex items-center gap-4 relative">
          
          <button class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all relative outline-none active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></span>
          </button>

          <div class="w-[1px] h-6 bg-slate-200 hidden sm:block"></div>

          <div class="relative">
            <button 
              onclick={toggleDropdown}
              class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all select-none outline-none text-left"
            >
              <div class="shrink-0">
                {#if avatarUrl}
                  <img src={avatarUrl} alt="Operator Profile Avatar" class="w-15 h-15 rounded-lg object-cover border border-slate-200 shadow-sm bg-white" />
                {:else}
                  <div class="w-9 h-9 rounded-lg border border-dashed border-slate-300 flex items-center justify-center bg-slate-100 text-sm">👤</div>
                {/if}
              </div>
              <div class="hidden sm:flex flex-col pr-1 max-w-[120px]">
                <span class="text-xs font-black text-slate-800 truncate leading-none mb-0.5">{profileName}</span>
                <span class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide leading-none">Administrator</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-400 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''}">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {#if showDropdown}
              <div class="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div class="px-4 py-2 border-b border-slate-100 sm:hidden">
                  <p class="text-xs font-black text-slate-800 truncate">{profileName}</p>
                  <p class="text-[9px] font-mono text-slate-400 uppercase tracking-wide">Administrator</p>
                </div>
                
                <button 
                  onclick={handleLogOut}
                  class="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-none outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Disconnect Session
                </button>
              </div>
            {/if}
          </div>

        </div>
      </header>

      <main class="flex-1 p-6 md:p-12 text-left overflow-y-auto pb-28 md:pb-12 bg-[#f4f7fa]">
        <div class="max-w-full mx-auto w-full">
          {@render children()}
        </div>
      </main>
    </div>

    <div class="md:hidden fixed left-1/2 bottom-[16px] -translate-x-1/2 w-[calc(100%-32px)] max-w-[520px] z-50 flex justify-center">
      <div class="menu">
        <a href="/" class={activeRoute === '/' ? 'active' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          <span>Terminal</span>
        </a>
        
        <a href="/admin/events" class={activeRoute.startsWith('/admin/events') ? 'active' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
          </svg>
          <span>Events</span>
        </a>

        <button onclick={handleLogOut} class="flex flex-col items-center flex-1 min-w-0 text-white/90 justify-center py-2.5 rounded-full bg-transparent border-none outline-none active:scale-95 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-rose-200">
            <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.72a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 1 1-1.061 1.061l-.707-.707a.75.75 0 0 1 0-1.06Zm10.608 0a.75.75 0 0 1 0 1.06l-.707.708a.75.75 0 1 1-1.061-1.061l.707-.707a.75.75 0 0 1 1.06 0ZM3.75 12a8.25 8.25 0 1 1 16.5 0 .75.75 0 0 1-1.5 0 6.75 6.75 0 1 0-13.5 0 .75.75 0 0 1-1.5 0Z" clip-rule="evenodd" />
          </svg>
          <span class="text-[0.75rem] font-bold mt-1 leading-none text-rose-200">Exit</span>
        </button>
      </div>
    </div>

  </div>
{/if}

<style>
  :root {
    --ease-spring: cubic-bezier(0.68, -0.6, 0.32, 1.6);
    --glass-border: rgba(255, 255, 255, 0.25);
  }

  :global(body) {
    background-color: #f4f7fa;
    margin: 0;
  }

  /* PHONE DOCK LAYOUT SYSTEM BLUR RULES */
  .menu {
    backdrop-filter: blur(20px) saturate(190%) contrast(120%);
    -webkit-backdrop-filter: blur(20px) saturate(190%) contrast(120%);
    background: rgba(37, 99, 235, 0.65); 
    border: 1px solid var(--glass-border);
    box-shadow: 0 12px 40px rgba(37, 99, 235, 0.25);
    padding: 6px;
    border-radius: 99rem;
    display: flex;
    justify-content: center;
    gap: 6px;
    width: 100%;
  }

  .menu::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow:
      inset 1px 1px 3px rgba(255, 255, 255, 0.4),
      inset -1px -1px 3px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: -1;
  }

  .menu a {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 0;
    min-width: 0;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    padding: 10px 6px;
    border-radius: 999rem;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.2s var(--ease-spring),
      color 0.2s var(--ease-spring),
      transform 0.15s ease;
  }

  .menu a:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  .menu a svg {
    width: 1.35rem;
    height: 1.35rem;
  }

  .menu a span {
    text-shadow: 0 1px 4px rgba(0,0,0,0.15);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    margin-top: 5px;
  }

  .menu a.active {
    background: rgba(255, 255, 255, 0.95);
    color: #2563eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .menu a:active {
    transform: scale(0.95);
  }
</style>