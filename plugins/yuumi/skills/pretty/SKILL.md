---
name: yuumi:pretty
description: Create Anthropic-style HTML artifacts with the shared Yuumi visual system, component catalog, SVG patterns, and cognitive-load-focused visual QA
argument-hint: [brief]
---

Design `$1` as a self-contained Anthropic-style HTML artifact.

The output should feel like it belongs in the same family as Anthropic / Claude pages: warm paper, clay accent, quiet editorial hierarchy, sparse line-art diagrams, hairline rules, generous breathing room, and zero generic SaaS sludge.

## The North Star

**The reader should understand the artifact in one pass and trust the page before they know why.**

Visual polish is not decoration here. It is the interface for comprehension. Use the Anthropic visual language to make dense technical material feel calm, deliberate, and readable.

## What you produce

A complete `.html` file in the current working directory unless the user names another path.

Use:

- `skills/pretty/assets/shell.html` — blank HTML shell with tokens, typography, CSS components, and the optional SVG animation controller.
- `skills/pretty/references/components.md` — component catalog. It tells you what each component is for; it is not a section template.
- `skills/pretty/references/svg-patterns.md` — line-art SVG patterns for relationships that prose cannot carry.

Use the shell and references as a shared visual system, not as a score target. There is no numeric style gate; quality comes from browser verification, source fidelity, restrained visual language, and whether the structure lowers reader effort.

## Workflow

1. **Understand the artifact.** Identify the reader, the one idea they must leave with, and the structure that will get them there. Ask only if a missing decision changes the artifact.
2. **Start from the shell.** Copy `skills/pretty/assets/shell.html` to the output path and write content inside `<div class="container">`.
3. **Invent the structure for this artifact.** Do not fill a fixed template. Use any component or layout that improves comprehension. The catalog is a palette, not a checklist.
4. **Keep the visual language fixed.** Warm parchment background, near-black ink, clay accent, serif editorial headings, JetBrains Mono for code, hairline rules, soft ring borders, restrained dark code blocks.
5. **Run the visual QA pass.** Check the saved artifact for browser errors, first-screen comprehension, CJK typography when relevant, source-fact fidelity, restrained palette/type/spacing, and whether every visual element earns its place.
6. **Open the file.** On macOS: `open <artifact.html>`. Report only the path and verification state. Do not dump the artifact's contents in chat.

## Visual language

### Palette

Use the reference swatches in the shell; do not freestyle colors.

- Page background: `#f5f4ed` parchment.
- Raised surface: `#faf9f5` ivory.
- Primary ink: `#141413` warm near-black.
- Secondary text: `#5e5d59`, faint text `#87867f`.
- Rules and borders: `#e8e6dc`, `#f0eee6`, `#d1cfc5`.
- Accent: `#c96442` / `#d97757` clay. Use it sparingly.
- Dark code/surface: `#1f1e1d` / `#30302e`, text `#faf9f5`, dim `#b0aea5`.

### Typography

- Headings should feel editorial: medium-weight serif, tight line-height, no fake bold weight.
- Body should read like a calm essay: generous line-height, paragraph rhythm, no cramped dashboard density.
- Code is always JetBrains Mono or a mono fallback.
- Korean and mixed Korean/English are first-class. The shell uses Hahmlet because it keeps CJK prose visually close to Anthropic's serif posture without breaking Korean rendering.

### Cognitive-load visuals

Visuals are not decoration. Add a diagram only when it saves the reader from doing mental bookkeeping: simulating branches, remembering a timeline, comparing before/after states, mapping input to output, following a data transformation, or stacking verification evidence.

Before adding `<figure>`, name the burden it removes. If the answer is vague — "it looks nicer" or "the page needs visual interest" — skip it. Three strong figures usually beat five. Five is the normal ceiling unless the artifact is explicitly a visual map.

Inline SVG is the default. Use libraries only when the problem genuinely needs them: Mermaid for quick draft flowcharts, Graphviz/DOT or ELK/Dagre for code-fact graphs with many nodes, Observable Plot for real quantitative charts. For final pretty artifacts, prefer self-contained inline SVG styled with the shell tokens.

### Components

These are named conveniences in the shell, not the only legal moves. If comprehension wants a comparison grid, a single-column essay, a dense table, a split-panel walkthrough, or a custom semantic block, use it. Keep the color, spacing, typography, hairlines, and restraint in the Anthropic family.

- Use `.lede` for the headline insight, not a vague subtitle.
- Use `.meta` for small labeled facts.
- Use `.callout` for a real insight that deserves a left clay rail. If everything is a callout, nothing is.
- Use `.aside` for cautions or edge cases.
- Use `.steps` only when order matters.
- Use `<figure>` + SVG for spatial, temporal, or branching relationships. Keep it line-art: thin strokes, no gradients, no shadows.
- Use language-classed `<pre><code>` for short code excerpts. Add the language class; the shell handles rendering and labels. Do not paste huge code blocks as a substitute for explanation.

## Quality bar

The page should feel Anthropic-adjacent without copying Anthropic: warm paper, quiet editorial hierarchy, sparse line-art, hairline rules, clay used sparingly, and no generic SaaS sludge.

The real test is comprehension. A reader should need less working memory after the page exists:

- the headline insight is visible in the first viewport
- named facts are grouped instead of buried in prose
- branches, timelines, contracts, and verification stacks are visualized only when prose would make the reader calculate
- visuals are source-grounded and captioned with the actual insight
- the browser renders cleanly with no console errors

## Anti-patterns

- Do not clone Anthropic copy, product screens, or proprietary layouts. Borrow the design language, not copyrighted content.
- Do not add fake metrics, testimonial cards, decorative icons, or generic feature grids.
- Do not add diagrams just because the page feels empty. Visualize only the parts the reader would otherwise have to calculate or stack mentally.
- Do not use gradients, glass, neon, rainbow accents, or cool blue-gray palettes.
- Do not use a fixed section order just because a previous pretty page did.
- Do not put long explanations in chat. The HTML artifact is the deliverable.

## When you're done

Tell the user: `Saved to <path>. Opened in your browser. Verified: <checks>.`

If visual QA is limited, say exactly what was and was not verified. Do not hand-wave it as done.
