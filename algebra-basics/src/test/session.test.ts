import { beforeEach, describe, expect, it } from "vitest";
import { makeProblem } from "../engine/problems";
import { rat } from "../engine/rational";
import {
  createSession,
  sessionReducer as reduce,
  type Session,
  type Action,
} from "../session";
import {
  emptyProgress,
  loadProgress,
  recordProgress,
  STORAGE_KEY,
} from "../progress";

const p = makeProblem(
  "two-step",
  "beginner",
  { a: 3, b: 5, c: rat(20) },
  "test",
);
const action = (
  s: Session,
  type: Exclude<
    Action["type"],
    "reset" | "clear-progress" | "answer" | "select"
  >,
): Action => ({ type, position: s.revealed, problemId: s.problem.id });
const finish = (s: Session) => {
  while (!s.complete) s = reduce(s, action(s, "reveal"));
  return s;
};
beforeEach(() => localStorage.clear());
describe("learning state and honest progress", () => {
  it("reveals one step per action and ignores stale repeated clicks", () => {
    let s = createSession(p, "learn", emptyProgress());
    const click = action(s, "reveal");
    s = reduce(s, click);
    expect(s.revealed).toBe(1);
    s = reduce(s, click);
    expect(s.revealed).toBe(1);
    s = finish(s);
    expect(s.progress.learn).toBe(1);
    expect(s.progress.practice).toBe(0);
    s = finish(reduce(s, { type: "reset", problem: p, mode: "learn" }));
    expect(s.progress.learn).toBe(1);
  });
  it("does not advance prediction on wrong or inefficient choices and requires Continue", () => {
    let s = createSession(p, "predict", emptyProgress());
    const inefficient = p.steps[0].choices.find(
      (c) => c.classification === "inefficient",
    )!;
    s = reduce(s, { type: "select", value: inefficient.id });
    s = reduce(s, action(s, "check-step"));
    expect(s.revealed).toBe(0);
    expect(s.checked).toBe(false);
    expect(s.feedback).toContain("keeps equality");
    expect(s.progress.firstChoice).toBe(0);
    s = reduce(s, {
      type: "select",
      value: p.steps[0].choices.find((c) => c.classification === "preferred")!
        .id,
    });
    s = reduce(s, action(s, "check-step"));
    expect(s.checked).toBe(true);
    expect(s.revealed).toBe(0);
    expect(s.progress.decisions).toBe(1);
    s = reduce(s, action(s, "continue"));
    expect(s.revealed).toBe(1);
    while (!s.complete) {
      s = reduce(s, action(s, "show-step"));
      s = reduce(s, action(s, "continue"));
    }
    expect(s.progress.predict).toBe(1);
    expect(s.progress.firstChoice).toBe(0);
    expect(s.progress.decisions).toBe(4);
  });
  it("records correct first-choice decisions once, and explicit help as assisted", () => {
    let s = createSession(p, "predict", emptyProgress());
    s = reduce(s, {
      type: "select",
      value: p.steps[0].choices.find((c) => c.classification === "preferred")!
        .id,
    });
    s = reduce(s, action(s, "check-step"));
    s = reduce(s, action(s, "check-step"));
    expect(s.progress.decisions).toBe(1);
    expect(s.progress.firstChoice).toBe(1);
    s = reduce(s, action(s, "continue"));
    s = reduce(s, action(s, "show-step"));
    expect(s.progress.decisions).toBe(2);
    expect(s.progress.firstChoice).toBe(1);
  });
  it("accepts equivalent practice answers without double-counting submissions or replay", () => {
    let s = createSession(p, "practice", emptyProgress());
    s = reduce(s, { type: "answer", value: "10/2" });
    const click = action(s, "check-answer");
    s = reduce(s, click);
    s = reduce(s, click);
    expect(s.complete).toBe(true);
    expect(s.progress.practice).toBe(1);
    expect(s.progress.firstTry).toBe(1);
    expect(s.progress.streak).toBe(1);
    s = reduce(s, { type: "reset", problem: p, mode: "practice" });
    s = reduce(s, { type: "answer", value: "5.0" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.progress.practice).toBe(1);
  });
  it("keeps wrong answers private and counts retries separately from first-try successes", () => {
    let s = createSession(p, "practice", emptyProgress());
    s = reduce(s, { type: "answer", value: "99" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.complete).toBe(false);
    expect(s.feedback).not.toContain("x = 5");
    expect(s.revealed).toBe(0);
    s = reduce(s, { type: "answer", value: "5" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.progress.practice).toBe(1);
    expect(s.progress.firstTry).toBe(0);
  });
  it("invalid numeric input is not an attempt", () => {
    let s = createSession(p, "practice", emptyProgress());
    s = reduce(s, { type: "answer", value: "1/0" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.attempts).toBe(0);
    expect(s.tone).toBe("error");
  });
  it("hints and incremental solutions count as guided, never independent mastery", () => {
    let s = createSession(p, "practice", emptyProgress());
    s = reduce(s, action(s, "hint"));
    expect(s.revealed).toBe(0);
    expect(s.feedback).not.toContain("x = 5");
    s = reduce(s, { type: "answer", value: "5" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.progress.practice).toBe(0);
    expect(s.progress.guided).toBe(1);
    s = createSession({ ...p, id: "another" }, "practice", s.progress);
    s = reduce(s, action(s, "worked"));
    expect(s.revealed).toBe(0);
    s = finish(s);
    expect(s.progress.guided).toBe(2);
    expect(s.progress.practice).toBe(0);
  });
  it("resets mode, answer, hints, choices and steps while retaining progress", () => {
    let s = createSession(p, "predict", emptyProgress());
    s = reduce(s, action(s, "show-step"));
    s = reduce(s, action(s, "continue"));
    s = reduce(s, { type: "reset", problem: p, mode: "practice" });
    expect(s.mode).toBe("practice");
    expect(s.revealed).toBe(0);
    expect(s.answer).toBe("");
    expect(s.checked).toBe(false);
    expect(s.worked).toBe(false);
    expect(s.feedback).toBe("");
    expect(s.helped).toBe(true);
    expect(s.progress.decisions).toBe(1);
    s = reduce(s, {
      type: "reset",
      problem: { ...p, id: "new" },
      mode: "learn",
    });
    const old = reduce(s, { type: "reveal", position: 0, problemId: p.id });
    expect(old).toBe(s);
  });
  it("tracks per-type accuracy, streaks, and separate learning records", () => {
    let progress = emptyProgress();
    progress = recordProgress(progress, {
      kind: "practice",
      problemId: "a",
      family: "addition",
      firstTry: true,
      guided: false,
    });
    progress = recordProgress(progress, {
      kind: "practice",
      problemId: "b",
      family: "two-step",
      firstTry: true,
      guided: false,
    });
    expect(progress.streak).toBe(2);
    progress = recordProgress(progress, {
      kind: "practice",
      problemId: "c",
      family: "addition",
      firstTry: false,
      guided: false,
    });
    expect(progress.streak).toBe(0);
    expect(progress.byType.addition).toEqual({ completed: 2, firstTry: 1 });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    expect(loadProgress()).toEqual(progress);
  });
  it("Start Over cannot turn exposed solutions into independent work or retries into first tries", () => {
    let s = createSession(p, "practice", emptyProgress());
    s = reduce(s, action(s, "worked"));
    s = reduce(s, action(s, "reveal"));
    s = reduce(s, { type: "reset", problem: p, mode: "practice" });
    s = reduce(s, { type: "answer", value: "5" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.progress.practice).toBe(0);
    expect(s.progress.guided).toBe(1);
    s = createSession({ ...p, id: "retry" }, "practice", emptyProgress());
    s = reduce(s, { type: "answer", value: "99" });
    s = reduce(s, action(s, "check-answer"));
    s = reduce(s, { type: "reset", problem: s.problem, mode: "practice" });
    s = reduce(s, { type: "answer", value: "5" });
    s = reduce(s, action(s, "check-answer"));
    expect(s.progress.practice).toBe(1);
    expect(s.progress.firstTry).toBe(0);
  });
  it("recovers from missing, corrupt, and incompatible saved data", () => {
    expect(loadProgress()).toEqual(emptyProgress());
    for (const value of [
      "not json",
      '{"version":99}',
      JSON.stringify({ ...emptyProgress(), firstTry: 10 }),
      JSON.stringify({ ...emptyProgress(), seen: [3] }),
    ]) {
      localStorage.setItem(STORAGE_KEY, value);
      expect(loadProgress()).toEqual(emptyProgress());
    }
  });
});
