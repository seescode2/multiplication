import { beforeEach, expect, it } from "vitest";
import { buildProblem } from "../engine";
import {
  emptyProgress,
  KEY,
  loadProgress,
  reducer,
  session,
  type Session,
  type Action,
} from "../state";
const p = buildProblem(24, 13, "test");
const act = (
  s: Session,
  type:
    | "next"
    | "check-step"
    | "show-step"
    | "check-answer"
    | "hint"
    | "worked",
): Action => ({ type, id: s.problem.id, step: s.step });
const finish = (s: Session) => {
  while (!s.done) s = reducer(s, act(s, "next"));
  return s;
};
beforeEach(() => localStorage.clear());
it("Learn advances one step per click, rejects stale clicks, and counts completion only once", () => {
  let s = session(p, "learn", emptyProgress());
  const click = act(s, "next");
  s = reducer(s, click);
  expect(s.step).toBe(1);
  expect(reducer(s, click).step).toBe(1);
  s = finish(s);
  expect(s.progress.learn).toBe(1);
  expect(s.progress.practice).toBe(0);
  s = finish(reducer(s, { type: "reset", problem: p, mode: "learn" }));
  expect(s.progress.learn).toBe(1);
});
it("Predict retries are free and need an explicit Continue", () => {
  let s = session(p, "predict", emptyProgress());
  const st = p.steps[0];
  s = reducer(s, {
    type: "select",
    value: st.choices.find((c) => c.value !== st.answer)!.value,
  });
  s = reducer(s, act(s, "check-step"));
  expect(s.step).toBe(0);
  expect(s.checked).toBe(false);
  expect(s.feedback).toContain(st.hint);
  s = reducer(s, { type: "select", value: st.answer });
  s = reducer(s, act(s, "check-step"));
  expect(s.checked).toBe(true);
  expect(s.step).toBe(0);
  expect(s.progress.decisions).toBe(1);
  expect(s.progress.firstChoice).toBe(0);
  s = reducer(s, act(s, "next"));
  while (!s.done) {
    s = reducer(s, act(s, "show-step"));
    s = reducer(s, act(s, "next"));
  }
  expect(s.progress.predict).toBe(1);
  expect(s.progress.decisions).toBe(p.steps.length);
});
it("counts a correct first choice once and does not skip a question on repeated checks", () => {
  let s = session(p, "predict", emptyProgress());
  s = reducer(s, { type: "select", value: p.steps[0].answer });
  s = reducer(s, act(s, "check-step"));
  s = reducer(s, act(s, "check-step"));
  expect(s.progress.firstChoice).toBe(1);
  expect(s.progress.decisions).toBe(1);
  expect(s.step).toBe(0);
});
it("Practice accepts Enter-equivalent submissions without duplicate credit", () => {
  let s = session(p, "practice", emptyProgress());
  s = reducer(s, { type: "answer", value: String(p.answer) });
  const click = act(s, "check-answer");
  s = reducer(s, click);
  s = reducer(s, click);
  expect(s.done).toBe(true);
  expect(s.progress.practice).toBe(1);
  expect(s.progress.firstTry).toBe(1);
  expect(s.progress.streak).toBe(1);
  expect(s.progress.byDigits[2]).toEqual({ done: 1, first: 1 });
  s = reducer(s, { type: "reset", problem: p, mode: "practice" });
  s = reducer(s, { type: "answer", value: String(p.answer) });
  s = reducer(s, act(s, "check-answer"));
  expect(s.progress.practice).toBe(1);
});
it("remembers mistakes through Start Over and does not reveal the answer after a wrong response", () => {
  let s = session(p, "practice", emptyProgress());
  s = reducer(s, { type: "answer", value: "999" });
  s = reducer(s, act(s, "check-answer"));
  expect(s.done).toBe(false);
  expect(s.step).toBe(0);
  expect(s.feedback).not.toContain(String(p.answer));
  s = reducer(s, { type: "reset", problem: p, mode: "practice" });
  s = reducer(s, { type: "answer", value: String(p.answer) });
  s = reducer(s, act(s, "check-answer"));
  expect(s.progress.practice).toBe(1);
  expect(s.progress.firstTry).toBe(0);
});
it("hints and solution reveals are guided, even after replay or changing modes", () => {
  let s = session(p, "practice", emptyProgress());
  s = reducer(s, act(s, "hint"));
  expect(s.step).toBe(0);
  s = reducer(s, { type: "reset", problem: p, mode: "practice" });
  s = reducer(s, { type: "answer", value: String(p.answer) });
  s = reducer(s, act(s, "check-answer"));
  expect(s.progress.guided).toBe(1);
  expect(s.progress.practice).toBe(0);
  s = session({ ...p, id: "another" }, "practice", s.progress);
  s = reducer(s, act(s, "worked"));
  expect(s.step).toBe(0);
  s = finish(s);
  expect(s.progress.guided).toBe(2);
  s = session({ ...p, id: "learned" }, "learn", emptyProgress());
  s = reducer(s, act(s, "next"));
  s = reducer(s, { type: "reset", problem: s.problem, mode: "practice" });
  expect(s.helped).toBe(true);
  expect(s.answer).toBe("");
  expect(s.worked).toBe(false);
});
it("persists all metrics and safely handles corrupt or incompatible storage", () => {
  const progress = emptyProgress();
  localStorage.setItem(KEY, JSON.stringify(progress));
  expect(loadProgress()).toEqual(progress);
  for (const v of [
    "{",
    "null",
    JSON.stringify({ ...progress, practice: -1 }),
    JSON.stringify({ ...progress, firstChoice: 5 }),
  ]) {
    localStorage.setItem(KEY, v);
    expect(loadProgress()).toEqual(emptyProgress());
  }
});
it("reset clears all counters without losing the current problem", () => {
  let s = session(p, "learn", emptyProgress());
  s = finish(s);
  s = reducer(s, { type: "clear" });
  expect(s.problem).toEqual(p);
  expect(s.progress).toEqual(emptyProgress());
});
