<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // --- SVELTE 5 STATE RUNES ---
  let userLabel = $state("Operator");

  onMount(() => {
    if (!pb.authStore.isValid) {
      goto('/admin/login');
      return;
    }
    userLabel = pb.authStore.model?.email || "Admin Node";
  });

  function handleLogOut() {
    pb.authStore.clear();
    goto('/admin/login');
  }

  // Derived rune to cleanly style the current active route tab selection dynamically
  let activeRoute = $derived($page.url.pathname);
</script>

<aside class="w-full md:w-64 bg-white border-b-4 md:border-b-0 md:border-r-4 border-black p-6 flex flex-col justify-between md:min-h-screen shrink-0 z-30 relative">
  <div class="space-y-8">
    <div>
      <span class="inline-block px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider bg-slate-900 text-emerald-400 rounded">
        SYS_OVERRIDE_V5
      </span>
      <h2 class="text-xl font-black uppercase tracking-tighter mt-1 text-black">
        CT FTC Admin
      </h2>
    </div>

    <nav aria-label="Administrative System Links" class="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      <a 
        href="/admin" 
        class="px-4 py-2.5 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap text-left
        {activeRoute === '/admin' ? 'bg-[#facc15] text-black border-black box-shadow-mini translate-y-[-1px]' : 'bg-[#eef2f7] text-slate-600 border-slate-300 hover:border-black hover:text-black'}"
      >
        🎛️ Terminal Hub
      </a>
      
      <a 
        href="/admin/events" 
        class="px-4 py-2.5 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap text-left
        {activeRoute.startsWith('/admin/events') ? 'bg-[#facc15] text-black border-black box-shadow-mini translate-y-[-1px]' : 'bg-[#eef2f7] text-slate-600 border-slate-300 hover:border-black hover:text-black'}"
      >
        📅 Events Array
      </a>
    </nav>
  </div>

  <div class="mt-6 md:mt-auto pt-4 border-t-2 border-black/10 space-y-4 text-left">
    <div class="truncate">
      <span class="block text-[9px] font-mono font-black uppercase text-slate-400 tracking-widest">Active Identity</span>
      <span class="text-xs font-black text-black block truncate" title={userLabel}>{userLabel}</span>
    </div>

    <button 
      onclick={handleLogOut} 
      class="w-full px-4 py-2 text-xs font-black bg-rose-50 text-rose-700 border-2 border-rose-700 rounded-xl hover:bg-rose-600 hover:text-white transition-all text-center block box-shadow-rose-mini active:translate-y-[2px]"
    >
      Disconnect Session ⎋
    </button>
  </div>
</aside>

<style>
  .box-shadow-mini {
    box-shadow: 2px 2px 0px 0px #000000;
  }
  .box-shadow-rose-mini {
    box-shadow: 2px 2px 0px 0px #be123c;
  }
</style>