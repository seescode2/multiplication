import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { STORAGE_KEY } from "../progress";

vi.mock("../engine/problems", async (importOriginal) => {
  const original = await importOriginal<typeof import("../engine/problems")>();
  return {
    ...original,
    generateProblem: vi.fn((selection, difficulty, seed) =>
      original.makeProblem(
        selection === "mixed" ? "addition" : selection,
        difficulty,
        { a: 3, b: 5, c: { n: 20, d: 1 }, denominator: 12 },
        String(seed),
      ),
    ),
  };
});
beforeEach(() => {
  localStorage.clear();
});
describe("complete learning interface", () => {
  it("learns one line at a time, keeps the history, and reveals three real-life connections only on completion", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(
      screen.queryByRole("heading", {
        name: "Where Does This Equation Show Up in Real Life?",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Worked solution" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show Next Step" }));
    expect(
      within(
        screen.getByRole("region", { name: "Worked solution" }),
      ).getAllByRole("heading"),
    ).toHaveLength(1);
    for (let i = 0; i < 3; i++)
      await user.click(screen.getByRole("button", { name: "Show Next Step" }));
    expect(
      screen.getByRole("heading", {
        name: "Where Does This Equation Show Up in Real Life?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("How Does This Become an Equation?"),
    ).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "Start Over" }));
    expect(
      screen.queryByRole("region", { name: "Worked solution" }),
    ).not.toBeInTheDocument();
  });
  it("supports independent practice by Enter, retries, persistence, and clean control resets", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("tab", { name: /Practice/ }));
    await user.type(screen.getByLabelText("What is x?"), "99{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Keep going");
    expect(
      screen.queryByRole("heading", {
        name: "Where Does This Equation Show Up in Real Life?",
      }),
    ).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText("What is x?"));
    await user.type(screen.getByLabelText("What is x?"), "5{Enter}");
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.practice).toBe(1);
    expect(saved.firstTry).toBe(0);
    await user.click(screen.getByRole("button", { name: "Next Problem" }));
    expect(screen.getByLabelText("What is x?")).toHaveValue("");
    await user.selectOptions(
      screen.getByLabelText("Difficulty"),
      "intermediate",
    );
    expect(screen.getByLabelText("What is x?")).toHaveValue("");
    await user.selectOptions(
      screen.getByLabelText("Equation Type"),
      "addition",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Addition / Subtraction",
    );
    await user.click(screen.getByRole("tab", { name: /Learn/ }));
    expect(
      screen.getByRole("button", { name: "Show Next Step" }),
    ).toBeInTheDocument();
  });
  it("predicts dynamically, gives legal-operation feedback, and requires Continue", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("tab", { name: /Predict/ }));
    const check = screen.getByRole("button", { name: "Check My Step" });
    expect(check).toBeDisabled();
    await user.click(
      screen.getByRole("radio", { name: /Divide both sides by 3/ }),
    );
    await user.click(check);
    expect(screen.getByRole("status")).toHaveTextContent("keeps equality");
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    await user.click(
      screen.getByRole("radio", { name: /Subtract 5 from both sides/ }),
    );
    await user.click(check);
    expect(
      screen.queryByRole("button", { name: "Check My Step" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByRole("heading", {
        name: "Which equation is the correct simplification?",
      }),
    ).toBeInTheDocument();
    const choices = screen.getAllByRole("radio");
    expect(choices).toHaveLength(4);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).decisions).toBe(1);
  });
  it("keyboard navigation switches the mode and resets its interaction", () => {
    render(<App />);
    const learn = screen.getByRole("tab", { name: /Learn/ });
    learn.focus();
    fireEvent.keyDown(learn, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Predict/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
