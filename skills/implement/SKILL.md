---
name: claude-kit:implement
description: Implement a spec while maintaining a running Anthropic-style HTML log of design decisions, deviations, tradeoffs, and open questions
argument-hint: [spec]
---

# Mission

Implement $1 incrementally. As you work, maintain a **running** `./implementation-notes.html` file in the current working directory — a *log*, not a polished essay — that captures:

- **Design decisions** — choices you made where the spec was ambiguous
- **Deviations** — places where you intentionally departed from the spec, and why
- **Tradeoffs** — alternatives you considered and the reason you picked what you did
- **Open questions** — items you want the user to confirm or revise

The file follows Anthropic's design system (same visual language as `claude-kit:explain`) — typography-driven, restrained, single accent. The reader should be able to scan all the decisions in 30 seconds.

# Cadence

This is a **running** file, not a one-shot output. After each substantive change, append a new entry and re-save the file. Do not batch all entries at the end — the user may want to review mid-implementation.

Concretely:
1. **Initialize the file** with empty section skeletons before writing any code.
2. **Append an entry** to the appropriate section as each decision arises.
3. **Re-save** the HTML after every batch of code changes.
4. **Open questions go in first** if you identify them while reading the spec — before you start coding.

# Output structure

```
eyebrow      "Implementation Notes"
H1           "<spec slug> — implementation log"
lede         one-line description of what's being built
byline       Started YYYY-MM-DD · Last updated YYYY-MM-DD HH:MM

§01 Design Decisions
   each entry: status tag + italic serif title + 1–3 short paragraphs

§02 Deviations from Spec
   each entry: same shape

§03 Tradeoffs Considered
   each entry: alternative considered → choice made → why

§04 Open Questions  ← stronger visual emphasis
   each entry: Q1, Q2, … with hanging marker

footnotes (optional, for external references)
```

# Voice

- **Terse and factual.** This is a log, not an essay. One sentence of context + one sentence of rationale is often enough.
- **No drop cap. No pull quotes. No anecdotes.** Those belong to explainers.
- **Past-tense or present-tense decisions** ("Chose JPA over jOOQ because…", "Deviating from the spec by…")
- Each entry stands alone — a reader should be able to read any single block without context.

# Design tokens — verified against anthropic.com

Inline these in `<style>`:

```css
:root {
  --bg:           #F5F4ED;
  --bg-deep:      #EFEDE4;
  --text:         #191917;
  --text-dim:     #4D483F;
  --text-faint:   #8B8377;
  --rule:         #D8D2C2;
  --rule-strong:  #B8B1A1;
  --accent:       #CC785C;       /* Anthropic clay */
  --accent-deep:  #A75A40;
  --accent-soft:  #ECC9B7;
  --code-bg:      #1F1D1A;
  --code-fg:      #EBE7DA;
  --status-decided: #6B8E5A;     /* muted sage for "decided" tag */
  --status-pending: #C9923D;     /* muted ochre for "pending" tag */
  --status-deferred:#8B8377;     /* faint for "deferred" tag */
}
```

# Typography (free Google Fonts substitutes)

- Headings — **Source Serif 4** (Tiempos substitute)
- Body — **Inter** (Styrene B substitute) at **18px / line-height 1.7** (slightly tighter than explain — log feel)
- Mono — **JetBrains Mono**
- H1 48px / weight 500 (smaller than explain's 60px — log is utilitarian)
- H2 26px / weight 500
- lede 19px italic serif
- Container `max-width: 760px`

# Entry layout

Each log entry inside a section:

```html
<div class="entry">
  <div class="entry-meta">
    <span class="status status-decided">decided</span>
    <span class="entry-id">i.</span>
  </div>
  <div class="entry-body">
    <h3 class="entry-title">UUID 충돌 가드를 unique 제약으로</h3>
    <p>스펙은 "중복 요청 처리"라고만 명시. existByUUID 쿼리만으로는 race condition 보장 불가하므로 DB에 UNIQUE(uuid) 제약을 추가했다.</p>
    <p class="entry-rationale">앱 코드는 simple하게 유지하고, 동시성 보장을 스키마에 위임.</p>
  </div>
</div>
```

```css
.entry {
  display: grid;
  grid-template-columns: 100px 1fr;
  column-gap: 32px;
  padding: 22px 0;
  border-top: 1px solid var(--rule);
}
.entry:first-of-type { border-top: none; }
.entry-meta { padding-top: 4px; }
.status {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: 8px;
}
.status-decided  { background: rgba(107, 142, 90, 0.15); color: var(--status-decided); }
.status-pending  { background: rgba(201, 146, 61, 0.15); color: var(--status-pending); }
.status-deferred { background: rgba(139, 131, 119, 0.15); color: var(--status-deferred); }
.entry-id {
  display: block;
  font-family: 'Source Serif 4', serif;
  font-style: italic;
  color: var(--accent-deep);
  font-size: 15px;
}
.entry-title {
  font-family: 'Source Serif 4', serif;
  font-weight: 500;
  font-size: 19px;
  margin: 0 0 8px;
  color: var(--text);
}
.entry-body p { margin: 0 0 6px; font-size: 16px; color: var(--text-dim); line-height: 1.7; }
.entry-rationale { color: var(--text-faint); font-style: italic; }
.entry.deferred { opacity: 0.7; }
```

# Open Questions — special treatment

Section §04 must visually stand out so the user notices it on first scroll. Use a stronger accent left border and "Q" hanging markers:

```html
<section class="open-questions">
  <h2><span class="num">04</span>Open Questions</h2>
  <p class="oq-note">아래 항목은 진행을 위해 사용자 확인이 필요합니다.</p>
  <div class="question">
    <span class="q-id">Q1</span>
    <div>
      <h3>분석 결과 보관 기간</h3>
      <p>스펙에 명시 없음. 90일? 무기한? 사용자별 설정?</p>
    </div>
  </div>
  <div class="question">
    <span class="q-id">Q2</span>
    …
  </div>
</section>
```

```css
.open-questions {
  margin-top: 80px;
  padding: 32px 0 0;
  border-top: 2px solid var(--accent);
}
.oq-note {
  font-family: 'Source Serif 4', serif;
  font-style: italic;
  color: var(--accent-deep);
  font-size: 15px;
  margin-bottom: 24px;
}
.question {
  display: grid;
  grid-template-columns: 60px 1fr;
  column-gap: 24px;
  padding: 18px 0;
  border-top: 1px solid var(--rule);
}
.q-id {
  font-family: 'Source Serif 4', serif;
  font-style: italic;
  font-size: 22px;
  color: var(--accent);
  font-weight: 500;
}
.question h3 {
  font-family: 'Source Serif 4', serif;
  font-weight: 500;
  font-size: 18px;
  margin: 0 0 6px;
  color: var(--text);
}
.question p { font-size: 16px; color: var(--text-dim); margin: 0; line-height: 1.65; }
```

# Layout principles (same as explain skill)

**Do not:**
- Wrap entries in cards — Anthropic articles are flat
- Use gradients
- Use colored background callouts (use 2px left border instead)
- Use animations — this is a log, not a presentation

**Do:**
- Lots of vertical whitespace (60–80px before H2)
- Single accent color (clay) only
- Italic serif labels (`Insight`, `i.`, `ii.`, `Q1`, `Q2`)
- An ornament `· · ·` is OK between major sections but generally not needed in a log

# Diagrams (optional, used sparingly)

Use a diagram only when you make a *structural* decision worth visualizing:
- ERD when introducing new tables
- Module graph when laying out a new architecture layer
- Sequence diagram when designing a new flow

Same SVG style as explain:
- Hairline strokes (1.2–1.5)
- No fills, no shadows
- Single accent, italic serif labels
- Captioned with `Fig N`

**No animations.** A log doesn't need motion.

# CJK + ASCII alignment

Same trap as explain — never use whitespace padding for Korean comments next to English identifiers. Use CSS grid two-column.

# Process

1. **Read the spec.** Identify ambiguities and add them to §04 Open Questions *before* writing any code.
2. **Create `implementation-notes.html`** with empty section skeletons and an initial lede describing what's being built.
3. **Implement incrementally.** As decisions arise:
   - If the spec was ambiguous and you chose → §01 Design Decision
   - If you intentionally departed from the spec → §02 Deviation
   - If you considered alternatives → §03 Tradeoff
   - If you couldn't decide → §04 Open Question (status `pending`)
4. **Save the file after each entry.** Update the "Last updated" timestamp in the byline.
5. **At the end**, scan the file. Confirm every entry has a clear status. Make sure Open Questions are listed first in their section by importance.

# When the spec is ambiguous

The whole point of this skill is to **make ambiguity visible**. Resist the urge to silently pick a sensible default — surface it as an Open Question first, choose a working default, document the choice as a Design Decision, and move on. The user can override in a later pass.

# Don'ts

- ❌ Don't write a polished essay — this is a running log
- ❌ Don't use drop caps or pull quotes (those are for explainers)
- ❌ Don't use animations
- ❌ Don't replace prose with a diagram
- ❌ Don't use cards, gradients, or multi-color schemes
- ❌ Don't bury Open Questions — they get top-of-section placement and visual emphasis
- ❌ Don't write decisions only at the end — append as you go

# When the target is ambiguous

If `$1` is missing or vague (e.g. just "the new feature"), ask the user once for the spec source — a Jira ticket, a markdown spec file, a paragraph of intent — before initializing the notes file.
