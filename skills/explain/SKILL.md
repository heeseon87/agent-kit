---
name: claude-kit:explain
description: Explain a target as a self-contained HTML explainer in Anthropic's theme. Same content philosophy as the original markdown explain (architecture, decisions, lessons, analogies), now rendered with the full Anthropic explainer toolbox — eyebrow, large serif H1, italic lede, numbered H2 sections, drop cap, insight callouts, SVG figures with animation, takeaways, footnotes. Scale ornament to topic depth — never force, never refuse.
argument-hint: [target]
---

# What to explain

Explain the whole in plain language.

Explain the technical architecture, the structure of the codebase and how the various parts are connected, the technologies used, why we made these technical decisions, and lessons I can learn from it (this should include the bugs we ran into and how we fixed them, potential pitfalls and how to avoid them in the future, new technologies used, how good engineers think and work, best practices, etc).

It should be very engaging to read; don't make it sound like boring technical documentation/textbook. Where appropriate, use analogies and anecdotes to make it more understandable and memorable.

# How to render

The output is a self-contained HTML file in Anthropic's theme — a rich explainer page that reads like a published piece. The **full explainer toolbox** below is available; **use it in proportion to the topic**.

- Deep endpoint / system / module walkthrough → use the full toolbox (eyebrow, H1, lede, byline, numbered H2 sections with italic clay numerals, drop cap, insight callouts, asides, pull quotes, SVG figures with animation, file-tree blocks, takeaway grid, footnotes, ornament between major sections).
- Moderate feature or concept → fewer ornaments. H1 + paragraphs + insight callouts + maybe one figure.
- Short question / quick overview → just H1 + prose + maybe an insight callout. Skip drop caps, footnotes, figures.

**Never force ornamentation just because it's available. Never refuse it when the topic earns it.** The right amount is what the content earns.

For pure prose narrative (magazine-length article with no tables/figures/sidebars), use `/claude-kit:explain-essay`.
For code with right sidebar (Key files + Gotchas) and callstack walkthrough, use `/claude-kit:explain-code`.

Save as `<target-slug>-explained.html` in the current working directory and run `open <path>`.

For code/file targets: read the relevant files before writing. For URLs: fetch the content. For abstract topics: synthesize from knowledge.

# Theme

## Fonts in `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@100..900&display=swap" rel="stylesheet">
```

Hahmlet (Korean serif variable) handles Korean via `unicode-range`; Latin falls through to system fonts. Monaco is the coding font. **Do not** load Inter, Source Serif 4, Roboto, Noto Sans KR, or Nanum Gothic Coding.

## Design tokens

```css
:root {
  --ivory:    #FAF9F5;
  --slate:    #141413;
  --clay:     #D97757;
  --oat:      #E3DACC;
  --olive:    #788C5D;
  --rust:     #B04A3F;
  --gray-150: #F0EEE6;
  --gray-300: #D1CFC5;
  --gray-500: #87867F;
  --gray-700: #3D3D3A;
  --serif: 'Hahmlet', ui-serif, Georgia, 'Times New Roman', serif;
  --sans:  'Hahmlet', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono:  Monaco, ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}
body {
  background: var(--ivory);
  color: var(--gray-700);
  font-family: var(--serif);
  font-size: 19px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 720-760px; margin: 0 auto; padding: 88px 28px 140px; }
```

## Typography

- Body: serif 19px / 1.75 / gray-700
- H1: serif 56–60px weight 500, color slate, letter-spacing -0.022em
- H2: serif 28–30px weight 500, color slate
- H3: serif 22px weight 500, color slate
- Lede / subtitle: italic serif 22–24px, gray-700
- Eyebrow above H1: sans 12px uppercase letter-spacing 0.16em, clay
- Byline (path + file:line metadata): sans 13px faint, optional

# The Explainer Toolbox

Each pattern below is a *tool* — pick the ones the topic earns.

## Eyebrow + H1 + lede + byline

```html
<p class="eyebrow">PROJECT · NOTE TYPE</p>
<h1>A memorable, specific title — not "How X works"</h1>
<p class="lede">One italic-serif sentence summarizing the human story.</p>
<p class="byline"><strong>METHOD /path/with/{vars}</strong> · path/to/source:LINE</p>
```

## Endpoint summary block (for API endpoints)

```html
<dl class="endpoint">
  <dt>Method</dt>
  <dd><span class="method-tag">POST</span><code>/path</code></dd>
  <dt>Auth</dt>
  <dd><code>...</code></dd>
  <dt>Request</dt>
  <dd>...</dd>
  <dt>Response</dt>
  <dd>...</dd>
</dl>
```
- `.endpoint`: grid `110px 1fr`, border-top + border-bottom in `var(--rule-strong)`, padding 22px 0
- `.endpoint dt`: sans 11px uppercase 0.1em, gray-500
- `.method-tag`: slate background, ivory text, mono 11px, 3px radius, 3px 8px padding

## Numbered H2 sections

```html
<h2><span class="num">01</span>Title</h2>
```
- `.num`: italic, clay-deep, `font-size: 0.6em; vertical-align: 0.35em; margin-right: 14px;`

## Drop cap on the first body paragraph

```html
<p class="body-start">Opening paragraph...</p>
```
```css
.body-start::first-letter {
  font-family: var(--serif);
  float: left;
  font-size: 62px;
  line-height: 0.92;
  padding: 6px 10px 0 0;
  color: var(--clay);
  font-weight: 500;
}
```

## Numbered flow list (procedural steps)

```html
<ol class="flow">
  <li>
    <div class="step-title">Stage name</div>
    <div class="step-desc">Short description with <code>code refs</code>.</div>
  </li>
</ol>
```
- `counter-reset: step;` on `.flow`, each li `counter-increment: step;`
- `::before` shows `counter(step, decimal-leading-zero)` in italic clay-deep
- `::after` draws a hairline vertical connector to the next item

## Transaction sub-block (nested inside a flow)

```html
<div class="tx-block">
  <ol>
    <li><strong>Step A</strong> — short label<span class="desc">More detail.</span></li>
  </ol>
</div>
```
- `.tx-block`: `margin-left: 60px; border-left: 2px solid var(--clay); padding-left: 22px;`
- `::before` content "TRANSACTION" floating top-left with ivory background, sans 10px 600 letter-spacing 0.16em clay-deep
- nested `li::before`: italic clay, content like `"4·"counter(substep, upper-alpha)`

## Insight callouts

```html
<div class="insight">
  <div class="insight-label">Insight — short title</div>
  <ul>
    <li>One non-obvious takeaway.</li>
  </ul>
</div>
```
- `border-left: 2px solid var(--clay); padding-left: 22px;`
- `.insight-label`: italic clay-deep serif 14px
- `li::before`: content `"—"` in clay, absolute left

## Asides (caveats / corrections)

```html
<div class="aside">
  <div class="aside-label">A gentler note</div>
  <p>Caveat or gotcha that's worth flagging but not central.</p>
</div>
```
- `border-left: 2px solid var(--rule-strong); padding-left: 22px; color: var(--gray-700);`
- `.aside-label`: italic slate serif 14px

## Pull quotes

```html
<blockquote>One memorable line that summarizes a key insight.</blockquote>
```
- italic serif 22–24px, margin negative-pulled outside container
- `::before` content `\201C` (curly opening quote) in big clay, hanging absolute left

## Figures with SVG diagrams

```html
<figure>
  <svg viewBox="...">...</svg>
  <figcaption><span class="fig-num">Fig 1</span>What this diagram shows.</figcaption>
</figure>
```
- `figcaption`: italic serif 14.5px gray-700, centered, padding 0 24px
- `.fig-num`: sans 11px uppercase 0.1em clay-deep, NOT italic
- SVG text classes (apply inside SVG):
  - `.svg-text` — serif 13px slate
  - `.svg-text-italic` — italic serif 12px clay-deep
  - `.svg-text-mono` — Monaco 11.5px slate
  - `.svg-text-dim` — sans 10.5px uppercase 0.08em faint
- Boxes: `fill: none; stroke: var(--text); stroke-width: 1.2; rx: 3;`
- Hot boxes / accent: `stroke: var(--clay); stroke-dasharray: 4 3;` for emphasis
- Arrows via `<marker>` markers with fill in gray-500 or clay
- Keep diagrams hairline — single accent color, no fills

## Animated parallel/fan-out diagrams (use sparingly, one per page max)

If the topic has true concurrency (fan-out, parallel calls, broadcast):

```html
<figure>
  <div id="parallelFig">
    <svg viewBox="...">
      <!-- nodes + paths with class="parallel-line fanout" / "parallel-line join" -->
    </svg>
  </div>
  <figcaption>... <button class="replay" onclick="replayParallel()">⟲ replay</button></figcaption>
</figure>
```

JavaScript pattern:
- Measure each path with `path.getTotalLength()` at runtime — never hardcode `stroke-dasharray`
- Set `strokeDasharray = len` and `strokeDashoffset = len` initially
- Animate via CSS `transition: stroke-dashoffset 0.7s ease-out <delay>s;` and set offset to 0
- Multi-phase: use `setTimeout` for phase 2 (e.g., join paths after fan-out)
- IntersectionObserver (threshold 0.35) to auto-play on viewport entry
- Expose `window.replayParallel = animate;`
- Honor `prefers-reduced-motion: reduce` with `stroke-dashoffset: 0 !important`
- `marker-end` cannot be hidden by `stroke-dashoffset` — remove from animated paths, draw arrowheads as separate fading elements

## Path / file tree blocks (two-column grid for clean CJK alignment)

```html
<div class="tree" role="img" aria-label="...">
  <div class="path">gs://<span class="dir">bucket</span>/</div>
  <div class="note"></div>
  <div class="path"><span class="branch">└──</span> <span class="var">{userId}</span>/</div>
  <div class="note">Firebase UID</div>
</div>
```
- `.tree`: `display: grid; grid-template-columns: max-content 1fr; column-gap: 32px; row-gap: 4px;` on a `bg-deep` background with `var(--rule)` border, 4px radius
- `.path`: Monaco 13px, `white-space: pre`
- `.note`: italic serif 13.5px faint, with `— ` prefix in `rule-strong` color
- `.dir` / `.var`: clay-deep
- `.branch`: faint

## Takeaways (lessons grid at the end)

```html
<div class="takeaway">
  <span class="takeaway-tag">i.</span><span class="takeaway-title">Memorable principle.</span>
  <div class="takeaway-body">Two-sentence elaboration with <code>code refs</code>.</div>
</div>
```
- Use roman numerals (i, ii, iii, iv, v) for tags
- `.takeaway-tag`: italic clay-deep serif 13px
- `.takeaway-title`: serif 19px weight 500 slate, inline with the tag
- `.takeaway-body`: 17px gray-700, line-height 1.7

## Tables (borderless + hairline)

```css
table { border-collapse: collapse; width: 100%; font-size: 15.5px; }
thead th { border-top: 1px solid var(--rule-strong); border-bottom: 1px solid var(--rule-strong);
           font-family: var(--sans); font-size: 11px; uppercase; letter-spacing: 0.08em;
           color: var(--gray-500); padding: 10px 0; }
td { border-bottom: 1px solid var(--rule); padding: 14px 14px 14px 0; }
```

## Ornament between major sections

```html
<div class="ornament">· · ·</div>
```
- centered, clay, letter-spacing 0.5em, opacity 0.7, italic serif, margin 72px 0

## Footnotes

Inline: `<sup><a href="#fn1">1</a></sup>` (clay-deep, no underline, 0.75em).
Bottom:
```html
<div class="footnotes">
  <ol>
    <li id="fn1">Reference text with <em>italics</em> and <code>code</code>.</li>
  </ol>
</div>
```
- `.footnotes`: top border `var(--rule-strong)`, padding-top 32px, font 14px gray-700

# What NOT to do

- No Latin web fonts (Inter, Source Serif 4, Roboto, etc.) — system fonts only.
- No card-heavy UI. The patterns above use accent-left borders, not panels.
- No gradients.
- No more than one animation per page, and only when there's real concurrency or motion to show.
- No right sidebar with Key files / Gotchas — that's `/claude-kit:explain-code`.
- No padding for length — write what the topic earns, then stop.

# References (bundled with this plugin)

The full Anthropic HTML gallery (20 samples + index, Apache 2.0) is bundled at `references/html-effectiveness/`. The most useful samples for this skill:

- `15-research-concept-explainer.html` — long-form structure and headings
- `14-research-feature-explainer.html` — sticky nav + expandable sections (adapt loosely)
- `10-svg-illustrations.html` — hand-drawn-feeling SVG illustration patterns
- `12-incident-report.html` — timeline + lessons format

Read them when a stylistic detail is ambiguous. Treat them as ground truth.

# Process

1. **Read or research the target.**
2. **Decide scope.** Deep walkthrough (full toolbox) / moderate (some) / short (minimal). Match ornament to scope.
3. **Write the content first** — the architecture, decisions, lessons, analogies. The HTML is the wrapper; it shouldn't drive what you say.
4. **Layer in the relevant toolbox patterns** in the order that helps the reader: eyebrow → H1 → lede → byline → endpoint block (if API) → numbered sections with drop cap → figures → insight callouts → blockquotes → takeaways → ornament → footnotes.
5. **Save and open.** Filename `<target-slug>-explained.html` in the current working directory. Run `open <path>`.

Use analogies. Use anecdotes. Don't pad; don't shrink. Let the topic decide.
