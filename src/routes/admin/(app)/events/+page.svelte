<script lang="ts">
	import { enhance } from '$app/forms';
	import { pb } from '$lib/pocketbase';
	import { slugify } from '$lib/slug';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const canManage = $derived(data.role === 'admin' || data.role === 'event_manager');

	let showCreate = $state(false);
	let editingId = $state<string | null>(null);
	let uploadingId = $state<string | null>(null);
	let busy = $state(false);

	let newName = $state('');
	let newSlug = $state('');
	let slugTouched = $state(false);

	function onNewNameInput() {
		if (!slugTouched) newSlug = slugify(newName);
	}

	function resetCreateForm() {
		newName = '';
		newSlug = '';
		slugTouched = false;
	}

	function toLocalInput(value: string): string {
		if (!value) return '';
		const d = new Date(value);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	function monthAbbrev(value: string): string {
		if (!value) return '—';
		return new Date(value).toLocaleDateString(undefined, { month: 'short' });
	}

	function dayNum(value: string): string {
		if (!value) return '·';
		return String(new Date(value).getDate());
	}

	function agendaTime(value: string): string {
		if (!value) return 'No date set';
		return new Date(value).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-ink-900">Events</h1>
			<p class="mt-1 text-sm text-ink-400">
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
			<h2 class="mb-4 text-sm font-semibold text-ink-900">New event</h2>
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
						resetCreateForm();
					};
				}}
				class="grid grid-cols-1 gap-4 sm:grid-cols-2"
			>
				<div class="sm:col-span-2">
					<label for="name" class="admin-label">Name</label>
					<input id="name" name="name" required class="glass-input" bind:value={newName} oninput={onNewNameInput} />
				</div>
				<div class="sm:col-span-2">
					<label for="slug" class="admin-label">Slug (used in the public URL)</label>
					<input
						id="slug"
						name="slug"
						class="glass-input"
						bind:value={newSlug}
						oninput={() => (slugTouched = true)}
						placeholder="ct-qualifier-2026"
					/>
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
					<button type="button" class="btn-secondary" onclick={() => { showCreate = false; resetCreateForm(); }}>Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="space-y-3">
		{#each data.events as event (event.id)}
			<div class="glass-panel p-4 sm:p-5">
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
						<input name="slug" class="glass-input" value={event.slug ?? ''} placeholder="Slug (used in the public URL)" />
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
					<div class="flex items-start gap-4">
						<div class="flex w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-robotics-blue/10 py-2">
							<span class="text-[10px] font-semibold uppercase tracking-wide text-robotics-blue">{monthAbbrev(event.date_time)}</span>
							<span class="text-xl font-bold text-ink-900">{dayNum(event.date_time)}</span>
						</div>

						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<div class="min-w-0">
									<h3 class="truncate font-semibold text-ink-900">{event.name}</h3>
									<p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-400">
										<span>{agendaTime(event.date_time)}</span>
										{#if event.location}<span>&middot;</span><span class="truncate">{event.location}</span>{/if}
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

							<div class="mt-3 flex flex-wrap items-center gap-2">
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
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-ink-400">No events yet.</p>
		{/each}
	</div>
</div>
