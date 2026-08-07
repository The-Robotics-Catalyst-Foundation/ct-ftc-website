<script lang="ts">
    import '../admin.css';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import Sheet from '$lib/components/sheet.svelte';
    import Modal from '$lib/components/modal.svelte';
    import type { LayoutData } from './$types';

    let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

    let mobileNavOpen = $state(false);
    let profileMenuOpen = $state(false);
    let settingsOpen = $state(false);
    let settingsBusy = $state(false);
    let settingsError = $state('');

    const navItems = $derived(
        [
            { href: '/admin/dashboard', label: 'Dashboard', roles: ['admin', 'event_manager', 'photographer'], badge: 0 },
            { href: '/admin/events', label: 'Events', roles: ['admin', 'event_manager', 'photographer'], badge: 0 },
            { href: '/admin/messages', label: 'Messages', roles: ['admin', 'event_manager'], badge: data.unrespondedCount },
            { href: '/admin/newsletter', label: 'Newsletter', roles: ['admin', 'event_manager'], badge: 0 },
            { href: '/admin/users', label: 'Users', roles: ['admin'], badge: 0 }
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
        mobileNavOpen = false;
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
    <header class="glass-panel m-4 flex items-center justify-between gap-4 px-5 py-3">
        <a href="/admin/dashboard" class="flex shrink-0 items-center gap-2">
            <img src="/ctftc.png" alt="CT FIRST Tech Challenge" class="h-12 w-18 rounded-full border-2 border-white  object-contain p-1 invert" />
            <span class="hidden text-sm font-black uppercase tracking-wide text-text-main sm:inline">CT FTC Admin</span>
        </a>

        <nav class="hidden items-center gap-2 md:flex">
            {@render navLinks()}
        </nav>

        <div class="relative hidden md:block">
            <button
                type="button"
                onclick={() => (profileMenuOpen = !profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                class="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-2 py-1.5 shadow-[3px_3px_0px_0px_#000] transition-all active:translate-y-[1px]"
            >
                {@render avatar('h-8 w-8')}
                <span class="max-w-[10rem] truncate text-xs font-black text-text-main">{data.name || data.email}</span>
            </button>

            {#if profileMenuOpen}
                <button
                    type="button"
                    class="fixed inset-0 z-40 cursor-default"
                    aria-label="Close menu"
                    onclick={() => (profileMenuOpen = false)}
                ></button>
                <div class="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_#000]">
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
                </div>
            {/if}
        </div>

        <button
            type="button"
            onclick={() => (mobileNavOpen = true)}
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            class="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] transition-all active:translate-y-[2px] md:hidden"
        >
            <span class="h-0.5 w-5 rounded-full bg-black"></span>
            <span class="h-0.5 w-5 rounded-full bg-black"></span>
            <span class="h-0.5 w-5 rounded-full bg-black"></span>
        </button>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
        {@render children()}
    </main>
</div>

<Sheet open={mobileNavOpen} onClose={() => (mobileNavOpen = false)} title="Menu">
    <div class="space-y-4">
        <div class="flex items-center gap-3">
            {@render avatar('h-11 w-11')}
            <div class="min-w-0">
                <p class="truncate text-sm font-black text-text-main">{data.name || data.email}</p>
                <span class="role-badge {data.role} mt-1">{roleLabel[data.role]}</span>
            </div>
        </div>

        <nav class="space-y-2">
            {@render navLinks(() => (mobileNavOpen = false))}
        </nav>

        <button type="button" class="btn-secondary w-full" onclick={openSettings}>Settings</button>

        <form method="POST" action="/admin/logout">
            <button type="submit" class="btn-secondary w-full">Sign out</button>
        </form>
    </div>
</Sheet>

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
        <button type="submit" disabled={settingsBusy} class="btn-primary w-full">
            {settingsBusy ? 'Saving…' : 'Save changes'}
        </button>
    </form>
</Modal>
