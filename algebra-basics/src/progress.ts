import { families, type Family } from "./engine/problems";

export const STORAGE_KEY = "algebra-lab-progress-v1";
export interface Progress {
  version: 1;
  seen: string[];
  assisted: string[];
  mistakes: string[];
  learn: number;
  guided: number;
  practice: number;
  firstTry: number;
  streak: number;
  byType: Record<Family, { completed: number; firstTry: number }>;
  predict: number;
  decisions: number;
  firstChoice: number;
}
export const emptyProgress = (): Progress => ({
  version: 1,
  seen: [],
  assisted: [],
  mistakes: [],
  learn: 0,
  guided: 0,
  practice: 0,
  firstTry: 0,
  streak: 0,
  byType: Object.fromEntries(
    families.map((f) => [f, { completed: 0, firstTry: 0 }]),
  ) as Progress["byType"],
  predict: 0,
  decisions: 0,
  firstChoice: 0,
});
export type ProgressEvent =
  | { kind: "learn" | "predict" | "assist" | "mistake"; problemId: string }
  | { kind: "decision"; problemId: string; step: number; correct: boolean }
  | {
      kind: "practice";
      problemId: string;
      family: Family;
      firstTry: boolean;
      guided: boolean;
    };
export function recordProgress(
  progress: Progress,
  event: ProgressEvent,
): Progress {
  const key = `${event.kind}:${event.problemId}${event.kind === "decision" ? `:${event.step}` : ""}`;
  if (progress.seen.includes(key)) return progress;
  const next = { ...progress, seen: [...progress.seen, key] };
  if (event.kind === "assist")
    next.assisted = [...progress.assisted, event.problemId];
  else if (event.kind === "mistake")
    next.mistakes = [...progress.mistakes, event.problemId];
  else if (event.kind === "learn") next.learn++;
  else if (event.kind === "predict") next.predict++;
  else if (event.kind === "decision") {
    next.decisions++;
    if (event.correct) next.firstChoice++;
  } else if (event.kind === "practice") {
    if (event.guided) {
      next.guided++;
      next.streak = 0;
    } else {
      next.practice++;
      if (event.firstTry) next.firstTry++;
      next.streak = event.firstTry ? next.streak + 1 : 0;
      const old = next.byType[event.family];
      next.byType = {
        ...next.byType,
        [event.family]: {
          completed: old.completed + 1,
          firstTry: old.firstTry + Number(event.firstTry),
        },
      };
    }
  }
  return next;
}
const count = (v: unknown) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
export function loadProgress(): Progress {
  try {
    const p = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    ) as Progress | null;
    if (
      !p ||
      p.version !== 1 ||
      !Array.isArray(p.seen) ||
      !p.seen.every((x) => typeof x === "string")
    )
      return emptyProgress();
    if (
      !Array.isArray(p.assisted) ||
      !p.assisted.every((x) => typeof x === "string")
    )
      return emptyProgress();
    if (
      !Array.isArray(p.mistakes) ||
      !p.mistakes.every((x) => typeof x === "string")
    )
      return emptyProgress();
    if (
      ![
        p.learn,
        p.guided,
        p.practice,
        p.firstTry,
        p.streak,
        p.predict,
        p.decisions,
        p.firstChoice,
      ].every(count)
    )
      return emptyProgress();
    if (
      p.firstTry > p.practice ||
      p.streak > p.practice ||
      p.firstChoice > p.decisions
    )
      return emptyProgress();
    if (
      !families.every(
        (f) =>
          p.byType?.[f] &&
          count(p.byType[f].completed) &&
          count(p.byType[f].firstTry) &&
          p.byType[f].firstTry <= p.byType[f].completed,
      )
    )
      return emptyProgress();
    return p;
  } catch {
    return emptyProgress();
  }
}
export const percent = (correct: number, total: number) =>
  total ? `${Math.round((correct / total) * 100)}%` : "—";
