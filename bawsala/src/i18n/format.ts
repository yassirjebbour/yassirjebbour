/**
 * Message formatting shared by server and client.
 * - "{name}" interpolation
 * - plural leaves: { one: "# skill", other: "# skills" } (+ zero/two/few/many for Arabic),
 *   selected with Intl.PluralRules; "#" is replaced by the formatted number.
 */
import { LOCALE_META, type Locale } from "./config";

export type Plural = { other: string } & Partial<Record<"zero" | "one" | "two" | "few" | "many", string>>;
export type Leaf = string | Plural;

type PluralKey = "zero" | "one" | "two" | "few" | "many" | "other";
/** An object is a plural leaf only if it has `other` and nothing but plural categories. */
type IsPlural<T> = T extends { other: string } ? (Exclude<keyof T, PluralKey> extends never ? true : false) : false;
type Shape<T> = T extends string ? string : IsPlural<T> extends true ? Plural : { [K in keyof T]: Shape<T[K]> };
export type MessagesShape<T> = Shape<T>;

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;
export type Paths<T> = T extends string ? never : IsPlural<T> extends true ? never : { [K in keyof T & string]: T[K] extends string ? K : IsPlural<T[K]> extends true ? K : Join<K, Paths<T[K]>> }[keyof T & string];

const pluralCache = new Map<string, Intl.PluralRules>();
function pluralRules(locale: Locale) {
  const tag = LOCALE_META[locale].intl;
  let pr = pluralCache.get(tag);
  if (!pr) { pr = new Intl.PluralRules(tag); pluralCache.set(tag, pr); }
  return pr;
}

export function formatNumber(n: number, locale: Locale) {
  // Latin digits everywhere: they are standard in Moroccan usage across all five languages.
  return new Intl.NumberFormat(LOCALE_META[locale].intl, { numberingSystem: "latn" }).format(n);
}

export function interpolate(s: string, vars: Record<string, string | number> | undefined, locale: Locale) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => {
    const v = vars[k];
    if (v === undefined) return m;
    return typeof v === "number" ? formatNumber(v, locale) : String(v);
  });
}

const PLURAL_KEYS = new Set(["zero", "one", "two", "few", "many", "other"]);
export function isPluralObject(v: unknown): boolean {
  return !!v && typeof v === "object" && "other" in (v as object) && Object.keys(v as object).every((k) => PLURAL_KEYS.has(k));
}

export function resolve(dict: unknown, path: string): Leaf | undefined {
  let cur: unknown = dict;
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[part];
    else return undefined;
  }
  return typeof cur === "string" || isPluralObject(cur) ? (cur as Leaf) : undefined;
}

export function render(leaf: Leaf | undefined, locale: Locale, vars?: Record<string, string | number>, fallbackKey?: string): string {
  if (leaf === undefined) return fallbackKey ?? "";
  if (typeof leaf === "string") return interpolate(leaf, vars, locale);
  const n = Number(vars?.n ?? vars?.count ?? 0);
  const cat = n === 0 && leaf.zero ? "zero" : (pluralRules(locale).select(n) as keyof Plural);
  const form = leaf[cat] ?? leaf.other;
  return interpolate(form.replace(/#/g, formatNumber(n, locale)), vars, locale);
}
