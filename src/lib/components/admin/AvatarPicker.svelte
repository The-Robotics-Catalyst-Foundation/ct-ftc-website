<script lang="ts">
	/**
	 * Google Account-style avatar picker: circular preview, pencil badge,
	 * "Change photo" / "Remove" links. Submits as a normal file input inside
	 * whatever <form enctype="multipart/form-data"> wraps it, plus a hidden
	 * "{name}Remove" flag when the user clears the photo.
	 */
	let {
		name = 'avatar',
		previewUrl = null,
		fallbackText = '?',
		size = 88
	}: { name?: string; previewUrl?: string | null; fallbackText?: string; size?: number } = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let localPreview: string | null = $state(null);
	let removeRequested = $state(false);

	function pickFile() {
		fileInput?.click();
	}

	function onFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		removeRequested = false;
		if (localPreview) URL.revokeObjectURL(localPreview);
		localPreview = URL.createObjectURL(file);
	}

	function removePhoto() {
		removeRequested = true;
		if (localPreview) URL.revokeObjectURL(localPreview);
		localPreview = null;
		if (fileInput) fileInput.value = '';
	}

	const shownUrl = $derived(localPreview ?? (removeRequested ? null : previewUrl));
</script>

<div class="flex items-center gap-4">
	<div class="relative shrink-0" style="width: {size}px; height: {size}px;">
		<button
			type="button"
			onclick={pickFile}
			aria-label="Change photo"
			class="group block h-full w-full overflow-hidden rounded-full border border-border-subtle bg-bg-surface"
		>
			{#if shownUrl}
				<img src={shownUrl} alt="" class="h-full w-full object-cover" />
			{:else}
				<span
					class="flex h-full w-full items-center justify-center text-2xl font-semibold text-ftc-blue"
					style="background: rgba(29, 78, 216, 0.1);"
				>
					{fallbackText}
				</span>
			{/if}
			<span class="absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
				</svg>
			</span>
		</button>

		<button
			type="button"
			onclick={pickFile}
			aria-label="Change photo"
			class="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-ftc-blue text-white shadow-sm transition-colors hover:bg-ftc-blue-dark"
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
			</svg>
		</button>
	</div>

	<div class="flex flex-col items-start gap-1">
		<button type="button" onclick={pickFile} class="text-xs font-semibold text-ftc-blue hover:underline">Change photo</button>
		{#if shownUrl}
			<button type="button" onclick={removePhoto} class="text-xs font-medium text-text-muted hover:text-rose-600">Remove</button>
		{/if}
	</div>

	<input bind:this={fileInput} type="file" accept="image/*" {name} class="hidden" onchange={onFileChange} />
	{#if removeRequested}
		<input type="hidden" name="{name}Remove" value="1" />
	{/if}
</div>
