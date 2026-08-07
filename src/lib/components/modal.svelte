<script lang="ts">
	import { fade, scale } from 'svelte/transition';

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
		class="modal-backdrop"
		transition:fade={{ duration: 150 }}
		onclick={onClose}
		aria-label="Close"
	></button>
	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-label={title}
		transition:scale={{ start: 0.95, duration: 180 }}
	>
		<div class="modal-header">
			<h2 class="modal-title">{title}</h2>
			<button type="button" class="modal-close" onclick={onClose} aria-label="Close">&times;</button>
		</div>
		<div class="modal-body">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(15, 23, 42, 0.55);
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.modal-panel {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		width: min(92vw, 32rem);
		max-height: 88vh;
		overflow-y: auto;
		background: #fff;
		border: 3px solid #000;
		border-radius: 1.5rem;
		box-shadow: 8px 8px 0px 0px #000;
		padding: 1.5rem;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.modal-title {
		font-size: 1.1rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		color: #0f172a;
	}

	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		flex-shrink: 0;
		border: 2px solid #000;
		border-radius: 0.6rem;
		background: #fff;
		font-size: 1.25rem;
		font-weight: 800;
		line-height: 1;
		box-shadow: 3px 3px 0px 0px #000;
		transition: box-shadow 0.15s ease, transform 0.1s ease;
	}
	.modal-close:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px 0px #000;
	}
</style>
