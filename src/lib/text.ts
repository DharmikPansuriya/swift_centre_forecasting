export function splitIntoPoints(text: string | null | undefined): string[] {
  if (!text) return [];

  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return [];

  const segments = normalized.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);

  return segments
    .map((segment) => segment.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

