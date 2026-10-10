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
