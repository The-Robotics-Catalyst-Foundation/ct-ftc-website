<script lang="ts">
    import '../admin.css';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
    import { CalendarDays, MessageSquare, Mail, Users, Handshake, Bell, BellOff, Plus } from '@lucide/svelte';
    import Modal from '$lib/components/modal.svelte';
    import { subscribeToPush, syncPushSubscription, unsubscribeFromPush } from '$lib/client/push';
    import { adminCreateAction } from '$lib/client/adminCreate';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

    let scrolled = $state(false);

    onMount(() => {
        const onScroll = () => {
            scrolled = window.scrollY > 0;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    });

    let profileMenuOpen = $state(false);
    let settingsOpen = $state(false);
    let settingsBusy = $state(false);
    let settingsError = $state('');
    let deleteBusy = $state(false);
    // Notification.permission alone isn't enough to know if push is "on" -
    // it stays "granted" forever once the browser allows it, even after the
    // user turns notifications off here (browsers don't let a page revoke
    // its own permission). Actual on/off state is confirmed by checking for
    // a live subscription in the onMount below.
    let pushState = $state<'granted' | 'denied' | 'unsupported' | 'error' | 'idle'>(
        typeof Notification !== 'undefined' && Notification.permission === 'denied' ? 'denied' : 'idle'
    );
    let pushBusy = $state(false);

    onMount(() => {
        if (data.role !== 'admin') return;
        syncPushSubscription().then((active) => {
            if (active) pushState = 'granted';
        });
    });

    async function enablePush() {
        pushBusy = true;
        pushState = await subscribeToPush(PUBLIC_VAPID_PUBLIC_KEY);
        pushBusy = false;
    }

    async function disablePush() {
        pushBusy = true;
        await unsubscribeFromPush();
        pushState = 'idle';
        pushBusy = false;
    }

    const navItems = $derived(
        [
            { href: '/admin/events', label: 'Events', icon: CalendarDays, roles: ['admin', 'event_manager', 'photographer'], badge: 0 },
            { href: '/admin/messages', label: 'Messages', icon: MessageSquare, roles: ['admin', 'event_manager'], badge: data.unrespondedCount },
            { href: '/admin/newsletter', label: 'Newsletter', icon: Mail, roles: ['admin', 'event_manager'], badge: 0 },
            { href: '/admin/sponsors', label: 'Sponsors', icon: Handshake, roles: ['admin'], badge: 0 },
            { href: '/admin/users', label: 'Users', icon: Users, roles: ['admin'], badge: 0 }
        ].filter((item) => item.roles.includes(data.role))
    );

    const roleLabel: Record<string, string> = {
        admin: 'Admin',
        event_manager: 'Event Manager',
        photographer: 'Photographer'
    };

    const avatarUrl = $derived(data.avatarUrl);
    const initial = $derived((data.name || data.email || 'A').charAt(0).toUpperCase());

    function openSettings() {
        settingsError = '';
        settingsOpen = true;
        profileMenuOpen = false;
    }
</script>

{#snippet avatar(size: string)}
    <div class="{size} shrink-0 overflow-hidden rounded-full border-2 border-black bg-[#eef2f7]">
        {#if avatarUrl}
            <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
        {:else}
            <span class="flex h-full w-full items-center justify-center text-sm font-black text-[#1d4ed8]">
                {initial}
            </span>
        {/if}
    </div>
{/snippet}

{#snippet profileMenuItems()}
    <p class="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
        {roleLabel[data.role]}
    </p>
    <button
        type="button"
        class="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-text-main transition-colors hover:bg-bg-surface"
        onclick={openSettings}
    >
        Settings
    </button>
    <form method="POST" action="/admin/logout">
        <button type="submit" class="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50">
            Logout
        </button>
    </form>
{/snippet}

{#snippet navLinks(onNavigate?: (e: MouseEvent) => void)}
    {#each navItems as item (item.href)}
        <a
            href={item.href}
            onclick={onNavigate}
            class="flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-black uppercase tracking-wide transition-all {$page.url.pathname.startsWith(
                item.href
            )
                ? 'border-black bg-[#2563eb] text-white shadow-[4px_4px_0px_0px_#000]'
                : 'border-transparent text-text-muted hover:border-black hover:bg-white hover:text-text-main'}"
        >
            {item.label}
            {#if item.badge > 0}
                <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white">
                    {item.badge}
                </span>
            {/if}
        </a>
    {/each}
{/snippet}

<div class="admin-shell flex min-h-screen flex-col font-sans">
    <header
        class="glass-panel sticky top-0 z-30 mx-4 mb-4 flex items-center justify-between gap-4 px-5 py-3 transition-[margin-top] duration-200 ease-out md:static md:mt-4"
        class:mt-4={!scrolled}
        class:mt-0={scrolled}
    >
        <a href="/admin/events" class="flex shrink-0 items-center gap-2">
            <img src="/ctftc.png" alt="CT FIRST Tech Challenge" width="400" height="272" class="h-12 w-18 rounded-full border-2 border-white  object-contain p-1 invert" />
            <span class="hidden text-sm font-black uppercase tracking-wide text-text-main sm:inline">CT FTC Admin</span>
        </a>

        <nav class="hidden items-center gap-2 md:flex">
            {@render navLinks()}
        </nav>

        {#if $adminCreateAction}
            <button
                type="button"
                onclick={() => $adminCreateAction?.run()}
                aria-label={$adminCreateAction.label}
                title={$adminCreateAction.label}
                class="dock-tap flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#2563eb] text-white shadow-[3px_3px_0px_0px_#000] transition-all active:translate-y-[1px] md:hidden"
            >
                <Plus class="h-5 w-5" strokeWidth={3} />
            </button>
        {/if}

        <div class="relative hidden md:block">
            <button
                type="button"
                onclick={() => (profileMenuOpen = !profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                aria-label="Account menu"
                class="dock-tap flex items-center gap-2 rounded-xl border-2 border-black bg-white px-2 py-1.5 shadow-[3px_3px_0px_0px_#000] transition-all active:translate-y-[1px]"
            >
                {@render avatar('h-8 w-8')}
                <span class="hidden max-w-[10rem] truncate text-xs font-black text-text-main sm:inline">{data.name || data.email}</span>
            </button>

            {#if profileMenuOpen}
                <button
                    type="button"
                    class="fixed inset-0 z-40 cursor-default"
                    aria-label="Close menu"
                    onclick={() => (profileMenuOpen = false)}
                ></button>
                <div class="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_#000]">
                    {@render profileMenuItems()}
                </div>
            {/if}
        </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
        {@render children()}
    </main>

    <nav class="admin-dock" aria-label="Primary">
        {#each navItems as item (item.href)}
            {@const Icon = item.icon}
            {@const active = $page.url.pathname.startsWith(item.href)}
            <a href={item.href} class="admin-dock-item dock-tap" aria-current={active ? 'page' : undefined}>
                <span class="admin-dock-icon" class:active>
                    <Icon class="h-5 w-5" strokeWidth={2.5} />
                    {#if item.badge > 0}
                        <span class="admin-dock-badge">{item.badge}</span>
                    {/if}
                </span>
                <span class="admin-dock-label" class:active>{item.label}</span>
            </a>
        {/each}

        <div class="admin-dock-item relative">
            <button
                type="button"
                onclick={() => (profileMenuOpen = !profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                aria-label="Account menu"
                class="dock-tap flex w-full flex-col items-center gap-0.5"
            >
                {@render avatar('h-6 w-6')}
                <span class="admin-dock-label">Account</span>
            </button>

            {#if profileMenuOpen}
                <button
                    type="button"
                    class="fixed inset-0 z-40 cursor-default"
                    aria-label="Close menu"
                    onclick={() => (profileMenuOpen = false)}
                ></button>
                <div class="absolute bottom-full right-0 z-50 mb-3 w-52 rounded-xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_#000]">
                    {@render profileMenuItems()}
                </div>
            {/if}
        </div>
    </nav>
</div>

<Modal open={settingsOpen} onClose={() => (settingsOpen = false)} title="Account settings">
    {#if settingsError}
        <div class="error-banner mb-4">{settingsError}</div>
    {/if}
    <form
        method="POST"
        action="/admin/settings?/updateProfile"
        enctype="multipart/form-data"
        use:enhance={() => {
            settingsBusy = true;
            settingsError = '';
            return async ({ result, update }) => {
                settingsBusy = false;
                if (result.type === 'failure') {
                    settingsError = (result.data?.error as string) ?? 'Failed to update profile.';
                } else if (result.type === 'success') {
                    settingsOpen = false;
                }
                await update();
            };
        }}
        class="space-y-4"
    >
        <div class="flex items-center gap-3">
            {@render avatar('h-14 w-14')}
            <div>
                <label for="avatar" class="admin-label">Profile picture</label>
                <input id="avatar" name="avatar" type="file" accept="image/*" class="glass-input" />
            </div>
        </div>
        <div>
            <label for="name" class="admin-label">Name</label>
            <input id="name" name="name" class="glass-input" value={data.name ?? ''} />
        </div>
        <label class="flex items-center justify-between gap-3 rounded-lg border-2 border-border-subtle p-3">
            <span>
                <span class="block text-sm font-bold text-text-main">Show my email publicly</span>
                <span class="block text-xs text-text-muted">Turn off to hide your email address from public listings.</span>
            </span>
            <input type="checkbox" name="emailVisibility" checked={data.emailVisibility} class="h-5 w-5 shrink-0 accent-[#1d4ed8]" />
        </label>
        <button type="submit" disabled={settingsBusy} class="btn-primary w-full">
            {settingsBusy ? 'Saving…' : 'Save changes'}
        </button>
    </form>

    {#if data.role === 'admin'}
        <div class="mt-5 border-t-2 border-border-subtle pt-4">
            <p class="admin-label mb-2">Notifications</p>
            {#if pushState === 'granted'}
                <label class="flex items-center justify-between gap-3 rounded-lg border-2 border-border-subtle p-3">
                    <span class="flex items-center gap-2 text-sm font-bold text-text-main">
                        <Bell class="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} />
                        Push notifications are on for new contact messages.
                    </span>
                    <input
                        type="checkbox"
                        checked
                        disabled={pushBusy}
                        onchange={disablePush}
                        class="h-5 w-5 shrink-0 accent-[#1d4ed8]"
                        aria-label="Turn off push notifications"
                    />
                </label>
            {:else if pushState === 'denied'}
                <p class="flex items-center gap-2 text-sm font-bold text-rose-600">
                    <BellOff class="h-4 w-4" strokeWidth={2.5} />
                    Blocked in browser settings - enable notifications for this site to turn it back on.
                </p>
            {:else if pushState === 'unsupported'}
                <p class="text-sm font-semibold text-text-muted">Push notifications aren't supported in this browser.</p>
            {:else if pushState === 'error'}
                <div class="space-y-2">
                    <p class="flex items-center gap-2 text-sm font-bold text-rose-600">
                        <BellOff class="h-4 w-4" strokeWidth={2.5} />
                        Couldn't save your subscription - try again.
                    </p>
                    <button type="button" disabled={pushBusy} class="btn-secondary w-full" onclick={enablePush}>
                        <Bell class="h-4 w-4" strokeWidth={2.5} />
                        Retry
                    </button>
                </div>
            {:else}
                <button type="button" disabled={pushBusy} class="btn-secondary w-full" onclick={enablePush}>
                    <Bell class="h-4 w-4" strokeWidth={2.5} />
                    {pushBusy ? 'Enabling…' : 'Enable push notifications'}
                </button>
            {/if}
        </div>
    {/if}

    <div class="mt-5 border-t-2 border-border-subtle pt-4">
        <p class="admin-label mb-2 text-rose-600">Danger zone</p>
        <form
            method="POST"
            action="/admin/settings?/deleteAccount"
            use:enhance={({ cancel }) => {
                if (!confirm('Delete your account? This cannot be undone.')) {
                    cancel();
                    return;
                }
                deleteBusy = true;
                settingsError = '';
                return async ({ result, update }) => {
                    deleteBusy = false;
                    if (result.type === 'failure') {
                        settingsError = (result.data?.error as string) ?? 'Failed to delete account.';
                    }
                    await update();
                };
            }}
        >
            <button type="submit" disabled={deleteBusy} class="btn-danger w-full">
                {deleteBusy ? 'Deleting…' : 'Delete my account'}
            </button>
        </form>
    </div>
</Modal>
