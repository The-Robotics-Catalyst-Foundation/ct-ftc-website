<script>
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import './layout.css';
  import Footer from '$lib/components/footer.svelte';
  import Nav from '$lib/components/header.svelte';
  import Head from '$lib/components/head.svelte';

  let { children } = $props();

  // Routes that render their own bare shell instead of the public site Nav:
  // the admin panel, the embeddable widgets, and the photo-share view (which
  // has its own logo+event-name top bar).
  let isPhotosShareRoute = $derived(/\/events\/[^/]+\/photos\/?$/.test($page.url.pathname));
  let hideNav = $derived(
    $page.url.pathname.startsWith('/admin') ||
      $page.url.pathname.startsWith('/embed/') ||
      isPhotosShareRoute
  );
  // The photo-share view keeps the standard site Footer even though it
  // replaces Nav with its own top bar - only admin/embed hide it entirely.
  let hideFooter = $derived($page.url.pathname.startsWith('/admin') || $page.url.pathname.startsWith('/embed/'));

  let title = $derived($page.data.title ? `${$page.data.title} | CTFTC` : 'Connecticut FIRST Tech Challenge');
  let description = $derived($page.data.description || 'Connecticut FIRST Tech Challenge - Inspiring the Next Generation of Innovators and Engineers. Explore our events, teams, and volunteer opportunities to get involved in the excitement of robotics competitions across the state.');

  let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));

  let organizationJsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Connecticut FIRST Tech Challenge',
      url: $page.url.origin,
      logo: `${$page.url.origin}/ctftc.png`,
      sameAs: [
        'https://discord.com/invite/GTPU98nWY9',
        'https://www.instagram.com/ctfirsttechchallenge/',
        'https://www.facebook.com/profile.php?id=61553396255140'
      ]
    }).replace(/</g, '\\u003c')
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.origin + $page.url.pathname} />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href={$page.url.origin + $page.url.pathname} />

  {#if isAdminRoute}
    <meta name="robots" content="noindex, nofollow, noarchive" />
  {:else}
    {@html `<script type="application/ld+json">${organizationJsonLd}</script>`}
  {/if}
</svelte:head>

{#if !hideNav}
  <Nav />
{/if}

{@render children()}

{#if !hideFooter}
  <Footer />
{/if}
