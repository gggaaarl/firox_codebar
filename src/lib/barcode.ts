function normalizeSegment(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
}

export function generateBarcodeValue(
  year: string,
  description: string,
  gender: string,
  size: string
): string {
  return [year, description, gender, size]
    .map(normalizeSegment)
    .filter(Boolean)
    .join("-");
}
