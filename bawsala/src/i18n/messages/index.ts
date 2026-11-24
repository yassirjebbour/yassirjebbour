import type { Locale } from "../config";
import { en } from "./en";
import { fr } from "./fr";
import { ar } from "./ar";
import { ary } from "./ary";
import { zgh } from "./zgh";
import { render, resolve, type MessagesShape, type Paths } from "../format";

export type Messages = MessagesShape<typeof en>;
export type MessageKey = Paths<Messages>;

const ALL: Record<Locale, Messages> = { en, fr, ar, ary, zgh };

export function messagesFor(locale: Locale): Messages {
  return ALL[locale];
}

export type TFn = (key: MessageKey, vars?: Record<string, string | number>) => string;

/** Translator with English fallback for any missing leaf (should never happen: the types enforce completeness). */
export function translator(locale: Locale): TFn {
  const dict = ALL[locale];
  return (key, vars) => render(resolve(dict, key) ?? resolve(en, key), locale, vars, key);
}
