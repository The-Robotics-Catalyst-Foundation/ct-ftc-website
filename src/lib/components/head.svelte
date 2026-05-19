<script>
  let { 
    title = 'CTFTC', 
    description = 'Connecticut FIRST Tech Challenge - Inspiring the Next Generation of Innovators and Engineers. Explore our events, teams, and volunteer opportunities to get involved in the excitement of robotics competitions across the state.' 
  } = $props();
  
  // Format the title consistently (e.g., "About Us | My Site")
  let formattedTitle = $derived(title.includes('|') ? title : `${title} | CTFTC`);
</script>

<svelte:head>
  <title>{formattedTitle}</title>
  <meta name="description" content={description} />

  <meta property="og:title" content={formattedTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
</svelte:head>