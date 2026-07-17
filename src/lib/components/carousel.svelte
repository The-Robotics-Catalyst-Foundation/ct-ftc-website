<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  // Component Props (Accepts objects or raw string URLs fallback)
  let { images = [
    { src: 'https://cdn.singultech.app/mainSlideshow/robotinaction_1.jpg', alt: 'Robot in action' },
    { src: 'https://s3.us-west-1.amazonaws.com/ftcsim.org/Competition+Fields/2025_2026/Competition_2025_2026_Mecanum.jpeg', alt: 'Competition Field' }
  ] } = $props();

  // State Management
  let currentIndex = $state(0);

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
  }

  /** @param {number} index */
  function goToSlide(index) {
    currentIndex = index;
  }

  // Handle automatic transitions
  onMount(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  });
</script>

<div class="rounded-xl">
  
  <div class="relative aspect-[16/9] w-full bg-black/5">
    {#each images as img, i}
      {#if currentIndex === i}
        <div class=" w-full h-full" transition:fade={{ duration: 300 }}>
          <img 
            src={typeof img === 'string' ? img : img.src} 
            alt={img.alt || `Slide ${i + 1}`} 
            class="w-full h-full object-cover rounded-xl"
          />
          
          {#if img.caption}
            <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12 text-left">
              <p class="text-white font-bold text-sm md:text-base tracking-wide">{img.caption}</p>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1.5 rounded-full z-20 shadow-inner">
    {#each images as _, i}
      <button
        onclick={() => goToSlide(i)}
        class="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer {currentIndex === i ? 'bg-white scale-110 w-4' : 'bg-white/50 hover:bg-white/80'}"
        aria-label={`Go to slide ${i + 1}`}
        aria-current={currentIndex === i ? 'true' : undefined}
      ></button>
    {/each}
  </div>

</div>
