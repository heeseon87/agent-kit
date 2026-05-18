# Components Reference

Concrete usage examples for the building blocks defined in `assets/template.html`. Read this when filling in the template — these snippets are copy-paste ready.

## Component selection guide

| When you want to convey | Use |
|---|---|
| Headline insight (1 sentence) | `.lede` (italic serif) |
| API endpoint metadata | `.endpoint` (definition list) |
| Sequential narrative steps | `.flow` (ol with hanging serif numbers) |
| Steps grouped under one parent | `.tx-block` (accent left border, nested ol) |
| Surprising/non-obvious takeaways | `.insight` (left-accent callout) |
| Caution, pitfall, "shadow side" | `.aside` (gray left border) |
| Memorable single line | `<blockquote>` (large italic serif with " glyph) |
| Lessons/principles list | `.takeaway` (roman numeral + serif title) |
| Hierarchical paths/files | `.tree` (two-column grid) |
| Tabular data | `<table class="t-wrap">` (hairline rows) |
| Reference/citation | `<sup>` + `.footnotes` |
| Section break | `.ornament` (· · ·) or `.hr-soft` |

## Masthead

```html
<p class="eyebrow">Endpoint Explainer · ProjectName</p>
<h1>한 번의 POST 뒤에 숨은 합주</h1>
<p class="lede">스윙 한 컷을 영속화하는 일 — 그 안에서 일어나는 세 도메인 동시 쓰기, 클라우드 업로드, 멱등성의 사중주.</p>
<p class="byline"><strong>POST /v2.0/users/{user-id}/analyses</strong> &nbsp;·&nbsp; AnalysisController.kt:48</p>
```

The lede should already give away the most important insight. Don't tease — Anthropic essays open with the punch.

## Endpoint metadata

For HTTP endpoints. Skip entirely for explaining a class, concept, or module.

```html
<dl class="endpoint">
  <dt>Method</dt>
  <dd><span class="method-tag">POST</span><code>/v2.0/users/{user-id}/analyses</code></dd>
  <dt>Auth</dt>
  <dd><code>@adminRule.isAdmin() or @userResourceRule.isOwn(#userId)</code></dd>
  <dt>Request</dt>
  <dd><code>CreateAnalysisReq</code> — analysis meta + analyticsStatus + swing body</dd>
  <dt>Response</dt>
  <dd><code>CreateAnalysisRes(id: UUID)</code> &nbsp;<span style="color:var(--text-faint)">200 OK</span></dd>
</dl>
```

## Section heading with italic number

```html
<h2><span class="num">01</span>분석은 이미 끝나 있다</h2>
```

The italic serif number gives a subtle academic-essay feel. Number all major sections sequentially.

## Drop cap on first paragraph

```html
<p class="body-start">이름만 보면 "분석을 새로 만든다" 같이 보입니다. 그러나 코드를 열어 보면 정작 <strong>"분석"</strong>은 이미 끝나 있습니다...</p>
```

Apply `.body-start` to the very first body paragraph of the document. Don't use it on subsequent paragraphs — it loses its punch.

## Insight callout

Use 2-4 times in a document, at moments of revelation. The label is italic serif, content is a 2-3 item dash list.

```html
<div class="insight">
  <div class="insight-label">Insight</div>
  <ul>
    <li>이 API는 "분석 수행"이 아니라 <strong>"분석 결과 영속화"</strong>다.</li>
    <li>UUID를 클라이언트가 만든다 — 서버가 부여하지 않는다.</li>
    <li>한 번의 요청이 <strong>최소 3개 도메인</strong>을 동시에 건드린다.</li>
  </ul>
</div>
```

Keep items short and surprising. If the reader would have guessed it, leave it out.

## Narrative flow list

The default way to show "X happens, then Y, then Z." Each step gets an italic serif number and a hairline connector to the next.

```html
<ol class="flow">
  <li>
    <div class="step-title">FirebaseTokenFilter → SecurityFilterChain</div>
    <div class="step-desc">Firebase JWT를 검증해 <code>SecurityContext</code>에 principal을 채운다.</div>
  </li>
  <li>
    <div class="step-title">@PreAuthorize 인가 검사</div>
    <div class="step-desc">관리자거나, path의 <code>{user-id}</code>가 본인이어야 통과.</div>
  </li>
</ol>
```

## Nested sub-flow (transaction block)

For when one step in the flow contains several sub-steps. The accent-colored left border + label-on-the-corner is a signature pattern.

```html
<div class="tx-block">
  <ol>
    <li><strong>saveV1</strong> — legacy path<span class="desc">writes to old tables for backward compat</span></li>
    <li><strong>saveV2</strong> — new path<span class="desc">writes to normalized new schema</span></li>
    <li><strong>uploadDraw</strong> — GCS upload<span class="desc">parallel coroutines on virtual thread</span></li>
  </ol>
</div>
```

Override the corner label by setting `content:` inline if "TRANSACTION" isn't appropriate:

```html
<div class="tx-block" style="--label: 'PHASE 2'">
```

(or just edit the CSS pseudo-element if reused often).

## Code excerpt

Use `<pre><code>` with span classes for syntax highlighting:

```html
<pre><code><span class="k">fun</span> <span class="fn">createAnalysis</span>(req: Req): UUID {
    <span class="k">if</span> (analysisRepo.existByUUID(req.id))
        <span class="k">return</span> req.id   <span class="c">// idempotent fast path</span>

    <span class="k">return</span> <span class="fn">tx</span> { ... }
}</code></pre>
```

Available classes:
- `.k` — keyword (orange)
- `.fn` — function name (amber)
- `.s` — string (amber)
- `.c` — comment (gray italic)
- `.n` — normal identifier (default)

Keep excerpts to 10-20 lines. Cut anything not essential to the point you're making.

## Pull quote

Big italic serif sentence. Use 1-3 per document, at moments where a phrase deserves to ring.

```html
<blockquote>DB는 검색해야 할 데이터를 위한 곳, Storage는 통째로 가져올 데이터를 위한 곳.</blockquote>
```

The " glyph is drawn automatically via the `::before` pseudo-element. Don't include literal quote marks in the text.

## Aside / cautionary note

For things that need attention but aren't the main thrust — "watch out for this", "there's a shadow side here":

```html
<div class="aside">
  <div class="aside-label">한 가지 그늘 — 트랜잭션 안의 외부 I/O</div>
  <p style="margin:0">업로드 중 일부가 성공하고 다음에서 예외가 터지면, DB는 롤백되지만 GCS에 이미 올라간 파일은 그대로 남습니다.</p>
</div>
```

## File tree

Use the two-column grid pattern. The left column has the ASCII tree (in monospace, preserving whitespace), the right column has annotations. CSS handles alignment — never try to align with whitespace padding.

```html
<div class="tree" role="img" aria-label="GCS path structure">
  <div class="path">gs://<span class="dir">bucket-name</span>/</div><div class="note"></div>
  <div class="path"><span class="branch">└──</span> <span class="var">{userId}</span>/</div><div class="note">Firebase UID</div>
  <div class="path">    <span class="branch">└──</span> <span class="dir">swing</span>/</div><div class="note"></div>
  <div class="path">        <span class="branch">└──</span> <span class="var">{swingId}</span>/</div><div class="note">UUID</div>
  <div class="path">            <span class="branch">└──</span> <span class="dir">draw</span>/</div><div class="note"></div>
  <div class="path">                <span class="branch">├──</span> meta.json</div><div class="note">메타 정보</div>
  <div class="path">                <span class="branch">└──</span> skeleton.json</div><div class="note">관절 스켈레톤</div>
</div>
```

Span classes for path styling:
- `.dir` — directory name (accent, semi-bold)
- `.var` — variable placeholder like `{userId}` (accent italic)
- `.branch` — tree connectors `└──` `├──` (muted gray)

Empty `<div class="note"></div>` is required for grid alignment even when there's no annotation.

## Tables

Plain hairline tables. No zebra striping, no card background.

```html
<div class="t-wrap">
<table>
  <thead><tr><th>Field</th><th>Role</th><th>Why separate</th></tr></thead>
  <tbody>
    <tr><td><code>analysis</code></td><td>diagnostic metadata</td><td>represents intent at a moment</td></tr>
    <tr><td><code>swing</code></td><td>full swing body</td><td>not 1:1 with analysis</td></tr>
  </tbody>
</table>
</div>
```

Use sparingly — 3-5 columns max. If a table has only 2 columns and 3 rows, consider an `.insight` or `.takeaway` block instead.

## Takeaways

The closing section. Use roman numeral tags and serif titles. 3-5 lessons is the sweet spot.

```html
<h2><span class="num">N</span>이 코드에서 배워 갈 것</h2>

<div class="takeaway">
  <span class="takeaway-tag">i.</span><span class="takeaway-title">트랜잭션 경계는 "비즈니스 한 가지가 끝나는 지점"이지 메서드 끝이 아니다.</span>
  <div class="takeaway-body">이 서비스는 <code>@Transactional</code>을 메서드에 붙이지 않고, 의도된 4단계만 묶이도록 <code>tx { }</code>로 둘러쌌다. 트랜잭션을 "넓게" 잡는 습관은 락 시간을 늘리고 성능을 깎는다.</div>
</div>
```

The title goes on one line (1-2 sentences max). The body explains why it matters.

## Footnotes

For asides that don't fit in the body. Use `<sup>` markers and the `.footnotes` block at the document end.

In body:
```html
ID는 클라이언트가 부여하고<sup><a href="#fn1">1</a></sup>...
```

At document end:
```html
<div class="footnotes">
  <ol>
    <li id="fn1">클라이언트가 UUID를 만드는 패턴은 Stripe의 <code>Idempotency-Key</code> 헤더와 본질적으로 같다.</li>
    <li id="fn2">Martin Fowler, <em>StranglerFigApplication</em> (2004).</li>
  </ol>
  <p style="margin-top:24px; font-size:13px; color:var(--text-faint)">Source · <code>path/to/file.ext:48</code></p>
</div>
```

The Source line at the bottom is mandatory — it lets readers find the actual code.

## Section break / ornament

Three small dots, centered, italic serif. Use sparingly — once or twice per document, at major narrative turns.

```html
<div class="ornament">· · ·</div>
```

Or a quiet horizontal rule for less ceremony:

```html
<hr class="hr-soft">
```

## Common mistakes

- Using `.insight` or `.aside` more than 4-5 times — they lose impact. Most content should be plain prose.
- Adding `.body-start` to paragraphs other than the very first. Drop cap is once per document.
- Forgetting the empty `<div class="note"></div>` cell in `.tree` — breaks the grid alignment.
- Including literal `"` characters in `<blockquote>` — the glyph is drawn by CSS.
- Adding background colors to insight/aside boxes — they should remain on the page background with only the left border for accent.
