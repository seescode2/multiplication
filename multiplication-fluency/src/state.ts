import { parseAnswer, type Digits, type Problem } from "./engine";
export type Mode = "learn" | "predict" | "practice";
export const KEY = "multiplication-fluency-v1";
export interface Progress {
  seen: string[];
  assisted: string[];
  mistakes: string[];
  learn: number;
  predict: number;
  decisions: number;
  firstChoice: number;
  practice: number;
  firstTry: number;
  streak: number;
  guided: number;
  byDigits: Record<Digits, { done: number; first: number }>;
}
export const emptyProgress = (): Progress => ({
  seen: [],
  assisted: [],
  mistakes: [],
  learn: 0,
  predict: 0,
  decisions: 0,
  firstChoice: 0,
  practice: 0,
  firstTry: 0,
  streak: 0,
  guided: 0,
  byDigits: {
    2: { done: 0, first: 0 },
    3: { done: 0, first: 0 },
    4: { done: 0, first: 0 },
  },
});
export function loadProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? "null") as Progress;
    if (
      !p ||
      !["seen", "assisted", "mistakes"].every(
        (k) =>
          Array.isArray(p[k as "seen"]) &&
          p[k as "seen"].every((x) => typeof x === "string"),
      ) ||
      ![
        p.learn,
        p.predict,
        p.decisions,
        p.firstChoice,
        p.practice,
        p.firstTry,
        p.streak,
        p.guided,
      ].every((n) => Number.isSafeInteger(n) && n >= 0) ||
      p.firstChoice > p.decisions ||
      p.firstTry > p.practice ||
      p.streak > p.practice ||
      ![2, 3, 4].every((d) => {
        const v = p.byDigits?.[d as Digits];
        return (
          v &&
          Number.isSafeInteger(v.done) &&
          v.done >= 0 &&
          Number.isSafeInteger(v.first) &&
          v.first >= 0 &&
          v.first <= v.done
        );
      })
    )
      return emptyProgress();
    return p;
  } catch {
    return emptyProgress();
  }
}
export interface Session {
  problem: Problem;
  mode: Mode;
  progress: Progress;
  step: number;
  selected: string;
  checked: boolean;
  feedback: string;
  good: boolean;
  answer: string;
  helped: boolean;
  worked: boolean;
  done: boolean;
}
export const session = (
  problem: Problem,
  mode: Mode,
  progress: Progress,
): Session => ({
  problem,
  mode,
  progress,
  step: 0,
  selected: "",
  checked: false,
  feedback: "",
  good: false,
  answer: "",
  helped: progress.assisted.includes(problem.id),
  worked: false,
  done: false,
});
export type Action =
  | { type: "reset"; problem: Problem; mode: Mode }
  | { type: "select" | "answer"; value: string }
  | { type: "clear" }
  | {
      type:
        | "next"
        | "check-step"
        | "show-step"
        | "check-answer"
        | "hint"
        | "worked";
      id: string;
      step: number;
    };
function once(
  p: Progress,
  key: string,
  update: (p: Progress) => void,
): Progress {
  if (p.seen.includes(key)) return p;
  const next = { ...p, seen: [...p.seen, key] };
  update(next);
  return next;
}
function assist(s: Session): Session {
  return {
    ...s,
    helped: true,
    progress: once(s.progress, `assist:${s.problem.id}`, (p) => {
      p.assisted = [...p.assisted, s.problem.id];
    }),
  };
}
function finish(s: Session): Session {
  return {
    ...s,
    done: true,
    progress: once(s.progress, `${s.mode}:${s.problem.id}`, (p) => {
      if (s.mode === "learn") p.learn++;
      else if (s.mode === "predict") p.predict++;
      else if (s.helped || s.worked) {
        p.guided++;
        p.streak = 0;
      } else {
        const first = !p.mistakes.includes(s.problem.id);
        p.practice++;
        p.firstTry += Number(first);
        p.streak = first ? p.streak + 1 : 0;
        const old = p.byDigits[s.problem.digits];
        p.byDigits = {
          ...p.byDigits,
          [s.problem.digits]: {
            done: old.done + 1,
            first: old.first + Number(first),
          },
        };
      }
    }),
  };
}
export function reducer(s: Session, a: Action): Session {
  if (a.type === "reset") return session(a.problem, a.mode, s.progress);
  if (a.type === "clear") return { ...s, progress: emptyProgress() };
  if (a.type === "select" || a.type === "answer")
    return s.done || s.checked
      ? s
      : { ...s, [a.type === "select" ? "selected" : "answer"]: a.value };
  if (!("id" in a) || a.id !== s.problem.id || a.step !== s.step || s.done)
    return s;
  if (a.type === "hint")
    return { ...assist(s), feedback: s.problem.steps[0].hint, good: false };
  if (a.type === "worked")
    return { ...assist(s), worked: true, step: 0, feedback: "" };
  if (a.type === "check-answer") {
    if (s.mode !== "practice" || s.worked) return s;
    const answer = parseAnswer(s.answer);
    if (answer === null)
      return {
        ...s,
        good: false,
        feedback: "Enter a whole number. Commas such as 12,345 are welcome.",
      };
    if (answer === s.problem.answer)
      return finish({
        ...s,
        feedback: "You found the product. Nicely done!",
        good: true,
      });
    return {
      ...s,
      feedback:
        "Keep going. Check your carries, place-value zeros, and final addition. Try again when you’re ready.",
      good: false,
      progress: once(s.progress, `mistake:${s.problem.id}`, (p) => {
        p.mistakes = [...p.mistakes, s.problem.id];
      }),
    };
  }
  const current = s.problem.steps[s.step];
  if (!current) return s;
  if (a.type === "check-step" || a.type === "show-step") {
    if (
      s.mode !== "predict" ||
      s.checked ||
      (!s.selected && a.type === "check-step")
    )
      return s;
    const correct = a.type === "check-step" && s.selected === current.answer;
    let next = {
      ...s,
      progress: once(s.progress, `decision:${s.problem.id}:${s.step}`, (p) => {
        p.decisions++;
        p.firstChoice += Number(correct);
      }),
    };
    if (correct || a.type === "show-step") next = assist(next);
    return {
      ...next,
      checked: correct || a.type === "show-step",
      good: correct || a.type === "show-step",
      feedback:
        correct || a.type === "show-step"
          ? current.explanation
          : `${current.choices.find((c) => c.value === s.selected)?.feedback ?? "Try again."} ${current.hint}`,
    };
  }
  if (a.type === "next") {
    if (
      (s.mode === "predict" && !s.checked) ||
      (s.mode === "practice" && !s.worked)
    )
      return s;
    const next = {
      ...assist(s),
      step: s.step + 1,
      selected: "",
      checked: false,
      feedback: "",
    };
    return next.step === s.problem.steps.length ? finish(next) : next;
  }
  return s;
}
