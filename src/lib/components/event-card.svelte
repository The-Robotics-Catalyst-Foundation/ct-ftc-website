<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { Calendar, MapPin, Users, Share2, CodeXml } from '@lucide/svelte';
	import Modal from './modal.svelte';
	import EmbedBuilder from './embed-builder.svelte';
	import { robolystEventUrl } from '$lib/robolyst';

	let {
		id,
		slug,
		eventCode,
		name,
		type,
		location,
		dateTime,
		description,
		volunteersNeeded,
		showName = true,
		showActions = true,
		headingLevel = 3
	}: {
		id: string;
		slug?: string;
		eventCode?: string;
		name: string;
		type?: string;
		location?: string;
		dateTime?: string;
		description?: string;
		volunteersNeeded?: number;
		showName?: boolean;
		showActions?: boolean;
		// Lets callers that embed this card as their document's only heading
		// (e.g. the standalone /embed/events/[id] widget) start at h1 instead
		// of always nesting as if under some other page's h1/h2.
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	} = $props();

	// Exact brand mapping per event type - badge text flips to white on the
	// darker blue so it stays readable against #0066FF. Keyed lowercase since
	// PocketBase data casing isn't guaranteed to match the display label.
	const TYPE_STYLES: Record<string, { accent: string; badge: string }> = {
		scrimmage: { accent: '#FF8C00', badge: 'bg-[#FF8C00] text-slate-900' },
		qualifier: { accent: '#0066FF', badge: 'bg-[#0066FF] text-white' },
		championship: { accent: '#FFD700', badge: 'bg-[#FFD700] text-slate-900' }
	};
	const DEFAULT_TYPE_STYLE = { accent: '#cbd5e1', badge: 'bg-slate-200 text-slate-900' };

	const typeStyle = $derived(TYPE_STYLES[(type ?? '').trim().toLowerCase()] ?? DEFAULT_TYPE_STYLE);
	const eventPath = $derived(`/events/${slug || id}`);
	const photosPath = $derived(`/events/${slug || id}/photos`);

	function formatDateSlug(value?: string) {
		if (!value) return 'DATE TBD';
		return new Date(value)
			.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
			.toUpperCase();
	}

	// Date only, no time - e.g. "Friday, August 7, 2026".
	function formatDateOnly(value?: string) {
		if (!value) return 'Date TBD';
		return new Date(value).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const dateSlug = $derived(formatDateSlug(dateTime));
	const dateLabel = $derived(formatDateOnly(dateTime));
	const hasVolunteerInfo = $derived(!!volunteersNeeded);
	const robolystUrl = $derived(robolystEventUrl(dateTime, eventCode));

	let embedOpen = $state(false);
	let shareCopied = $state(false);
	let shareCopyTimeout: ReturnType<typeof setTimeout> | null = null;

	async function copyPhotosLink() {
		const url = `${$page.url.origin}${photosPath}`;
		try {
			await navigator.clipboard.writeText(url);
			shareCopied = true;
			if (shareCopyTimeout) clearTimeout(shareCopyTimeout);
			shareCopyTimeout = setTimeout(() => (shareCopied = false), 1800);
		} catch {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	}

	onDestroy(() => {
		if (shareCopyTimeout) clearTimeout(shareCopyTimeout);
	});
</script>

<article class="event-card" style="--accent: {typeStyle.accent}">
	<div class="event-card-header">
		<span class="event-card-badge {typeStyle.badge}">{type || 'Scrimmage'}</span>
		<span class="event-card-date-slug">{dateSlug}</span>
	</div>

	<div class="event-card-body">
		{#if showName}
			<svelte:element this={`h${headingLevel}`} class="event-card-title">{name}</svelte:element>
		{/if}

		<div class="mt-3 space-y-2 text-sm font-bold text-slate-700">
			<div class="flex items-center gap-2.5">
				<Calendar class="h-4 w-4 shrink-0 text-slate-500" strokeWidth={2.5} />
				<span>{dateLabel}</span>
			</div>
			<div class="flex items-center gap-2.5">
				<MapPin class="h-4 w-4 shrink-0 text-slate-500" strokeWidth={2.5} />
				<span class="truncate">{location || 'Location TBD'}</span>
			</div>
			{#if hasVolunteerInfo}
				<div class="flex items-center gap-2.5">
					<Users class="h-4 w-4 shrink-0 text-slate-500" strokeWidth={2.5} />
					<span>{volunteersNeeded} volunteers needed</span>
				</div>
			{/if}
		</div>

		{#if description}
			<p class="mt-3 text-sm font-semibold leading-relaxed text-slate-600">{description}</p>
		{/if}

		<div class="event-card-footer">
			<div class="flex items-center gap-2">
				{#if showActions}
					<button type="button" class="event-card-action-btn" onclick={copyPhotosLink}>
						<Share2 class="h-3.5 w-3.5" strokeWidth={2.5} />
						{shareCopied ? 'Copied!' : 'Share Photos'}
					</button>
					<button type="button" class="event-card-action-btn" onclick={() => (embedOpen = true)}>
						<CodeXml class="h-3.5 w-3.5" strokeWidth={2.5} />
						Embed
					</button>
				{/if}
				{#if robolystUrl}
					<a href={robolystUrl} target="_blank" rel="noopener noreferrer" class="event-card-action-btn">
						<img src="/robolyst-icon.svg" alt="" class="h-3.5 w-3.5 object-contain" />
						Robolyst
					</a>
				{/if}
			</div>
			<a href={eventPath} class="event-card-cta">See in CTFTC Website &rarr;</a>
		</div>
	</div>
</article>

{#if showActions}
	<Modal open={embedOpen} onClose={() => (embedOpen = false)} title="Embed this event">
		<EmbedBuilder {id} {slug} {name} {type} {location} {dateTime} {description} {volunteersNeeded} />
	</Modal>
{/if}

<style>
	.event-card {
		display: flex;
		height: 100%;
		flex-direction: column;
		background: #fff;
		border: 3px solid #0f172a;
		border-radius: 1rem;
		box-shadow: 6px 6px 0px 0px #0f172a;
		overflow: hidden;
	}

	.event-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.9rem 1.25rem;
		background: var(--accent);
		border-bottom: 3px solid #0f172a;
	}

	.event-card-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 1.25rem;
	}

	.event-card-badge {
		display: inline-flex;
		align-items: center;
		border: 2px solid #0f172a;
		border-radius: 0.4rem;
		padding: 0.2rem 0.6rem;
		font-size: 0.7rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.event-card-date-slug {
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		color: #64748b;
		white-space: nowrap;
	}

	.event-card-title {
		margin-top: 0.6rem;
		font-size: 1.25rem;
		font-weight: 900;
		line-height: 1.15;
		color: #0f172a;
	}

	.event-card-footer {
		margin-top: 1.1rem;
		padding-top: 0.9rem;
		border-top: 2px solid #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.event-card-action-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: 2px solid #0f172a;
		border-radius: 0.5rem;
		background: #fff;
		padding: 0.35rem 0.6rem;
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: #0f172a;
		box-shadow: 2px 2px 0px 0px #0f172a;
		transition: box-shadow 0.15s ease, transform 0.1s ease;
	}
	.event-card-action-btn:hover {
		background: #f8fafc;
	}
	.event-card-action-btn:active {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px 0px #0f172a;
	}

	.event-card-cta {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		border: 2px solid #0f172a;
		border-radius: 0.5rem;
		background: #0f172a;
		padding: 0.55rem 1rem;
		font-size: 0.75rem;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #fff;
		box-shadow: 3px 3px 0px 0px #0f172a;
		transition: box-shadow 0.15s ease, transform 0.1s ease, background 0.15s ease;
		white-space: nowrap;
	}
	.event-card-cta:hover {
		background: #fde047;
		color: #0f172a;
	}
	.event-card-cta:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px 0px #0f172a;
	}
</style>
