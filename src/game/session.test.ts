import { describe, expect, it } from "vitest";
import { answerQuestion, createSession, remainingPoints, summarizeSession } from "./session";

describe("session", () => {
  it("reduces available points after wrong attempts", () => {
    expect(remainingPoints(0)).toBe(10);
    expect(remainingPoints(1)).toBe(7);
    expect(remainingPoints(2)).toBe(4);
    expect(remainingPoints(8)).toBe(1);
  });

  it("does not advance after a wrong answer", () => {
    const session = createSession({ language: "en", gameMode: "hear-pick", questionCount: 3 }, "seed");
    const wrong = session.questions[0].options.find((option) => option.display !== session.questions[0].target.display)!;

    const next = answerQuestion(session, wrong.display);

    expect(next.result.correct).toBe(false);
    expect(next.state.currentIndex).toBe(0);
    expect(next.state.wrongAttempts).toHaveLength(1);
  });

  it("advances after a correct answer and finishes at the configured count", () => {
    let session = createSession({ language: "en", gameMode: "hear-pick", questionCount: 2 }, "seed");

    session = answerQuestion(session, session.questions[0].target.display).state;
    expect(session.currentIndex).toBe(1);
    expect(session.completed).toBe(false);

    session = answerQuestion(session, session.questions[1].target.display).state;
    expect(session.completed).toBe(true);
    expect(session.results).toHaveLength(2);
  });

  it("summarizes strong and practice letters", () => {
    let session = createSession({ language: "en", gameMode: "hear-pick", questionCount: 2 }, "seed");
    const firstWrong = session.questions[0].options.find((option) => option.display !== session.questions[0].target.display)!;
    session = answerQuestion(session, firstWrong.display).state;
    session = answerQuestion(session, session.questions[0].target.display).state;
    session = answerQuestion(session, session.questions[1].target.display).state;

    const summary = summarizeSession(session);

    expect(summary.totalScore).toBe(17);
    expect(summary.maxScore).toBe(20);
    expect(summary.practiceLetters).toContain(session.results[0].letter);
    expect(summary.strongLetters).toContain(session.results[1].letter);
  });
});
