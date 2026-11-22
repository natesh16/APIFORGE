# APIFORGE — Design Plan (frontend-design skill)

## Subject matter (identified from the brief)
**Product:** APIFORGE — an API management platform (gateway, keys, routes, rate
limiting, analytics, workspaces).
**Audience:** Developers, platform engineers, engineering teams.
**Primary job:** Manage, secure, route, and observe APIs.

## Design direction
"Forged precision" — industrial craftsmanship applied to API infrastructure.
A dark, quiet base with one deliberate accent (forge heat / molten metal).
Typographic hierarchy carries the personality. No SaaS-card kit, no tracked-out
all-caps eyebrows, no "WORD — fragment" labels, no "→" on buttons, no numbered
markers unless the content is genuinely a sequence.

## Token system

### Color (6 named hex values)
- `--color-base`: #05070A — deep ink base (the cooled forge; near-black as an
  intentional base, not a "tinted near-black standing in for black" default)
- `--color-surface`: #0E1420 — panel / surface layer
- `--color-accent`: #D97706 — amber-600, forge heat / molten metal (the one
  bold element)
- `--color-accent-dim`: #451A03 — dark accent for subtle uses
- `--color-text`: #F1F5F9 — primary text
- `--color-text-muted`: #94A3B8 — secondary text
- `--color-border`: #1E293B — subtle structural borders

### Type (two families, clearly distinct)
- Display / headlines: **Space Grotesk** (geometric, architectural, bold) — used
  as an active part of the design, not a neutral delivery vehicle
- Body: **Inter** (neutral, readable)
- Type scale following *The Elements of Typographic Style*; line lengths < 80
  chars; serif body gets slightly more line-height (n/a here, body is sans)

### Layout
- Left-aligned content (never centered as a default, never justified)
- Single-column hero opening with a **live demo**: an interactive API
  request/response visualizer (the characteristic thing in an API platform's
  world), not a "big number + small label + gradient" default
- Structural dividers encode information, not decoration
- Responsive down to mobile

### Principles
- Spend boldness in one place: the live API demo is the memorable element;
  everything around it quiet and disciplined
- No all-caps labels, no tracked-out eyebrows, no meta strings with middle dots,
  no "→" appended to links/buttons
- Numbered markers only for genuine sequences
- Motion only on user action (opening/expanding/confirming); no fade-and-slide
  on every section, no hover transitions on every card
- Visible keyboard focus, prefers-reduced-motion respected, accessible contrast

## Review against the defaults
1. Warm cream (#F4F1EA) + terracotta (#D97757)? **No.** Dark ink + amber.
2. Near-black + acid-green/vermilion? **No.** Dark ink + amber; no acid-green.
3. Broadsheet hairline rules / dense columns? **No.** Single column, deliberate
   structure.
4. SaaS-card kit (uniform rounded cards, soft grey shadows)? **No.** No uniform
   cards or soft shadows.
5. Template chrome (all-caps eyebrows, middle dots, "WORD — fragment",
   monospace data labels, "→")? **No.** None of these appear.

The plan avoids every listed default and makes subject-specific choices. Ready
to build.
