# 상식 퀴즈 웹 앱 구현 계획서 (IMPL-PLAN)

> **실행자에게:** Superpowers의 executing-plans 스킬로 태스크를 하나씩 실행합니다. 단계(1·2·3단계)가 끝날 때마다 **반드시 멈추고**, 사람이 브라우저에서 확인할 항목을 알린 뒤 기다립니다. 사람이 "다음 단계를 시작하라"고 하기 전에는 다음 단계로 넘어가지 않습니다. 진행 상황은 `- [ ]` 체크박스로 표시합니다.

**목표:** PRD.md의 4지선다 상식 퀴즈 앱을 파일 4개(`index.html`, `style.css`, `script.js`, `questions.js`)로 3단계에 걸쳐 만들고, 단계마다 GitHub Pages로 배포한다.

**구조:** 서버·빌드·라이브러리 없이 일반 `<script>` 두 개로 동작하는 정적 페이지. `questions.js`는 전역 상수 `QUESTIONS`만 두고, `script.js`는 전역 상태 객체 `state` 하나와 작은 함수들로 짠다. 화면은 `index.html`에 `<section class="screen">`으로 미리 두고 `showScreen()`으로 하나만 보인다.

**기술:** HTML, CSS, 순수 JavaScript(ES2017). 순위표는 `localStorage`(3단계).

**명세:** `PRD.md` — 실행자는 이 계획과 PRD.md를 함께 읽습니다.

## 전역 제약

- 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개다. 테스트 파일이나 다른 코드 파일을 만들지 않는다. (`.gitignore`, `PRD.md`, `IMPL-PLAN.md`, `CLAUDE.md`는 문서·설정이라 예외)
- `index.html`을 더블클릭해서 `file://`로 열어도 동작해야 한다. `fetch`, `type="module"`, 외부 라이브러리를 쓰지 않는다.
- 문항, 보기, 해설, 이름은 `textContent`로 넣는다. `innerHTML`은 쓰지 않는다.
- 출처 링크는 `target="_blank"`, `rel="noopener"`로 연다.
- 모든 코드 주석과 화면 문구는 한국어로 쓴다.
- 모든 화면 맨 위 머리글에 `학번 2601952 이름 안나경`을 보인다(과제 요구).
- 폭 360px에서 가로 스크롤이 생기지 않아야 한다.
- **점검 명령:** 테스트 파일 대신 `script.js` 안의 자체 점검 `runSelfTest()`를 쓴다. 주소 끝에 `?test`를 붙여 열면 실행되고, 항목마다 콘솔에 `통과: …` 또는 `실패: …`를 찍은 뒤 마지막 줄에 `자체 점검 결과: 통과 N, 실패 M`을 찍는다. 이 PC에는 Node.js가 없으므로, Claude는 `.claude/launch.json`의 `quiz` 서버(파이썬 `http.server`, 포트 8123)를 띄워 내장 브라우저로 `http://localhost:8123/?test`를 열고 콘솔을 읽는다.
- **커밋 규칙:** 태스크마다 점검 명령이 기대한 결과(실패 0)로 끝난 뒤, 그 태스크에서 바꾼 파일만 `feat: <태스크 이름>` 형식으로 커밋한다. 커밋 작성자 이메일은 깃허브 noreply 주소(이 저장소에만 설정)다.
- **브랜치 규칙:** 구현을 시작하기 전에 `git branch`로 현재 브랜치를 확인하고 어느 브랜치에서 만들지 먼저 알린다. 단계마다 `stage-1`, `stage-2`, `stage-3` 브랜치에서 만들고, 사람이 확인한 뒤 기록이 남는 방식(`git merge --no-ff`)으로 master에 병합한다.
- 계획과 다르게 정해야 할 일이 생기면 정하기 전에 사람에게 먼저 묻는다.

## 파일 구조

| 파일 | 책임 | 만드는 태스크 |
|---|---|---|
| `index.html` | 화면 `<section>`들과 버튼, 학번·이름 머리글, 스크립트 2개 불러오기 | 1, 6, 7, 8, 9, 11, 12 |
| `style.css` | 배치, 정답·오답 색, 타이머·힌트 표시, 360px 대응 | 1, 6, 7, 8, 12 |
| `questions.js` | `const QUESTIONS = [...]` 40문항 | 2 |
| `script.js` | 순수 함수(섞기, 검사, 채점, 순위표 계산) + 화면 함수 + 자체 점검 | 3, 4, 5, 6~12 |
| `.gitignore` | `.claude/` 제외 | 0 |

---

# 1단계: 연습 모드와 점수

**만들 것:** 파일 4개의 뼈대, 문항 40개, 시작·문항·결과 화면, 연습 모드 판 진행과 점수, 자체 점검 12개.
**아직 없는 것:** 모드 선택 화면, 틀린 문제 다시 풀기, 스피드·힌트 모드, 순위표.

**완료 기준 (Claude가 점검):**
1. `?test`로 열면 `자체 점검 결과: 통과 12, 실패 0`.
2. 시작 화면에 카테고리 버튼 4개와 `연습 모드 · 순위표에 기록되지 않음`이 보인다.
3. 카테고리를 고르면 그 카테고리 10문제가 섞인 순서로 나오고 보기 순서도 판마다 바뀐다.
4. 보기를 고르면 정답 여부, 한 줄 해설, 출처가 바로 나오고 맞히면 1점, 틀리면 0점이다.
5. 10문제가 끝나면 결과 화면에 `n / 10`과 `순위표에 기록되지 않음`이 보인다.
6. 문항 40개가 PRD 2.5절 규칙을 지키고, 출처 주소를 실제로 열어 확인했다(문항 검수표 첨부).

## Task 0: 저장소 준비

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: `.gitignore` 작성**

```gitignore
# 이 컴퓨터에서만 쓰는 클로드 설정
.claude/
```

- [ ] **Step 2: 커밋 이메일을 이 저장소에만 설정**

```bash
gh api user --jq '"\(.id)+\(.login)@users.noreply.github.com"'
git config user.name "nakyeong2026"
git config user.email "<위에서 나온 주소>"
```

- [ ] **Step 3: 첫 커밋**

```bash
git add .gitignore PRD.md IMPL-PLAN.md
git commit -m "docs: PRD와 구현 계획서"
```

- [ ] **Step 4: 1단계 브랜치 만들기**

```bash
git branch          # master인지 확인하고 사람에게 알림
git switch -c stage-1
```

## Task 1: 화면 뼈대

**Files:**
- Create: `index.html`, `style.css`, `.claude/launch.json`(커밋하지 않음)

**Interfaces:**
- Produces: 요소 id — `screen-start`, `category-buttons`, `practice-note`, `data-error`, `screen-quiz`, `quiz-label`, `quiz-progress`, `quiz-score`, `quiz-question`, `quiz-choices`, `quiz-feedback`, `feedback-verdict`, `feedback-explanation`, `feedback-source`, `next-button`, `screen-result`, `result-title`, `result-score`, `result-sub`, `result-note`, `result-list`, `again-button`, `home-button`. 화면 `<section>`은 모두 `class="screen"`, id는 `screen-<이름>`.

- [ ] **Step 1: `index.html` 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>상식 퀴즈</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <p class="student">학번 2601952 이름 안나경</p>
    <h1>상식 퀴즈</h1>
  </header>

  <main>
    <!-- 시작 화면 -->
    <section id="screen-start" class="screen">
      <p class="lead">카테고리를 고르세요.</p>
      <div id="category-buttons" class="button-grid"></div>
      <p id="practice-note" class="note">연습 모드 · 순위표에 기록되지 않음</p>
      <p id="data-error" class="error" hidden></p>
    </section>

    <!-- 문항 화면 -->
    <section id="screen-quiz" class="screen" hidden>
      <div class="quiz-top">
        <span id="quiz-label"></span>
        <span id="quiz-progress"></span>
        <span id="quiz-score"></span>
      </div>
      <p id="quiz-question" class="question"></p>
      <div id="quiz-choices" class="choices"></div>
      <div id="quiz-feedback" class="feedback" hidden>
        <p id="feedback-verdict" class="verdict"></p>
        <p id="feedback-explanation"></p>
        <p class="source">출처: <a id="feedback-source" target="_blank" rel="noopener"></a></p>
      </div>
      <button id="next-button" class="primary wide" hidden>다음</button>
    </section>

    <!-- 결과 화면 -->
    <section id="screen-result" class="screen" hidden>
      <h2 id="result-title"></h2>
      <p id="result-score" class="big-score"></p>
      <p id="result-sub" class="note" hidden></p>
      <p id="result-note" class="note">순위표에 기록되지 않음</p>
      <ol id="result-list" class="result-list"></ol>
      <div class="button-row">
        <button id="again-button" class="primary">같은 카테고리 다시</button>
        <button id="home-button">처음으로</button>
      </div>
    </section>
  </main>

  <script src="questions.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: `style.css` 작성**

```css
/* 색과 기본값 */
:root {
  --bg: #f6f7fb;
  --card: #ffffff;
  --text: #1f2430;
  --muted: #5b6475;
  --accent: #3157d5;
  --correct: #1e7e34;
  --correct-bg: #e6f4ea;
  --wrong: #c5221f;
  --wrong-bg: #fce8e6;
  --border: #d5d9e2;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

[hidden] { display: none !important; }

/* 머리글: 학번과 이름 */
.site-header {
  background: var(--accent);
  color: #fff;
  padding: 12px 16px;
  text-align: center;
}
.site-header .student { margin: 0 0 4px; font-weight: bold; }
.site-header h1 { margin: 0; font-size: 1.4rem; }

main { max-width: 640px; margin: 0 auto; padding: 16px; }

.screen {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 16px;
}

/* 버튼 */
button {
  font: inherit;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  color: var(--text);
  cursor: pointer;
}
button:disabled { cursor: default; }
button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
button.wide { width: 100%; margin-top: 14px; }

.button-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.button-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }

.lead { margin-top: 0; font-weight: bold; }
.note { color: var(--muted); font-size: 0.95rem; }
.error { color: var(--wrong); white-space: pre-line; }

/* 문항 화면 */
.quiz-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
  font-size: 0.95rem;
}
.question { font-size: 1.15rem; font-weight: bold; overflow-wrap: anywhere; }
.choices { display: grid; gap: 8px; }
.choice { text-align: left; overflow-wrap: anywhere; }
.choice:disabled { color: var(--text); }
.choice.correct { background: var(--correct-bg); border-color: var(--correct); color: var(--correct); font-weight: bold; }
.choice.wrong { background: var(--wrong-bg); border-color: var(--wrong); color: var(--wrong); font-weight: bold; }

.feedback {
  margin-top: 14px;
  padding: 12px;
  border-radius: 8px;
  background: var(--bg);
  overflow-wrap: anywhere;
}
.feedback p { margin: 4px 0; }
.verdict { font-weight: bold; }

/* 결과 화면 */
.big-score { font-size: 2rem; font-weight: bold; margin: 8px 0; }
.result-list { padding-left: 1.4em; }
.result-list li { margin: 6px 0; overflow-wrap: anywhere; }
.result-list .ok { color: var(--correct); font-weight: bold; }
.result-list .ng { color: var(--wrong); font-weight: bold; }
```

- [ ] **Step 3: 화면 확인용 서버 설정 `.claude/launch.json`** (`.gitignore`에 있으므로 커밋하지 않음)

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "quiz",
      "runtimeExecutable": "C:\\Users\\안나경\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
      "runtimeArgs": ["-m", "http.server", "8123"],
      "port": 8123
    }
  ]
}
```

- [ ] **Step 4: 확인** — `http://localhost:8123/`을 열어 머리글에 `학번 2601952 이름 안나경`과 `상식 퀴즈`가 보이는지 확인한다. (`questions.js`, `script.js`가 아직 없어 콘솔에 404가 나오는 것은 정상)

- [ ] **Step 5: 커밋**

```bash
git add index.html style.css
git commit -m "feat: 화면 뼈대"
```

## Task 2: 문항 40개

**Files:**
- Create: `questions.js`

**Interfaces:**
- Produces: 전역 `const QUESTIONS` — PRD 4.2 형식의 객체 40개. `id`는 `hist-01`~`hist-10`, `geo-01`~`geo-10`, `sci-01`~`sci-10`, `art-01`~`art-10`.

- [ ] **Step 1: 주제 정하기** — 아래 주제로 카테고리마다 10문항을 쓴다. 최상급("가장 ~한")과 시간이 지나면 바뀌는 수치는 피한다. 써야 하면 기준과 시점을 문제에 밝힌다.

| 카테고리 | 주제 (01~10) |
|---|---|
| 한국사 | 조선 건국, 훈민정음 창제, 고려 건국, 명량 해전, 3·1 운동, 동학 농민 운동 지도자, 고구려 건국, 발해 건국, 수원 화성 축조와 정약용, 신라의 삼국 통일 |
| 세계지리 | 오스트레일리아 수도, 나일강이 흘러드는 바다, 에베레스트산이 속한 산맥, 사하라 사막이 있는 대륙, 수에즈 운하가 잇는 바다, 캐나다 수도, 안데스산맥이 있는 대륙, 본초 자오선이 지나는 천문대, 파나마 운하가 잇는 두 대양, 킬리만자로산이 있는 나라 |
| 과학 | 물의 화학식, 광합성이 일어나는 세포 소기관, 붉은 행성, 원소 기호 Fe, DNA 이중 나선 구조 발표, 만유인력 법칙, 페니실린 발견, ABO식 혈액형 발견, 진동수의 단위, 주기율표 발표 |
| 예술과 문화 | 모나리자, 별이 빛나는 밤, 운명 교향곡, 김홍도의 씨름, 햄릿, 사계, 석굴암이 있는 도시, 게르니카, 마술피리, 신윤복의 미인도 |

- [ ] **Step 2: 문항마다 출처를 실제로 열어 확인** — 출처는 기관 사이트(예: 한국민족문화대백과사전 `encykorea.aks.ac.kr`, 국사편찬위원회 우리역사넷 `contents.history.go.kr`, 국립중앙박물관, 문화유산청, 브리태니커 `britannica.com`, NASA 등)로 하고 위키백과·나무위키·블로그는 쓰지 않는다. 주소를 열어 정답과 해설 내용이 그 페이지에 있는지 확인한다. 열리지 않는 출처는 열리는 출처로 바꾸고, 그래도 확인할 수 없는 주제는 확인할 수 있는 주제로 바꾼다(바꾼 것은 완료 보고에 적는다).

- [ ] **Step 3: `questions.js` 작성** — 형식(한 문항 예):

```js
// 상식 퀴즈 문항 40개 (카테고리마다 10개)
// 형식은 PRD.md 4.2를 따른다. 정답은 choices[answer]다.
const QUESTIONS = [
  {
    id: "hist-01",
    category: "한국사",
    question: "1392년에 고려를 무너뜨리고 조선을 세운 인물은?",
    choices: ["이성계", "왕건", "이방원", "정도전"],
    answer: 0,
    explanation: "이성계는 위화도 회군으로 권력을 잡은 뒤 1392년 조선을 세웠다.",
    source: { name: "한국민족문화대백과사전", url: "https://encykorea.aks.ac.kr/..." }
  },
  // … 나머지 39개
];
```

규칙: 보기 4개는 서로 다르고 정답과 같은 유형으로 쓴다. 해설은 60자 안팎의 한 줄, 줄바꿈 없음. `answer`는 0~3이 고루 섞이게 한다.

- [ ] **Step 4: 문항 검수표 작성** — 완료 보고에 붙일 표: `id | 정답 | 출처 페이지에서 확인한 내용`. 40행.

- [ ] **Step 5: 커밋**

```bash
git add questions.js
git commit -m "feat: 문항 40개"
```

## Task 3: 섞기·검사·채점 함수와 자체 점검

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `QUESTIONS` (Task 2)
- Produces:
  - `CATEGORIES: string[]`, `ROUND_SIZE = 10`, `MODE_NAMES: {practice, speed, hint}`
  - `shuffle(array) -> 새 배열`
  - `checkQuestions(questions) -> string[]` (빈 배열이면 통과)
  - `scoreFor(correct: boolean, usedHint: boolean) -> 0 | 0.5 | 1`
  - `makeItems(questionList) -> Item[]`, `buildRound(questions, category) -> Item[]` — `Item = { q, choices: string[](섞인 보기), answerText: string }`
  - `formatScore(n) -> string` (정수면 `"7"`, 아니면 `"7.5"`)
  - `SELF_TESTS: Array<[이름, () => boolean]>`, `runSelfTest() -> {pass, fail}`

- [ ] **Step 1: 자체 점검 먼저 작성** — `script.js`의 맨 아래에 둔다.

```js
// ===== 자체 점검 (주소 끝에 ?test를 붙이면 실행) =====
const SELF_TESTS = [
  ["문항이 40개다", () => QUESTIONS.length === 40],
  ["카테고리마다 10문항이다", () =>
    CATEGORIES.every((c) => QUESTIONS.filter((q) => q.category === c).length === ROUND_SIZE)],
  ["checkQuestions가 실제 문항을 통과시킨다", () => checkQuestions(QUESTIONS).length === 0],
  ["checkQuestions가 보기 중복을 잡는다", () => {
    const bad = QUESTIONS.map((q) => ({ ...q, choices: q.choices.slice() }));
    bad[0].choices[1] = bad[0].choices[0];
    return checkQuestions(bad).some((p) => p.includes("보기"));
  }],
  ["checkQuestions가 문항 수 부족을 잡는다", () => checkQuestions(QUESTIONS.slice(1)).length > 0],
  ["id가 hist/geo/sci/art-두 자리 형식이다", () =>
    QUESTIONS.every((q) => /^(hist|geo|sci|art)-\d{2}$/.test(q.id))],
  ["shuffle이 원소를 보존하고 원본을 바꾸지 않는다", () => {
    const src = [1, 2, 3, 4, 5];
    const out = shuffle(src);
    return out !== src && src.join() === "1,2,3,4,5" && out.slice().sort().join() === "1,2,3,4,5";
  }],
  ["buildRound가 그 카테고리 10문항을 만든다", () => {
    const round = buildRound(QUESTIONS, "과학");
    return round.length === 10 && round.every((it) => it.q.category === "과학");
  }],
  ["섞은 보기 4개 안에 정답 글자가 있다", () =>
    CATEGORIES.every((c) => buildRound(QUESTIONS, c).every((it) =>
      it.choices.length === 4 && it.choices.includes(it.answerText) && it.answerText === it.q.choices[it.q.answer]))],
  ["맞히면 1점, 틀리면 0점이다", () => scoreFor(true, false) === 1 && scoreFor(false, false) === 0],
  ["출처 주소가 https로 시작한다", () => QUESTIONS.every((q) => /^https:\/\//.test(q.source.url))],
  ["해설이 줄바꿈 없는 90자 이하 한 줄이다", () =>
    QUESTIONS.every((q) => !q.explanation.includes("\n") && q.explanation.length <= 90)],
];

function runSelfTest() {
  let pass = 0;
  let fail = 0;
  SELF_TESTS.forEach(([name, fn]) => {
    let ok = false;
    try { ok = fn() === true; } catch (e) { ok = false; }
    if (ok) { pass += 1; console.log(`통과: ${name}`); }
    else { fail += 1; console.error(`실패: ${name}`); }
  });
  const summary = `자체 점검 결과: 통과 ${pass}, 실패 ${fail}`;
  if (fail) console.error(summary); else console.log(summary);
  return { pass, fail };
}

if (/[?&]test\b/.test(location.search)) runSelfTest();
```

- [ ] **Step 2: 점검이 실패하는지 확인** — `http://localhost:8123/?test`. 기대: 함수가 없어 대부분 `실패`, 마지막 줄 `통과 a, 실패 b`(b > 0).

- [ ] **Step 3: 함수 구현** — `script.js` 맨 위에 둔다.

```js
// 상식 퀴즈 게임 로직
"use strict";

const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const ROUND_SIZE = 10;
const MODE_NAMES = { practice: "연습", speed: "스피드", hint: "힌트" };

// 섞은 새 배열을 돌려준다 (Fisher–Yates). 원본은 바꾸지 않는다
function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 문항 데이터를 검사해 문제 목록을 돌려준다. 빈 배열이면 통과
function checkQuestions(questions) {
  if (!Array.isArray(questions)) return ["문항 데이터(QUESTIONS)를 읽지 못함"];
  const problems = [];
  const total = CATEGORIES.length * ROUND_SIZE;
  if (questions.length !== total) problems.push(`문항이 ${questions.length}개임 (${total}개여야 함)`);
  CATEGORIES.forEach((cat) => {
    const n = questions.filter((q) => q.category === cat).length;
    if (n !== ROUND_SIZE) problems.push(`${cat} 문항이 ${n}개임 (${ROUND_SIZE}개여야 함)`);
  });
  const seen = new Set();
  questions.forEach((q, i) => {
    const id = q && q.id ? q.id : `${i + 1}번째 문항`;
    if (seen.has(id)) problems.push(`${id}: id가 겹침`);
    seen.add(id);
    if (!CATEGORIES.includes(q.category)) problems.push(`${id}: 카테고리가 올바르지 않음`);
    if (typeof q.question !== "string" || !q.question.trim()) problems.push(`${id}: 문제가 비어 있음`);
    if (!Array.isArray(q.choices) || q.choices.length !== 4) problems.push(`${id}: 보기가 4개가 아님`);
    else if (new Set(q.choices).size !== 4) problems.push(`${id}: 보기 4개가 서로 다르지 않음`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) problems.push(`${id}: answer가 0~3이 아님`);
    if (typeof q.explanation !== "string" || !q.explanation.trim()) problems.push(`${id}: 해설이 비어 있음`);
    if (!q.source || !q.source.name || !q.source.url) problems.push(`${id}: 출처가 비어 있음`);
  });
  return problems;
}

// 맞힘 여부와 힌트 사용 여부로 점수를 정한다
function scoreFor(correct, usedHint) {
  if (!correct) return 0;
  return usedHint ? 0.5 : 1;
}

// 문항 목록을 섞고, 문항마다 보기도 섞어 이번 판 목록을 만든다
function makeItems(questionList) {
  return shuffle(questionList).map((q) => ({
    q,
    choices: shuffle(q.choices),
    answerText: q.choices[q.answer],
  }));
}

function buildRound(questions, category) {
  return makeItems(questions.filter((q) => q.category === category));
}

// 0.5점 단위 점수를 보여 줄 글자로 바꾼다
function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
```

- [ ] **Step 4: 점검 통과 확인** — `?test`. 기대: `자체 점검 결과: 통과 12, 실패 0`.

- [ ] **Step 5: 커밋**

```bash
git add script.js
git commit -m "feat: 섞기·검사·채점 함수와 자체 점검"
```

## Task 4: 연습 모드 판 진행

**Files:**
- Modify: `script.js` (Task 3 함수들 아래, 자체 점검 위)

**Interfaces:**
- Consumes: Task 1의 요소 id, Task 3의 함수
- Produces: `state` 객체, `$(id)`, `showScreen(name)`, `startRound(mode, category)`, `renderQuestion()`, `choose(index | null)`, `next()`, `initStartScreen()`. `state.results`의 한 건: `{ item, correct, chosenText, points, usedHint, timeout }`.

- [ ] **Step 1: 상태와 화면 함수 작성**

```js
// ===== 화면 =====
const state = {
  mode: "practice",   // "practice" | "speed" | "hint"
  category: null,
  round: [],          // makeItems()로 만든 이번 판 목록
  index: 0,
  score: 0,
  answered: false,
  usedHint: false,
  results: [],
};

const $ = (id) => document.getElementById(id);

// 화면 하나만 보이게 한다
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = el.id !== `screen-${name}`;
  });
  window.scrollTo(0, 0);
}

function startRound(mode, category) {
  state.mode = mode;
  state.category = category;
  state.round = buildRound(QUESTIONS, category);
  state.index = 0;
  state.score = 0;
  state.results = [];
  showScreen("quiz");
  renderQuestion();
}

function renderTopBar() {
  $("quiz-label").textContent = `${state.category} · ${MODE_NAMES[state.mode]}`;
  $("quiz-progress").textContent = `${state.index + 1} / ${state.round.length}`;
  $("quiz-score").textContent = `점수 ${formatScore(state.score)}`;
}

function renderQuestion() {
  const item = state.round[state.index];
  state.answered = false;
  state.usedHint = false;
  renderTopBar();
  $("quiz-question").textContent = item.q.question;
  const box = $("quiz-choices");
  box.replaceChildren();
  item.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(i));
    box.appendChild(btn);
  });
  $("quiz-feedback").hidden = true;
  $("next-button").hidden = true;
}

// 보기를 고른다. index가 null이면 시간 초과(2단계)
function choose(index) {
  if (state.answered) return;
  state.answered = true;
  const item = state.round[state.index];
  const timeout = index === null;
  const chosenText = timeout ? null : item.choices[index];
  const correct = chosenText === item.answerText;
  const points = scoreFor(correct, state.usedHint);
  state.score += points;
  state.results.push({ item, correct, chosenText, points, usedHint: state.usedHint, timeout });

  // 보기를 모두 잠그고 정답·오답을 표시한다. 색만으로 구분하지 않게 ✓, ✗를 붙인다
  $("quiz-choices").querySelectorAll(".choice").forEach((btn, i) => {
    btn.disabled = true;
    if (item.choices[i] === item.answerText) {
      btn.classList.add("correct");
      btn.textContent = `✓ ${item.choices[i]}`;
    } else if (i === index) {
      btn.classList.add("wrong");
      btn.textContent = `✗ ${item.choices[i]}`;
    }
  });

  let verdict;
  if (correct) verdict = state.usedHint ? "정답! (힌트 사용, 0.5점)" : "정답!";
  else if (timeout) verdict = `시간 초과 (정답: ${item.answerText})`;
  else verdict = `오답 (정답: ${item.answerText})`;
  $("feedback-verdict").textContent = verdict;
  $("feedback-explanation").textContent = item.q.explanation;
  const link = $("feedback-source");
  link.textContent = item.q.source.name;
  link.href = item.q.source.url;
  $("quiz-feedback").hidden = false;

  renderTopBar();
  const last = state.index === state.round.length - 1;
  $("next-button").textContent = last ? "결과 보기" : "다음";
  $("next-button").hidden = false;
}

function next() {
  if (state.index < state.round.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    finishRound();
  }
}

// 시작 화면: 문항 데이터를 검사하고 카테고리 버튼을 만든다
function initStartScreen() {
  const problems = checkQuestions(typeof QUESTIONS === "undefined" ? null : QUESTIONS);
  const box = $("category-buttons");
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.disabled = problems.length > 0;
    btn.addEventListener("click", () => startRound("practice", cat));
    box.appendChild(btn);
  });
  if (problems.length) {
    $("data-error").textContent = "문항 데이터에 오류가 있어 시작할 수 없음\n" + problems.join("\n");
    $("data-error").hidden = false;
  }
}
```

- [ ] **Step 2: 시작 코드** (자체 점검 위)

```js
// ===== 시작 =====
$("next-button").addEventListener("click", next);
initStartScreen();
```

- [ ] **Step 3: 확인** — `?test`가 `통과 12, 실패 0`. 내장 브라우저에서 한국사를 눌러 상단 `한국사 · 연습`, `1 / 10`, `점수 0`, 보기를 골라 해설·출처·`다음`이 나오는지 본다. (결과 화면은 Task 5. 10번째에서 `결과 보기`를 누르면 `finishRound` 없음 오류가 나는 것은 이 시점에서 정상)

- [ ] **Step 4: 커밋**

```bash
git add script.js
git commit -m "feat: 연습 모드 판 진행"
```

## Task 5: 결과 화면

**Files:**
- Modify: `script.js`

**Interfaces:**
- Produces: `finishRound()`, `renderResultList()`

- [ ] **Step 1: 결과 함수 작성** (`next()` 아래)

```js
// 결과 화면의 문항별 목록
function renderResultList() {
  const list = $("result-list");
  list.replaceChildren();
  state.results.forEach((r) => {
    const li = document.createElement("li");
    const mark = document.createElement("span");
    mark.className = r.correct ? "ok" : "ng";
    if (r.correct) mark.textContent = r.usedHint ? "정답 (힌트 0.5점)" : "정답";
    else mark.textContent = r.timeout ? "시간 초과" : "오답";
    li.append(mark, ` ${r.item.q.question} → ${r.item.answerText}`);
    list.appendChild(li);
  });
}

function finishRound() {
  $("result-title").textContent = `${state.category} · ${MODE_NAMES[state.mode]} 결과`;
  $("result-score").textContent = `${formatScore(state.score)} / ${state.round.length}`;
  $("result-sub").hidden = true;
  $("result-note").hidden = state.mode !== "practice";
  renderResultList();
  showScreen("result");
}
```

- [ ] **Step 2: 버튼 연결** (시작 코드에 추가)

```js
$("again-button").addEventListener("click", () => startRound(state.mode, state.category));
$("home-button").addEventListener("click", () => showScreen("start"));
```

- [ ] **Step 3: 확인** — `?test`가 `통과 12, 실패 0`. 한 판을 끝까지 풀어 결과 `n / 10`이 맞힌 수와 같은지, `순위표에 기록되지 않음`, 문항별 목록, `같은 카테고리 다시`(순서가 바뀜), `처음으로`를 확인한다. 폭 360px에서 가로 스크롤이 없는지 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add script.js
git commit -m "feat: 결과 화면"
```

## 1단계 끝: 멈춤

- [ ] 완료 기준 1~6을 점검하고, 문항 검수표와 함께 완료 보고를 한다.
- [ ] 아래 **1단계 브라우저 확인 항목**을 사람에게 알리고 **멈춘다.** 2단계는 사람이 시작하라고 할 때 시작한다.

### 1단계 브라우저 확인 항목 (사람이 `index.html`을 더블클릭해서 확인)

1. 머리글에 `학번 2601952 이름 안나경`이 보인다.
2. 시작 화면에 카테고리 버튼 4개와 `연습 모드 · 순위표에 기록되지 않음`이 보인다.
3. 한국사를 누르면 상단에 `한국사 · 연습`, `1 / 10`, `점수 0`이 보인다.
4. 정답을 고르면 그 보기가 초록색이 되고 앞에 ✓가 붙으며, 해설 한 줄과 출처 링크가 나온다.
5. 오답을 고르면 고른 보기는 빨간색(✗), 정답 보기는 초록색(✓)으로 표시된다.
6. 답을 고른 뒤에는 다른 보기를 눌러도 변화가 없다.
7. 출처 링크를 누르면 새 탭에서 출처가 열린다.
8. 10번째 문항에서 `다음` 버튼이 `결과 보기`로 바뀐다.
9. 결과 화면의 `n / 10`이 맞힌 개수와 같고, 문항별 정답·오답 목록과 `순위표에 기록되지 않음`이 보인다.
10. `같은 카테고리 다시`를 누르면 문항 순서와 보기 순서가 앞 판과 달라진다.
11. `처음으로`를 누르면 시작 화면으로 돌아간다.
12. F12 개발자 도구에서 폭 360px로 줄여도 가로 스크롤이 생기지 않는다.
13. 주소 끝에 `?test`를 붙여 열면 콘솔에 `자체 점검 결과: 통과 12, 실패 0`이 나온다.
14. 문항 내용(정답·해설·출처)은 따로 확인한다(5.4절).

### 1단계 배포 (사람이 확인한 뒤 요청하면)

```bash
git switch master
git merge --no-ff stage-1 -m "merge: 1단계 연습 모드와 점수"
gh repo create Study03_Quiz --public --source . --remote origin --push
gh api -X POST repos/nakyeong2026/Study03_Quiz/pages -f "source[branch]=master" -f "source[path]=/"
```

배포 주소: `https://nakyeong2026.github.io/Study03_Quiz/` — 빌드가 끝나면 열어서 시작 화면과 `?test`를 확인한다.

---

# 2단계: 스피드 모드, 힌트 모드, 모드 선택 화면, 틀린 문제 다시 풀기

**만들 것:** 카테고리를 고른 뒤 나오는 모드 선택 화면, 스피드 모드(15초 타이머), 힌트 모드(오답 2개 지우기, 0.5점), 연습 모드의 틀린 문제 다시 풀기, 자체 점검 3개 추가(모두 15개).

**PRD와 다르게 정하는 것 (사람 확인 필요):** PRD 3.1은 시작 화면 안에서 모드를 고르게 적었으나, 이 계획은 **카테고리를 고른 뒤 별도의 모드 선택 화면**(`screen-mode`)을 보여 준다. 과제 확인 기준("카테고리를 고른 뒤 모드 선택 화면에 연습, 스피드, 힌트 3개가 나옴")에 맞추기 위함이다. Task 6에서 PRD 3.1도 같이 고친다.

**완료 기준 (Claude가 점검):**
1. `?test`로 열면 `자체 점검 결과: 통과 15, 실패 0`.
2. 시작 화면에 `연습 모드 · 순위표에 기록되지 않음` 문구가 없고, 카테고리를 고르면 모드 선택 화면에 연습·스피드·힌트 3개와 규칙이 보이며, 연습에만 `순위표에 기록되지 않음`이 있다.
3. 스피드: 15초부터 1초씩 줄고 5초 이하에서 빨간색, 0초에 `시간 초과`와 오답 처리. 답을 고르면 멈추고 `다음`에서 15초부터 다시 센다. 타이머는 언제나 하나만 돈다.
4. 힌트: 문항마다 한 번, 오답 2개가 지워지고(정답은 지워지지 않음) 버튼이 잠긴다. 힌트를 쓰고 맞히면 0.5점, 쓰지 않고 맞히면 1점.
5. 연습 결과에서 틀린 문항만 다시 풀 수 있고, 또 틀리면 다시 풀 수 있으며, 처음 점수는 바뀌지 않는다.
6. 1단계 완료 기준이 그대로 지켜진다.

## 2단계 시작 전

```bash
git branch            # 현재 브랜치를 사람에게 알림
git switch -c stage-2
```

## Task 6: 모드 선택 화면

**Files:**
- Modify: `index.html`, `style.css`, `script.js`, `PRD.md`(3.1)

**Interfaces:**
- Produces: `showModeScreen(category)`, 요소 id `screen-mode`, `mode-title`, `mode-back`, 버튼 `.mode-button[data-mode]`

- [ ] **Step 1: `index.html`** — 시작 화면에서 `<p id="practice-note" …>` 줄을 지우고, 시작 화면 `</section>` 아래에 모드 선택 화면을 넣는다.

```html
    <!-- 모드 선택 화면 -->
    <section id="screen-mode" class="screen" hidden>
      <h2 id="mode-title"></h2>
      <div class="mode-buttons">
        <button class="mode-button" data-mode="practice">
          <strong>연습</strong>
          <span class="mode-rule">시간 제한·힌트 없음, 맞히면 1점 · 순위표에 기록되지 않음</span>
        </button>
        <button class="mode-button" data-mode="speed">
          <strong>스피드</strong>
          <span class="mode-rule">문항마다 15초, 시간이 지나면 오답 · 맞히면 1점</span>
        </button>
        <button class="mode-button" data-mode="hint">
          <strong>힌트</strong>
          <span class="mode-rule">문항마다 힌트 1번(오답 2개 지움) · 힌트 쓰고 맞히면 0.5점</span>
        </button>
      </div>
      <div class="button-row">
        <button id="mode-back">뒤로</button>
      </div>
    </section>
```

- [ ] **Step 2: `style.css`** (끝에 추가)

```css
/* 모드 선택 화면 */
.mode-buttons { display: grid; gap: 10px; }
.mode-button { text-align: left; display: grid; gap: 2px; }
.mode-rule { color: var(--muted); font-size: 0.9rem; }
```

- [ ] **Step 3: `script.js`** — `initStartScreen()`의 카테고리 버튼이 `startRound("practice", cat)` 대신 `showModeScreen(cat)`을 부르게 바꾸고, 함수를 추가한다.

```js
// 카테고리를 고른 뒤 모드 선택 화면을 보여 준다
function showModeScreen(category) {
  state.category = category;
  $("mode-title").textContent = `${category} · 모드를 고르세요`;
  showScreen("mode");
}
```

시작 코드에 추가:

```js
document.querySelectorAll(".mode-button").forEach((btn) => {
  btn.addEventListener("click", () => startRound(btn.dataset.mode, state.category));
});
$("mode-back").addEventListener("click", () => showScreen("start"));
```

- [ ] **Step 4: `PRD.md` 3.1 수정** — "모드 선택(2단계부터)" 줄을 다음으로 바꾼다: `- 모드 선택(2단계부터): 카테고리를 고르면 모드 선택 화면이 나오고 연습, 스피드, 힌트 중 하나를 고른다. 모드마다 규칙을 한 줄로 보이고, 연습에는 "순위표에 기록되지 않음"을 붙인다. [뒤로]는 시작 화면으로 간다.` 그리고 1단계 문구 줄은 `- 1단계에는 모드 선택이 없고 연습 모드로 고정한다. 시작 화면에 "순위표에 기록되지 않음"이 보인다.`로 둔다. 3절 첫 줄의 "화면 4개"는 "화면 5개(시작, 모드 선택, 문항, 결과, 순위표)"로 고친다.

- [ ] **Step 5: 확인** — `?test`가 `통과 12, 실패 0`. 시작 화면에 연습 문구가 없고, 과학을 누르면 `과학 · 모드를 고르세요`와 버튼 3개, `뒤로`가 시작 화면으로 간다. 연습을 누르면 1단계와 같이 진행된다.

- [ ] **Step 6: 커밋**

```bash
git add index.html style.css script.js PRD.md
git commit -m "feat: 모드 선택 화면"
```

## Task 7: 스피드 모드

**Files:**
- Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Produces: `SPEED_SECONDS = 15`, `state.timerId`, `state.timeLeft`, `startTimer()`, `stopTimer()`, `renderTimer()`, 요소 id `quiz-timer`

- [ ] **Step 1: 자체 점검 추가** — `SELF_TESTS` 끝에 넣는다.

```js
  ["스피드 모드 제한 시간이 15초다", () => SPEED_SECONDS === 15],
```

- [ ] **Step 2: 실패 확인** — `?test` 기대: `통과 12, 실패 1`.

- [ ] **Step 3: `index.html`** — `.quiz-top` 안 `quiz-score` 아래에 추가:

```html
        <span id="quiz-timer" class="timer" hidden></span>
```

- [ ] **Step 4: `style.css`** (끝에 추가)

```css
/* 스피드 모드 타이머 */
.timer { font-weight: bold; color: var(--text); }
.timer.low { color: var(--wrong); }
```

- [ ] **Step 5: `script.js`** — 상수와 상태, 타이머 함수를 추가하고 기존 함수를 고친다.

```js
const SPEED_SECONDS = 15;   // CATEGORIES 아래에 둔다
```

`state`에 `timerId: null, timeLeft: SPEED_SECONDS,`를 더한다.

```js
// 스피드 모드 타이머: 1초마다 줄이고 0이 되면 시간 초과로 처리한다
function renderTimer() {
  const el = $("quiz-timer");
  el.textContent = `남은 시간 ${state.timeLeft}초`;
  el.classList.toggle("low", state.timeLeft <= 5);
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer() {
  stopTimer();   // 타이머는 언제나 하나만 돈다
  state.timeLeft = SPEED_SECONDS;
  renderTimer();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    renderTimer();
    if (state.timeLeft <= 0) {
      stopTimer();
      choose(null);
    }
  }, 1000);
}
```

고칠 곳:
- `renderQuestion()` 끝에: `$("quiz-timer").hidden = state.mode !== "speed"; if (state.mode === "speed") startTimer(); else stopTimer();`
- `choose()`의 `state.answered = true;` 바로 아래에: `stopTimer();`
- `finishRound()` 맨 앞에: `stopTimer();`
- `startRound()` 맨 앞에: `stopTimer();`

- [ ] **Step 6: 확인** — `?test`가 `통과 13, 실패 0`. 스피드로 한 판: 15초부터 줄고 5초 이하에서 빨간색, 가만히 두면 0초에 `시간 초과 (정답: …)`와 정답 초록 표시, 답을 고르면 멈추고 `다음`에서 15초부터. 결과 목록에 `시간 초과`, `순위표에 기록되지 않음` 없음.

- [ ] **Step 7: 커밋**

```bash
git add index.html style.css script.js
git commit -m "feat: 스피드 모드"
```

## Task 8: 힌트 모드

**Files:**
- Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Produces: `pickHintRemovals(choices, answerText) -> string[2]`, `useHint()`, 요소 id `hint-button`

- [ ] **Step 1: 자체 점검 추가**

```js
  ["힌트를 쓰고 맞히면 0.5점, 틀리면 0점이다", () => scoreFor(true, true) === 0.5 && scoreFor(false, true) === 0],
  ["힌트가 정답이 아닌 서로 다른 보기 2개를 고른다", () => {
    for (let n = 0; n < 50; n++) {
      const picked = pickHintRemovals(["가", "나", "다", "라"], "다");
      if (picked.length !== 2 || picked[0] === picked[1] || picked.includes("다")) return false;
    }
    return true;
  }],
```

- [ ] **Step 2: 실패 확인** — `?test` 기대: `통과 14, 실패 1` (`scoreFor`는 1단계부터 0.5점을 지원하므로 첫 항목은 통과).

- [ ] **Step 3: `index.html`** — `quiz-choices` 바로 위에:

```html
      <button id="hint-button" class="hint-button" hidden>힌트 (오답 2개 지우기)</button>
```

- [ ] **Step 4: `style.css`** (끝에 추가)

```css
/* 힌트 모드 */
.hint-button { margin-bottom: 10px; }
.choice.removed { opacity: 0.4; text-decoration: line-through; }
```

- [ ] **Step 5: `script.js`**

```js
// 정답이 아닌 보기 중 2개를 무작위로 고른다
function pickHintRemovals(choices, answerText) {
  return shuffle(choices.filter((c) => c !== answerText)).slice(0, 2);
}

// 힌트: 오답 보기 2개를 흐리게 하고 누를 수 없게 한다. 문항마다 한 번
function useHint() {
  if (state.answered || state.usedHint) return;
  state.usedHint = true;
  const item = state.round[state.index];
  const removed = pickHintRemovals(item.choices, item.answerText);
  $("quiz-choices").querySelectorAll(".choice").forEach((btn, i) => {
    if (removed.includes(item.choices[i])) {
      btn.disabled = true;
      btn.classList.add("removed");
    }
  });
  const hintBtn = $("hint-button");
  hintBtn.disabled = true;
  hintBtn.textContent = "힌트 사용함";
}
```

고칠 곳:
- `renderQuestion()` 끝에:
  ```js
  const hintBtn = $("hint-button");
  hintBtn.hidden = state.mode !== "hint";
  hintBtn.disabled = false;
  hintBtn.textContent = "힌트 (오답 2개 지우기)";
  ```
- `choose()`의 `stopTimer();` 아래에: `$("hint-button").disabled = true;`
- 시작 코드에: `$("hint-button").addEventListener("click", useHint);`

- [ ] **Step 6: 확인** — `?test`가 `통과 15, 실패 0`. 힌트로 한 판: 누르면 오답 2개가 흐려지고 취소선, 버튼이 `힌트 사용함`으로 잠김, 지운 보기는 눌리지 않음, 다음 문항에서 다시 쓸 수 있음, 힌트 쓰고 맞히면 `정답! (힌트 사용, 0.5점)`과 점수 0.5 증가, 결과 `7.5 / 10` 형식과 목록의 `정답 (힌트 0.5점)`.

- [ ] **Step 7: 커밋**

```bash
git add index.html style.css script.js
git commit -m "feat: 힌트 모드"
```

## Task 9: 틀린 문제 다시 풀기

**Files:**
- Modify: `index.html`, `script.js`

**Interfaces:**
- Produces: `wrongQuestions(results) -> question[]`, `startRetry()`, `state.retry` (`null` 또는 `{ firstScore, firstTotal }`), 요소 id `retry-button`

- [ ] **Step 1: `index.html`** — 결과 화면 `.button-row` 맨 앞에:

```html
        <button id="retry-button" class="primary" hidden>틀린 문제 다시 풀기</button>
```

- [ ] **Step 2: `script.js`**

`state`에 `retry: null,`을 더한다.

```js
// 이번 판에서 틀린 문항(원본 문항 객체)만 돌려준다
function wrongQuestions(results) {
  return results.filter((r) => !r.correct).map((r) => r.item.q);
}

// 연습 모드: 방금 틀린 문항만 다시 섞어서 푼다. 처음 점수는 바꾸지 않는다
function startRetry() {
  const list = wrongQuestions(state.results);
  if (!list.length) return;
  if (state.retry === null) {
    state.retry = { firstScore: state.score, firstTotal: state.round.length };
  }
  state.round = makeItems(list);
  state.index = 0;
  state.score = 0;
  state.results = [];
  showScreen("quiz");
  renderQuestion();
}
```

고칠 곳:
- `startRound()`에서 `state.results = [];` 아래에 `state.retry = null;`
- `renderTopBar()`: 다시 풀기 중이면 라벨과 점수를 바꾼다.
  ```js
  function renderTopBar() {
    const retrying = state.retry !== null;
    $("quiz-label").textContent =
      `${state.category} · ${MODE_NAMES[state.mode]}${retrying ? " · 다시 풀기" : ""}`;
    $("quiz-progress").textContent = `${state.index + 1} / ${state.round.length}`;
    $("quiz-score").textContent = retrying
      ? `처음 점수 ${formatScore(state.retry.firstScore)}`
      : `점수 ${formatScore(state.score)}`;
  }
  ```
- `finishRound()`를 다음으로 바꾼다.
  ```js
  function finishRound() {
    stopTimer();
    const retrying = state.retry !== null;
    const modeName = MODE_NAMES[state.mode];
    if (retrying) {
      $("result-title").textContent = `${state.category} · ${modeName} 다시 풀기 결과`;
      $("result-score").textContent = `다시 풀기 ${formatScore(state.score)} / ${state.round.length}`;
      $("result-sub").textContent =
        `처음 점수 ${formatScore(state.retry.firstScore)} / ${state.retry.firstTotal} (다시 풀기는 점수에 넣지 않음)`;
      $("result-sub").hidden = false;
    } else {
      $("result-title").textContent = `${state.category} · ${modeName} 결과`;
      $("result-score").textContent = `${formatScore(state.score)} / ${state.round.length}`;
      $("result-sub").hidden = true;
    }
    $("result-note").hidden = state.mode !== "practice";
    $("retry-button").hidden = !(state.mode === "practice" && wrongQuestions(state.results).length > 0);
    renderResultList();
    showScreen("result");
  }
  ```
- 시작 코드에: `$("retry-button").addEventListener("click", startRetry);`

- [ ] **Step 3: 자체 점검 추가 대신 확인** — 점검 항목은 15개를 유지한다(`wrongQuestions`는 화면 흐름으로 확인). `?test`가 `통과 15, 실패 0`.

- [ ] **Step 4: 확인** — 연습으로 일부러 몇 개 틀린 뒤 결과에 `틀린 문제 다시 풀기`가 나오고, 누르면 틀린 문항만 나오며 상단이 `… · 다시 풀기`, `처음 점수 n`. 다시 풀기 결과에 `다시 풀기 a / b`와 `처음 점수 n / 10`. 또 틀리면 버튼이 다시 나오고 다 맞히면 사라짐. `같은 카테고리 다시`는 점수 0, 새로 섞인 10문항. 스피드·힌트 결과에는 버튼 없음.

- [ ] **Step 5: 커밋**

```bash
git add index.html script.js
git commit -m "feat: 틀린 문제 다시 풀기"
```

## 2단계 끝: 멈춤

- [ ] 완료 기준 1~6을 점검하고 완료 보고를 한 뒤, 아래 확인 항목 17개를 알리고 **멈춘다.**

### 2단계 브라우저 확인 항목 17개

**모드 선택 (3)**
1. 시작 화면에서 `연습 모드 · 순위표에 기록되지 않음` 문구가 사라졌다.
2. 카테고리를 고르면 `<카테고리> · 모드를 고르세요`와 연습·스피드·힌트 버튼 3개, 모드마다 규칙 한 줄이 보이고, `순위표에 기록되지 않음`은 연습에만 있다.
3. `뒤로`를 누르면 시작 화면으로 돌아간다.

**스피드 모드 (6)**
4. 상단의 남은 시간이 15초부터 1초에 1씩 준다.
5. 5초 이하에서 남은 시간이 빨간색이 된다.
6. 아무것도 누르지 않으면 0초에 `시간 초과 (정답: …)`가 나오고 정답 보기가 초록색이 되며 해설이 보인다.
7. 답을 고르면 남은 시간이 그 자리에서 멈춘다.
8. `다음`을 누르면 남은 시간이 15초부터 다시 센다.
9. 결과 목록에 `시간 초과`가 표시되고, 결과 화면에 `틀린 문제 다시 풀기`가 없다. (`같은 카테고리 다시`로 새 판을 시작해도 시간이 2배로 빨리 줄지 않는다)

**힌트 모드 (4)**
10. `힌트 (오답 2개 지우기)`를 누르면 오답 보기 2개가 흐려지고 취소선이 그어지며 눌리지 않는다. 정답은 지워지지 않는다.
11. 버튼이 `힌트 사용함`으로 바뀌고 다시 눌리지 않는다.
12. 다음 문항에서는 힌트를 다시 쓸 수 있다.
13. 힌트를 쓰고 맞히면 0.5점, 쓰지 않고 맞히면 1점이며, 결과 목록에 `정답 (힌트 0.5점)`이 붙는다.

**연습 모드와 다시 풀기 (4)**
14. 연습에서 틀린 문항이 있으면 결과 화면에 `틀린 문제 다시 풀기`가 나온다.
15. 누르면 방금 틀린 문항만 나오고, 점수를 매기지 않는다(상단에 `처음 점수`).
16. 다시 풀기 결과 화면에 처음 점수가 그대로 남아 있다.
17. 다시 풀기에서 또 틀리면 버튼이 다시 나오고, 다 맞히면 사라진다.

(참고: `?test`로 열면 `자체 점검 결과: 통과 15, 실패 0`)

### 2단계 배포 (사람이 확인한 뒤 요청하면)

```bash
git switch master
git merge --no-ff stage-2 -m "merge: 2단계 스피드·힌트 모드와 다시 풀기"
git push origin master
```

배포 뒤 `https://nakyeong2026.github.io/Study03_Quiz/`에서 카테고리를 고르면 모드 선택 화면이 나오는지 확인한다(예전 화면이면 Ctrl+Shift+R).

---

# 3단계: 점수 저장과 순위표 (`localStorage`)

**만들 것:** 순위표 계산·저장 함수, 스피드·힌트 결과 화면의 이름 입력과 기록 저장, 순위표 화면, 시작 화면의 `순위표 보기`, 자체 점검 추가(모두 21개).

**완료 기준 (Claude가 점검):** PRD 6.3의 1~6. `?test`가 `통과 21, 실패 0`.

## 3단계 시작 전

```bash
git branch
git switch -c stage-3
```

## Task 10: 순위표 계산과 저장 함수

**Files:**
- Modify: `script.js`

**Interfaces:**
- Produces: `BOARD_KEY = "quiz.leaderboard"`, `BOARD_SIZE = 5`, `boardKey(mode, category) -> "speed:한국사"`, `normalizeBoard(raw) -> object`, `addRecord(list, record) -> 새 배열`, `cleanName(name) -> string | null`, `formatDate(ms) -> "YYYY-MM-DD"`, `loadBoard() -> { board, ok }`, `saveRecord(mode, category, name, score) -> boolean`

- [ ] **Step 1: 자체 점검 추가**

```js
  ["순위표 키가 모드:카테고리 형식이다", () => boardKey("speed", "한국사") === "speed:한국사"],
  ["순위표가 점수 내림차순, 같은 점수는 먼저 세운 기록이 위다", () => {
    let list = [];
    list = addRecord(list, { name: "가", score: 7, savedAt: 1 });
    list = addRecord(list, { name: "나", score: 9, savedAt: 2 });
    list = addRecord(list, { name: "다", score: 7, savedAt: 3 });
    return list.map((r) => r.name).join() === "나,가,다";
  }],
  ["순위표는 상위 5건만 남긴다", () => {
    let list = [];
    for (let i = 0; i < 7; i++) list = addRecord(list, { name: `n${i}`, score: i, savedAt: i });
    return list.length === 5 && list[0].score === 6 && list[4].score === 2;
  }],
  ["깨진 순위표 값은 빈 순위표가 된다", () =>
    Object.keys(normalizeBoard("{깨짐")).length === 0 &&
    Object.keys(normalizeBoard(JSON.stringify({ "speed:한국사": "x" }))).length === 0],
  ["이름은 앞뒤 공백을 지운 1~10자다", () =>
    cleanName("  홍길동 ") === "홍길동" && cleanName("   ") === null && cleanName("12345678901") === null],
  ["날짜를 YYYY-MM-DD로 보여 준다", () => formatDate(new Date(2026, 9, 5).getTime()) === "2026-10-05"],
```

- [ ] **Step 2: 실패 확인** — `?test` 기대: `통과 15, 실패 6`.

- [ ] **Step 3: 구현** (`formatScore` 아래)

```js
// ===== 순위표 =====
const BOARD_KEY = "quiz.leaderboard";
const BOARD_SIZE = 5;

function boardKey(mode, category) {
  return `${mode}:${category}`;
}

// 저장된 글자를 순위표 객체로 바꾼다. 형식이 다르면 빈 순위표
function normalizeBoard(raw) {
  let data;
  try { data = JSON.parse(raw); } catch (e) { return {}; }
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const board = {};
  for (const [key, list] of Object.entries(data)) {
    if (!Array.isArray(list)) return {};
    const ok = list.every((r) => r && typeof r.name === "string" &&
      typeof r.score === "number" && typeof r.savedAt === "number");
    if (!ok) return {};
    board[key] = list;
  }
  return board;
}

// 기록을 넣고 점수 내림차순(같으면 먼저 세운 기록이 위)으로 상위 5건만 남긴다
function addRecord(list, record) {
  return list.concat([record])
    .sort((a, b) => b.score - a.score || a.savedAt - b.savedAt)
    .slice(0, BOARD_SIZE);
}

function cleanName(name) {
  const trimmed = String(name).trim();
  return trimmed.length >= 1 && trimmed.length <= 10 ? trimmed : null;
}

function formatDate(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// localStorage를 쓸 수 없으면 ok가 false다
function loadBoard() {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    return { board: raw === null ? {} : normalizeBoard(raw), ok: true };
  } catch (e) {
    return { board: {}, ok: false };
  }
}

function saveRecord(mode, category, name, score) {
  const { board, ok } = loadBoard();
  if (!ok) return false;
  const key = boardKey(mode, category);
  board[key] = addRecord(board[key] || [], { name, score, savedAt: Date.now() });
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(board));
    return true;
  } catch (e) {
    return false;
  }
}
```

- [ ] **Step 4: 통과 확인** — `?test` 기대: `통과 21, 실패 0`.

- [ ] **Step 5: 커밋**

```bash
git add script.js
git commit -m "feat: 순위표 계산과 저장 함수"
```

## Task 11: 결과 화면 기록 저장

**Files:**
- Modify: `index.html`, `style.css`, `script.js`

**Interfaces:**
- Consumes: Task 10 함수, Task 12의 `renderBoard`(저장 뒤 이동)
- Produces: `state.saved: boolean`, 요소 id `save-box`, `name-input`, `save-button`, `save-message`

- [ ] **Step 1: `index.html`** — 결과 화면 `result-list` 위에:

```html
      <div id="save-box" class="save-box" hidden>
        <label for="name-input">이름 (1~10자)</label>
        <div class="save-row">
          <input id="name-input" type="text" maxlength="20" autocomplete="off">
          <button id="save-button" class="primary">기록 저장</button>
        </div>
        <p id="save-message" class="error" hidden></p>
      </div>
```

- [ ] **Step 2: `style.css`** (끝에 추가)

```css
/* 기록 저장 */
.save-box { margin: 12px 0; }
.save-row { display: flex; gap: 8px; margin-top: 4px; }
.save-row input { flex: 1; min-width: 0; font: inherit; padding: 10px; border: 1px solid var(--border); border-radius: 8px; }
```

- [ ] **Step 3: `script.js`**

`state`에 `saved: false,`를 더하고, `startRound()`에서 `state.saved = false;`.

```js
// 스피드·힌트 결과의 기록 저장. 한 판에서 한 번만 저장한다
function saveCurrent() {
  if (state.saved) return;
  const name = cleanName($("name-input").value);
  const msg = $("save-message");
  if (name === null) {
    msg.textContent = "이름을 1~10자로 입력하세요.";
    msg.hidden = false;
    return;
  }
  if (!saveRecord(state.mode, state.category, name, state.score)) {
    msg.textContent = "이 브라우저에서는 기록을 저장할 수 없음";
    msg.hidden = false;
    return;
  }
  state.saved = true;
  showBoard(state.mode, state.category);
}
```

`finishRound()`의 `renderResultList();` 위에:

```js
  const canSave = state.mode !== "practice";
  $("save-box").hidden = !canSave;
  $("save-message").hidden = true;
  $("name-input").value = "";
  $("save-button").disabled = state.saved;
```

시작 코드에: `$("save-button").addEventListener("click", saveCurrent);`

- [ ] **Step 4: 확인은 Task 12와 함께** (`showBoard`가 Task 12에서 생김). 이 태스크만으로 커밋하기 전에 `?test`가 `통과 21, 실패 0`인지 확인한다.

- [ ] **Step 5: 커밋**

```bash
git add index.html style.css script.js
git commit -m "feat: 결과 화면 기록 저장"
```

## Task 12: 순위표 화면

**Files:**
- Modify: `index.html`, `style.css`, `script.js`, `PRD.md`(필요 없으면 그대로)

**Interfaces:**
- Produces: `showBoard(mode, category)`, `renderBoard(mode, category)`, 요소 id `screen-board`, `board-modes`, `board-categories`, `board-table`, `board-empty`, `board-message`, `board-home`, `board-button`

- [ ] **Step 1: `index.html`** — 시작 화면 `category-buttons` 아래에 `<button id="board-button" class="wide">순위표 보기</button>`, 결과 화면 아래에:

```html
    <!-- 순위표 화면 -->
    <section id="screen-board" class="screen" hidden>
      <h2>순위표</h2>
      <div id="board-modes" class="tab-row"></div>
      <div id="board-categories" class="tab-row"></div>
      <p id="board-message" class="error" hidden></p>
      <table id="board-table" class="board-table">
        <thead><tr><th>순위</th><th>이름</th><th>점수</th><th>날짜</th></tr></thead>
        <tbody></tbody>
      </table>
      <p id="board-empty" class="note" hidden>아직 기록이 없음</p>
      <div class="button-row"><button id="board-home">처음으로</button></div>
    </section>
```

- [ ] **Step 2: `style.css`**

```css
/* 순위표 */
.tab-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.tab-row button { padding: 8px 12px; }
.tab-row button.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.board-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
.board-table th, .board-table td { border-bottom: 1px solid var(--border); padding: 8px 4px; text-align: left; overflow-wrap: anywhere; }
```

- [ ] **Step 3: `script.js`**

```js
const BOARD_MODES = ["speed", "hint"];

function renderBoard(mode, category) {
  const { board, ok } = loadBoard();
  $("board-message").textContent = "이 브라우저에서는 기록을 저장할 수 없음";
  $("board-message").hidden = ok;
  const makeTabs = (boxId, values, current, label, onPick) => {
    const box = $(boxId);
    box.replaceChildren();
    values.forEach((v) => {
      const btn = document.createElement("button");
      btn.textContent = label(v);
      btn.classList.toggle("active", v === current);
      btn.addEventListener("click", () => onPick(v));
      box.appendChild(btn);
    });
  };
  makeTabs("board-modes", BOARD_MODES, mode, (m) => MODE_NAMES[m], (m) => renderBoard(m, category));
  makeTabs("board-categories", CATEGORIES, category, (c) => c, (c) => renderBoard(mode, c));
  const list = board[boardKey(mode, category)] || [];
  const tbody = $("board-table").querySelector("tbody");
  tbody.replaceChildren();
  list.forEach((r, i) => {
    const tr = document.createElement("tr");
    [String(i + 1), r.name, formatScore(r.score), formatDate(r.savedAt)].forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  $("board-table").hidden = list.length === 0;
  $("board-empty").hidden = list.length > 0;
}

function showBoard(mode, category) {
  renderBoard(mode, category);
  showScreen("board");
}
```

시작 코드에:

```js
$("board-button").addEventListener("click", () => showBoard("speed", CATEGORIES[0]));
$("board-home").addEventListener("click", () => showScreen("start"));
```

- [ ] **Step 4: 확인** — `?test`가 `통과 21, 실패 0`. 스피드로 한 판 → 이름 입력 → 저장 → 그 표가 보임, 같은 판에서 다시 저장 불가, 공백 이름은 안내, 여러 번 저장해 상위 5건·정렬 확인, 새로고침 뒤에도 남음, 연습은 저장칸 없음, 시작 화면 `순위표 보기`로 표 8개 이동.

- [ ] **Step 5: 커밋**

```bash
git add index.html style.css script.js
git commit -m "feat: 순위표 화면"
```

## 3단계 끝: 멈춤

### 3단계 브라우저 확인 항목 11개

1. 시작 화면에 `순위표 보기` 버튼이 있다.
2. 스피드·힌트 결과 화면에 이름 입력칸과 `기록 저장`이 있고, 연습 결과에는 없다.
3. 이름을 비우거나 공백만 넣고 저장하면 안내가 나오고 저장되지 않는다.
4. 이름을 넣고 저장하면 순위표 화면으로 넘어가 방금 기록이 보인다.
5. 같은 판에서 다시 저장할 수 없다(`처음으로` 뒤 다시 결과로 돌아갈 수 없음).
6. 순위표에서 모드 2개 × 카테고리 4개를 골라 8개 표를 볼 수 있다.
7. 기록이 없는 표는 `아직 기록이 없음`이 보인다.
8. 점수 내림차순이고 같은 점수는 먼저 저장한 기록이 위다.
9. 6건 이상 저장해도 상위 5건만 보인다.
10. 브라우저를 닫았다 열어도 기록이 남아 있다.
11. `?test`로 열면 `자체 점검 결과: 통과 21, 실패 0`.

### 3단계 배포

```bash
git switch master
git merge --no-ff stage-3 -m "merge: 3단계 점수 저장과 순위표"
git push origin master
```

---

## PRD 대응표

| PRD 항목 | 태스크 |
|---|---|
| 1 개요(파일 4개, 40문항) | 1, 2 |
| 2.1 게임 모드 — 연습 | 4, 5, 9 |
| 2.1 게임 모드 — 스피드 | 7 |
| 2.1 게임 모드 — 힌트 | 8 |
| 2.2 섞기 | 3(`shuffle`, `makeItems`), 9 |
| 2.3 틀린 문제 다시 풀기 | 9 |
| 2.4 순위표 | 10, 11, 12 |
| 2.5 문항 규칙 | 2, 3(`checkQuestions`) |
| 3.1 시작 화면 | 1, 4, 6, 12 |
| 3.2 문항 화면 | 1, 4, 7, 8 |
| 3.3 결과 화면 | 1, 5, 9, 11 |
| 3.4 순위표 화면 | 12 |
| 4.1 파일과 불러오는 순서 | 1 |
| 4.2 문항 형식 | 2, 3 |
| 4.3 순위표 저장 형식 | 10 |
| 5 `script.js` 구조 | 3~12 |
| 6 완료 기준 | 각 단계 끝 |
| 7 검증 방법 | 전역 제약(점검 명령), 각 단계 끝 |
| 과제: 학번·이름 표시 | 1 |
