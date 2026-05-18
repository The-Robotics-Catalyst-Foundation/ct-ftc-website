<script>
  const socials = [
    { name: 'Instagram', href: 'https://instagram.com/ct_ftc', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z' },
    { name: 'Discord', href: '#', icon: 'M20.222 0c1.406 0 2.54 1.133 2.54 2.54v16.27c0 1.407-1.134 2.54-2.54 2.54H3.778c-1.406 0-2.54-1.133-2.54-2.54V2.54C1.238 1.133 2.372 0 3.778 0h16.444zM16.92 13.916s-.44-.526-.803-.988c1.604-.452 2.215-1.46 2.215-1.46-.504.333-.984.567-1.412.72-.61.254-1.192.42-1.758.52-.375.066-.714.108-1.02.13-.67.043-1.28.016-1.833-.075-.38-.06-.757-.16-1.14-.3-.242-.086-.47-.193-.687-.31-.035-.018-.067-.035-.1-.055-.02-.01-.033-.02-.053-.03-.23-.133-.39-.24-.512-.338 0 0-.61.996 2.19 1.463-.362.46-.814 1.002-.814 1.002-3.11-.1-4.286-2.133-4.286-2.133 0-4.516 2.023-8.178 2.023-8.178 2.023-1.516 3.953-1.472 3.953-1.472l.142.164c-2.423.696-3.533 1.76-3.533 1.76s.296-.16.8-.4c1.453-.637 2.613-.807 3.1-.827.086-.01.17-.02.256-.026.545-.05 1.157-.05 1.833.02 1.04.107 2.186.413 3.393 1.053 0 0-1.066-1.013-3.353-1.68l.19-.22s1.93-.044 3.953 1.47c0 0 2.023 3.662 2.023 8.18 0 0-1.18 2.03-4.29 2.132z' },
    { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }
  ];
</script>

<footer class="bg-[#eef2f7] border-t-4 border-black pt-20 pb-10 px-6 mt-20 relative overflow-hidden">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

  <div class="max-w-7xl mx-auto relative z-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 mb-16">
      
      <div class="md:col-span-4 space-y-6 text-left">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center font-mono font-black text-black shadow-skeuo-mini">
            CT
          </div>
          <span class="font-black text-2xl text-black uppercase tracking-tight">FIRST Tech Challenge</span>
        </div>
        <p class="text-sm font-bold text-slate-700 leading-relaxed max-w-xs">
          Inspiring Connecticut student networks through high-caliber competitive robotics engineering. Part of the regional NE FIRST grid framework.
        </p>
        
        <div class="flex items-center gap-3 bg-[#eef2f7] shadow-neumorphic-inner px-3 py-2 rounded-xl w-max border border-slate-300/40">
          {#each socials as social}
            <a href={social.href} class="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#2563eb] hover:border-black transition-all hover:scale-105" aria-label={social.name}>
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={social.icon}/></svg>
            </a>
          {/each}
          <a href="mailto:info@ctftc.org" class="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#2563eb] hover:border-black transition-all hover:scale-105" aria-label="Email Support Pipe">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
        </div>
      </div>

      <div class="md:col-span-2 text-left md:pl-4">
        <h4 class="font-black text-black uppercase text-xs tracking-widest bg-white border border-black/10 px-2 py-1 inline-block rounded mb-6">Resources</h4>
        <ul class="space-y-4 text-sm font-bold text-slate-600">
          <li><a href="/events" class="hover:text-[#2563eb] transition-colors flex items-center gap-1.5">&rarr; Event Schedule</a></li>
          <li><a href="/teams" class="hover:text-[#2563eb] transition-colors flex items-center gap-1.5">&rarr; Team Directory</a></li>
          <li><a href="/volunteer" class="hover:text-[#2563eb] transition-colors flex items-center gap-1.5">&rarr; Volunteer Registry</a></li>
        </ul>
      </div>

      <div class="md:col-span-2 text-left">
        <h4 class="font-black text-black uppercase text-xs tracking-widest bg-white border border-black/10 px-2 py-1 inline-block rounded mb-6">Affiliates</h4>
        <ul class="space-y-4 text-sm font-bold text-slate-600">
          <li><a href="https://nefirst.org" target="_blank" rel="noopener noreferrer" class="hover:text-[#2563eb] transition-colors flex items-center gap-1.5">&rarr; NE FIRST</a></li>
          <li><a href="https://firstinspires.org" target="_blank" rel="noopener noreferrer" class="hover:text-[#2563eb] transition-colors flex items-center gap-1.5">&rarr; FIRST Global</a></li>
        </ul>
      </div>

      <div class="md:col-span-4 bg-[#eef2f7] shadow-neumorphic-outer border-2 border-white/60 p-6 rounded-3xl text-left relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none"></div>
        <h4 class="font-black text-black uppercase tracking-tight text-base mb-1">Join the Community</h4>
        <p class="text-xs font-semibold text-slate-600 mb-5 leading-relaxed">Stay updated on continuous regional qualifier match analytics and updates.</p>
        
        <button class="skeuo-button w-full bg-[#2563eb] text-white border-2 border-[#1d4ed8] py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-skeuo hover:translate-y-[1px] active:translate-y-[3px] transition-all">
          Join System Discord
        </button>
      </div>

    </div>

    <div class="pt-8 border-t-2 border-dashed border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
        © 2026 CT FIRST Tech Challenge // Core Array Online
      </p>
      <a href="/contact" class="text-[10px] font-mono font-black text-[#2563eb] uppercase tracking-widest bg-white border-2 border-black px-4 py-1.5 box-shadow-mini hover:translate-y-[-1px] active:translate-y-[1px] transition-all">
        Get Support Terminal
      </a>
    </div>

  </div>
</footer>

<style>
  /* Engineering Blueprint Vector Pattern Rules */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  /* Outward Convex Soft Neomorphic Shading Frames */
  .shadow-neumorphic-outer {
    box-shadow: 
      10px 10px 24px #bdc7d4, 
      -10px -10px 24px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  /* Deep Recessed Inverted Channels */
  .shadow-neumorphic-inner {
    box-shadow: 
      inset 4px 4px 8px #cad4e2, 
      inset -4px -4px 8px #ffffff;
  }

  /* Mechanical Convex Switch Depress Actions */
  .shadow-skeuo {
    box-shadow: 
      0px 4px 0px #1d4ed8,
      3px 6px 12px rgba(0, 0, 0, 0.1);
  }

  .shadow-skeuo-mini {
    box-shadow: 0px 3px 0px #000000;
  }
  
  .skeuo-button:hover {
    box-shadow: 
      0px 3px 0px #1d4ed8,
      1px 4px 8px rgba(0, 0, 0, 0.08);
  }

  .skeuo-button:active {
    box-shadow: 
      0px 0px 0px #1d4ed8,
      0px 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Micro Flat Brutalist Block Shadows */
  .box-shadow-mini {
    box-shadow: 3px 3px 0px 0px #000000;
  }
</style>