<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const canManage = $derived(data.role === 'admin');

	let showCreate = $state(false);
	let busy = $state(false);
</script>

{#snippet createSponsorForm()}
	<form
		method="POST"
		action="?/createSponsor"
		enctype="multipart/form-data"
		use:enhance={() => {
			busy = true;
			return async ({ update }) => {
				await update();
				busy = false;
				showCreate = false;
			};
		}}
		class="grid grid-cols-1 gap-4 sm:grid-cols-2"
	>
		<div class="sm:col-span-2">
			<label for="Name" class="admin-label">Name</label>
			<input id="Name" name="Name" required class="glass-input" />
		</div>
		<div class="sm:col-span-2">
			<label for="Website" class="admin-label">Website</label>
			<input id="Website" name="Website" type="url" placeholder="https://..." class="glass-input" />
		</div>
		<div class="sm:col-span-2">
			<label for="Logo" class="admin-label">Logo</label>
			<input id="Logo" name="Logo" type="file" accept="image/*" required class="glass-input" />
		</div>
		<div class="flex gap-2 sm:col-span-2">
			<button type="submit" disabled={busy} class="btn-primary">{busy ? 'Saving…' : 'Add sponsor'}</button>
			<button type="button" class="btn-secondary" onclick={() => (showCreate = false)}>Cancel</button>
		</div>
	</form>
{/snippet}

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Sponsors</h1>
			<p class="mt-1 text-sm text-text-muted">Manage the sponsors shown on the homepage.</p>
		</div>
		{#if canManage}
			<button type="button" class="btn-primary" onclick={() => (showCreate = true)}>New sponsor</button>
		{/if}
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	{#if showCreate}
		<div class="glass-panel mb-6 p-6">
			<h2 class="mb-4 text-sm font-semibold text-text-main">New sponsor</h2>
			{@render createSponsorForm()}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.sponsors as sponsor (sponsor.id)}
			<div class="glass-panel flex items-center gap-4 p-5">
				<div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white">
					{#if sponsor.Logo}
						<img src={pb.files.getUrl(sponsor, sponsor.Logo, { thumb: '100x100' })} alt="" class="h-full w-full object-contain p-1" />
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<h3 class="truncate font-semibold text-text-main">{sponsor.Name}</h3>
					{#if sponsor.Website}
						<a href={sponsor.Website} target="_blank" rel="noreferrer" class="truncate text-sm text-[#2563eb] hover:underline">
							{sponsor.Website}
						</a>
					{/if}
				</div>
				{#if canManage}
					<form
						method="POST"
						action="?/deleteSponsor"
						use:enhance={({ cancel }) => {
							if (!confirm(`Delete ${sponsor.Name}? This cannot be undone.`)) {
								cancel();
								return;
							}
							busy = true;
							return async ({ update }) => {
								await update();
								busy = false;
							};
						}}
					>
						<input type="hidden" name="id" value={sponsor.id} />
						<button type="submit" disabled={busy} class="btn-danger px-3 py-1.5 text-xs shrink-0">Delete</button>
					</form>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-text-muted">No sponsors yet.</p>
		{/each}
	</div>
</div>
