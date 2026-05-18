<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    // Access returned server validation states using Svelte 5 Runes destructuring
    let { form }: { form: ActionData } = $props();
    
    let isSubmitting = $state(false);
</script>

<div class="min-h-screen bg-bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto w-full max-w-md">
        <div class="text-center space-y-2">
            <span class="text-xs font-mono font-bold tracking-widest text-ftc-blue-dark uppercase">Terminal Gateway</span>
            <h1 class="font-display font-bold text-3xl text-text-main tracking-tight">Admin Authentication</h1>
        </div>
    </div>

    <div class="mt-8 sm:mx-auto w-full max-w-md px-4">
        <div class="bg-bg-main border border-border-subtle py-8 px-6 shadow-xl rounded-2xl space-y-6">
            
            {#if form?.error}
                <div class="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-mono font-semibold animate-fade-in">
                    ⚠️ {form.error}
                </div>
            {/if}

            <form 
                method="POST" 
                use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        await update();
                        isSubmitting = false;
                    };
                }} 
                class="space-y-4"
            >
                <div class="space-y-1">
                    <label for="email" class="block text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        value={form?.email ?? ''}
                        placeholder="admin@robotics-catalyst.org"
                        class="w-full text-sm p-3 bg-bg-surface border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-ftc-blue focus:ring-1 focus:ring-ftc-blue transition-all"
                        required
                    />
                </div>

                <div class="space-y-1">
                    <label for="password" class="block text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        placeholder="••••••••"
                        class="w-full text-sm p-3 bg-bg-surface border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-ftc-blue focus:ring-1 focus:ring-ftc-blue transition-all"
                        required
                    />
                </div>

                <div class="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-ftc-blue hover:bg-ftc-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ftc-blue disabled:opacity-50 transition-all"
                    >
                        {isSubmitting ? 'Verifying Identity...' : 'Initialize Session'}
                    </button>
                </div>
            </form>
            
        </div>
    </div>
</div>  