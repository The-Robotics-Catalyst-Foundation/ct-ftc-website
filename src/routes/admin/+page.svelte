<script lang="ts">
	import './admin.css';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);
	let errorMessage = $derived(form?.error ?? data.oauthError ?? '');
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

		<div class="my-6 flex items-center gap-3">
			<div class="h-px flex-1 bg-border-subtle"></div>
			<span class="text-[11px] font-semibold tracking-wide text-text-muted uppercase">or</span>
			<div class="h-px flex-1 bg-border-subtle"></div>
		</div>

		<a href="/admin/login/google" class="btn-secondary w-full">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="h-4 w-4">
				<path fill="#4285f4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h11.9c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.6Z" />
				<path fill="#34a853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41 15.4 46 24 46Z" />
				<path fill="#fbbc05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5A22 22 0 0 0 2 24c0 3.5.8 6.9 2.5 9.9l7.3-5.6Z" />
				<path fill="#eb4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8.1 7 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9.1 12.2-9.1Z" />
			</svg>
			Sign in with Google
		</a>
	</div>
</div>
