<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const roleCopy: Record<string, string> = {
		admin: 'You can manage events and provision staff accounts.',
		event_manager: 'You can create, edit, and remove events.',
		photographer: 'You can upload photos to existing events.'
	};
</script>

<div class="mx-auto max-w-5xl">
	<h1 class="text-2xl font-bold tracking-tight text-text-main">Dashboard</h1>
	<p class="mt-1 text-sm text-text-muted">{roleCopy[data.role]}</p>

	<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div class="glass-panel p-6">
			<p class="admin-label">Upcoming events</p>
			<p class="mt-2 text-4xl font-bold text-text-main">{data.upcomingCount}</p>
		</div>
		<div class="glass-panel p-6">
			<p class="admin-label">Past events</p>
			<p class="mt-2 text-4xl font-bold text-text-main">{data.pastCount}</p>
		</div>
		<div class="glass-panel p-6">
			<p class="admin-label">Newsletter subscribers</p>
			<p class="mt-2 text-4xl font-bold text-text-main">{data.subscriberCount}</p>
		</div>
		<div class="glass-panel p-6">
			<p class="admin-label">Last newsletter sent</p>
			{#if data.lastSend}
				<p class="mt-2 text-2xl font-bold text-text-main">
					{new Date(data.lastSend.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
				</p>
				<p class="mt-1 text-sm text-text-muted">{data.lastSend.recipientCount} recipients &middot; {data.lastSend.openCount} opens</p>
			{:else}
				<p class="mt-2 text-2xl font-bold text-text-muted">Never</p>
			{/if}
		</div>
	</div>

	{#if data.sendCount > 0}
		<div class="glass-panel mt-4 p-6">
			<p class="admin-label">Newsletter performance (all-time)</p>
			<div class="mt-2 flex flex-wrap gap-8">
				<div>
					<p class="text-2xl font-bold text-text-main">{data.sendCount}</p>
					<p class="text-xs text-text-muted">broadcasts sent</p>
				</div>
				<div>
					<p class="text-2xl font-bold text-text-main">{data.totalOpens}</p>
					<p class="text-xs text-text-muted">total opens</p>
				</div>
				<div>
					<p class="text-2xl font-bold text-text-main">
						{data.totalRecipients > 0 ? Math.round((data.totalOpens / data.totalRecipients) * 100) : 0}%
					</p>
					<p class="text-xs text-text-muted">open rate</p>
				</div>
			</div>
		</div>
	{/if}

	<div class="glass-panel mt-4 p-6">
		<a href="/admin/events" class="btn-primary">Go to events</a>
	</div>
</div>
