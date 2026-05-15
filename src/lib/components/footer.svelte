<script>
  const socials = [
    { name: 'Instagram', href: 'https://instagram.com/ct_ftc', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z' },
    { name: 'Discord', href: '#', icon: 'M20.222 0c1.406 0 2.54 1.133 2.54 2.54v16.27c0 1.407-1.134 2.54-2.54 2.54H3.778c-1.406 0-2.54-1.133-2.54-2.54V2.54C1.238 1.133 2.372 0 3.778 0h16.444zM16.92 13.916s-.44-.526-.803-.988c1.604-.452 2.215-1.46 2.215-1.46-.504.333-.984.567-1.412.72-.61.254-1.192.42-1.758.52-.375.066-.714.108-1.02.13-.67.043-1.28.016-1.833-.075-.38-.06-.757-.16-1.14-.3-.242-.086-.47-.193-.687-.31-.035-.018-.067-.035-.1-.055-.02-.01-.033-.02-.053-.03-.23-.133-.39-.24-.512-.338 0 0-.61.996 2.19 1.463-.362.46-.814 1.002-.814 1.002-3.11-.1-4.286-2.133-4.286-2.133 0-4.516 2.023-8.178 2.023-8.178 2.023-1.516 3.953-1.472 3.953-1.472l.142.164c-2.423.696-3.533 1.76-3.533 1.76s.296-.16.8-.4c1.453-.637 2.613-.807 3.1-.827.086-.01.17-.02.256-.026.545-.05 1.157-.05 1.833.02 1.04.107 2.186.413 3.393 1.053 0 0-1.066-1.013-3.353-1.68l.19-.22s1.93-.044 3.953 1.47c0 0 2.023 3.662 2.023 8.18 0 0-1.18 2.03-4.29 2.132z' },
    { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }
  ];
</script>

<footer class="bg-white border-t border-slate-200 pt-20 pb-10 px-6 mt-20">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      
      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">CT</div>
          <span class="font-black text-xl text-slate-900 italic">FTC</span>
        </div>
        <p class="text-sm text-slate-500 leading-relaxed">
          Inspiring CT students through competitive robotics. Part of the NE FIRST network.
        </p>
        <div class="flex gap-4">
          {#each socials as social}
            <a href={social.href} class="text-slate-400 hover:text-blue-600 transition-colors" aria-label={social.name}>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d={social.icon}/></svg>
            </a>
          {/each}
          <a href="mailto:info@ctftc.org" class="text-slate-400 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </a>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
        <ul class="space-y-4 text-sm text-slate-500">
          <li><a href="/events" class="hover:text-blue-600">Event Schedule</a></li>
          <li><a href="/teams" class="hover:text-blue-600">Team Directory</a></li>
          <li><a href="/volunteers" class="hover:text-blue-600">Volunteer Info</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Affiliates</h4>
        <ul class="space-y-4 text-sm text-slate-500">
          <li><a href="https://nefirst.org" class="hover:text-blue-600">NE FIRST</a></li>
          <li><a href="https://firstinspires.org" class="hover:text-blue-600">FIRST Global</a></li>
        </ul>
      </div>

      <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h4 class="font-bold text-blue-900 mb-2 text-sm">Join the Community</h4>
        <p class="text-xs text-blue-700/70 mb-4 leading-relaxed">Stay updated on qualifiers and championship details.</p>
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">Join Discord</button>
      </div>
    </div>

    <div class="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 CT FIRST Tech Challenge</p>
      <a href="/contact" class="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Get Support</a>
    </div>
  </div>
</footer>