export function roundToTenth(num: number): number {
  return Math.round(num * 10) / 10;
}

export function isNumeric(num: number): boolean {
  return num && !isNaN(num);
}
