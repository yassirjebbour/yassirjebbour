/** App screen strings (dashboard, passport, opportunities, path, notifications, profile, settings). See ext/shell.ts for the pattern. */
import type { MessagesShape } from "../../format";

const en = {
  dash: {
    sub: "Here is where your compass points today.",
    ring_required: "required",
    ring_skills: "skills",
    ring_aria_target: "{have} of {total} required skills for {role}",
    tile_skills: "Skills in your passport",
    tile_proven: "Backed by proof",
    tile_steps: "Path steps done",
    tile_streak: "Days in a row",
    sky_title: "Your skill sky",
    sky_sub: "Each star is a skill in your passport. Stars with proof shine brighter; the needle points to your strongest direction.",
    sky_empty: "Your sky is still empty. Describe something you did and your first stars will appear.",
    sky_cta: "Open my passport",
    sky_aria: { one: "Skill sky with # skill", other: "Skill sky with # skills" },
    matches_sub: "Ranked by the skills you already have.",
    all_required: "You have every required skill",
    match: "match",
  },
  pass: {
    holder: "Holder",
    since: "Since {date}",
    count_label: { one: "skill", other: "skills" },
    by_status: "By status",
    made_with: "Built with BAWSALA",
    category_count: { one: "# skill", other: "# skills" },
  },
  opp: {
    results: { zero: "No roles", one: "# role", other: "# roles" },
    match: "match",
    ready: "Ready to apply",
    back: "All opportunities",
    hours: "~{n} h",
    gap_sub: "What you already have, and what to learn next.",
    actions_title: "Your next moves",
    required: "Required",
  },
  plan: {
    days_left: { zero: "Last day", one: "# day left", other: "# days left" },
    next_up: "Next up",
    ended: "Path period ended",
    journey: "Your journey",
    today: "Today",
  },
  notif: {
    new: "New",
    earlier: "Earlier",
  },
  prof: {
    strength: "Profile strength",
    strength_hint: "A complete profile gives better matches and a sharper path.",
    strength_aria: "Profile {n}% complete",
  },
  set: {
    appearance: "Language & appearance",
    danger: "Danger zone",
    security: "Security",
  },
};
type S = MessagesShape<typeof en>;

const fr: S = {
  dash: {
    sub: "Voici où pointe votre boussole aujourd’hui.",
    ring_required: "requises",
    ring_skills: "compétences",
    ring_aria_target: "{have} sur {total} compétences requises pour {role}",
    tile_skills: "Compétences dans votre passeport",
    tile_proven: "Appuyées par une preuve",
    tile_steps: "Étapes du parcours faites",
    tile_streak: "Jours d’affilée",
    sky_title: "Votre ciel de compétences",
    sky_sub: "Chaque étoile est une compétence de votre passeport. Celles qui ont une preuve brillent davantage ; l’aiguille indique votre direction la plus forte.",
    sky_empty: "Votre ciel est encore vide. Décrivez quelque chose que vous avez fait et vos premières étoiles apparaîtront.",
    sky_cta: "Ouvrir mon passeport",
    sky_aria: { one: "Ciel de compétences avec # compétence", other: "Ciel de compétences avec # compétences" },
    matches_sub: "Classés selon les compétences que vous avez déjà.",
    all_required: "Vous avez toutes les compétences requises",
    match: "adéquation",
  },
  pass: {
    holder: "Titulaire",
    since: "Depuis le {date}",
    count_label: { one: "compétence", other: "compétences" },
    by_status: "Par statut",
    made_with: "Créé avec BAWSALA",
    category_count: { one: "# compétence", other: "# compétences" },
  },
  opp: {
    results: { zero: "Aucun poste", one: "# poste", other: "# postes" },
    match: "adéquation",
    ready: "Prêt·e à postuler",
    back: "Toutes les opportunités",
    hours: "~{n} h",
    gap_sub: "Ce que vous avez déjà, et ce qu’il reste à apprendre.",
    actions_title: "Vos prochaines actions",
    required: "Requise",
  },
  plan: {
    days_left: { zero: "Dernier jour", one: "# jour restant", other: "# jours restants" },
    next_up: "Prochaine étape",
    ended: "Période du parcours terminée",
    journey: "Votre parcours",
    today: "Aujourd’hui",
  },
  notif: {
    new: "Nouvelles",
    earlier: "Plus tôt",
  },
  prof: {
    strength: "Force du profil",
    strength_hint: "Un profil complet donne de meilleures correspondances et un parcours plus précis.",
    strength_aria: "Profil complet à {n} %",
  },
  set: {
    appearance: "Langue et apparence",
    danger: "Zone sensible",
    security: "Sécurité",
  },
};

const ar: S = {
  dash: {
    sub: "إلى هنا تشير بوصلتك اليوم.",
    ring_required: "مطلوبة",
    ring_skills: "مهارات",
    ring_aria_target: "{have} من {total} من المهارات المطلوبة لوظيفة {role}",
    tile_skills: "مهارات في جوازك",
    tile_proven: "مدعومة بدليل",
    tile_steps: "خطوات منجزة من المسار",
    tile_streak: "أيام متتالية",
    sky_title: "سماء مهاراتك",
    sky_sub: "كل نجمة مهارةٌ في جوازك. النجوم المدعومة بدليل أكثر لمعاناً، والإبرة تشير إلى أقوى اتجاهاتك.",
    sky_empty: "سماؤك فارغة حتى الآن. صِف شيئاً قمت به وستظهر نجومك الأولى.",
    sky_cta: "افتح جوازي",
    sky_aria: { zero: "سماء مهارات بلا مهارات", one: "سماء مهارات فيها مهارة واحدة", two: "سماء مهارات فيها مهارتان", few: "سماء مهارات فيها # مهارات", many: "سماء مهارات فيها # مهارة", other: "سماء مهارات فيها # مهارة" },
    matches_sub: "مرتّبة حسب المهارات التي تملكها.",
    all_required: "لديك كل المهارات المطلوبة",
    match: "توافق",
  },
  pass: {
    holder: "صاحب الجواز",
    since: "منذ {date}",
    count_label: { zero: "مهارة", one: "مهارة", two: "مهارتان", few: "مهارات", many: "مهارة", other: "مهارة" },
    by_status: "حسب الحالة",
    made_with: "أُنشئ مع بوصلة",
    category_count: { zero: "لا مهارات", one: "مهارة واحدة", two: "مهارتان", few: "# مهارات", many: "# مهارة", other: "# مهارة" },
  },
  opp: {
    results: { zero: "لا وظائف", one: "وظيفة واحدة", two: "وظيفتان", few: "# وظائف", many: "# وظيفة", other: "# وظيفة" },
    match: "توافق",
    ready: "جاهز للتقديم",
    back: "كل الفرص",
    hours: "~{n} ساعة",
    gap_sub: "ما تملكه الآن، وما عليك تعلّمه بعد ذلك.",
    actions_title: "خطواتك التالية",
    required: "مطلوبة",
  },
  plan: {
    days_left: { zero: "آخر يوم", one: "يوم واحد متبقٍّ", two: "يومان متبقيان", few: "# أيام متبقية", many: "# يوماً متبقياً", other: "# يوم متبقٍّ" },
    next_up: "التالي",
    ended: "انتهت مدة المسار",
    journey: "رحلتك",
    today: "اليوم",
  },
  notif: {
    new: "جديدة",
    earlier: "سابقاً",
  },
  prof: {
    strength: "قوة الملف",
    strength_hint: "الملف المكتمل يمنحك وظائف أنسب ومساراً أدق.",
    strength_aria: "الملف مكتمل بنسبة {n}%",
  },
  set: {
    appearance: "اللغة والمظهر",
    danger: "منطقة حساسة",
    security: "الأمان",
  },
};

const ary: S = {
  dash: {
    sub: "هادي هي الوجهة اللي كتشير ليها البوصلة ديالك اليوم.",
    ring_required: "مطلوبة",
    ring_skills: "مهارات",
    ring_aria_target: "{have} من {total} ديال المهارات المطلوبة فـ {role}",
    tile_skills: "مهارات فالجواز ديالك",
    tile_proven: "عندها دليل",
    tile_steps: "خطوات ساليتيها فالطريق",
    tile_streak: "أيام ورا بعضياتهم",
    sky_title: "السما ديال المهارات ديالك",
    sky_sub: "كل نجمة هي مهارة فالجواز ديالك. النجوم اللي عندها دليل كيضويو كثر، والإبرة كتشير للاتجاه اللي نتا قوي فيه.",
    sky_empty: "السما ديالك مازال خاوية. حكي على شي حاجة درتيها وغادي يبانو أول النجوم.",
    sky_cta: "حلّ الجواز ديالي",
    sky_aria: { zero: "سما ديال المهارات بلا مهارات", one: "سما ديال المهارات فيها مهارة وحدة", two: "سما ديال المهارات فيها جوج مهارات", few: "سما ديال المهارات فيها # مهارات", many: "سما ديال المهارات فيها # مهارة", other: "سما ديال المهارات فيها # مهارة" },
    matches_sub: "مرتبين على حساب المهارات اللي عندك.",
    all_required: "عندك كاع المهارات المطلوبة",
    match: "توافق",
  },
  pass: {
    holder: "مول الجواز",
    since: "من {date}",
    count_label: { zero: "مهارة", one: "مهارة", two: "مهارات", few: "مهارات", many: "مهارة", other: "مهارة" },
    by_status: "على حساب الحالة",
    made_with: "تصاوب مع بوصلة",
    category_count: { zero: "حتى مهارة", one: "مهارة وحدة", two: "جوج مهارات", few: "# مهارات", many: "# مهارة", other: "# مهارة" },
  },
  opp: {
    results: { zero: "حتى خدمة", one: "خدمة وحدة", two: "جوج خدمات", few: "# خدمات", many: "# خدمة", other: "# خدمة" },
    match: "توافق",
    ready: "واجد تقدّم",
    back: "كاع الفرص",
    hours: "~{n} ساعة",
    gap_sub: "شنو عندك دابا، وشنو خاصك تتعلم من بعد.",
    actions_title: "الخطوات الجاية ديالك",
    required: "مطلوبة",
  },
  plan: {
    days_left: { zero: "آخر نهار", one: "بقا نهار واحد", two: "بقاو جوج أيام", few: "بقاو # أيام", many: "بقا # يوم", other: "بقا # يوم" },
    next_up: "اللي جاي",
    ended: "سالات المدة ديال الطريق",
    journey: "الطريق ديالك",
    today: "اليوم",
  },
  notif: {
    new: "جداد",
    earlier: "قبل",
  },
  prof: {
    strength: "قوة البروفايل",
    strength_hint: "البروفايل الكامل كيعطيك خدمات مناسبة كثر وطريق مضبوط كثر.",
    strength_aria: "البروفايل كامل بـ {n}%",
  },
  set: {
    appearance: "اللغة والشكل",
    danger: "منطقة حساسة",
    security: "الأمان",
  },
};

const zgh: S = {
  dash: {
    sub: "ⵖⵉⴷ ⴰⴷ ⵜⵙⵙⵎⴰⵍ ⴱⴰⵡⵙⴰⵍⴰ ⵏⵏⴽ ⴰⵙⵙ ⴰⴷ.", // review
    ring_required: "ⵉⵜⵜⵓⵃⵜⴰⵊⵏ",
    ring_skills: "ⵜⵉⵣⵎⴰⵔ",
    ring_aria_target: "{have} ⴳ {total} ⵜⵉⵣⵎⴰⵔ ⵉⵜⵜⵓⵃⵜⴰⵊⵏ ⵉ {role}", // review
    tile_skills: "ⵜⵉⵣⵎⴰⵔ ⴳ ⵓⴱⴰⵙⴱⵓⵔ ⵏⵏⴽ",
    tile_proven: "ⵙ ⵓⵏⴰⴳⵉ",
    tile_steps: "ⵜⵉⵙⵓⵔⵉⴼⵉⵏ ⵉⴽⵎⵎⵍⵏ", // review
    tile_streak: "ⵡⵓⵙⵙⴰⵏ ⵉⵎⴹⴼⴰⵕⵏ",
    sky_title: "ⴰⴳⵏⵏⴰ ⵏ ⵜⵉⵣⵎⴰⵔ ⵏⵏⴽ", // review
    sky_sub: "ⴽⵓ ⵉⵜⵔⵉ ⴷ ⵜⴰⵣⵎⵔⵜ ⴳ ⵓⴱⴰⵙⴱⵓⵔ ⵏⵏⴽ. ⵉⵜⵔⴰⵏ ⵙ ⵓⵏⴰⴳⵉ ⴼⴼⵓⵍⴽⵉⵏ ⵓⴳⴰⵔ.", // review
    sky_empty: "ⴰⴳⵏⵏⴰ ⵏⵏⴽ ⵉⵅⵡⴰ ⵖⵉⵍⴰ. ⵉⵏⵉ ⵢⴰⵜ ⵜⵖⴰⵡⵙⴰ ⵜⵙⴽⵔⵜ ⴰⴷ ⴷ ⴱⴰⵢⵏⵏ ⵉⵜⵔⴰⵏ ⵉⵎⵣⵡⵓⵔⴰ.", // review
    sky_cta: "ⵔⵥⵎ ⴰⴱⴰⵙⴱⵓⵔ ⵉⵏⵓ",
    sky_aria: { one: "ⴰⴳⵏⵏⴰ ⵙ # ⵜⵣⵎⵔⵜ", other: "ⴰⴳⵏⵏⴰ ⵙ # ⵜⵉⵣⵎⴰⵔ" }, // review
    matches_sub: "ⵙⵙⵓⴷⵙⵏ ⵙ ⵜⵉⵣⵎⴰⵔ ⵍⵍⵉ ⵖⵓⵔⴽ.", // review
    all_required: "ⵖⵓⵔⴽ ⴽⵓⵍⵍⵓ ⵜⵉⵣⵎⴰⵔ ⵉⵜⵜⵓⵃⵜⴰⵊⵏ", // review
    match: "ⴰⵎⵙⴰⵙⴰ", // review
  },
  pass: {
    holder: "ⴱⵓ ⵓⴱⴰⵙⴱⵓⵔ", // review
    since: "ⵙⴳ {date}",
    count_label: { one: "ⵜⴰⵣⵎⵔⵜ", other: "ⵜⵉⵣⵎⴰⵔ" },
    by_status: "ⵙ ⵡⴰⴷⴷⴰⴷ", // review
    made_with: "ⵜⵜⵓⵙⴽⴰ ⵙ ⴱⴰⵡⵙⴰⵍⴰ", // review
    category_count: { one: "# ⵜⵣⵎⵔⵜ", other: "# ⵜⵉⵣⵎⴰⵔ" },
  },
  opp: {
    results: { zero: "ⵓⵍⴰ ⵢⴰⵜ ⵜⵡⵓⵔⵉ", one: "# ⵜⵡⵓⵔⵉ", other: "# ⵜⵉⵡⵓⵔⵉⵡⵉⵏ" }, // review
    match: "ⴰⵎⵙⴰⵙⴰ", // review
    ready: "ⵉⵡⵊⴷ ⵉ ⵓⵙⵓⵜⵔ", // review
    back: "ⴽⵓⵍⵍⵓ ⵜⵉⴳⵏⴰⵜⵉⵏ",
    hours: "~{n} ⵜⵙⵔⴰⴳⵉⵏ", // review
    gap_sub: "ⵎⴰ ⵖⵓⵔⴽ, ⴷ ⵎⴰ ⵔⴰⴷ ⵜⵍⵎⴷⵜ.", // review
    actions_title: "ⵜⵉⵙⵓⵔⵉⴼⵉⵏ ⵏⵏⴽ ⴷ ⵢⵓⵛⴽⴰⵏ", // review
    required: "ⵉⵜⵜⵓⵃⵜⴰⵊ", // review
  },
  plan: {
    days_left: { zero: "ⴰⵙⵙ ⴰⵏⴳⴳⴰⵔⵓ", one: "# ⵡⴰⵙⵙ ⵉⵇⵇⵉⵎⵏ", other: "# ⵡⵓⵙⵙⴰⵏ ⵉⵇⵇⵉⵎⵏ" }, // review
    next_up: "ⴷ ⵢⵓⵛⴽⴰⵏ",
    ended: "ⵜⴽⵎⵎⵍ ⵜⵉⵣⵉ ⵏ ⵓⴱⵔⵉⴷ", // review
    journey: "ⴰⴱⵔⵉⴷ ⵏⵏⴽ",
    today: "ⴰⵙⵙⴰ", // review
  },
  notif: {
    new: "ⵉⵎⴰⵢⵏⵓⵜⵏ",
    earlier: "ⵣⵉⵖ", // review
  },
  prof: {
    strength: "ⴰⵙⵎⴷ ⵏ ⵓⵎⵖⵏⵓ", // review
    strength_hint: "ⴰⵎⵖⵏⵓ ⵉⴽⵎⵎⵍⵏ ⵉⴼⴽⴰ ⴽ ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⵉⵍⴰⵇⵏ ⵓⴳⴰⵔ.", // review
    strength_aria: "ⴰⵎⵖⵏⵓ ⵉⴽⵎⵎⵍ ⵙ {n}%", // review
  },
  set: {
    appearance: "ⵜⵓⵜⵍⴰⵢⵜ ⴷ ⵓⵙⴽⴽⵉⵏ", // review
    danger: "ⵜⴰⵙⴳⴰ ⵉⵅⴰⵜⴰⵔⵏ", // review
    security: "ⵜⴰⵖⵍⵉⵙⵜ",
  },
};

export const screens = { en, fr, ar, ary, zgh };
