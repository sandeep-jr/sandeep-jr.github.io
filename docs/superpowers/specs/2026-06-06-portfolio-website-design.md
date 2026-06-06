# Portfolio Website — Design Spec

**Date:** 2026-06-06
**Owner:** Sandeep J Ramanathan
**Repo / host:** `sandeep-jr.github.io` (GitHub Pages, user site)
**Status:** Approved design — ready for implementation planning

---

## 1. Purpose

A single, holistic personal site that joins every side of Sandeep — engineer,
musician, Buddhist practitioner, writer, lifelong learner — into one coherent
identity. Visitors choose the facet they care about and go deep. The site is a
living portfolio meant to grow over years and to read as genuinely
craft-driven: the kind of work that could inspire teams like Anthropic or Apple,
and that holds up as Sandeep's ambitions expand toward broader humanitarian and
leadership work.

It is also the hub that connects his Instagram, X, LinkedIn (and future GitHub /
music) profiles into one place.

### Success criteria
- A first-time visitor understands "who Sandeep is" within seconds of the
  landing page, and can self-select into any facet.
- The visual quality reads as deliberate and premium (Apple-grade restraint),
  dark-first.
- Adding content (a blog post, a project, an essay) is editing a text file — no
  design work required.
- Fast (high Lighthouse), accessible, and every shared link unfurls with a
  beautiful preview.
- Deploys automatically to `sandeep-jr.github.io` on push to `main`.

---

## 2. Design language

Governed by a small set of principles, applied consistently:

- **Restraint over decoration.** Generous whitespace, tight type scale, very few
  colors. Content is the hero; chrome disappears.
- **Typography as the star.** One refined UI typeface (Inter or an SF-adjacent
  system stack) paired with a quiet serif for long-form writing (blog,
  philosophy). Large confident headings; comfortable reading measure for essays.
- **Dark-first, warm.** Dark mode is the *default, designed* experience: a deep,
  slightly warm near-black (not pure `#000`), soft off-white text, a single
  accent that glows against the dark. A polished light mode is available via
  toggle but the site is composed in the dark. The warm tint carries the
  "humanity" theme while staying sleek.
- **Motion with intent.** Physics-based transitions (Framer Motion): content
  gently rises/fades on scroll; tab changes glide via Astro View Transitions.
  Nothing bounces gratuitously. `prefers-reduced-motion` is fully honored.
- **Craft in the details.** Consistent spacing rhythm, tactile hover states,
  precise alignment, fast load.

---

## 3. Architecture & navigation

**Tech stack:** Astro + React islands + Tailwind CSS + Framer Motion. Content in
Markdown/MDX and typed data files. Polished component primitives (shadcn/ui-style)
where interactivity is needed (tabs, theme toggle, galleries, media embeds).

**Why Astro:** purpose-built for content-rich personal sites; ships ~zero JS by
default (fast = part of the craft); first-class MDX content pipeline for
writing; clean GitHub Pages deploy; React islands for interactive bits.

**Navigation:** A top nav bar — name/mark on the left; tabs on the right:
**About · Work · Engineering · Music · Blog · Philosophy** — plus a theme toggle
and social icons (Instagram, X, LinkedIn).

**Routing — one page per tab** (not a single long scroll):
- `/` — About / holistic hub (landing)
- `/work` — Portfolio / Work
- `/engineering` — Engineering
- `/music` — Music
- `/blog` — Blog index, `/blog/<slug>` per post
- `/philosophy` — Philosophy index, `/philosophy/<slug>` per essay

Rationale: each facet gets its own visual personality within the shared design
system; clean shareable URLs; strong SEO and link previews; transitions are
animated (View Transitions) so it still feels like one fluid app.

**Landing page (`/`):** striking hero (tagline + portrait), a short "who I am"
intro, social links, and elegant cards inviting visitors into each facet ("choose
the door"). The full About narrative + quick facts live here too.

**Footer (every page):** social links, email, a quiet "built with craft"
signature.

---

## 4. Content model

Content lives as text/data files so the design is built once and updates are
trivial.

- **MDX collections** for writing-heavy tabs:
  - `src/content/blog/` — one file per post (frontmatter: title, date, summary,
    optional cover image; body in Markdown/MDX).
  - `src/content/philosophy/` — one file per essay (same shape).
- **Structured data** for curated tabs:
  - `src/content/work/` — one file per project (title, one-line summary,
    description, role/impact, links, optional image).
  - `src/data/music.ts` — featured pieces + embed links (Spotify/SoundCloud/
    YouTube), intro copy.
  - `src/data/engineering.ts` — intro, focus areas, skills/tools.
- **Spine:** `src/config/site.ts` — name/display variants, hero tagline +
  sub-line, social links, email, nav order. One place for global changes.
- **Media:** `src/assets/` — portrait, project images, etc. (auto-optimized by
  Astro). Placeholders used until real assets are supplied.

Astro content-collection **schemas validate frontmatter at build time** — a
malformed post fails the build rather than shipping broken.

---

## 5. Per-tab content (from intake)

The following real content is provided and seeds each tab. Placeholders are
clearly marked and replaceable later.

- **Identity/global:** Name "Sandeep J Ramanathan" (display variants available).
  Tagline: *"Building technology, music, and ideas that bring people closer
  together."* Sub-line about Staff Engineer / learner / musician / Buddhist
  practitioner. Email `sandeep.ramanathan@icloud.com`.
- **Socials:** Instagram `https://www.instagram.com/sandy_jr_19/`,
  X `https://x.com/sjramanathan`,
  LinkedIn `https://www.linkedin.com/in/sjramanathan`.
  GitHub / YouTube / SoundCloud / Spotify: slots reserved, add when available.
- **About:** primary narrative (~300 words) + 6 "currently" quick facts.
- **Music:** intro + 5 featured pieces (placeholder embed links to be added).
- **Work:** intro + 6 projects (Disbursements, Fraud, Chargeback Automation,
  FinTech Platform Architecture, Subscriptions, Engineering Learning Roadmaps).
  Tesla links are internal; public images added where safe.
- **Engineering:** intro + 5 focus areas + categorized skills/tools list.
- **Blog:** 5 planned posts (titles + summaries) scaffolded as drafts.
- **Philosophy:** intro + 4 full essays provided.

---

## 6. Contact & sharing

- **No contact form.** The site is fully static and self-contained (no
  third-party services). Email and social links are displayed in the footer and
  on About for anyone who wants to reach out.
- **SEO & social sharing:** per-page titles/descriptions, sitemap, and
  **Open Graph cards** so every link (a tab or a specific post/essay) unfurls
  with a designed preview image + title on LinkedIn / X / iMessage. OG images
  generated from the design system.

---

## 7. Quality & non-functional

- **Accessibility:** semantic HTML, keyboard-navigable, sufficient dark-mode
  contrast, `prefers-reduced-motion` honored, alt text on images.
- **Performance:** minimal JS (Astro islands), auto image optimization; target
  high Lighthouse scores across the board.
- **Testing (light but real):** CI build check (catches broken content/links and
  failed schema validation before deploy). No heavy unit-test suite — appropriate
  for a content site.

---

## 8. Deployment

GitHub Actions workflow builds the Astro site and publishes to GitHub Pages on
every push to `main`. Edit content → push → live in ~1 minute at
`sandeep-jr.github.io`.

---

## 9. Out of scope (YAGNI)

- Server-side features, auth, CMS, comments.
- Contact form / form backends.
- Heavy automated test suites.
- Analytics (can be added later if desired).
- i18n / multi-language.

---

## 10. Future polish (explicitly deferred)

- Real media assets (headshot, candid/working photo, instrument photo,
  architecture diagrams, optional intro video, resume PDF download).
- Real music embeds and additional featured pieces.
- Writing out the 5 planned blog posts in full.
- GitHub / YouTube / SoundCloud / Spotify links once available.
- Optional analytics.
