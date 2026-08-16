<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let emails = $state('');
	let fileInput: HTMLInputElement | undefined = $state();
	let busy = $state(false);
</script>

<svelte:head>
	<title>Superadmin — Newsletter Import | Connecticut FTC</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6 p-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Newsletter Import</h1>
		<p class="mt-1 text-sm text-text-muted">
			One-off tool for migrating volunteer emails from the old system into the
			<code class="rounded bg-black/5 px-1 py-0.5">volunteer_newsletter</code> collection. Temporary utility page, no auth.
		</p>
	</div>

	<div class="glass-panel p-5">
		<p class="admin-label">Current subscribers</p>
		<p class="text-3xl font-black text-text-main">{data.subscriberCount}</p>
	</div>

	{#if form?.error}
		<div class="error-banner">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="success-banner">
			Found {form.total} email{form.total === 1 ? '' : 's'} — added {form.added}, skipped {form.skipped} already subscribed{form
				.errors.length
				? `, ${form.errors.length} failed`
				: ''}.
		</div>
		{#if form.errors.length}
			<div class="error-banner">
				<p class="font-bold">Failures:</p>
				<ul class="mt-1 list-disc pl-5">
					{#each form.errors as err}
						<li>{err}</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}

	<form
		method="POST"
		action="?/import"
		enctype="multipart/form-data"
		use:enhance={() => {
			busy = true;
			return async ({ update }) => {
				await update();
				busy = false;
			};
		}}
		class="glass-panel space-y-4 p-6"
	>
		<div>
			<label for="file" class="admin-label">Upload a file (.csv or .txt)</label>
			<input id="file" name="file" type="file" accept=".csv,.txt,text/csv,text/plain" bind:this={fileInput} class="glass-input" />
			<p class="mt-1 text-xs text-text-muted">
				Any file with email addresses in it works - extra columns, names, or commas are fine, only the emails are pulled out.
			</p>
		</div>

		<div>
			<label for="emails" class="admin-label">Or paste emails</label>
			<textarea
				id="emails"
				name="emails"
				rows="8"
				class="glass-input"
				placeholder={'one@example.com\ntwo@example.com, three@example.com'}
				bind:value={emails}
			></textarea>
		</div>

		<button type="submit" disabled={busy} class="btn-primary">
			{busy ? 'Importing…' : 'Import emails'}
		</button>
	</form>
</div>
