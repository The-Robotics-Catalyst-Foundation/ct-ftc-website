<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let replyingId = $state<string | null>(null);
	let busy = $state(false);

	const CATEGORY_LABELS: Record<string, string> = {
		general: 'General Inquiry',
		team: 'Team Support',
		volunteer: 'Volunteering',
		sponsorship: 'Sponsorship'
	};

	const unrespondedCount = $derived(data.messages.filter((m) => !m.responded).length);

	function formatDate(value: string): string {
		if (!value) return '';
		return new Date(value).toLocaleString('en-US', {
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
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Messages</h1>
		<p class="mt-1 text-sm text-text-muted">
			{#if unrespondedCount > 0}
				<span class="font-black text-rose-600">{unrespondedCount} unread</span> &middot; {data.messages.length} total
			{:else}
				{data.messages.length} total &middot; all caught up
			{/if}
		</p>
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	<div class="space-y-3">
		{#each data.messages as msg (msg.id)}
			<div class="glass-panel p-5" style={msg.responded ? '' : 'border-color: #1d4ed8; background-color: #eff6ff;'}>
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div class="min-w-0">
						<div class="flex flex-wrap items-center gap-2">
							{#if !msg.responded}
								<span class="role-badge admin">New</span>
							{/if}
							<h3 class="font-semibold text-text-main">{msg.name}</h3>
							<span class="role-badge event_manager">{CATEGORY_LABELS[msg.category] ?? msg.category}</span>
						</div>
						<a href="mailto:{msg.email}" class="text-sm text-[#1d4ed8] hover:underline">{msg.email}</a>
						<p class="mt-1 text-xs text-text-muted">{formatDate(msg.created)}</p>
					</div>

					<form
						method="POST"
						action="?/setResponded"
						use:enhance
					>
						<input type="hidden" name="id" value={msg.id} />
						<input type="hidden" name="responded" value={msg.responded ? '0' : '1'} />
						<label class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-text-main">
							<input
								type="checkbox"
								checked={msg.responded}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
								class="h-4 w-4 accent-[#1d4ed8]"
							/>
							Responded
						</label>
					</form>
				</div>

				<p class="mt-3 whitespace-pre-wrap text-sm text-text-main">{msg.message}</p>

				<div class="mt-4">
					{#if replyingId === msg.id}
						<form
							method="POST"
							action="?/reply"
							use:enhance={() => {
								busy = true;
								return async ({ update }) => {
									await update();
									busy = false;
									replyingId = null;
								};
							}}
							class="space-y-2"
						>
							<input type="hidden" name="id" value={msg.id} />
							<input type="hidden" name="to" value={msg.email} />
							<textarea
								name="reply"
								rows="4"
								required
								disabled={busy}
								placeholder={`Reply to ${msg.name}…`}
								class="glass-input"
							></textarea>
							<div class="flex gap-2">
								<button type="submit" disabled={busy} class="btn-primary text-xs">
									{busy ? 'Sending…' : 'Send reply'}
								</button>
								<button type="button" class="btn-secondary text-xs" onclick={() => (replyingId = null)}>Cancel</button>
							</div>
						</form>
					{:else}
						<button type="button" class="btn-secondary px-3 py-1.5 text-xs" onclick={() => (replyingId = msg.id)}>
							Reply
						</button>
					{/if}
				</div>
			</div>
		{:else}
			<p class="text-sm text-text-muted">No messages yet.</p>
		{/each}
	</div>
</div>
