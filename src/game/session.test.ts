import { describe, expect, it, vi } from "vitest";
import { advanceQuestion, answerQuestion, createSession, getResultGrade, remainingPoints, summarizeSession } from "./session";

describe("session", () => {
  it("reduces available points after wrong attempts", () => {
    expect(remainingPoints(0)).toBe(10);
    expect(remainingPoints(1)).toBe(7);
    expect(remainingPoints(2)).toBe(4);
    expect(remainingPoints(8)).toBe(1);
  });

  it("uses a fresh default seed for new sessions", () => {
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(1000);
    const randomSpy = vi.spyOn(Math, "random").mockReturnValueOnce(0.111).mockReturnValueOnce(0.999);

    const first = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 10 }).questions.map(
      (question) => question.id
    );
    const second = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 10 }).questions.map(
      (question) => question.id
    );

    expect(first).not.toEqual(second);

    randomSpy.mockRestore();
    dateSpy.mockRestore();
  });

  it("keeps explicit session seeds deterministic", () => {
    const first = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 10 }, "seed").questions.map(
      (question) => question.id
    );
    const second = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 10 }, "seed").questions.map(
      (question) => question.id
    );

    expect(first).toEqual(second);
  });

  it("does not advance after a wrong answer", () => {
    const session = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 3 }, "seed");
    const wrong = session.questions[0].options.find((option) => option.display !== session.questions[0].target.display)!;

    const next = answerQuestion(session, wrong.display);

    expect(next.result.correct).toBe(false);
    expect(next.state.currentIndex).toBe(0);
    expect(next.state.wrongAttempts).toHaveLength(1);
  });

  it("records a correct answer without advancing until confirmed", () => {
    let session = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 2 }, "seed");

    session = answerQuestion(session, session.questions[0].target.display).state;
    expect(session.currentIndex).toBe(0);
    expect(session.completed).toBe(false);
    expect(session.pendingResult?.correct).toBe(true);
    expect(session.results).toHaveLength(1);

    session = advanceQuestion(session);
    expect(session.currentIndex).toBe(1);
    expect(session.pendingResult).toBeNull();
  });

  it("finishes only after advancing from the final correct answer", () => {
    let session = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 2 }, "seed");

    session = advanceQuestion(answerQuestion(session, session.questions[0].target.display).state);
    session = answerQuestion(session, session.questions[1].target.display).state;
    expect(session.currentIndex).toBe(1);
    expect(session.completed).toBe(false);
    expect(session.pendingResult?.correct).toBe(true);
    expect(session.results).toHaveLength(2);

    session = advanceQuestion(session);
    expect(session.completed).toBe(true);
  });

  it("summarizes strong and practice letters", () => {
    let session = createSession({ language: "en", characterSet: "letters", gameMode: "hear-pick", questionCount: 2 }, "seed");
    const firstWrong = session.questions[0].options.find((option) => option.display !== session.questions[0].target.display)!;
    session = answerQuestion(session, firstWrong.display).state;
    session = answerQuestion(session, session.questions[0].target.display).state;
    session = advanceQuestion(session);
    session = answerQuestion(session, session.questions[1].target.display).state;

    const summary = summarizeSession(session);

    expect(summary.totalScore).toBe(17);
    expect(summary.maxScore).toBe(20);
    expect(summary.practiceLetters).toContain(session.results[0].letter);
    expect(summary.strongLetters).toContain(session.results[1].letter);
  });

  it("grades result accuracy with child-friendly bands", () => {
    expect(getResultGrade(49)).toBe("keep-practicing");
    expect(getResultGrade(50)).toBe("good");
    expect(getResultGrade(69)).toBe("good");
    expect(getResultGrade(70)).toBe("very-good");
    expect(getResultGrade(89)).toBe("very-good");
    expect(getResultGrade(90)).toBe("almost-perfect");
    expect(getResultGrade(99)).toBe("almost-perfect");
    expect(getResultGrade(100)).toBe("perfect");
  });

  it("creates digit sessions from the digit character set", () => {
    const session = createSession({ language: "en", characterSet: "digits", gameMode: "hear-pick", questionCount: 30 }, "seed");

    expect(session.questions).toHaveLength(10);
    expect(session.questions.every((question) => /^\d$/.test(question.target.display))).toBe(true);
  });

  it("creates word sessions from the word character set", () => {
    const session = createSession({ language: "en", characterSet: "words", gameMode: "hear-pick", questionCount: 50 }, "seed");

    expect(session.questions).toHaveLength(36);
    expect(session.questions.every((question) => question.target.characterSet === "words")).toBe(true);
    expect(session.questions.map((question) => question.target.display)).toEqual(expect.arrayContaining(["mom", "dad", "cake"]));
  });
});
