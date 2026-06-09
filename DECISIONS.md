# Decisions

A plain-language log of the technical choices made while building ament, and
why. Written for whoever inherits this codebase — including a non-technical
founder trying to understand what they're maintaining.

## One corpus, many lenses

This is the architectural decision everything else follows from. There is a
single table of depositions per organisation (the corpus), each embedded
once. Mirror, Seam, Essay, and Inheritance are all just different prompts
reading over the same retrieval. We deliberately did not build separate
"modules" with their own data models for each lens — that would let the
lenses drift out of sync with each other and multiply the places a bug or
inconsistency could hide. If a new lens is ever added, it should be a new
prompt and retrieval pattern, not a new data model.

## Next.js 14, not 16

`create-next-app` initially installed a Next.js 16 preview release, which
turned out to be missing pieces (its compiler binary failed to install) and
is not yet a stable, "boring" choice. We pinned to Next.js 14.2.18 — the
current stable line, well documented, with no surprises. Nothing in ament
needs anything from Next 15 or 16.

## Prisma 5, not 7

Prisma 7 changes how a project connects to its database: instead of a
connection string in the schema file, it requires a separate "driver
adapter" package and a `prisma.config.ts` file. This is a real improvement
for some use cases, but it adds a layer of configuration that isn't needed
here and would be one more thing a non-technical operator could get wrong
when setting up a new database. We pinned to Prisma 5.20, which connects the
simple way: a `DATABASE_URL` in `.env`, full stop.

## Raw SQL for embeddings (pgvector)

Prisma doesn't yet have first-class support for Postgres's `vector` column
type, which is what makes similarity search ("find depositions like this
one") possible. Rather than wait for that support or add a separate
vector-database service, we added the `vector` column with a one-time manual
SQL script (`prisma/migrations/manual/add_vector_column.sql`) and read/write
it with a small number of raw SQL queries in `lib/embeddings.ts`. Everything
else in the app — all the regular data — goes through Prisma normally. This
keeps the operational footprint to "one Postgres database" rather than "one
Postgres database plus a vector database."

**Trade-off**: if the data model around embeddings changes significantly in
future, the raw SQL will need updating by hand alongside the Prisma schema.
This is a small, contained piece of the codebase (`lib/embeddings.ts`), so
the risk is limited.

## Auth.js (NextAuth) with email magic links

We chose Auth.js v5 over a paid auth provider (e.g. Clerk) because ament's
auth needs are simple — organisations, members, two roles — and Auth.js has
no per-user cost and no external account to manage. Sign-in is via emailed
magic link (no passwords to manage or leak). Resend was chosen as the email
provider for its generous free tier and simple API.

In development, an additional "Dev sign in" option lets you sign in by email
address alone, with no email round-trip — this option is automatically
disabled outside development (`NODE_ENV !== "development"`), so it can never
appear in production.

## Embedding provider behind a switch

`EMBEDDING_PROVIDER` selects between Voyage AI and OpenAI for turning
deposition text into embeddings. Voyage is the default — its embeddings
perform well for this kind of retrieval and it's a smaller, focused company,
but OpenAI is a safe fallback if Voyage becomes unavailable or pricing
changes. Switching providers requires re-embedding existing depositions
(the dimensions differ: Voyage's `voyage-3` is 1024-dimensional, OpenAI's
`text-embedding-3-small` is 1536), so this isn't something to switch
casually — but it isn't locked in either.

## Centralised prompts (`lib/prompts.ts`)

Every prompt sent to Claude lives in one file, heavily commented. This is
the file most likely to need editing as ament's voice is tuned — and the one
place where a change has the biggest effect on what ament feels like to use.
Keeping it in one file, separate from the retrieval and API logic, means
that tuning ament's voice doesn't require touching anything that could break
the app.

## Citation integrity as a first-class concern

Mirror's answers are checked, in code (`lib/citations.ts`), against the set
of depositions actually retrieved for that question. If Claude cites someone
whose deposition wasn't retrieved, that's surfaced rather than silently
trusted. This is tested independently of any API call
(`tests/citation-integrity.test.ts`), so it can be verified without spending
on API usage.

## Token budgets and retrieval caps

Each lens has a fixed maximum response length (`TOKEN_BUDGETS` in
`lib/llm.ts`), and retrieval from the corpus is capped at 20 depositions per
query (`lib/embeddings.ts`). These numbers are deliberately conservative
defaults — they bound the cost of any single request regardless of how large
an organisation's corpus grows, and can be raised later if a lens feels too
constrained.

## Tailwind v4 with `@theme`

Tailwind v4's `@theme` directive lets ament's brand colours and fonts
(Ink, Paper, Siena, the Stone/Ash neutrals, EB Garamond, Inter) be defined
once, in `app/globals.css`, as the source of truth — every utility class
(`bg-paper`, `text-siena`, etc.) derives from these. Changing ament's palette
is a matter of editing values in one place.
