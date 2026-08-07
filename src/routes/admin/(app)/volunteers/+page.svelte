<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const canManage = $derived(data.role === 'admin' || data.role === 'event_manager');
	let busy = $state(false);
</script>

<div class="mx-auto max-w-5xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-text-main">Volunteers</h1>
			<p class="mt-1 text-sm text-text-muted">
				{data.totalSignups} total signup{data.totalSignups === 1 ? '' : 's'} across all events.
			</p>
		</div>
	</div>

	{#if form?.error}
		<div class="error-banner mb-5">{form.error}</div>
	{/if}

	<div class="space-y-5">
		{#each data.groups as group (group.event.id)}
			<div class="glass-panel p-5">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h3 class="font-semibold text-text-main">{group.event.name}</h3>
						<p class="text-xs text-text-muted">
							{group.event.date_time ? new Date(group.event.date_time).toLocaleString() : 'No date set'}
						</p>
					</div>
					<span class="role-badge event_manager shrink-0">{group.signups.length} signed up</span>
				</div>

				{#if group.signups.length}
					<ul class="mt-4 divide-y divide-slate-200/70">
						{#each group.signups as signup (signup.id)}
							<li class="flex items-center justify-between gap-3 py-2.5">
								<div class="min-w-0">
									<p class="truncate text-sm font-semibold text-text-main">{signup.name}</p>
									<p class="truncate text-xs text-text-muted">{signup.email}</p>
								</div>
								<div class="flex shrink-0 items-center gap-3">
									<span class="text-xs text-text-muted">
										{new Date(signup.created).toLocaleDateString()}
									</span>
									{#if canManage}
										<form
											method="POST"
											action="?/deleteSignup"
											use:enhance={({ cancel }) => {
												if (!confirm(`Remove ${signup.name || signup.email} from this event?`)) {
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
											<input type="hidden" name="id" value={signup.id} />
											<button type="submit" disabled={busy} class="btn-danger px-3 py-1.5 text-xs">
												Remove
											</button>
										</form>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-3 text-sm text-text-muted">No volunteers signed up yet.</p>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-text-muted">No events yet.</p>
		{/each}

		{#if data.orphaned.length}
			<div class="glass-panel p-5">
				<h3 class="font-semibold text-text-main">Unlinked signups</h3>
				<p class="text-xs text-text-muted">These reference an event that no longer exists.</p>
				<ul class="mt-3 divide-y divide-slate-200/70">
					{#each data.orphaned as signup (signup.id)}
						<li class="flex items-center justify-between gap-3 py-2.5">
							<div class="min-w-0">
								<p class="truncate text-sm font-semibold text-text-main">{signup.name}</p>
								<p class="truncate text-xs text-text-muted">{signup.email}</p>
							</div>
							{#if canManage}
								<form
									method="POST"
									action="?/deleteSignup"
									use:enhance={({ cancel }) => {
										if (!confirm('Remove this signup?')) {
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
									<input type="hidden" name="id" value={signup.id} />
									<button type="submit" disabled={busy} class="btn-danger px-3 py-1.5 text-xs">
										Remove
									</button>
								</form>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
