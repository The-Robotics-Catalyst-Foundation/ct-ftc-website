<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let busy = $state(false);

	const categoryLabel: Record<string, string> = {
		general: 'General',
		team: 'Team support',
		volunteer: 'Volunteering',
		sponsorship: 'Sponsorship'
	};

	const categoryStyle: Record<string, string> = {
		general: 'background: rgba(100, 116, 139, 0.12); color: #475569;',
		team: 'background: rgba(37, 99, 235, 0.1); color: var(--color-robotics-blue);',
		volunteer: 'background: rgba(16, 185, 129, 0.1); color: #047857;',
		sponsorship: 'background: rgba(99, 102, 241, 0.1); color: #4338ca;'
	};

	function formatDate(value: string) {
		if (!value) return '';
		return new Date(value).toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight text-ink-900">Contact messages</h1>
		<p class="mt-1 text-sm text-ink-400">Everything submitted through the public contact form and event RSVPs.</p>
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	<div class="glass-panel divide-y divide-border-subtle p-2">
		{#each data.messages as msg (msg.id)}
			<div class="p-4" class:opacity-60={msg.responded}>
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<div class="flex flex-wrap items-center gap-2">
							<p class="truncate font-semibold text-ink-900">{msg.name || 'Anonymous'}</p>
							<span class="role-badge" style={categoryStyle[msg.category] ?? categoryStyle.general}>
								{categoryLabel[msg.category] ?? msg.category}
							</span>
							{#if msg.responded}
								<span class="role-badge" style="background: rgba(16, 185, 129, 0.1); color: #047857;">Responded</span>
							{/if}
						</div>
						<p class="truncate text-sm text-ink-400">
							<a href="mailto:{msg.email}" class="hover:underline">{msg.email}</a>
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<span class="text-xs text-ink-400 whitespace-nowrap">{formatDate(msg.created)}</span>
						<form
							method="POST"
							action="?/toggleResponded"
							use:enhance={() => {
								busy = true;
								return async ({ update }) => {
									await update();
									busy = false;
								};
							}}
						>
							<input type="hidden" name="id" value={msg.id} />
							<input type="hidden" name="responded" value={msg.responded ? '1' : '0'} />
							<button type="submit" disabled={busy} class="btn-secondary px-3 py-1.5 text-xs">
								{msg.responded ? 'Mark unresponded' : 'Mark responded'}
							</button>
						</form>
					</div>
				</div>
				<p class="mt-2 whitespace-pre-wrap text-sm text-ink-600">{msg.message}</p>
			</div>
		{:else}
			<p class="p-4 text-sm text-ink-400">No messages yet.</p>
		{/each}
	</div>
</div>
