import { timingSafeEqual } from "node:crypto";

export function authorize(key: unknown, organization: unknown, expected: string, scope: string) {
  if (!expected || !scope || organization !== scope || typeof key !== "string") return false;
  const provided = Buffer.from(key);
  const required = Buffer.from(expected);
  return provided.length === required.length && timingSafeEqual(provided, required);
}
