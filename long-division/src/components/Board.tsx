import { initialSnapshot, type Problem, type Step } from "../engine";
export function Board({
  problem,
  count,
  highlight,
  solved = false,
}: {
  problem: Problem;
  count: number;
  highlight?: Step;
  solved?: boolean;
}) {
  const s = count ? problem.steps[count - 1].snapshot : initialSnapshot(),
    offset = 4 - String(problem.dividend).length;
  const digits = (text: string, end = 3) =>
    Array.from({ length: 4 }, (_, i) => {
      const start = end - text.length + 1;
      return i >= start && i <= end ? text[i - start] : "";
    });
  const row = (values: string[], kind: string, focus?: number) => (
    <div className={`division-digit-row ${kind}`} aria-hidden="true">
      {values.map((value, i) => (
        <span key={i} className={focus === i ? "focused-digit" : ""}>
          {value || "\u00a0"}
        </span>
      ))}
    </div>
  );
  return (
    <div
      className="division-board"
      aria-label={`Long division: ${problem.dividend} divided by ${problem.divisor}`}
    >
      <span className="board-label">
        {solved ? "YOUR COMPLETED DIVISION" : "YOUR DIVISION"}
      </span>
      <div className="division-written">
        <div className="division-line">
          <span className="divisor-space" />
          {row(s.quotient, "quotient-digits")}
        </div>
        <div className="division-line dividend-line">
          <span className="divisor-number" aria-hidden="true">
            {problem.divisor}
          </span>
          {row(
            digits(String(problem.dividend)),
            "dividend-digits",
            highlight?.column,
          )}
        </div>
        {s.rows.map((r, i) => (
          <div
            key={i}
            className={`division-line ${r.kind === "product" ? "product-line" : "difference-line"}`}
          >
            <span className="divisor-space">
              {r.kind === "product" ? "−" : ""}
            </span>
            {row(digits(r.text, r.end), r.kind)}
          </div>
        ))}
      </div>
      {s.group !== null && (
        <span className="current-group">
          Current group: <strong>{s.group}</strong>
          {s.remainder !== null && (
            <>
              {" "}
              · Remainder: <strong>{s.remainder}</strong>
            </>
          )}
        </span>
      )}
      <span className="board-footnote">
        Left to right<span>·</span>Divide · Multiply · Subtract · Bring down
      </span>
      <div className="sr-only">
        Dividend: {problem.dividend}. Divisor: {problem.divisor}.
        {s.quotient.some(Boolean) && (
          <p>
            Quotient so far: {s.quotient.join("")}. Each digit is aligned above
            its dividend column.
          </p>
        )}
        {s.rows.map((r, i) => (
          <p key={i}>
            {r.kind === "product" ? "Subtract" : "Left over or brought down"}:{" "}
            {r.text}, aligned with dividend column {r.end - offset + 1}.
          </p>
        ))}
        {s.remainder !== null && <p>Final remainder: {s.remainder}.</p>}
      </div>
    </div>
  );
}
