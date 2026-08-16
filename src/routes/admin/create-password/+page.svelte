<script lang="ts">
	import '../admin.css';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);
</script>

<div class="admin-shell flex items-center justify-center px-4 py-16 font-sans">
	<div class="glass-panel w-full max-w-md p-8 md:p-10">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Create your password</h1>
		<p class="mt-1 mb-6 text-sm text-text-muted">
			Enter the email your CT FTC admin account was created with and we'll send you a link to set a password.
		</p>

		{#if form?.success}
			<div class="success-banner">
				If that email has an account, a link to set your password is on its way. <a href="/admin" class="underline">Back to sign in</a>.
			</div>
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
				<div>
					<label for="email" class="admin-label">Email</label>
					<input id="email" name="email" type="email" required autocomplete="email" class="glass-input" />
				</div>
				<button type="submit" disabled={loading} class="btn-primary w-full">
					{loading ? 'Sending…' : 'Send link'}
				</button>
			</form>
		{/if}
	</div>
</div>
