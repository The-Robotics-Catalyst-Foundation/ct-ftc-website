<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { ExternalLink, Radar } from '@lucide/svelte';
	import { robolystEventUrl } from '$lib/robolyst';
	import { adminCreateAction } from '$lib/client/adminCreate';
	import Sheet from '$lib/components/sheet.svelte';
	import Modal from '$lib/components/modal.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const canManage = $derived(data.role === 'admin' || data.role === 'event_manager');

	onMount(() => {
		if (!canManage) return;
		adminCreateAction.set({ label: 'New event', run: () => (showCreate = true) });
		return () => adminCreateAction.set(null);
	});

	const TYPE_OPTIONS = ['Scrimmage', 'Qualifier', 'Championship'];
	// Keyed lowercase since PocketBase data casing isn't guaranteed to match.
	const TYPE_STYLES: Record<string, string> = {
		scrimmage: 'bg-[#FF8C00]',
		qualifier: 'bg-[#0066FF]',
		championship: 'bg-[#FFD700]'
	};
	function typeKey(type: string): string {
		return (type || 'scrimmage').trim().toLowerCase();
	}

	// Events can carry hundreds of photos - only preview a handful on the card
	// itself rather than rendering every thumbnail.
	const PHOTO_PREVIEW_LIMIT = 8;

	let showCreate = $state(false);
	let editingId = $state<string | null>(null);
	let uploadingId = $state<string | null>(null);
	let busy = $state(false);

	// Uploads are chunked client-side so 200+ photos don't ride in one giant
	// request - each batch is its own POST, so one slow/failed batch doesn't
	// lose progress already saved by the batches before it.
	const UPLOAD_BATCH_SIZE = 20;
	let uploadFiles = $state<FileList | null>(null);
	let uploadProgress = $state<{ done: number; total: number } | null>(null);
	let uploadError = $state('');

	function startUpload(eventId: string) {
		uploadingId = eventId;
		uploadFiles = null;
		uploadProgress = null;
		uploadError = '';
	}

	function cancelUpload() {
		uploadingId = null;
		uploadFiles = null;
		uploadProgress = null;
		uploadError = '';
	}

	async function uploadPhotos(eventId: string) {
		if (!uploadFiles?.length) return;
		const files = Array.from(uploadFiles);

		// Resume after a partial failure instead of re-uploading the batches
		// that already succeeded (which would duplicate those photos).
		const startAt = uploadError ? (uploadProgress?.done ?? 0) : 0;

		busy = true;
		uploadError = '';
		uploadProgress = { done: startAt, total: files.length };

		for (let i = startAt; i < files.length; i += UPLOAD_BATCH_SIZE) {
			const batch = files.slice(i, i + UPLOAD_BATCH_SIZE);
			const formData = new FormData();
			formData.append('id', eventId);
			for (const file of batch) formData.append('pics', file);

			try {
				const res = await fetch('/admin/events/upload-photos', { method: 'POST', body: formData });
				const result = await res.json();
				if (!res.ok || result.error) {
					uploadError = `Uploaded ${uploadProgress.done} of ${files.length} before failing: ${result.error ?? 'Unknown error'}`;
					break;
				}
				uploadProgress = { done: uploadProgress.done + batch.length, total: files.length };
			} catch {
				uploadError = `Uploaded ${uploadProgress.done} of ${files.length} before a network error interrupted the upload.`;
				break;
			}
		}

		busy = false;
		await invalidateAll();
		if (!uploadError) cancelUpload();
	}

	const editingEvent = $derived(data.events.find((e) => e.id === editingId) ?? null);

	// --- Search / filter / sort (client-side - data.events is already the
	// full list from the server load, no need to round-trip for this) ---
	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'upcoming' | 'past'>('all');
	let typeFilter = $state<string[]>([]);
	let sortBy = $state<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'volunteers-needed'>('date-desc');

	function toggleTypeFilter(type: string) {
		typeFilter = typeFilter.includes(type) ? typeFilter.filter((t) => t !== type) : [...typeFilter, type];
	}

	function resetFilters() {
		searchQuery = '';
		statusFilter = 'all';
		typeFilter = [];
		sortBy = 'date-desc';
	}

	const hasActiveFilters = $derived(!!searchQuery.trim() || statusFilter !== 'all' || typeFilter.length > 0);

	const filteredEvents = $derived.by(() => {
		const now = Date.now();
		const query = searchQuery.trim().toLowerCase();

		let list = data.events.filter((event) => {
			if (query) {
				const haystack = `${event.name ?? ''} ${event.location ?? ''}`.toLowerCase();
				if (!haystack.includes(query)) return false;
			}
			if (statusFilter !== 'all') {
				const isUpcoming = !!event.date_time && new Date(event.date_time).getTime() >= now;
				if (statusFilter === 'upcoming' && !isUpcoming) return false;
				if (statusFilter === 'past' && isUpcoming) return false;
			}
			if (typeFilter.length > 0 && !typeFilter.includes(event.type || 'Scrimmage')) return false;
			return true;
		});

		list = [...list].sort((a, b) => {
			switch (sortBy) {
				case 'date-asc':
					return new Date(a.date_time || 0).getTime() - new Date(b.date_time || 0).getTime();
				case 'name-asc':
					return (a.name || '').localeCompare(b.name || '');
				case 'name-desc':
					return (b.name || '').localeCompare(a.name || '');
				case 'volunteers-needed':
					return (b.volunteersNeeded ?? 0) - (a.volunteersNeeded ?? 0);
				case 'date-desc':
				default:
					return new Date(b.date_time || 0).getTime() - new Date(a.date_time || 0).getTime();
			}
		});

		return list;
	});

	function toLocalInput(value: string): string {
		if (!value) return '';
		const d = new Date(value);
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	function dateSlug(value: string): string {
		if (!value) return 'DATE TBD';
		return new Date(value)
			.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
			.toUpperCase();
	}
</script>

{#snippet createEventForm()}
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
			<label for="type" class="admin-label">Event type</label>
			<select id="type" name="type" class="glass-input">
				{#each TYPE_OPTIONS as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
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
		<div class="sm:col-span-2">
			<label for="event_pdf" class="admin-label">Sponsorship / info PDF</label>
			<input id="event_pdf" name="event_pdf" type="file" accept="application/pdf" class="glass-input" />
		</div>
		<div class="sm:col-span-2">
			<label for="imgLink" class="admin-label">Photo album link</label>
			<input id="imgLink" name="imgLink" type="url" placeholder="https://..." class="glass-input" />
		</div>
		<div class="sm:col-span-2">
			<label for="code" class="admin-label">Event code (URL slug + Robolyst code)</label>
			<input id="code" name="code" placeholder="e.g. USCTSTQ - leave blank to auto-generate" class="glass-input" />
		</div>
		<div class="flex gap-2 sm:col-span-2">
			<button type="submit" disabled={busy} class="btn-primary">{busy ? 'Saving…' : 'Create event'}</button>
			<button type="button" class="btn-secondary" onclick={() => (showCreate = false)}>Cancel</button>
		</div>
	</form>
{/snippet}

<div class="mx-auto max-w-7xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Events</h1>
			<p class="mt-1 text-sm text-text-muted">
				{canManage ? 'Create, edit, and remove events.' : 'Upload photos to an event.'}
			</p>
		</div>
		{#if canManage}
			<div>
				<button type="button" class="btn-primary" onclick={() => (showCreate = true)}>New event</button>
			</div>
		{/if}
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	{#if showCreate}
		<div class="glass-panel mb-6 hidden p-6 md:block">
			<h2 class="mb-4 text-sm font-semibold text-text-main">New event</h2>
			{@render createEventForm()}
		</div>
	{/if}

	<div class="flex flex-col gap-6 md:flex-row">
		<aside class="glass-panel h-fit w-full shrink-0 space-y-5 p-5 md:w-60">
			<div>
				<label for="event-search" class="admin-label">Search</label>
				<input
					id="event-search"
					type="search"
					bind:value={searchQuery}
					placeholder="Name or location…"
					class="glass-input"
				/>
			</div>

			<div class="hidden md:block md:space-y-5">
				<div>
					<p class="admin-label mb-2">Status</p>
					<div class="space-y-1.5">
						{#each [{ value: 'all', label: 'All' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }] as opt}
							<label class="flex items-center gap-2 text-sm font-semibold text-text-main">
								<input
									type="radio"
									name="status-filter"
									value={opt.value}
									checked={statusFilter === opt.value}
									onchange={() => (statusFilter = opt.value as typeof statusFilter)}
									class="h-4 w-4 accent-[#1d4ed8]"
								/>
								{opt.label}
							</label>
						{/each}
					</div>
				</div>

				<div class="mt-5">
					<p class="admin-label mb-2">Type</p>
					<div class="space-y-1.5">
						{#each TYPE_OPTIONS as opt}
							<label class="flex items-center gap-2 text-sm font-semibold text-text-main">
								<input
									type="checkbox"
									checked={typeFilter.includes(opt)}
									onchange={() => toggleTypeFilter(opt)}
									class="h-4 w-4 accent-[#1d4ed8]"
								/>
								{opt}
							</label>
						{/each}
					</div>
				</div>

				<div class="mt-5">
					<label for="event-sort" class="admin-label">Sort by</label>
					<select id="event-sort" bind:value={sortBy} class="glass-input">
						<option value="date-desc">Date (newest first)</option>
						<option value="date-asc">Date (oldest first)</option>
						<option value="name-asc">Name (A–Z)</option>
						<option value="name-desc">Name (Z–A)</option>
						<option value="volunteers-needed">Volunteers needed</option>
					</select>
				</div>

				{#if hasActiveFilters}
					<button type="button" class="btn-secondary mt-5 w-full text-xs" onclick={resetFilters}>Clear filters</button>
				{/if}
			</div>
		</aside>

		<div class="min-w-0 flex-1">
			<p class="mb-3 text-xs font-bold text-text-muted">
				{filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'}
			</p>

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{#each filteredEvents as event (event.id)}
			<div class="glass-panel relative overflow-hidden">
				<div class="flex items-center justify-between gap-2 border-b-2 border-black px-5 py-3 pr-24 {TYPE_STYLES[typeKey(event.type)] ?? 'bg-slate-200'}">
					<span class="role-badge border-2 border-black bg-white text-text-main">
						{event.type || 'Scrimmage'}
					</span>
					<span class="rounded-md border border-black/10 bg-white/90 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-text-main">{dateSlug(event.date_time)}</span>
				</div>

				<div class="absolute right-3 top-3 z-10 flex items-center gap-2">
					{#if robolystEventUrl(event.date_time, event.slug)}
						<a
							href={robolystEventUrl(event.date_time, event.slug)}
							target="_blank"
							rel="noreferrer"
							aria-label="View on Robolyst"
							title="View on Robolyst"
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-y-0"
						>
							<Radar class="h-3.5 w-3.5 text-text-main" strokeWidth={2.5} />
						</a>
					{/if}
					<a
						href="/events/{event.slug || event.id}"
						target="_blank"
						rel="noreferrer"
						aria-label="View on frontend"
						title="View on frontend"
						class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-y-0"
					>
						<ExternalLink class="h-3.5 w-3.5 text-text-main" strokeWidth={2.5} />
					</a>
				</div>

				<div class="p-5">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<h3 class="truncate font-semibold text-text-main">{event.name}</h3>
							<p class="truncate text-sm text-text-muted">{event.location}</p>
							<p class="mt-1 text-xs text-text-muted">
								{event.date_time ? new Date(event.date_time).toLocaleString() : 'No date set'}
							</p>
						</div>
						<div class="flex shrink-0 flex-col items-end gap-2">
							{#if event.event_pdf}
								<a
									href={pb.files.getUrl(event, event.event_pdf)}
									target="_blank"
									rel="noreferrer"
									class="btn-secondary px-3 py-2 text-xs"
								>
									PDF
								</a>
							{/if}
							{#if event.imgLink}
								<a href={event.imgLink} target="_blank" rel="noreferrer" class="btn-secondary px-3 py-2 text-xs">
									Photos
								</a>
							{/if}
						</div>
					</div>

					<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
						<span class="role-badge event_manager">{event.volunteersNeeded ?? 0} volunteers needed</span>
						<span class="role-badge photographer">{event.pics?.length ?? 0} photos</span>
					</div>

					{#if event.pics?.length}
						<div class="mt-3 flex flex-wrap items-center gap-2">
							{#each event.pics.slice(0, PHOTO_PREVIEW_LIMIT) as pic}
								<img src={pb.files.getUrl(event, pic, { thumb: '100x100' })} alt="" width="100" height="100" class="h-16 w-16 rounded-lg object-cover" loading="lazy" decoding="async" />
							{/each}
							{#if event.pics.length > PHOTO_PREVIEW_LIMIT}
								<span class="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-black/20 text-xs font-black text-text-muted">
									+{event.pics.length - PHOTO_PREVIEW_LIMIT}
								</span>
							{/if}
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
							<div class="flex flex-col gap-2">
								<div class="flex items-center gap-2">
									<input
										type="file"
										accept="image/*"
										multiple
										class="glass-input text-xs"
										onchange={(e) => (uploadFiles = e.currentTarget.files)}
									/>
									<button
										type="button"
										disabled={busy || !uploadFiles?.length}
										class="btn-primary px-3 py-1.5 text-xs shrink-0"
										onclick={() => uploadPhotos(event.id)}
									>
										{#if busy}
											{uploadProgress?.done}/{uploadProgress?.total}…
										{:else if uploadError}
											Resume ({uploadProgress?.done}/{uploadProgress?.total})
										{:else}
											Upload
										{/if}
									</button>
									<button type="button" class="btn-secondary px-3 py-1.5 text-xs shrink-0" onclick={cancelUpload}>Cancel</button>
								</div>
								{#if uploadError}
									<p class="text-xs font-semibold text-rose-600">{uploadError}</p>
								{/if}
							</div>
						{:else}
							<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => startUpload(event.id)}>
								Add photos
							</button>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<p class="text-sm text-text-muted">
				{data.events.length === 0 ? 'No events yet.' : 'No events match your filters.'}
			</p>
		{/each}
			</div>
		</div>
	</div>
</div>

{#if canManage}
	<Sheet open={showCreate} onClose={() => (showCreate = false)} title="New event">
		{@render createEventForm()}
	</Sheet>

	<Modal open={!!editingEvent} onClose={() => (editingId = null)} title="Edit event">
		{#if editingEvent}
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
				<input type="hidden" name="id" value={editingEvent.id} />
				<div>
					<label for="edit-name" class="admin-label">Name</label>
					<input id="edit-name" name="name" required class="glass-input" value={editingEvent.name} />
				</div>
				<div>
					<label for="edit-type" class="admin-label">Event type</label>
					<select id="edit-type" name="type" class="glass-input" value={editingEvent.type || 'Scrimmage'}>
						{#each TYPE_OPTIONS as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="edit-location" class="admin-label">Location</label>
					<input id="edit-location" name="location" class="glass-input" value={editingEvent.location} />
				</div>
				<div>
					<label for="edit-date" class="admin-label">Date &amp; time</label>
					<input id="edit-date" name="date_time" type="datetime-local" class="glass-input" value={toLocalInput(editingEvent.date_time)} />
				</div>
				<div>
					<label for="edit-needed" class="admin-label">Volunteers needed</label>
					<input id="edit-needed" name="volunteersNeeded" type="number" min="0" class="glass-input" value={editingEvent.volunteersNeeded} />
				</div>
				<div>
					<label for="edit-pdf" class="admin-label">Sponsorship / info PDF</label>
					<input id="edit-pdf" name="event_pdf" type="file" accept="application/pdf" class="glass-input" />
				</div>
				<div>
					<label for="edit-imglink" class="admin-label">Photo album link</label>
					<input id="edit-imglink" name="imgLink" type="url" class="glass-input" value={editingEvent.imgLink} />
				</div>
				<div>
					<label for="edit-code" class="admin-label">Event code (URL slug + Robolyst code)</label>
					<input id="edit-code" name="code" class="glass-input" value={editingEvent.slug} />
				</div>
				<div class="flex gap-2">
					<button type="submit" disabled={busy} class="btn-primary">Save</button>
					<button type="button" class="btn-secondary" onclick={() => (editingId = null)}>Cancel</button>
				</div>
			</form>
		{/if}
	</Modal>
{/if}
