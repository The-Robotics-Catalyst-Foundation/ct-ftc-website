<script>
  import { page } from '$app/stores';

  // 1. Get Event ID
  const eventId = $page.params.slug;

  // 2. Logic to determine if event is in the past
  // In a real app, this date comes from your database/API
  const eventDateValue = new Date("2025-11-15"); 
  const today = new Date();
  
  // Boolean check: Is today's date greater than the event date?
  const isPastEvent = today > eventDateValue;

  // 3. Mock Data
  const event = {
    name: "River Hill Qualifier",
    date: "Nov 15, 2025",
    location: "River Hill High School",
    mapUrl: "https://maps.google.com",
    // Data for Future Mode
    signupUrl: "https://firstinspires.org",
    // Data for Past Mode
    winners: [{ award: "Inspire", team: "1234" }, { award: "Winning Alliance", team: "5678" }],
    photos: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400", "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400"]
  };
</script>

<div class="max-w-6xl mx-auto px-6 py-12">
  
  <header class="mb-12">
    <div class="flex items-center gap-3 mb-4">
      <span class="px-3 py-1 {isPastEvent ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'} text-[10px] font-black uppercase tracking-widest rounded-md">
        {isPastEvent ? 'Archived' : 'Upcoming'}
      </span>
    </div>
    <h1 class="text-6xl font-black text-slate-900 italic tracking-tighter uppercase">
      {event.name}
    </h1>
  </header>

  {#if isPastEvent}
    <div class="grid lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="lg:col-span-7 space-y-12">
        <section>
          <h3 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-6">Trophy Room</h3>
          <div class="grid gap-4">
            {#each event.winners as winner}
              <div class="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex justify-between items-center">
                <span class="font-bold text-slate-900">{winner.award} Award</span>
                <span class="font-mono bg-white px-3 py-1 rounded-lg border border-blue-100 text-blue-600">#{winner.team}</span>
              </div>
            {/each}
          </div>
        </section>
      </div>

      <div class="lg:col-span-5">
        <h3 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-6">Event Gallery</h3>
        <div class="grid grid-cols-2 gap-4">
          {#each event.photos as photo}
            <div class="aspect-square rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={photo} alt="Action" class="w-full h-full object-cover saturate-[0.7]" />
            </div>
          {/each}
        </div>
      </div>
    </div>

  {:else}
    <div class="grid lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div class="lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-blue-900/5">
        <div class="grid md:grid-cols-2 gap-10">
          <div>
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Logistics</h3>
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <p class="font-bold text-slate-900">{event.date}</p>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <a href={event.mapUrl} target="_blank" class="font-bold text-blue-600 hover:underline">{event.location}</a>
              </div>
            </div>
          </div>
          
          <div class="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 class="text-xl font-bold mb-4">Registration</h3>
            <p class="text-sm text-slate-400 mb-8">Signups close one week prior to the event date. Verify your team roster in VMS.</p>
            <a href={event.signupUrl} class="block w-full text-center bg-blue-600 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all">
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>