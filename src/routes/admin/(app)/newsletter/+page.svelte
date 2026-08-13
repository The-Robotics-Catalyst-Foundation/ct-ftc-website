<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let message = $state(data.defaultTemplate);
	let selectedEventId = $state('');
	let selectedTemplate = $state(data.templates[0]?.id ?? 'simple');
	let busy = $state(false);
	let showSubscribers = $state(false);

	let previewHtml = $state('');
	let previewLoading = $state(false);
	let previewTimeout: ReturnType<typeof setTimeout> | null = null;

	let imageInput: HTMLInputElement | undefined = $state();
	let imageDataUrl = $state<string | null>(null);

	function handleImageChange() {
		const file = imageInput?.files?.[0];
		if (!file) {
			imageDataUrl = null;
			return;
		}
		const reader = new FileReader();
		reader.onload = () => (imageDataUrl = reader.result as string);
		reader.readAsDataURL(file);
	}

	function removeImage() {
		if (imageInput) imageInput.value = '';
		imageDataUrl = null;
	}

	function formatDate(value: string) {
		if (!value) return 'TBD';
		return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Replaces the old hardcoded "2 weeks away" copy with the actual gap
	// between today and the event date, so the prefilled message stays
	// accurate no matter how far out the event is or how late this gets sent.
	function formatTimeUntil(value: string): string {
		if (!value) return 'coming up';
		const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
		if (days <= 0) return 'today';
		if (days === 1) return '1 day';
		if (days < 14) return `${days} days`;
		const weeks = Math.round(days / 7);
		return `${weeks} week${weeks === 1 ? '' : 's'}`;
	}

	function applyEvent() {
		const event = data.events.find((e) => e.id === selectedEventId);
		if (!event) {
			message = data.defaultTemplate;
			return;
		}
		const eventLink = `${data.origin}/events/${event.slug || event.id}`;
		message = data.defaultTemplate
			.replace('{Event Name}', event.name)
			.replace('{Location}', event.location || 'Location TBD')
			.replace('{Date}', formatDate(event.date_time))
			.replace('{Time Until}', formatTimeUntil(event.date_time))
			.replace('{Event Link}', eventLink);
	}

	async function refreshPreview() {
		previewLoading = true;
		try {
			const res = await fetch('/admin/newsletter/preview', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message, template: selectedTemplate, eventId: selectedEventId, imageDataUrl })
			});
			if (res.ok) {
				const payload = await res.json();
				previewHtml = payload.html;
			}
		} finally {
			previewLoading = false;
		}
	}

	function schedulePreview() {
		if (previewTimeout) clearTimeout(previewTimeout);
		previewTimeout = setTimeout(refreshPreview, 350);
	}

	$effect(() => {
		// Re-render the preview whenever the message, template, or selected
		// event changes - reads them so the effect re-runs on each change.
		message;
		selectedTemplate;
		selectedEventId;
		imageDataUrl;
		schedulePreview();
	});
</script>

<div class="mx-auto max-w-6xl space-y-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Newsletter</h1>
		<p class="mt-1 text-sm text-text-muted">Broadcast an update to everyone subscribed for volunteer opportunities.</p>
	</div>

	<div class="glass-panel p-5">
		<div class="flex items-center justify-between gap-4">
			<div>
				<p class="admin-label">Subscribers</p>
				<p class="text-3xl font-black text-text-main">{data.subscriberCount}</p>
			</div>
			<div class="flex items-center gap-2">
				<span class="role-badge event_manager">volunteer_newsletter</span>
				{#if data.subscriberCount}
					<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => (showSubscribers = !showSubscribers)}>
						{showSubscribers ? 'Hide list' : 'Show list'}
					</button>
				{/if}
			</div>
		</div>

		{#if showSubscribers && data.subscribers.length}
			<div class="mt-4 max-h-64 overflow-x-auto overflow-y-auto rounded-lg border border-black/10">
				<table class="w-full text-left text-sm">
					<thead class="sticky top-0 bg-white/90 backdrop-blur">
						<tr class="text-xs font-black uppercase tracking-wide text-text-muted">
							<th class="px-3 py-2">Email</th>
							<th class="px-3 py-2">Subscribed</th>
						</tr>
					</thead>
					<tbody>
						{#each data.subscribers as subscriber (subscriber.id)}
							<tr class="border-t border-black/5">
								<td class="px-3 py-2 font-semibold text-text-main">{subscriber.email}</td>
								<td class="px-3 py-2 text-text-muted">
									{subscriber.created ? new Date(subscriber.created).toLocaleDateString() : '—'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	{#if form?.error}
		<div class="error-banner">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="success-banner">Broadcast sent to {form.sentCount} subscriber{form.sentCount === 1 ? '' : 's'}.</div>
	{/if}

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="glass-panel space-y-4 p-6">
			<div>
				<label for="event" class="admin-label">Fill in from an upcoming event</label>
				<select id="event" bind:value={selectedEventId} onchange={applyEvent} class="glass-input">
					<option value="">Choose an event…</option>
					{#each data.events as event (event.id)}
						<option value={event.id}>{event.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<p class="admin-label mb-2">Email design</p>
				<div class="space-y-2">
					{#each data.templates as template (template.id)}
						<label
							class="flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors {selectedTemplate === template.id
								? 'border-[#1d4ed8] bg-[#eff6ff]'
								: 'border-black/10 hover:bg-black/[0.02]'}"
						>
							<input type="radio" name="template-choice" value={template.id} bind:group={selectedTemplate} class="mt-1 h-4 w-4 accent-[#1d4ed8]" />
							<span>
								<span class="block text-sm font-bold text-text-main">{template.name}</span>
								<span class="block text-xs text-text-muted">{template.description}</span>
							</span>
						</label>
					{/each}
				</div>
			</div>

			<form
				method="POST"
				action="?/send"
				enctype="multipart/form-data"
				use:enhance={() => {
					busy = true;
					return async ({ update }) => {
						await update();
						busy = false;
					};
				}}
				class="space-y-3"
			>
				<input type="hidden" name="template" value={selectedTemplate} />
				<input type="hidden" name="eventId" value={selectedEventId} />
				<div>
					<label for="message" class="admin-label">Message</label>
					<textarea id="message" name="message" rows="6" class="glass-input" bind:value={message}></textarea>
				</div>
				<div>
					<label for="image" class="admin-label">Banner image (optional)</label>
					<input
						id="image"
						name="image"
						type="file"
						accept="image/*"
						bind:this={imageInput}
						onchange={handleImageChange}
						class="glass-input"
					/>
					{#if imageDataUrl}
						<div class="mt-2 flex items-center gap-3">
							<img src={imageDataUrl} alt="" class="h-16 w-28 rounded-lg border-2 border-black/10 object-cover" />
							<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={removeImage}>
								Remove
							</button>
						</div>
					{/if}
				</div>
				<button type="submit" disabled={busy || !data.subscriberCount} class="btn-primary">
					{busy ? 'Sending…' : `Send to ${data.subscriberCount} subscriber${data.subscriberCount === 1 ? '' : 's'}`}
				</button>
			</form>
		</div>

		<div class="glass-panel flex flex-col p-6">
			<div class="mb-3 flex items-center justify-between">
				<p class="admin-label">Live preview</p>
				{#if previewLoading}
					<span class="text-xs font-semibold text-text-muted">Updating…</span>
				{/if}
			</div>
			<div class="flex-1 overflow-hidden rounded-xl border-2 border-black/10 bg-[#eef2f7]">
				<iframe title="Email preview" srcdoc={previewHtml} class="h-[560px] w-full border-0"></iframe>
			</div>
		</div>
	</div>
</div>
