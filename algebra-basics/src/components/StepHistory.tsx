import { Check } from "lucide-react";
import { equationTex } from "../engine/expressions";
import type { Problem } from "../engine/problems";
import { MathText } from "./Math";

export function StepHistory({
  problem,
  count,
}: {
  problem: Problem;
  count: number;
}) {
  if (!count) return null;
  return (
    <section
      className="history"
      aria-label="Worked solution"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="section-label">
        YOUR WORKING{" "}
        <span>
          {count} of {problem.steps.length} steps
        </span>
      </div>
      <div className="history-original">
        <span className="step-marker">0</span>
        <div>
          <small>Start with the equation</small>
          <MathText value={equationTex(problem.equation)} />
        </div>
      </div>
      {problem.steps.slice(0, count).map((step, index) => (
        <div
          className={`history-step ${index === count - 1 ? "newest" : ""}`}
          key={index}
        >
          <span className="step-marker">
            {index === count - 1 ? (
              <Check size={13} aria-hidden="true" />
            ) : (
              index + 1
            )}
          </span>
          <div>
            <h3>{step.title}</h3>
            <MathText value={equationTex(step.result)} />
            <p>{step.explanation}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
