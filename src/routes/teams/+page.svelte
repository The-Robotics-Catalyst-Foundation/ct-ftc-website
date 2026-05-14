<script>
  // You can adjust the height based on how much of the atlas you want to show
  let iframeHeight = "800px";
</script>

<div class="max-w-7xl mx-auto px-6 py-12">
  <header class="mb-10">
    <div class="flex items-center gap-3 mb-2">
      <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-widest">
        Live Data
      </span>
    </div>
    <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
      CT Team <span class="text-blue-600">Explorer</span>
    </h1>
    <p class="mt-4 text-slate-500 max-w-2xl leading-relaxed">
      Powered by Atlas, explore real-time rankings, match history, and performance metrics for all teams within the Connecticut region.
    </p>
  </header>

  <div class="relative group">
    <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
    
    <div class="relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/5">
      <div class="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-slate-300"></div>
          <div class="w-3 h-3 rounded-full bg-slate-300"></div>
          <div class="w-3 h-3 rounded-full bg-slate-300"></div>
        </div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">atlas.robotics-catalyst.org</span>
      </div>

      <iframe
        src="https://atlas.robotics-catalyst.org/"
        title="CT FTC Team Atlas"
        width="100%"
        height={iframeHeight}
        frameborder="0"
        allowfullscreen
        class="w-full"
      ></iframe>
    </div>
  </div>

  <div class="mt-12 p-8 bg-blue-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
    <div>
      <h3 class="text-xl font-bold mb-2">Don't see your team?</h3>
      <p class="text-blue-200 text-sm">Ensure your team information is up to date on the FIRST Dashboard to sync with regional trackers.</p>
    </div>
    <a href="https://firstinspires.org" target="_blank" class="px-6 py-3 bg-white text-blue-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
      Official Dashboard
    </a>
  </div>
</div>