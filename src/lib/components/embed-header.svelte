<script lang="ts">
	let {
		title = 'CT FIRST Tech Challenge',
		showName = true
	}: {
		title?: string;
		showName?: boolean;
	} = $props();
</script>

<a
	href="/"
	target="_blank"
	rel="noopener noreferrer"
	class="mb-3 inline-flex items-center gap-2 no-underline"
>
	<img src="/ctftc.png" alt="CT FIRST Tech Challenge" width="400" height="272" class="h-7 w-7 rounded-full border-2 border-white object-contain p-1 invert" />
	{#if showName}
		<span class="text-xs font-black uppercase tracking-wide text-slate-900">{title}</span>
	{/if}
</a>
