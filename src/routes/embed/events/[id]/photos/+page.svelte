<script lang="ts">
	import EmbedHeader from '$lib/components/embed-header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.name} - Photos | CT FTC</title>
</svelte:head>

<div class="p-4">
	{#if data.showNav}
		<EmbedHeader title={data.name} showName={data.showName} />
	{/if}

	{#if data.showBreadcrumb}
		<nav aria-label="Breadcrumb" class="mb-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-white px-2.5 py-1.5 text-[10px]">
			<a href="/" target="_blank" rel="noopener noreferrer" class="font-black uppercase tracking-wider text-slate-500 transition-colors hover:text-[#2563eb]">Home</a>
			<span class="font-mono font-black text-slate-400">/</span>
			<a href="/events" target="_blank" rel="noopener noreferrer" class="font-black uppercase tracking-wider text-slate-500 transition-colors hover:text-[#2563eb]">Events</a>
			<span class="font-mono font-black text-slate-400">/</span>
			<a href={data.eventPath} target="_blank" rel="noopener noreferrer" class="max-w-[8rem] truncate font-black uppercase tracking-wider text-slate-500 transition-colors hover:text-[#2563eb]">{data.name}</a>
			<span class="font-mono font-black text-slate-400">/</span>
			<span class="font-black uppercase tracking-wider text-[#2563eb]" aria-current="page">Photos</span>
		</nav>
	{/if}

	{#if data.pics.length}
		<div class="grid grid-cols-3 gap-2">
			{#each data.pics as pic}
				<a href={pic.full} target="_blank" rel="noopener noreferrer" class="block overflow-hidden rounded-lg border-2 border-slate-900">
					<img src={pic.thumb} alt="" width="400" height="400" class="aspect-square h-full w-full object-cover" loading="lazy" decoding="async" />
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-sm font-bold text-slate-500">No photos yet.</p>
	{/if}
</div>

{#if data.showFooter}
	<Footer />
{/if}
