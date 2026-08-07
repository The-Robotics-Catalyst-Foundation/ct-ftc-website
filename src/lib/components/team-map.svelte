<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import 'maplibre-gl/dist/maplibre-gl.css';

  interface TownGroup {
    lat: number;
    lng: number;
    city: string;
    teams: { teamNumber: number; name: string }[];
  }

  let { teamGroups = [] }: { teamGroups: TownGroup[] } = $props();

  let container: HTMLDivElement = $state()!;
  let map: import('maplibre-gl').Map | null = null;
  let ready = $state(false);

  const CT_CENTER: [number, number] = [-72.7107, 41.6032];
  const CT_ZOOM = 7.4;

  let totalTeams = $derived(teamGroups.reduce((sum, g) => sum + g.teams.length, 0));

  onMount(async () => {
    if (!teamGroups.length) return;

    const [maplibregl, { feature }, countriesTopo, statesTopo] = await Promise.all([
      import('maplibre-gl').then((m) => m.default),
      import('topojson-client'),
      import('world-atlas/countries-110m.json').then((m) => m.default as any),
      import('us-atlas/states-10m.json').then((m) => m.default as any)
    ]);

    const countries = feature(countriesTopo, countriesTopo.objects.countries);
    const states = feature(statesTopo, statesTopo.objects.states);

    map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {
          countries: { type: 'geojson', data: countries as any },
          states: { type: 'geojson', data: states as any }
        },
        layers: [
          // Ocean: brand blue, not a muted/washed tone - land needs to read against it.
          { id: 'ocean-fill', type: 'background', paint: { 'background-color': '#1d4ed8' } },
          {
            id: 'country-fill',
            type: 'fill',
            source: 'countries',
            paint: { 'fill-color': '#eef2f7' }
          },
          {
            id: 'country-borders',
            type: 'line',
            source: 'countries',
            paint: { 'line-color': '#0a0a0a', 'line-width': 1, 'line-opacity': 0.9 }
          },
          {
            id: 'state-borders',
            type: 'line',
            source: 'states',
            filter: ['!=', ['get', 'name'], 'Connecticut'],
            paint: { 'line-color': '#0a0a0a', 'line-width': 0.5, 'line-opacity': 0.3 }
          },
          {
            id: 'ct-fill',
            type: 'fill',
            source: 'states',
            filter: ['==', ['get', 'name'], 'Connecticut'],
            paint: { 'fill-color': '#facc15', 'fill-opacity': 0.35 }
          },
          {
            id: 'ct-outline',
            type: 'line',
            source: 'states',
            filter: ['==', ['get', 'name'], 'Connecticut'],
            paint: { 'line-color': '#0a0a0a', 'line-width': 3.5 }
          },
          {
            id: 'ct-outline-accent',
            type: 'line',
            source: 'states',
            filter: ['==', ['get', 'name'], 'Connecticut'],
            paint: { 'line-color': '#facc15', 'line-width': 2 }
          }
        ]
      },
      center: CT_CENTER,
      zoom: CT_ZOOM,
      attributionControl: false,
      cooperativeGestures: true
    });

    map.on('load', () => {
      ready = true;
      addPins(maplibregl);
    });
  });

  function addPins(maplibregl: typeof import('maplibre-gl')) {
    if (!map) return;

    teamGroups.forEach((group, i) => {
      try {
        const count = group.teams.length;

        const el = document.createElement('button');
        el.type = 'button';
        el.setAttribute('aria-label', `${count} team${count === 1 ? '' : 's'} in ${group.city}`);
        el.className = 'team-map-pin';

        // MapLibre positions markers via an inline `transform: translate(...)` on
        // this exact element. A CSS animation on the same property (even on a
        // different element in the cascade sense) would win over that inline
        // style and permanently override the translate - so the pop/hover motion
        // lives on this inner badge instead, leaving the button's transform free
        // for MapLibre to position the pin at its real lat/lng.
        const badge = document.createElement('span');
        badge.className = 'team-map-pin-badge';
        badge.style.setProperty('--i', String(i));
        badge.textContent = String(count);
        el.appendChild(badge);

        const popupHtml = `
          <div class="team-map-popup">
            <div class="team-map-popup-title">${escapeHtml(group.city)}</div>
            <ul class="team-map-popup-list">
              ${group.teams
                .map((t) => `<li><span>#${t.teamNumber}</span> ${escapeHtml(t.name)}</li>`)
                .join('')}
            </ul>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 18, closeButton: false, maxWidth: '240px' }).setHTML(
          popupHtml
        );

        new maplibregl.Marker({ element: el }).setLngLat([group.lng, group.lat]).addTo(map!);

        // Popup opens on hover (desktop) and stays tappable on touch devices,
        // rather than MapLibre's default click-to-toggle on the marker.
        const showPopup = () => popup.setLngLat([group.lng, group.lat]).addTo(map!);
        const hidePopup = () => popup.remove();

        el.addEventListener('mouseenter', showPopup);
        el.addEventListener('mouseleave', hidePopup);
        el.addEventListener('click', () => {
          if (popup.isOpen()) hidePopup();
          else showPopup();
        });
      } catch (err) {
        console.error('Failed to add team map pin for', group.city, err);
      }
    });
  }

  onDestroy(() => {
    map?.remove();
    map = null;
  });

  function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  }
</script>

{#if teamGroups.length}
  <div class="relative h-full w-full overflow-hidden rounded-[2.5rem]" bind:this={container}>
    {#if !ready}
      <div class="absolute inset-0 flex items-center justify-center bg-[#eef2f7] text-xs font-black uppercase tracking-widest text-slate-400">
        Loading CT team map…
      </div>
    {/if}

    {#if ready}
      <div class="team-map-stat" role="status" aria-live="polite">
        <span class="team-map-stat-dot"></span>
        <span class="team-map-stat-value">{totalTeams}+</span>
        <span class="team-map-stat-label">Teams in CT</span>
      </div>

      <div class="team-map-legend">Each pin is a city — the number is teams there</div>
    {/if}
  </div>
{:else}
  <img src="map.png" alt="CT Map" class="w-full h-full object-cover rounded-[2.5rem] shadow-neumorphic-inner border border-slate-200/50" />
{/if}

<style>
  :global(.team-map-pin) {
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  :global(.team-map-pin-badge) {
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    background: #facc15;
    border: 2px solid #000;
    box-shadow: 2px 2px 0px 0px #000;
    color: #1a1a1a;
    font-weight: 900;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
    animation: pin-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 45ms);
  }
  :global(.team-map-pin:hover .team-map-pin-badge) {
    transform: scale(1.12);
  }

  @keyframes pin-pop {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.team-map-pin-badge) {
      animation: none;
    }
  }

  :global(.team-map-stat) {
    position: absolute;
    top: 0.85rem;
    left: 0.85rem;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: #fff;
    border: 2px solid #000;
    border-radius: 9999px;
    box-shadow: 3px 3px 0px 0px #000;
    padding: 0.35rem 0.7rem;
    pointer-events: none;
  }
  :global(.team-map-stat-dot) {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 9999px;
    background: #22c55e;
    animation: stat-pulse 1.6s ease-in-out infinite;
  }
  :global(.team-map-stat-value) {
    font-weight: 900;
    font-size: 0.85rem;
    color: #000;
  }
  :global(.team-map-stat-label) {
    font-weight: 900;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #475569;
  }

  @keyframes stat-pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(0.8);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.team-map-stat-dot) {
      animation: none;
    }
  }

  :global(.team-map-legend) {
    position: absolute;
    bottom: 0.85rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    background: rgba(255, 255, 255, 0.92);
    border: 2px solid #000;
    border-radius: 9999px;
    box-shadow: 2px 2px 0px 0px #000;
    padding: 0.3rem 0.75rem;
    font-weight: 700;
    font-size: 0.62rem;
    color: #1a1a1a;
    text-align: center;
    max-width: calc(100% - 1.6rem);
    pointer-events: none;
  }

  :global(.team-map-popup) {
    background: #fff;
    border: 2px solid #000;
    border-radius: 0.75rem;
    box-shadow: 3px 3px 0px 0px #000;
    padding: 0.6rem 0.75rem;
    font-family: inherit;
  }
  :global(.team-map-popup-title) {
    font-weight: 900;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #000;
    margin-bottom: 0.35rem;
  }
  :global(.team-map-popup-list) {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 140px;
    overflow-y: auto;
    font-size: 0.75rem;
    font-weight: 600;
    color: #334155;
  }
  :global(.team-map-popup-list li) {
    padding: 0.15rem 0;
  }
  :global(.team-map-popup-list li span) {
    font-weight: 900;
    color: #2563eb;
    margin-right: 0.25rem;
  }
</style>
