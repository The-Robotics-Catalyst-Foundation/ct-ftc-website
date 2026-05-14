<script>
  import { page } from '$app/stores';
  
  const navLinks = [
    { name: 'Events', href: '/events' },
    { name: 'Teams', href: '/teams' },
    { name: 'Volunteers', href: '/volunteers' },
    { name: 'Contact', href: '/contact' }
  ];
</script>

<div class="fixed top-6 left-0 right-0 z-[100] px-6 flex justify-center pointer-events-none">
  <nav class="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-full px-2 py-2 flex items-center gap-1">
    
    <a href="/" class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white font-black italic hover:scale-110 transition-transform">
      CT
    </a>

    <div class="flex items-center px-2">
      {#each navLinks as link}
        <a 
          href={link.href} 
          class="px-5 py-2 rounded-full text-sm font-bold tracking-tight transition-all
          {$page.url.pathname.startsWith(link.href) 
            ? 'bg-slate-900 text-white' 
            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}"
        >
          {link.name}
        </a>
      {/each}
    </div>

    <a 
      href="https://atlas.robotics-catalyst.org/" 
      target="_blank"
      class="hidden md:block bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
    >
      Atlas
    </a>
  </nav>
</div>

<div class="h-24"></div>