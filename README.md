# Meet.AI

AI-powered meetings. You create an **agent** (a name + instructions), start a
call, and the agent joins the call in real time as a participant. When the call
ends, the transcript and recording are collected, a summary is generated in the
background, and you can keep asking the agent questions about the meeting
afterwards.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC, Turbopack) |
| API | tRPC 11 + TanStack Query (server prefetch + hydration) |
| DB | Neon Postgres + Drizzle ORM |
| Auth | Better Auth (email/password, GitHub, Google) |
| Video / calls | Stream Video (`@stream-io/video-react-sdk`, `@stream-io/node-sdk`) |
| In-call AI | OpenAI Realtime, connected to the call by Stream |
| Post-meeting chat | Stream Chat + OpenAI Chat Completions |
| Background jobs | Inngest + `@inngest/agent-kit` (transcript → summary) |
| Billing | Polar (`@polar-sh/better-auth`) — optional |
| UI | Tailwind CSS v4 + shadcn/ui |

## Getting started

```bash
npm install
cp .env.example .env      # then fill it in (see below)
npm run db:push           # push the Drizzle schema to your database
npm run dev
```

### Environment variables

Everything is listed in [.env.example](.env.example). Only the database and
Better Auth values are needed to boot the app; the rest unlock features:

* **`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`** — required.
* **`NEXT_PUBLIC_STREAM_VIDEO_API_KEY`, `STREAM_VIDEO_SECRET_KEY`** — required for calls, recordings and transcripts.
* **`NEXT_PUBLIC_STREAM_CHAT_API_KEY`, `STREAM_CHAT_SECRET_KEY`** — required for the "Ask AI" tab.
* **`OPENAI_API_KEY`** — required for the in-call agent, summaries and post-meeting chat.
* **`POLAR_ACCESS_TOKEN`** — optional. Without it the app runs with billing
  disabled and free-tier limits are **not** enforced; the `/upgrade` page shows
  an empty state instead of plans.

### Stream webhook

Most of the meeting lifecycle is driven by Stream webhooks hitting
[src/app/api/webhook/route.ts](src/app/api/webhook/route.ts). In your Stream
dashboard set the webhook URL to `https://<your-host>/api/webhook` and enable
video + chat events. Locally, expose your dev server first:

```bash
ngrok http 3000    # then use the https URL + /api/webhook
```

Events handled:

| Event | Effect |
| --- | --- |
| `call.session_started` | Marks the meeting `active`, connects the OpenAI realtime agent with the agent's instructions |
| `call.session_participant_left` | Ends the call |
| `call.session_ended` | Marks the meeting `processing` |
| `call.transcription_ready` | Stores the transcript URL, triggers the Inngest summary job |
| `call.recording_ready` | Stores the recording URL |
| `message.new` | Replies in the meeting's chat channel as the agent, using the summary as context |

### Inngest (summaries)

The summariser lives in [src/inngest/functions.ts](src/inngest/functions.ts) and
is served from `/api/inngest`. Run the dev server alongside `npm run dev`:

```bash
npx inngest-cli@latest dev
```

## How a meeting flows

1. **Create an agent** — `/agents`. Name + instructions; instructions become the
   realtime agent's system prompt.
2. **Create a meeting** — `/meetings`. This also creates the Stream call with
   transcription and recording set to `auto-on`.
3. **Start it** — the meeting page links to `/call/<id>`: lobby (mic/camera
   preview) → active call → ended.
4. **Processing** — when everyone leaves, the meeting becomes `processing`;
   Stream posts the transcript, Inngest summarises it with `gpt-4o`, and the
   meeting flips to `completed`.
5. **Review** — the completed meeting has tabs for **Summary** (markdown),
   **Transcript** (searchable, speaker-attributed), **Recording** (video player)
   and **Ask AI** (chat with the agent about the meeting).

## Project layout

```
src/
  app/
    (auth)/          sign-in, sign-up
    (dashboard)/     home, agents, meetings, upgrade
    call/[meetingId] the call experience (own layout, no dashboard chrome)
    api/             auth, trpc, inngest, webhook
  modules/
    agents/          schema, procedures, filters, table, dialogs, detail view
    meetings/        schema, procedures, filters, status views, transcript, chat
    call/            lobby / active / ended, Stream client wiring
    premium/         Polar products, subscription, free-usage
    dashboard/       sidebar, navbar, command palette, user button, trial banner
    home/            dashboard landing
  db/                Drizzle schema + client
  inngest/           background job client + functions
  lib/               auth, polar, stream clients, avatars, utils
  trpc/              init (protected + premium procedures), routers, server/client
```

## Scripts

```bash
npm run dev        # dev server (turbopack)
npm run build      # production build
npm run lint       # eslint
npm run db:push    # push schema to the database
npm run db:studio  # drizzle studio
```

## Free tier

`premiumProcedure` in [src/trpc/init.ts](src/trpc/init.ts) enforces
`MAX_FREE_AGENTS` / `MAX_FREE_MEETINGS` (see [src/constants.ts](src/constants.ts))
for users without an active Polar subscription. Hitting the limit returns
`FORBIDDEN`, and the UI redirects to `/upgrade`.
