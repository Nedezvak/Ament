# ament

ament is a quiet place for an organisation to think out loud, and to read
itself back.

Members deposit thought — short reflections, prompted or free — into a shared
**corpus**. Four lenses read over that same corpus:

- **Mirror** — ask the organisation a question; get a cited answer drawn from
  what people have actually written.
- **Seam** — surface a genuine tension or disagreement living in the corpus.
  Named, not resolved.
- **Essay** — a literary synthesis of a period's depositions: the
  organisation's reflection on itself.
- **Inheritance** — a briefing on what the organisation believes and how it
  reasons, written for someone arriving for the first time.

Decisions can be marked as **Anchors** — a small, queryable decision-memory
("why did we decide to...?").

This README is written for whoever runs ament day to day, whether or not
they're an engineer. If a step doesn't work, the error messages are written
to be readable — read them before asking for help.

---

## Running ament locally

You'll need:

- **Node.js 20+**
- **PostgreSQL 16** with the [pgvector](https://github.com/pgvector/pgvector)
  extension (used to store and search the embeddings of each deposition)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your environment

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

`.env.example` explains each variable in plain language — what it's for,
where to get it, and roughly what it costs. At minimum, for local
development, you need:

- `DATABASE_URL` / `DIRECT_URL` — your Postgres connection string
- `AUTH_SECRET` — any random string (used to sign login sessions)
- `ANTHROPIC_API_KEY` — for Mirror, Seam, Essay, Inheritance, and theme
  extraction
- `EMBEDDING_PROVIDER` plus either `VOYAGE_API_KEY` or `OPENAI_API_KEY` — for
  turning depositions into searchable embeddings

### 3. Set up the database

Push the schema to your database:

```bash
npm run db:push
```

Then enable pgvector and add the embedding column. This is a one-time step
per database — run the SQL in
`prisma/migrations/manual/add_vector_column.sql` against your database (e.g.
via `psql`, or your hosting provider's SQL console):

```bash
psql "$DATABASE_URL" -f prisma/migrations/manual/add_vector_column.sql
```

### 4. Seed the demo organisation (optional, recommended)

ament ships with a fully realised demo organisation, "Halden Partners" — five
people, six months of depositions, two genuine disagreements, several marked
decisions, and one finished quarterly Essay. It's the fastest way to see
ament as it's meant to feel.

```bash
npm run seed
```

This requires real `ANTHROPIC_API_KEY` and embedding-provider credentials —
seeding generates real embeddings and one real Essay. It costs roughly $1–2
in API usage. The seed script wipes and recreates the "Halden Partners"
organisation each time it's run, so it's safe to re-run.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with the email
of any seeded persona (e.g. `marielle.voss@haldenpartners.example`) — in
development, the "Dev sign in" option on the login page signs you in directly
without an email round-trip. In production, sign-in is via emailed magic
link (see "Email" below).

---

## Deploying

ament is built to deploy on [Vercel](https://vercel.com), with a managed
Postgres database from [Neon](https://neon.tech) or
[Supabase](https://supabase.com) (both have pgvector available out of the
box and a free tier sufficient for a small organisation).

1. **Database**: create a Neon or Supabase Postgres project. Copy its
   connection string into `DATABASE_URL` (and `DIRECT_URL` — for Neon these
   are usually the same; for Supabase use the "connection pooling" URL for
   `DATABASE_URL` and the direct connection for `DIRECT_URL`).
2. Run steps 3–4 above (`db:push`, the pgvector SQL, and optionally `seed`)
   against this database from your local machine, with `.env` pointing at
   it.
3. **Vercel**: import this repository, set the same environment variables
   from `.env.example` in the Vercel project settings, and deploy. Set
   `NEXTAUTH_URL` to your production URL.
4. **Email**: in production, set `RESEND_API_KEY` and `EMAIL_FROM` so members
   can sign in via emailed magic link. Without these, the only sign-in path
   is the dev Credentials provider, which is disabled outside development.

---

## Editing ament without touching code

A few things are deliberately kept in plain, well-commented files so a
non-engineer can adjust ament's voice or content:

- **`lib/prompts.ts`** — every prompt sent to the language model lives here,
  with comments explaining what each one does and what to be careful about
  when editing it. This is the single most important file for shaping how
  ament "sounds".
- **`lib/promptLibrary.ts`** — the library of prompts members are offered
  when depositing thought (the prompt library shown on the Deposit page).
- **`app/globals.css`** — the `@theme` block at the top defines ament's
  colours and fonts (the "design tokens"). Change a value here and it
  updates everywhere.
- **`prisma/seed/data.ts`** — the demo organisation's people and
  depositions, if you want to adjust the demo story.

---

## Cost guardrails

ament makes calls to the Anthropic API (for Mirror, Seam, Essay, Inheritance,
theme extraction, and decision-memory) and to an embedding provider (Voyage
AI or OpenAI, for every deposition).

A few things keep this bounded:

- Each lens has a fixed **token budget** (`TOKEN_BUDGETS` in `lib/llm.ts`),
  so a single Essay or Mirror answer can't run away in cost.
- Retrieval from the corpus is capped at **20 depositions** per query
  (`lib/embeddings.ts`), regardless of corpus size.
- Generated **Essays are cached** — asking for the same period's Essay twice
  doesn't regenerate it unless explicitly requested.
- Embeddings are generated **once per deposition**, at the time it's
  written.

Rough costs at the time of writing: a Mirror answer is a few cents; a Seam
reading is under a cent; an Essay is around 3–5 cents; embedding a deposition
is a fraction of a cent.

---

## What gets sent to third parties

- **Anthropic** (Claude) receives the text of retrieved depositions as
  context for Mirror, Seam, Essay, Inheritance, theme extraction, and
  decision-memory queries — and the member's question or prompt.
- **Voyage AI or OpenAI** (whichever is configured as `EMBEDDING_PROVIDER`)
  receives the plain text of every deposition, in order to generate its
  embedding.
- **Resend** (if configured) receives a member's email address to send
  magic-link sign-in emails.

No deposition content is sent anywhere else. There is no analytics or
tracking layer.

---

## Tests

```bash
npm test
```

Citation-integrity tests run with no external dependencies. The retrieval,
Seam, and Essay tests are integration tests that require a seeded database
and real API credentials — they're skipped automatically if these aren't
configured.

---

## Further reading

See [`DECISIONS.md`](./DECISIONS.md) for the reasoning behind ament's
technical choices, written in plain language.
