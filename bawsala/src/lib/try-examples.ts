/**
 * Example sentences for the landing-page studio. They are content, not UI strings: each is written in
 * the language it demonstrates (so the Tamazight example stays in Tifinagh whatever the UI language).
 * The Tamazight sentence needs native review before launch.
 */
export const TRY_EXAMPLES = [
  { id: "ary", label: "الدارجة", dir: "rtl", text: "كنعاون الواليد فالحانوت ديال العائلة: كنسيّر الكاسة، كنهضر مع الكليان وكنتبع السلعة فExcel. ونظّمت حدث فالكلية مع الفريق ديالي." },
  { id: "arabizi", label: "3arabizi", dir: "ltr", text: "kan3awen lwalid f l7anout: kansayer lkasa, kanhder m3a lklyan w kantab3 sel3a f Excel. W nadamt event f lfac m3a lfari9 dyali." },
  { id: "ar", label: "العربية", dir: "rtl", text: "أساعد في متجر العائلة: أتولى الصندوق، وأتحدث مع الزبائن، وأتابع المخزون على Excel. ونظّمت فعالية في الجامعة مع فريقي." },
  { id: "fr", label: "Français", dir: "ltr", text: "J’aide dans la boutique familiale : je tiens la caisse, je conseille les clients et je suis le stock sur Excel. J’ai aussi organisé un événement à la fac avec mon équipe." },
  { id: "en", label: "English", dir: "ltr", text: "I help at my family’s shop: I handle the till, talk with customers and track stock in Excel. I also organised a university event with my team." },
  { id: "zgh", label: "ⵜⴰⵎⴰⵣⵉⵖⵜ", dir: "ltr", text: "ⴰⵔ ⵜⵜⵄⴰⵡⴰⵏⵖ ⴱⴰⴱⴰ ⴳ ⵜⵃⴰⵏⵓⵜ: ⴰⵔ ⵙⴰⵡⴰⵍⵖ ⴷ ⵉⵎⵙⴰⵖⵏ, ⴰⵔ ⵜⵜⵃⵙⴰⴱⵖ ⵉⴷⵔⵉⵎⵏ ⴷ ⵓⵙⵖⴱⴰⵍⵓ ⴳ Excel. ⵙⵙⵓⴷⵙⵖ ⵢⴰⵜ ⵜⵎⵖⵔⴰ ⴳ ⵜⵙⴷⴰⵡⵉⵜ ⴷ ⵜⴰⵔⴱⴰⵄⵜ ⵉⵏⵓ." },
] as const;
export type TryExampleId = (typeof TRY_EXAMPLES)[number]["id"];
export const EXAMPLE_FOR_LOCALE: Record<string, TryExampleId> = { ary: "ary", ar: "ar", fr: "fr", en: "en", zgh: "zgh" };
