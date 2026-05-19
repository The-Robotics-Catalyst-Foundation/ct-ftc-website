<script>
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

  // --- SVELTE 5 STATE RUNES ---
  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");
  let mousePos = $state({ x: 0, y: 0 });

  function handleMouseMove(e) {
    mousePos = {
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10
    };
  }

  async function handleLogin(e) {
    e.preventDefault();
    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      // Authenticate directly against pocketbase users collection
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      if (pb.authStore.isValid) {
        successMessage = "ACCESS GRANTED // INITIALIZING TERMINAL REDIRECT";
        // Brief timeout loop to let the user feel the tactical success confirmation message
        setTimeout(() => {
          goto('/events'); 
        }, 1200);
      }
    } catch (err) {
      console.error("Authentication node malfunction:", err);
      errorMessage = err.message || "INVALID CALL-SIGN OR PASS-KEY MATRIX.";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:window onmousemove={handleMouseMove} />

<svelte:head>
  <title>Terminal Access Gateway | CT FTC</title>
</svelte:head>

<main class="min-h-screen bg-[#eef2f7] text-[#1a1a1a] flex flex-col justify-center items-center p-6 relative overflow-hidden perspective-1000">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none z-0"></div>

  <div class="absolute top-6 left-6 z-20">
    <a href="/" class="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl box-shadow-mini text-xs font-black uppercase tracking-wider text-slate-600 hover:text-[#2563eb] transition-colors">
      &larr; Abort Uplink
    </a>
  </div>

  <div class="relative w-full max-w-md bg-[#eef2f7] rounded-[3.5rem] p-4 border-2 border-white/60 shadow-neumorphic-outer z-10 transition-transform duration-200 ease-out"
       style="transform: rotateY({mousePos.x}deg) rotateX({-mousePos.y}deg)">
    
    <div class="w-full h-full rounded-[2.8rem] bg-[#eef2f7] shadow-neumorphic-inner p-8 md:p-10 relative overflow-hidden border border-slate-200/60 text-center">
      
      <div class="mb-8 space-y-3">
        <span class="inline-block px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black box-shadow-mini transform -rotate-1">
          SECURE PROTOCOL LAYER 02
        </span>
        <h1 class="text-3xl font-black text-black uppercase tracking-tighter leading-none pt-1">
          Terminal Gateway
        </h1>
        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
          Supply engineering crew verification coordinates
        </p>
      </div>

      <form onsubmit={handleLogin} class="space-y-5">
        
        <div class="space-y-1.5 text-left">
          <label for="email" class="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">
            Registered Email Address
          </label>
          <div class="relative">
            <input 
              type="email" 
              id="email" 
              bind:value={email} 
              required 
              disabled={loading}
              placeholder="operator@domain.com" 
              class="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-3 text-sm font-bold shadow-inner outline-none focus:border-[#2563eb] transition-colors disabled:opacity-50" 
            />
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs opacity-40 select-none">✉️</span>
          </div>
        </div>

        <div class="space-y-1.5 text-left">
          <label for="password" class="text-[10px] font-black uppercase tracking-widest text-slate-500 block pl-1">
            Secure Entry Pass-Key
          </label>
          <div class="relative">
            <input 
              type="password" 
              id="password" 
              bind:value={password} 
              required 
              disabled={loading}
              placeholder="••••••••••••" 
              class="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-3 text-sm font-bold shadow-inner outline-none focus:border-[#2563eb] transition-colors disabled:opacity-50" 
            />
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs opacity-40 select-none">🔑</span>
          </div>
        </div>

        {#if errorMessage}
          <div in:fly={{ y: -10, duration: 300 }} class="p-3.5 bg-rose-50 border-2 border-rose-500 rounded-xl text-rose-700 text-xs font-bold font-mono text-left shadow-inner flex items-start gap-2.5">
            <span class="text-sm select-none">⚠️</span>
            <div>
              <span class="block font-black uppercase tracking-wider text-[10px] text-rose-600 mb-0.5">Uplink Denied</span>
              {errorMessage}
            </div>
          </div>
        {/if}

        {#if successMessage}
          <div in:fly={{ y: 10, duration: 300 }} class="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-700 text-xs font-bold font-mono text-left shadow-inner flex items-start gap-2.5">
            <span class="text-sm select-none animate-pulse">⚡</span>
            <div>
              <span class="block font-black uppercase tracking-wider text-[10px] text-emerald-600 mb-0.5">Handshake Established</span>
              {successMessage}
            </div>
          </div>
        {/if}

        <button 
          type="submit" 
          disabled={loading}
          class="skeuo-button w-full bg-[#2563eb] text-white font-black uppercase tracking-widest py-3.5 rounded-xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all text-xs disabled:opacity-50 disabled:pointer-events-none mt-2"
        >
          {#if loading}
            <span class="inline-block animate-spin mr-2">⚙️</span> Syncing Data Arrays...
          {:else}
            Authenticate Payload &rarr;
          {/if}
        </button>

      </form>

      <div class="mt-8 pt-5 border-t border-slate-300/60 flex items-center justify-between text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
        <span>Node: SEC_GATE_CT</span>
        <span class="text-[#2563eb]/60">v5.0-runes</span>
      </div>

    </div>
  </div>
</main>

<style>
  /* Engineering Wireframe Underlay Grid Styling rules */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .perspective-1000 { perspective: 1200px; }

  /* Smooth Outer Raised Convex Neomorphic Shadow Outlines */
  .shadow-neumorphic-outer {
    box-shadow: 
      14px 14px 35px #bdc7d4, 
      -14px -14px 35px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  /* Deep Recessed Well Trays Concave Drops */
  .shadow-neumorphic-inner {
    box-shadow: 
      inset 6px 6px 14px #cad4e2, 
      inset -6px -6px 14px #ffffff;
  }

  /* Heavy Brutalist 3D Mechanical Button Physics */
  .shadow-skeuo {
    box-shadow: 
      0px 4px 0px #1d4ed8,
      4px 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .skeuo-button:hover {
    box-shadow: 
      0px 3px 0px #1d4ed8,
      2px 4px 8px rgba(0, 0, 0, 0.08);
  }

  .skeuo-button:active {
    box-shadow: 
      0px 0px 0px #1d4ed8,
      0px 1px 2px rgba(0, 0, 0, 0.05);
  }

  .box-shadow-mini {
    box-shadow: 3px 3px 0px 0px #000000;
  }
</style>