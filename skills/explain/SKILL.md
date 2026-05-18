---
name: claude-kit:explain
description: Explain a target as a self-contained HTML page in Anthropic's theme — same content and length as the original markdown explain, just rendered as a clean Anthropic-themed HTML page instead of a chat dump.
argument-hint: [target]
---

# What to explain

Explain the whole in plain language.

Explain the technical architecture, the structure of the codebase and how the various parts are connected, the technologies used, why we made these technical decisions, and lessons I can learn from it (this should include the bugs we ran into and how we fixed them, potential pitfalls and how to avoid them in the future, new technologies used, how good engineers think and work, best practices, etc).

It should be very engaging to read; don't make it sound like boring technical documentation/textbook. Where appropriate, use analogies and anecdotes to make it more understandable and memorable.

# How to render

The output is a **self-contained HTML file** in Anthropic's theme. Think of it as the same explanation you'd write as a markdown response — same depth, same length, same engaging tone — but rendered as a clean themed page rather than a chat dump. Save as `<target-slug>-explained.html` in the current working directory and run `open <path>`.

**Match the original markdown explain in scope.** Don't pad with extra sections, footnotes, or dramatic flourishes just because the output is HTML now. The HTML wrapper is a presentation layer — the content underneath should be exactly what you'd have written before.

If the user asks for a long-form, scroll-worthy magazine-style piece with drop caps and footnotes, use `/claude-kit:explain-essay` instead. If they want a code-specific walkthrough with sidebar (Key files + Gotchas), use `/claude-kit:explain-code`.

For code/file targets: read the relevant files before writing. For URLs: fetch the content. For abstract topics: synthesize from knowledge.

## Anthropic theme — light variant

Clean, restrained, typography-driven. Anthropic's palette and fonts but without the essay-level ornamentation (no drop cap, no footnotes, no oversized headings).

### Design tokens

```css
:root {
  --ivory:    #FAF9F5;
  --slate:    #141413;
  --clay:     #D97757;
  --oat:      #E3DACC;
  --gray-150: #F0EEE6;
  --gray-300: #D1CFC5;
  --gray-500: #87867F;
  --gray-700: #3D3D3A;
  --serif: 'Hahmlet', ui-serif, Georgia, 'Times New Roman', serif;
  --sans:  'Hahmlet', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono:  Monaco, ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}
```

### Fonts in `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@100..900&display=swap" rel="stylesheet">
```

Hahmlet handles Korean via `unicode-range`; Latin falls through to system fonts. Monaco for mono. **Do not** load Inter, Source Serif 4, Roboto, Noto Sans KR, or Nanum Gothic Coding.

### Typography

- Body: `font-family: var(--serif); font-size: 18px; line-height: 1.7; color: var(--gray-700);`
- H1: serif **36–40px**, weight 500, color slate, letter-spacing -0.01em
- H2: serif **22–24px**, weight 500, color slate
- H3: serif 18–19px, weight 500, color slate
- Optional eyebrow above H1: sans 11–12px uppercase, letter-spacing 0.1em, clay color
- Optional lede: serif 19–20px gray-700, italic if desired
- Container: `max-width: 720–760px`, single column on ivory background, padded ~48–64px top/bottom

### Patterns — keep it light

- **Headings, paragraphs, lists, tables, code** — the standard set, nothing more.
- **Inline `<code>`**: Monaco mono, ~0.9em, clay color on subtle `rgba(217,119,87,0.08)` background, 3–4px radius.
- **Block `<pre><code>`**: dark slate `#141413` background, ivory text, Monaco mono ~13.5px, 6–8px radius, 18–22px padding.
- **Tables**: borderless except top/bottom hairline rules on `<thead>` (`var(--gray-300)`) and row dividers in `var(--gray-150)`.
- **Callouts** (use sparingly, only when something deserves emphasis): left 2px clay border, italic clay label like "Note" or "Key insight", no card background.
- **Links**: clay color, subtle underline.

### What you should NOT include

- **No drop cap** on the opening paragraph.
- **No footnotes** (`<sup>` superscripted markers + bottom `<ol>`) — these are for `/claude-kit:explain-essay`.
- **No section numbers** like `01`, `02` prefixed on H2s — those are essay style.
- **No oversized H1** (no 56–60px). Keep H1 at 36–40px.
- **No big ornament** like `· · ·` separators.
- **No sidebar layout** (that's for `/claude-kit:explain-code`).
- **No white card panels** as the dominant structure. Plain prose carries it.
- **No SVG diagram unless genuinely useful** — and if you include one, keep it inline and small, no fancy bordered "diagram panel".
- **No animations** by default.
- **No Latin web fonts** (Inter, Source Serif 4, Roboto, etc.).

If you find yourself reaching for any of the above, you probably want `/claude-kit:explain-essay` or `/claude-kit:explain-code` instead. Suggest the switch to the user rather than over-engineering this skill's output.

## References (bundled with this plugin)

The full Anthropic HTML gallery (20 samples + index, Apache 2.0) is bundled at `references/html-effectiveness/`. See `ATTRIBUTION.md` for the complete file index.

For this skill's light-blog tone, useful references are:

- `03-code-review-pr.html` — clean, structured, no essay flourishes.
- `17-pr-writeup.html` — structured change description, similar restraint.
- `14-research-feature-explainer.html` — peek for typography choices, but ignore its sticky-nav and tab patterns (too heavy for this skill).

Read these only if a stylistic detail is ambiguous. Generally, the SKILL.md tokens above are enough.

## Process

1. Read or research the target.
2. Write the explanation as you would have written the original markdown response — same depth, same engaging tone, analogies, anecdotes, lessons.
3. Render in HTML with the light theme above. Don't add ornament or pad for length.
4. Save as `<target-slug>-explained.html` in the current working directory. Run `open <path>`.

Use analogies. Use anecdotes. Keep it concise. Don't bloat.
