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
  const snapshot = count
    ? problem.steps[count - 1].snapshot
    : initialSnapshot();
  const cellRow = (value: string, kind: string, focus?: number) => (
    <div className={`digit-row ${kind}`} aria-hidden="true">
      {value
        .padStart(8, " ")
        .split("")
        .map((digit, i) => (
          <span key={i} className={focus === 7 - i ? "focused-digit" : ""}>
            {digit === " " ? "\u00a0" : digit}
          </span>
        ))}
    </div>
  );
  return (
    <div
      className="long-board"
      aria-label={`Long multiplication: ${problem.top} times ${problem.bottom}`}
    >
      <span className="board-label">
        {solved ? "YOUR COMPLETED WORK" : "YOUR MULTIPLICATION"}
      </span>
      <div className="written-math">
        <div className="board-line carry-line">
          <span className="row-label">
            {snapshot.carry && !snapshot.adding ? "carry" : ""}
          </span>
          <div className="digit-row">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i}>
                {!snapshot.adding &&
                snapshot.carry &&
                snapshot.carryColumn === 7 - i
                  ? snapshot.carry
                  : "\u00a0"}
              </span>
            ))}
          </div>
        </div>
        <div className="board-line">
          <span className="row-label">top</span>
          {cellRow(String(problem.top), "operand", highlight?.topColumn)}
        </div>
        <div className="board-line bottom-line">
          <span className="row-label">×</span>
          {cellRow(String(problem.bottom), "operand", highlight?.bottomColumn)}
        </div>
        {snapshot.rows.map((row, i) => (
          <div className="board-line partial-line" key={i}>
            <span className="row-label">
              {snapshot.rows.length > 1 &&
              i === snapshot.rows.length - 1 &&
              snapshot.active === null
                ? "+"
                : `row ${i + 1}`}
            </span>
            {cellRow(row, "partial")}
          </div>
        ))}
        {snapshot.active !== null && (
          <div className="board-line working-line">
            <span className="row-label">working</span>
            {cellRow(snapshot.active || "·", "working")}
          </div>
        )}
        {snapshot.adding && snapshot.carry > 0 && (
          <div className="board-line sum-carry">
            <span className="row-label">carry</span>
            <div className="digit-row">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i}>
                  {snapshot.carryColumn === 7 - i ? snapshot.carry : "\u00a0"}
                </span>
              ))}
            </div>
          </div>
        )}
        {snapshot.result && (
          <div className="board-line result-line">
            <span className="row-label">total</span>
            {cellRow(snapshot.result, "result")}
          </div>
        )}
      </div>
      <span className="board-footnote">
        Right to left<span>·</span>One place at a time
      </span>
      <div className="sr-only">
        {snapshot.rows.map((r, i) => (
          <p key={i}>
            Partial product {i + 1}: {r}
          </p>
        ))}
        {snapshot.active !== null && (
          <p>Current row: {snapshot.active || "not started"}</p>
        )}
        {snapshot.carry > 0 && (
          <p>Carry {snapshot.carry} to the next column.</p>
        )}
        {snapshot.result && (
          <p>
            {solved ? "Final product" : "Sum so far"}: {snapshot.result}
          </p>
        )}
      </div>
    </div>
  );
}
