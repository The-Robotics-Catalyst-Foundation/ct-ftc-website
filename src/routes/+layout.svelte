<script>
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import './layout.css'; 
  import Footer from '$lib/components/footer.svelte';
  import Nav from '$lib/components/header.svelte';
  import Head from '$lib/components/head.svelte'; // Import your new component

  let { children } = $props();

  // 1. Get dynamic SEO data from the current page's data store
  // 2. Set defaults if the specific page doesn't provide them
  let title = $derived($page.data.title ? `${$page.data.title} | CTFTC` : 'Connecticut FIRST Tech Challenge');
  let description = $derived($page.data.description || 'Connecticut FIRST Tech Challenge - Inspiring the Next Generation of Innovators and Engineers. Explore our events, teams, and volunteer opportunities to get involved in the excitement of robotics competitions across the state.');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" /> 
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Nav />

{@render children()}

<Footer/>