import katex from "katex";
import { useMemo } from "react";

export function MathText({
  value,
  large = false,
}: {
  value: string;
  large?: boolean;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(value, {
        throwOnError: false,
        output: "htmlAndMathml",
        strict: "error",
      }),
    [value],
  );
  return (
    <span
      className={`math ${large ? "math-large" : ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
