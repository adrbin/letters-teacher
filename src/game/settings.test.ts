import { afterEach, describe, expect, it } from "vitest";
import { defaultAppSettings, loadAppSettings, normalizeAppSettings, saveAppSettings, updateSessionSetting } from "./settings";

describe("settings", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("defaults UI action speech to enabled", () => {
    expect(loadAppSettings()).toEqual(defaultAppSettings);
  });

  it("persists app settings separately from session scoring state", () => {
    const settings = {
      session: { language: "en", characterSet: "words", gameMode: "hear-write", questionCount: 36, letterCase: "lowercase" } as const,
      readUiActionsAloud: false
    };

    saveAppSettings(settings);

    expect(loadAppSettings()).toEqual(settings);
  });

  it("falls back to defaults when stored settings are invalid", () => {
    window.localStorage.setItem("letters-teacher:settings", "not-json");

    expect(loadAppSettings()).toEqual(defaultAppSettings);
  });

  it("clamps question counts when language or character set changes", () => {
    const highCountSettings = { ...defaultAppSettings.session, questionCount: 30 };

    expect(updateSessionSetting(highCountSettings, "language", "en").questionCount).toBe(26);
    expect(updateSessionSetting(highCountSettings, "characterSet", "digits").questionCount).toBe(10);
  });

  it("normalizes partial stored settings", () => {
    expect(
      normalizeAppSettings({
        session: { language: "en", characterSet: "digits", questionCount: 99 },
        readUiActionsAloud: false
      })
    ).toEqual({
      session: { ...defaultAppSettings.session, language: "en", characterSet: "digits", questionCount: 10 },
      readUiActionsAloud: false
    });
  });
});
