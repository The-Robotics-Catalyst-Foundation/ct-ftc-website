<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let ready = false;
  onMount(() => {
    ready = true;
    init3D();
  });

  // Simple Three.js Intro Animation for the background
  function init3D() {
    const canvas = document.querySelector('#hero-canvas');
    // Basic Three.js setup would go here to animate 
    // a 3D robot or abstract geometric shapes
  }
</script>

<section class="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
  
  <div class="absolute inset-0 -z-10 opacity-40">
    <canvas id="hero-canvas" class="w-full h-full"></canvas>
  </div>

  <div class="max-w-5xl w-full flex flex-col items-center text-center">
    
    {#if ready}
      <div in:fly={{ y: -20, duration: 800, delay: 200, easing: cubicOut }}>
        <span class="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block">
          Season 2025-26: Into the Deep
        </span>
      </div>

      <h1 
        in:fly={{ y: 30, duration: 1000, delay: 400, easing: cubicOut }}
        class="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] italic uppercase mb-8"
      >
        Building the <br />
        <span class="text-blue-600 underline decoration-blue-100">Future</span> of CT.
      </h1>

      <p 
        in:fade={{ duration: 1000, delay: 800 }}
        class="text-slate-500 text-lg md:text-xl max-w-2xl mb-12 font-medium"
      >
        Connecticut FIRST Tech Challenge is where code meets metal, and students become innovators. Join 50+ teams across the state.
      </p>

      <div 
        in:fly={{ y: 50, duration: 1200, delay: 1000, easing: cubicOut }}
        class="relative w-full max-w-4xl aspect-video bg-white border border-slate-200 rounded-[3rem] shadow-2xl shadow-blue-900/10 overflow-hidden group"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent"></div>
        <img 
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200" 
          alt="CT Robotics Action" 
          class="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-1000"
        />
        
        <div class="absolute bottom-8 left-8 right-8 flex justify-between items-center">
          <div class="bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
            Micro-rhythm / 01
          </div>
          <div class="bg-white/90 backdrop-blur text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
            Live Status: Active
          </div>
        </div>
      </div>

      <div 
        in:fade={{ delay: 1400 }}
        class="mt-12 flex flex-wrap gap-4 justify-center"
      >
        <a href="/events" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
          Find Events
        </a>
        <a href="/volunteers" class="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all">
          Volunteer
        </a>
      </div>
    {/if}
  </div>
</section>