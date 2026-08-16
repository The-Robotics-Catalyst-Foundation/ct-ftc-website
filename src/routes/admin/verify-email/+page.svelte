<script lang="ts">
	import '../admin.css';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="admin-shell flex items-center justify-center px-4 py-16 font-sans">
	<div class="glass-panel w-full max-w-md p-8 md:p-10">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Email verification</h1>

		{#if data.success}
			<p class="mt-1 mb-6 text-sm text-text-muted">Your email is verified.</p>
			<div class="success-banner">
				Check your inbox for an email to create your password. Didn't get it?
				<a href="/admin/create-password" class="underline">Resend it</a>.
			</div>
		{:else}
			<p class="mt-1 mb-6 text-sm text-text-muted">We couldn't verify your account.</p>
			<div class="error-banner">{data.error}</div>
		{/if}
	</div>
</div>
