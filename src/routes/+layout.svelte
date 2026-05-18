<script>
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import './layout.css'; // Or wherever your global css file lives
  import Footer from '$lib/components/footer.svelte';
  import Nav from '$lib/components/header.svelte';

  let { children } = $props();

</script>

<Nav />

<div class="h-28 md:h-24"></div>

{@render children()}
<Footer/>