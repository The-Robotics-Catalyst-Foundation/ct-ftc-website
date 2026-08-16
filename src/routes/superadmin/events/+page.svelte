<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function fmtDate(value?: string): string {
		if (!value) return '—';
		const d = new Date(value);
		return isNaN(d.getTime()) ? value : d.toLocaleString();
	}

	function yesNo(value?: boolean): string {
		return value ? 'Yes' : 'No';
	}

	function coordsOf(event: (typeof data.events)[number]): string {
		const c = event.coordinates?.coordinates;
		if (!c || c.length < 2) return '—';
		const [lng, lat] = c;
		return `${lat}, ${lng}`;
	}
</script>

<svelte:head>
	<title>Superadmin — Events | Connecticut FTC</title>
</svelte:head>

<div class="mx-auto max-w-[100rem] p-6">
	<h1 class="text-2xl font-bold tracking-tight text-text-main">
		CT Events — {data.season}-{data.season + 1} season
	</h1>
	<p class="mt-1 text-sm text-text-muted">
		Every field the FTC Events API returns for upcoming Connecticut events, unfiltered. Temporary utility page.
	</p>

	{#if data.error}
		<div class="error-banner mt-4">{data.error}</div>
	{/if}

	<p class="mt-4 text-xs font-bold text-text-muted">
		{data.events.length} upcoming event{data.events.length === 1 ? '' : 's'}
	</p>

	<div class="glass-panel mt-2 overflow-x-auto p-0">
		<table class="w-full min-w-[2900px] border-collapse text-xs">
			<thead>
				<tr class="border-b-2 border-black bg-[#eef2f7] text-left font-black uppercase tracking-wide text-text-muted">
					<th class="px-3 py-2">Code</th>
					<th class="px-3 py-2">Event ID</th>
					<th class="px-3 py-2">Name</th>
					<th class="px-3 py-2">Type</th>
					<th class="px-3 py-2">Division</th>
					<th class="px-3 py-2">Region</th>
					<th class="px-3 py-2">League</th>
					<th class="px-3 py-2">District</th>
					<th class="px-3 py-2">Venue</th>
					<th class="px-3 py-2">Address</th>
					<th class="px-3 py-2">City</th>
					<th class="px-3 py-2">State</th>
					<th class="px-3 py-2">Country</th>
					<th class="px-3 py-2">Start</th>
					<th class="px-3 py-2">End</th>
					<th class="px-3 py-2">Timezone</th>
					<th class="px-3 py-2">Remote</th>
					<th class="px-3 py-2">Hybrid</th>
					<th class="px-3 py-2">Fields</th>
					<th class="px-3 py-2">Published</th>
					<th class="px-3 py-2">Website</th>
					<th class="px-3 py-2">Livestream</th>
					<th class="px-3 py-2">Coordinates</th>
					<th class="px-3 py-2">Webcasts</th>
					<th class="px-3 py-2">VIMS ID</th>
					<th class="px-3 py-2">Volunteer Deeplink</th>
					<th class="px-3 py-2">Event Count (season, worldwide)</th>
				</tr>
			</thead>
			<tbody>
				{#each data.events as event (event.eventId ?? event.code)}
					<tr class="border-b border-black/10 hover:bg-[#eef2f7]/60">
						<td class="px-3 py-2 font-mono font-semibold text-text-main">{event.code}</td>
						<td class="px-3 py-2 font-mono text-text-muted">{event.eventId ?? '—'}</td>
						<td class="max-w-[16rem] px-3 py-2 text-text-main">{event.name || '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.typeName || '—'} ({event.type ?? '—'})</td>
						<td class="px-3 py-2 text-text-muted">{event.divisionCode ?? '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.regionCode ?? '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.leagueCode ?? '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.districtCode || '—'}</td>
						<td class="max-w-[14rem] px-3 py-2 text-text-muted">{event.venue || '—'}</td>
						<td class="max-w-[14rem] px-3 py-2 text-text-muted">{event.address || '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.city || '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.stateprov || '—'}</td>
						<td class="px-3 py-2 text-text-muted">{event.country || '—'}</td>
						<td class="whitespace-nowrap px-3 py-2 text-text-muted">{fmtDate(event.dateStart)}</td>
						<td class="whitespace-nowrap px-3 py-2 text-text-muted">{fmtDate(event.dateEnd)}</td>
						<td class="px-3 py-2 text-text-muted">{event.timezone || '—'}</td>
						<td class="px-3 py-2 text-text-muted">{yesNo(event.remote)}</td>
						<td class="px-3 py-2 text-text-muted">{yesNo(event.hybrid)}</td>
						<td class="px-3 py-2 text-text-muted">{event.fieldCount ?? '—'}</td>
						<td class="px-3 py-2 text-text-muted">{yesNo(event.published)}</td>
						<td class="max-w-[10rem] truncate px-3 py-2 text-text-muted">
							{#if event.website}
								<a href={event.website} target="_blank" rel="noreferrer" class="text-[#2563eb] underline">{event.website}</a>
							{:else}
								—
							{/if}
						</td>
						<td class="max-w-[10rem] truncate px-3 py-2 text-text-muted">
							{#if event.liveStreamUrl}
								<a href={event.liveStreamUrl} target="_blank" rel="noreferrer" class="text-[#2563eb] underline">{event.liveStreamUrl}</a>
							{:else}
								—
							{/if}
						</td>
						<td class="whitespace-nowrap px-3 py-2 text-text-muted">{coordsOf(event)}</td>
						<td class="max-w-[10rem] truncate px-3 py-2 font-mono text-text-muted">
							{event.webcasts ? JSON.stringify(event.webcasts) : '—'}
						</td>
						<td class="px-3 py-2 font-mono text-text-muted">{event.vimsId ?? '—'}</td>
						<td class="max-w-[10rem] truncate px-3 py-2 text-text-muted">
							{#if event.dashboardVolunteerDeeplink}
								<a
									href={event.dashboardVolunteerDeeplink}
									target="_blank"
									rel="noreferrer"
									class="text-[#2563eb] underline">{event.dashboardVolunteerDeeplink}</a
								>
							{:else}
								—
							{/if}
						</td>
						<td class="px-3 py-2 text-text-muted">{data.seasonEventCount ?? '—'}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="27" class="px-4 py-6 text-center text-sm text-text-muted">No upcoming CT events found.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
