<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-[#f8fafc]">
	<header class="border-b-2 border-black bg-white px-6 py-4">
		<a href="/" class="mx-auto flex max-w-5xl items-center gap-3 no-underline">
			<img src="/ctftc.png" alt="CT FIRST Tech Challenge" class="h-10 w-10 rounded-full border-2 border-black bg-white object-contain p-1" />
			<span class="text-lg font-black uppercase tracking-tight text-slate-900">{data.name}</span>
		</a>
	</header>

	<main class="px-6 py-12">
		<div class="mx-auto max-w-5xl">
			<nav aria-label="Breadcrumb" class="mb-6 inline-flex items-center gap-2.5 rounded-xl border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0px_0px_#000]">
				<a href="/" class="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors hover:text-[#2563eb]">Home</a>
				<span class="text-[10px] font-mono font-black text-slate-400">/</span>
				<a href="/events" class="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors hover:text-[#2563eb]">Events</a>
				<span class="text-[10px] font-mono font-black text-slate-400">/</span>
				<a href={data.eventPath} class="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors hover:text-[#2563eb]">{data.name}</a>
				<span class="text-[10px] font-mono font-black text-slate-400">/</span>
				<span class="max-w-[150px] truncate text-xs font-black uppercase tracking-wider text-[#2563eb] sm:max-w-xs" aria-current="page">Photos</span>
			</nav>

			{#if data.pics.length}
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each data.pics as pic}
						<a href={pic.full} target="_blank" rel="noopener noreferrer" class="block overflow-hidden rounded-xl border-2 border-slate-900">
							<img src={pic.thumb} alt="" width="400" height="400" class="aspect-square h-full w-full object-cover transition-transform hover:scale-105" loading="lazy" decoding="async" />
						</a>
					{/each}
				</div>
			{:else}
				<p class="text-lg font-bold text-slate-500">No photos have been uploaded for this event yet.</p>
			{/if}
		</div>
	</main>
</div>
