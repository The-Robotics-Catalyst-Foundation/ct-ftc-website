<script lang="ts">
	import '../admin.css';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let loading = $state(false);
</script>

<div class="admin-shell flex items-center justify-center px-4 py-16 font-sans">
	<div class="glass-panel w-full max-w-md p-8 md:p-10">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Set your password</h1>
		<p class="mt-1 mb-6 text-sm text-text-muted">Choose a password to activate your CT FTC admin account.</p>

		{#if !data.token}
			<div class="error-banner">This invite link is missing its token. Ask an admin to resend your invite.</div>
		{:else if form?.success}
			<div class="success-banner">Password set! You can now <a href="/admin" class="underline">sign in</a>.</div>
		{:else}
			{#if form?.error}
				<div class="error-banner mb-5">{form.error}</div>
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
				<input type="hidden" name="token" value={data.token} />
				<div>
					<label for="password" class="admin-label">New password</label>
					<input id="password" name="password" type="password" required minlength="8" autocomplete="new-password" class="glass-input" />
				</div>
				<div>
					<label for="passwordConfirm" class="admin-label">Confirm password</label>
					<input id="passwordConfirm" name="passwordConfirm" type="password" required minlength="8" autocomplete="new-password" class="glass-input" />
				</div>
				<button type="submit" disabled={loading} class="btn-primary w-full">
					{loading ? 'Saving…' : 'Set password & activate account'}
				</button>
			</form>
		{/if}
	</div>
</div>
