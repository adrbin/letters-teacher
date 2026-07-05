import { describe, expect, it } from "vitest";
import { getLetters } from "../data/letters";
import { generateQuestions } from "./questionGenerator";

describe("generateQuestions", () => {
  it("creates deterministic questions", () => {
    const first = generateQuestions("pl", "letters", 5, "seed").map((question) => question.id);
    const second = generateQuestions("pl", "letters", 5, "seed").map((question) => question.id);

    expect(first).toEqual(second);
  });

  it("uses different target orders for different seeds", () => {
    const first = generateQuestions("pl", "letters", 10, "first-seed").map((question) => question.target.display);
    const second = generateQuestions("pl", "letters", 10, "second-seed").map((question) => question.target.display);

    expect(first).not.toEqual(second);
  });

  it("does not repeat target letters within a quiz", () => {
    const targetDisplays = generateQuestions("pl", "letters", 30, "seed").map((question) => question.target.display);

    expect(new Set(targetDisplays).size).toBe(targetDisplays.length);
  });

  it("caps generated questions at the language alphabet size", () => {
    const targetDisplays = generateQuestions("en", "letters", 30, "seed").map((question) => question.target.display);

    expect(targetDisplays).toHaveLength(26);
    expect(new Set(targetDisplays).size).toBe(26);
  });

  it("keeps each option set unique and includes the target", () => {
    const questions = generateQuestions("en", "letters", 10, "seed");

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

  it("caps generated digit questions at the digit count", () => {
    const targetDisplays = generateQuestions("en", "digits", 30, "seed").map((question) => question.target.display);

    expect(targetDisplays).toHaveLength(10);
    expect(new Set(targetDisplays).size).toBe(10);
    expect(targetDisplays).toEqual(expect.arrayContaining(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]));
  });

  it("keeps letter and digit question ids separate", () => {
    const letterQuestion = generateQuestions("en", "letters", 1, "seed")[0];
    const digitQuestion = generateQuestions("en", "digits", 1, "seed")[0];

    expect(letterQuestion.id).toContain("letters");
    expect(digitQuestion.id).toContain("digits");
    expect(letterQuestion.id).not.toBe(digitQuestion.id);
  });

  it("caps generated word questions at the word count", () => {
    const targetDisplays = generateQuestions("en", "words", 50, "seed").map((question) => question.target.display);

    expect(targetDisplays).toHaveLength(36);
    expect(new Set(targetDisplays).size).toBe(36);
    expect(targetDisplays).toEqual(expect.arrayContaining(["mom", "dad", "cake"]));
  });

  it("keeps word question ids separate from letters and digits", () => {
    const letterQuestion = generateQuestions("en", "letters", 1, "seed")[0];
    const digitQuestion = generateQuestions("en", "digits", 1, "seed")[0];
    const wordQuestion = generateQuestions("en", "words", 1, "seed")[0];

    expect(wordQuestion.id).toContain("words");
    expect(wordQuestion.id).not.toBe(letterQuestion.id);
    expect(wordQuestion.id).not.toBe(digitQuestion.id);
  });
});
