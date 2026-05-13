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

<!-- Contact -->
<section id="contact" class="bg-white py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid gap-12 lg:grid-cols-2 lg:items-start">
			<div>
				<p class="text-sm font-semibold tracking-widest text-purple-500 uppercase">Contact</p>
				<h2 class="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Get in Touch</h2>
				<p class="mt-4 text-lg leading-relaxed text-slate-600">
					Questions about volunteering, competing, or running an event in Connecticut? We'd love to
					hear from you.
				</p>

				<ul class="mt-8 space-y-5">
					<li class="flex items-start gap-4">
						<div
							class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
								/>
							</svg>
						</div>
						<div>
							<div class="font-semibold text-slate-900">General Inquiries</div>
							<a
								href="mailto:ctfirsttechchallenge@gmail.com"
								class="text-purple-500 transition-colors hover:text-purple-600"
							>
								ctfirsttechchallenge@gmail.com
							</a>
						</div>
					</li>
					<li class="flex items-start gap-4">
						<div
							class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
								/>
							</svg>
						</div>
						<div>
							<div class="font-semibold text-slate-900">Volunteer Coordinator</div>
							<a
								href="mailto:youssefmmacary@gmail.com"
								class="text-purple-500 transition-colors hover:text-purple-600"
							>
								youssefmmacary@gmail.com
							</a>
						</div>
					</li>
				</ul>

				<div class="mt-8 flex gap-4">
					{#each [{ label: 'Instagram', href: 'https://www.instagram.com', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }, { label: 'Facebook', href: 'https://www.facebook.com', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }, { label: 'Discord', href: 'https://discord.com', icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.036.051A19.94 19.94 0 0 0 6.143 20.1a.077.077 0 0 0 .084-.026 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' }] as social}
						<a
							href={social.href}
							target="_blank"
							rel="noopener"
							aria-label={social.label}
							class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-purple-300 hover:text-purple-500"
						>
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<div class="rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm">
				<h3 class="mb-6 text-xl font-bold text-slate-900">Send a Message</h3>
				<form action="mailto:ctfirsttechchallenge@gmail.com" method="get" class="space-y-5">
					<div>
						<label for="name" class="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							placeholder="Your name"
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
						/>
					</div>
					<div>
						<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
						/>
					</div>
					<div>
						<label for="message" class="mb-1.5 block text-sm font-medium text-slate-700"
							>Message</label
						>
						<textarea
							id="message"
							name="body"
							rows="4"
							placeholder="How can we help?"
							class="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
						></textarea>
					</div>
					<button
						type="submit"
						class="w-full rounded-lg bg-purple-500 py-3 font-semibold text-white transition-colors hover:bg-purple-400"
					>
						Send Message
					</button>
				</form>
			</div>
		</div>
	</div>
</section>
