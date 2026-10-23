import { ArrowUpRight, ChevronDown, Globe2 } from "lucide-react";
import type { Problem } from "../engine/problems";
import { storiesFor } from "../engine/stories";
import { MathText } from "./Math";

export function Connections({ problem }: { problem: Problem }) {
  return (
    <section className="connections" aria-labelledby="connections-title">
      <div className="connection-heading">
        <span className="icon-tile">
          <Globe2 size={21} />
        </span>
        <div>
          <p className="eyebrow">ONE EQUATION. DIFFERENT STORIES.</p>
          <h2 id="connections-title">
            Where Does This Equation Show Up in Real Life?
          </h2>
          <p>Different situations. The same method you just used.</p>
        </div>
      </div>
      <div className="story-grid">
        {storiesFor(problem).map((story, i) => (
          <article className="story" key={story.title}>
            <div className="story-top">
              <span>0{i + 1}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </div>
            <h3>{story.title}</h3>
            <p>{story.question}</p>
            <details>
              <summary>
                How Does This Become an Equation? <ChevronDown size={14} />
              </summary>
              <div className="story-explanation">
                <MathText value={problem.signature} />
                <p>{story.variable}</p>
                <p>{story.relationship}</p>
                <p>
                  <strong>{story.meaning}</strong>
                </p>
              </div>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}
