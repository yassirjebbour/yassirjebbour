/**
 * App shell strings (command palette, rail compass card). Kept in its own module so
 * workstreams can add namespaces without editing the same catalogue lines.
 * Every locale is type-checked against the English shape.
 */
import type { MessagesShape } from "../../format";

const en = {
  search: "Search or jump to…",
  search_label: "Search pages and actions",
  pages: "Pages",
  actions: "Actions",
  ask: "Ask the assistant: “{q}”",
  no_results: "Nothing found. Press Enter to ask the assistant.",
  add_experience: "Describe something I did",
  print_passport: "Open my printable passport",
  export: "Download my data (JSON)",
  new_chat: "Start a new conversation",
  theme: "Switch light / dark theme",
  language: "Language: {name}",
  hint_move: "move",
  hint_open: "open",
  hint_close: "close",
  target: "Your target",
  readiness: "{have} of {total} required skills",
  no_target: "No target yet",
  choose_target: "Choose a role to aim for",
  passport_count: { one: "# skill in your passport", other: "# skills in your passport" },
  account: "Account",
};
type S = MessagesShape<typeof en>;

const fr: S = {
  search: "Rechercher ou aller à…",
  search_label: "Rechercher des pages et des actions",
  pages: "Pages",
  actions: "Actions",
  ask: "Demander à l’assistant : « {q} »",
  no_results: "Aucun résultat. Appuyez sur Entrée pour demander à l’assistant.",
  add_experience: "Décrire quelque chose que j’ai fait",
  print_passport: "Ouvrir mon passeport imprimable",
  export: "Télécharger mes données (JSON)",
  new_chat: "Nouvelle conversation",
  theme: "Basculer thème clair / sombre",
  language: "Langue : {name}",
  hint_move: "naviguer",
  hint_open: "ouvrir",
  hint_close: "fermer",
  target: "Votre objectif",
  readiness: "{have} sur {total} compétences requises",
  no_target: "Pas encore d’objectif",
  choose_target: "Choisir un poste à viser",
  passport_count: { one: "# compétence dans votre passeport", other: "# compétences dans votre passeport" },
  account: "Compte",
};

const ar: S = {
  search: "ابحث أو انتقل إلى…",
  search_label: "ابحث في الصفحات والإجراءات",
  pages: "الصفحات",
  actions: "إجراءات",
  ask: "اسأل المساعد: «{q}»",
  no_results: "لا نتائج. اضغط Enter لتسأل المساعد.",
  add_experience: "صِف شيئاً قمتَ به",
  print_passport: "افتح جوازي القابل للطباعة",
  export: "نزّل بياناتي (JSON)",
  new_chat: "ابدأ محادثة جديدة",
  theme: "بدّل بين الوضع الفاتح والداكن",
  language: "اللغة: {name}",
  hint_move: "للتنقل",
  hint_open: "للفتح",
  hint_close: "للإغلاق",
  target: "هدفك",
  readiness: "{have} من {total} من المهارات المطلوبة",
  no_target: "لا هدف بعد",
  choose_target: "اختر وظيفة تطمح إليها",
  passport_count: { zero: "لا مهارات في جوازك", one: "مهارة واحدة في جوازك", two: "مهارتان في جوازك", few: "# مهارات في جوازك", many: "# مهارة في جوازك", other: "# مهارة في جوازك" },
  account: "الحساب",
};

const ary: S = {
  search: "قلّب ولا سير لشي صفحة…",
  search_label: "قلّب فالصفحات والإجراءات",
  pages: "الصفحات",
  actions: "إجراءات",
  ask: "سوّل المساعد: «{q}»",
  no_results: "ما لقينا والو. ورّك على Enter باش تسوّل المساعد.",
  add_experience: "حكي على شي حاجة درتيها",
  print_passport: "حلّ الجواز ديالي للطباعة",
  export: "نزّل البيانات ديالي (JSON)",
  new_chat: "بدا محادثة جديدة",
  theme: "بدّل بين الفاتح والداكن",
  language: "اللغة: {name}",
  hint_move: "باش تتحرك",
  hint_open: "باش تحلّ",
  hint_close: "باش تسدّ",
  target: "الهدف ديالك",
  readiness: "{have} من {total} ديال المهارات المطلوبة",
  no_target: "مازال ما ختاريتي حتى هدف",
  choose_target: "ختار خدمة بغيتي توصل ليها",
  passport_count: { zero: "ما كاينة حتى مهارة فالجواز ديالك", one: "مهارة وحدة فالجواز ديالك", two: "جوج مهارات فالجواز ديالك", few: "# مهارات فالجواز ديالك", many: "# مهارة فالجواز ديالك", other: "# مهارة فالجواز ديالك" },
  account: "الحساب",
};

const zgh: S = {
  search: "ⵔⵣⵓ ⵏⵖ ⴷⴷⵓ ⵖⵔ…", // review
  search_label: "ⵔⵣⵓ ⴳ ⵜⵙⵏⴰⵡⵉⵏ ⴷ ⵜⵉⴳⴰⵡⵉⵏ", // review
  pages: "ⵜⵉⵙⵏⴰⵡⵉⵏ", // review
  actions: "ⵜⵉⴳⴰⵡⵉⵏ",
  ask: "ⵙⵇⵙⴰ ⴰⵎⵄⴰⵡⵏ: «{q}»", // review
  no_results: "ⵓⵔ ⵏⵓⴼⵉ ⵓⵍⴰ ⵢⴰⵜ. ⵙⵇⵙⴰ ⴰⵎⵄⴰⵡⵏ ⵙ ↵.", // review
  add_experience: "ⵔⵏⵓ ⵢⴰⵜ ⵜⵉⵔⵎⵉⵜ",
  print_passport: "ⴰⴱⴰⵙⴱⵓⵔ ⵉ ⵓⵙⵉⴳⴳⵣ", // review
  export: "ⵣⴷⵎ ⵉⵙⴼⴽⴰ (JSON)",
  new_chat: "ⴰⵎⵙⴰⵡⴰⵍ ⴰⵎⴰⵢⵏⵓ",
  theme: "ⵙⵏⴼⵍ ⵜⵉⴼⴰⵡⵜ / ⵜⴰⵍⵍⵙⵜ", // review
  language: "ⵜⵓⵜⵍⴰⵢⵜ: {name}",
  hint_move: "ⵎⵓⵙⵙ", // review
  hint_open: "ⵔⵥⵎ",
  hint_close: "ⵔⴳⵍ",
  target: "ⵉⵙⵡⵉ ⵏⵏⴽ",
  readiness: "{have} ⴳ {total} ⵜⵉⵣⵎⴰⵔ ⵉⵜⵜⵓⵃⵜⴰⵊⵏ",
  no_target: "ⵓⵔ ⵜⵍⵍⵉ ⵉⵙⵡⵉ ⵖⵉⵍⴰ", // review
  choose_target: "ⵙⵜⵉ ⵢⴰⵜ ⵜⵡⵓⵔⵉ ⵣⵓⵏⴷ ⵉⵙⵡⵉ",
  passport_count: { one: "# ⵜⵣⵎⵔⵜ ⴳ ⵓⴱⴰⵙⴱⵓⵔ ⵏⵏⴽ", other: "# ⵜⵉⵣⵎⴰⵔ ⴳ ⵓⴱⴰⵙⴱⵓⵔ ⵏⵏⴽ" },
  account: "ⴰⵎⵉⴹⴰⵏ", // review
};

export const shell = { en, fr, ar, ary, zgh };
