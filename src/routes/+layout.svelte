<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '#about', label: 'About' },
		{ href: '#competition', label: 'Competition' },
		{ href: '#volunteer', label: 'Volunteer' },
		{ href: '#contact', label: 'Contact' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Connecticut FIRST Tech Challenge</title>
	<meta
		name="description"
		content="Connecticut FIRST Tech Challenge — inspiring middle and high school students through robotics competition."
	/>
</svelte:head>

<header class="fixed top-0 z-50 w-full border-b border-white/10 bg-navy/95 backdrop-blur-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-3">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 font-extrabold text-white"
			>
				CT
			</div>
			<span class="hidden font-semibold tracking-tight text-white sm:block">
				Connecticut <span class="text-purple-400">FTC</span>
			</span>
		</a>

		<nav class="hidden items-center gap-8 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-medium text-slate-300 transition-colors hover:text-white"
				>
					{link.label}
				</a>
			{/each}
			<a
				href="#volunteer"
				class="rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
			>
				Volunteer Now
			</a>
		</nav>

		<button
			class="flex flex-col gap-1.5 p-2 md:hidden"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle menu"
		>
			<span
				class="block h-0.5 w-6 bg-white transition-transform"
				class:rotate-45={mobileOpen}
				class:translate-y-2={mobileOpen}
			></span>
			<span class="block h-0.5 w-6 bg-white transition-opacity" class:opacity-0={mobileOpen}></span>
			<span
				class="block h-0.5 w-6 bg-white transition-transform"
				class:-rotate-45={mobileOpen}
				class:-translate-y-2={mobileOpen}
			></span>
		</button>
	</div>

	{#if mobileOpen}
		<nav class="border-t border-white/10 px-6 pb-6 md:hidden">
			<ul class="mt-4 flex flex-col gap-4">
				{#each navLinks as link}
					<li>
						<a
							href={link.href}
							onclick={() => (mobileOpen = false)}
							class="text-slate-300 hover:text-white">{link.label}</a
						>
					</li>
				{/each}
				<li>
					<a
						href="#volunteer"
						onclick={() => (mobileOpen = false)}
						class="inline-block rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400"
					>
						Volunteer Now
					</a>
				</li>
			</ul>
		</nav>
	{/if}
</header>

{@render children()}

<footer class="border-t border-white/10 bg-navy py-12 text-slate-400">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-10 sm:grid-cols-3">
			<div>
				<div class="mb-3 flex items-center gap-3">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-sm font-extrabold text-white"
					>
						CT
					</div>
					<span class="font-semibold text-white">Connecticut FTC</span>
				</div>
				<p class="text-sm leading-relaxed">
					Inspiring the next generation of engineers, scientists, and innovators through FIRST Tech
					Challenge robotics.
				</p>
			</div>

			<div>
				<h4 class="mb-3 font-semibold text-white">Quick Links</h4>
				<ul class="space-y-2 text-sm">
					{#each navLinks as link}
						<li><a href={link.href} class="transition-colors hover:text-white">{link.label}</a></li>
					{/each}
				</ul>
			</div>

			<div>
				<h4 class="mb-3 font-semibold text-white">Connect</h4>
				<ul class="space-y-2 text-sm">
					<li>
						<a
							href="https://www.instagram.com"
							target="_blank"
							rel="noopener"
							class="transition-colors hover:text-white">Instagram</a
						>
					</li>
					<li>
						<a
							href="https://www.facebook.com"
							target="_blank"
							rel="noopener"
							class="transition-colors hover:text-white">Facebook</a
						>
					</li>
					<li>
						<a
							href="https://discord.com"
							target="_blank"
							rel="noopener"
							class="transition-colors hover:text-white">Discord</a
						>
					</li>
					<li class="mt-4">
						<a
							href="mailto:ctfirsttechchallenge@gmail.com"
							class="break-all transition-colors hover:text-white">ctfirsttechchallenge@gmail.com</a
						>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-10 border-t border-white/10 pt-6 text-center text-xs">
			&copy; {new Date().getFullYear()} Connecticut FIRST Tech Challenge. All rights reserved.
		</div>
	</div>
</footer>
