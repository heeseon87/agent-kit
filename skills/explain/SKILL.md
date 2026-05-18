---
name: claude-kit:explain
description: Produce an engaging Anthropic-style HTML explainer artifact for any target (code path, endpoint, module, concept)
argument-hint: [target]
---

# Mission

Explain $1 by producing a **self-contained HTML artifact** that reads like an Anthropic research post — typography-driven, restrained, with diagrams that complement the prose rather than replace it. Anthropic's long-form blog (e.g. `anthropic.com/research/tracing-thoughts-language-model`) is the visual reference.

Save the file as `./<target-slug>-explained.html` in the current working directory, then open it (`open` on macOS, `xdg-open` on Linux) to verify rendering.

# What to explain

Cover the dimensions the original instruction names:

- The technical architecture and how the parts connect
- The technologies used, and **why** — name the trade-offs
- Lessons: pitfalls, bugs sidestepped, how good engineers reason about this kind of code
- Best practices revealed by the code, written as concrete takeaways the reader can carry away

# Voice

- Engaging, **not textbook**. Use analogies and anecdotes (e.g. "비유하자면 카메라가 셔터를 누르고 인화까지 마친 사진을 우편으로 보내오면…").
- First body paragraph gets a **serif drop cap** (62px, accent color).
- Italic asides, pull quotes with a large quotation glyph, footnotes for sources or related patterns.
- Section numbers as **italic serif `01`, `02`, …** prefixed to H2 (smaller than the H2 itself).

# Output structure

```
eyebrow  (uppercase tracked, accent-deep)
H1       (60px serif)
lede     (24px italic serif)
byline   (path + filename:line)
endpoint summary  (only when explaining an HTTP/RPC handler)

§01 H2  → narrative prose → optional Fig
§02 H2  → narrative prose → optional Fig
…
9–11 sections, ending with takeaways and pitfalls
ornament (· · ·)
closing blockquote (one sentence)
footnotes (sup-marked references)
```

# Design tokens — verified against anthropic.com

Inline these in `<style>`:

```css
:root {
  --bg:           #F5F4ED;   /* cream / book-cloth */
  --bg-deep:      #EFEDE4;
  --text:         #191917;   /* near-black */
  --text-dim:     #4D483F;
  --text-faint:   #8B8377;
  --rule:         #D8D2C2;
  --rule-strong:  #B8B1A1;
  --accent:       #CC785C;   /* Anthropic clay */
  --accent-deep:  #A75A40;
  --accent-soft:  #ECC9B7;
  --code-bg:      #1F1D1A;
  --code-fg:      #EBE7DA;
}
```

# Typography (free Google Fonts substitutes)

- Headings — **Source Serif 4** (Tiempos substitute)
- Body — **Inter** (Styrene B substitute) at **19px / line-height 1.75** ← this single choice is what gives the "book-like" feel, do not shrink
- Mono — **JetBrains Mono**
- H1 60px / weight 500, H2 30px / weight 500, lede 24px italic serif
- Container `max-width: 720–760px` (measure ≈ 65–75 chars)

# Layout principles

**Do not:**
- Wrap every section in a card — Anthropic articles are nearly *flat*, with no visible boxes around prose
- Use gradients anywhere
- Use colored-background callouts for "Insight"/"Warn" — use a **2px left border** in accent color instead
- Replace narrative with a diagram — the diagram must *follow* the prose it illustrates, not substitute it

**Do:**
- Use lots of vertical whitespace (80px before each H2)
- Use italic serif labels for tagging (`Insight`, `i.`, `ii.`, `Fig 1`)
- Restrict color to a single accent (clay) — no second hue
- Add an ornament `· · ·` between major sections for breathing
- Footnotes via `<sup><a href="#fnN">N</a></sup>` and a bottom `<ol class="footnotes">`

# When and how to add visual elements

A diagram earns its place only when it shows something prose handles poorly:

- **Spatial structure** — ERD, file tree, module graph
- **Temporal sequence** — request flow, async fan-out/join, transaction interior
- **Decision branching** — idempotency check, auth gates
- **File / path structure** — GCS bucket layout, directory hierarchy

Aim for **3–5 figures** in a typical explainer. Number them `Fig 1`, `Fig 2`, … with italic serif captions below.

**SVG style:**
- Hairline strokes (1.2–1.5)
- No fills (rect `fill="none"`), no shadows
- Color: `var(--text)` for static structure, `var(--accent)` only for emphasis
- Internal labels: Source Serif italic, fill `var(--accent-deep)`
- viewBox-based, `width: 100%; height: auto` for responsiveness

**Place SVG after the prose it illustrates, not before or in place of.**

# Animation — at most ONE figure animated

Animate only the single most dynamic moment (typically parallel async behavior). Use this exact recipe:

```javascript
(function () {
  const fig = document.getElementById('animFig');
  if (!fig) return;
  const lines = Array.from(fig.querySelectorAll('.anim-line'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // CRITICAL: measure each path's real length — never use a fixed dasharray
  const lengths = lines.map((line) => {
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = reducedMotion ? 0 : len;
    return len;
  });

  function animate() {
    if (reducedMotion) return;
    // Reset
    lines.forEach((line, i) => {
      line.style.transition = 'none';
      line.style.strokeDashoffset = lengths[i];
    });
    void fig.getBoundingClientRect();  // force reflow before re-applying transition
    // Stagger reveal
    lines.forEach((line, i) => {
      const delay = 0.05 + i * 0.12;
      line.style.transition = `stroke-dashoffset 0.7s ease-out ${delay}s`;
      line.style.strokeDashoffset = '0';
    });
  }

  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(); obs.unobserve(e.target); }
    });
  }, { threshold: 0.35 }).observe(fig);

  window.replayAnim = animate;  // wire to replay button
})();
```

Provide a small **replay** button next to the figcaption (`onclick="replayAnim()"`).

# SVG markers — do NOT use `marker-end` on animated paths

`<marker>` ignores `stroke-dashoffset` and renders at the path's logical endpoint regardless of animation state. The arrowhead appears at the destination *before* the line is drawn — a known SVG quirk with no clean fix.

**Solution:** omit `marker-end` entirely on animated paths. The line terminating at a box edge gives enough directional signal. If an arrow is essential (e.g. final commit step), use it only on *static* paths.

# CJK + ASCII alignment trap

Korean comments next to English file names **cannot** be aligned with whitespace padding — CJK glyphs are wider than ASCII even in monospace fonts. Always use a CSS grid:

```html
<div class="tree">
  <div class="path">gs://<span class="dir">bucket</span>/</div><div class="note"></div>
  <div class="path"><span class="branch">└──</span> <span class="var">{userId}</span>/</div><div class="note">Firebase UID</div>
  <div class="path">    <span class="branch">└──</span> meta.json</div><div class="note">메타 정보</div>
</div>
```

```css
.tree {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 32px;
  padding: 22px 28px;
  background: var(--bg-deep);
  border: 1px solid var(--rule);
  border-radius: 4px;
}
.tree .path { font-family: 'JetBrains Mono', monospace; white-space: pre; font-size: 13px; line-height: 1.85; }
.tree .note { font-family: 'Source Serif 4', serif; font-style: italic; color: var(--text-faint); font-size: 13.5px; align-self: center; }
.tree .note:not(:empty)::before { content: "— "; color: var(--rule-strong); margin-right: 2px; }
.tree .path .dir, .tree .path .var { color: var(--accent-deep); }
.tree .path .var { font-style: italic; }
.tree .path .branch { color: var(--text-faint); }
```

# Process

1. **Orient.** Read the target file(s). Trace dependencies. Note the surprising decisions, the trade-offs, the non-obvious patterns.
2. **Outline.** 8–12 sections numbered `01` through `12` with H2 titles. Start with "what this really does" (often counter-intuitive), end with takeaways and pitfalls.
3. **Write the prose first.** Engaging tone, with analogies. Each section gets 2–4 paragraphs. Drop cap on the first body paragraph.
4. **Mark visual moments.** Identify 3–5 spots where a diagram clarifies more than text would. Insert SVG figures *after* the corresponding prose, numbered and captioned.
5. **Pick one for animation.** Usually the most dynamic concept (async fan-out, parallel writes). Apply the recipe above strictly — `getTotalLength()`, IntersectionObserver, replay button, `prefers-reduced-motion` fallback.
6. **Add footnotes** for related patterns or papers (Stripe Idempotency-Key, Strangler Fig, etc.).
7. **Close** with an ornament and a single italic blockquote summarizing the whole.
8. **Save** as `./<target-slug>-explained.html`. **Open** in the default browser to verify rendering. Mention the file path in the chat reply.

# Don'ts (common mistakes to avoid on the first build)

- ❌ Card-heavy layout — Anthropic articles are nearly card-free
- ❌ Multiple accent colors — stay clay-only
- ❌ Gradients — never
- ❌ Fixed `stroke-dasharray` values for line-draw animations
- ❌ `marker-end` on animated paths
- ❌ Whitespace padding for CJK column alignment
- ❌ Diagram instead of prose — diagram is *always* a supplement
- ❌ Body font smaller than 18px — book-like means readable

# When the target is ambiguous

If `$1` is missing or vague, ask the user once for clarification (a file path, an endpoint, a module name) before producing the artifact. Do not guess at scope.
