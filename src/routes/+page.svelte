	<script lang="ts">
		const stats = [
			{ value: '50–60', label: 'Teams Statewide' },
			{ value: '6', label: 'Qualifying Events' },
			{ value: '1', label: 'State Championship' },
			{ value: '50+', label: 'Volunteers Per Event' }
		];

		const roles = [
			{
				icon: '⚖️',
				title: 'Judge',
				description:
					'Evaluate teams on robot design, programming, and teamwork through interviews and observations.'
			},
			{
				icon: '📋',
				title: 'Scorekeeper',
				description:
					'Track match scores in real time and maintain accurate competition records throughout the day.'
			},
			{
				icon: '🦺',
				title: 'Referee',
				description:
					'Enforce game rules on the field, ensuring fair and safe play during every match.'
			},
			{
				icon: '🔧',
				title: 'Field Reset',
				description:
					'Reset game elements between matches to keep the event running smoothly and on schedule.'
			},
			{
				icon: '📸',
				title: 'Photographer',
				description:
					'Capture the excitement of competition and the hard work of student teams throughout the event.'
			},
			{
				icon: '📢',
				title: 'Queuer',
				description:
					'Guide teams to the field at the right time, keeping the event schedule on track.'
			}
		];
	</script>

	<!-- Hero -->
	<section
		class="relative flex min-h-screen items-center bg-gradient-to-br from-navy via-navy-light to-[#1a3a6b] pt-20"
	>
		<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
			<div
				class="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-3xl"
			></div>
			<div
				class="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl"
			></div>
		</div>

		<div class="relative mx-auto max-w-7xl px-6 py-24 text-center">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
				2024–25 Season Now Underway
			</div>

			<h1
				class="mx-auto max-w-4xl text-5xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
			>
				Connecticut<br />
				<span class="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent"
					>FIRST Tech Challenge</span
				>
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
				Inspiring middle and high school students across Connecticut to design, build, and program
				robots — and develop the skills to become tomorrow's engineers, scientists, and leaders.
			</p>

			<div class="mt-10 flex flex-wrap justify-center gap-4">
				<a
					href="#volunteer"
					class="rounded-xl bg-purple-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-400 hover:shadow-purple-400/30"
				>
					Volunteer With Us
				</a>
				<a
					href="#about"
					class="rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
				>
					Learn More
				</a>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-y border-white/10 bg-navy">
		<div class="mx-auto max-w-7xl px-6 py-10">
			<dl class="grid grid-cols-2 gap-6 sm:grid-cols-4">
				{#each stats as stat}
					<div class="text-center">
						<dt class="text-3xl font-extrabold text-purple-400">{stat.value}</dt>
						<dd class="mt-1 text-sm font-medium text-slate-400">{stat.label}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</section>

	<!-- About -->
	<section id="about" class="bg-white py-24">
		<div class="mx-auto max-w-7xl px-6">
			<div class="grid gap-16 lg:grid-cols-2 lg:items-center">
				<div>
					<p class="text-sm font-semibold tracking-widest text-purple-500 uppercase">About</p>
					<h2 class="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
						What is FIRST Tech Challenge?
					</h2>
					<p class="mt-5 text-lg leading-relaxed text-slate-600">
						FIRST Tech Challenge (FTC) is a robotics program for students in grades 7–12. Teams of up
						to 15 members collaborate to design, build, and program robots that compete in an
						alliance-based format against other teams — all within a six-month season.
					</p>
					<p class="mt-4 text-lg leading-relaxed text-slate-600">
						Beyond the robot, FTC emphasizes gracious professionalism, community outreach, and STEM
						advocacy. Teams are judged not only on their robot's performance but on their engineering
						process, teamwork, and impact in their communities.
					</p>
					<a
						href="https://www.firstinspires.org/robotics/ftc"
						target="_blank"
						rel="noopener"
						class="mt-6 inline-flex items-center gap-2 font-semibold text-purple-500 transition-colors hover:text-purple-600"
					>
						Learn more at FIRST Inspires
						<svg
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</a>
				</div>

				<div class="grid grid-cols-2 gap-4">
					{#each [{ title: 'Design & Build', body: 'Teams engineer a robot from scratch using a standard parts kit and custom components.' }, { title: 'Program', body: 'Robots are coded in Java or Blocks, teaching real software engineering skills.' }, { title: 'Compete', body: 'Alliance-based matches push teams to collaborate strategically under pressure.' }, { title: 'Inspire', body: 'Awards recognize community impact, innovation, and the spirit of gracious professionalism.' }] as card}
						<div class="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
							<div class="mb-2 font-bold text-slate-900">{card.title}</div>
							<p class="text-sm leading-relaxed text-slate-600">{card.body}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Competition -->
	<section id="competition" class="bg-slate-50 py-24">
		<div class="mx-auto max-w-7xl px-6">
			<div class="text-center">
				<p class="text-sm font-semibold tracking-widest text-purple-500 uppercase">
					Season Structure
				</p>
				<h2 class="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
					How the Season Works
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
					Connecticut FTC hosts a full competitive season from September through February, culminating
					in the state championship.
				</p>
			</div>

			<div class="mt-16 grid gap-8 sm:grid-cols-3">
				{#each [{ step: '01', title: 'Kickoff', timing: 'September', body: 'The new game is revealed globally. Connecticut teams receive their game manuals, begin strategizing, and start building their robots.' }, { step: '02', title: 'Qualifying Events', timing: 'November – January', body: 'Six qualifier tournaments are held across Connecticut. Teams compete to earn points and qualify for the state championship.' }, { step: '03', title: 'State Championship', timing: 'February', body: 'The top teams from qualifying events compete at the Connecticut State Championship, with winners advancing to the FIRST World Championship.' }] as item}
					<div class="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
						<div
							class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-extrabold text-purple-500"
						>
							{item.step}
						</div>
						<div class="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
							{item.timing}
						</div>
						<h3 class="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
						<p class="text-sm leading-relaxed text-slate-600">{item.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Volunteer -->
	<section id="volunteer" class="bg-navy py-24">
		<div class="mx-auto max-w-7xl px-6">
			<div class="text-center">
				<p class="text-sm font-semibold tracking-widest text-purple-400 uppercase">Get Involved</p>
				<h2 class="mt-3 text-4xl font-extrabold tracking-tight text-white">Volunteer at an Event</h2>
				<p class="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
					Every event needs approximately 50 volunteers. No robotics experience is required — just
					enthusiasm and a desire to support student success.
				</p>
			</div>

			<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each roles as role}
					<div
						class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-purple-500/30 hover:bg-white/10"
					>
						<div class="mb-3 text-3xl">{role.icon}</div>
						<h3 class="mb-2 font-bold text-white">{role.title}</h3>
						<p class="text-sm leading-relaxed text-slate-400">{role.description}</p>
					</div>
				{/each}
			</div>

			<div class="mt-14 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-8 text-center">
				<h3 class="text-xl font-bold text-white">Ready to Volunteer?</h3>
				<p class="mt-2 text-slate-300">
					Reach out and we'll connect you with the next upcoming event in your area.
				</p>
				<a
					href="mailto:youssefmmacary@gmail.com"
					class="mt-6 inline-block rounded-xl bg-purple-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-400"
				>
					Contact Volunteer Coordinator
				</a>
			</div>
		</div>
	</section>	