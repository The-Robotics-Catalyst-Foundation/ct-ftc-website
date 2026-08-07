<script lang="ts">
	import EventCard from '$lib/components/event-card.svelte';
	import EmbedHeader from '$lib/components/embed-header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.event.name} | CT FTC</title>
</svelte:head>

<div class="mx-auto max-w-sm p-3">
	<EmbedHeader />
	<EventCard
		id={data.event.id}
		slug={data.event.slug}
		name={data.event.name}
		type={data.event.type}
		location={data.event.location}
		dateTime={data.event.dateTime}
		volunteersCurrent={data.event.volunteersCurrent}
		volunteersNeeded={data.event.volunteersNeeded}
		showName={data.showName}
		showActions={false}
	/>
</div>
