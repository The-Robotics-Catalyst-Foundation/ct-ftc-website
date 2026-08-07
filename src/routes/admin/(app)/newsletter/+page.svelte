<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let message = $state(data.defaultTemplate);
	let selectedEventId = $state('');
	let busy = $state(false);

	function formatDate(value: string) {
		if (!value) return 'TBD';
		return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function applyEvent() {
		const event = data.events.find((e) => e.id === selectedEventId);
		if (!event) return;
		const eventLink = `${data.origin}/events/${event.slug || event.id}`;
		message = data.defaultTemplate
			.replace('{Event Name}', event.name)
			.replace('{Location}', event.location || 'Location TBD')
			.replace('{Date}', formatDate(event.date_time))
			.replace('{Event Link}', eventLink);
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Newsletter</h1>
		<p class="mt-1 text-sm text-text-muted">Broadcast an update to everyone subscribed for volunteer opportunities.</p>
	</div>

	<div class="glass-panel p-5 flex items-center justify-between">
		<div>
			<p class="admin-label">Subscribers</p>
			<p class="text-3xl font-black text-text-main">{data.subscriberCount}</p>
		</div>
		<span class="role-badge event_manager">volunteer_newsletter</span>
	</div>

	{#if form?.error}
		<div class="error-banner">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="success-banner">Broadcast sent to {form.sentCount} subscriber{form.sentCount === 1 ? '' : 's'}.</div>
	{/if}

	<div class="glass-panel p-6 space-y-4">
		<div>
			<label for="event" class="admin-label">Fill in from an upcoming event</label>
			<div class="flex gap-2">
				<select id="event" bind:value={selectedEventId} class="glass-input">
					<option value="">Choose an event…</option>
					{#each data.events as event (event.id)}
						<option value={event.id}>{event.name}</option>
					{/each}
				</select>
				<button type="button" class="btn-secondary shrink-0" onclick={applyEvent} disabled={!selectedEventId}>
					Fill in
				</button>
			</div>
		</div>

		<form
			method="POST"
			action="?/send"
			use:enhance={() => {
				busy = true;
				return async ({ update }) => {
					await update();
					busy = false;
				};
			}}
			class="space-y-3"
		>
			<div>
				<label for="message" class="admin-label">Message</label>
				<textarea id="message" name="message" rows="5" class="glass-input" bind:value={message}></textarea>
			</div>
			<button type="submit" disabled={busy || !data.subscriberCount} class="btn-primary">
				{busy ? 'Sending…' : `Send to ${data.subscriberCount} subscriber${data.subscriberCount === 1 ? '' : 's'}`}
			</button>
		</form>
	</div>
</div>
