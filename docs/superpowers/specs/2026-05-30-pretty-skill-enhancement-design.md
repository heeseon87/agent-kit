# `pretty` 스킬 개선 설계

- **날짜**: 2026-05-30
- **대상 스킬**: `yuumi:pretty` (`skills/pretty/`)
- **상태**: 승인됨 (브레인스토밍 완료, 구현 계획 대기)

## 1. 배경 — 해결하려는 문제

현재 `pretty`는 Anthropic 스타일의 단일 HTML 아티팩트를 만들지만, 실제 자산을 조사한 결과 세 가지 구조적 한계 + 한 가지 CSS 결함이 확인됐다.

1. **시각화 수단이 좁다.** 사실상 인라인 SVG 4종(ERD·시퀀스·fan-out·의사결정 트리) + `<table>` + 코드블록이 전부. 정량 차트, 데이터 기반 시각화, 인터랙티브 다이어그램이 없다.
2. **그 수단마저 프롬프트가 억누른다.** `SKILL.md`에 "figure 3개가 강함 / 5개 천장", "인라인 SVG가 기본, 라이브러리는 정말 필요할 때만" 등 절제가 명시돼 있어, 사용자가 체감한 "과도한 절제"는 의도된 설계다.
3. **인터랙션·탐색 프리미티브가 0개다.** `<details>`, sticky 목차, 탭, 아코디언, 토글, `@media` 반응형을 하나도 쓰지 않는다(grep으로 확인). 결과물은 처음부터 끝까지 펼쳐진 단일 스크롤 문서라, 내용이 길어지면 한 페이지에 그대로 쌓인다.
4. **표 열 너비 버그.** `shell.html` 전역 body 스타일의 `overflow-wrap: anywhere`(72–73행)가 `table { width:100%; table-layout:auto }`(488–489행)에 누수돼, 셀 최소 너비가 거의 0으로 계산된다. 그 결과 20글자 미만 짧은 셀도 2~3줄로 접힌다. 표 자체 CSS는 정상이며, 범인은 전역 선언의 누수다.

근본 통찰: 세 한계는 한 뿌리다. 북극성 "한 번 훑어 이해"가 **정적·선형·단일 패스** 문서를 전제하므로, 점진적 공개나 탐색형 구조가 들어설 자리를 원천 차단한다. 따라서 개선은 컴포넌트 추가가 아니라 **철학 확장**에서 출발한다.

## 2. 확정된 의사결정

| 항목 | 결정 |
|------|------|
| 출력 형태 | **단일 `.html` + 탐색 강화** (멀티 페이지/위키 아님) |
| 기술 정책 | 인라인 SVG 기본 · 정량 데이터 Chart.js · 복잡 그래프 Mermaid(핀 CDN) · 탐색/상태는 소량 인라인 JS |
| 인터랙션 성격 | 점진 공개 골격(목차·접기·탭)을 기본, 능동 위젯(before/after·단계 재생·필터)은 정당한 곳에만 |
| 패키징 | **완전 모놀리식** — 모든 CSS·JS를 shell에 상시 포함, 모델은 마크업만 채움 |
| 무거운 lib | **런타임 지연 로딩** — shell 부트 JS가 페이지 내용(`[data-chart]`/`.mermaid` 존재)을 감지했을 때만 CDN `<script>` 주입 |

핵심 규칙: "기본은 손제작 SVG, 라이브러리는 정당할 때만." 라이브러리도 shell 색 토큰으로 테마를 입혀 line-art 가족으로 묶는다. scan-safe 이슈는 인라인 미니파이 JS 문제였고 핀 CDN 참조는 해결책이므로, CDN 사용은 scan-safe를 깨지 않는다(PrismJS 선례 동일).

## 3. 파일 변경 범위

| 파일 | 작업 |
|------|------|
| `skills/pretty/assets/shell.html` | 확장 — 표 버그 픽스, 탐색 골격 CSS+JS, 위젯 스타일+훅, lib 지연 로더 |
| `skills/pretty/SKILL.md` | 개정 — 북극성 확장, 절제 다이얼 재조정, 워크플로·안티패턴·QA 항목 추가 |
| `skills/pretty/references/components.md` | 갱신 — 새 컴포넌트 항목 + "Picking components" 분기 |
| `skills/pretty/references/interaction-patterns.md` | **신규** — 탐색 골격 & 능동 위젯 카탈로그 |
| `skills/pretty/references/data-viz.md` | **신규** — Chart.js/Mermaid 결정 규칙 + 토큰 테마 |
| `skills/pretty/references/svg-patterns.md` | 유지 (인터랙티브 SVG 노트 소량 추가) |
| `skills/pretty/examples/temp-page.html` | 갱신 — 새 역량을 보여주는 레퍼런스 예시 |

## 4. `shell.html` 확장 상세

### 4a. 표 버그 픽스 (확실한 결함)
- `th, td { overflow-wrap: normal; }`로 전역 `anywhere` 누수를 셀에서 차단.
- 라벨성 짧은 열용 `white-space: nowrap` 옵션 클래스(`.col-tight`) 제공.
- 긴 본문 셀은 정상 줄바꿈 유지.

### 4b. 탐색 골격 (CSS + 소량 인라인 JS, 상시 포함)
- **sticky 목차 + scrollspy**: 좌측(데스크톱)/접이식(모바일) 고정, 현재 섹션 clay 하이라이트. 긴 문서의 "지도".
- **접이식 섹션**: `<details>/<summary>`를 hairline + clay 마커로 스타일링. 첫 화면엔 핵심만, 심화는 접어둠.
- **탭**: 부섹션 전환(언어별/케이스별 비교 등). 소량 JS, JS 없으면 모두 펼쳐지는 graceful degradation.
- **각주 호버 팝오버**: 기존 `.footnotes`를 hover/focus 시 인라인 미리보기.

### 4c. 능동 위젯 (스타일 + JS 훅, 상시 포함)
- **before/after 스왑·슬라이더**: 상태 비교를 독자가 토글.
- **단계별 재생(stepper)**: 시퀀스/변환을 한 단계씩. 기존 fan-out 애니메이션의 일반화.
- **필터 가능한 표**: 행 15+ 일 때만 키워드/카테고리 필터.

### 4d. 데이터 시각화 라이브러리 (지연 로딩)
- Chart.js·Mermaid 핀 CDN. shell 부트 JS가 `[data-chart]` / `.mermaid` 감지 시에만 `<script>` 주입.
- shell 토큰(`--accent`, `--ink`, `--rule`)으로 테마 주입 → 일반 SaaS 차트 느낌 차단.
- 차트 옆엔 항상 원본 데이터 표를 둔다(접근성 · fallback).

### 4e. 접근성·반응형
- `prefers-reduced-motion` 존중(기존 규칙 계승), 모바일 목차 접힘, 키보드 포커스/`aria`.
- **progressive enhancement**: JS·CDN 실패 시에도 모든 *내용*은 읽힘 — 탭은 다 펼쳐지고, 차트 자리엔 데이터 표가 남고, 접이식은 열린 상태가 기본.

## 5. references 확장 상세
- **`interaction-patterns.md`** (신규): 탐색 골격 4종 + 능동 위젯 3종. 각 항목은 `components.md` 형식대로 "무엇을 위한 것 / 어떤 인지 부하를 더는가 / 언제 쓰지 말아야 하는가". 예: "필터 표는 행 15+ 일 때만".
- **`data-viz.md`** (신규): 인라인 SVG vs Chart.js vs Mermaid 결정 규칙 + 토큰 테마 적용법 + "차트 옆 데이터 표" 규칙.
- **`components.md`** (갱신): 새 컴포넌트 포인터, "Picking components" 규칙에 탐색/위젯 분기 반영.

## 6. `SKILL.md` 철학 & 워크플로 개정
- **북극성 확장**: "한 번 훑어 이해" → **"첫 화면에서 요점과 지도를 주고, 그 다음 깊이는 독자가 스스로 제어하며 파악한다."** 정적 단일 패스 전제 제거, "첫 화면에서 요점이 보인다"는 유지.
- **절제 다이얼 재조정**: 고정 상한("figure 5개 천장")을 **기능 게이트**("각 시각·인터랙션 요소는 자신이 더는 인지 부하를 명명할 수 있어야 한다")로 대체. 수단은 늘리되 "earn its place" 규율은 강화.
- **워크플로 추가**: 긴 내용이면 탐색 골격(목차/섹션 분할) 설계를 필수 단계로; 위젯·차트는 정당성 검증 후 추가.
- **새 안티패턴**: 인터랙션을 위한 인터랙션 / 무거운 lib 남용 / 점진 공개로 핵심 정보를 첫 화면에서 가리기 / 차트를 데이터 표 없이 단독 사용.
- **QA 패스 확장**: 인터랙션 실제 동작, 키보드·접근성, 콘솔 에러 0, 지연 로딩 동작, 모바일 목차, JS-off fallback.

## 7. 검증 & 배포
- **동작 검증**: `open` 후 탐색/위젯/차트 작동 + `prefers-reduced-motion` + 콘솔 에러 0 + JS-off fallback.
- **버전 범프 (필수)**: 배포 시 `.claude-plugin/marketplace.json`의 `version`·`plugins[0].version` 및 `.claude-plugin/plugin.json`의 `version` 패치 +1. 셋이 동기화되지 않으면 기존 설치가 재-pull하지 않는다.

## 8. 범위 밖 (YAGNI)
- 멀티 페이지/라우팅/위키형 구조 (단일 파일 결정으로 제외).
- 무조건 상시 lib 로드 (지연 로딩으로 대체).
- brief 규모별 출력 분기 (단일 파일 + 탐색 강화로 통일).
- 빌드/번들 파이프라인 도입 (저장소는 무빌드 유지).
