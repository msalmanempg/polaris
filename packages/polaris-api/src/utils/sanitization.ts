import { parsePhoneNumberFromString } from "libphonenumber-js";

export function removeConsecutiveSpaces<T>(value: T): T | string {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/ +(?= )/g, "");
}

export function removeAllSpaces<T>(value: T): T | string {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/ /g, "");
}

export function removeDashes<T>(value: T): T | string {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/-/g, "");
}

export function formatPhoneNumberToE164(value: string): string | any | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return parsePhoneNumberFromString(value)?.format("E.164") || value;
}

export function commaSeparatedStringToArray<T>(value: T): T | Array<string> {
  if (typeof value !== "string") {
    return value;
  }

  return value.split(",");
}

export function commaSeparatedStringToIntArray<T>(value: T): T | Array<number> {
  const numbers = commaSeparatedStringToArray<T>(value);
  if (!Array.isArray(numbers)) {
    return value;
  }
  return numbers.map((x: string) => Number.parseInt(x, 10)).filter((x) => !!x);
}

export function numberToString(value: number): string | undefined {
  return value ? value.toString() : undefined;
}

export function lowerCase(value: string): string | undefined {
  return value ? value.toString().toLowerCase() : undefined;
}

export function stringToNumber(value: string): number | undefined {
  return value ? Number.parseInt(value) : undefined;
}

export function toCamelCase(sentenceCase: string): string {
  let out = "";
  for (const [idx, el] of sentenceCase.split(" ").entries()) {
    const add = el.toLowerCase();
    out += idx === 0 ? add : add[0].toUpperCase() + add.slice(1);
  }
  return out;
}
