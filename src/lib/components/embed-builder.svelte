<script lang="ts">
	import { page } from '$app/stores';
	import { Copy } from '@lucide/svelte';
	import EventCard from './event-card.svelte';

	let {
		id,
		slug,
		name,
		type,
		location,
		dateTime,
		description,
		volunteersNeeded
	}: {
		id: string;
		slug?: string;
		name: string;
		type?: string;
		location?: string;
		dateTime?: string;
		description?: string;
		volunteersNeeded?: number;
	} = $props();

	let mode = $state<'card' | 'photos'>('card');
	let showEventName = $state(true);
	let showPhotosNav = $state(true);
	let showPhotosName = $state(true);
	let showPhotosFooter = $state(false);
	let showPhotosBreadcrumb = $state(true);
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | null = null;

	const embedSrc = $derived(
		mode === 'card'
			? `${$page.url.origin}/embed/events/${slug || id}?name=${showEventName ? '1' : '0'}`
			: `${$page.url.origin}/embed/events/${slug || id}/photos?nav=${showPhotosNav ? '1' : '0'}&name=${showPhotosName ? '1' : '0'}&footer=${showPhotosFooter ? '1' : '0'}&breadcrumb=${showPhotosBreadcrumb ? '1' : '0'}`
	);

	const embedCode = $derived(
		mode === 'card'
			? `<iframe src="${embedSrc}" width="400" height="260" style="border:0;max-width:100%" loading="lazy" title="${name} - CT FTC"></iframe>`
			: `<iframe src="${embedSrc}" width="480" height="${showPhotosFooter ? 640 : 420}" style="border:0;max-width:100%" loading="lazy" title="${name} photos - CT FTC"></iframe>`
	);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(embedCode);
			copied = true;
			if (copyTimeout) clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => (copied = false), 1800);
		} catch {
			// Clipboard API unavailable - the code is still selectable in the textarea below.
		}
	}
</script>

<div class="space-y-4">
	<div class="flex gap-2">
		<button
			type="button"
			onclick={() => (mode = 'card')}
			class="flex-1 rounded-xl border-2 border-slate-900 px-3 py-2 text-xs font-black uppercase tracking-wide transition-all {mode === 'card' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}"
		>
			Event
		</button>
		<button
			type="button"
			onclick={() => (mode = 'photos')}
			class="flex-1 rounded-xl border-2 border-slate-900 px-3 py-2 text-xs font-black uppercase tracking-wide transition-all {mode === 'photos' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}"
		>
			Pictures
		</button>
	</div>

	{#if mode === 'card'}
		<label class="flex items-center gap-2.5 text-sm font-bold text-slate-700">
			<input type="checkbox" bind:checked={showEventName} class="h-4 w-4 accent-[#2563eb]" />
			Show event name on the embedded card
		</label>

		<div class="rounded-xl border-2 border-slate-900 bg-slate-50 p-3">
			<p class="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Preview</p>
			<div class="mx-auto max-w-xs">
				<EventCard
					{id}
					{slug}
					{name}
					{type}
					{location}
					{dateTime}
					{description}
					{volunteersNeeded}
					showName={showEventName}
					showActions={false}
				/>
			</div>
		</div>
	{:else}
		<div class="space-y-2">
			<label class="flex items-center gap-2.5 text-sm font-bold text-slate-700">
				<input type="checkbox" bind:checked={showPhotosNav} class="h-4 w-4 accent-[#2563eb]" />
				Show top navigation bar (logo + event name)
			</label>
			<label class="flex items-center gap-2.5 text-sm font-bold text-slate-700 {showPhotosNav ? '' : 'opacity-50'}">
				<input type="checkbox" bind:checked={showPhotosName} disabled={!showPhotosNav} class="h-4 w-4 accent-[#2563eb]" />
				Show event name text
			</label>
			<label class="flex items-center gap-2.5 text-sm font-bold text-slate-700">
				<input type="checkbox" bind:checked={showPhotosFooter} class="h-4 w-4 accent-[#2563eb]" />
				Show site footer
			</label>
			<label class="flex items-center gap-2.5 text-sm font-bold text-slate-700">
				<input type="checkbox" bind:checked={showPhotosBreadcrumb} class="h-4 w-4 accent-[#2563eb]" />
				Show breadcrumb trail
			</label>
		</div>

		<div class="rounded-xl border-2 border-slate-900 bg-slate-50 p-2">
			<p class="mb-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Live preview</p>
			<div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
				{#key embedSrc}
					<iframe src={embedSrc} title="Photo gallery preview" class="h-64 w-full" style="border:0"></iframe>
				{/key}
			</div>
		</div>
	{/if}

	<div>
		<p class="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Embed code</p>
		<textarea
			readonly
			rows="3"
			class="w-full rounded-xl border-2 border-slate-900 bg-slate-900 p-3 font-mono text-xs text-emerald-300"
			value={embedCode}
		></textarea>
	</div>

	<button
		type="button"
		onclick={copyCode}
		class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#2563eb] px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_0px_#0f172a] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#0f172a]"
	>
		<Copy class="h-4 w-4" strokeWidth={2.5} />
		{copied ? 'Copied!' : 'Copy embed code'}
	</button>
</div>
