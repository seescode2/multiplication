import { BarChart3, ChevronDown, Flame, RotateCcw, Sprout } from "lucide-react";
import { families, familyNames } from "../engine/problems";
import { percent, type Progress } from "../progress";

export function ProgressPanel({
  progress: p,
  onReset,
}: {
  progress: Progress;
  onReset: () => void;
}) {
  return (
    <aside className="sidebar">
      <section className="progress-card" aria-labelledby="progress-title">
        <div className="card-title">
          <BarChart3 size={18} />
          <h2 id="progress-title">Your progress</h2>
          <span
            className="saved-dot"
            title="Progress is stored in this browser"
          />
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
          <Flame size={17} aria-hidden="true" />
          <span>Current first-try streak</span>
          <strong>{p.streak}</strong>
        </div>
        <details className="type-stats">
          <summary>
            Accuracy by equation type <ChevronDown size={15} />
          </summary>
          {families.map((f) => (
            <div className="type-stat" key={f}>
              <span>{familyNames[f]}</span>
              <strong>
                {percent(p.byType[f].firstTry, p.byType[f].completed)}
              </strong>
            </div>
          ))}
          <p className="small muted">
            First-try correct ÷ independent completions. Retried answers count
            as completed, but not first-try correct.
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
          Hints and worked solutions count as guided practice. Watching a
          solution is learning, not independent mastery.
        </p>
        <button className="text-button reset-progress" onClick={onReset}>
          <RotateCcw size={13} />
          Reset progress
        </button>
      </section>
      <section className="growth-note">
        <Sprout size={22} aria-hidden="true" />
        <div>
          <h3>Understanding before speed.</h3>
          <p>
            Take your time. The goal is a method you can trust, one step at a
            time.
          </p>
        </div>
      </section>
    </aside>
  );
}
