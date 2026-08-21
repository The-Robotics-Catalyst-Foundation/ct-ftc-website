<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Changelog | Connecticut FTC</title>
</svelte:head>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] pb-24 pt-28 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  <section class="max-w-3xl mx-auto px-6 relative z-20">
    <div class="text-center md:text-left mb-10">
      <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-2 box-shadow-flat transform -rotate-1">
        Changelog
      </span>
      <h1 class="mt-4 text-4xl md:text-5xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        What's <span class="text-[#2563eb] bg-white border-4 border-black px-4 inline-block my-2 box-shadow-flat transform rotate-1">New</span>
      </h1>
    </div>

    <div class="bg-white border-3 border-black rounded-2xl box-shadow-flat p-6 md:p-10">
      <div
        class="prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#2563eb] prose-a:font-bold prose-li:font-semibold prose-strong:text-black"
      >
        {@html data.html}
      </div>
    </div>
  </section>
</main>

<style>
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>
