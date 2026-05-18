<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';

  let events = [];
  let isWorking = false;
  let statusBanner = '';
  let statusIsError = false;

  // Form Field Model Bindings mapped to your schema
  let targetRecordId = '';
  let name = '';
  let location = '';
  let date_time = '';
  let pics = '';

  onMount(async () => {
    // Structural security guard check logic route redirect
    if (!pb.authStore.isValid) {
      goto('/admin/login');
      return;
    }
    await reloadSystemCollections();
  });

  async function reloadSystemCollections() {
    try {
      events = await pb.collection('events').getFullList({ sort: '-date_time' });
    } catch (err) {
      logStatus(`System Synchronization Interrupted: ${err.message}`, true);
    }
  }

  async function commitFormSubmission() {
    isWorking = true;
    statusBanner = '';

    const payload = {
      name,
      location,
      date_time: new Date(date_time).toISOString(),
      pics
    };

    try {
      if (targetRecordId) {
        await pb.collection('events').update(targetRecordId, payload);
        logStatus(`Altered entry row: "${name}" complete.`, false);
      } else {
        await pb.collection('events').create(payload);
        logStatus(`Initialized new entry row: "${name}" complete.`, false);
      }
      clearFormDeck();
      await reloadSystemCollections();
    } catch (err) {
      logStatus(`Transaction Cancelled: ${err.message}`, true);
    } finally {
      isWorking = false;
    }
  }

  function editFormInject(item) {
    targetRecordId = item.id;
    name = item.name;
    location = item.location;
    date_time = item.date_time ? item.date_time.slice(0, 16) : '';
    pics = item.pics || '';
    logStatus(`Workspace focused onto object reference target node.`, false);
  }

  async function purgeTargetNode(id, label) {
    if (!confirm(`Permanently erase "${label}" data parameters from collection schema?`)) return;
    try {
      await pb.collection('events').delete(id);
      logStatus('Document node cleared out from datastore arrays.', false);
      if (targetRecordId === id) clearFormDeck();
      await reloadSystemCollections();
    } catch (err) {
      logStatus(`Purge transaction error: ${err.message}`, true);
    }
  }

  function triggerLogoutSequence() {
    pb.authStore.clear();
    goto('/admin/login');
  }

  function clearFormDeck() {
    targetRecordId = ''; name = ''; location = ''; date_time = ''; pics = '';
  }

  function logStatus(msg, errorFlag) {
    statusBanner = msg;
    statusIsError = errorFlag;
  }
</script>

<svelte:head>
  <title>Tournament Control Deck | Admin Suite</title>
</svelte:head>

<main class="max-w-7xl mx-auto px-6 py-12 min-h-screen selection:bg-ftc-blue selection:text-white">
  
  <header class="mb-10 pb-6 border-b border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div class="space-y-1">
      <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-ftc-blue bg-ftc-blue/10 px-2.5 py-0.5 rounded border border-ftc-sky/20">
        System Operational Suite // Terminal
      </span>
      <h1 class="text-3xl font-display font-black tracking-tight text-text-main">Tournament Control Center</h1>
    </div>
    <div class="flex items-center gap-3 shrink-0 w-full md:w-auto">
      <button on:click={clearFormDeck} class="text-xs font-bold bg-bg-surface hover:bg-bg-surface-hover border border-border-subtle text-text-muted py-2 px-4 rounded-xl transition-colors">
        Reset Fields
      </button>
      <button on:click={triggerLogoutSequence} class="text-xs font-bold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 py-2 px-4 rounded-xl transition-colors">
        Close Session &rarr;
      </button>
    </div>
  </header>

  {#if statusBanner}
    <div class="mb-8 p-4 rounded-2xl text-xs font-mono font-bold border flex justify-between items-center animate-fade-in
      {statusIsError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}">
      <span>{statusIsError ? '⚙️ [FATAL ERROR]:' : '⚙️ [TRANSACTION SUCCESS]:'} {statusBanner}</span>
      <button on:click={() => statusBanner = ''} class="opacity-50 hover:opacity-100 font-sans text-sm px-1">&times;</button>
    </div>
  {/if}

  <div class="grid lg:grid-cols-12 gap-8 items-start">
    
    <div class="bg-white border border-border-subtle rounded-[2rem] p-6 shadow-sm lg:col-span-5 relative overflow-hidden">
      <h2 class="text-lg font-display font-extrabold text-text-main mb-6">
        {targetRecordId ? '📝 Edit Target Parameters' : '⚡ Initialize New Node'}
      </h2>
      
      <form on:submit|preventDefault={commitFormSubmission} class="space-y-5">
        <div>
          <label for="name" class="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Official Tournament Name</label>
          <input type="text" id="name" bind:value={name} placeholder="e.g., Central CT Qualifier" required
            class="w-full text-sm border border-border-subtle rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-ftc-blue bg-bg-surface/50 font-medium transition-colors" />
        </div>

        <div>
          <label for="location" class="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Venue Location Profile</label>
          <input type="text" id="location" bind:value={location} placeholder="e.g., High School Gym, Town, CT" required
            class="w-full text-sm border border-border-subtle rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-ftc-blue bg-bg-surface/50 font-medium transition-colors" />
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="date_time" class="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Match Timestamp</label>
            <input type="datetime-local" id="date_time" bind:value={date_time} required
              class="w-full text-sm border border-border-subtle rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-ftc-blue bg-bg-surface/50 font-mono transition-colors" />
          </div>
          <div>
            <label for="pics" class="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5">Media Assets Identifier</label>
            <input type="text" id="pics" bind:value={pics} placeholder="e.g., backup_cover.png"
              class="w-full text-sm border border-border-subtle rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-ftc-blue bg-bg-surface/50 font-mono transition-colors" />
          </div>
        </div>

        <button type="submit" disabled={isWorking}
          class="w-full bg-ftc-blue hover:bg-ftc-blue-dark disabled:bg-slate-300 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-mono transition-all shadow-md shadow-ftc-blue/10 transform hover:-translate-y-0.5 active:translate-y-0 mt-2">
          {isWorking ? 'Processing data stream...' : targetRecordId ? 'Update Field Parameters' : 'Deploy Node Live'}
        </button>
      </form>
    </div>

    <div class="lg:col-span-7 space-y-4">
      <div class="bg-bg-surface border border-border-subtle rounded-[2rem] p-2 shadow-inner min-h-[300px]">
        {#if events.length === 0}
          <div class="flex flex-col items-center justify-center text-center p-12 min-h-[280px] bg-white rounded-2xl">
            <span class="text-3xl mb-2">📡</span>
            <p class="text-xs font-mono font-bold text-text-muted">Zero dataset records matched inside database cluster lists.</p>
          </div>
        {:else}
          <div class="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {#each events as item}
              <div class="p-4 bg-white border border-border-subtle rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all shadow-sm">
                <div class="space-y-1 max-w-md">
                  <h3 class="text-sm font-extrabold text-text-main leading-snug">{item.name}</h3>
                  <div class="text-[11px] text-text-muted font-medium space-y-0.5">
                    <p>📍 {item.location}</p>
                    <p class="font-mono text-[10px] text-slate-400">📅 {new Date(item.date_time).toLocaleString()}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t border-slate-50 sm:border-0 pt-3 sm:pt-0">
                  <button on:click={() => editFormInject(item)} class="text-xs font-bold text-ftc-blue border border-border-subtle px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-bg-surface transition">
                    Modify
                  </button>
                  <button on:click={() => purgeTargetNode(item.id, item.name)} class="text-xs font-bold text-rose-600 border border-border-subtle hover:border-rose-200 px-3 py-1.5 rounded-lg bg-white shadow-sm transition hover:bg-rose-50">
                    Delete
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

  </div>
</main>