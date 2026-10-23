import { useEffect, useReducer, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Equal,
  Lightbulb,
  PencilLine,
  RefreshCw,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
} from "lucide-react";
import {
  generateProblem,
  familyNames,
  families,
  type Selection,
  type Difficulty,
  type Problem,
} from "./engine/problems";
import { equationTex } from "./engine/expressions";
import { tex } from "./engine/rational";
import {
  createSession,
  sessionReducer,
  type Mode,
  type Action,
} from "./session";
import { loadProgress, STORAGE_KEY } from "./progress";
import { MathText } from "./components/Math";
import { StepHistory } from "./components/StepHistory";
import { Connections } from "./components/Connections";
import { ProgressPanel } from "./components/ProgressPanel";

const modes = {
  learn: {
    label: "Learn",
    Icon: BookOpen,
    title: "See the method, step by step.",
    description: "Watch how a balanced equation becomes a simple answer.",
    action: "Watch the algorithm",
  },
  predict: {
    label: "Predict",
    Icon: Target,
    title: "Your turn to choose the next move.",
    description:
      "Think about what will bring x one step closer to standing alone.",
    action: "Choose the next step",
  },
  practice: {
    label: "Practice",
    Icon: PencilLine,
    title: "A little paper. A little practice.",
    description:
      "Work it out on paper, then check your answer here. Take your time.",
    action: "Solve independently",
  },
};
function fresh(type: Selection, difficulty: Difficulty, previous?: Problem) {
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  return {
    ...generateProblem(type, difficulty, seed, previous?.signature),
    id: crypto.randomUUID(),
  };
}
export default function App() {
  const [selection, setSelection] = useState<Selection>("two-step");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [s, dispatch] = useReducer(sessionReducer, undefined, () =>
    createSession(fresh("two-step", "beginner"), "learn", loadProgress()),
  );
  const [storageFailed, setStorageFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const { problem, mode } = s;
  const info = modes[mode];
  const currentStep = problem.steps[s.revealed];
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s.progress));
      setStorageFailed(false);
    } catch {
      setStorageFailed(true);
    }
  }, [s.progress]);
  const act = (
    type: Exclude<
      Action["type"],
      "reset" | "clear-progress" | "select" | "answer"
    >,
  ) => dispatch({ type, position: s.revealed, problemId: problem.id });
  const newProblem = (type = selection, level = difficulty) =>
    dispatch({ type: "reset", problem: fresh(type, level, problem), mode });
  const switchMode = (next: Mode) =>
    dispatch({ type: "reset", problem, mode: next });
  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();
    act("check-answer");
  };
  const workedCount = s.complete
    ? problem.steps.length
    : s.revealed + (mode === "predict" && s.checked ? 1 : 0);
  const displayedEquation =
    mode === "predict" && s.revealed > 0
      ? problem.steps[s.revealed - 1].result
      : problem.equation;
  const modeKeys = Object.keys(modes) as Mode[];
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="./" aria-label="Algebra Lab home">
          <span className="brand-icon">
            <Equal size={24} />
          </span>
          <span>
            Algebra<span className="brand-light">Lab</span>
            <span className="brand-period">.</span>
          </span>
        </a>
        <div className="header-note">
          <span className="status-dot" />A small practice. A lasting skill.
        </div>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">
              <span />A SPACE TO FIGURE THINGS OUT
            </p>
            <h1>
              Small steps.
              <br className="mobile-break" /> <span>Stronger algebra.</span>
            </h1>
            <p>Learn the steps. Master the method. Make it your own.</p>
          </div>
          <div className="intro-sketch" aria-hidden="true">
            <span className="sketch-caption">
              a little balance goes a long way
            </span>
            <div>
              <span className="sketch-x">x</span>
              <Equal size={25} />
              <span className="sketch-check">
                <Check size={26} />
              </span>
            </div>
            <span className="sketch-line" />
          </div>
        </section>
        <section className="workspace-controls" aria-label="Learning controls">
          <div className="select-group">
            <label htmlFor="equation-type">Equation Type</label>
            <select
              id="equation-type"
              value={selection}
              onChange={(e) => {
                const next = e.target.value as Selection;
                setSelection(next);
                newProblem(next);
              }}
            >
              {families.map((f) => (
                <option key={f} value={f}>
                  {familyNames[f]}
                </option>
              ))}
              <option value="mixed">Mixed Practice</option>
            </select>
          </div>
          <div className="select-group difficulty-select">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => {
                const next = e.target.value as Difficulty;
                setDifficulty(next);
                newProblem(selection, next);
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </div>
          <div className="controls-note">
            <Scale size={17} />
            <span>Same rules. Every equation.</span>
          </div>
        </section>
        <div className="workspace-grid">
          <div className="learning-column">
            <div
              className="mode-bar"
              role="tablist"
              aria-label="Learning mode"
              onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key))
                  return;
                e.preventDefault();
                const index = modeKeys.indexOf(mode),
                  next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : (index + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                switchMode(modeKeys[next]);
                document.getElementById(`tab-${modeKeys[next]}`)?.focus();
              }}
            >
              {modeKeys.map((key, i) => {
                const { Icon, label } = modes[key];
                return (
                  <button
                    role="tab"
                    id={`tab-${key}`}
                    aria-selected={mode === key}
                    aria-controls="learning-panel"
                    tabIndex={mode === key ? 0 : -1}
                    className={mode === key ? "active" : ""}
                    key={key}
                    onClick={() => switchMode(key)}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                    <small>0{i + 1}</small>
                  </button>
                );
              })}
            </div>
            <section
              id="learning-panel"
              className="learning-card"
              role="tabpanel"
              aria-labelledby={`tab-${mode}`}
            >
              <div className="lesson-header">
                <span className="lesson-label">
                  <info.Icon size={15} />
                  {info.action}
                </span>
                <span className="level-badge">{difficulty}</span>
              </div>
              <h2>{info.title}</h2>
              <p className="lesson-description">{info.description}</p>
              <div className="equation-board">
                <span className="board-label">
                  {mode === "predict" && s.revealed > 0
                    ? "CURRENT EQUATION"
                    : "YOUR EQUATION"}
                </span>
                <MathText value={equationTex(displayedEquation)} large />
                <span className="board-footnote">
                  {familyNames[problem.family]}
                  <span>·</span>Keep both sides equal
                </span>
              </div>
              {(mode === "learn" ||
                s.worked ||
                mode === "predict" ||
                s.complete) && (
                <StepHistory problem={problem} count={workedCount} />
              )}
              {mode === "predict" &&
                !s.complete &&
                !s.checked &&
                currentStep && (
                  <section
                    className="prediction"
                    aria-labelledby="prediction-title"
                  >
                    <div className="prediction-heading">
                      <h3 id="prediction-title">
                        {currentStep.kind === "operation"
                          ? "What should we do next?"
                          : currentStep.kind === "present"
                            ? "How can we write this with x on the left?"
                            : "Which equation is the correct simplification?"}
                      </h3>
                      <span>
                        Step {s.revealed + 1} / {problem.steps.length}
                      </span>
                    </div>
                    <fieldset>
                      <legend className="sr-only">
                        Choose the next{" "}
                        {currentStep.kind === "operation"
                          ? "operation"
                          : "equation"}
                      </legend>
                      {currentStep.choices.map((choice, i) => (
                        <label
                          className={`choice ${s.selected === choice.id ? "selected" : ""}`}
                          key={choice.id}
                        >
                          <input
                            type="radio"
                            name="prediction"
                            value={choice.id}
                            checked={s.selected === choice.id}
                            onChange={() =>
                              dispatch({ type: "select", value: choice.id })
                            }
                          />
                          <span className="choice-letter">{"ABCD"[i]}</span>
                          {choice.equation ? (
                            <MathText value={equationTex(choice.equation)} />
                          ) : (
                            <span>{choice.label}</span>
                          )}
                        </label>
                      ))}
                    </fieldset>
                  </section>
                )}
              {mode === "practice" && !s.worked && !s.complete && (
                <form className="answer-form" onSubmit={submitAnswer}>
                  <label htmlFor="answer">What is x?</label>
                  <div className="answer-row">
                    <span aria-hidden="true">x =</span>
                    <input
                      id="answer"
                      aria-describedby="answer-help"
                      type="text"
                      autoComplete="off"
                      placeholder="Your answer"
                      value={s.answer}
                      onChange={(e) =>
                        dispatch({ type: "answer", value: e.target.value })
                      }
                    />
                    <button
                      className="button primary"
                      type="submit"
                      disabled={!s.answer.trim()}
                    >
                      Check Answer <ArrowRight size={17} />
                    </button>
                  </div>
                  <p id="answer-help">
                    Whole numbers, decimals, and fractions like 3/4 are welcome.
                  </p>
                </form>
              )}
              {s.feedback && (
                <div className={`feedback ${s.tone}`} role="status">
                  {s.tone === "good" ? (
                    <Check size={18} />
                  ) : (
                    <Lightbulb size={18} />
                  )}
                  <p>{s.feedback}</p>
                </div>
              )}
              {!s.complete && (
                <div className="lesson-actions">
                  {(mode === "learn" || s.worked) && (
                    <button
                      className="button primary"
                      onClick={() => act("reveal")}
                    >
                      Show Next Step <ArrowRight size={17} />
                    </button>
                  )}
                  {mode === "predict" && (
                    <>
                      {s.checked ? (
                        <button
                          className="button primary"
                          onClick={() => act("continue")}
                        >
                          Continue <ArrowRight size={17} />
                        </button>
                      ) : (
                        <button
                          className="button primary"
                          disabled={!s.selected}
                          onClick={() => act("check-step")}
                        >
                          Check My Step <ArrowRight size={17} />
                        </button>
                      )}
                      {!s.checked && (
                        <button
                          className="text-button"
                          onClick={() => act("show-step")}
                        >
                          <CircleHelp size={15} />
                          Show Me This Step
                        </button>
                      )}
                    </>
                  )}
                  {mode === "practice" && !s.worked && (
                    <>
                      <button
                        className="text-button"
                        onClick={() => act("hint")}
                      >
                        <Lightbulb size={16} />
                        Show Hint
                      </button>
                      <button
                        className="text-button"
                        onClick={() => act("worked")}
                      >
                        <BookOpen size={16} />
                        Show Worked Solution
                      </button>
                    </>
                  )}
                  {(mode === "learn" || s.worked) && (
                    <span className="step-counter">One click. One step.</span>
                  )}
                </div>
              )}
              {s.complete && (
                <div className="completion" role="status">
                  <span className="completion-icon">
                    <Check size={22} />
                  </span>
                  <div>
                    <h3>
                      {mode === "predict"
                        ? "Great! You chose the steps that isolate x."
                        : mode === "practice" && !s.worked && !s.helped
                          ? "You solved it independently."
                          : "One equation. Every step understood."}
                    </h3>
                    <p>
                      {mode === "practice" && (s.worked || s.helped)
                        ? "Saved as guided practice. Try a fresh problem on your own next."
                        : mode === "learn"
                          ? "Now try predicting the steps, or solve one on your own."
                          : "The same method will work on your next equation, too."}
                    </p>
                    <MathText value={`x = ${tex(problem.solution)}`} />
                  </div>
                </div>
              )}
              <div className="problem-footer">
                <button
                  className="text-button"
                  onClick={() => dispatch({ type: "reset", problem, mode })}
                >
                  <RotateCcw size={15} />
                  Start Over
                </button>
                <button
                  className={`button ${s.complete ? "primary" : "secondary"}`}
                  onClick={() => newProblem()}
                >
                  {s.complete && mode === "practice"
                    ? "Next Problem"
                    : "New Problem"}
                  <RefreshCw size={15} />
                </button>
              </div>
            </section>
            <section className="principle">
              <span className="principle-icon">
                <Scale size={24} />
              </span>
              <div>
                <h3>Keep it balanced.</h3>
                <p>
                  Do the same thing to both sides. Use inverse operations to
                  leave x standing on its own.
                </p>
              </div>
              <span className="principle-tag">THE BIG IDEA</span>
            </section>
          </div>
          <ProgressPanel
            progress={s.progress}
            onReset={() => {
              resetButton.current = document.activeElement as HTMLButtonElement;
              dialog.current?.showModal();
            }}
          />
          {s.complete && <Connections problem={problem} />}
        </div>
        {!s.complete && (
          <div className="connection-teaser">
            <Sparkles size={17} />
            <span>
              First solve the equation. Then discover the stories behind it.
            </span>
            <ChevronRight size={16} />
          </div>
        )}
        {storageFailed && (
          <p role="alert" className="storage-warning">
            Progress cannot be saved in this browser. You can keep learning;
            progress will last only for this visit.
          </p>
        )}
      </main>
      <footer className="site-footer">
        <span>
          <Equal size={15} />A little clearer. A little more confident.
        </span>
        <span>No timers. No pressure. Just progress.</span>
      </footer>
      <dialog
        ref={dialog}
        className="reset-dialog"
        onClose={() => resetButton.current?.focus()}
      >
        <div>
          <span className="icon-tile">
            <RotateCcw size={23} />
          </span>
          <h2>Make a fresh start?</h2>
          <p>
            This clears Learn, Predict, and Practice progress saved in this
            browser. Your current equation will stay.
          </p>
          <div className="dialog-actions">
            <button
              className="button secondary"
              autoFocus
              onClick={() => dialog.current?.close()}
            >
              Keep my progress
            </button>
            <button
              className="button primary"
              onClick={() => {
                dispatch({ type: "clear-progress" });
                dialog.current?.close();
              }}
            >
              Reset progress
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
