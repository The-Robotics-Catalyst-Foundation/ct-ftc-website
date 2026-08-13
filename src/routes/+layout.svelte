<script>
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import './layout.css';
  import Footer from '$lib/components/footer.svelte';
  import Nav from '$lib/components/header.svelte';

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

  let pageTitle = $derived($page.status >= 400 ? 'Page Not Found' : $page.data.title);
  let title = $derived(
    pageTitle ? `${pageTitle} | Connecticut FTC` : 'Connecticut FTC | FIRST Tech Challenge in Connecticut'
  );
  let description = $derived($page.data.description || 'Connecticut FTC is the hub for FIRST Tech Challenge in Connecticut - the statewide robotics competition for grades 7-12. Find local events, browse the team directory, and volunteer.');
  let image = $derived($page.data.image ? $page.url.origin + $page.data.image : `${$page.url.origin}/ctftc.png`);
  let imageAlt = $derived($page.data.imageAlt || 'Connecticut FTC - FIRST Tech Challenge in Connecticut');

  let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
  let isHome = $derived($page.url.pathname === '/');
  // Embed widgets and the photo-share view duplicate content that already has a
  // canonical home under /events, so they stay out of the index entirely.
  let noIndex = $derived(isAdminRoute || $page.url.pathname.startsWith('/embed/') || isPhotosShareRoute);

  // Pages can override the canonical path when the same content is reachable at
  // more than one URL (e.g. an event served by both record id and slug).
  let canonical = $derived($page.url.origin + ($page.data.canonical || $page.url.pathname));

  let siteJsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${$page.url.origin}/#website`,
          name: 'Connecticut FTC',
          alternateName: ['CT FTC', 'Connecticut FIRST Tech Challenge'],
          url: `${$page.url.origin}/`,
          publisher: { '@id': `${$page.url.origin}/#organization` }
        },
        {
          '@type': 'Organization',
          '@id': `${$page.url.origin}/#organization`,
          name: 'Connecticut FTC',
          legalName: 'Connecticut FIRST Tech Challenge',
          alternateName: 'CT FTC',
          url: `${$page.url.origin}/`,
          logo: `${$page.url.origin}/ctftc.png`,
          email: 'contact@connecticutftc.org',
          areaServed: { '@type': 'State', name: 'Connecticut' },
          sameAs: [
            'https://discord.com/invite/GTPU98nWY9',
            'https://www.instagram.com/ctfirsttechchallenge/',
            'https://www.facebook.com/profile.php?id=61553396255140'
          ]
        }
      ]
    }).replace(/</g, '\\u003c')
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <meta property="og:site_name" content="Connecticut FTC" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={image} />
  <meta property="og:image:alt" content={imageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={imageAlt} />
  <link rel="canonical" href={canonical} />

  {#if noIndex}
    <meta name="robots" content="noindex, nofollow, noarchive" />
  {/if}

  {#if isHome}
    {@html `<script type="application/ld+json">${siteJsonLd}</script>`}
  {/if}
</svelte:head>

{#if !hideNav}
  <Nav />
{/if}

{@render children()}

{#if !hideFooter}
  <Footer />
{/if}
