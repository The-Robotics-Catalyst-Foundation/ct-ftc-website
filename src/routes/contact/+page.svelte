<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { Mail, Check, TriangleAlert } from '@lucide/svelte';
  // Import PocketBase
  import { pb } from '$lib/pocketbase';

  // Svelte 5 direct destructuring without explicit interface types
  let { data = { upcoming: [] } } = $props();

  // State Management (Svelte 5 Runes)
  let name = $state("");
  let email = $state("");
  let category = $state("general"); 
  let message = $state("");
  let submitted = $state(false);
  let isSubmitting = $state(false);
  let errorMessage = $state("");
  let scrollY = $state(0);

  // Monitors the URL path anchor fragment for automatic dropdown updates
  function evaluateUrlHash(): void {
    if (typeof window !== 'undefined' && window.location.hash === '#volunteer') {
      category = "volunteer";
      
      // Target and smoothly scroll to the form element block
      const formBlock = document.getElementById('contact-form-block');
      if (formBlock) {
        formBlock.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onMount(() => {
    evaluateUrlHash();
    window.addEventListener('hashchange', evaluateUrlHash);
    return () => {
      window.removeEventListener('hashchange', evaluateUrlHash);
    };
  });

  // Social Channels Array
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

  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = "";

    try {
      await pb.collection('contact').create({
        name,
        email,
        category,
        message
      });

      setTimeout(() => {
        submitted = true;
        isSubmitting = false;
      }, 1200);

    } catch (error: any) {
      errorMessage = error.message || 'Could not communicate with database.';
      isSubmitting = false;
    }
  }

  function resetForm(): void {
    name = "";
    email = "";
    category = "general";
    message = "";
    submitted = false;
    errorMessage = "";
    isSubmitting = false;
  }

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
        Have questions about starting a local team, managing volunteer shifts, or sponsoring our tournament season?
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
            <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-inner border border-slate-300/40 flex items-center justify-center shrink-0">
              <Mail class="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div class="space-y-1">
              <h4 class="font-black text-black uppercase text-sm tracking-tight">Email Addresses</h4>
              <p class="text-slate-600 text-xs font-bold"> <a href="mailto:contact@connecticutftc.org" class="text-[#2563eb] hover:underline">contact@connecticutftc.org</a></p>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest pl-1 mb-4">Connect With Us</h4>
          <div class="flex flex-wrap gap-4">
            {#each socials as social}
              <a 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={social.name}
                class="bg-white border-3 border-black p-3.5 rounded-xl box-shadow-flat hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all flex items-center justify-center"
              >
                <svg class="w-5 h-5 fill-black" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={social.icon} />
                </svg>
                <span class="sr-only">{social.name}</span>
              </a>
            {/each}
          </div>
        </div>
      </div>

      <div id="contact-form-block" class="lg:col-span-7 w-full">
        <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[3rem] p-6 md:p-10 border-2 border-white/60 relative overflow-hidden">
          
          {#if submitted}
            <div in:fly={{ y: 20, duration: 400 }} class="h-full py-12 flex flex-col items-center justify-center text-center">
              <div class="w-20 h-20 bg-white border-4 border-black text-emerald-500 rounded-full flex items-center justify-center mb-6 box-shadow-flat">
                <Check class="w-10 h-10" strokeWidth={3} />
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
                    <option value="general">General Inquiry</option>
                    <option value="team">Team Support</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="sponsorship">Sponsorship</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-xs opacity-60">▼</div>
                </div>
              </div>

              <div class="space-y-2 text-left">
                <label for="msg" class="text-[11px] font-black uppercase tracking-widest text-slate-500 block pl-1">Message Detail</label>
                <textarea id="msg" rows="5" bind:value={message} required disabled={isSubmitting} placeholder="Write the details of your request here..." class="w-full bg-white border-2 border-black rounded-xl px-4 py-3.5 text-sm font-bold shadow-inner outline-none focus:border-[#2563eb] transition-colors resize-none disabled:opacity-50"></textarea>
              </div>

              {#if errorMessage}
                <div class="text-rose-600 text-xs font-bold text-left bg-rose-50 border-2 border-rose-600 rounded-xl p-3 flex items-center gap-2">
                  <TriangleAlert class="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  {errorMessage}
                </div>
              {/if}

              <button 
                type="submit" 
                disabled={isSubmitting} 
                class="button w-full"
                class:is-submitting={isSubmitting}
              >
                <div class="outline"></div>
                
                <div class="state state--default" class:hidden-state={isSubmitting}>
                  <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="1.2em" width="1.2em">
                      <g style="filter: url(#shadow)">
                        <path fill="currentColor" d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"></path>
                        <path fill="currentColor" d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"></path>
                      </g>
                      <defs>
                        <filter id="shadow">
                          <feDropShadow flood-opacity="0.6" stdDeviation="0.8" dy="1" dx="0"></feDropShadow>
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <p>
                    <span style="--i:0">S</span>
                    <span style="--i:1">e</span>
                    <span style="--i:2">n</span>
                    <span style="--i:3">d</span>
                    <span style="--i:4">&nbsp;</span>
                    <span style="--i:5">M</span>
                    <span style="--i:6">e</span>
                    <span style="--i:7">s</span>
                    <span style="--i:8">s</span>
                    <span style="--i:9">a</span>
                    <span style="--i:10">g</span>
                    <span style="--i:11">e</span>
                  </p>
                </div>

                <div class="state state--sent" class:visible-sent={isSubmitting}>
                  <div class="icon">
                    <svg stroke="black" stroke-width="0.5px" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g style="filter: url(#shadow)">
                        <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" fill="currentColor"></path>
                        <path d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z" fill="currentColor"></path>
                      </g>
                    </svg>
                  </div>
                  <p>
                    <span style="--i:5">S</span>
                    <span style="--i:6">e</span>
                    <span style="--i:7">n</span>
                    <span style="--i:8">t</span>
                    <span style="--i:9">!</span>
                  </p>
                </div>
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

  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }

  /* BUTTON STYLES */
  .button {
    --primary: #2563eb;
    --neutral-1: #ffffff;
    --neutral-2: #f3f4f6;
    --radius: 16px;

    cursor: pointer;
    border-radius: var(--radius);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    border: none;
    box-shadow:
      0 1px 1px rgba(255, 255, 255, 0.4),
      0 12px 24px rgba(0, 0, 0, 0.15),
      0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    min-width: 220px;
    padding: 22px;
    height: 72px;
    font-family: "Inter", system-ui, sans-serif;
    font-style: normal;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.2px;
    color: #1a1a1a;
  }

  .button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 2px 2px rgba(255, 255, 255, 0.4),
      0 18px 32px rgba(0, 0, 0, 0.15),
      0 8px 12px rgba(0, 0, 0, 0.1);
  }

  .button:active {
    transform: scale(1);
    box-shadow:
      0 0 1px 2px rgba(255, 255, 255, 0.3),
      0 10px 3px -3px rgba(0, 0, 0, 0.2);
  }
  
  .button:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    border: 2.5px solid transparent;
    background:
      linear-gradient(var(--neutral-1), var(--neutral-2)) padding-box,
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45)) border-box;
    z-index: 0;
    transition: all 0.4s ease;
  }
  
  .button:hover::after {
    transform: scale(1.05, 1.1);
    box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
  }
  
  .button::before {
    content: "";
    inset: 7px 6px 6px 6px;
    position: absolute;
    background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
    border-radius: 30px;
    filter: blur(0.5px);
    z-index: 2;
  }
  
  .state p {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    position: relative;
  }
  
  .state .icon {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    transform: scale(1.25);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }
  
  .state .icon svg {
    overflow: visible;
  }

  .outline {
    position: absolute;
    border-radius: inherit;
    overflow: hidden;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.4s ease;
    inset: -2px -3.5px;
  }
  
  .outline::before {
    content: "";
    position: absolute;
    inset: -100%;
    background: conic-gradient(
      from 180deg,
      transparent 60%,
      var(--primary) 85%,
      transparent 100%
    );
    animation: spin 2.5s linear infinite;
    animation-play-state: paused;
    opacity: 0.7;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .button:hover .outline {
    opacity: 1;
  }
  
  .button:hover .outline::before {
    animation-play-state: running;
  }

  .state p span {
    display: block;
    opacity: 0;
    animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
  }
  
  .button:hover p span {
    opacity: 1;
    animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
  }
  
  .button.is-submitting p span {
    opacity: 1;
    animation: disappear 0.6s ease forwards calc(var(--i) * 0.03s);
  }
  
  @keyframes wave {
    30% {
      opacity: 1;
      transform: translateY(4px) translateX(0) rotate(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-4px) translateX(0) rotate(0);
      color: var(--primary);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(0) rotate(0);
    }
  }
  
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-20px) translateX(5px) rotate(-90deg);
      color: var(--primary);
      filter: blur(5px);
    }
    30% {
      opacity: 1;
      transform: translateY(4px) translateX(0) rotate(0);
      filter: blur(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-3px) translateX(0) rotate(0);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(0) rotate(0);
    }
  }
  
  @keyframes disappear {
    from { opacity: 1; }
    to {
      opacity: 0;
      transform: translateX(5px) translateY(20px);
      color: var(--primary);
      filter: blur(5px);
    }
  }

  .state--default .icon svg {
    animation: land 0.6s ease forwards;
  }
  
  .button:hover .state--default .icon {
    transform: rotate(45deg) scale(1.25);
  }
  
  .button.is-submitting .state--default svg {
    animation: takeOff 0.8s linear forwards;
  }
  
  .button.is-submitting .state--default .icon {
    transform: rotate(0) scale(1.25);
  }
  
  @keyframes takeOff {
    0% { opacity: 1; }
    60% {
      opacity: 1;
      transform: translateX(80px) rotate(45deg) scale(2.2);
    }
    100% {
      opacity: 0;
      transform: translateX(180px) rotate(45deg) scale(0);
    }
  }
  
  @keyframes land {
    0% {
      transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2);
      opacity: 0;
      filter: blur(3px);
    }
    100% {
      transform: translateX(0) translateY(0) rotate(0);
      opacity: 1;
      filter: blur(0);
    }
  }

  .state--default .icon:before {
    content: "";
    position: absolute;
    top: 50%;
    height: 2px;
    width: 0;
    left: -5px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
  }
  
  .button.is-submitting .state--default .icon:before {
    animation: contrail 0.8s linear forwards;
  }
  
  @keyframes contrail {
    0% { width: 0; opacity: 1; }
    8% { width: 15px; }
    60% { opacity: 0.7; width: 80px; }
    100% { opacity: 0; width: 160px; }
  }

  .state {
    padding-left: 29px;
    z-index: 5;
    display: flex;
    position: relative;
  }
  
  .state--default span:nth-child(4) {
    margin-right: 5px;
  }
  
  .state--sent {
    display: none;
  }
  
  .state--sent svg {
    transform: scale(1.25);
    margin-right: 8px;
  }
  
  .hidden-state {
    position: absolute;
  }
  
  .button.is-submitting .visible-sent {
    display: flex;
  }
  
  .button.is-submitting .state--sent span {
    opacity: 0;
    animation: slideDown 0.8s ease forwards calc(var(--i) * 0.2s);
  }
  
  .button.is-submitting .state--sent .icon svg {
    opacity: 0;
    animation: appear 1.2s ease forwards 0.8s;
  }
  
  @keyframes appear {
    0% {
      opacity: 0;
      transform: scale(4) rotate(-40deg);
      color: var(--primary);
      filter: blur(4px);
    }
    30% {
      opacity: 1;
      transform: scale(0.6);
      filter: blur(1px);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
      filter: blur(0);
    }
    100% {
      opacity: 1;
    }
  }
</style>