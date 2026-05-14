<script>
  import './layout.css';
  import Header from '$lib/components/header.svelte';
  import Footer from '$lib/components/footer.svelte';
</script>

<!-- The layout wraps every page in the app -->
<div class="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 text-slate-900">
  <Header />
  
  <main class="flex-grow pt-20">
    <!-- The <slot /> is where your page content (+page.svelte) will be injected -->
    <slot />
  </main>
  
  <Footer />
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  /* Global glass effect utility */
  :global(.glass) {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
</style>