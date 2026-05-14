<script>
  const roles = [
    { title: 'Judges', desc: 'Interview teams and review engineering portfolios to decide award winners.' },
    { title: 'Referees', desc: 'Watch matches closely to ensure fair play and safety on the field.' },
    { title: 'Scorekeepers', desc: 'Manage the official scoring system and match timing.' },
    { title: 'Field Reset', desc: 'Quickly reset game elements between matches to keep the event on schedule.' },
    { title: 'Queuers', desc: 'Ensure teams are lined up and ready to compete for their matches.' },
    { title: 'Photographers', desc: 'Capture the action, the robots, and the smiles of the students.' }
  ];

  const steps = [
    { num: '01', title: 'Create Account', text: 'Sign up at firstinspires.org and complete your background screening.' },
    { num: '02', title: 'Apply to Event', text: 'Search for "FTC" events in Connecticut within the Volunteer Dashboard.' },
    { num: '03', title: 'Get Trained', text: 'Review role-specific manuals provided by FIRST to prepare for game day.' }
  ];
</script>

<div class="max-w-6xl mx-auto px-6 py-16">
  <header class="text-center mb-20">
    <h1 class="text-5xl font-black text-slate-900 mb-6">
      Volunteers make these <span class="text-blue-600 underline decoration-blue-200">events possible!</span>
    </h1>
    <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
      Every event needs roughly <strong>50 volunteers</strong> to serve in various capacities. 
      Whether you are a technical expert or just love supporting local students, we have a role for you.
    </p>
    <div class="mt-10">
      <a 
        href="https://www.firstinspires.org/volunteer" 
        target="_blank"
        class="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1"
      >
        Sign Up to Volunteer →
      </a>
    </div>
  </header>

  <section class="mb-24">
    <h2 class="text-3xl font-bold text-center mb-12 text-slate-900">How to Get Involved</h2>
    <div class="grid md:grid-cols-3 gap-8">
      {#each steps as step}
        <div class="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
          <span class="text-6xl font-black text-slate-50 absolute -top-2 -right-2 transition-colors group-hover:text-blue-50">
            {step.num}
          </span>
          <h3 class="text-xl font-bold text-blue-900 mb-4 relative z-10">{step.title}</h3>
          <p class="text-slate-600 text-sm leading-relaxed relative z-10">{step.text}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Roles We Need</h2>
      <p class="text-slate-400">There is a spot for everyone, regardless of your technical background.</p>
    </div>
    
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
      {#each roles as role}
        <div class="border-l-2 border-blue-500 pl-6">
          <h4 class="font-bold text-lg mb-2">{role.title}</h4>
          <p class="text-sm text-slate-400 leading-relaxed">{role.desc}</p>
        </div>
      {/each}
    </div>

    <div class="mt-16 pt-10 border-t border-white/10 text-center">
      <p class="text-blue-200 italic">...and many more! We also need technical inspectors, crowd control, and emcees!</p>
    </div>
  </section>

  <section class="mt-24 text-center">
    <div class="bg-blue-50 border border-blue-100 rounded-3xl p-10 max-w-3xl mx-auto">
      <h3 class="text-2xl font-bold text-blue-900 mb-4">First time volunteering?</h3>
      <p class="text-slate-600 mb-8">
        Don't worry! We provide all necessary training and support. Most events include breakfast, lunch, and a high-energy environment you won't forget.
      </p>
      <a href="mailto:ct-volunteers@nefirst.org" class="text-blue-600 font-bold hover:underline">
        Contact the CT Volunteer Coordinator
      </a>
    </div>
  </section>
</div>