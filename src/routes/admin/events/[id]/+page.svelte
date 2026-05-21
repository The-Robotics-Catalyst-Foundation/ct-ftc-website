<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  
  import fallbackLogo from '/ctftc.png';

  const eventId = $page.params.id;

  // App States
  let eventRecord = $state(null);
  let fileInput = $state(null);
  let isProcessing = $state(false);

  // Form Fields
  let name = $state("");
  let location = $state("");
  let dateTime = $state("");

  onMount(() => {
    if (!pb.authStore.isValid) { goto('/login'); return; }
    loadEventData();
  });

  async function loadEventData() {
    try {
      eventRecord = await pb.collection('events').getOne(eventId);
      name = eventRecord.name;
      
      // Explicitly treat location as a plain string
      location = typeof eventRecord.location === 'object' 
        ? eventRecord.location?.name || eventRecord.location?.address || "" 
        : eventRecord.location || "";
      
      if (eventRecord.date_time) {
        const d = new Date(eventRecord.date_time);
        const pad = (num) => String(num).padStart(2, '0');
        dateTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
    } catch (error) {
      console.error("Could not read event data:", error);
    }
  }

  async function handleUpdateEventAndMedia() {
    if (!name || !location || !dateTime) {
      alert("Please fill out all fields.");
      return;
    }

    isProcessing = true;
    try {
      const eventFormData = new FormData();
      eventFormData.append('name', name);
      eventFormData.append('location', location);
      eventFormData.append('date_time', new Date(dateTime).toISOString());

      // Keep existing files intact
      if (eventRecord && eventRecord.pics && eventRecord.pics.length > 0) {
        for (const existingFile of eventRecord.pics) {
          eventFormData.append('pics', existingFile);
        }
      }

      // Append new files
      if (fileInput && fileInput.files.length > 0) {
        const filesToUpload = Array.from(fileInput.files);
        for (const file of filesToUpload) {
          eventFormData.append('pics', file);
        }
      }

      await pb.collection('events').update(eventId, eventFormData);
      
      if (fileInput) fileInput.value = ""; 
      
      await loadEventData();
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Updates failed:", err);
      alert("Save Failure: " + err.message);
    } finally {
      isProcessing = false;
    }
  }

  async function handleDeletePhoto(filename) {
    if (!confirm("Permanently remove this image?")) return;
    try {
      await pb.collection('events').update(eventId, {
        'pics-': filename
      });
      await loadEventData();
    } catch (err) {
      alert("Could not remove image: " + err.message);
    }
  }
</script>

<main class="min-h-screen text-[#1a1a1a] p-4 md:p-8 text-left w-full max-w-none">
  
  <div class="w-full mb-6 flex justify-between items-center">
    <a href="/events" class="text-xs font-black uppercase text-[#2563eb] hover:underline">&larr; Back to Events</a>
    <img src={fallbackLogo} alt="Logo" class="h-8 object-contain opacity-40 select-none" />
  </div>

  {#if eventRecord}
    <header class="w-full border-b-4 border-black pb-4 mb-10">
      <span class="font-mono text-xs font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-300">
        ID: {eventId}
      </span>
      <h1 class="text-4xl font-black uppercase tracking-tighter mt-2">{eventRecord.name}</h1>
      <p class="text-xs font-mono text-slate-500 mt-1">
        📍 Location: {location} &nbsp;|&nbsp; 📅 Time: {new Date(eventRecord.date_time).toLocaleString()}
      </p>
    </header>

    <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <div class="lg:col-span-5 bg-white border-3 border-black p-6 rounded-2xl box-shadow-flat space-y-5 max-w-none">
        
        <div>
          <h3 class="font-black uppercase text-sm tracking-tight border-b-2 border-black/10 pb-2">Edit Event Information</h3>
        </div>

        <div class="space-y-1">
          <label for="name" class="text-[10px] font-black uppercase text-slate-400">Event Name</label>
          <input type="text" id="name" bind:value={name} required class="w-full bg-[#eef2f7] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold shadow-inner outline-none" />
        </div>

        <div class="space-y-1">
          <label for="loc" class="text-[10px] font-black uppercase text-slate-400">Address / Location</label>
          <input type="text" id="loc" bind:value={location} required class="w-full bg-[#eef2f7] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold shadow-inner outline-none" />
        </div>

        <div class="space-y-1">
          <label for="dt" class="text-[10px] font-black uppercase text-slate-400">Date and Time</label>
          <input type="datetime-local" id="dt" bind:value={dateTime} required class="w-full bg-[#eef2f7] border-2 border-black rounded-xl px-3 py-2 text-xs font-bold shadow-inner outline-none" />
        </div>

        <div class="pt-2 border-t border-dashed border-slate-200">
          <span class="text-[10px] font-black uppercase text-slate-400 block mb-1">Add Images</span>
          <label for="file-input" class="drop-container">
            <span class="drop-title">Drop images here</span>
            <span class="text-xs text-slate-400 font-medium font-sans">or browse local files</span>
            <input type="file" accept="image/*" multiple bind:this={fileInput} id="file-input">
          </label>
        </div>

        <button onclick={handleUpdateEventAndMedia} disabled={isProcessing} class="w-full bg-[#2563eb] text-white font-black uppercase tracking-wider py-3 rounded-xl border-2 border-[#1d4ed8] shadow-mini-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all text-xs cursor-pointer">
          {isProcessing ? 'Saving Changes...' : 'Save Updates'}
        </button>
      </div>

      <div class="lg:col-span-7 space-y-4">
        <h3 class="font-black uppercase text-sm tracking-tight pb-1">
          Event Gallery ({eventRecord.pics ? eventRecord.pics.length : 0})
        </h3>
        
        {#if !eventRecord.pics || eventRecord.pics.length === 0}
          <div class="text-xs font-bold text-slate-400 font-mono p-12 bg-white border-2 border-dashed border-slate-300 rounded-xl text-center">
            No photos uploaded yet. Drop images on the left menu to add them.
          </div>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each eventRecord.pics as filename, index (filename)}
              <div out:fade={{ duration: 150 }} class="bg-white border-2 border-black p-2 rounded-xl box-shadow-mini flex flex-col group relative overflow-hidden">
                
                <div class="w-full aspect-square bg-slate-100 rounded-lg overflow-hidden border border-black/10">
                  <img 
                    src={pb.files.getURL(eventRecord, filename)} 
                    alt="Event upload" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div class="mt-2 pt-1 flex items-center justify-between gap-1 w-full">
                  <span class="font-mono text-[9px] text-slate-400 truncate">Image {index + 1}</span>
                  <button 
                    onclick={() => handleDeletePhoto(filename)} 
                    class="p-1 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

              </div>
            {/each}
          </div>
        {/if}
      </div>

    </div>
  {:else}
    <div class="w-full py-24 flex items-center justify-center font-mono font-bold text-xs text-slate-400">
      Loading event details...
    </div>
  {/if}
</main>

<style>
  .box-shadow-flat { box-shadow: 6px 6px 0px 0px #000000; }
  .box-shadow-mini { box-shadow: 4px 4px 0px 0px #000000; }
  .shadow-mini-skeuo { box-shadow: 0px 3px 0px #1d4ed8; }

  .drop-container {
    background-color: #fff;
    position: relative;
    display: flex;
    gap: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 10px;
    margin-top: 0.5rem;
    border-radius: 12px;
    border: 2px dashed rgb(171, 202, 255);
    color: #444;
    cursor: pointer;
    transition: background .2s ease-in-out, border .2s ease-in-out;
  }

  .drop-container:hover {
    background: rgba(37, 99, 235, 0.05);
    border-color: #2563eb;
  }

  .drop-container:hover .drop-title {
    color: #2563eb;
  }

  .drop-title {
    color: #1e293b;
    font-size: 15px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.025em;
    text-align: center;
    transition: color .2s ease-in-out;
  }

  #file-input {
    width: 100%;
    max-width: 100%;
    color: #444;
    padding: 4px;
    background: #f8fafc;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    margin-top: 8px;
    font-family: monospace;
    font-size: 11px;
  }

  #file-input::file-selector-button {
    margin-right: 12px;
    border: none;
    background: #2563eb;
    padding: 6px 12px;
    border-radius: 6px;
    color: #fff;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 10px;
    cursor: pointer;
    transition: background .2s ease-in-out;
  }

  #file-input::file-selector-button:hover {
    background: #1d4ed8;
  }
</style>