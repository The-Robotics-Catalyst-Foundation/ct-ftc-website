<script lang="ts">
	import '../admin.css';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const navItems = $derived(
		[
			{ href: '/admin/dashboard', label: 'Dashboard', roles: ['admin', 'event_manager', 'photographer'] },
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

<<<<<<< HEAD
<<<<<<< HEAD
{#snippet sidebarContent(onNavigate?: (e: MouseEvent) => void)}
	<div class="space-y-6">
		<div class="flex items-center gap-3 px-1">
			<div class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-glass-border bg-base-mist">
				{#if avatarUrl}
					<img src={avatarUrl} alt="" class="h-full w-full object-cover" />
				{:else}
					<span
						class="flex h-full w-full items-center justify-center text-sm font-semibold text-robotics-blue"
						style="background: rgba(29, 78, 216, 0.1);"
=======
<div class="admin-shell flex font-sans">
	<aside class="glass-panel m-4 flex w-64 shrink-0 flex-col justify-between rounded-3xl p-5">
		<div class="space-y-6">
			<div class="px-1">
				<p class="truncate text-sm font-semibold text-text-main">{data.email}</p>
				<span class="role-badge {data.role} mt-2">{roleLabel[data.role]}</span>
			</div>

			<nav class="space-y-1">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {$page.url.pathname.startsWith(
							item.href
						)
							? 'bg-ftc-blue/10 font-semibold text-ftc-blue'
							: 'text-text-muted hover:bg-white/60 hover:text-text-main'}"
>>>>>>> parent of b02fc9f (Merge pull request #4 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
					>
						{initial}
					</span>
				{/if}
			</div>
			<div class="min-w-0">
				<p class="truncate text-sm font-semibold text-ink-900">{data.name || data.email}</p>
				<span class="role-badge {data.role} mt-1">{roleLabel[data.role]}</span>
			</div>
		</div>

		<nav class="space-y-1.5">
			{#each navItems as item (item.href)}
				<a
					href={item.href}
					onclick={onNavigate}
					class="block rounded-full px-4 py-2.5 text-sm font-medium transition-colors {$page.url.pathname.startsWith(
						item.href
					)
						? 'bg-robotics-blue text-white shadow-ambient'
						: 'text-ink-600 hover:bg-white/60 hover:text-ink-900'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</div>

	<form method="POST" action="/admin/logout">
		<button type="submit" class="w-full rounded-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50">
			Sign out
		</button>
	</form>
{/snippet}

=======
>>>>>>> parent of 14b64b2 (Merge pull request #5 from The-Robotics-Catalyst-Foundation/liquid-glass-bento)
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
