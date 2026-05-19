<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let events = $state([]);
  let name = $state("");
  let location = $state("");
  let dateTime = $state("");
  let isProcessing = $state(false);

  onMount(() => {
    if (!pb.authStore.isValid) { goto('/admin/login'); return; }
    loadEvents();
  });

  async function loadEvents() {
    try {
      events = await pb.collection('events').getFullList({ sort: '-date_time' });
    } catch (e) { 
      console.error("Failed to load events:", e); 
    }
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    isProcessing = true;
    try {
      // Location is handled cleanly here as a plain text string string
      const data = { 
        name, 
        location, 
        date_time: new Date(dateTime).toISOString(), 
        pics: "[]" 
      };
      await pb.collection('events').create(data);
      name = ""; location = ""; dateTime = "";
      await loadEvents();
    } catch (err) { 
      alert("Error creating event: " + err.message); 
    } finally { 
      isProcessing = false; 
    }
  }

  async function handleDeleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await pb.collection('events').delete(id);
      await loadEvents();
    } catch (err) { 
      alert("Delete failed: " + err.message); 
    }
  }
</script>

<main class="min-h-screen text-[#1a1a1a] p-4 md:p-8 text-left w-full max-w-none">
  
  <div class="w-full mb-6">
    <a href="/admin" class="text-xs font-black uppercase text-[#2563eb] hover:underline">&larr; Back to Dashboard</a>
  </div>

  <header class="w-full border-b-4 border-black pb-4 mb-10">
    <h1 class="text-4xl font-black uppercase tracking-tighter">Events</h1>
    <p class="text-xs font-mono text-slate-500">Create, edit, and remove event listings.</p>
  </header>

  <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    
    <form onsubmit={handleAddEvent} class="lg:col-span-5 bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat space-y-4">
      <h3 class="font-black uppercase text-sm tracking-tight border-b-2 border-black/10 pb-2">New Event</h3>
      
      <div class="space-y-1">
        <label for="name" class="text-[10px] font-black uppercase text-slate-400">Event Name</label>
        <input type="text" id="name" bind:value={name} required placeholder="Name" class="w-full bg-[#eef2f7] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold shadow-inner outline-none" />
      </div>

      <div class="space-y-1">
        <label for="loc" class="text-[10px] font-black uppercase text-slate-400">Address / Location</label>
        <input type="text" id="loc" bind:value={location} required placeholder="Address" class="w-full bg-[#eef2f7] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold shadow-inner outline-none" />
      </div>

      <div class="space-y-1">
        <label for="dt" class="text-[10px] font-black uppercase text-slate-400">Date and Time</label>
        <input type="datetime-local" id="dt" bind:value={dateTime} required class="w-full bg-[#eef2f7] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold shadow-inner outline-none" />
      </div>

      <button type="submit" disabled={isProcessing} class="w-full bg-[#2563eb] text-white font-black uppercase tracking-wider py-3 rounded-xl border-2 border-[#1d4ed8] shadow-mini-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all text-xs">
        {isProcessing ? 'Saving...' : 'Create Event'}
      </button>
    </form>

    <div class="lg:col-span-7 space-y-4">
      <h3 class="font-black uppercase text-sm tracking-tight pb-1">All Events ({events.length})</h3>
      
      {#if events.length === 0}
        <p class="text-xs font-bold text-slate-400 font-mono p-6 bg-white border-2 border-dashed border-slate-300 rounded-xl">No events found.</p>
      {:else}
        {#each events as ev (ev.id)}
          <div out:fade={{ duration: 250 }} class="bg-white border-2 border-black p-4 rounded-xl flex items-center justify-between gap-4 box-shadow-mini">
            <div class="truncate">
              <span class="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300">ID: {ev.id.slice(0,6)}</span>
              <h4 class="font-black uppercase text-sm text-black truncate mt-1">{ev.name}</h4>
              <p class="text-[11px] font-medium text-slate-500 truncate">{ev.location} &bull; {new Date(ev.date_time).toLocaleDateString()}</p>
            </div>
            
            <div class="flex items-center gap-2 shrink-0">
              <a href="/admin/events/{ev.id}" class="px-3 py-1.5 bg-amber-400 text-black font-black uppercase text-[10px] tracking-wider rounded border-2 border-black box-shadow-mini-flat hover:bg-amber-300 transition-colors">
                Edit
              </a>
              <button onclick={() => handleDeleteEvent(ev.id)} class="px-3 py-1.5 bg-rose-600 text-white font-black uppercase text-[10px] tracking-wider rounded border-2 border-black box-shadow-mini-flat hover:bg-rose-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>

  </div>
</main>

<style>
  .box-shadow-flat { box-shadow: 6px 6px 0px 0px #000000; }
  .box-shadow-mini { box-shadow: 4px 4px 0px 0px #000000; }
  .box-shadow-mini-flat { box-shadow: 2px 2px 0px 0px #000000; }
  .shadow-mini-skeuo { box-shadow: 0px 3px 0px #1d4ed8; }
</style>