# CT FIRST Tech Challenge

The public website for Connecticut FIRST Tech Challenge (FTC) — a robotics competition for
students in grades 7–12. It's the CT-specific hub for finding local events, browsing the
team directory, and volunteering, serving students/parents, teams/coaches, and
volunteers/sponsors from the same set of pages.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [PocketBase](https://pocketbase.io/) as the backend (sponsors, events, admin content, contact messages)
- [MapLibre GL](https://maplibre.org/) for the team map (`src/lib/components/team-map.svelte`)
- [Resend](https://resend.com/) for transactional email, [web-push](https://www.npmjs.com/package/web-push) for admin notifications
- Team data pulled from the FTC Events API (`src/lib/server/ftc-events.ts`)

## Developing

Install dependencies and start PocketBase, then run the dev server:

```sh
npm install
docker compose up pocketbase   # or run your own PocketBase instance
npm run dev
```

You'll need a `.env` file (see `.env` keys below) with credentials for PocketBase, the FTC
Events API, Resend, and web-push VAPID keys.

Other scripts:

```sh
npm run check   # svelte-check + type checking
npm run lint    # prettier --check
npm run format  # prettier --write
npm run build   # production build (adapter-node)
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD` | PocketBase admin login used by the app |
| `FTC_API_KEY` / `FTC_API_USERNAME` | FIRST Tech Challenge Events API credentials |
| `RESEND_API_KEY` | Outbound email (contact form, notifications) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` / `PUBLIC_VAPID_PUBLIC_KEY` | Web push for admin contact-message alerts |
| `ORIGIN` | Canonical origin used by adapter-node (set in `docker-compose.yml`) |

## Deploying

`docker-compose.yml` builds and runs two services: `frontend` (this app, via `Dockerfile`,
adapter-node) and `pocketbase` (via `Pbdockerfile`).

```sh
docker compose up --build
```

## Project structure

- `src/routes` — pages: home, `events`, `teams`, `volunteer`, `faq`, `contact`, `admin` (CMS),
  plus `api/webhooks` and an `embed/events` route for embedding the events list elsewhere.
- `src/lib/components` — shared UI (header, footer, carousel, team map, etc).
- `src/lib/server` — server-only logic (FTC Events API client, PocketBase access).
- `PRODUCT.md` — product brief: audiences, positioning, brand personality, and design principles.

## A note on AI use

Parts of this codebase — including feature work, refactors, and this README — were written
with the assistance of an AI coding agent (Claude Code), with a human reviewing and directing
the changes. If you're auditing history or blame and see unusually thorough commits or PRs,
that's why.
