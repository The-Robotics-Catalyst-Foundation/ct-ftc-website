<script lang="ts">
  const faqs = [
    {
      question: 'How do I volunteer for a CT FTC event?',
      answer: 'Create or sign in to your account at firstinspires.org, go to "My Roles" > "Event Volunteer", click "Register to Volunteer", and search for a FIRST Tech Challenge event in Connecticut.'
    },
    {
      question: 'When is the next CT FTC event in Connecticut?',
      answer: 'Check the Events page for the full schedule of upcoming qualifiers, scrimmages, and championships across Connecticut, along with dates and locations.'
    },
    {
      question: 'Do I need robotics or technical experience to volunteer?',
      answer: 'No. Most volunteer roles need no technical background at all, and free online training is provided for every role before the event.'
    },
    {
      question: 'What volunteer roles are available?',
      answer: 'Roles range from technical (Referee, Field Technical Advisor, Robot Inspector) to judging (Panel Judge, Judge Advisor) to event support (Queuer, Scorekeeper, Team Check-in, Field Reset Crew).'
    },
    {
      question: 'Can I just help at one event without full FIRST registration?',
      answer: 'Full FIRST registration is required for every volunteer role - it covers background checks and event credentials. It only takes a few minutes, and once done you can register for as many or as few Connecticut events as you like.'
    },
    {
      question: 'What is FIRST Tech Challenge (FTC)?',
      answer: 'FIRST Tech Challenge is a robotics competition for students in grades 7-12, where teams design, build, and program a robot to compete head-to-head in an alliance format against other teams.'
    },
    {
      question: 'How do I start or join a CT FTC team?',
      answer: 'Use the "Create a Team" link on the homepage, or visit the Team Directory to find an existing team near you.'
    }
  ];

  const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  }).replace(/</g, '\\u003c');
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<main class="bg-[#eef2f7] min-h-screen text-[#1a1a1a] pb-24 pt-28 overflow-x-hidden relative">
  <div class="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

  <section class="max-w-4xl mx-auto px-6 relative z-20">
    <div class="text-center md:text-left mb-10">
      <span class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black bg-[#facc15] border-2 border-black px-4 py-2 box-shadow-flat transform -rotate-1">
        FAQ
      </span>
      <h1 class="mt-4 text-4xl md:text-5xl font-black text-black leading-[0.95] tracking-tighter uppercase">
        Frequently Asked <br />
        <span class="text-[#2563eb] bg-white border-4 border-black px-4 inline-block my-2 box-shadow-flat transform rotate-1">Questions</span>
      </h1>
    </div>

    <div class="space-y-3">
      {#each faqs as faq}
        <details class="bg-white border-3 border-black rounded-2xl box-shadow-flat overflow-hidden group">
          <summary class="p-4 flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <h2 class="font-black text-sm text-black uppercase tracking-wide">{faq.question}</h2>
            <span class="shrink-0 text-lg font-black transition-transform duration-200 group-open:rotate-180">⌄</span>
          </summary>
          <p class="px-4 pb-4 text-sm font-semibold text-slate-700 leading-relaxed">{faq.answer}</p>
        </details>
      {/each}
    </div>

    <p class="mt-10 text-sm font-bold text-slate-600 text-center md:text-left">
      Still have questions? <a href="/contact" class="text-[#2563eb] font-black hover:underline">Contact us</a>.
    </p>
  </section>
</main>

<style>
  .bg-grid-pattern {
    background-size: 40px 40px;
    background-image:
      linear-gradient(to right, #000000 1px, transparent 1px),
      linear-gradient(to bottom, #000000 1px, transparent 1px);
  }

  .box-shadow-flat {
    box-shadow: 5px 5px 0px 0px #000000;
  }
</style>
