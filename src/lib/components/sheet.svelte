<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let {
		open = false,
		onClose,
		title = '',
		children
	}: {
		open?: boolean;
		onClose: () => void;
		title?: string;
		children: import('svelte').Snippet;
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<button
		type="button"
		class="sheet-backdrop"
		transition:fade={{ duration: 150 }}
		onclick={onClose}
		aria-label="Close"
	></button>
	<div class="sheet-panel" role="dialog" aria-modal="true" aria-label={title} transition:fly={{ y: 400, duration: 250 }}>
		<div class="sheet-handle"></div>
		<div class="sheet-header">
			<h2 class="sheet-title">{title}</h2>
			<button type="button" class="sheet-close" onclick={onClose} aria-label="Close">&times;</button>
		</div>
		<div class="sheet-body">
			{@render children()}
		</div>
	</div>
{/if}
