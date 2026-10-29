import { beforeEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { KEY } from "../state";
vi.mock("../engine", async (importOriginal) => {
  const original = await importOriginal<typeof import("../engine")>();
  return {
    ...original,
    generateProblem: vi.fn((a, b, seed) =>
      original.buildProblem(
        a === 1 ? 7 : a === 2 ? 72 : a === 3 ? 725 : 1234,
        b === 1 ? 3 : b === 2 ? 12 : b === 3 ? 123 : 1234,
        String(seed),
      ),
    ),
  };
});
beforeEach(() => localStorage.clear());
it("labels both selectors with standard terms, and resets on either change", async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByLabelText("Dividend digits")).toHaveValue("3");
  expect(screen.getByLabelText("Divisor digits")).toHaveValue("1");
  await user.click(screen.getByRole("button", { name: "Show Next Step" }));
  expect(screen.getByText("1 steps revealed")).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText("Divisor digits"), "4");
  expect(screen.queryByText("Step history")).not.toBeInTheDocument();
  expect(
    screen.getByLabelText("Long division: 725 divided by 1234"),
  ).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText("Dividend digits"), "1");
  expect(
    screen.getByLabelText("Long division: 7 divided by 1234"),
  ).toBeInTheDocument();
});
it("Learn reveals one step at a time and finishes with the division check", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Show Next Step" }));
  expect(screen.getByText("1 steps revealed")).toBeInTheDocument();
  while (screen.queryByRole("button", { name: "Show Next Step" }))
    await user.click(screen.getByRole("button", { name: "Show Next Step" }));
  expect(
    screen.getByRole("heading", {
      name: "One division. Every step understood.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "Check it by building the dividend back.",
    }),
  ).toBeInTheDocument();
});
it("Predict gives retries and requires explicit Continue", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("tab", { name: /Predict/ }));
  expect(screen.getByRole("button", { name: "Check My Step" })).toBeDisabled();
  await user.click(screen.getByRole("radio", { name: /^[ABCD] 7$/ }));
  await user.click(screen.getByRole("button", { name: "Check My Step" }));
  expect(screen.queryAllByRole("radio")).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getAllByRole("radio")).toHaveLength(4);
});
it("Practice checks both quotient and remainder, Enter submits, and progress persists", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("tab", { name: /Practice/ }));
  expect(screen.queryByText("Step history")).not.toBeInTheDocument();
  await user.type(
    screen.getByLabelText("Quotient", { exact: true }),
    "241{Enter}",
  );
  expect(screen.getByRole("status")).toHaveTextContent("Keep going");
  await user.type(
    screen.getByLabelText("Remainder", { exact: true }),
    "2{Enter}",
  );
  expect(JSON.parse(localStorage.getItem(KEY)!).practice).toBe(1);
  expect(JSON.parse(localStorage.getItem(KEY)!).firstTry).toBe(0);
  await user.click(screen.getByRole("button", { name: "Next Problem" }));
  expect(screen.getByLabelText("Quotient", { exact: true })).toHaveValue("");
  expect(screen.getByLabelText("Remainder", { exact: true })).toHaveValue("");
});
