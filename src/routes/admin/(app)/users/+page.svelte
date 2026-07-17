<script lang="ts">
	import { enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import AvatarPicker from '$lib/components/admin/AvatarPicker.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showCreate = $state(false);
	let editingId = $state<string | null>(null);
	let busy = $state(false);

	const roleLabel: Record<string, string> = {
		admin: 'Admin',
		event_manager: 'Event Manager',
		photographer: 'Photographer'
	};

	function initial(user: any) {
		return (user.name?.trim()?.[0] ?? user.email?.[0] ?? '?').toUpperCase();
	}

	function avatarUrl(user: any, size = '100x100') {
		return user.avatar ? pb.files.getUrl(user, user.avatar, { thumb: size }) : null;
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-ink-900">Users</h1>
			<p class="mt-1 text-sm text-ink-400">Provision staff accounts. There is no public sign-up.</p>
		</div>
		<button type="button" class="btn-primary" onclick={() => (showCreate = true)}>New account</button>
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	{#if showCreate}
		<div class="glass-panel mb-6 p-6">
			<h2 class="mb-4 text-sm font-semibold text-ink-900">New account</h2>
			<form
				method="POST"
				action="?/createUser"
				enctype="multipart/form-data"
				use:enhance={() => {
					busy = true;
					return async ({ update }) => {
						await update();
						busy = false;
						showCreate = false;
					};
				}}
				class="space-y-5"
			>
				<AvatarPicker fallbackText="+" />

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="name" class="admin-label">Name</label>
						<input id="name" name="name" class="glass-input" />
					</div>
					<div>
						<label for="email" class="admin-label">Email</label>
						<input id="email" name="email" type="email" required class="glass-input" />
					</div>
					<div>
						<label for="password" class="admin-label">Password</label>
						<input id="password" name="password" type="password" required minlength="8" class="glass-input" />
					</div>
					<div>
						<label for="authLevel" class="admin-label">Role</label>
						<select id="authLevel" name="authLevel" required class="glass-input">
							<option value="photographer">Photographer</option>
							<option value="event_manager">Event Manager</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<div class="flex gap-2 sm:col-span-2">
						<button type="submit" disabled={busy} class="btn-primary">{busy ? 'Creating…' : 'Create account'}</button>
						<button type="button" class="btn-secondary" onclick={() => (showCreate = false)}>Cancel</button>
					</div>
				</div>
			</form>
		</div>
	{/if}

	<div class="glass-panel divide-y divide-border-subtle p-2">
		{#each data.users as user (user.id)}
			<div class="p-4">
				{#if editingId === user.id}
					<form
						method="POST"
						action="?/updateUser"
						enctype="multipart/form-data"
						use:enhance={() => {
							busy = true;
							return async ({ update }) => {
								await update();
								busy = false;
								editingId = null;
							};
						}}
						class="space-y-4"
					>
						<input type="hidden" name="id" value={user.id} />
						<AvatarPicker previewUrl={avatarUrl(user)} fallbackText={initial(user)} />

						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
						</div>
					</form>
				{:else}
					<div class="flex items-center justify-between gap-3">
						<div class="flex items-center gap-3 min-w-0">
							<div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-glass-border bg-base-mist">
								{#if avatarUrl(user)}
									<img src={avatarUrl(user)} alt="" class="h-full w-full object-cover" />
								{:else}
									<span class="flex h-full w-full items-center justify-center text-sm font-semibold text-robotics-blue" style="background: rgba(29, 78, 216, 0.1);">
										{initial(user)}
									</span>
								{/if}
							</div>
							<div class="min-w-0">
								<p class="truncate font-semibold text-ink-900">{user.name || user.email}</p>
								<p class="truncate text-sm text-ink-400">{user.email}</p>
							</div>
						</div>
						<div class="flex shrink-0 items-center gap-2">
							<span class="role-badge {user.authLevel}">{roleLabel[user.authLevel] ?? 'No role'}</span>
							<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => (editingId = user.id)}>Edit</button>
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
									<button type="submit" disabled={busy} class="btn-danger px-3 py-1.5 text-xs">Remove</button>
								</form>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<p class="p-4 text-sm text-ink-400">No accounts yet.</p>
		{/each}
	</div>
</div>
