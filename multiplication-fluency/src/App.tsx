import { useEffect, useReducer, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleHelp,
  Equal,
  Flame,
  Lightbulb,
  PencilLine,
  RefreshCw,
  RotateCcw,
  Sprout,
  Target,
  X,
  Layers3,
  BarChart3,
} from "lucide-react";
import { generateProblem, type Digits, type Problem } from "./engine";
import { KEY, loadProgress, reducer, session, type Mode } from "./state";
import { Board } from "./components/Board";
import { MathText } from "./components/Math";
const modes = {
  learn: {
    name: "Learn",
    Icon: BookOpen,
    title: "See the method, digit by digit.",
    description: "Follow the carries, build each row, and add it all together.",
  },
  predict: {
    name: "Predict",
    Icon: Target,
    title: "Your turn to choose the next move.",
    description: "Think about the next digit, carry, or place-value shift.",
  },
  practice: {
    name: "Practice",
    Icon: PencilLine,
    title: "A little paper. A little practice.",
    description:
      "Work it out on paper, then check your product. Take your time.",
  },
};
const modeKeys = Object.keys(modes) as Mode[];
function fresh(digits: Digits, previous?: Problem) {
  const p = generateProblem(
    digits,
    crypto.getRandomValues(new Uint32Array(1))[0],
    previous,
  );
  return { ...p, id: crypto.randomUUID() };
}
const percent = (n: number, d: number) =>
  d ? `${Math.round((n / d) * 100)}%` : "—";
export default function App() {
  const [digits, setDigits] = useState<Digits>(2);
  const [s, dispatch] = useReducer(reducer, undefined, () =>
    session(fresh(2), "learn", loadProgress()),
  );
  const [storageError, setStorageError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    resetTrigger = useRef<HTMLButtonElement>(null);
  const { problem, mode, progress: p } = s,
    info = modes[mode],
    step = problem.steps[s.step];
  const count = s.done
    ? problem.steps.length
    : s.step + Number(mode === "predict" && s.checked);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [p]);
  const act = (
    type:
      | "next"
      | "check-step"
      | "show-step"
      | "check-answer"
      | "hint"
      | "worked",
  ) => dispatch({ type, id: problem.id, step: s.step });
  const reset = (problem: Problem, next = mode) =>
    dispatch({ type: "reset", problem, mode: next });
  const next = (d = digits) => reset(fresh(d, problem));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    act("check-answer");
  };
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="./">
          <span className="brand-icon">
            <X size={23} />
          </span>
          <span>
            Multiplication<span className="brand-light">Lab</span>
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
              Little digits.
              <br className="mobile-break" /> <span>Big possibilities.</span>
            </h1>
            <p>Learn the steps. Master the method. Make it your own.</p>
          </div>
          <div className="intro-sketch" aria-hidden="true">
            <span className="sketch-caption">small steps make big numbers</span>
            <div>
              <span className="sketch-x">×</span>
              <Equal size={25} />
              <span className="sketch-check">
                <Check size={26} />
              </span>
            </div>
            <span className="sketch-line" />
          </div>
        </section>
        <section className="workspace-controls" aria-label="Problem controls">
          <div className="select-group">
            <label htmlFor="digits">Number of digits</label>
            <select
              id="digits"
              value={digits}
              onChange={(e) => {
                const d = Number(e.target.value) as Digits;
                setDigits(d);
                next(d);
              }}
            >
              {([2, 3, 4] as Digits[]).map((d) => (
                <option key={d} value={d}>
                  {d} digits
                </option>
              ))}
            </select>
          </div>
          <div className="digit-explanation">
            <strong>{digits} digits on top. A little variety below.</strong>
            <span>The bottom number varies from 1 to {digits} digits.</span>
          </div>
        </section>
        <div className="workspace-grid">
          <div className="learning-column">
            <div
              role="tablist"
              className="mode-bar"
              aria-label="Learning mode"
              onKeyDown={(e) => {
                if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key))
                  return;
                e.preventDefault();
                const i = modeKeys.indexOf(mode),
                  n =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                reset(problem, modeKeys[n]);
                document.getElementById(`tab-${modeKeys[n]}`)?.focus();
              }}
            >
              {modeKeys.map((m, i) => {
                const Icon = modes[m].Icon;
                return (
                  <button
                    key={m}
                    id={`tab-${m}`}
                    role="tab"
                    aria-controls="learning-panel"
                    aria-selected={mode === m}
                    tabIndex={mode === m ? 0 : -1}
                    className={mode === m ? "active" : ""}
                    onClick={() => reset(problem, m)}
                  >
                    <Icon size={17} />
                    {modes[m].name}
                    <small>0{i + 1}</small>
                  </button>
                );
              })}
            </div>
            <section
              className="learning-card"
              id="learning-panel"
              role="tabpanel"
              aria-labelledby={`tab-${mode}`}
            >
              <div className="lesson-header">
                <span className="lesson-label">
                  <info.Icon size={15} />
                  {mode === "learn"
                    ? "WATCH THE ALGORITHM"
                    : mode === "predict"
                      ? "CHOOSE THE NEXT STEP"
                      : "SOLVE INDEPENDENTLY"}
                </span>
                <span className="level-badge">
                  {String(problem.top).length} × {String(problem.bottom).length}{" "}
                  digits
                </span>
              </div>
              <h2>{info.title}</h2>
              <p className="lesson-description">{info.description}</p>
              <Board
                problem={problem}
                count={mode === "practice" && !s.worked && !s.done ? 0 : count}
                highlight={
                  s.done || (mode === "practice" && !s.worked)
                    ? undefined
                    : step
                }
                solved={s.done}
              />
              {!s.done && (mode === "learn" || s.worked) && (
                <div className="up-next">
                  <span>
                    STEP {s.step + 1} OF {problem.steps.length}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.question}</p>
                </div>
              )}
              {mode === "predict" && !s.done && !s.checked && (
                <section className="prediction">
                  <div className="prediction-heading">
                    <h3>{step.question}</h3>
                    <span>
                      {s.step + 1} / {problem.steps.length}
                    </span>
                  </div>
                  <fieldset>
                    <legend className="sr-only">Choose the next step</legend>
                    {step.choices.map((choice, i) => (
                      <label
                        key={choice.value}
                        className={`choice ${s.selected === choice.value ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="prediction"
                          checked={s.selected === choice.value}
                          onChange={() =>
                            dispatch({ type: "select", value: choice.value })
                          }
                        />
                        <span className="choice-letter">{"ABCD"[i]}</span>
                        <span>{choice.value}</span>
                      </label>
                    ))}
                  </fieldset>
                </section>
              )}
              {mode === "practice" && !s.done && !s.worked && (
                <form className="answer-form" onSubmit={submit}>
                  <label htmlFor="answer">What is the product?</label>
                  <div className="answer-row">
                    <input
                      id="answer"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Your answer"
                      aria-describedby="answer-help"
                      value={s.answer}
                      onChange={(e) =>
                        dispatch({ type: "answer", value: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="button primary"
                      disabled={!s.answer.trim()}
                    >
                      Check Answer
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <p id="answer-help">
                    Enter a whole number, with or without commas. Press Enter to
                    check.
                  </p>
                </form>
              )}
              {s.feedback && (
                <div
                  className={`feedback ${s.good ? "good" : "hint"}`}
                  role="status"
                >
                  {s.good ? <Check size={18} /> : <Lightbulb size={18} />}
                  <p>{s.feedback}</p>
                </div>
              )}
              {!s.done && (
                <div className="lesson-actions">
                  {(mode === "learn" || s.worked) && (
                    <>
                      <button
                        className="button primary"
                        onClick={() => act("next")}
                      >
                        Show Next Step
                        <ArrowRight size={16} />
                      </button>
                      <span className="step-counter">One click. One step.</span>
                    </>
                  )}
                  {mode === "predict" &&
                    (s.checked ? (
                      <button
                        className="button primary"
                        onClick={() => act("next")}
                      >
                        Continue
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <>
                        <button
                          className="button primary"
                          disabled={!s.selected}
                          onClick={() => act("check-step")}
                        >
                          Check My Step
                          <ArrowRight size={16} />
                        </button>
                        <button
                          className="text-button"
                          onClick={() => act("show-step")}
                        >
                          <CircleHelp size={15} />
                          Show Me This Step
                        </button>
                      </>
                    ))}
                  {mode === "practice" && !s.worked && (
                    <>
                      <button
                        className="text-button"
                        onClick={() => act("hint")}
                      >
                        <Lightbulb size={15} />
                        Show Hint
                      </button>
                      <button
                        className="text-button"
                        onClick={() => act("worked")}
                      >
                        <BookOpen size={15} />
                        Show Worked Solution
                      </button>
                    </>
                  )}
                </div>
              )}
              {count > 0 && (
                <details className="working-history" open>
                  <summary>
                    Step history <span>{count} steps revealed</span>
                  </summary>
                  <ol>
                    {problem.steps.slice(0, count).map((st, i) => (
                      <li key={i} className={i === count - 1 ? "latest" : ""}>
                        <span>{i + 1}</span>
                        <div>
                          <h3>{st.title}</h3>
                          <p>{st.explanation}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
              {s.done && (
                <div className="completion" role="status">
                  <span className="completion-icon">
                    <Check size={22} />
                  </span>
                  <div>
                    <h3>
                      {mode === "predict"
                        ? "You predicted the path to the product."
                        : mode === "practice" && !s.helped
                          ? "You solved it independently."
                          : "One product. Every step understood."}
                    </h3>
                    <MathText
                      value={`${problem.top} \\times ${problem.bottom} = ${problem.answer}`}
                    />
                    <p>
                      {mode === "practice" && s.helped
                        ? "Saved as guided practice. Try a new problem on your own next."
                        : "The same method works with bigger numbers, too."}
                    </p>
                  </div>
                </div>
              )}
              <div className="problem-footer">
                <button className="text-button" onClick={() => reset(problem)}>
                  <RotateCcw size={15} />
                  Start Over
                </button>
                <button
                  className={`button ${s.done ? "primary" : "secondary"}`}
                  onClick={() => next()}
                >
                  {s.done ? "Next Problem" : "New Problem"}
                  <RefreshCw size={15} />
                </button>
              </div>
            </section>
            <section className="principle">
              <span className="principle-icon">
                <Layers3 size={25} />
              </span>
              <div>
                <h3>Every digit has a place.</h3>
                <p>
                  Multiply from right to left. Carry carefully. Shift each new
                  row one place left, then add the partial products.
                </p>
              </div>
              <span className="principle-tag">THE BIG IDEA</span>
            </section>
          </div>
          <aside className="sidebar">
            <section className="progress-card">
              <div className="card-title">
                <BarChart3 size={18} />
                <h2>Your progress</h2>
                <span className="saved-dot" />
              </div>
              <p className="muted small">A little practice adds up.</p>
              <div className="big-stat">
                <strong>{String(p.practice).padStart(2, "0")}</strong>
                <span>
                  independent problems
                  <br />
                  completed
                </span>
              </div>
              <div className="stat-pair">
                <div>
                  <strong>{p.firstTry}</strong>
                  <span>First-try correct</span>
                </div>
                <div>
                  <strong>{percent(p.firstTry, p.practice)}</strong>
                  <span>First-try accuracy</span>
                </div>
              </div>
              <div className="streak">
                <Flame size={17} />
                <span>Current first-try streak</span>
                <strong>{p.streak}</strong>
              </div>
              <details className="type-stats">
                <summary>Accuracy by top-number size</summary>
                {([2, 3, 4] as Digits[]).map((d) => (
                  <div className="type-stat" key={d}>
                    <span>{d}-digit problems</span>
                    <strong>
                      {percent(p.byDigits[d].first, p.byDigits[d].done)}
                    </strong>
                  </div>
                ))}
                <p className="small muted">
                  First-try correct divided by completed independent problems.
                </p>
              </details>
              <div className="predict-stats">
                <div>
                  <span>Predict problems completed</span>
                  <strong>{p.predict}</strong>
                </div>
                <div>
                  <span>Correct first-choice predictions</span>
                  <strong>{percent(p.firstChoice, p.decisions)}</strong>
                </div>
              </div>
              <div className="other-progress">
                <span>{p.learn} learned</span>
                <span>{p.guided} guided practice</span>
              </div>
              <p className="small muted">
                Hints and revealed steps are guided learning. For independent
                practice, try a fresh problem.
              </p>
              <button
                className="text-button reset-progress"
                onClick={() => {
                  resetTrigger.current =
                    document.activeElement as HTMLButtonElement;
                  dialog.current?.showModal();
                }}
              >
                <RotateCcw size={13} />
                Reset progress
              </button>
            </section>
            <section className="growth-note">
              <Sprout size={22} />
              <div>
                <h3>Understanding before speed.</h3>
                <p>There’s no timer. Find your rhythm, one column at a time.</p>
              </div>
            </section>
          </aside>
          {s.done && (
            <section className="connections">
              <div className="connection-heading">
                <span className="icon-tile">
                  <Layers3 size={22} />
                </span>
                <div>
                  <p className="eyebrow">SMALL GROUPS. BIG CONNECTIONS.</p>
                  <h2>The same product, out in the world.</h2>
                  <p>
                    You just found how much {problem.bottom} equal groups of{" "}
                    {problem.top} make.
                  </p>
                </div>
              </div>
              <div className="story-grid">
                {[
                  [
                    "At the library",
                    `A library receives ${problem.bottom} boxes with ${problem.top} books in each. How many books arrive?`,
                    "books",
                  ],
                  [
                    "A growing garden",
                    `A nursery plants ${problem.bottom} trays with ${problem.top} seeds in each. How many seeds is that?`,
                    "seeds",
                  ],
                  [
                    "On the page",
                    `A print shop makes ${problem.bottom} books of ${problem.top} pages each. How many pages does it print?`,
                    "pages",
                  ],
                ].map(([title, text, unit], i) => (
                  <article className="story" key={title}>
                    <div className="story-top">0{i + 1}</div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <details>
                      <summary>See the connection</summary>
                      <div className="story-explanation">
                        <p>
                          {problem.bottom} equal groups × {problem.top} {unit}{" "}
                          per group = {problem.answer.toLocaleString("en-US")}{" "}
                          {unit}.
                        </p>
                      </div>
                    </details>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
        {storageError && (
          <p className="storage-warning" role="alert">
            Progress cannot be saved in this browser. You can keep learning for
            this visit.
          </p>
        )}
      </main>
      <footer className="site-footer">
        <span>
          <X size={15} />A little clearer. A little more confident.
        </span>
        <span>No timers. No pressure. Just progress.</span>
      </footer>
      <dialog
        ref={dialog}
        className="reset-dialog"
        aria-labelledby="reset-title"
        onClose={() => resetTrigger.current?.focus()}
      >
        <h2 id="reset-title">Make a fresh start?</h2>
        <p>
          This clears multiplication progress in this browser. Your current
          problem stays.
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
              dispatch({ type: "clear" });
              dialog.current?.close();
            }}
          >
            Reset progress
          </button>
        </div>
      </dialog>
    </div>
  );
}
