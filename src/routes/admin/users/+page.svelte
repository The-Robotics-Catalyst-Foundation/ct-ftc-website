<script lang="ts">
  import {pb} from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // State Management (Svelte 5)
  let usersList = $state<any[]>([]);
  let isLoading = $state<boolean>(true);
  let errorMessage = $state<string>('');
  let successMessage = $state<string>('');

  // Modal & Form Binding States
  let showModal = $state<boolean>(false);
  let isEditing = $state<boolean>(false);
  let currentUserId = $state<string | null>(null);

  let name = $state<string>('');
  let email = $state<string>('');
  let password = $state<string>('');
  let authLevel = $state<string>('photographer');
  let avatarFile = $state<FileList | null>(null);

  // Check role: true if logged in user is strictly 'admin'
  const currentUserRole = pb.authStore.model?.authLevel;
  const IsAuthorizedAdmin = currentUserRole === 'admin';

  onMount(async () => {
    // Security Guard: If not an admin, redirect them out immediately
    if (!IsAuthorizedAdmin) {
      await goto('/admin/dashboard');
      return;
    }
    await fetchUsers();
  });

  async function fetchUsers(): Promise<void> {
    isLoading = true;
    errorMessage = '';
    try {
      // Admins pull absolutely EVERY account across the whole board
      const records = await pb.collection('users').getFullList({
        sort: '-created',
      });
      usersList = records;
    } catch (err: any) {
      errorMessage = err.message || 'Failed to sync with user index.';
    } finally {
      isLoading = false;
    }
  }

  function openCreateModal(): void {
    if (!IsAuthorizedAdmin) return;
    isEditing = false;
    currentUserId = null;
    name = '';
    email = '';
    password = '';
    authLevel = 'photographer';
    avatarFile = null;
    showModal = true;
  }

  function openEditModal(userItem: any): void {
    if (!IsAuthorizedAdmin) return;
    isEditing = true;
    currentUserId = userItem.id;
    name = userItem.name || '';
    email = userItem.email || '';
    password = ''; 
    authLevel = userItem.authLevel || 'photographer';
    avatarFile = null;
    showModal = true;
  }

  async function handleSaveUser(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (!IsAuthorizedAdmin) return;
    errorMessage = '';
    successMessage = '';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('authLevel', authLevel);
    
    if (password) {
      formData.append('password', password);
      formData.append('passwordConfirm', password);
    }
    
    if (avatarFile && avatarFile.length > 0) {
      formData.append('avatar', avatarFile[0]);
    }

    try {
      if (isEditing && currentUserId) {
        await pb.collection('users').update(currentUserId, formData);
        successMessage = 'Account attributes modified successfully.';
      } else {
        formData.append('emailVisibility', 'true');
        if (!password) throw new Error('Password entry required for new credentials.');
        await pb.collection('users').create(formData);
        successMessage = 'Identity structured and active.';
      }
      showModal = false;
      await fetchUsers();
    } catch (err: any) {
      errorMessage = err.message || 'Error occurred handling user compilation updates.';
    }
  }

  async function handleDeleteUser(id: string): Promise<void> {
    if (!IsAuthorizedAdmin) return;
    if (!confirm('Permanently wipe this user from the system layout?')) return;

    errorMessage = '';
    successMessage = '';

    try {
      await pb.collection('users').delete(id);
      successMessage = 'Record completely purged.';
      await fetchUsers();
    } catch (err: any) {
      errorMessage = err.message || 'Failed to isolate and destroy record.';
    }
  }
</script>

{#if IsAuthorizedAdmin}
  <div class="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans animate-in fade-in duration-150">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Platform Identity Management</h1>
          <p class="text-slate-500 text-sm mt-0.5">Unrestricted master admin control panel workspace.</p>
        </div>
        
        <button onclick={openCreateModal} class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm transition flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Provision New Identity
        </button>
      </div>

      {#if errorMessage}
        <div class="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium shadow-sm">{errorMessage}</div>
      {/if}
      {#if successMessage}
        <div class="mb-5 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-sm font-medium shadow-sm">{successMessage}</div>
      {/if}

      {#if isLoading}
        <div class="flex justify-center py-24">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-sky-600"></div>
        </div>
      {:else if usersList.length === 0}
        <div class="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-white shadow-sm">
          <p class="text-slate-400 font-medium text-sm">No identities found within database tables.</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each usersList as user}
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden">
              <div class="p-5 flex items-start gap-4">
                
                {#if user.avatar}
                  <img src={pb.files.getURL(user, user.avatar)} alt="Profile" class="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-50 flex-shrink-0" />
                {:else}
                  <div class="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 text-slate-600 font-bold flex items-center justify-center uppercase text-sm flex-shrink-0">
                    {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                  </div>
                {/if}

                <div class="min-w-0 flex-1">
                  <h3 class="text-sm font-bold text-slate-900 truncate">{user.name || 'Unnamed Account'}</h3>
                  <p class="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  
                  <div class="mt-2">
                    {#if user.authLevel === 'admin'}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">System Admin</span>
                    {:else}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">{user.authLevel || 'Unassigned'}</span>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end gap-1.5">
                <button onclick={() => openEditModal(user)} class="text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-md text-xs font-bold transition shadow-sm">
                  Edit
                </button>
                <button onclick={() => handleDeleteUser(user.id)} class="text-red-600 hover:text-white bg-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-2.5 py-1.5 rounded-md text-xs font-bold transition shadow-sm">
                  Delete
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}

    </div>
  </div>
{/if}

{#if showModal && IsAuthorizedAdmin}
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white border border-slate-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      <div class="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900">
          {isEditing ? 'Modify Core Matrix Account' : 'Provision Secure Entry Identity'}
        </h3>
        <button onclick={() => showModal = false} class="text-slate-400 hover:text-slate-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onsubmit={handleSaveUser} class="p-5 space-y-4">
        <div>
          <label for="name" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Account Full Name</label>
          <input id="name" type="text" bind:value={name} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 text-sm shadow-sm" />
        </div>

        <div>
          <label for="email" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Email Address</label>
          <input id="email" type="email" bind:value={email} required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 text-sm shadow-sm" />
        </div>

        <div>
          <label for="password" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">
            {isEditing ? 'Update Password (Optional)' : 'Password Entry'}
          </label>
          <input id="password" type="password" bind:value={password} required={!isEditing} placeholder={isEditing ? "Leave blank to keep same" : "••••••••"} class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 text-sm shadow-sm" />
        </div>

        <div>
          <label for="authLevel" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Operational Clearance Level</label>
          <select id="authLevel" bind:value={authLevel} class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600 text-sm shadow-sm">
            <option value="photographer">Photographer (photographer)</option>
            <option value="event_manager">Event Manager (event_manager)</option>
            <option value="admin">System Admin (admin)</option>
          </select>
        </div>

        <div>
          <label for="avatar" class="block text-xs uppercase font-bold text-slate-500 mb-1 tracking-wider">Profile Avatar Graphic</label>
          <input id="avatar" type="file" accept="image/*" bind:files={avatarFile} class="w-full text-xs text-slate-500 border border-slate-200 bg-slate-50 rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition" />
        </div>

        <div class="pt-4 flex justify-end gap-2 border-t border-slate-100">
          <button type="button" onclick={() => showModal = false} class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold transition text-xs shadow-sm">
            Cancel
          </button>
          <button type="submit" class="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-bold transition text-xs shadow-sm">
            Commit Changes
          </button>
        </div>
      </form>

    </div>
  </div>
{/if}