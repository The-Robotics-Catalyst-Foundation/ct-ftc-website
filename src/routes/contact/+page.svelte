<script>
  let name = "";
  let email = "";
  let category = "General Inquiry";
  let message = "";
  let submitted = false;

  function handleSubmit() {
    // In a real app, you'd send this to your backend/API
    console.log({ name, email, category, message });
    submitted = true;
  }
</script>

<div class="max-w-6xl mx-auto px-6 py-20">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
    
    <div>
      <h1 class="text-5xl font-black text-slate-900 tracking-tight mb-6">
        Let's build <span class="text-blue-600">the future.</span>
      </h1>
      <p class="text-lg text-slate-500 mb-12 leading-relaxed">
        Have questions about starting a team, volunteering, or sponsoring the CT regional championship? Our team is here to help.
      </p>

      <div class="space-y-8">
        <div class="flex gap-6 items-start">
          <div class="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <h4 class="font-bold text-slate-900">Email Us</h4>
            <p class="text-slate-500 text-sm">General: info@ctftc.org</p>
            <p class="text-slate-500 text-sm">Volunteers: volunteers@ctftc.org</p>
          </div>
        </div>

        <div class="flex gap-6 items-start">
          <div class="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h4 class="font-bold text-slate-900">Mailing Address</h4>
            <p class="text-slate-500 text-sm">NE FIRST / Connecticut FTC</p>
            <p class="text-slate-500 text-sm">P.O. Box [Your Box], CT 06XXX</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5">
      {#if submitted}
        <div class="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
          <p class="text-slate-500">We'll get back to you within 24-48 hours.</p>
          <button on:click={() => submitted = false} class="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="name" class="text-xs font-black uppercase tracking-widest text-slate-400">Your Name</label>
              <input type="text" id="name" bind:value={name} required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div class="space-y-2">
              <label for="email" class="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input type="email" id="email" bind:value={email} required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div class="space-y-2">
            <label for="cat" class="text-xs font-black uppercase tracking-widest text-slate-400">Inquiry Category</label>
            <select id="cat" bind:value={category} class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
              <option>General Inquiry</option>
              <option>Team Support</option>
              <option>Volunteering</option>
              <option>Sponsorship</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="msg" class="text-xs font-black uppercase tracking-widest text-slate-400">Your Message</label>
            <textarea id="msg" rows="5" bind:value={message} required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
          </div>

          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
            Send Message
          </button>
        </form>
      {/if}
    </div>

  </div>
</div>