<script>
  import { fade, fly } from 'svelte/transition';

  // State Management
  let name = $state("");
  let email = $state("");
  let category = $state("General Inquiry");
  let message = $state("");
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let errorMessage = $state("");
  let scrollY = $state(0);

  async function handleSubmit(e) {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = "";

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, category, message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again later.');
      }

      submitted = true;
    } catch (error) {
      errorMessage = error.message || 'Something went wrong.';
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    name = "";
    email = "";
    category = "General Inquiry";
    message = "";
    submitted = false;
    errorMessage = "";
  }

  // Parallax Values
  let parallaxHeaderY = $derived(scrollY * 0.25);
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>Contact Us | Connecticut FTC</title>
</svelte:head>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] pb-24 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  <section class="relative pt-20 pb-12 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#e6eef7]">
    <div class="max-w-6xl mx-auto text-left space-y-5 z-10" style="transform: translateY({parallaxHeaderY}px)">
      
      <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-1.5 box-shadow-flat transform -rotate-1">
        Get in Touch
      </span>
      
      <h1 class="text-4xl md:text-6xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        Let's Build <span class="text-[#2563eb] bg-white border-4 border-black px-3 inline-block my-1 box-shadow-flat transform rotate-1">The Future</span>
      </h1>
      
      <p class="text-slate-800 text-sm md:text-base font-bold max-w-xl bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl leading-relaxed">
        Have questions about starting a local team, managing volunteer shifts, or sponsoring our tournament season? Drop us a line.
      </p>
    </div>
  </section>

  <div class="max-w-6xl mx-auto px-6 py-16 relative z-20">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      
      <div class="lg:col-span-5 space-y-10 text-left">
        <div>
          <span class="text-xs font-black text-white bg-black border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider mb-3">Contact Desk</span>
          <h2 class="text-2xl font-black text-black uppercase tracking-tight">Direct Channels</h2>
          <p class="text-xs font-bold text-slate-500 mt-1">Reach out directly to our specific team coordinators for faster processing.</p>
        </div>

        <div class="space-y-6">
          <div class="bg-white border-3 border-black p-5 rounded-2xl box-shadow-flat flex gap-4 items-start">
            <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center text-xl shrink-0">
              ✉️
            </div>
            <div class="space-y-1">
              <h4 class="font-black text-black uppercase text-sm tracking-tight">Email Addresses</h4>
              <p class="text-slate-600 text-xs font-bold">General Inquiries: <a href="mailto:info@ctftc.org" class="text-[#2563eb] hover:underline">info@ctftc.org</a></p>
              <p class="text-slate-600 text-xs font-bold">Volunteer Operations: <a href="mailto:volunteers@ctftc.org" class="text-[#2563eb] hover:underline">volunteers@ctftc.org</a></p>
            </div>
          </div>

          <div class="bg-white border-3 border-black p-5 rounded-2xl box-shadow-flat flex gap-4 items-start">
            <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center text-xl shrink-0">
              📍
            </div>
            <div class="space-y-1">
              <h4 class="font-black text-black uppercase text-sm tracking-tight">Mailing Address</h4>
              <p class="text-slate-600 text-xs font-bold">NE FIRST / Connecticut FTC</p>
              <p class="text-slate-600 text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded border inline-block mt-0.5">P.O. Box [Your Box], CT 06XXX</p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 w-full">
        <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[3rem] p-6 md:p-10 border-2 border-white/60 relative overflow-hidden">
          
          {#if submitted}
            <div in:fly={{ y: 20, duration: 400 }} class="h-full py-12 flex flex-col items-center justify-center text-center">
              <div class="w-20 h-20 bg-white border-4 border-black text-emerald-500 rounded-full flex items-center justify-center mb-6 box-shadow-flat text-3xl font-bold">
                ✓
              </div>
              <h3 class="text-2xl font-black text-black uppercase tracking-tight mb-2">Message Sent!</h3>
              <p class="text-sm font-bold text-slate-600 max-w-xs mx-auto leading-relaxed">
                Thank you for reaching out. A representative from our team will respond to your email within <span class="text-[#2563eb]">24 to 48 hours</span>.
              </p>
              
              <button onclick={resetForm} class="mt-8 text-xs font-black uppercase tracking-wider text-[#2563eb] hover:text-black transition-colors underline underline-offset-4">
                &larr; Send Another Message
              </button>
            </div>
          {:else}
            <form onsubmit={handleSubmit} class="space-y-6">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2 text-left">
                  <label for="name" class="text-[11px] font-black uppercase tracking-widest text-slate-500 block pl-1">Your Name</label>
                  <input type="text" id="name" bind:value={name} required disabled={isSubmitting} placeholder="e.g. Jane Doe" class="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold shadow-inner outline-none focus:border-[#2563eb] transition-colors disabled:opacity-50" />
                </div>
                
                <div class="space-y-2 text-left">
                  <label for="email" class="text-[11px] font-black uppercase tracking-widest text-slate-500 block pl-1">Email Address</label>
                  <input type="email" id="email" bind:value={email} required disabled={isSubmitting} placeholder="name@domain.com" class="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold shadow-inner outline-none focus:border-[#2563eb] transition-colors disabled:opacity-50" />
                </div>
              </div>

              <div class="space-y-2 text-left">
                <label for="cat" class="text-[11px] font-black uppercase tracking-widest text-slate-500 block pl-1">Inquiry Topic</label>
                <div class="relative">
                  <select id="cat" bind:value={category} disabled={isSubmitting} class="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold shadow-inner outline-none appearance-none focus:border-[#2563eb] transition-colors cursor-pointer disabled:opacity-50">
                    <option>General Inquiry</option>
                    <option>Team Support</option>
                    <option>Volunteering</option>
                    <option>Sponsorship</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-xs opacity-60">▼</div>
                </div>
              </div>

              <div class="space-y-2 text-left">
                <label for="msg" class="text-[11px] font-black uppercase tracking-widest text-slate-500 block pl-1">Message Detail</label>
                <textarea id="msg" rows="5" bind:value={message} required disabled={isSubmitting} placeholder="Write the details of your request here..." class="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold shadow-inner outline-none focus:border-[#2563eb] transition-colors resize-none disabled:opacity-50"></textarea>
              </div>

              {#if errorMessage}
                <div class="text-rose-600 text-xs font-bold text-left bg-rose-50 border-2 border-rose-600 rounded-xl p-3">
                  ⚠️ {errorMessage}
                </div>
              {/if}

              <button type="submit" disabled={isSubmitting} class="skeuo-button w-full bg-[#2563eb] text-white font-black uppercase tracking-widest py-4.5 rounded-2xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] transition-all text-sm disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? 'Sending Message...' : 'Send Message →'}
              </button>
            </form>
          {/if}
          
        </div>
      </div>

    </div>
  </div>
</main>

<style>
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .shadow-neumorphic-outer {
    box-shadow: 
      12px 12px 28px #bebebe, 
      -12px -12px 28px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  .shadow-neumorphic-inner {
    box-shadow: 
      inset 4px 4px 10px #cad4e2, 
      inset -4px -4px 10px #ffffff;
  }

  .shadow-skeuo {
    box-shadow: 0px 4px 0px #1d4ed8, 4px 8px 16px rgba(0, 0, 0, 0.12);
  }
  
  .skeuo-button:hover {
    box-shadow: 0px 3px 0px #1d4ed8, 2px 6px 12px rgba(0, 0, 0, 0.1);
  }

  .skeuo-button:active {
    box-shadow: 0px 0px 0px #1d4ed8, 0px 1px 3px rgba(0, 0, 0, 0.05);
  }

  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>