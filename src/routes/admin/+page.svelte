<script lang="ts">
	import './admin.css';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);
	let errorMessage = $derived(form?.error ?? '');
</script>

<div class="admin-shell flex items-center justify-center px-4 py-16 font-sans">
	<div class="glass-panel w-full max-w-md p-8 md:p-10">
		<div
			class="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl"
			style="background: rgba(29, 78, 216, 0.1);"
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#1d4ed8" class="h-5 w-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
			</svg>
		</div>

		<h1 class="text-2xl font-bold tracking-tight text-text-main">Admin sign in</h1>
		<p class="mt-1 mb-6 text-sm text-text-muted">CTFTC staff access only. Accounts are provisioned by an administrator.</p>

		{#if errorMessage}
			<div class="error-banner mb-5">{errorMessage}</div>
		{/if}

		<form
			method="POST"
			class="space-y-4"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div>
				<label for="email" class="admin-label">Email</label>
				<input id="email" name="email" type="email" required autocomplete="email" class="glass-input" />
			</div>
			<div>
				<label for="password" class="admin-label">Password</label>
				<input id="password" name="password" type="password" required autocomplete="current-password" class="glass-input" />
			</div>
			<button type="submit" disabled={loading} class="btn-primary w-full">
				{loading ? 'Signing in…' : 'Sign in'}
			</button>
		</form>
	</div>
</div>
