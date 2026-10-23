import { equal, parseAnswer } from "./engine/rational";
import type { Problem } from "./engine/problems";
import { emptyProgress, recordProgress, type Progress } from "./progress";

export type Mode = "learn" | "predict" | "practice";
export interface Session {
  problem: Problem;
  mode: Mode;
  revealed: number;
  selected: string;
  checked: boolean;
  feedback: string;
  tone: "good" | "hint" | "error";
  answer: string;
  attempts: number;
  helped: boolean;
  worked: boolean;
  complete: boolean;
  progress: Progress;
}
export const createSession = (
  problem: Problem,
  mode: Mode,
  progress: Progress,
): Session => ({
  problem,
  mode,
  progress,
  revealed: 0,
  selected: "",
  checked: false,
  feedback: "",
  tone: "hint",
  answer: "",
  attempts: 0,
  helped: progress.assisted.includes(problem.id),
  worked: false,
  complete: false,
});
export type Action =
  | { type: "reset"; problem: Problem; mode: Mode }
  | { type: "clear-progress" }
  | { type: "select"; value: string }
  | { type: "answer"; value: string }
  | {
      type:
        | "reveal"
        | "check-step"
        | "continue"
        | "show-step"
        | "check-answer"
        | "hint"
        | "worked";
      position: number;
      problemId: string;
    };
function complete(s: Session): Session {
  const event =
    s.mode === "practice"
      ? {
          kind: "practice" as const,
          problemId: s.problem.id,
          family: s.problem.family,
          firstTry:
            s.attempts === 1 &&
            !s.helped &&
            !s.progress.mistakes.includes(s.problem.id),
          guided: s.worked || s.helped,
        }
      : { kind: s.mode, problemId: s.problem.id };
  return { ...s, complete: true, progress: recordProgress(s.progress, event) };
}
export function sessionReducer(s: Session, action: Action): Session {
  if (action.type === "reset")
    return createSession(action.problem, action.mode, s.progress);
  if (action.type === "clear-progress")
    return { ...s, progress: emptyProgress() };
  if (action.type === "answer")
    return s.complete ? s : { ...s, answer: action.value };
  if (action.type === "select")
    return s.checked || s.complete ? s : { ...s, selected: action.value };
  if (
    action.problemId !== s.problem.id ||
    action.position !== s.revealed ||
    s.complete
  )
    return s;
  const step = s.problem.steps[s.revealed];
  if (action.type === "hint")
    return {
      ...s,
      helped: true,
      progress: recordProgress(s.progress, {
        kind: "assist",
        problemId: s.problem.id,
      }),
      feedback: s.problem.steps[0].hint,
      tone: "hint",
    };
  if (action.type === "worked")
    return {
      ...s,
      helped: true,
      worked: true,
      progress: recordProgress(s.progress, {
        kind: "assist",
        problemId: s.problem.id,
      }),
      feedback: "",
      revealed: 0,
    };
  if (action.type === "check-answer") {
    if (s.mode !== "practice" || s.worked) return s;
    const parsed = parseAnswer(s.answer);
    if (!parsed)
      return {
        ...s,
        feedback:
          "Enter a number, decimal, or fraction such as 3/4. A denominator cannot be zero.",
        tone: "error",
      };
    const next = { ...s, attempts: s.attempts + 1 };
    if (equal(parsed, s.problem.solution))
      return complete({
        ...next,
        feedback: "You found x. Nicely done!",
        tone: "good",
      });
    return {
      ...next,
      progress: recordProgress(s.progress, {
        kind: "mistake",
        problemId: s.problem.id,
      }),
      feedback:
        "Keep going. Try substituting your answer into the original equation to check both sides.",
      tone: "hint",
    };
  }
  if (action.type === "check-step" || action.type === "show-step") {
    if (s.mode !== "predict" || s.checked || !step) return s;
    const choice = step.choices.find((c) => c.id === s.selected);
    if (action.type === "check-step" && !choice) return s;
    const correct =
      action.type === "check-step" && choice?.classification === "preferred";
    const accepted = correct || action.type === "show-step";
    let progress = recordProgress(s.progress, {
      kind: "decision",
      problemId: s.problem.id,
      step: s.revealed,
      correct: !!correct,
    });
    if (accepted)
      progress = recordProgress(progress, {
        kind: "assist",
        problemId: s.problem.id,
      });
    return {
      ...s,
      progress,
      checked: !!accepted,
      feedback: accepted
        ? `${action.type === "show-step" ? "Let’s work through this step. " : "That’s the next useful step. "}${step.explanation}`
        : choice!.feedback,
      tone: accepted ? "good" : "hint",
    };
  }
  if (action.type === "continue" || action.type === "reveal") {
    if (
      !step ||
      (s.mode === "predict" && (!s.checked || action.type !== "continue")) ||
      (s.mode === "practice" && !s.worked)
    )
      return s;
    const next = {
      ...s,
      revealed: s.revealed + 1,
      checked: false,
      selected: "",
      feedback: "",
      progress: recordProgress(s.progress, {
        kind: "assist",
        problemId: s.problem.id,
      }),
    };
    return next.revealed === s.problem.steps.length ? complete(next) : next;
  }
  return s;
}
