<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';

  let eventCount = $state(0);

  onMount(async () => {
    try {
      const records = await pb.collection('events').getList(1, 1, { fields: 'id' });
      eventCount = records.totalItems;
    } catch (e) { 
      console.error("Diagnostic error gathering metrics:", e); 
    }
  });
</script>

<div class="space-y-10">
  <section class="border-b-4 border-black pb-4">
    <h1 class="text-4xl font-black uppercase tracking-tighter">Terminal Hub Dashboard</h1>
    <p class="text-xs font-mono text-slate-500 mt-0.5">Central system monitoring for current Connecticut sector operations datasets.</p>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 gap-8">
   
    <a href="/admin/events" class="bg-gradient-to-br from-[#e6eef7] to-[#d0e1f3] border-3 border-black p-6 rounded-2xl box-shadow-flat flex flex-col justify-between min-h-[160px] group transition-all">
      <div class="text-xs font-black uppercase tracking-wider text-slate-500 font-mono"></div>
      <div class="text-xl font-black uppercase tracking-tight text-black group-hover:text-[#2563eb] transition-colors">
        Manage Events &rarr;
      </div>
      <div class="text-xs font-bold text-slate-600">Edit, add, or delete events.</div>
    </a>
  </section>
</div>

<style>
  .box-shadow-flat { box-shadow: 6px 6px 0px 0px #000000; }
</style>