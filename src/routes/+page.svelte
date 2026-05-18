<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { fade, fly } from 'svelte/transition';

  // --- SVELTE 5 STATE RUNES ---
  let chartRoot = null;
  let isMapLoading = $state(true);
  let scrollY = $state(0);
  let mouseX = $state(0);
  let mouseY = $state(0);

  // --- DERIVED RUNES (2030 SCROLL ANIMATIONS MATRIX) ---
  // Calculates real-time 3D rotation, depth offsets, and scale matrices based on page scroll depth
  let parallaxHeroY = $derived(scrollY * 0.35);
  let mapRotateY = $derived((scrollY * 0.1) % 360);
  let mapTiltX = $derived(Math.min(scrollY * 0.08, 15));
  let glassLiftZ = $derived(Math.min(scrollY * 0.5, 80));
  let structuralScale = $derived(Math.max(1 - scrollY * 0.0005, 0.9));

  function handleMouseMove(e) {
    if (!browser) return;
    // Maps pointer offsets to slight coordinate variances for continuous 3D lighting tilts
    mouseX = (e.clientX / window.innerWidth - 0.5) * 25;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 25;
  }

  onMount(async () => {
    if (!browser) return;

    try {
      // 1. Dynamic imports for map dependencies
      const am5 = await import('@amcharts/amcharts5');
      const am5map = await import('@amcharts/amcharts5/map');
      const am5geodata_usaLow = (await import('@amcharts/amcharts5-geodata/usaLow')).default;
      const am5themes_Animated = (await import('@amcharts/amcharts5/themes/Animated')).default;

      // 2. Initialize Canvas Root Structure
      const root = am5.Root.new("chartdiv");
      chartRoot = root;
      root.setThemes([am5themes_Animated.new(root)]);

      // 3. Construct Orthographic Globe Chart (Skeuomorphic styling parameters)
      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: "rotateX",
          panY: "rotateY",
          projection: am5map.geoOrthographic(),
          paddingBottom: 20,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20
        })
      );

      // 4. Create Ocean Sphere Layer (Glassmorphic tint mapping)
      const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color(0xe0f2fe),
        stroke: am5.color(0x0284c7),
        strokeWidth: 2,
        fillOpacity: 0.4
      });
      backgroundSeries.pushDataItem({
        geometry: am5map.getGeoCircle([{ longitude: 0, latitude: 0 }], 360)
      });

      // 5. Create USA Landmass Layer (Neo-Brutalism physical solid outlines)
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, { geoJSON: am5geodata_usaLow })
      );
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0x1e293b),
        stroke: am5.color(0xf8fafc),
        strokeWidth: 1.5,
        interactive: true
      });

      // 6. Define Connecticut Marker Core Pin
      const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      pointSeries.pushDataItem({ longitude: -72.7, latitude: 41.6 });

      pointSeries.bullets.push(function() {
        const circle = am5.Circle.new(root, {
          radius: 8,
          fill: am5.color(0x2563eb),
          stroke: am5.color(0xfacc15),
          strokeWidth: 3
        });
        return am5.Bullet.new(root, { sprite: circle });
      });

      isMapLoading = false;

      // 7. Core Camera Entry Animation Sequences
      chart.animate({
        key: "rotationX",
        from: -180,
        to: -72.7,
        duration: 2500,
        easing: am5.ease.out(am5.ease.cubic)
      });

      chart.animate({
        key: "rotationY",
        from: 0,
        to: 41.6,
        duration: 2500,
        easing: am5.ease.out(am5.ease.cubic)
      });

      setTimeout(() => {
        chart.zoomToGeoPoint({ longitude: -72.7, latitude: 41.6 }, 14, true, 2500);
      }, 2200);

    } catch (error) {
      console.error("Failed to load map engine layers:", error);
    }
  });

  onDestroy(() => {
    if (chartRoot) chartRoot.dispose();
  });
</script>

<svelte:window bind:scrollY on:mousemove={handleMouseMove} />

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] font-sans perspective-container overflow-x-hidden">
  
  <section class="relative min-h-[100vh] flex items-center justify-center py-20 px-6 border-b-4 border-black bg-gradient-to-br from-[#eef2f7] to-[#d8e2ef] overflow-hidden">
    
    <div class="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
      
      <div class="lg:col-span-6 space-y-8 text-left" style="transform: translateY({parallaxHeroY}px)">
        
        <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-2 box-shadow-flat transform -rotate-1">
          <span class="w-3 h-3 rounded-full bg-black {isMapLoading ? 'animate-ping' : 'animate-pulse'}"></span>
          {#if isMapLoading}SYSTEM: SYNCING CORES...{:else}CONNECTICUT CORE INTERFACE LIVE{/if}
        </span>

        <h1 class="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter uppercase">
          Building the Future, <br />
          <span class="text-[#2563eb] bg-white border-4 border-black px-3 inline-block my-2 box-shadow-flat transform rotate-1">Right Here in CT</span>
        </h1>

        <p class="text-slate-800 text-base md:text-xl font-bold leading-relaxed max-w-xl bg-white/40 backdrop-blur-sm p-4 border-2 border-black rounded-xl">
          Welcome to the control deck of Connecticut FIRST Tech Challenge. Connecting local structural teams, telemetry pipelines, and industry mentors to forge competitive robotics excellence.
        </p>

        <div class="flex flex-wrap gap-6 pt-4">
          <a href="/events" class="skeuo-button bg-[#2563eb] text-white text-sm font-black uppercase tracking-wider px-8 py-4 rounded-2xl border-2 border-[#1d4ed8] shadow-skeuo hover:translate-y-[1px] active:translate-y-[4px] transition-all">
            View Local Events
          </a>
          <a href="/volunteer" class="brutalist-btn bg-[#facc15] text-black text-sm font-black uppercase tracking-wider px-8 py-4 border-3 border-black box-shadow-flat transition-transform hover:-translate-y-1">
            Get Involved &rarr;
          </a>
        </div>
      </div>

      <div class="lg:col-span-6 flex flex-col justify-center items-center w-full relative">
        
        <div class="relative w-full max-w-lg aspect-square bg-[#eef2f7] rounded-[3.5rem] p-4 border-2 border-white/60 shadow-neumorphic-outer group transition-all duration-300 ease-out"
             style="transform: scale({structuralScale}) rotateY({mouseX + mapRotateY}deg) rotateX({-mouseY + mapTiltX}deg)">
          
          <div class="w-full h-full rounded-[2.8rem] bg-[#eef2f7] shadow-neumorphic-inner p-4 relative overflow-hidden border border-slate-200/50">
            
            {#if isMapLoading}
              <div class="absolute inset-0 p-8 flex flex-col justify-between items-center bg-[#eef2f7] z-20 animate-pulse rounded-[2.8rem]">
                <div class="w-full flex justify-between items-center border-b-2 border-black/10 pb-4">
                  <div class="flex gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-slate-400/50 shadow-inner"></div>
                    <div class="w-3.5 h-3.5 rounded-full bg-slate-400/50 shadow-inner"></div>
                    <div class="w-3.5 h-3.5 rounded-full bg-slate-400/50 shadow-inner"></div>
                  </div>
                  <div class="w-32 h-4 bg-slate-400/40 rounded-full"></div>
                </div>
                <div class="w-[70%] h-[70%] rounded-full bg-[#eef2f7] shadow-neumorphic-inner border-4 border-dashed border-slate-300/60 flex items-center justify-center animate-spin-slow"></div>
                <div class="w-1/2 h-4 bg-slate-400/40 rounded-full"></div>
              </div>
            {/if}

            <div id="chartdiv" class="w-full h-full min-h-[360px] lg:min-h-[420px] transition-opacity duration-700 {isMapLoading ? 'opacity-0' : 'opacity-100'}"></div>
          </div>

          {#if !isMapLoading}
            <div class="absolute bottom-[-30px] right-[-20px] left-[40px] md:left-[100px] bg-white/30 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-2xl transition-transform duration-100 ease-out z-30"
                 style="transform: translateZ({glassLiftZ}px) translateY({-scrollY * 0.1}px)">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer flex items-center justify-center text-xl shrink-0 border border-white/40">🔮</div>
                <div class="space-y-0.5 text-left">
                  <span class="block text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Camera Interactivity Link</span>
                  <p class="text-xs font-black text-black uppercase">Scroll or Drag Pointer to Modify Globe Orbit Telemetry</p>
                </div>
              </div>
            </div>
          {/if}

        </div>
      </div>

    </div>
  </section>

  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="bg-[#eef2f7] shadow-neumorphic-outer rounded-[3rem] p-8 md:p-16 border-2 border-white/60 grid lg:grid-cols-12 gap-16 items-center">
      
      <div class="lg:col-span-7 space-y-6 text-left">
        <span class="text-xs font-black text-[#2563eb] bg-white border-2 border-black px-3 py-1 box-shadow-flat inline-block uppercase tracking-wider">More Than Robots</span>
        <h2 class="text-4xl font-black text-black uppercase tracking-tight">The FIRST Experience Matrix</h2>
        <p class="text-slate-700 leading-relaxed font-semibold text-base">
          FIRST Tech Challenge teams engineer, program, and operate Android-platform structural hardware deployments to compete in an alliance framework matrix. Guided by professional engineers, students map live data telemetry parameters while assembling competitive engineering profiles.
        </p>
        
        <div class="border-l-8 border-black pl-5 py-3 bg-[#facc15]/20 border-2 border-black rounded-xl box-shadow-flat text-left">
          <p class="font-mono text-sm font-black text-black">
            "Gracious Professionalism means competing fiercely at structural capacities while treating all human nodes with intrinsic value and mutual respect."
          </p>
        </div>
      </div>
      
      <div class="lg:col-span-5 bg-black border-4 border-black p-4 rounded-2xl shadow-skeuo aspect-video flex flex-col items-center justify-center text-center relative overflow-hidden group/crt">
        <div class="absolute inset-0 bg-crt-scanlines opacity-25 pointer-events-none z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
        <span class="text-4xl mb-2 animate-pulse z-0">🤖</span>
        <span class="text-[10px] font-mono font-bold tracking-widest text-emerald-400 z-0 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-md">
          [ DECK LOG: SEASON GAME REVEAL MEDIA HUB ]
        </span>
      </div>

    </div>
  </section>

  <section class="py-16 px-6 max-w-7xl mx-auto border-t-4 border-black">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <div class="bg-white border-3 border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-2xl mb-6">📅</div>
          <h3 class="text-xl font-black text-black uppercase mb-3">Tournaments & Scrimmages</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            Track schedules, structural location coordinates, regional parameters, and qualifying structures for upcoming championship match layers.
          </p>
        </div>
        <a href="/events" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          Explore schedule <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="bg-white border-3 border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-2xl mb-6">📊</div>
          <h3 class="text-xl font-black text-black uppercase mb-3">CT Team Registry</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            Explore live ranking matrices, historical analytics records, robot weight specifications, and performance tracking profiles.
          </p>
        </div>
        <a href="/teams" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          Launch Team Explorer <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="bg-white border-3 border-black p-8 rounded-2xl box-shadow-flat hover:translate-y-[-4px] hover:box-shadow-flat-hover transition-all text-left flex flex-col justify-between group sm:col-span-2 lg:col-span-1">
        <div>
          <div class="w-12 h-12 rounded-xl bg-[#eef2f7] shadow-neumorphic-outer border border-white/60 flex items-center justify-center text-2xl mb-6">🤝</div>
          <h3 class="text-xl font-black text-black uppercase mb-3">Volunteer Network</h3>
          <p class="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
            Access documentation guidelines to join structural arrays as an active match referee, tech notebook controller, or design award judge.
          </p>
        </div>
        <a href="/volunteer" class="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2563eb] group-hover:underline">
          See how to join <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

    </div>
  </section>
</main>

<style>
  /* --- CUSTOM HYBRID ARCHITECTURE STRUCTURAL GLASS/NEU RELEASES --- */
  
  .perspective-container {
    perspective: 1600px;
  }

  /* Blueprint Grid Pattern Generation Overlay */
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image: 
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  /* CRT Analog Monitoring Artifact Overlay Lines */
  .bg-crt-scanlines {
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 4px, 6px 100%;
  }

  /* Tactile Neomorphic Soft Outward Convex Shadow Matrices */
  .shadow-neumorphic-outer {
    box-shadow: 
      12px 12px 28px #bebebe, 
      -12px -12px 28px #ffffff,
      inset 1px 1px 0px rgba(255,255,255,0.9);
  }

  /* Deep Neomorphic Recessed Inward Concave Intaglio Channels */
  .shadow-neumorphic-inner {
    box-shadow: 
      inset 6px 6px 12px #d1d9e6, 
      inset -6px -6px 12px #ffffff;
  }

  /* Mechanical Convex Skeuomorphic Push-Buttons */
  .shadow-skeuo {
    box-shadow: 
      0px 4px 0px #1d4ed8,
      4px 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  .skeuo-button:hover {
    box-shadow: 
      0px 3px 0px #1d4ed8,
      2px 6px 12px rgba(0, 0, 0, 0.12);
  }

  .skeuo-button:active {
    box-shadow: 
      0px 0px 0px #1d4ed8,
      0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Hard Heavy-Edged Neo-Brutalism Shadow Blocks */
  .box-shadow-flat {
    box-shadow: 6px 6px 0px 0px #000000;
  }
  
  .box-shadow-flat-hover {
    box-shadow: 10px 10px 0px 0px #000000;
  }

  /* Custom Slow Animation Utilities */
  .animate-spin-slow {
    animation: spin 25s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>