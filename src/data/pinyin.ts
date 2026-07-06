export function stripPinyinToneMarks(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[üÜ]/g, (letter) => (letter === "Ü" ? "U" : "u"))
    .normalize("NFC");
}
