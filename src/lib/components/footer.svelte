<script>
const socials = [
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/ctfirsttechchallenge/', 
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' 
  },
  { 
    name: 'Discord', 
    href: 'https://discord.com/invite/GTPU98nWY9', 
    icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.298 12.298 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z' 
  },
  { 
    name: 'Facebook', 
    href: 'https://www.facebook.com/profile.php?id=61553396255140', 
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' 
  }
];
   let logo = '/ctftc.png';
</script>

<footer class="bg-[#eef2f7] border-t-4 border-black pt-20 pb-10 px-6 mt-20 relative overflow-hidden">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

  <div class="max-w-7xl mx-auto relative z-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-12 mb-16">
      
      <div class="md:col-span-4 space-y-6 text-left">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center font-mono font-black text-black shadow-skeuo-mini">
            <img src={logo} alt="CT Logo" class="w-full h-[90%] object-contain invert">
          </div>
          <img src="https://wpafbstem.com/FTC/img/FTC_logo.png" alt="FTC Logo" class="h-12 object-contain">
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


    </div>

    <div class="pt-8 border-t-2 border-dashed border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
        © 2026 CT FIRST Tech Challenge
      </p>
      <p> Made by <a href="https://singul.tech" target="_blank" rel="noopener noreferrer" class="font-bold text-[#2563eb] hover:underline">Singularity Technology #7034</a></p> <img src="https://api.singultech.app/get-image/Logo" alt="Singularity Technology Logo" class="w-20 h-20 ml-2 invert">
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