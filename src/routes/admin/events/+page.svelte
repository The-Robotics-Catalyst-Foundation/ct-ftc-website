<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { pb } from '$lib/pocketbase';

  let events: any[] = [];

  let isWorking = false;
  let statusBanner = '';
  let statusIsError = false;

  // form state
  let targetRecordId = '';
  let name = '';
  let location = '';
  let date_time = '';
  let pics = '';

  onMount(async () => {
    if (!pb.authStore.isValid) {
      await goto('/admin/login');
      return;
    }

    await reloadSystemCollections();
  });

  async function reloadSystemCollections() {
    try {
      events = await pb.collection('events').getFullList({
        sort: '-date_time'
      });
    } catch (err: any) {
      logStatus(`Failed loading events: ${err.message}`, true);
    }
  }

  async function commitFormSubmission() {
    try {
      isWorking = true;
      statusBanner = '';

      const payload = {
        name,
        location,
        date_time: date_time
          ? new Date(date_time).toISOString()
          : null,
        pics
      };

      if (targetRecordId) {
        await pb.collection('events').update(targetRecordId, payload);

        logStatus(`Updated "${name}" successfully.`, false);
      } else {
        await pb.collection('events').create(payload);

        logStatus(`Created "${name}" successfully.`, false);
      }

      clearFormDeck();
      await reloadSystemCollections();
    } catch (err: any) {
      logStatus(`Save failed: ${err.message}`, true);
    } finally {
      isWorking = false;
    }
  }

  function editFormInject(item: any) {
    targetRecordId = item.id;
    name = item.name ?? '';
    location = item.location ?? '';

    date_time = item.date_time
      ? item.date_time.slice(0, 16)
      : '';

    pics = item.pics ?? '';

    logStatus('Loaded event into editor.', false);
  }

  async function purgeTargetNode(id: string, label: string) {
    const confirmed = confirm(
      `Delete "${label}" permanently?`
    );

    if (!confirmed) return;

    try {
      await pb.collection('events').delete(id);

      logStatus('Event deleted successfully.', false);

      if (targetRecordId === id) {
        clearFormDeck();
      }

      await reloadSystemCollections();
    } catch (err: any) {
      logStatus(`Delete failed: ${err.message}`, true);
    }
  }

  async function triggerLogoutSequence() {
    pb.authStore.clear();
    await goto('/admin/login');
  }

  function clearFormDeck() {
    targetRecordId = '';
    name = '';
    location = '';
    date_time = '';
    pics = '';
  }

  function logStatus(msg: string, errorFlag = false) {
    statusBanner = msg;
    statusIsError = errorFlag;
  }
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

<main class="max-w-7xl mx-auto px-6 py-12 min-h-screen">
  <header
    class="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6"
  >
    <div>
      <p
        class="text-xs uppercase tracking-[0.25em] text-blue-500 font-bold"
      >
        Admin Panel
      </p>

      <h1 class="text-3xl font-black mt-2">
        Tournament Control Center
      </h1>
    </div>

    <div class="flex gap-3">
      <button
        type="button"
        onclick={clearFormDeck}
        class="px-4 py-2 rounded-xl border text-sm font-bold hover:bg-slate-100 transition"
      >
        Reset
      </button>

      <button
        type="button"
        onclick={triggerLogoutSequence}
        class="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition"
      >
        Logout
      </button>
    </div>
  </header>

  {#if statusBanner}
    <div
      class={`mb-6 p-4 rounded-2xl border text-sm font-medium flex items-center justify-between ${
        statusIsError
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
      }`}
    >
      <span>{statusBanner}</span>

      <button
        type="button"
        onclick={() => (statusBanner = '')}
        class="text-lg opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  {/if}

  <div class="grid lg:grid-cols-12 gap-8">
    <!-- FORM -->
    <div class="lg:col-span-5 bg-white rounded-3xl border p-6 shadow-sm">
      <h2 class="text-xl font-black mb-6">
        {targetRecordId ? 'Edit Event' : 'Create Event'}
      </h2>

      <form
        onsubmit|preventDefault={commitFormSubmission}
        class="space-y-5"
      >
        <div>
          <label class="block mb-2 text-xs font-bold uppercase">
            Event Name
          </label>

          <input
            bind:value={name}
            type="text"
            required
            placeholder="Central CT Qualifier"
            class="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-xs font-bold uppercase">
            Location
          </label>

          <input
            bind:value={location}
            type="text"
            required
            placeholder="Town, CT"
            class="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 text-xs font-bold uppercase">
              Date & Time
            </label>

            <input
              bind:value={date_time}
              type="datetime-local"
              required
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block mb-2 text-xs font-bold uppercase">
              Image
            </label>

            <input
              bind:value={pics}
              type="text"
              placeholder="banner.png"
              class="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isWorking}
          class="w-full rounded-xl bg-blue-600 text-white py-3 font-bold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {#if isWorking}
            Saving...
          {:else if targetRecordId}
            Update Event
          {:else}
            Create Event
          {/if}
        </button>
      </form>
    </div>

    <!-- EVENTS -->
    <div class="lg:col-span-7">
      <div class="rounded-3xl border bg-slate-50 p-3 min-h-[300px]">
        {#if events.length === 0}
          <div
            class="flex items-center justify-center min-h-[260px] text-slate-500 text-sm"
          >
            No events found.
          </div>
        {:else}
          <div class="space-y-3">
            {#each events as item}
              <div
                class="bg-white rounded-2xl border p-4 flex flex-col sm:flex-row justify-between gap-4 shadow-sm"
              >
                <div>
                  <h3 class="font-black text-lg">
                    {item.name}
                  </h3>

                  <p class="text-sm text-slate-600 mt-1">
                    📍 {item.location}
                  </p>

                  <p class="text-xs text-slate-400 mt-1">
                    📅
                    {new Date(item.date_time).toLocaleString()}
                  </p>
                </div>

                <div class="flex gap-2">
                  <button
                    type="button"
                    onclick={() => editFormInject(item)}
                    class="px-4 py-2 rounded-xl border text-sm font-bold hover:bg-slate-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onclick={() =>
                      purgeTargetNode(item.id, item.name)}
                    class="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition"
                  >
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