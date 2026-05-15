<script>
  // Logical separation of data
  const upcoming = [
    { id: 'river-hill', name: "River Hill Qualifier", date: "Nov 15, 2026", type: "Qualifier", spots: "4 Left" },
    { id: 'ct-states', name: "CT State Championship", date: "Feb 21, 2027", type: "Championship", spots: "Invite" }
  ];

  const past = [
    { id: 'scrimmage-25', name: "Shoreline Scrimmage", date: "Oct 12, 2025", winner: "Team 1234" },
    { id: 'kickoff-25', name: "Season Kickoff", date: "Sept 06, 2025", winner: "N/A" }
  ];
</script>

<div class="max-w-6xl mx-auto px-6 py-12">
  <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-16">
    <a href="/" class="hover:text-blue-600 transition-colors">Home</a>
    <span>/</span>
    <span class="text-blue-600">Events</span>
  </nav>

  <section class="mb-32">
    <div class="flex items-end justify-between mb-10">
      <div>
        <h2 class="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Next Challenges</h2>
        <h1 class="text-5xl font-black text-slate-900 italic uppercase">Future <span class="text-blue-600">Events</span></h1>
      </div>
      <div class="hidden md:block text-right">
        <p class="text-sm font-bold text-slate-400">2026-27 Season</p>
        <p class="text-xs text-slate-300 uppercase tracking-widest">Into the Deep™</p>
      </div>
    </div>

    <div class="grid gap-6">
      {#each upcoming as event}
        <a href="/events/{event.id}" class="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
          <div class="flex items-center gap-8">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <span class="text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</span>
               <span class="text-xl font-black">{event.date.split(' ')[1]}</span>
            </div>
            <div>
              <h3 class="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{event.name}</h3>
              <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">{event.type}</p>
            </div>
          </div>
          <div class="mt-6 md:mt-0 flex items-center gap-6">
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">{event.spots}</span>
            <div class="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section>
    <div class="flex items-center gap-4 mb-10">
      <h2 class="text-2xl font-black text-slate-400 uppercase italic tracking-tighter">Past <span class="text-slate-300">Archive</span></h2>
      <div class="h-px flex-grow bg-slate-100"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each past as event}
        <div class="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl flex justify-between items-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all">
          <div>
            <h4 class="font-bold text-slate-700">{event.name}</h4>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.date}</p>
          </div>
          <a href="/events/{event.id}" class="text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-600/20 hover:border-blue-600 transition-all">
            Review Stats
          </a>
        </div>
      {/each}
    </div>
  </section>
</div>