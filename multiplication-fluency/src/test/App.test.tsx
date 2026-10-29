import { beforeEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { KEY } from "../state";
vi.mock("../engine", async (importOriginal) => {
  const original = await importOriginal<typeof import("../engine")>();
  return {
    ...original,
    generateProblem: vi.fn((digits, seed) =>
      original.buildProblem(
        digits === 4 ? 1234 : digits === 3 ? 123 : 24,
        3,
        String(seed),
      ),
    ),
  };
});
beforeEach(() => localStorage.clear());
it("reveals one worked step at a time and keeps history", async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(screen.queryByText("Step history")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Show Next Step" }));
  expect(screen.getByText("1 steps revealed")).toBeInTheDocument();
  while (screen.queryByRole("button", { name: "Show Next Step" }))
    await user.click(screen.getByRole("button", { name: "Show Next Step" }));
  expect(
    screen.getByRole("heading", {
      name: "One product. Every step understood.",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "The same product, out in the world.",
    }),
  ).toBeInTheDocument();
});
it("predicts with retry feedback and requires Continue", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("tab", { name: /Predict/ }));
  expect(screen.getByRole("button", { name: "Check My Step" })).toBeDisabled();
  await user.click(screen.getByRole("radio", { name: /Write 2; carry 1/ }));
  await user.click(screen.getByRole("button", { name: "Check My Step" }));
  expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  expect(screen.queryAllByRole("radio")).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getAllByRole("radio")).toHaveLength(4);
});
it("Practice supports Enter, no early answer, persistence, and clean digit/mode resets", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("tab", { name: /Practice/ }));
  expect(screen.queryByText("Step history")).not.toBeInTheDocument();
  await user.type(screen.getByLabelText("What is the product?"), "99{Enter}");
  expect(screen.getByRole("status")).toHaveTextContent("Keep going");
  await user.clear(screen.getByLabelText("What is the product?"));
  await user.type(screen.getByLabelText("What is the product?"), "72{Enter}");
  expect(JSON.parse(localStorage.getItem(KEY)!).practice).toBe(1);
  expect(JSON.parse(localStorage.getItem(KEY)!).firstTry).toBe(0);
  await user.click(screen.getByRole("button", { name: "Next Problem" }));
  expect(screen.getByLabelText("What is the product?")).toHaveValue("");
  await user.selectOptions(screen.getByLabelText("Number of digits"), "4");
  expect(
    screen.getByText("The bottom number varies from 1 to 4 digits."),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("What is the product?")).toHaveValue("");
  await user.click(screen.getByRole("tab", { name: /Learn/ }));
  expect(
    screen.getByRole("button", { name: "Show Next Step" }),
  ).toBeInTheDocument();
});
