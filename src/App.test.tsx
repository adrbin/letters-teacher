import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

Object.defineProperty(window, "speechSynthesis", {
  configurable: true,
  value: {
    cancel: vi.fn(),
    speak: vi.fn()
  }
});

describe("App", () => {
  it("updates setup settings and starts a game", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/language/i), "en");
    await user.click(screen.getByRole("button", { name: /hear letter, write it/i }));
    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(screen.getByRole("heading", { name: /draw the letter/i })).toBeInTheDocument();
  });

  it("keeps a child on the same question after a wrong card", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    const progress = screen.getByText("1 / 10");
    const cards = screen.getAllByRole("button", { name: /choose/i });
    await user.click(cards[0]);

    expect(progress).toBeInTheDocument();
  });
});
