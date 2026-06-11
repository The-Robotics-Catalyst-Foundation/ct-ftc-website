<script lang="ts">
  import {pb} from '$lib/pocketbase';
  import { onMount } from 'svelte';

  // State Management (Svelte 5)
  let events = $state<any[]>([]);
  let isLoading = $state<boolean>(true);
  let errorMessage = $state<string>('');
  let successMessage = $state<string>('');
  
  // Modal & Form States
  let showModal = $state<boolean>(false);
  let isEditing = $state<boolean>(false);
  let currentEventId = $state<string | null>(null);
  
  // Form Bindings
  let name = $state<string>('');
  let location = $state<string>('');
  let date_time = $state<string>('');
  let volunteersAttending = $state<number>(0);
  let volunteersNeeded = $state<number>(0);
  let picsFiles = $state<FileList | null>(null);
  let pdfFile = $state<FileList | null>(null);

  // Role Authentication Setup
  let userRole = $state<string>(pb.authStore.model?.authLevel || 'photographer'); 

  // Derived permissions adjusted for new authority tiers
  const canModifyEvent = $derived(userRole === 'event_manager' || userRole === 'admin');
  const canUploadPhotos = $derived(userRole === 'photographer' || userRole === 'event_manager' || userRole === 'admin');

  onMount(async () => {
    await fetchEvents();
  });

  async function fetchEvents(): Promise<void> {
    isLoading = true;
    try {
      events = await pb.collection('events').getFullList({
        sort: '-date_time',
      });
    } catch (err: any) {
      errorMessage = err.message || 'Failed to load events.';
    } finally {
      isLoading = false;
    }
  }

  function openCreateModal(): void {
    if (!canModifyEvent) return alert('Access Denied: Insufficient administrative privileges.');
    isEditing = false;
    currentEventId = null;
    name = '';
    location = '';
    date_time = ''; 
    volunteersAttending = 0;
    volunteersNeeded = 0;
    picsFiles = null;
    pdfFile = null;
    showModal = true;
  }

  function openEditModal(eventItem: any): void {
    isEditing = true;
    currentEventId = eventItem.id;
    name = eventItem.name || '';
    location = eventItem.location || '';
    volunteersAttending = eventItem.volunteersAttending || 0;
    volunteersNeeded = eventItem.volunteersNeeded || 0;
    
    if (eventItem.date_time) {
      date_time = new Date(eventItem.date_time).toISOString().slice(0, 16);
    } else {
      date_time = '';
    }
    
    picsFiles = null;
    pdfFile = null;
    showModal = true;
  }

  async function handleSaveEvent(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    errorMessage = '';
    successMessage = '';

    const formData = new FormData();
    
    if (canModifyEvent) {
      formData.append('name', name);
      formData.append('location', location);
      formData.append('date_time', new Date(date_time).toISOString());
      formData.append('volunteersAttending', volunteersAttending.toString());
      formData.append('volunteersNeeded', volunteersNeeded.toString());
      
      if (pdfFile && pdfFile.length > 0) {
        formData.append('event_pdf', pdfFile[0]);
      }
    }

    if (canUploadPhotos && picsFiles && picsFiles.length > 0) {
      for (let i = 0; i < picsFiles.length; i++) {
        formData.append('pics', picsFiles[i]);
      }
    }

    try {
      if (isEditing) {
        await pb.collection('events').update(currentEventId!, formData);
        successMessage = 'Event records updated successfully.';
      } else {
        if (!canModifyEvent) throw new Error('Unauthorized operational context.');
        await pb.collection('events').create(formData);
        successMessage = 'New event successfully created.';
      }
      
      showModal = false;
      await fetchEvents();
    } catch (err: any) {
      errorMessage = err.message || 'An error occurred while handling runtime database updates.';
    }
  }

  async function handleDeleteEvent(id: string): Promise<void> {
    if (!canModifyEvent) return alert('Access Denied.');
    if (!confirm('Permanently wipe this event and all associated logs?')) return;

    errorMessage = '';
    successMessage = '';

    try {
      await pb.collection('events').delete(id);
      successMessage = 'Event record removed.';
      await fetchEvents();
    } catch (err: any) {
      errorMessage = err.message || 'Failed to destroy event record.';
    }
  }

  function getFileUrl(record: any, filename: string): string {
    if (!filename) return '';
    return pb.files.getUrl(record, filename);
  }
</script>

<div class="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
  <div class="max-w-7xl mx-auto">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6 mb-8">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-950">Event Operations Workspace</h1>
        <div class="flex items-center gap-2 mt-1.5 text-xs font-semibold text-slate-500">
          <span>Active Identity Clearance:</span>
          {#if userRole === 'admin'}
            <span class="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase tracking-wide text-[10px]">Admin</span>
          {:else}
            <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide text-[10px]">{userRole}</span>
          {/if}
        </div>
      </div>
      
      {#if canModifyEvent}
        <button onclick={openCreateModal} class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-lg font-bold shadow-sm transition flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Schedule New Event
        </button>
      {/if}
    </div>

    {#if errorMessage}
      <div class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium shadow-sm">{errorMessage}</div>
    {/if}
    {#if successMessage}
      <div class="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium shadow-sm">{successMessage}</div>
    {/if}

    {#if isLoading}
      <div class="flex justify-center py-24">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-sky-600"></div>
      </div>
    {:else if events.length === 0}
      <div class="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white shadow-sm">
        <p class="text-slate-400 font-medium text-sm">No operational entry datasets identified inside the event logs.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each events as item}
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between">
            
            <div class="p-5 space-y-4">
              <div>
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-400">Node ID: {item.id}</span>
                <h3 class="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">{item.name || 'Untitled Event'}</h3>
              </div>

              <div class="space-y-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div class="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span class="truncate text-slate-700">{item.location || 'Location Pending Allocation'}</span>
                </div>

                <div class="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span class="text-slate-700">{item.date_time ? new Date(item.date_time).toLocaleString() : 'Scheduling Window Open'}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 text-center border-t border-b border-slate-100 py-3 text-xs">
                <div>
                  <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Volunteers Attending</p>
                  <p class="text-base font-black text-slate-900 mt-0.5">{item.volunteersAttending || 0}</p>
                </div>
                <a href="/contact#volunteer" class="border-l border-slate-100 block hover:bg-indigo-50/60 rounded-r-lg transition duration-150">
                  <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Volunteers Needed</p>
                  <p class="text-base font-black text-indigo-600 mt-0.5 flex items-center justify-center gap-0.5">
                    {item.volunteersNeeded || 0}
                    <span class="text-xs font-normal text-indigo-400 opacity-70 transition group-hover:translate-x-0.5">→</span>
                  </p>
                </a>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <span class="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-slate-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 010 .75z" />
                  </svg>
                  {item.pics?.length || 0} Images
                </span>

                {#if item.event_pdf}
                  <a href={getFileUrl(item, item.event_pdf)} target="_blank" class="inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-md text-[11px] font-bold transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Event PDF
                  </a>
                {/if}
              </div>
            </div>

            <div class="bg-slate-50 border-t border-slate-100 px-5 py-3.5 flex justify-end items-center gap-2">
              <button onclick={() => openEditModal(item)} class="text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm">
                {canModifyEvent ? 'Edit' : 'Add Photos'}
              </button>
              
              {#if canModifyEvent}
                <button onclick={() => handleDeleteEvent(item.id)} class="text-red-600 hover:text-white bg-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm">
                  Delete
                </button>
              {/if}
            </div>

          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if showModal}
  <div class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <div class="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 class="text-base font-black text-slate-900">
          {isEditing ? (canModifyEvent ? 'Edit Event Details' : 'Append Live Media Assets') : 'Initialize Event Instance Record'}
        </h3>
        <button onclick={() => showModal = false} class="text-slate-400 hover:text-slate-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onsubmit={handleSaveEvent} class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        
        {#if canModifyEvent}
          <div>
            <label for="modal-name" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Event Name</label>
            <input id="modal-name" type="text" bind:value={name} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 transition text-sm shadow-sm" />
          </div>

          <div>
            <label for="modal-location" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Location</label>
            <input id="modal-location" type="text" bind:value={location} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 transition text-sm shadow-sm" />
          </div>

          <div>
            <label for="modal-date" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Date & Time</label>
            <input id="modal-date" type="datetime-local" bind:value={date_time} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 transition text-sm shadow-sm" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="modal-attending" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Volunteers Attending</label>
              <input id="modal-attending" type="number" min="0" bind:value={volunteersAttending} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 transition text-sm shadow-sm" />
            </div>
            <div>
              <label for="modal-needed" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Volunteers Needed</label>
              <input id="modal-needed" type="number" min="0" bind:value={volunteersNeeded} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 transition text-sm shadow-sm" />
            </div>
          </div>

          <div>
            <label for="modal-pdf" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Event PDF Document File</label>
            <input id="modal-pdf" type="file" accept=".pdf" bind:files={pdfFile} class="w-full text-xs text-slate-500 border border-slate-200 bg-slate-50 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition" />
          </div>
        {:else}
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 space-y-2">
            <p><strong class="text-slate-900 font-bold">Target Operation Instance:</strong> {name}</p>
            <p><strong class="text-slate-900 font-bold">Venue Site:</strong> {location}</p>
          </div>
        {/if}

        {#if canUploadPhotos}
          <div>
            <label for="modal-pics" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Append Event Media Images</label>
            <input id="modal-pics" type="file" accept="image/*" multiple bind:files={picsFiles} class="w-full text-xs text-slate-500 border border-slate-200 bg-slate-50 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition" />
            <p class="text-[10px] text-slate-400 mt-1">Accepts bulk uploads simultaneously.</p>
          </div>
        {/if}

        <div class="pt-4 flex justify-end gap-2 border-t border-slate-100">
          <button type="button" onclick={() => showModal = false} class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold transition text-xs shadow-sm">
            Cancel
          </button>
          <button type="submit" class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-bold transition text-xs shadow-sm">
            Save Changes
          </button>
        </div>

      </form>
    </div>
  </div>
{/if}