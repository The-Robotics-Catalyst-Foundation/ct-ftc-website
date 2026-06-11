<script lang="ts">
  import {pb} from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Svelte 5 states for layout rendering
  let isCheckingAuth = $state<boolean>(true);
  let userRole = $state<string>('');

  onMount(async () => {
    try {
      // 1. Force a server-side token refresh to ensure the account is active
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        userRole = pb.authStore.model?.authLevel || '';
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      pb.authStore.clear();
    }

    // 2. Global Safety Block: Is the user logged in at all?
    if (!pb.authStore.isValid || !userRole) {
      await goto('admin/');
      return;
    }

    isCheckingAuth = false;
  });

  // Derived helper states to clean up your UI sidebar/nav conditions
  const isAdmin = $derived(userRole === 'admin');
  const isEventManager = $derived(userRole === 'event_manager' || userRole === 'admin');
  const isPhotographer = $derived(userRole === 'photographer' || userRole === 'event_manager' || userRole === 'admin');
</script>

{#if isCheckingAuth}
  <div class="fixed inset-0 bg-slate-50 flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-sky-600"></div>
  </div>
{:else}
  <div class="flex min-h-screen bg-slate-100">
    
    <aside class="w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between">
      <div class="space-y-6">
        <div class="px-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace</span>
          <p class="text-sm font-bold text-slate-700 truncate mt-0.5">{pb.authStore.model?.email}</p>
        </div>

        <nav class="space-y-1">
          <a href="/admin/dashboard" class="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
            Dashboard
          </a>
          {#if isEventManager}
            <a href="/admin/events" class="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
              Event Schedules
            </a>
          {/if}

          {#if isAdmin}
            <a href="/admin/users" class="block px-3 py-2 text-sm font-bold text-sky-600 bg-sky-50/50 rounded-lg">
              User List
            </a>
          {/if}
        </nav>
      </div>

      <button onclick={() => { pb.authStore.clear(); goto('admin/'); }} class="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
        Sign Out
      </button>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

  </div>
{/if}