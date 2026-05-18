---
name: claude-kit:explain
description: explain me about the target — produces an engaging, narrative explainer rendered as an Anthropic-style HTML artifact opened in the browser
argument-hint: [target]
---

Explain the target — a file, endpoint, module, system, or concept — in plain language. Cover the technical architecture, how parts are connected, the technologies used, the *why* behind decisions, and the lessons one can take away (bugs encountered and how they were fixed, pitfalls and how to avoid them, the way good engineers think, best practices).

It should be **engaging to read**, not boring documentation. Use analogies and anecdotes where they make abstract things stick. The goal: install an accurate mental model in the reader, not dump information.

## Output format

Render the explanation as an **Anthropic-style HTML artifact** — a self-contained `.html` file that mimics Anthropic's long-form essay aesthetic (cream background, coral accent, serif headings, sans-serif body, generous whitespace). The file goes in the project's current working directory and is opened in the browser immediately so the user can read it.

The HTML is the deliverable. Don't dump the whole explanation in chat first — go straight to writing the file.

## Workflow

1. **Investigate the target.** Read the code, trace dependencies, run greps, understand the architecture. If the target is named ambiguously ("the auth flow", "the analyses endpoint"), use Grep/Read to pinpoint the actual files. Don't speculate — verify.

2. **Identify the explanation skeleton.** Ask yourself:
   - What's the *one big idea* a reader should leave with?
   - What's the natural narrative order? (overview → flow → key decisions → lessons works well)
   - Which aspects are *spatial / temporal / relational* and benefit from visualization? (architecture diagrams, sequence flows, parallelism, file trees)
   - Where would an analogy or anecdote make a concept stick?

3. **Render to HTML.** Copy the template at `assets/template.html` to `{slug}-explained.html` in the current working directory. Fill in the content sections — keeping the CSS and JS exactly as-is. Read `references/components.md` for the available components and how to use them. Read `references/svg-patterns.md` if adding diagrams.

4. **Open in browser.** `open {slug}-explained.html` on macOS, or `xdg-open` on Linux. Tell the user the file path.

## Content guidelines

- **Write in the user's language.** If they're conversing in Korean, write the HTML content in Korean.
- **Voice**: engaging, slightly literary, with an essayist's flair. Aim for the tone of an Anthropic research post — clear, generous with context, never condescending.
- **Open with the headline insight.** The lede should already give away the most important point, not tease it.
- **Sections are short.** 2-4 paragraphs per section is plenty. Long blocks of prose lose readers.
- **Show real code excerpts** where they illuminate. Use the `<pre><code>` blocks the template provides. Keep snippets to 10-20 lines.
- **End with takeaways.** What would a staff engineer want a junior to learn from this code? List 3-5 concrete lessons.
- **Footnotes** for tangents (related patterns, prior art, references). Use `<sup><a href="#fn1">1</a></sup>` and the `.footnotes` block at the bottom.

## Visual element policy (this is the key upgrade)

Visual elements **augment narrative, never replace it**. If you remove the diagram, the prose should still teach the concept. Common failure mode: replacing a written flow with a sequence diagram. Don't do that — keep the flow narrative AND add the diagram as a "here's the same thing in time-space" companion.

Add a diagram when:
- The relationship is **spatial** (architecture, ERD, file tree)
- The order is **temporal** (sequence of calls, transaction lifecycle)
- There's **parallelism or branching** that's hard to express in linear text
- A **path or hierarchy** matters (GCS paths, decision tree)

Don't add a diagram for:
- A list of takeaways (those are textual)
- A code excerpt (the code is the diagram)
- Anything you've already explained well in prose

Use at most **one animation** in the whole document — at the most dynamic point (typically parallelism or fan-out/join). One spotlight, not five.

## Technical patterns to follow

These are non-obvious traps from prior iterations. Following them up front saves multiple rewrite cycles:

- **SVG line-draw**: always use `path.getTotalLength()` to set dasharray dynamically. Fixed values like `stroke-dasharray: 200` will clip curves. The template's JS handles this — just use the `.parallel-line` class.
- **SVG markers (`marker-end`)**: cannot be hidden by `stroke-dashoffset`. Either omit them and let lines terminate at box edges, or fade in a separate polygon via opacity after the line completes.
- **Replay buttons**: CSS animation set to `forwards` doesn't re-trigger. Use CSS transition + JS reset (transition='none' → force reflow → re-apply). The template includes this pattern in the IIFE at the bottom.
- **CJK + ASCII alignment**: never align with whitespace padding — CJK characters have different widths than ASCII even in monospace. Use CSS grid `grid-template-columns: max-content 1fr` for file trees or two-column data. The template's `.tree` class does this.
- **`prefers-reduced-motion`**: respect it. The template's JS already short-circuits animations when this media query matches.

## File naming and location

Save the artifact as `<topic-slug>-explained.html` in the current working directory (where the user invoked the command). Use kebab-case for the slug — e.g., `post-analyses-explained.html`, `auth-flow-explained.html`, `payment-domain-explained.html`. After writing, open it with the OS default browser.

## Anti-patterns

- **Don't** dump the explanation in chat before writing the file. Write the file first, then summarize what's in it.
- **Don't** use card-heavy UI with colored backgrounds — Anthropic's actual style is typography-centric with hairlines and a single accent.
- **Don't** add gradients, drop shadows, or rounded corners beyond 4-6px.
- **Don't** replace narrative flow lists with sequence diagrams — keep both.
- **Don't** use more than one animation per document.
- **Don't** anchor to user-provided labels for the slug or title without rephrasing for clarity (e.g., if user says "explain X", consider what X actually is and title accordingly).

## When you're done

Tell the user: "Saved to `<path>` and opened in your browser." That's it. Don't re-explain the content in chat — they can read it.
