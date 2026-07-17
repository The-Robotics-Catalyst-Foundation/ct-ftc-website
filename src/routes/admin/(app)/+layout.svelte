<script lang="ts">
	import '../admin.css';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const navItems = $derived(
		[
			{ href: '/admin/events', label: 'Events', roles: ['admin', 'event_manager', 'photographer'] },
			{ href: '/admin/users', label: 'Users', roles: ['admin'] }
		].filter((item) => item.roles.includes(data.role))
	);

	const roleLabel: Record<string, string> = {
		admin: 'Admin',
		event_manager: 'Event Manager',
		photographer: 'Photographer'
	};
</script>

<div class="admin-shell aurora-field flex font-sans">
	<aside class="glass-panel m-4 flex w-64 shrink-0 flex-col justify-between rounded-3xl p-5">
		<div class="space-y-6">
			<div class="px-1">
				<p class="truncate text-sm font-semibold text-ink-900">{data.email}</p>
				<span class="role-badge {data.role} mt-2">{roleLabel[data.role]}</span>
			</div>

			<nav class="space-y-1">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {$page.url.pathname.startsWith(
							item.href
						)
							? 'bg-robotics-blue/10 font-semibold text-robotics-blue'
							: 'text-ink-600 hover:bg-white/60 hover:text-ink-900'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>

		<form method="POST" action="/admin/logout">
			<button type="submit" class="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50">
				Sign out
			</button>
		</form>
	</aside>

	<main class="flex-1 overflow-y-auto p-4">
		{@render children()}
	</main>
</div>
