// 상식 퀴즈 게임 로직
"use strict";

const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const ROUND_SIZE = 10;
const SPEED_SECONDS = 15;
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
  timerId: null,
  timeLeft: SPEED_SECONDS,
  retry: null,        // 다시 풀기 중이면 { firstScore, firstTotal }
};

const $ = (id) => document.getElementById(id);

// 화면 하나만 보이게 한다
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = el.id !== `screen-${name}`;
  });
  window.scrollTo(0, 0);
}

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

function startRound(mode, category) {
  stopTimer();
  state.mode = mode;
  state.category = category;
  state.round = buildRound(QUESTIONS, category);
  state.index = 0;
  state.score = 0;
  state.results = [];
  state.retry = null;
  showScreen("quiz");
  renderQuestion();
}

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

function renderTopBar() {
  const retrying = state.retry !== null;
  $("quiz-label").textContent =
    `${state.category} · ${MODE_NAMES[state.mode]}${retrying ? " · 다시 풀기" : ""}`;
  $("quiz-progress").textContent = `${state.index + 1} / ${state.round.length}`;
  $("quiz-score").textContent = retrying
    ? `처음 점수 ${formatScore(state.retry.firstScore)}`
    : `점수 ${formatScore(state.score)}`;
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
  const hintBtn = $("hint-button");
  hintBtn.hidden = state.mode !== "hint";
  hintBtn.disabled = false;
  hintBtn.textContent = "힌트 (오답 2개 지우기)";
  $("quiz-timer").hidden = state.mode !== "speed";
  if (state.mode === "speed") startTimer();
  else stopTimer();
}

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

// 보기를 고른다. index가 null이면 시간 초과(2단계)
function choose(index) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();
  $("hint-button").disabled = true;
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

// 카테고리를 고른 뒤 모드 선택 화면을 보여 준다
function showModeScreen(category) {
  state.category = category;
  $("mode-title").textContent = `${category} · 모드를 고르세요`;
  showScreen("mode");
}

// 시작 화면: 문항 데이터를 검사하고 카테고리 버튼을 만든다
function initStartScreen() {
  const problems = checkQuestions(typeof QUESTIONS === "undefined" ? null : QUESTIONS);
  const box = $("category-buttons");
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.disabled = problems.length > 0;
    btn.addEventListener("click", () => showModeScreen(cat));
    box.appendChild(btn);
  });
  if (problems.length) {
    $("data-error").textContent = "문항 데이터에 오류가 있어 시작할 수 없음\n" + problems.join("\n");
    $("data-error").hidden = false;
  }
}

// ===== 시작 =====
$("next-button").addEventListener("click", next);
$("again-button").addEventListener("click", () => startRound(state.mode, state.category));
$("home-button").addEventListener("click", () => showScreen("start"));
document.querySelectorAll(".mode-button").forEach((btn) => {
  btn.addEventListener("click", () => startRound(btn.dataset.mode, state.category));
});
$("mode-back").addEventListener("click", () => showScreen("start"));
$("hint-button").addEventListener("click", useHint);
$("retry-button").addEventListener("click", startRetry);
initStartScreen();

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
  ["스피드 모드 제한 시간이 15초다", () => SPEED_SECONDS === 15],
  ["힌트를 쓰고 맞히면 0.5점, 틀리면 0점이다", () => scoreFor(true, true) === 0.5 && scoreFor(false, true) === 0],
  ["힌트가 정답이 아닌 서로 다른 보기 2개를 고른다", () => {
    for (let n = 0; n < 50; n++) {
      const picked = pickHintRemovals(["가", "나", "다", "라"], "다");
      if (picked.length !== 2 || picked[0] === picked[1] || picked.includes("다")) return false;
    }
    return true;
  }],
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
