<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Sheet from '$lib/components/sheet.svelte';
	import { adminCreateAction } from '$lib/client/adminCreate';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showCreate = $state(false);
	let editingId = $state<string | null>(null);
	let busy = $state(false);

	onMount(() => {
		adminCreateAction.set({ label: 'New account', run: () => (showCreate = true) });
		return () => adminCreateAction.set(null);
	});

	const roleLabel: Record<string, string> = {
		admin: 'Admin',
		event_manager: 'Event Manager',
		photographer: 'Photographer'
	};
</script>

{#snippet createUserForm()}
	<form
		method="POST"
		action="?/createUser"
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
			<label for="name" class="admin-label">Name</label>
			<input id="name" name="name" type="text" required class="glass-input" />
		</div>
		<div class="sm:col-span-2">
			<label for="email" class="admin-label">Email</label>
			<input id="email" name="email" type="email" required class="glass-input" />
		</div>
		<div class="sm:col-span-2">
			<label for="authLevel" class="admin-label">Role</label>
			<select id="authLevel" name="authLevel" required class="glass-input">
				<option value="photographer">Photographer</option>
				<option value="event_manager">Event Manager</option>
				<option value="admin">Admin</option>
			</select>
		</div>
		<p class="text-xs text-text-muted sm:col-span-2">
			They'll get an email to verify their address, then an email to create their own password and activate the
			account.
		</p>
		<div class="flex gap-2 sm:col-span-2">
			<button type="submit" disabled={busy} class="btn-primary">{busy ? 'Sending invite…' : 'Send invite'}</button>
			<button type="button" class="btn-secondary" onclick={() => (showCreate = false)}>Cancel</button>
		</div>
	</form>
{/snippet}

<div class="mx-auto max-w-4xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Users</h1>
			<p class="mt-1 text-sm text-text-muted">Provision staff accounts. There is no public sign-up.</p>
		</div>
		<div>
			<button type="button" class="btn-primary" onclick={() => (showCreate = true)}>New account</button>
		</div>
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	{#if showCreate}
		<div class="glass-panel mb-6 hidden p-6 md:block">
			<h2 class="mb-4 text-sm font-semibold text-text-main">New account</h2>
			{@render createUserForm()}
		</div>
	{/if}

	<div class="glass-panel divide-y divide-border-subtle p-2">
		{#each data.users as user (user.id)}
			<div class="p-4">
				{#if editingId === user.id}
					<form
						method="POST"
						action="?/updateUser"
						use:enhance={() => {
							busy = true;
							return async ({ update }) => {
								await update();
								busy = false;
								editingId = null;
							};
						}}
						class="grid grid-cols-1 gap-3 sm:grid-cols-2"
					>
						<input type="hidden" name="id" value={user.id} />
						<input name="name" class="glass-input" value={user.name} placeholder="Name" />
						<select name="authLevel" class="glass-input" value={user.authLevel}>
							<option value="photographer">Photographer</option>
							<option value="event_manager">Event Manager</option>
							<option value="admin">Admin</option>
						</select>
						<input name="password" type="password" class="glass-input sm:col-span-2" placeholder="New password (leave blank to keep current)" />
						<div class="flex gap-2 sm:col-span-2">
							<button type="submit" disabled={busy} class="btn-primary">Save</button>
							<button type="button" class="btn-secondary" onclick={() => (editingId = null)}>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="flex flex-wrap items-center justify-between gap-3">
						<div class="min-w-0">
							<p class="truncate font-semibold text-text-main">{user.name || user.email}</p>
							<p class="truncate text-sm text-text-muted">{user.email}</p>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<span class="role-badge {user.authLevel}">{roleLabel[user.authLevel] ?? 'No role'}</span>
							<button type="button" class="btn-secondary px-3 py-2 text-xs" onclick={() => (editingId = user.id)}>Edit</button>
							{#if user.id !== data.userId}
								<form
									method="POST"
									action="?/deleteUser"
									use:enhance={({ cancel }) => {
										if (!confirm(`Remove ${user.email}? This cannot be undone.`)) {
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
									<input type="hidden" name="id" value={user.id} />
									<button type="submit" disabled={busy} class="btn-danger px-3 py-2 text-xs">Remove</button>
								</form>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<p class="p-4 text-sm text-text-muted">No accounts yet.</p>
		{/each}
	</div>
</div>

<Sheet open={showCreate} onClose={() => (showCreate = false)} title="New account">
	{@render createUserForm()}
</Sheet>
