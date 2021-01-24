export function roundToTenth(num: number): number {
  return Math.round(num * 10) / 10;
}

export function isNumeric(num: number | string): boolean {
  return num && !isNaN(parseFloat(String(num))) && isFinite(Number(num));
}

export function jsonDeepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
