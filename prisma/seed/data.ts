// ament — seed data for the demo organisation "Halden Partners"
//
// Halden Partners is a fictional boutique M&A and strategy advisory firm,
// founded in Amsterdam, serving mid-market European clients (€50m–€500m).
// The corpus below spans 2025-Q3 and 2025-Q4 (six months) and is engineered
// so the four lenses have something genuine to find:
//
//  - TWO real disagreements:
//      1. Expansion (boutique vs. scale) — Mariëlle vs. Daan
//      2. Risk tolerance in client recommendations — Sophie vs. Daan
//  - FOUR Anchors (marked decisions)
//  - An evolving view: scepticism → adoption of AI research tools (Priya's arc)
//
// To regenerate the demo from scratch, edit this file then run:
//   npm run seed

export const ORG = {
  name: "Halden Partners",
  slug: "halden-partners",
  description:
    "A boutique M&A and strategy advisory firm based in Amsterdam, serving mid-market European clients.",
};

export const PERSONAS = {
  marielle: {
    name: "Mariëlle Voss",
    email: "marielle.voss@haldenpartners.example",
    role: "ADMIN" as const,
    bio: "Founding Partner. Joined the firm at its founding in 1998. Cautious, reputation-minded, long-term thinker.",
  },
  daan: {
    name: "Daan Kessler",
    email: "daan.kessler@haldenpartners.example",
    role: "ADMIN" as const,
    bio: "Managing Partner. Growth-oriented, drives the firm's expansion strategy.",
  },
  sophie: {
    name: "Sophie Lindqvist",
    email: "sophie.lindqvist@haldenpartners.example",
    role: "MEMBER" as const,
    bio: "Senior Associate, M&A. Analytical, often the firm's internal devil's advocate on risk.",
  },
  tomas: {
    name: "Tomás Herrera",
    email: "tomas.herrera@haldenpartners.example",
    role: "MEMBER" as const,
    bio: "Operations Lead. Focused on culture, process, and people.",
  },
  priya: {
    name: "Priya Anand",
    email: "priya.anand@haldenpartners.example",
    role: "MEMBER" as const,
    bio: "Junior Analyst. Joined six months before the corpus begins. Curious about new tools and methods.",
  },
};

export type PersonaKey = keyof typeof PERSONAS;

export interface SeedDeposition {
  author: PersonaKey;
  date: string; // ISO date
  category?: string; // matches a prompt category, or undefined for free deposition
  body: string;
  isAnchor?: boolean;
  anchorLabel?: string;
}

export const DEPOSITIONS: SeedDeposition[] = [
  // ── Q3 2025 (July – September) ──────────────────────────────────────────
  {
    author: "daan",
    date: "2025-07-03",
    category: "strategy",
    body: "Our primary advantage has always been that clients get the partners, not a deal team three layers removed from a managing director. That is real, and it is not going away. But I think we are mistaking the advantage for the business model. The advantage is depth of attention; the business model — staying small, staying Amsterdam-only — is a choice we made twenty years ago under different conditions. The mid-market is consolidating. Two of the firms we used to consider peers have opened second offices in the last eighteen months. I am not saying we should chase them. I am saying we should ask honestly whether 'we are small and that's our edge' is still a strategy or has become a habit.",
  },
  {
    author: "marielle",
    date: "2025-07-05",
    category: "strategy",
    body: "Daan is right that depth of attention is the advantage, but I want to push back gently on the idea that the model and the advantage can be separated so cleanly. The depth comes from the model. It comes from five partners who know every live mandate, who can pick up the phone to a client at ten at night because they were in the room when the relationship started. The moment we are an organisation of fifteen partners across two cities, that texture changes — not necessarily for the worse, but it changes, and I think we owe it to ourselves to be honest that 'staying focused' is also a strategy, and a defensible one, even if it is not a growing one.",
  },
  {
    author: "sophie",
    date: "2025-07-08",
    category: "risk",
    body: "I want to flag something from the Brennan Optics deal that has been sitting with me. We recommended a recapitalisation structure that increased the company's leverage from roughly 2.5x to 4.1x EBITDA to fund the dividend the family wanted. It was within market norms, and the client was thrilled. But I ran the downside case on a 15% revenue decline and the covenant headroom disappears within five quarters. We presented the upside case more prominently than the downside. I am not saying we did anything wrong technically. I am saying I noticed myself wanting to please the client more than I wanted to fully stress-test the recommendation, and that is worth sitting with.",
  },
  {
    author: "tomas",
    date: "2025-07-10",
    category: "people",
    body: "We have brought in three senior lateral hires this year — all excellent — but I realise we have not hired a junior analyst since Priya, eight months ago. Looking at the pipeline, both live mandates and the Zurich conversations Daan has been having, we are going to need more capacity at the base of the pyramid, not just at the top. I would rather we plan a junior class deliberately than end up making panic hires when someone burns out. Worth a conversation about what 'good growth' looks like at the analyst level, not just the partner level.",
  },
  {
    author: "priya",
    date: "2025-07-12",
    category: undefined,
    body: "Tried something new this week — ran a first pass of the industry landscape for the Voestra mandate through one of the AI research tools before starting my own work. It produced a genuinely useful map of adjacent competitors I would not have found as quickly through the usual databases, including two Eastern European players that turned out to be relevant. That said, when I showed the output to Sophie she immediately spotted that two of the 'competitors' it listed were actually customers of Voestra, not competitors — the tool had misread a supplier relationship. Useful as a first draft, dangerous if you stop there.",
  },
  {
    author: "daan",
    date: "2025-07-15",
    category: "strategy",
    body: "I want to put something concrete on the table rather than keep this abstract: Zurich. Swiss family offices and the Stiftung-adjacent wealth structures are increasingly looking for exactly the kind of mid-market, cross-border M&A advice we do, and right now they go to Zurich-based boutiques almost by default, even when the target company is in Germany or the Netherlands. A small Zurich presence — one senior person initially, not a satellite office with its own P&L pressure — could open a meaningful pipeline without requiring us to become a different kind of firm. I know this touches the conversation Mariëlle and I have been having about scale. I think this is a case where a measured step doesn't commit us to the larger trajectory either of us is debating.",
  },
  {
    author: "marielle",
    date: "2025-07-18",
    category: "identity",
    body: "What makes us different from the bulge-bracket banks our clients could in theory hire is not really our fee structure or even our sector knowledge — it's that the founder of a 200-person manufacturing business in Twente can call me directly, and I will remember the name of his daughter who is supposed to take over the company in six years. That is not a service we provide; it is who we are, because we built the firm around five people who could hold that many relationships in their heads at once. My honest worry about Zurich, or about any expansion, is not the market logic — Daan's market logic is usually right — it's whether the thing that makes a client feel personally known survives being one office among several.",
  },
  {
    author: "sophie",
    date: "2025-07-22",
    category: undefined,
    body: "Coming back to Brennan Optics because I think it is a useful test case rather than a one-off. Looking at our last four leveraged recapitalisations, in three of them our 'base case' projections were the company's own management projections, essentially unadjusted, and management projections are almost by definition optimistic — that's why the owner wants to do the deal. I'm not arguing we should refuse to do recap deals. I'm asking whether we should have a house view on what a 'stressed case' looks like, independent of what management gives us, so that when we say a structure is sound, we mean it's sound against our own numbers, not just theirs.",
  },
  {
    author: "daan",
    date: "2025-07-25",
    category: undefined,
    body: "On Sophie's point — I want to be careful here because I think there's a version of this that is exactly right and a version that would change what we are. The version that's right: yes, build a stressed case as standard practice, have it ready, discuss it with the client. Full transparency is good practice and good defence if anything goes wrong later. The version I'd resist: deciding on the client's behalf that a structure is 'too risky' and declining to present it, when the client is a sophisticated owner who understands leverage better than we sometimes give them credit for. Our job is to make sure they're choosing with full information, not to choose for them. I think Sophie and I actually agree on the first part. I want to be honest that I think we'd disagree on the second, if it came to it.",
  },
  {
    author: "tomas",
    date: "2025-07-29",
    category: "people",
    body: "Two associates have mentioned to me, separately and informally, that they are running on fumes — both are staffed on Voestra and the Lindgren carve-out simultaneously, and both deals are in intense phases at the same time. Neither has said anything to the partners directly, which itself is a signal. I don't have a clean solution because I know both deals are revenue-critical this quarter. But I want this on record: we are currently operating without slack, and the cost of that is currently being paid by two people who are not in the room when we make staffing decisions.",
  },
  {
    author: "priya",
    date: "2025-08-01",
    category: "reflection",
    body: "Three months in now, and the thing that has surprised me most is not the work itself — diligence, models, decks, all roughly as I expected — but how openly the partners disagree with each other in front of the team. The Brennan Optics conversation between Sophie and Daan happened in a room with four analysts present, and nobody pretended it had been resolved by the end. I came from an internship at a larger firm where disagreements, if they existed, happened behind closed doors and arrived to us as settled decisions. I don't know yet whether what I'm seeing here is a strength or just a smaller firm's inability to hide its seams. Possibly both.",
  },
  {
    author: "marielle",
    date: "2025-08-04",
    category: undefined,
    isAnchor: true,
    anchorLabel: "Declined the Meridian retail roll-up engagement",
    body: "We have decided to decline the Meridian engagement. To summarise for the record: Meridian approached us to advise on a roll-up of twelve regional retail chains, funded primarily through sale-leaseback transactions on the underlying real estate and high-yield debt at the operating company level, with the explicit intent of extracting value within a three-year hold before a likely restructuring. The fee would have been the largest single mandate in our history. I raised this with Daan and Sophie separately before bringing it to the full partnership: my concern is not that the structure is illegal or even unusual — it isn't — but that we would be the named advisor on a transaction whose most likely outcome, on its own logic, involves significant job losses at the operating companies within a horizon the sponsor has been quite open about. I do not think this is a case where 'the client understands the risk' resolves the question, because the people bearing the downside are not the client. The partnership voted 4-1 to decline. I want to note for the record that this was a genuinely difficult decision given the fee, and I do not think the dissenting view was unreasonable.",
  },
  {
    author: "daan",
    date: "2025-08-06",
    category: undefined,
    body: "For the record, I was the dissenting vote on Meridian, and I want to explain why, not to relitigate it but because I think the reasoning matters going forward. My view was and is that Meridian would have found another advisor within a week regardless of what we did — declining the mandate does not change the outcome for the operating companies, it only changes whether we were paid for our work. I take Mariëlle's point that 'someone else would have done it anyway' is not, on its own, a sufficient justification — that logic could justify almost anything. But I think there's a real cost to the decision that we should be honest about: it was the largest fee in our history, and declining it is also a statement about what kind of growth we're willing to pursue, which connects to the conversation about Zurich and scale. I supported the eventual decision becoming firm policy. I did not agree with it, and both things are true.",
  },
  {
    author: "sophie",
    date: "2025-08-11",
    category: "strategy",
    body: "I think the Meridian decision and the Brennan Optics conversation from last month are actually the same conversation. In both cases, the question was: do we have a position on what we will and won't recommend, independent of what a sophisticated client wants and is entitled to pursue elsewhere? Meridian answered that question for the extreme case — yes, there is a line. But most of our work lives in the much larger grey area below that line, where Brennan Optics sits. I'd like to propose that we develop something concrete: an internal framework for what 'stressed case' analysis looks like for leveraged transactions, and a documented threshold above which a deal requires partner-level sign-off with the stressed case explicitly discussed with the client. Not a ban on anything — a discipline.",
  },
  {
    author: "tomas",
    date: "2025-08-14",
    category: "culture",
    body: "Worth noting: the two analysts staffed on Meridian during the diligence phase — before the decision to decline — have both separately told me they felt more informed about why the firm ultimately said no than they expected to. Mariëlle walked the team through her reasoning before the partner vote, not after. Compare this to how the Henrik Holdings situation was handled two years ago, which I wasn't here for but is still talked about — apparently the team found out a deal had been declined only when the data room access was revoked, with no explanation. Whatever else is true about how we make big decisions, how we communicate them seems to be improving, and the team notices.",
  },
  {
    author: "priya",
    date: "2025-08-18",
    category: undefined,
    body: "Used the AI research tool again, this time for a market-sizing exercise on the Dutch logistics sector for a prospective client conversation. Presented the output — a market map with rough TAM estimates — to Sophie and Tomás. Sophie's reaction was useful: she said the numbers were 'directionally fine but I wouldn't want a client to see the sourcing,' because the tool doesn't show its work in a way we could defend if challenged. Tomás's reaction was different — he asked whether it had saved me time, and when I said probably a full day, he said 'then the question isn't whether to use it, it's how we make its output defensible.' I think that's the more useful framing than 'should we use this.'",
  },
  {
    author: "daan",
    date: "2025-08-21",
    category: "strategy",
    body: "Some numbers on Zurich, since the conversation has been mostly qualitative so far. Swiss family office assets under management have grown by roughly 40% over the past five years, much of it in structures (Stiftungen, trusts) that increasingly need cross-border M&A advice for portfolio companies based outside Switzerland — exactly our sweet spot. I spoke informally with two people who could plausibly lead a Zurich presence; both are senior, both have books of relationships that overlap with, but don't duplicate, our existing network. My proposal remains modest: one senior hire, no separate office lease initially, six-month review. I recognise Mariëlle's concern is not really about the economics of this specific step — it's about what it signals and where it leads. I don't have a clean answer to that beyond: we don't have to decide the destination to take a reversible step.",
  },
  {
    author: "marielle",
    date: "2025-08-25",
    category: "identity",
    body: "If Halden were a person, I think its characteristic flaw would be a tendency to mistake its own history for a value system. We say 'we are a firm that knows its clients personally' as though that were a principle we hold, when really it is also just a description of what was possible when there were five of us and forty active relationships between us. I am aware, writing this, that I am one of the people most prone to this — I have caught myself this year defending positions less because I think they're right today and more because they're how we've always done it. I don't think the answer is to abandon what has worked. I think the answer is to get better at telling the difference between a value and a habit, which is harder than it sounds.",
  },
  {
    author: "sophie",
    date: "2025-08-28",
    category: "risk",
    body: "Honestly, the decision I'm most uncertain about right now is not Meridian — I think that was right, and I said so. It's the opposite kind of question: are we now at risk of being too cautious in the other direction? We passed on a smaller mandate last week — a manufacturing roll-up, much smaller scale than Meridian, structurally quite different — and in the partner discussion I noticed Meridian being invoked almost as a precedent, a kind of shorthand for 'we don't do roll-ups,' when the actual risk profile of this deal was meaningfully different. I supported declining that mandate too, for what it's worth, on its own merits. But I want to flag the pattern: a hard decision in one direction can become a heuristic that gets applied too broadly afterwards, and I'd rather we noticed that happening than not.",
  },
  {
    author: "tomas",
    date: "2025-09-02",
    category: undefined,
    isAnchor: true,
    anchorLabel: "Launched the junior analyst mentorship programme",
    body: "We are launching a formal mentorship programme for junior analysts, starting with Priya and the two analysts we plan to hire this autumn. Each junior will be paired with a senior associate or partner for structured monthly check-ins, separate from deal staffing — explicitly not about deal performance, but about development, workload, and anything that needs raising outside the chain of command they're staffed under. This comes directly out of the conversation about capacity and burnout from July, and out of feedback that the informal mentoring some analysts have received (Sophie has been doing this for Priya without it being anyone's job) has been valuable but uneven and dependent on individual relationships rather than something the firm provides deliberately. Partners have each agreed to take one mentee.",
  },
  {
    author: "priya",
    date: "2025-09-05",
    category: undefined,
    body: "Glad to see the mentorship programme formalised — and I want to say, for the record, that what Sophie has been doing for me informally since I started has made a real difference, and I think Tomás is right that it shouldn't depend on whether you happen to land near someone generous with their time. That said, I hope the formal version doesn't replace what was good about the informal version, which was that it didn't feel like a programme. I don't have a solution to that, just flagging it as something to watch.",
  },
  {
    author: "daan",
    date: "2025-09-09",
    category: undefined,
    body: "Worth flagging: Castellijn & Roos, who I'd put in our peer set, announced a Zurich office last week — one senior hire, framed almost exactly as I've been proposing. I want to be clear this doesn't change my view on the substance, but I'd be lying if I said it didn't add urgency. The risk of moving second in a relationship-driven market is that the obvious senior candidates have already had the conversation with someone else. I'd like to bring a concrete proposal — a name, terms, timeline — to the partnership meeting in two weeks rather than continuing to discuss this in the abstract.",
  },
  {
    author: "marielle",
    date: "2025-09-12",
    category: "strategy",
    body: "I want to gently resist the framing that a competitor's move creates urgency for us. Castellijn & Roos opening a Zurich office tells us something about the market — fine, useful information — but it doesn't change the underlying question, which is whether this is the right decision for us, on our timeline, for our reasons. 'Someone else is doing it' is exactly the kind of reasoning that, if I'm honest, led parts of the market into the leverage practices Sophie has been raising concerns about. I'm not saying don't do Zurich. I'm saying let's make sure that if we do it, we can articulate why in terms that don't reference Castellijn & Roos at all.",
  },
  {
    author: "sophie",
    date: "2025-09-16",
    category: "culture",
    body: "What 'good work' means here, in my experience, has consistently been thoroughness over speed — the expectation that you re-run the model one more time, that you read the full data room rather than the index, that you flag the awkward question even when the deal is moving fast and everyone wants it to close. I think this is genuinely one of our strengths and part of why clients trust us. My honest worry, looking at the Zurich conversation and the general sense that we need to move faster to compete, is whether 'thoroughness over speed' survives contact with a faster-moving market. I don't think anyone intends to compromise on this. I think it's the kind of thing that erodes gradually, one reasonable-seeming exception at a time, and is hard to notice until it's gone.",
  },
  {
    author: "tomas",
    date: "2025-09-19",
    category: "people",
    body: "One of the unwritten rules I've noticed, asking around for the culture survey we're planning: every partner says some version of 'my door is always open,' and I believe they mean it. But when I ask junior analysts whether they've ever gone to a partner's office with a concern unprompted, almost none have. The gap isn't an open-door policy — it's that 'open door' requires the junior person to initiate, to judge that their concern is important enough to interrupt a partner's day, and to risk being wrong about that judgment. The mentorship programme's structured check-ins are partly designed around this — the senior person initiates, on a schedule, regardless of whether anything's wrong. I think that's the more honest version of an open door.",
  },
  {
    author: "priya",
    date: "2025-09-23",
    category: undefined,
    body: "Second time using the AI research tool for the comparable companies analysis on the Halvorsen mandate, and this time the reception was much more positive — I think because I changed how I presented it. Instead of presenting the output as findings, I presented it as a starting long-list that I then verified and cut down manually, showing my own work on top of it. Took the AI output from about 40 candidates to a verified 11, with sourcing for each. Sophie's comment was 'this is what I meant before — it's fine as a sieve, not as an answer.' Saved real time without the defensibility problem from August.",
  },
  {
    author: "daan",
    date: "2025-09-26",
    category: undefined,
    isAnchor: true,
    anchorLabel: "Decided to open a Zurich office in Q1 2026",
    body: "The partnership has voted to proceed with a Zurich presence, opening in Q1 2026, structured as Mariëlle and I had converged on: one senior hire (Felix Brunner, formerly of a Zurich-based boutique, terms still being finalised), no separate office lease in year one — he'll work from a shared space — and a formal six-month review of pipeline and fit before any further commitment. The vote was 4-1 in favour; Mariëlle voted against, and asked that her reservations be recorded: that the step, however modest in form, represents a change in what kind of firm we are becoming, and that '6-month review' decisions have a way of becoming permanent once people, clients, and momentum are attached to them. The partnership agreed to revisit explicitly in March 2026 with a real decision on the table, not a formality.",
  },
  {
    author: "marielle",
    date: "2025-09-29",
    category: "reflection",
    body: "End of quarter. Two decisions this quarter that I think will matter more than most: declining Meridian, and approving Zurich — and I was on opposite sides of the partnership majority for each. I voted to decline Meridian and the partnership agreed; I voted against Zurich and was outvoted. I've been asked, more than once this month, whether that's uncomfortable. It is, a little. But I don't think the two decisions are in tension with each other, and I don't think my position across them is inconsistent — both, to me, were about the same question: what does this firm become, and on whose terms. We said no to becoming the kind of firm that profits from a roll-up we can't defend. We said yes, cautiously, to becoming a firm with a presence in Zurich. I was wrong, in the partnership's view, about the second one, and I'll support it fully. I think a firm that can hold both of those decisions in the same quarter, by the same people, without it being a crisis, is doing something right, even when I'm on the losing side of the vote.",
  },

  // ── Q4 2025 (October – December) ────────────────────────────────────────
  {
    author: "daan",
    date: "2025-10-03",
    category: "strategy",
    body: "Update on Zurich: terms with Felix Brunner are close to final, expected start date early January. For those who haven't met him, Felix spent eleven years at a Zurich boutique focused on family office and Stiftung-related M&A — almost exactly the network we identified in August. He'll initially work on a small number of joint mandates with our existing team rather than building a fully separate book from day one, partly so the rest of the partnership has direct visibility into how the Zurich relationships develop, which I know was part of Mariëlle's concern about a satellite office operating at arm's length.",
  },
  {
    author: "sophie",
    date: "2025-10-06",
    category: "risk",
    body: "First live test of the stressed-case framework I proposed in August: the Dahlqvist Industries mandate, a moderate leveraging (around 3.2x) to fund an acquisition rather than a dividend recap, which is a meaningfully different risk profile than Brennan Optics. We built the stressed case — a 20% revenue decline scenario — and presented both cases to the client at the same meeting, framed as 'here is the base case you've seen, and here is what we'd want you to be comfortable with before proceeding.' The client's reaction was good, actually — their CFO said it was the first time an advisor had shown them the downside unprompted, and it strengthened rather than weakened the relationship. One data point, but an encouraging one.",
  },
  {
    author: "tomas",
    date: "2025-10-09",
    category: "culture",
    body: "One month into the mentorship programme. Junior feedback has been positive — Priya and the two new analysts (Marcus and Lena, who joined in September) all report the monthly check-ins feel different from deal debriefs, in the way intended. The friction point is on the senior side: two partners have mentioned, gently, that finding an uninterrupted hour a month is harder than it sounds during an active deal period, and one check-in was rescheduled twice. I don't think this is a sign the programme is failing — I think it's a sign that 'we don't have slack' from July is still true, and the programme is making that visible in a new place rather than creating a new problem.",
  },
  {
    author: "priya",
    date: "2025-10-13",
    category: "identity",
    body: "A story I've heard a few times since joining, usually from partners, is that Halden is 'conservative' — careful, doesn't chase trends, says no to things that don't fit. I think that story is mostly true but importantly incomplete. This quarter alone we declined the largest mandate in firm history on principle, and also voted, not unanimously, to open an office in a new country for the first time in twenty-seven years. Both of those are big moves. 'Conservative' makes it sound like the firm mostly avoids big decisions; what I've actually seen is a firm that makes big decisions carefully and sometimes disagrees about them quite openly. I think the self-description of 'conservative' undersells how much change is actually happening, and maybe makes it easier not to notice.",
  },
  {
    author: "marielle",
    date: "2025-10-16",
    category: undefined,
    body: "A quieter observation, prompted by a meeting with one of our oldest clients last week. Hendrik, who founded the company we first advised in 2001, is 71 now and finally serious about succession — his daughter will take over, as he always said she would, but she has very different instincts than he does, more international, less attached to doing things 'the way we've always done them.' It struck me, sitting in that meeting, that we are advising her through exactly the kind of generational transition we are quietly going through ourselves, between the partners who built this firm and whoever will eventually lead it next. I don't have a point to make, exactly. Just that it's strange to be on both sides of the same conversation.",
  },
  {
    author: "daan",
    date: "2025-10-20",
    category: undefined,
    body: "Picking up on Mariëlle's note about Hendrik's succession — I think there's something useful in it for how we think about our own next phase, beyond the parallel being interesting. The next generation of owners we're going to be advising — people like Hendrik's daughter — are going to expect things from an advisor that the previous generation didn't particularly care about: international reach, faster turnaround, comfort with newer deal structures and tools. Not because they're less thoughtful, but because their frame of reference is different. I think this is actually the strongest version of the case for Zurich and for things like the AI research tools Priya's been experimenting with — not 'the market is changing so we must,' which Mariëlle was right to push back on in September, but 'the clients we'll be serving in ten years are forming their expectations of an advisor right now, and we should understand what those expectations are.'",
  },
  {
    author: "sophie",
    date: "2025-10-23",
    category: undefined,
    body: "Difficult conversation with the Dahlqvist client this week — a competitor approached them directly, offering to support a more aggressive structure (closer to 4.5x) than what we'd recommended, with the implication that we'd been overly cautious. I walked the CFO back through our stressed case, and specifically through what a 4.5x structure would look like under the same downside scenario — covenant breach within four quarters versus our structure's comfortable headroom. The client stayed with our recommendation, but I want to note: the framework only worked because we'd already built it and shown it to them in a calm moment. If we'd had to construct that argument for the first time under pressure, in response to a competitor's pitch, I don't think it would have landed the same way. Worth remembering when anyone asks whether the framework is 'worth the time.'",
  },
  {
    author: "tomas",
    date: "2025-10-27",
    category: "people",
    body: "Marcus, one of the two analysts who joined in September, has resigned — moving to a larger firm for what he described to me as roughly a 30% increase in base compensation. I don't think this is really about Marcus; I think it's a signal worth taking seriously. Our compensation for junior analysts has been set by comparison to other boutiques our size, but the firms now actively recruiting our juniors are, increasingly, larger platforms that can offer both higher base pay and a more defined path to bonus. I don't have a recommendation yet — just flagging that 'we pay competitively for a firm our size' may be the wrong comparison set if the firms poaching from us aren't our size.",
  },
  {
    author: "priya",
    date: "2025-10-30",
    category: undefined,
    body: "The AI research tool is now just part of how I work, not something I'm experimenting with — first-pass market maps, comparable screens, initial summarisation of long documents before I read them properly myself. What's changed for me isn't really the tool, it's what I spend my time on. Six months ago, a market-sizing exercise was mostly about finding the data. Now it's mostly about deciding which of the data is trustworthy and how to frame it for the specific question a partner is actually asking, which I think is a better use of an analyst's time, but it's also a different skill than the one I expected to be building when I joined.",
  },
  {
    author: "marielle",
    date: "2025-11-03",
    category: "risk",
    body: "If I had to name a risk we underprice, it's reputational risk attached to people rather than transactions — and I want to connect this directly to Felix's onboarding for Zurich. We have done thorough diligence on Felix's deal experience and his network, as we should. I don't think we've done equivalent diligence on potential conflicts arising from that network — prior clients, prior counterparties, relationships that could create an appearance issue for us even if nothing improper occurred. This isn't a comment on Felix specifically; it's that we're used to doing this kind of diligence on companies, and much less practised at doing it on people joining the partnership, because historically everyone joining the partnership was someone we'd worked alongside for years already. Zurich is the first time that won't be true, and I think our processes haven't caught up to that.",
  },
  {
    author: "daan",
    date: "2025-11-06",
    category: "strategy",
    body: "Mariëlle's point from last week is fair, and we've acted on it: we commissioned an independent conflicts review of Felix's prior client relationships — the first time we've done this for an incoming partner, as Mariëlle noted, and probably the new standard going forward for any future lateral hires at partner level, which I support. The review identified two prior relationships that warrant disclosure protocols — both manageable, neither disqualifying, both now documented. I want to acknowledge explicitly: this is a better process than we had before Mariëlle raised it, and it exists because she raised it. I think this is a good example of the kind of caution that strengthens rather than slows things down.",
  },
  {
    author: "sophie",
    date: "2025-11-10",
    category: "culture",
    body: "A conversation we don't have, despite having quite a lot of conversations about almost everything else: the way junior analysts are compensated (largely fixed, hours-based, with a modest discretionary bonus) versus how partners are compensated (heavily weighted to deal success) creates a structural difference in how each group experiences a deal. When a deal is going well, partners are more invested in pushing it across the line than the analysts doing the underlying work, who are paid roughly the same whether the deal closes or falls apart. I'm not saying anyone behaves badly because of this. I'm saying it's an asymmetry that shapes incentives quietly, and I think Marcus's departure — even if it was mainly about base pay — is connected to this in a way worth examining.",
  },
  {
    author: "tomas",
    date: "2025-11-13",
    category: undefined,
    isAnchor: true,
    anchorLabel: "Revised associate compensation to include a deal-success component",
    body: "Following Sophie's note last week, and Marcus's departure the week before, the partnership has agreed to revise associate-level compensation to include a modest deal-success component — roughly 10% of total compensation at target, paid as a pool shared across the team staffed on a closed mandate, separate from the existing discretionary bonus. This doesn't fully close the gap Sophie described between partner and associate incentives, and it doesn't address the base-pay benchmarking question I raised in October, which we're still working through separately. But it's a concrete step on the incentive-alignment point, and it came directly out of an associate naming a structural issue that the partnership hadn't previously discussed in those terms.",
  },
  {
    author: "priya",
    date: "2025-11-17",
    category: "reflection",
    body: "Six months in, and the thing I've changed my mind about most is the relationship between caution and slowness, which I think I conflated when I first arrived. Watching the Meridian decision, the Zurich decision, and now the compensation change, what strikes me is that none of these were fast, but none of them were really slow either — they were each preceded by someone naming a problem clearly, the partnership actually engaging with it rather than deferring it, and a decision following reasonably quickly once the question was properly framed. The slowness I expected from a 'careful' firm hasn't really materialised. What I've seen instead is that most of the time goes into figuring out what the actual question is, and once that's done, deciding isn't slow at all.",
  },
  {
    author: "marielle",
    date: "2025-11-20",
    category: undefined,
    body: "Felix signed the lease for a small shared office space in Zurich this week — modest, as agreed, but it's a physical space with our name on the door in a city we've never had a presence in. I notice I have genuinely mixed feelings about this, more than I expected to. There's real pride — this is the first time in the firm's history we've had a footprint outside Amsterdam, and it represents twenty-seven years of work that made it possible. There's also something like grief, which is a strange word to use about an office lease, but it's the closest one. The firm I joined operated out of two rooms above a canal, and every step away from that, even a sensible and modest one, is also a step away from something. I don't think this feeling means anything is wrong. I think it's just what it feels like when something genuinely changes.",
  },
  {
    author: "daan",
    date: "2025-11-24",
    category: undefined,
    body: "Mariëlle's note from this week affected me more than I expected — partly because I assumed, given how the Zurich vote went, that I wouldn't share the feeling she described. But I do. I think I've spent so much of this year arguing for why Zurich makes sense that I hadn't made space for the fact that it's also an ending of something, even as it's a beginning of something else. I don't think this changes anything about the decision — I still think it's right. But I think Mariëlle and I have spent much of this year on what looked like opposite sides of a question about growth, and it turns out we feel something quite similar about what growth costs, even when we disagree about whether it's worth it. I don't know what to do with that observation except record it.",
  },
  {
    author: "sophie",
    date: "2025-11-27",
    category: "risk",
    body: "If I'm honest about the risk I think is most likely to actually hurt us — not the dramatic version, but the realistic one — it's this: Zurich succeeds enough to generate real pipeline within twelve to eighteen months, faster than our current senior bench can properly staff without stretching the same people who are already, per Tomás's notes since July, operating without slack. The mentorship programme and the comp changes address real issues, but they don't create more partner-hours in a day. My concern isn't that Zurich was the wrong decision. It's that the decision to do Zurich and the decision about how we resource it for success are being made on different timelines, and the second one is the one I'd want us to get ahead of rather than respond to.",
  },
  {
    author: "tomas",
    date: "2025-12-01",
    category: undefined,
    body: "Results from the year-end culture survey, which we ran anonymously across all staff. Headline: overall sentiment is up meaningfully from the same survey last year, particularly on questions about feeling heard and understood by leadership — I think the mentorship programme and the visible response to the compensation question are reflected here. The clearest area of concern, named by several respondents without prompting, is uncertainty about how Zurich will affect workload and team structure over the next year. Nobody framed this as opposition to the decision itself — more a sense of 'we don't yet know what this means for us day to day,' which seems like a fair thing not to know yet, four weeks before the office opens, but worth being direct about with the team in January.",
  },
  {
    author: "priya",
    date: "2025-12-04",
    category: undefined,
    body: "Spent two weeks in Zurich, the first analyst rotation before the office formally opens in January — mostly shadowing Felix on a prospective mandate and meeting some of his existing contacts. Two observations. First, the pace of meetings was noticeably different — more, shorter, more transactional in tone, at least in this initial phase — which I think is partly just what new-relationship-building looks like rather than a permanent cultural difference, but worth watching. Second, and this surprised me: Felix asked me more questions about how we make decisions at Halden — the Meridian story came up unprompted, he'd heard about it from someone in the market — than about deal mechanics. I think he's trying to understand the culture he's joining, not just the processes. Felt like a good sign that the things we've been writing down this year are also the things a new senior hire wants to understand first.",
  },
  {
    author: "daan",
    date: "2025-12-08",
    category: "strategy",
    body: "If I were starting the firm over today, knowing what I know now, I think the biggest single change I'd make is building Sophie's stressed-case framework from day one rather than arriving at it after Brennan Optics and Meridian. Not because those situations were avoidable in hindsight — I don't think they were, we didn't have the framework because we hadn't needed it in quite that way before — but because I think a framework like that, in place from the start, would have made some of this year's hardest conversations into routine ones. The Dahlqvist conversation in October worked, under real pressure, because the framework already existed and had been discussed with the client in a calm moment. I'd want that to be true of everything from the beginning, not something we built in response to two near-misses.",
  },
  {
    author: "marielle",
    date: "2025-12-11",
    category: undefined,
    isAnchor: true,
    anchorLabel: "Adopted AI-assisted research workflow firm-wide, with a documented review protocol",
    body: "The partnership has agreed to formally adopt AI-assisted research tools as part of the standard workflow for market analysis, comparable company screening, and document summarisation — with a documented protocol requiring that any AI-derived output used in client-facing materials be independently verified and that sourcing be traceable, the standard Sophie articulated back in August and that Priya's work in September demonstrated in practice. I want to note, since I was among the more sceptical partners when this first came up in the summer — my concern then was less about the technology and more about whether convenience would erode the thoroughness Sophie described in September as central to who we are. I think the protocol we've agreed addresses that concern directly: it doesn't ask anyone to trust the tool, it asks them to use it as Priya described — a sieve, not an answer — and to be able to show their work. This is, I think, an example of adopting something new without it requiring us to become a different kind of firm, which is the question I keep returning to this year.",
  },
  {
    author: "sophie",
    date: "2025-12-15",
    category: "reflection",
    body: "Looking back over the year: Brennan Optics in July raised a question about risk that Meridian, in August, answered in its most extreme form, and that the stressed-case framework then operationalised for the much larger grey area in between — tested for real in October with Dahlqvist. Separately, Zurich opened a question about growth that ran in parallel all year, resolved in September but still being worked out in practice in how we resource it. And underneath both of those, a quieter thread about who does the work and how they're treated — the mentorship programme, the compensation change, the AI tooling protocol — each a response to something a junior person noticed and said clearly. None of these threads are finished. The risk framework will be tested again, probably harder. Zurich's resourcing question, which I raised in November, is still open. But I think this year is the first time I've felt that 'caution' and 'ambition' here are actually in conversation with each other, rather than just coexisting uneasily. The tension hasn't gone away. It's become more like a working relationship.",
  },
  {
    author: "tomas",
    date: "2025-12-18",
    category: "people",
    body: "What kind of person thrives at Halden has shifted this year, even if the underlying values haven't. A year ago I'd have said: someone relationship-driven, thorough, comfortable with a slow-moving, stable environment. I think the first two are still exactly right. The third isn't, anymore — this year alone we've had the largest mandate in our history declined on principle, our first office outside Amsterdam, a compensation structure change, and a shift in how we use research tools. Someone who thrives here now also needs to be comfortable with the firm itself being in motion, and with that motion sometimes being the result of open disagreement among the partners rather than a settled plan handed down. I think this is a healthier environment than the one I'd have described a year ago. I also think it's a harder one to walk into without warning, and we should be honest with people we're hiring about what they're joining.",
  },
  {
    author: "priya",
    date: "2025-12-22",
    category: undefined,
    body: "Year-end note, mostly gratitude. The mentorship programme — Sophie, formally and informally — has shaped how I think about this work more than anything in my actual job description. But the thing I keep coming back to, a year on, is the Meridian decision, which I observed as a very new analyst without fully understanding what I was watching at the time. I remember being surprised that the firm would consider, even briefly, walking away from the largest fee in its history, and even more surprised that the conversation about it happened where the team could see it. I think that one decision taught me more about what this firm actually values — as opposed to what it says it values — than anything else this year. I hope whatever I do next, wherever that is, I get to be somewhere that makes decisions like that the same way.",
  },
  {
    author: "daan",
    date: "2025-12-23",
    category: undefined,
    body: "Year-end note from me: if I had to characterise 2025 in one sentence, it would be that this was the year Halden decided what kind of growth it wants — and decided, somewhat to my surprise, that the answer isn't simply 'more,' but something more specific: growth that we can explain to ourselves and to the team, that doesn't require us to become a different kind of firm even as the firm genuinely changes. Zurich opens in three weeks. I argued for it all year and I still think it's right. But Mariëlle's reservations, which I didn't share at the time, turned out to be reservations I needed to hear, and several of the things we did this year — the conflicts review, the AI protocol, even some of how we communicated the compensation change — exist because those reservations were taken seriously rather than simply outvoted. I think that's the actual lesson of this year, more than Zurich itself.",
  },
  {
    author: "marielle",
    date: "2025-12-29",
    category: undefined,
    body: "A mentor of mine, many years ago, told me that the difference between owning something and being a steward of it is that an owner asks 'what do I want this to be,' and a steward asks 'what does this need from me, right now, to be what it should become.' I've thought about that distinction a great deal this year — through Meridian, through Zurich, through watching Sophie and Tomás and Priya each, in their own ways, name things this firm needed to hear. I am, technically, one of this firm's owners. I increasingly think of myself as one of its stewards, for whatever time I have left in this role, and I find that more useful. The question I'd like to carry into next year, and that I don't think is mine alone to answer, is this: when the next generation of partners — whoever they turn out to be — looks back at this year, what will they need it to have meant? I don't know yet. I don't think we're meant to know yet. But I think it's the right question to be sitting with.",
  },

  // ── Additional depositions for richness ─────────────────────────────────
  {
    author: "sophie",
    date: "2025-07-20",
    category: undefined,
    body: "Priya showed me the AI research tool output for Voestra today. My honest first reaction: interesting, occasionally impressive, but I would not want a client or a counterparty to see how a particular figure was derived if asked, and in our world someone always eventually asks. I don't want to be the person who reflexively says no to a new tool — I'm aware that's an easy trap for someone in my position. But 'it produced something useful' and 'I could defend this if challenged' are different bars, and right now I think the tool clears the first and not reliably the second.",
  },
  {
    author: "daan",
    date: "2025-08-09",
    category: undefined,
    body: "On the leverage discussion — I want to offer a counterexample to balance the Brennan Optics conversation, because I think we risk over-correcting. Two years ago, the Reinholt transaction involved leverage at around 4.3x, higher than Brennan Optics, to fund an acquisition that the family had wanted to make for over a decade and had previously been advised against by a more conservative bank. The deal performed well; the acquired business is now their largest division. If we'd applied today's instinct — flag it, build a stressed case, perhaps recommend against — to that deal, I think there's a real chance the family would have gone with the other advisor's original caution and missed what turned out to be the right move. I raise this not to argue against a stressed-case framework, which I support, but to argue that 'higher leverage' and 'wrong recommendation' aren't the same thing, and the framework needs to be able to say yes as clearly as it says be careful.",
  },
  {
    author: "priya",
    date: "2025-09-30",
    category: "strategy",
    body: "A question I haven't heard explicitly addressed in the Zurich discussions: if the office succeeds and generates meaningful new revenue, how is that revenue thought about relative to existing priorities — for instance, the junior analyst capacity Tomás raised in July, versus partner distributions, versus reinvestment in Zurich itself. I don't have a view on what the answer should be, and I recognise this is premature given the office hasn't opened yet. But I think it's the kind of question that's much easier to answer calmly now, before there's an actual number on the table that people might feel differently about once it's real.",
  },
  {
    author: "marielle",
    date: "2025-10-11",
    category: "culture",
    body: "Asked what 'doing good work' means here, and I keep returning to Meridian, even though it wasn't a piece of analytical work in the usual sense. Most of the time, good work looks like thoroughness — the extra model iteration, the full data room read, the question asked one more time. But Meridian was good work of a different kind: it was the willingness to do the analysis fully, reach an uncomfortable conclusion, and act on it even at real cost. I think both kinds matter, and I think the second kind is rarer and harder to teach, because most of the time the conclusion isn't uncomfortable and the thoroughness is the whole story. But when it is uncomfortable, I think that's when you find out what 'good work' actually means to a firm, as opposed to what it says.",
  },
  {
    author: "tomas",
    date: "2025-11-29",
    category: undefined,
    body: "Felix's onboarding has surfaced something useful, slightly indirectly: in trying to explain to him how we approach things — staffing norms, how deals get reviewed, even informal things like who to loop in on what — I've realised how much of this exists only as shared experience among people who've been here for years, and not as anything written down. This was fine when everyone joining had usually worked alongside us already. It's not fine for Felix, and it won't be fine for whoever we hire next, in Zurich or Amsterdam. I'd like to spend some time in January turning some of this into an actual onboarding document — not to make us more bureaucratic, but because right now 'how we do things' lives entirely in people's heads, and that doesn't scale even a little, and we're already past the point where it needs to.",
  },
  {
    author: "sophie",
    date: "2025-12-05",
    category: "risk",
    body: "Following up on the Dahlqvist situation from October — there's been a coda worth recording. The client came back to us last week, after three months of using our recommended structure, to say that the competing advisor had approached them again, this time with an even more aggressive proposal, and asked us directly: 'would your view change if we told you we're confident in our growth projections?' This was, in a sense, the framework being tested by the exact pressure it was designed for — a confident client, real competitive pressure, and an opportunity to simply agree. We re-ran the stressed case with their updated projections, found the conclusion didn't change, and said so. The client accepted this, though I could tell it was a less comfortable conversation than October's. I think this is what the framework holding under pressure actually looks like — not dramatic, a little uncomfortable, and ultimately fine.",
  },
];
