<script>
  let navLinks = [
    { name: "The Challenge", href: "#about" },
    { name: "Team Map", href: "#map" },
    { name: "Start a Team", href: "#start" },
    { name: "Join a Team", href: "#join" }
  ];

  let socialLinks = [
    { name: "Instagram", icon: "📸", href: "https://instagram.com/ctfirst" },
    { name: "Facebook", icon: "👥", href: "https://facebook.com/ctfirst" },
    { name: "Twitter", icon: "🐦", href: "https://twitter.com/ctfirst" }
  ];
</script>

<div class="min-h-screen bg-[#050810] text-white font-sans selection:bg-blue-500/30">
  
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full"></div>
    <div class="absolute top-[20%] -right-[10%] w-[40%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full"></div>
  </div>

  <section id="about" class="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl mb-8">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      <span class="text-xs font-bold uppercase tracking-widest text-blue-300">2026 Season: BIOBUZZ™</span>
    </div>

    <h1 class="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-6">
      CONNECTICUT<br/>
      <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-900/50">FIRST TECH</span>
    </h1>
    <p class="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-light leading-relaxed mb-10">
      The premier middle and high school robotics league in the Constitution State. We don't just build robots; we build the future of Connecticut's workforce.
    </p>
    
    <div class="flex flex-wrap justify-center gap-4">
      <a href="https://www.firstinspires.org/register" target="_blank" class="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold shadow-[0_0_50px_-12px_rgba(37,99,235,0.6)] transition-all transform hover:-translate-y-1">
        Start a Team
      </a>
      <a href="#map" class="px-10 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl font-bold transition-all">
        Find Local Teams
      </a>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <div id="map" class="lg:col-span-8 group relative rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden aspect-video md:aspect-auto shadow-2xl transition-all hover:border-blue-500/40">
      <div class="absolute inset-0 bg-[url('https://firstmap.github.io/')] bg-cover opacity-20 contrast-125"></div>
      <div class="relative p-10 h-full flex flex-col justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">Team Locator</h2>
          <p class="text-slate-400 mt-2">Explore 100+ active FTC teams across CT school districts.</p>
        </div>
        <div class="flex gap-4">
          <a href="https://www.firstinspires.org/team-event-search" target="_blank" class="px-6 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm font-bold hover:bg-blue-500 transition">
            Open Interactive Map →
          </a>
        </div>
      </div>
    </div>

    <div class="lg:col-span-4 flex flex-col gap-8">
      <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 backdrop-blur-xl">
        <h3 class="text-xl font-bold mb-6">Stay Connected</h3>
        <div class="space-y-4">
          {#each socialLinks as social}
            <a href={social.href} class="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-blue-600/20 transition group">
              <span class="flex items-center gap-3 font-medium">
                <span class="text-xl">{social.icon}</span> {social.name}
              </span>
              <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </a>
          {/each}
        </div>
      </div>

      <div class="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex-grow">
        <h3 class="text-xl font-bold mb-4">Support & Growth</h3>
        <ul class="space-y-3 text-sm text-slate-400">
          <li>• Grants for new CT teams</li>
          <li>• Mentor matching programs</li>
          <li>• Local scrimmage hosting</li>
        </ul>
        <a href="mailto:support@ctfirst.org" class="mt-8 block text-center py-3 rounded-xl border border-white/10 hover:bg-white/5 transition text-xs font-bold uppercase tracking-widest">
          Contact Region Partner
        </a>
      </div>
    </div>
  </section>

  <section id="join" class="max-w-7xl mx-auto px-6 py-20">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div class="space-y-6">
        <h2 class="text-4xl font-bold italic">How to Start a Team</h2>
        <div class="space-y-8">
          <div class="flex gap-4">
            <span class="text-4xl font-black text-blue-600/40">01</span>
            <p class="text-slate-300"><strong class="text-white">Recruit:</strong> Find 2 adult coaches and up to 15 students (Grades 7-12).</p>
          </div>
          <div class="flex gap-4">
            <span class="text-4xl font-black text-blue-600/40">02</span>
            <p class="text-slate-300"><strong class="text-white">Register:</strong> Sign up at <a href="https://www.firstinspires.org" class="text-blue-400 underline">firstinspires.org</a> to get your team number.</p>
          </div>
          <div class="flex gap-4">
            <span class="text-4xl font-black text-blue-600/40">03</span>
            <p class="text-slate-300"><strong class="text-white">Build:</strong> Order your kit and start programming in Java or Blocks.</p>
          </div>
        </div>
      </div>
      
      <div class="bg-blue-600/10 rounded-[2.5rem] p-10 border border-blue-500/20 relative group">
        <div class="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full group-hover:scale-150 transition-transform"></div>
        <h2 class="text-4xl font-bold italic mb-6 text-blue-400">Join a Team</h2>
        <p class="text-slate-400 mb-8 leading-relaxed">
          Not ready to start your own? Use our **Team Search Tool** to find teams recruiting in your area. Most teams look for diverse skills: coding, CAD, marketing, and strategy.
        </p>
        <a href="https://www.firstinspires.org/team-event-search" target="_blank" class="inline-block px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-blue-500 hover:text-white transition-colors">
          Search CT Teams
        </a>
      </div>
    </div>
  </section>
</div>

<style>
  /* Optional: Smooth scrolling for nav links */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>