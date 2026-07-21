<script>
  import { page } from '$app/stores';
  import './layout.css';
  import Footer from '$lib/components/footer.svelte';
  import Nav from '$lib/components/header.svelte';
  import { jsonLdScript } from '$lib/seo.js';

  let { children } = $props();

  // Determine if the current URL belongs to the admin section
  let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));

  let title = $derived($page.data.title ? `${$page.data.title} | CTFTC` : 'Connecticut FIRST Tech Challenge');
  let description = $derived($page.data.description || 'Connecticut FIRST Tech Challenge - Inspiring the Next Generation of Innovators and Engineers. Explore our events, teams, and volunteer opportunities to get involved in the excitement of robotics competitions across the state.');
  let canonicalUrl = $derived($page.url.origin + $page.url.pathname);
  let ogImage = $derived($page.url.origin + '/ctftc.png');

  // Site-wide identity for search/answer engines - kept out of admin so a
  // login-gated shell never claims to be the public organization page.
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'Connecticut FIRST Tech Challenge',
    alternateName: 'CT FTC',
    description:
      'Connecticut affiliate of the FIRST Tech Challenge robotics program, part of New England FIRST. Supports student teams (grades 7-12) who design, build, and compete with robots across Connecticut.',
    logo: '/ctftc.png',
    email: 'info@ctftc.org',
    sameAs: [
      'https://www.instagram.com/ctfirsttechchallenge/',
      'https://discord.com/invite/GTPU98nWY9',
      'https://www.facebook.com/profile.php?id=61553396255140'
    ],
    areaServed: { '@type': 'State', name: 'Connecticut' }
  };
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:site_name" content="Connecticut FIRST Tech Challenge" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  {#if !isAdminRoute}
    {@html jsonLdScript(organizationSchema)}
  {/if}
</svelte:head>

{#if !isAdminRoute}
  <Nav />
{/if}

{@render children()}

{#if !isAdminRoute}
  <Footer />
{/if}
