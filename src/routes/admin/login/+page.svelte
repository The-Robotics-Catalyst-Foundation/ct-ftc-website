<script>
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import { fly } from 'svelte/transition';

  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let errorMessage = $state("");

  async function handleAdminLogin(e) {
    e.preventDefault();
    loading = true;
    errorMessage = "";

    try {
      // Authenticate admin account via PocketBase standard user engine
      await pb.collection('users').authWithPassword(email, password);
      
      // Safety Check: Verify authorization profile clearance fields if you have an isAdmin boolean flag
      // if (!pb.authStore.model?.isAdmin) { throw new Error("Clearance level unauthorized."); }

      if (pb.authStore.isValid) {
        goto('/admin');
      }
    } catch (err) {
      errorMessage = err.message || "COORDINATES REJECTED. ENTRY ACCESS DENIED.";
      pb.authStore.clear();
    } finally {
      loading = false;
    }
  }
</script>

<main class="min-h-screen bg-[#eef2f7] text-[#1a1a1a] flex flex-col justify-center items-center p-6 relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  <div class="w-full max-w-md bg-[#eef2f7] rounded-[3.5rem] p-4 border-2 border-white/60 shadow-neumorphic-outer">
    <div class="w-full h-full rounded-[2.8rem] bg-[#eef2f7] shadow-neumorphic-inner p-8 border border-slate-200/60 text-center">
      
      <div class="mb-6 space-y-2">
        <span class="inline-block px-3 py-1 text-[10px] font-mono font-black bg-cyan-500 text-white border-2 border-black box-shadow-mini">
          Admin Login Page
        </span>
        <h1 class="text-2xl font-black uppercase tracking-tight">CTFTC Admin</h1>
      </div>

      <form onsubmit={handleAdminLogin} class="space-y-4">
        <div class="space-y-1 text-left">
          <label for="email" class="text-[10px] font-black uppercase text-slate-500 tracking-wider">Email</label>
          <input type="email" id="email" bind:value={email} required class="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-sm font-bold shadow-inner outline-none" />
        </div>

        <div class="space-y-1 text-left">
          <label for="password" class="text-[10px] font-black uppercase text-slate-500 tracking-wider">Password</label>
          <input type="password" id="password" bind:value={password} required class="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-sm font-bold shadow-inner outline-none" />
        </div>

        {#if errorMessage}
          <div in:fly={{ y: -5 }} class="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-700 text-xs font-mono font-bold text-left">
            🚨 {errorMessage}
          </div>
        {/if}

        <button type="submit" disabled={loading} class="w-full bg-cyan-600 text-white font-black uppercase tracking-widest py-3 rounded-xl border-2 border-cyan-700 shadow-skeuo-rose hover:translate-y-[1px] active:translate-y-[3px] transition-all text-xs mt-2">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

    </div>
  </div>
</main>

<style>
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px);
  }
  .shadow-neumorphic-outer { box-shadow: 14px 14px 35px #bdc7d4, -14px -14px 35px #ffffff; }
  .shadow-neumorphic-inner { box-shadow: inset 6px 6px 14px #cad4e2, inset -6px -6px 14px #ffffff; }
  .box-shadow-mini { box-shadow: 3px 3px 0px 0px #000000; }
  .shadow-skeuo-rose { box-shadow: 0px 4px 0px #1c85b9, 4px 6px 12px rgba(0, 0, 0, 0.1); }
</style>