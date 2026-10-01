const MINUTES_IN_HOUR = 60;

// 160 → "2 h 40 min", 60 → "1 h", 25 → "25 min". Для порожніх/некоректних значень — null,
// щоб компонент просто не показував цей рядок замість «—».
export function formatCookingTime(minutes: number | undefined): string | null {
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return null;

  const hours = Math.floor(total / MINUTES_IN_HOUR);
  const rest = Math.round(total % MINUTES_IN_HOUR);

  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

// Інструкції на бекенді — суцільний текст з переносами рядків між кроками.
export function splitInstructions(instructions: string): string[] {
  return instructions
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter(Boolean);
}
