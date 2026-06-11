<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import type { UserRecord } from '../../app'; // Adjust path to your types

  // Svelte 5 state definitions with explicit typing
  let email = $state<string>('');
  let password = $state<string>('');
  let showPassword = $state<boolean>(false);
  let errorMessage = $state<string>('');
  let isLoading = $state<boolean>(false);

  async function handleLogin(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    errorMessage = '';
    isLoading = true;

    try {
      // 1. Authenticate against your custom users collection
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // 2. Cast the record to our custom typed interface
      const userRecord = authData.record as UserRecord;
      const userLevel = userRecord?.authLevel;

      // 3. Check access rights
      if (userLevel === 'super' || userLevel === 'admin' || userLevel === 'photo') {
        await goto('/admin/dashboard');
      } else {
        pb.authStore.clear(); // Wipe unprivileged tokens
        errorMessage = 'Access denied: Insufficient dashboard permissions.';
      }

    } catch (error: any) {
      errorMessage = error.message || 'Invalid credentials or validation failed.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
  <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-8">
    
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-sky-50 text-sky-600 rounded-xl mb-3 border border-sky-100 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Portal Sign In</h2>
      <p class="text-slate-500 text-sm mt-1">Access dashboard using your database user account.</p>
    </div>

    {#if errorMessage}
      <div class="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-center gap-2.5 animate-in fade-in duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 flex-shrink-0 text-red-500">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span class="font-medium">{errorMessage}</span>
      </div>
    {/if}

    <form onsubmit={handleLogin} class="space-y-5">
      
      <div>
        <label for="email" class="block text-xs uppercase font-bold text-slate-500 mb-1.5 tracking-wider">Email Address</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            placeholder="name@company.org"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-600/30 transition duration-150 shadow-sm"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-xs uppercase font-bold text-slate-500 mb-1.5 tracking-wider">Password</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
            </svg>
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-1 focus:ring-sky-600/30 transition duration-150 shadow-sm"
          />
          <button
            type="button"
            onclick={() => showPassword = !showPassword}
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-sky-600 transition duration-150"
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs font-medium">
        <label class="flex items-center text-slate-500 cursor-pointer select-none">
          <input type="checkbox" class="rounded bg-slate-50 border-slate-300 text-sky-600 focus:ring-0 focus:ring-offset-0 mr-2 w-4 h-4" />
          Keep session active
        </label>
        <a href="#reset" class="text-sky-600 hover:text-sky-700 hover:underline">Forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-lg focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2 shadow-md shadow-sky-600/10 hover:shadow-lg"
      >
        {#if isLoading}
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        {:else}
          Sign In
        {/if}
      </button>

    </form>
  </div>
</div>