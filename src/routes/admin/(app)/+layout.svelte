<script lang="ts">
	import '../admin.css';
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { fade, fly } from 'svelte/transition';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let isDrawerOpen = $state(false);

	function closeDrawer() {
		isDrawerOpen = false;
	}

	$effect(() => {
		document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
	});

	const navItems = $derived(
		[
			{ href: '/admin/events', label: 'Events', roles: ['admin', 'event_manager', 'photographer'] },
			{ href: '/admin/messages', label: 'Messages', roles: ['admin', 'event_manager'] },
			{ href: '/admin/users', label: 'Users', roles: ['admin'] }
		].filter((item) => item.roles.includes(data.role))
	);

	const roleLabel: Record<string, string> = {
		admin: 'Admin',
		event_manager: 'Event Manager',
		photographer: 'Photographer'
	};

	const avatarUrl = $derived(
		data.avatar ? pb.files.getUrl({ id: data.userId, collectionName: 'users' }, data.avatar, { thumb: '100x100' }) : null
	);

	const initial = $derived((data.name?.trim()?.[0] ?? data.email?.[0] ?? '?').toUpperCase());
</script>

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

<div class="admin-shell aurora-field flex font-sans">
	<div class="glass-panel fixed inset-x-3 top-3 z-[200] flex items-center justify-between rounded-full px-4 py-2 md:hidden">
		<span class="truncate text-sm font-semibold text-ink-900">{data.name || data.email}</span>
		<button
			onclick={() => (isDrawerOpen = true)}
			aria-label="Open navigation menu"
			aria-expanded={isDrawerOpen}
			class="w-9 h-9 shrink-0 rounded-full glass-tile flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
		>
			<div class="w-4 h-0.5 rounded-full bg-ink-900"></div>
			<div class="w-4 h-0.5 rounded-full bg-ink-900"></div>
			<div class="w-4 h-0.5 rounded-full bg-ink-900"></div>
		</button>
	</div>

	{#if isDrawerOpen}
		<div class="fixed inset-0 z-[250] md:hidden">
			<button
				aria-label="Close navigation menu"
				onclick={closeDrawer}
				transition:fade={{ duration: 200 }}
				class="absolute inset-0 w-full bg-ink-900/40 backdrop-blur-sm cursor-default"
			></button>

			<aside
				transition:fly={{ x: -280, duration: 300, opacity: 1 }}
				class="glass-panel absolute top-0 left-0 h-full w-72 max-w-[80%] flex flex-col justify-between rounded-r-[2rem] p-5 overflow-y-auto"
			>
				{@render sidebarContent(closeDrawer)}
			</aside>
		</div>
	{/if}

	<aside class="glass-panel m-4 hidden md:flex w-64 shrink-0 flex-col justify-between rounded-[2rem] p-5">
		{@render sidebarContent()}
	</aside>

	<main class="flex-1 overflow-y-auto p-4 pt-20 md:pt-4">
		{@render children()}
	</main>
</div>
