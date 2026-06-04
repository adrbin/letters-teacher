import { describe, expect, it } from "vitest";
import { getLetters } from "../data/letters";
import { generateQuestions } from "./questionGenerator";

describe("generateQuestions", () => {
  it("creates deterministic questions", () => {
    const first = generateQuestions("pl", 5, "seed").map((question) => question.id);
    const second = generateQuestions("pl", 5, "seed").map((question) => question.id);

    expect(first).toEqual(second);
  });

  it("keeps each option set unique and includes the target", () => {
    const questions = generateQuestions("en", 10, "seed");

    for (const question of questions) {
      const optionDisplays = question.options.map((option) => option.display);
      expect(new Set(optionDisplays).size).toBe(4);
      expect(optionDisplays).toContain(question.target.display);
    }
  });

  it("includes Polish diacritic letters", () => {
    const polishLetters = getLetters("pl").map((letter) => letter.display);

    expect(polishLetters).toEqual(expect.arrayContaining(["Ą", "Ć", "Ę", "Ł", "Ń", "Ó", "Ś", "Ź", "Ż"]));
  });
});
