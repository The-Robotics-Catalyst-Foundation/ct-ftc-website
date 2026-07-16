<script lang="ts">
	import { enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const canManage = $derived(data.role === 'admin' || data.role === 'event_manager');

	let showCreate = $state(false);
	let editingId = $state<string | null>(null);
	let uploadingId = $state<string | null>(null);
	let busy = $state(false);

	function toLocalInput(value: string): string {
		if (!value) return '';
		const d = new Date(value);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}
</script>

<div class="mx-auto max-w-5xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Events</h1>
			<p class="mt-1 text-sm text-text-muted">
				{canManage ? 'Create, edit, and remove events.' : 'Upload photos to an event.'}
			</p>
		</div>
		{#if canManage}
			<button type="button" class="btn-primary" onclick={() => (showCreate = true)}>New event</button>
		{/if}
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	{#if showCreate}
		<div class="glass-panel mb-6 p-6">
			<h2 class="mb-4 text-sm font-semibold text-text-main">New event</h2>
			<form
				method="POST"
				action="?/createEvent"
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
					<label for="name" class="admin-label">Name</label>
					<input id="name" name="name" required class="glass-input" />
				</div>
				<div>
					<label for="location" class="admin-label">Location</label>
					<input id="location" name="location" class="glass-input" />
				</div>
				<div>
					<label for="date_time" class="admin-label">Date &amp; time</label>
					<input id="date_time" name="date_time" type="datetime-local" class="glass-input" />
				</div>
				<div>
					<label for="volunteersNeeded" class="admin-label">Volunteers needed</label>
					<input id="volunteersNeeded" name="volunteersNeeded" type="number" min="0" class="glass-input" />
				</div>
				<div>
					<label for="volunteersAttending" class="admin-label">Volunteers attending</label>
					<input id="volunteersAttending" name="volunteersAttending" type="number" min="0" class="glass-input" />
				</div>
				<div class="sm:col-span-2">
					<label for="event_pdf" class="admin-label">Sponsorship / info PDF</label>
					<input id="event_pdf" name="event_pdf" type="file" accept="application/pdf" class="glass-input" />
				</div>
				<div class="flex gap-2 sm:col-span-2">
					<button type="submit" disabled={busy} class="btn-primary">{busy ? 'Saving…' : 'Create event'}</button>
					<button type="button" class="btn-secondary" onclick={() => (showCreate = false)}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each data.events as event (event.id)}
			<div class="glass-panel p-5">
				{#if editingId === event.id}
					<form
						method="POST"
						action="?/updateEvent"
						enctype="multipart/form-data"
						use:enhance={() => {
							busy = true;
							return async ({ update }) => {
								await update();
								busy = false;
								editingId = null;
							};
						}}
						class="space-y-3"
					>
						<input type="hidden" name="id" value={event.id} />
						<input name="name" required class="glass-input" value={event.name} />
						<input name="location" class="glass-input" value={event.location} placeholder="Location" />
						<input name="date_time" type="datetime-local" class="glass-input" value={toLocalInput(event.date_time)} />
						<div class="grid grid-cols-2 gap-3">
							<input name="volunteersNeeded" type="number" min="0" class="glass-input" value={event.volunteersNeeded} placeholder="Needed" />
							<input name="volunteersAttending" type="number" min="0" class="glass-input" value={event.volunteersAttending} placeholder="Attending" />
						</div>
						<input name="event_pdf" type="file" accept="application/pdf" class="glass-input" />
						<div class="flex gap-2">
							<button type="submit" disabled={busy} class="btn-primary">Save</button>
							<button type="button" class="btn-secondary" onclick={() => (editingId = null)}>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="flex items-start justify-between gap-3">
						<div>
							<h3 class="font-semibold text-text-main">{event.name}</h3>
							<p class="text-sm text-text-muted">{event.location}</p>
							<p class="mt-1 text-xs text-text-muted">
								{event.date_time ? new Date(event.date_time).toLocaleString() : 'No date set'}
							</p>
						</div>
						{#if event.event_pdf}
							<a
								href={pb.files.getUrl(event, event.event_pdf)}
								target="_blank"
								rel="noreferrer"
								class="btn-secondary shrink-0 px-3 py-1.5 text-xs"
							>
								PDF
							</a>
						{/if}
					</div>

					<div class="mt-3 flex items-center gap-2 text-xs text-text-muted">
						<span class="role-badge event_manager">{event.volunteersAttending ?? 0}/{event.volunteersNeeded ?? 0} volunteers</span>
						<span class="role-badge photographer">{event.pics?.length ?? 0} photos</span>
					</div>

					{#if event.pics?.length}
						<div class="mt-3 flex flex-wrap gap-2">
							{#each event.pics as pic}
								<img src={pb.files.getUrl(event, pic, { thumb: '100x100' })} alt="" class="h-16 w-16 rounded-lg object-cover" />
							{/each}
						</div>
					{/if}

					<div class="mt-4 flex flex-wrap gap-2">
						{#if canManage}
							<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => (editingId = event.id)}>Edit</button>
							<form
								method="POST"
								action="?/deleteEvent"
								use:enhance={({ cancel }) => {
									if (!confirm('Delete this event? This cannot be undone.')) {
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
								<input type="hidden" name="id" value={event.id} />
								<button type="submit" disabled={busy} class="btn-danger px-3 py-1.5 text-xs">Delete</button>
							</form>
						{/if}

						{#if uploadingId === event.id}
							<form
								method="POST"
								action="?/uploadPhotos"
								enctype="multipart/form-data"
								use:enhance={() => {
									busy = true;
									return async ({ update }) => {
										await update();
										busy = false;
										uploadingId = null;
									};
								}}
								class="flex items-center gap-2"
							>
								<input type="hidden" name="id" value={event.id} />
								<input name="pics" type="file" accept="image/*" multiple class="glass-input text-xs" />
								<button type="submit" disabled={busy} class="btn-primary px-3 py-1.5 text-xs">Upload</button>
								<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => (uploadingId = null)}>Cancel</button>
							</form>
						{:else}
							<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => (uploadingId = event.id)}>
								Add photos
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-text-muted">No events yet.</p>
		{/each}
	</div>
</div>
