# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-first, Apple-craft personal portfolio for Sandeep J Ramanathan that unifies his engineering, music, writing, and philosophy into one site, deployed automatically to `sandeep-jr.github.io` via GitHub Pages.

**Architecture:** Astro static site with React islands for interactivity (theme toggle, animated nav, media embeds) and Framer Motion (`motion/react`) for scroll/entrance animations. Long-form content (blog, philosophy) lives in MDX content collections; curated content (work, music, engineering) lives in typed content collections / data files; global identity lives in a single `site` config. A GitHub Actions workflow builds and publishes on every push to `main`.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), React 19 islands (`@astrojs/react`), `motion` (Framer Motion), `@astrojs/sitemap`, `astro-og-canvas` (build-time OG images), `@fontsource-variable/inter` + `@fontsource-variable/fraunces`, deployed with `withastro/action` + `actions/deploy-pages`.

---

## Note on testing for this project

This is a static content/design site, not a logic-heavy application. Classic
unit-test TDD does not fit most tasks. Verification in this plan therefore means,
per task:

- `npm run build` succeeds (catches broken imports, bad content frontmatter via
  Astro content-collection schemas, broken internal links via the link-check
  step).
- `npx astro check` passes (TypeScript + Astro template type errors).
- A quick visual check in `npm run dev` at the relevant route.

Where there is real logic (e.g. the `cn` class-merge helper, the OG/SEO data
builder), we write an actual unit test with Vitest. Those tasks use true
red→green TDD.

Commit after every task.

---

## File structure (decomposition)

```
sandeep-jr.github.io/
├─ astro.config.mjs            # site/base, integrations (react, sitemap, mdx), tailwind vite plugin
├─ tsconfig.json
├─ package.json
├─ vitest.config.ts            # unit tests for helpers
├─ .github/workflows/deploy.yml
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ config/
│  │  └─ site.ts               # SPINE: name, tagline, socials, email, nav
│  ├─ styles/
│  │  └─ global.css            # Tailwind + design tokens (dark-first), font faces
│  ├─ lib/
│  │  ├─ cn.ts                 # class-merge helper (clsx + tailwind-merge)
│  │  └─ seo.ts                # builds per-page SEO/OG metadata
│  ├─ content.config.ts        # content collections + Zod schemas
│  ├─ content/
│  │  ├─ blog/*.mdx
│  │  ├─ philosophy/*.mdx
│  │  └─ work/*.md             # one file per project (frontmatter only)
│  ├─ data/
│  │  ├─ music.ts              # intro + featured pieces + embed links
│  │  └─ engineering.ts        # intro + focus areas + skills
│  ├─ components/
│  │  ├─ react/
│  │  │  ├─ ThemeToggle.tsx
│  │  │  ├─ Nav.tsx
│  │  │  └─ Reveal.tsx         # Framer Motion scroll-reveal wrapper
│  │  ├─ Footer.astro
│  │  ├─ SocialLinks.astro
│  │  ├─ FacetCard.astro       # landing "choose a door" card
│  │  ├─ ProjectCard.astro
│  │  └─ Prose.astro           # typographic wrapper for long-form
│  ├─ layouts/
│  │  ├─ BaseLayout.astro      # <head>, fonts, theme bootstrap, ClientRouter, Nav, Footer
│  │  └─ ProseLayout.astro     # blog/philosophy article shell
│  ├─ assets/                  # portrait + images (placeholders to start)
│  │  └─ placeholder/*
│  └─ pages/
│     ├─ index.astro           # About / holistic hub
│     ├─ work.astro
│     ├─ engineering.astro
│     ├─ music.astro
│     ├─ blog/index.astro
│     ├─ blog/[...slug].astro
│     ├─ philosophy/index.astro
│     ├─ philosophy/[...slug].astro
│     └─ og/[...route].ts      # astro-og-canvas endpoint (build-time OG images)
└─ docs/superpowers/...        # spec + this plan
```

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (temporary), `.gitignore`
- Working dir: `/Users/sandeepjramanathan/Documents/projects/sandeep-jr.github.io`

- [ ] **Step 1: Initialize a minimal Astro project in the existing repo**

The repo already exists with git initialized and the `docs/` folder. Create the
Astro app in-place using the empty template, skipping its own git init.

Run:
```bash
cd /Users/sandeepjramanathan/Documents/projects/sandeep-jr.github.io
npm create astro@latest -- . --template minimal --no-install --no-git --skip-houston --yes
```
Expected: Astro writes `package.json`, `astro.config.mjs`, `tsconfig.json`,
`src/pages/index.astro`, `public/`, `.gitignore`. It will not overwrite `docs/`.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
```
Expected: `node_modules/` created, no errors. (If `npm create` already prompted
to install, this is a no-op.)

- [ ] **Step 3: Verify the dev build works**

Run:
```bash
npm run build
```
Expected: "Complete!" with `dist/` produced and no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Add integrations (React, MDX, Tailwind, sitemap)

**Files:**
- Modify: `astro.config.mjs`, `package.json`, `tsconfig.json`
- Create: `src/styles/global.css`

- [ ] **Step 1: Add React, MDX, sitemap, and Tailwind**

Run:
```bash
npx astro add react mdx sitemap --yes
npm install tailwindcss @tailwindcss/vite
```
Expected: `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`, `react`,
`react-dom`, `tailwindcss`, `@tailwindcss/vite` added; `astro.config.mjs` updated
with the integrations.

- [ ] **Step 2: Wire Tailwind v4 via the Vite plugin and set site/base**

Replace `astro.config.mjs` with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// User GitHub Pages site: served at the domain root.
export default defineConfig({
  site: 'https://sandeep-jr.github.io',
  base: '/',
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create the global stylesheet entry**

Create `src/styles/global.css`:

```css
@import "tailwindcss";
```

(Design tokens and fonts are added in Task 4.)

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```
Expected: build succeeds with the new integrations.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add react, mdx, sitemap, tailwind integrations"
```

---

## Task 3: Add the `cn` class-merge helper (real TDD)

**Files:**
- Create: `src/lib/cn.ts`, `src/lib/cn.test.ts`, `vitest.config.ts`
- Modify: `package.json` (test script)

- [ ] **Step 1: Install test + helper deps**

Run:
```bash
npm install -D vitest
npm install clsx tailwind-merge
```

- [ ] **Step 2: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add the test script to package.json**

In `package.json` `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 4: Write the failing test**

Create `src/lib/cn.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('lets later tailwind classes win on conflict', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run:
```bash
npm test -- src/lib/cn.test.ts
```
Expected: FAIL — cannot find module `./cn`.

- [ ] **Step 6: Implement the helper**

Create `src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run:
```bash
npm test -- src/lib/cn.test.ts
```
Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add cn class-merge helper with tests"
```

---

## Task 4: Design system — tokens, dark-first theme, fonts

**Files:**
- Modify: `src/styles/global.css`
- Install fonts

- [ ] **Step 1: Install variable fonts**

Run:
```bash
npm install @fontsource-variable/inter @fontsource-variable/fraunces
```

- [ ] **Step 2: Define design tokens and base styles**

Replace `src/styles/global.css` with:

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "@fontsource-variable/fraunces";

/* Dark-first: tokens default to dark; `.light` on <html> overrides. */
@theme {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Fraunces Variable", ui-serif, Georgia, serif;
}

:root {
  /* warm near-black, not pure #000 */
  --bg: 24 22 20;          /* #181614 */
  --bg-elev: 32 29 26;     /* #201d1a */
  --ink: 238 234 228;      /* warm off-white */
  --ink-muted: 165 158 148;
  --border: 60 55 50;
  --accent: 224 168 96;    /* warm amber glow */
  --accent-ink: 24 22 20;
}

:root.light {
  --bg: 250 248 244;
  --bg-elev: 255 255 255;
  --ink: 28 26 24;
  --ink-muted: 96 90 84;
  --border: 224 218 210;
  --accent: 176 118 40;
  --accent-ink: 255 255 255;
}

@layer base {
  html {
    background-color: rgb(var(--bg));
    color: rgb(var(--ink));
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }
  body {
    font-family: var(--font-sans);
    min-height: 100dvh;
  }
  ::selection {
    background-color: rgb(var(--accent) / 0.3);
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

/* Convenience semantic utilities */
@layer utilities {
  .bg-surface { background-color: rgb(var(--bg)); }
  .bg-elev { background-color: rgb(var(--bg-elev)); }
  .text-ink { color: rgb(var(--ink)); }
  .text-muted { color: rgb(var(--ink-muted)); }
  .border-hair { border-color: rgb(var(--border)); }
  .text-accent { color: rgb(var(--accent)); }
  .bg-accent { background-color: rgb(var(--accent)); }
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: success (CSS compiles; fonts resolve).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: design tokens, dark-first theme, fonts"
```

---

## Task 5: Site config (the spine)

**Files:**
- Create: `src/config/site.ts`

- [ ] **Step 1: Create the config**

Create `src/config/site.ts`:

```ts
export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** key used to pick an icon */
  icon: 'instagram' | 'x' | 'linkedin' | 'github' | 'email';
}

export const site = {
  name: 'Sandeep J Ramanathan',
  shortName: 'Sandeep JR',
  email: 'sandeep.ramanathan@icloud.com',
  tagline: 'Building technology, music, and ideas that bring people closer together.',
  subline:
    "I'm a Staff Software Engineer, lifelong learner, musician, and Buddhist practitioner exploring how technology can create joy, dignity, and human connection.",
  url: 'https://sandeep-jr.github.io',
  nav: [
    { label: 'About', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Engineering', href: '/engineering' },
    { label: 'Music', href: '/music' },
    { label: 'Blog', href: '/blog' },
    { label: 'Philosophy', href: '/philosophy' },
  ] satisfies NavItem[],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/sandy_jr_19/', icon: 'instagram' },
    { label: 'X', href: 'https://x.com/sjramanathan', icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sjramanathan', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:sandeep.ramanathan@icloud.com', icon: 'email' },
  ] satisfies SocialLink[],
} as const;
```

- [ ] **Step 2: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add site config spine"
```

---

## Task 6: Content collections + schemas

**Files:**
- Create: `src/content.config.ts`
- Create one seed file each: `src/content/blog/engineering-as-a-human-act.mdx`, `src/content/philosophy/technology-should-make-us-more-human.mdx`, `src/content/work/disbursements-platform.md`

- [ ] **Step 1: Define collections and Zod schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const philosophy = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/philosophy' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    summary: z.string(),
    description: z.string(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    image: z.string().optional(),
  }),
});

export const collections = { blog, philosophy, work };
```

- [ ] **Step 2: Create one seed file per collection to validate the schema**

Create `src/content/blog/engineering-as-a-human-act.mdx`:

```mdx
---
title: "Engineering as a Human Act"
date: 2026-06-06
summary: "Why software engineering is not only about systems, but about trust, dignity, and human impact."
draft: true
---

> Draft. Full essay coming soon.

Software engineering is often described as building systems. But behind every
system is a person trying to do something — pay, learn, communicate, create,
recover, decide, or belong.
```

Create `src/content/philosophy/technology-should-make-us-more-human.mdx`
using the full essay text from **Appendix A → Philosophy → Essay 1**, with this
frontmatter:

```mdx
---
title: "Technology Should Make Us More Human"
order: 1
summary: "The deepest measure of technology is whether it helps people become more human."
---
```

Create `src/content/work/disbursements-platform.md` using the project text from
**Appendix A → Work → Project 1**:

```md
---
title: "Disbursements Platform"
order: 1
summary: "Built and led a platform for reliable, scalable financial disbursement operations."
description: "I helped lead the evolution of Tesla's disbursements platform, including architecture, platform capabilities, and execution across critical financial workflows. My work focused on building systems that could process money movement reliably, support business growth, improve operational visibility, and reduce manual intervention. This required close collaboration across engineering, product, finance, and operations. The platform became a foundation for handling complex disbursement use cases with stronger reliability, better observability, and more scalable engineering patterns."
links: []
---
```

- [ ] **Step 3: Verify schema validation via build**

Run:
```bash
npm run build
```
Expected: build succeeds. (If frontmatter is malformed, the build fails with a
Zod error — that is the schema "test".)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: content collections, schemas, and seed entries"
```

---

## Task 7: Curated data files (music, engineering)

**Files:**
- Create: `src/data/music.ts`, `src/data/engineering.ts`

- [ ] **Step 1: Create music data**

Create `src/data/music.ts` using **Appendix A → Music**:

```ts
export interface MusicPiece {
  title: string;
  blurb: string;
  embedUrl?: string;
}

export const music = {
  intro:
    "Music is one of the deepest ways I understand joy, connection, and human possibility. I'm still early in my musical journey, but I'm drawn to violin, guitar, piano, and the kind of musical experiences that make people feel wonder together. Artists like Jacob Collier inspire me because they remind me that music can be both deeply technical and deeply human. For me, learning music is not about perfection. It is about listening more carefully, expressing more honestly, and one day creating experiences that bring people together across backgrounds, emotions, and cultures.",
  links: {
    spotify: '',
    soundcloud: '',
    youtube: '',
  },
  pieces: [
    { title: 'First Violin Reflections', blurb: "A beginner's journey into patience, discipline, and the emotional honesty of learning an instrument." },
    { title: 'Guitar Practice Notes', blurb: 'Exploring rhythm, voice, and the joy of making music feel personal.' },
    { title: 'Piano Sketches', blurb: 'Simple melodic ideas inspired by wonder, stillness, and human connection.' },
    { title: 'Music That Moves Me', blurb: 'A collection of songs and artists that shape how I think about beauty and creativity.' },
    { title: 'Future Collaboration Experiments', blurb: 'Early ideas for musical experiences that bring people together through improvisation and shared joy.' },
  ] satisfies MusicPiece[],
} as const;
```

- [ ] **Step 2: Create engineering data**

Create `src/data/engineering.ts` using **Appendix A → Engineering**:

```ts
export interface FocusArea {
  title: string;
  blurb: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const engineering = {
  intro:
    "Engineering excites me because it combines logic, creativity, and service. At its best, engineering is not just about making systems work; it is about making complexity understandable, reliable, and useful for people. My areas of depth include backend platforms, financial systems, fraud systems, distributed architecture, observability, data-intensive applications, and cloud-native infrastructure. I'm especially interested in the future of agentic AI, workflow orchestration, service mesh, and platform engineering — not as isolated technologies, but as building blocks for products and organizations that can move with greater clarity, speed, and trust.",
  focusAreas: [
    { title: 'Platform Engineering', blurb: 'Designing reusable systems, services, and capabilities that help teams build faster without sacrificing reliability or clarity.' },
    { title: 'Distributed Systems', blurb: 'Building backend architectures that handle scale, failure, data movement, observability, and long-running business workflows.' },
    { title: 'FinTech & Fraud Systems', blurb: 'Creating platforms for money movement, fraud prevention, chargebacks, subscriptions, risk visibility, and financial operations.' },
    { title: 'Cloud-Native Infrastructure', blurb: 'Exploring Kubernetes, Docker, Envoy, Istio, ArgoCD, Helm, GitOps, Prometheus, Grafana, and production-grade deployment patterns.' },
    { title: 'Agentic AI Infrastructure', blurb: 'Studying how agents, tools, workflows, memory, evaluation, and orchestration can become reliable production systems.' },
  ] satisfies FocusArea[],
  skills: [
    { label: 'Languages', items: ['Java', 'Go', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'Rust'] },
    { label: 'Backend', items: ['Spring Boot', 'gRPC', 'REST', 'Kafka', 'Kafka Streams', 'Kafka Connect', 'Temporal', 'Redis', 'Feign', 'SFTP'] },
    { label: 'Databases', items: ['MySQL', 'MongoDB', 'ClickHouse', 'Vertica', 'Neo4j', 'PostgreSQL', 'Cassandra', 'ScyllaDB', 'Elasticsearch'] },
    { label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Helm', 'ArgoCD', 'Nginx Ingress', 'Envoy', 'Istio', 'Bazel', 'GitHub Actions'] },
    { label: 'Observability', items: ['Prometheus', 'Micrometer', 'Grafana', 'Splunk', 'Distributed tracing', 'Metrics dashboards'] },
    { label: 'Frontend / Data Viz', items: ['React', 'MUI', 'D3', 'Nivo'] },
    { label: 'AI / Agents', items: ['LLM applications', 'Agent workflows', 'Tool use', 'Evaluation', 'Retrieval', 'Orchestration', 'AI infrastructure'] },
    { label: 'Practices', items: ['Platform design', 'System architecture', 'Technical leadership', 'Mentorship', 'Reliability engineering', 'Product thinking'] },
  ] satisfies SkillGroup[],
} as const;
```

- [ ] **Step 3: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: music and engineering data"
```

---

## Task 8: SEO helper (real TDD)

**Files:**
- Create: `src/lib/seo.ts`, `src/lib/seo.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/seo.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildMeta } from './seo';

describe('buildMeta', () => {
  it('uses page title with site name suffix', () => {
    const m = buildMeta({ title: 'Work', description: 'd', path: '/work' });
    expect(m.title).toBe('Work — Sandeep J Ramanathan');
  });

  it('does not double-suffix the home title', () => {
    const m = buildMeta({ title: 'Sandeep J Ramanathan', description: 'd', path: '/' });
    expect(m.title).toBe('Sandeep J Ramanathan');
  });

  it('builds an absolute canonical url', () => {
    const m = buildMeta({ title: 'Work', description: 'd', path: '/work' });
    expect(m.canonical).toBe('https://sandeep-jr.github.io/work');
  });

  it('builds an absolute og image url from the og route', () => {
    const m = buildMeta({ title: 'Work', description: 'd', path: '/work', ogId: 'work' });
    expect(m.ogImage).toBe('https://sandeep-jr.github.io/og/work.png');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test -- src/lib/seo.test.ts
```
Expected: FAIL — cannot find module `./seo`.

- [ ] **Step 3: Implement**

Create `src/lib/seo.ts`:

```ts
import { site } from '../config/site';

export interface MetaInput {
  title: string;
  description: string;
  path: string;
  ogId?: string;
}

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

export function buildMeta({ title, description, path, ogId }: MetaInput): Meta {
  const fullTitle = title === site.name ? title : `${title} — ${site.name}`;
  const canonical = new URL(path, site.url).href;
  const ogImage = new URL(`/og/${ogId ?? 'home'}.png`, site.url).href;
  return { title: fullTitle, description, canonical, ogImage };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test -- src/lib/seo.test.ts
```
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: SEO/OG metadata builder with tests"
```

---

## Task 9: React islands — ThemeToggle, Reveal, Nav

**Files:**
- Create: `src/components/react/ThemeToggle.tsx`, `src/components/react/Reveal.tsx`, `src/components/react/Nav.tsx`
- Install: `motion`

- [ ] **Step 1: Install Framer Motion**

Run:
```bash
npm install motion
```

- [ ] **Step 2: ThemeToggle island**

Create `src/components/react/ThemeToggle.tsx`:

```tsx
import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

function apply(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) || 'dark';
    setTheme(stored);
    apply(stored);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    apply(next);
    localStorage.setItem('theme', next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="rounded-full border border-hair p-2 text-muted transition-colors hover:text-ink"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
```

- [ ] **Step 3: Reveal wrapper (scroll/entrance animation)**

Create `src/components/react/Reveal.tsx`:

```tsx
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Nav island**

Create `src/components/react/Nav.tsx`:

```tsx
import { useState } from 'react';
import { site } from '../../config/site';
import { cn } from '../../lib/cn';

export default function Nav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1">
      <button
        type="button"
        className="rounded-md px-3 py-2 text-sm text-muted hover:text-ink md:hidden"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      <ul
        className={cn(
          'gap-1 md:flex',
          open
            ? 'absolute left-0 right-0 top-full flex flex-col border-b border-hair bg-elev p-4 md:static md:flex-row md:border-0 md:bg-transparent md:p-0'
            : 'hidden md:flex',
        )}
      >
        {site.nav.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors hover:text-ink',
                isActive(item.href) ? 'text-accent' : 'text-muted',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 5: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: react islands — theme toggle, reveal, nav"
```

---

## Task 10: Astro components — SocialLinks, Footer, Prose

**Files:**
- Create: `src/components/SocialLinks.astro`, `src/components/Footer.astro`, `src/components/Prose.astro`

- [ ] **Step 1: SocialLinks**

Create `src/components/SocialLinks.astro`:

```astro
---
import { site } from '../config/site';
const labels: Record<string, string> = {
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  email: 'Email',
};
---
<ul class="flex flex-wrap items-center gap-4">
  {site.socials.map((s) => (
    <li>
      <a
        href={s.href}
        target={s.icon === 'email' ? undefined : '_blank'}
        rel={s.icon === 'email' ? undefined : 'noopener noreferrer'}
        class="text-sm text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
      >
        {labels[s.icon] ?? s.label}
      </a>
    </li>
  ))}
</ul>
```

- [ ] **Step 2: Footer**

Create `src/components/Footer.astro`:

```astro
---
import { site } from '../config/site';
import SocialLinks from './SocialLinks.astro';
---
<footer class="mt-24 border-t border-hair">
  <div class="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between">
    <div>
      <p class="font-serif text-lg text-ink">{site.name}</p>
      <p class="text-sm text-muted">Built with craft.</p>
    </div>
    <SocialLinks />
  </div>
</footer>
```

- [ ] **Step 3: Prose wrapper for long-form**

Create `src/components/Prose.astro`:

```astro
---
// Typographic wrapper for MDX content (blog + philosophy).
---
<div class="prose-craft mx-auto max-w-2xl">
  <slot />
</div>

<style is:global>
  .prose-craft { font-family: var(--font-serif); line-height: 1.75; }
  .prose-craft h1, .prose-craft h2, .prose-craft h3 {
    font-family: var(--font-sans);
    color: rgb(var(--ink));
    letter-spacing: -0.01em;
    margin-top: 2em;
    margin-bottom: 0.5em;
    line-height: 1.2;
  }
  .prose-craft h2 { font-size: 1.5rem; }
  .prose-craft p { margin: 1.1em 0; color: rgb(var(--ink)); }
  .prose-craft a { color: rgb(var(--accent)); text-decoration: underline; text-underline-offset: 3px; }
  .prose-craft blockquote {
    border-left: 2px solid rgb(var(--accent));
    padding-left: 1rem;
    color: rgb(var(--ink-muted));
    font-style: italic;
  }
  .prose-craft ul { list-style: disc; padding-left: 1.4em; }
</style>
```

- [ ] **Step 4: Verify types**

Run:
```bash
npx astro check
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: social links, footer, prose components"
```

---

## Task 11: BaseLayout and ProseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/layouts/ProseLayout.astro`

- [ ] **Step 1: BaseLayout with head, theme bootstrap, view transitions**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import { ClientRouter } from 'astro:transitions';
import '../styles/global.css';
import { site } from '../config/site';
import { buildMeta, type MetaInput } from '../lib/seo';
import Nav from '../components/react/Nav.tsx';
import ThemeToggle from '../components/react/ThemeToggle.tsx';
import Footer from '../components/Footer.astro';

interface Props extends Omit<MetaInput, 'path'> {}
const { title, description, ogId } = Astro.props;
const meta = buildMeta({ title, description, path: Astro.url.pathname, ogId });
---
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <link rel="canonical" href={meta.canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:url" content={meta.canonical} />
    <meta property="og:image" content={meta.ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={meta.ogImage} />
    <!-- Apply stored theme before paint to avoid flash -->
    <script is:inline>
      if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light');
      }
    </script>
    <ClientRouter />
  </head>
  <body class="bg-surface text-ink">
    <header class="sticky top-0 z-50 border-b border-hair bg-surface/80 backdrop-blur">
      <div class="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" class="font-serif text-lg tracking-tight text-ink">{site.shortName}</a>
        <div class="flex items-center gap-2">
          <Nav pathname={Astro.url.pathname} client:load />
          <ThemeToggle client:load />
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-6 py-16">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: ProseLayout for articles**

Create `src/layouts/ProseLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Prose from '../components/Prose.astro';

interface Props {
  title: string;
  description: string;
  ogId?: string;
  date?: Date;
  backHref: string;
  backLabel: string;
}
const { title, description, ogId, date, backHref, backLabel } = Astro.props;
---
<BaseLayout title={title} description={description} ogId={ogId}>
  <article>
    <a href={backHref} class="text-sm text-muted hover:text-accent">← {backLabel}</a>
    <header class="mx-auto mt-6 max-w-2xl">
      <h1 class="font-sans text-4xl font-semibold tracking-tight text-ink">{title}</h1>
      {date && (
        <p class="mt-2 text-sm text-muted">
          {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
    </header>
    <div class="mt-10">
      <Prose>
        <slot />
      </Prose>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verify build (exercises layouts + islands together)**

Run:
```bash
npm run build
```
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: base and prose layouts"
```

---

## Task 12: Landing / About page

**Files:**
- Create: `src/components/FacetCard.astro`
- Replace: `src/pages/index.astro`

- [ ] **Step 1: FacetCard component**

Create `src/components/FacetCard.astro`:

```astro
---
interface Props { title: string; href: string; blurb: string; }
const { title, href, blurb } = Astro.props;
---
<a
  href={href}
  class="group block rounded-2xl border border-hair bg-elev p-6 transition-all hover:-translate-y-1 hover:border-accent"
>
  <h3 class="font-serif text-xl text-ink">{title}</h3>
  <p class="mt-2 text-sm text-muted">{blurb}</p>
  <span class="mt-4 inline-block text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">Explore →</span>
</a>
```

- [ ] **Step 2: Landing page with hero, narrative, facets**

Replace `src/pages/index.astro` with (About narrative + quick facts from
**Appendix A → About**):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../config/site';
import FacetCard from '../components/FacetCard.astro';
import SocialLinks from '../components/SocialLinks.astro';
import Reveal from '../components/react/Reveal.tsx';

const facets = [
  { title: 'Work', href: '/work', blurb: 'Platforms in fintech, fraud, and money movement at scale.' },
  { title: 'Engineering', href: '/engineering', blurb: 'Distributed systems, cloud-native infra, and agentic AI.' },
  { title: 'Music', href: '/music', blurb: 'Violin, guitar, piano — and music that brings people together.' },
  { title: 'Blog', href: '/blog', blurb: 'Writing on engineering, leadership, and being human.' },
  { title: 'Philosophy', href: '/philosophy', blurb: 'Technology, Buddhism, peace, and human dignity.' },
];

const quickFacts = [
  'Staff Software Engineer building fintech and platform systems at Tesla.',
  'Exploring product leadership, business strategy, and human-centered technology.',
  'Learning music through violin, guitar, and piano.',
  'Studying Buddhism, leadership, writing, engineering, and the humanities.',
  'Building a stronger body, clearer mind, and more courageous life.',
  'Writing about technology, creativity, peace, and human dignity.',
];
---
<BaseLayout
  title={site.name}
  description={site.subline}
  ogId="home"
>
  <section class="py-12 md:py-20">
    <Reveal client:load>
      <p class="text-sm uppercase tracking-widest text-accent">Sandeep J Ramanathan</p>
      <h1 class="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-6xl">
        {site.tagline}
      </h1>
      <p class="mt-6 max-w-2xl text-lg text-muted">{site.subline}</p>
      <div class="mt-8"><SocialLinks /></div>
    </Reveal>
  </section>

  <section class="border-t border-hair py-16">
    <div class="grid gap-10 md:grid-cols-[1.4fr_1fr]">
      <Reveal client:load>
        <div class="space-y-5 font-serif text-lg leading-relaxed text-ink">
          <p>I'm a Staff Software Engineer, builder, musician, Buddhist practitioner, and lifelong learner driven by a simple belief: the things we create should help people feel more joyful, connected, capable, and alive.</p>
          <p>My journey into technology began with a deep admiration for products that could move people emotionally. Growing up, I struggled academically and often questioned my own worth. But seeing how companies like Apple fused engineering, design, and humanity inspired me to pursue Electrical Engineering, entrepreneurship, and mathematics. That path eventually led me to Tesla, where I've spent years building and leading platforms across fintech, fraud, disbursements, payments, and large-scale backend systems.</p>
          <p>At work, I care deeply about resilient architecture, platform thinking, technical excellence, and compassionate leadership. But I don't want my life to be defined by career alone. I'm also drawn to music, writing, philosophy, travel, fitness, adventure, and the lifelong pursuit of becoming a more courageous and expansive human being.</p>
          <p>My Buddhist practice, rooted in the SGI tradition, has shaped the way I think about leadership, responsibility, and peace. It reminds me that every system, product, and decision ultimately comes back to people.</p>
          <p>This site is a living portfolio of that journey: engineering, creativity, personal transformation, and the search for work that serves humanity.</p>
        </div>
      </Reveal>
      <Reveal client:load delay={0.1}>
        <aside class="rounded-2xl border border-hair bg-elev p-6">
          <h2 class="text-sm uppercase tracking-widest text-muted">Currently</h2>
          <ul class="mt-4 space-y-3 text-sm text-ink">
            {quickFacts.map((f) => (
              <li class="flex gap-2"><span class="text-accent">—</span><span>{f}</span></li>
            ))}
          </ul>
        </aside>
      </Reveal>
    </div>
  </section>

  <section class="border-t border-hair py-16">
    <h2 class="font-serif text-2xl text-ink">Choose a door</h2>
    <p class="mt-2 text-muted">Every side of me has its own room. Walk into the one you're curious about.</p>
    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {facets.map((f) => <FacetCard {...f} />)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Visual check**

Run:
```bash
npm run dev
```
Open `http://localhost:4321/` and confirm: hero renders, dark theme, theme
toggle flips to light and persists on reload, facet cards lift on hover. Stop the
server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: landing/about page"
```

---

## Task 13: Work page

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/pages/work.astro`
- Create remaining work entries: `src/content/work/fraud-platform.md`, `chargeback-automation.md`, `fintech-platform-architecture.md`, `subscriptions-platform.md`, `engineering-learning-roadmaps.md`

- [ ] **Step 1: Create the five remaining work entries**

Using **Appendix A → Work (Projects 2–6)**, create one `.md` file per project in
`src/content/work/`, each with frontmatter `title`, `order` (2–6), `summary`,
`description`, and `links` (use `[]` when only internal links exist; for Project 6
use the empty-link default). Follow the exact shape from Task 6 Step 2.

File → order mapping:
- `fraud-platform.md` → order 2
- `chargeback-automation.md` → order 3
- `fintech-platform-architecture.md` → order 4
- `subscriptions-platform.md` → order 5
- `engineering-learning-roadmaps.md` → order 6

- [ ] **Step 2: ProjectCard**

Create `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  title: string;
  summary: string;
  description: string;
  links: { label: string; href: string }[];
}
const { title, summary, description, links } = Astro.props;
---
<article class="rounded-2xl border border-hair bg-elev p-6 transition-colors hover:border-accent">
  <h3 class="font-serif text-xl text-ink">{title}</h3>
  <p class="mt-1 text-sm text-accent">{summary}</p>
  <p class="mt-4 text-sm leading-relaxed text-muted">{description}</p>
  {links.length > 0 && (
    <ul class="mt-4 flex flex-wrap gap-3">
      {links.map((l) => (
        <li><a href={l.href} class="text-sm text-accent underline underline-offset-4">{l.label}</a></li>
      ))}
    </ul>
  )}
</article>
```

- [ ] **Step 3: Work page**

Create `src/pages/work.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import Reveal from '../components/react/Reveal.tsx';

const projects = (await getCollection('work')).sort(
  (a, b) => a.data.order - b.data.order,
);
const intro = "My work sits at the intersection of platform engineering, financial technology, fraud prevention, distributed systems, and product execution. At Tesla, I've had the opportunity to build and lead systems that support critical business operations at scale. I care about creating platforms that are resilient, observable, extensible, and understandable by the teams that depend on them. Beyond writing code, I focus on architecture, execution, mentorship, and turning ambiguous business problems into systems that create durable impact.";
---
<BaseLayout title="Work" description={intro} ogId="work">
  <h1 class="font-serif text-4xl text-ink">Work</h1>
  <p class="mt-4 max-w-2xl text-lg text-muted">{intro}</p>
  <div class="mt-12 grid gap-6 md:grid-cols-2">
    {projects.map((p, i) => (
      <Reveal client:load delay={i * 0.05}>
        <ProjectCard title={p.data.title} summary={p.data.summary} description={p.data.description} links={p.data.links} />
      </Reveal>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 4: Verify build + visual**

Run:
```bash
npm run build && npm run dev
```
Open `/work`, confirm 6 projects render in order. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: work page and project entries"
```

---

## Task 14: Engineering page

**Files:**
- Create: `src/pages/engineering.astro`

- [ ] **Step 1: Engineering page**

Create `src/pages/engineering.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Reveal from '../components/react/Reveal.tsx';
import { engineering } from '../data/engineering';
---
<BaseLayout title="Engineering" description={engineering.intro} ogId="engineering">
  <h1 class="font-serif text-4xl text-ink">Engineering</h1>
  <p class="mt-4 max-w-3xl text-lg text-muted">{engineering.intro}</p>

  <section class="mt-14">
    <h2 class="text-sm uppercase tracking-widest text-accent">Focus areas</h2>
    <div class="mt-6 grid gap-6 md:grid-cols-2">
      {engineering.focusAreas.map((f, i) => (
        <Reveal client:load delay={i * 0.05}>
          <div class="rounded-2xl border border-hair bg-elev p-6">
            <h3 class="font-serif text-xl text-ink">{f.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">{f.blurb}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>

  <section class="mt-16">
    <h2 class="text-sm uppercase tracking-widest text-accent">Skills & tools</h2>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      {engineering.skills.map((g) => (
        <div>
          <h3 class="text-sm font-semibold text-ink">{g.label}</h3>
          <ul class="mt-2 flex flex-wrap gap-2">
            {g.items.map((it) => (
              <li class="rounded-full border border-hair px-3 py-1 text-xs text-muted">{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify build + visual**

Run:
```bash
npm run build && npm run dev
```
Open `/engineering`, confirm focus areas + skill chips render. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: engineering page"
```

---

## Task 15: Music page

**Files:**
- Create: `src/pages/music.astro`

- [ ] **Step 1: Music page**

Create `src/pages/music.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Reveal from '../components/react/Reveal.tsx';
import { music } from '../data/music';
---
<BaseLayout title="Music" description={music.intro} ogId="music">
  <h1 class="font-serif text-4xl text-ink">Music</h1>
  <p class="mt-4 max-w-3xl text-lg text-muted">{music.intro}</p>

  <section class="mt-14 grid gap-6 md:grid-cols-2">
    {music.pieces.map((p, i) => (
      <Reveal client:load delay={i * 0.05}>
        <article class="rounded-2xl border border-hair bg-elev p-6">
          <h3 class="font-serif text-xl text-ink">{p.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">{p.blurb}</p>
          {p.embedUrl && (
            <a href={p.embedUrl} class="mt-3 inline-block text-sm text-accent underline underline-offset-4">Listen →</a>
          )}
        </article>
      </Reveal>
    ))}
  </section>

  <p class="mt-12 text-sm text-muted">More recordings and embeds coming soon.</p>
</BaseLayout>
```

- [ ] **Step 2: Verify build + visual**

Run:
```bash
npm run build && npm run dev
```
Open `/music`, confirm 5 pieces render. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: music page"
```

---

## Task 16: Blog index + post route

**Files:**
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`
- Create remaining 4 blog drafts in `src/content/blog/`

- [ ] **Step 1: Create the 4 remaining blog drafts**

Using **Appendix A → Blog (planned posts 2–5)**, create one `.mdx` per post in
`src/content/blog/` with frontmatter `title`, `date: 2026-06-06`, `summary`
(the one-line description), `draft: true`, and a short placeholder body:
`> Draft. Full essay coming soon.`

Files:
- `what-platform-engineering-taught-me-about-leadership.mdx`
- `from-struggle-to-craft.mdx`
- `why-im-learning-music.mdx`
- `the-future-of-agentic-ai-infrastructure.mdx`

- [ ] **Step 2: Blog index (hides drafts)**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Reveal from '../../components/react/Reveal.tsx';

const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);
const drafts = (await getCollection('blog', ({ data }) => data.draft));
const intro = 'A living record of how I think, build, struggle, learn, and contribute — across engineering, leadership, music, Buddhism, and what it means to be human.';
---
<BaseLayout title="Blog" description={intro} ogId="blog">
  <h1 class="font-serif text-4xl text-ink">Blog</h1>
  <p class="mt-4 max-w-2xl text-lg text-muted">{intro}</p>

  <ul class="mt-12 space-y-6">
    {posts.map((post, i) => (
      <Reveal client:load delay={i * 0.05}>
        <li class="border-b border-hair pb-6">
          <a href={`/blog/${post.id}`} class="group block">
            <h2 class="font-serif text-2xl text-ink group-hover:text-accent">{post.data.title}</h2>
            <p class="mt-2 text-muted">{post.data.summary}</p>
          </a>
        </li>
      </Reveal>
    ))}
  </ul>

  {drafts.length > 0 && (
    <section class="mt-16">
      <h2 class="text-sm uppercase tracking-widest text-muted">In the works</h2>
      <ul class="mt-4 space-y-2 text-muted">
        {drafts.map((d) => <li>{d.data.title}</li>)}
      </ul>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 3: Blog post route**

Create `src/pages/blog/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import ProseLayout from '../../layouts/ProseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<ProseLayout
  title={post.data.title}
  description={post.data.summary}
  date={post.data.date}
  backHref="/blog"
  backLabel="All posts"
>
  <Content />
</ProseLayout>
```

- [ ] **Step 4: Verify build + visual**

Run:
```bash
npm run build && npm run dev
```
Open `/blog`: the published post links through to its article; the 4 drafts
appear under "In the works" but are not clickable pages. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: blog index and post route"
```

---

## Task 17: Philosophy index + essay route

**Files:**
- Create: `src/pages/philosophy/index.astro`, `src/pages/philosophy/[...slug].astro`
- Create remaining 3 philosophy essays in `src/content/philosophy/`

- [ ] **Step 1: Create the 3 remaining essays**

Using **Appendix A → Philosophy (Essays 2–4)**, create one `.mdx` per essay in
`src/content/philosophy/` with full body text and frontmatter `title`, `order`
(2–4), `summary`:
- `leadership-begins-with-human-dignity.mdx` → order 2
- `the-builder-as-a-lifelong-learner.mdx` → order 3
- `peace-is-built-in-daily-life.mdx` → order 4

- [ ] **Step 2: Philosophy index**

Create `src/pages/philosophy/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Reveal from '../../components/react/Reveal.tsx';

const essays = (await getCollection('philosophy', ({ data }) => !data.draft)).sort(
  (a, b) => a.data.order - b.data.order,
);
const intro = "The questions that drive me are not only technical. I often think about what it means to live courageously, build responsibly, and create things that honor the dignity of life. I believe the systems we build reflect the people we are becoming.";
---
<BaseLayout title="Philosophy" description={intro} ogId="philosophy">
  <h1 class="font-serif text-4xl text-ink">Philosophy</h1>
  <p class="mt-4 max-w-2xl text-lg text-muted">{intro}</p>

  <ul class="mt-12 space-y-6">
    {essays.map((essay, i) => (
      <Reveal client:load delay={i * 0.05}>
        <li class="border-b border-hair pb-6">
          <a href={`/philosophy/${essay.id}`} class="group block">
            <h2 class="font-serif text-2xl text-ink group-hover:text-accent">{essay.data.title}</h2>
            <p class="mt-2 text-muted">{essay.data.summary}</p>
          </a>
        </li>
      </Reveal>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 3: Philosophy essay route**

Create `src/pages/philosophy/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import ProseLayout from '../../layouts/ProseLayout.astro';

export async function getStaticPaths() {
  const essays = await getCollection('philosophy', ({ data }) => !data.draft);
  return essays.map((essay) => ({ params: { slug: essay.id }, props: { essay } }));
}

const { essay } = Astro.props;
const { Content } = await render(essay);
---
<ProseLayout
  title={essay.data.title}
  description={essay.data.summary}
  backHref="/philosophy"
  backLabel="All essays"
>
  <Content />
</ProseLayout>
```

- [ ] **Step 4: Verify build + visual**

Run:
```bash
npm run build && npm run dev
```
Open `/philosophy`, confirm 4 essays list and each opens a styled article. Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: philosophy index and essay route"
```

---

## Task 18: Build-time OG images

**Files:**
- Create: `src/pages/og/[...route].ts`
- Install: `astro-og-canvas`

- [ ] **Step 1: Install**

Run:
```bash
npm install astro-og-canvas
```

- [ ] **Step 2: OG image endpoint**

Create `src/pages/og/[...route].ts`:

```ts
import { OGImageRoute } from 'astro-og-canvas';
import { site } from '../../config/site';

// One OG card per top-level page (ids match buildMeta ogId values).
const pages: Record<string, { title: string; description: string }> = {
  home: { title: site.name, description: site.tagline },
  work: { title: 'Work', description: 'Platforms in fintech, fraud, and money movement at scale.' },
  engineering: { title: 'Engineering', description: 'Distributed systems, cloud-native infra, and agentic AI.' },
  music: { title: 'Music', description: 'Violin, guitar, piano — music that brings people together.' },
  blog: { title: 'Blog', description: 'Engineering, leadership, and being human.' },
  philosophy: { title: 'Philosophy', description: 'Technology, Buddhism, peace, and human dignity.' },
};

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[24, 22, 20]],
    border: { color: [224, 168, 96], width: 8, side: 'inline-start' },
    padding: 60,
  }),
});
```

- [ ] **Step 3: Verify build produces OG PNGs**

Run:
```bash
npm run build
```
Expected: success; `dist/og/home.png`, `dist/og/work.png`, etc. exist. Confirm:
```bash
ls dist/og/
```
Expected: `home.png blog.png engineering.png music.png philosophy.png work.png`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: build-time OG images"
```

---

## Task 19: Favicon and placeholder portrait

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Minimal monogram favicon**

Create `public/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#181614"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Georgia, serif" font-size="30" fill="#e0a860">S</text>
</svg>
```

- [ ] **Step 2: Verify build + commit**

Run:
```bash
npm run build
```
Expected: success.

```bash
git add -A
git commit -m "feat: favicon"
```

---

## Task 20: GitHub Actions deploy to Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Document the one-time Pages setting**

Add a note to commit message / inform the user: in the GitHub repo, go to
**Settings → Pages → Build and deployment → Source: GitHub Actions**. This is a
one-time manual setting; the workflow handles the rest.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "ci: deploy to GitHub Pages via Actions"
```

---

## Task 21: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full clean build**

Run:
```bash
rm -rf dist && npm run build
```
Expected: success, no warnings about missing pages or broken content.

- [ ] **Step 2: Type + content check**

Run:
```bash
npx astro check
```
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Unit tests**

Run:
```bash
npm test
```
Expected: all `cn` and `seo` tests pass.

- [ ] **Step 4: Link sanity check across built HTML**

Run:
```bash
npx --yes linkinator ./dist --recurse --silent --skip "^https?://"
```
Expected: "0 broken" for internal links (external links skipped).

- [ ] **Step 5: Manual sweep in preview**

Run:
```bash
npm run preview
```
Visit `/`, `/work`, `/engineering`, `/music`, `/blog`, a blog post,
`/philosophy`, a philosophy essay. Confirm: nav active states, theme toggle
persists, animations play, all content present, dark + light both look right.
Ctrl+C.

- [ ] **Step 6: Final commit (if any tweaks were made)**

```bash
git add -A
git commit -m "chore: final verification pass" --allow-empty
```

---

## Self-review against spec

- **§1 Purpose / hub** → Tasks 5 (socials), 12 (landing facets + socials), 10 (footer). ✓
- **§2 Design language (dark-first, fonts, motion, reduced-motion)** → Tasks 4, 9 (Reveal), 11 (ClientRouter). ✓
- **§3 Architecture (per-tab routes, nav, view transitions)** → Tasks 11, 12–17. ✓
- **§4 Content model (MDX collections, structured work, data files, site spine)** → Tasks 5, 6, 7. ✓
- **§5 Per-tab content** → Tasks 12 (about), 13 (work), 14 (engineering), 15 (music), 16 (blog), 17 (philosophy). ✓
- **§6 No contact form; email + socials; SEO + OG** → Tasks 5/10 (email+socials, no form), 8 + 11 + 18 (SEO meta + sitemap from Task 2 + OG images). ✓
- **§7 Accessibility/perf/testing** → Task 4 (reduced motion/contrast), aria labels in Task 9, Tasks 3/8 (unit tests), Task 21 (build/check/link checks). ✓
- **§8 Deployment** → Task 20. ✓
- **§9 Out of scope** → no form/auth/CMS/analytics introduced. ✓
- **§10 Future polish** → real media, embeds, full blog posts left as drafts/placeholders intentionally (Tasks 6, 7, 16). ✓

Type consistency check: `buildMeta`/`Meta` (Task 8) used consistently by
`BaseLayout`/`ProseLayout` (Task 11); `site` shape (Task 5) consumed by Nav,
SocialLinks, Footer, seo, og; collection field names (`order`, `summary`,
`description`, `links`, `date`, `draft`) consistent between `content.config.ts`
(Task 6) and every consumer (Tasks 13, 16, 17). `cn` signature stable across Nav.

---

## Appendix A — Canonical content (source of truth for content tasks)

> This is the verbatim intake content. Content tasks copy from here so no step
> contains a placeholder.

### About

**Primary narrative** (used in Task 12):
> I'm a Staff Software Engineer, builder, musician, Buddhist practitioner, and lifelong learner driven by a simple belief: the things we create should help people feel more joyful, connected, capable, and alive.
>
> My journey into technology began with a deep admiration for products that could move people emotionally. Growing up, I struggled academically and often questioned my own worth. But seeing how companies like Apple fused engineering, design, and humanity inspired me to pursue Electrical Engineering, entrepreneurship, and mathematics. That path eventually led me to Tesla, where I've spent years building and leading platforms across fintech, fraud, disbursements, payments, and large-scale backend systems.
>
> At work, I care deeply about resilient architecture, platform thinking, technical excellence, and compassionate leadership. But I don't want my life to be defined by career alone. I'm also drawn to music, writing, philosophy, travel, fitness, adventure, and the lifelong pursuit of becoming a more courageous and expansive human being.
>
> My Buddhist practice, rooted in the SGI tradition, has shaped the way I think about leadership, responsibility, and peace. It reminds me that every system, product, and decision ultimately comes back to people.
>
> This site is a living portfolio of that journey: engineering, creativity, personal transformation, and the search for work that serves humanity.

**Quick facts** (Currently): see the six bullets embedded in Task 12.

### Music

Intro + 5 featured pieces: embedded verbatim in Task 7 (`src/data/music.ts`).

### Work — projects (used in Tasks 6 & 13)

**Project 1 — Disbursements Platform** (in Task 6).
Summary: "Built and led a platform for reliable, scalable financial disbursement operations."

**Project 2 — Fraud Platform**
Summary: "Built and led fraud platform capabilities to detect, investigate, and prevent financial risk."
Description: "I helped build and lead Tesla's fraud platform efforts, focusing on systems that enabled fraud detection, investigation, analytics, and operational workflows. The work involved designing backend services, data models, platform capabilities, and tools that allowed teams to reason about financial risk more effectively. Beyond implementation, I contributed to technical direction, team leadership, and cross-functional execution. This project strengthened my belief that great platforms do more than automate work — they give people better judgment, visibility, and confidence."

**Project 3 — Chargeback Automation**
Summary: "Designed systems to automate chargeback workflows and reduce operational complexity."
Description: "I led and contributed to chargeback automation initiatives that helped transform manual, repetitive financial operations into more scalable platform workflows. The work required understanding business processes, payment systems, data flows, and operational pain points, then translating those into backend services and automation capabilities. The result was a system that improved speed, consistency, and visibility across chargeback handling. This project deepened my appreciation for engineering as a bridge between business complexity and human productivity."

**Project 4 — FinTech Platform Architecture**
Summary: "Re-architected platform capabilities to improve scalability, extensibility, and reliability."
Description: "I contributed to the broader re-architecture of Tesla's fintech and fraud platform, with a focus on creating reusable capabilities that could support multiple teams and product lines. This included improving backend architecture, data flows, observability, integration patterns, and service boundaries. My role involved both hands-on engineering and technical leadership: clarifying ambiguous problems, aligning stakeholders, mentoring engineers, and helping teams move toward more durable platform patterns. This work reflects my core engineering philosophy: build systems that scale technically, organizationally, and humanly."

**Project 5 — Subscriptions Platform**
Summary: "Owned and built subscription platform capabilities supporting recurring customer experiences."
Description: "Earlier in my Tesla journey, I worked on the subscriptions platform, building and owning backend capabilities that supported recurring product and customer experiences. This work exposed me to payments, lifecycle management, integrations, reliability, and the importance of designing systems around both business needs and customer trust. It also helped shape my foundation as an engineer: learning how to own production systems, support critical workflows, and build software that people and teams depend on every day."

**Project 6 — Engineering Learning Roadmaps**
Summary: "Building structured learning paths across cloud-native infrastructure, AI agents, and systems engineering."
Description: "Outside of work, I'm developing structured learning roadmaps across Kubernetes, Go, Rust, Docker, Envoy, Temporal, Kafka, databases, GitOps, and agentic AI infrastructure. My goal is to build the kind of deep technical foundation required to bring complex systems from idea to production: cloud infrastructure, distributed workflows, observability, deployment, data systems, and intelligent agents. This project represents my commitment to lifelong learning and my desire to become a builder who can operate across engineering, product, and strategy."

### Engineering

Intro + focus areas + skills: embedded verbatim in Task 7 (`src/data/engineering.ts`).

### Blog — planned posts (used in Tasks 6 & 16)

1. **Engineering as a Human Act** — "Why software engineering is not only about systems, but about trust, dignity, and human impact." (seed in Task 6)
2. **What Platform Engineering Taught Me About Leadership** — "How building scalable platforms shaped my understanding of clarity, ownership, mentorship, and organizational leverage."
3. **From Struggle to Craft** — "A personal essay on academic struggle, self-worth, and how technology became a path toward confidence and contribution."
4. **Why I'm Learning Music** — "Music as a practice of patience, listening, joy, and connection."
5. **The Future of Agentic AI Infrastructure** — "What it will take to make AI agents reliable, observable, and useful in production."

### Philosophy — essays (used in Tasks 6 & 17)

**Essay 1 — Technology Should Make Us More Human** (seed in Task 6)
> Technology is often described in terms of speed, scale, efficiency, and disruption. Those things matter. But I believe the deepest measure of technology is whether it helps people become more human.
>
> The products that have inspired me most were never just functional. They made people feel something. They gave people confidence, creativity, independence, joy, or connection. That is what first drew me toward engineering. I did not want to build software only because it was intellectually challenging. I wanted to build because technology, when created with care, can change how people see themselves and what they believe is possible.
>
> As engineers, we often work far away from the final emotional experience of the user. We think in services, databases, APIs, queues, dashboards, and deployment pipelines. But behind every system is a person trying to do something: pay, learn, communicate, create, recover, decide, or belong. When we remember that, engineering becomes more than problem-solving. It becomes responsibility.
>
> This is the kind of technology I hope to build: not technology that replaces our humanity, but technology that strengthens it. Systems that reduce friction. Products that create trust. Tools that empower people to express themselves. Platforms that help teams move with clarity. Experiences that make life feel a little more joyful and connected.
>
> To me, the future of technology should not only be intelligent. It should be humane.

**Essay 2 — Leadership Begins With Human Dignity**
> The longer I work in engineering, the more I believe leadership begins with how we see people.
>
> It is easy to think leadership is about authority, strategy, execution, or decision-making. All of those matter. But beneath them is something more fundamental: the ability to recognize the dignity and potential of each person. When people feel seen, trusted, and challenged with care, they often become capable of far more than they believed.
>
> My Buddhist practice has shaped this view deeply. It has taught me that transformation begins from within, but it is never only personal. The way we show up affects the people around us. The courage we develop becomes courage we can offer others. The hope we build in ourselves becomes a source of hope in our environment.
>
> In technical teams, this matters. A strong engineering culture is not created only by good architecture or clean processes. It is created by people who take responsibility, speak honestly, learn constantly, and support one another through difficulty. The best leaders create conditions where people can do the strongest work of their lives while becoming stronger human beings in the process.
>
> That is the kind of leader I am trying to become: technically serious, emotionally grounded, honest, compassionate, and courageous. Someone who can build systems, but also build people. Someone who can pursue excellence without losing warmth. Someone who remembers that behind every product, roadmap, and architecture diagram is a human being.

**Essay 3 — The Builder as a Lifelong Learner**
> I want to live as a lifelong learner because the world is too vast, beautiful, and interconnected to approach from only one angle.
>
> Engineering taught me how to reason about systems. Music teaches me how to listen. Buddhism teaches me how to transform suffering into purpose. Business teaches me how ideas become organizations. Writing teaches me how to clarify thought. Fitness teaches me discipline. Relationships teach me humility. Each field reveals something that the others cannot.
>
> For a long time, I thought growth meant becoming excellent in one narrow lane. Now I see it differently. Depth still matters. Craft matters. Discipline matters. But the most meaningful builders often draw from many sources. They combine technology with humanity, strategy with empathy, creativity with rigor, and ambition with service.
>
> That is the kind of life I am trying to build. I want to become the kind of person who can lead complex technical work, create beautiful experiences, speak with clarity, understand people deeply, and contribute to a more peaceful world. That requires more than credentials or achievements. It requires daily effort, humility, and the willingness to keep beginning again.
>
> This website is part of that practice. It is not a finished identity. It is a record of becoming.

**Essay 4 — Peace Is Built in Daily Life**
> When people hear the word peace, they often think of something distant: international agreements, historic movements, or extraordinary leaders. But I believe peace also begins in daily life.
>
> Peace begins in the way we speak to someone who is struggling. It begins in the courage to apologize, the discipline to listen, and the willingness to see dignity in someone we disagree with. It begins in families, teams, neighborhoods, workplaces, and friendships. It begins in the invisible decisions that shape the atmosphere around us.
>
> My Buddhist practice has taught me that inner transformation and social contribution are connected. When we transform our own anger, fear, insecurity, or hopelessness, we become more capable of creating value for others. This does not mean becoming perfect. It means choosing, again and again, to respond with courage instead of cynicism.
>
> As a builder, I think this matters deeply. The future will be shaped by powerful technologies, complex institutions, and global challenges. But those systems will still be built by human beings. If we want a better world, we need people who are not only intelligent, but wise. Not only ambitious, but compassionate. Not only capable, but committed to the dignity of life.
>
> Peace is not passive. It is something we practice, build, and protect.

### Philosophy intro (used in Task 17 index)
> The questions that drive me are not only technical. I often think about what it means to live courageously, build responsibly, and create things that honor the dignity of life. I'm interested in the relationship between technology, creativity, leadership, Buddhism, peace, and human transformation. I believe the systems we build reflect the people we are becoming. That is why I care not only about architecture and execution, but about intention, compassion, and the long-term consequences of our work. My philosophy is still evolving, but its center is simple: build in a way that helps people become more free, connected, and alive.
