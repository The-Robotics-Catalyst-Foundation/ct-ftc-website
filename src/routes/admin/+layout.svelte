<script lang="ts">
	import { onMount } from 'svelte';
	import { registerAdminServiceWorker } from '$lib/client/pwa';
	import AdminInstallCta from '$lib/components/admin-install-cta.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	onMount(() => {
		registerAdminServiceWorker();
	});
</script>

<svelte:head>
	<link rel="manifest" href="/admin-manifest.webmanifest" />
	<meta name="theme-color" content="#1d4ed8" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="CT FTC Admin" />
</svelte:head>

<AdminInstallCta />
{@render children()}
