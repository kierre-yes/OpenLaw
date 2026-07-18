# The Anti-Slop Ban System

Section 9 of `SKILL.md` ships a strict ban list. The agent enforces these on every generation. The full list lives in the skill file.

## Banned items

- **Em-dashes and en-dashes**: Banned everywhere in output copy, including headlines, eyebrows, pills, body, quotes, attribution, captions, button text, and alt text. Use a hyphen or restructure the sentence.
- **Section-numbering eyebrows**: Examples like `00 / INDEX`, `001 · Capabilities`, and `06 · how it works` are banned. Eyebrows should name the topic in plain language.
- **Hero version labels**: Labels like `V0.6`, `BETA`, and `INVITE-ONLY` in the hero are banned unless the brief is explicitly a product launch.
- **Photo-credit captions as decoration**: Decorative captions such as `Field study no. 12 · Ines Caetano` under stock images are banned. Use real attribution to real photographers only.
- **Hero decoration text strips**: Examples like `BRAND. MOTION. SPATIAL.` and `TYPE / FORM / MOTION`, plus other mono-caps strips at the hero bottom, are banned.
- **Pills overlaid on images**: No labels or tags floating on top of photos. Add a caption directly below the image if needed.
- **Version footers on marketing pages**: Items like `v1.4.2`, `Build 0048`, and `last sync 4s ago` do not belong on landing or portfolio pages.
- **Locale, city, time, weather strips**: Content like `Lisbon 14:23 · 18°C` and similar atmospheric strips is banned for 99% of briefs.
- **Scroll cues**: Items such as `Scroll`, down-arrow icons, and `Scroll to explore` are banned. The user is already at the hero and knows how scrolling works.
- **Decorative status dots**: Zero by default. Use them only when conveying real semantic state, and at most one per page section.
- **`border-t` plus `border-b` on every row**: Banned on long lists and spec tables. Use cards, tabs, scroll-snap pills, marquees, or carousels instead.
- **Div-based fake product UI**: No fake task lists, terminals, or dashboards built out of styled `div`s. Use real screenshots or generated images.
- **Three-equal-card feature rows**: Banned by default. Use a two-column zig-zag, asymmetric grids, or scroll-pinned alternatives.
- **AI-purple and mesh blob gradients**: Banned by default. Use neutral bases with one high-contrast accent. The LILA rule overrides only when the brand is explicitly purple.
- **Hand-rolled decorative SVG illustrations**: Strongly discouraged as the default. Acceptable only for a simple geometric mark or when the brief explicitly asks for it.
- **`window.addEventListener('scroll')`**: Banned in JavaScript. Use Motion `useScroll`, GSAP `ScrollTrigger`, `IntersectionObserver`, or CSS scroll-driven animations.
