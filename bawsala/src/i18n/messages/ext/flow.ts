/**
 * Flow strings: assistant, onboarding, skill suggestions, institution portal and admin console.
 * Every locale is type-checked against the English shape (see ext/shell.ts for the pattern).
 */
import type { MessagesShape } from "../../format";

const en = {
  a: {
    kicker: "Your career compass",
    try: "Try asking",
    thinking: "Thinking…",
    steps: "What the assistant did",
    followups: "Ask next",
    hint: "Enter to send · Shift + Enter for a new line",
    basic_note: "Answers come from BAWSALA’s rules engine and its sourced knowledge base: shorter than an AI model, but every fact shows where it comes from.",
    source: "Source {n}",
    day: "Day {n}",
    close_history: "Close conversations",
    more_steps: { one: "+ # more step", other: "+ # more steps" },
  },
  ob: {
    steps: { lang: "Language", you: "About you", exp: "Experience", skills: "Skills", target: "Target" },
    progress: "Setup progress",
    rich_title: "What makes a strong description",
    rich_words: "At least 15 words",
    rich_number: "A number or a result",
    rich_tasks: "Two or more tasks",
    an_title: "Reading your words…",
    an_save: "Saving your experience",
    an_find: "Looking for skills in your sentences",
    an_prepare: "Preparing your suggestions",
    sky_caption: "Each star is a suggested skill. Say yes and it lights up.",
    confirmed: { zero: "No skill confirmed yet", one: "# skill confirmed", other: "# skills confirmed" },
    pick_hint: "This only sets your compass. Nothing is sent to anyone.",
  },
  sg: {
    rules: "Found by the rules engine",
    ai: "Suggested by AI from your words",
    added: "Added to your passport",
    skipped: "Not added",
  },
  inst: {
    kicker: "Institution portal",
    privacy_title: "Privacy by design",
    privacy_body: "Statistics include only students who chose to share, in groups of {min} or more. Names appear only on verification requests that students send you.",
    copy_code: "Copy the join code",
    pending: { zero: "No pending request", one: "# pending request", other: "# pending requests" },
    proof: "Proof attached",
    no_proof: "No proof attached yet",
    requested: "Requested on {date}",
    share: "Share of students with this skill",
  },
  ad: {
    kicker: "Operations console",
    signals: "Signals",
    tools: "Tool runs",
    retrieval: "Knowledge search",
    retrieval_d: "{n} searches · median {ms} ms · {empty} without results",
    feedback: "Answer feedback",
    email: "Email outbox",
    feature: "Feature",
    engine: "Engine",
    tokens: "Tokens in / out",
    flag: "Flag",
    on: "On",
    slug: "Identifier",
    kind: "Type",
    lang: "Language",
    title: "Title",
    archived: "Archived",
    anonymous: "Anonymous",
    st_open: "Open",
    st_in_progress: "In progress",
    st_closed: "Closed",
    role_student: "Student",
    role_institution_admin: "Institution admin",
    role_platform_admin: "Platform admin",
    members: { one: "# member", other: "# members" },
    of_signup: "{pct}% of sign-ups",
    f_title_fr: "Title (French)",
    f_title_en: "Title (English)",
    f_title_ar: "Title (Arabic)",
    f_org: "Organisation",
    f_source: "Source name",
    f_source_url: "Source link (required)",
    f_apply: "Application link",
    f_deadline: "Deadline",
    f_required: "Required skill ids, separated by commas",
    f_nice: "Nice-to-have skill ids",
    f_desc: "Description (French)",
    f_remote: "Remote",
    f_verified_today: "Verified (checked at the source today)",
    f_unverified: "Not verified",
    f_editorial: "Editorial",
    f_draft: "Draft",
    f_published: "Published",
    f_body: "Content (Markdown)",
    f_verified_at: "Verified on",
  },
};
type S = MessagesShape<typeof en>;

const fr: S = {
  a: {
    kicker: "Votre boussole de carrière",
    try: "Essayez de demander",
    thinking: "Réflexion…",
    steps: "Ce que l’assistant a fait",
    followups: "Demander ensuite",
    hint: "Entrée pour envoyer · Maj + Entrée pour aller à la ligne",
    basic_note: "Les réponses viennent du moteur de règles de BAWSALA et de sa base de connaissances sourcée : plus courtes qu’un modèle d’IA, mais chaque information montre sa source.",
    source: "Source {n}",
    day: "Jour {n}",
    close_history: "Fermer les conversations",
    more_steps: { one: "+ # étape de plus", other: "+ # étapes de plus" },
  },
  ob: {
    steps: { lang: "Langue", you: "Vous", exp: "Expérience", skills: "Compétences", target: "Objectif" },
    progress: "Progression de la configuration",
    rich_title: "Ce qui rend une description solide",
    rich_words: "Au moins 15 mots",
    rich_number: "Un chiffre ou un résultat",
    rich_tasks: "Deux tâches ou plus",
    an_title: "Lecture de vos mots…",
    an_save: "Enregistrement de votre expérience",
    an_find: "Recherche de compétences dans vos phrases",
    an_prepare: "Préparation de vos suggestions",
    sky_caption: "Chaque étoile est une compétence suggérée. Dites oui et elle s’allume.",
    confirmed: { one: "# compétence confirmée", other: "# compétences confirmées" },
    pick_hint: "Cela règle seulement votre boussole. Rien n’est envoyé à personne.",
  },
  sg: {
    rules: "Trouvée par le moteur de règles",
    ai: "Suggérée par l’IA à partir de vos mots",
    added: "Ajoutée à votre passeport",
    skipped: "Non ajoutée",
  },
  inst: {
    kicker: "Portail établissement",
    privacy_title: "Confidentialité dès la conception",
    privacy_body: "Les statistiques ne comptent que les étudiants qui ont choisi de partager, par groupes d’au moins {min}. Les noms n’apparaissent que sur les demandes de vérification que les étudiants vous envoient.",
    copy_code: "Copier le code d’accès",
    pending: { one: "# demande en attente", other: "# demandes en attente" },
    proof: "Preuve jointe",
    no_proof: "Pas encore de preuve jointe",
    requested: "Demandé le {date}",
    share: "Part des étudiants ayant cette compétence",
  },
  ad: {
    kicker: "Console d’exploitation",
    signals: "Signaux",
    tools: "Exécutions d’outils",
    retrieval: "Recherche documentaire",
    retrieval_d: "{n} recherches · médiane {ms} ms · {empty} sans résultat",
    feedback: "Avis sur les réponses",
    email: "File d’e-mails",
    feature: "Fonction",
    engine: "Moteur",
    tokens: "Jetons entrée / sortie",
    flag: "Option",
    on: "Actif",
    slug: "Identifiant",
    kind: "Type",
    lang: "Langue",
    title: "Titre",
    archived: "Archivé",
    anonymous: "Anonyme",
    st_open: "Ouvert",
    st_in_progress: "En cours",
    st_closed: "Fermé",
    role_student: "Étudiant",
    role_institution_admin: "Admin établissement",
    role_platform_admin: "Admin plateforme",
    members: { one: "# membre", other: "# membres" },
    of_signup: "{pct} % des inscriptions",
    f_title_fr: "Titre (français)",
    f_title_en: "Titre (anglais)",
    f_title_ar: "Titre (arabe)",
    f_org: "Organisme",
    f_source: "Nom de la source",
    f_source_url: "Lien de la source (obligatoire)",
    f_apply: "Lien de candidature",
    f_deadline: "Date limite",
    f_required: "Compétences requises (identifiants séparés par des virgules)",
    f_nice: "Compétences appréciées (identifiants)",
    f_desc: "Description (français)",
    f_remote: "À distance",
    f_verified_today: "Vérifiée (contrôlée à la source aujourd’hui)",
    f_unverified: "Non vérifiée",
    f_editorial: "Éditorial",
    f_draft: "Brouillon",
    f_published: "Publiée",
    f_body: "Contenu (Markdown)",
    f_verified_at: "Vérifié le",
  },
};

const ar: S = {
  a: {
    kicker: "بوصلتك المهنية",
    try: "جرّب أن تسأل",
    thinking: "يفكّر…",
    steps: "ما قام به المساعد",
    followups: "اسأل بعد ذلك",
    hint: "Enter للإرسال · Shift + Enter لسطر جديد",
    basic_note: "تأتي الإجابات من محرك القواعد في بوصلة ومن قاعدة معرفته الموثّقة المصادر: أقصر من نموذج ذكاء اصطناعي، لكن كل معلومة تُظهر مصدرها.",
    source: "المصدر {n}",
    day: "اليوم {n}",
    close_history: "إغلاق المحادثات",
    more_steps: { zero: "لا خطوات إضافية", one: "+ خطوة واحدة أخرى", two: "+ خطوتان أخريان", few: "+ # خطوات أخرى", many: "+ # خطوة أخرى", other: "+ # خطوة أخرى" },
  },
  ob: {
    steps: { lang: "اللغة", you: "عنك", exp: "التجربة", skills: "المهارات", target: "الهدف" },
    progress: "تقدّم الإعداد",
    rich_title: "ما يجعل الوصف قوياً",
    rich_words: "خمس عشرة كلمة على الأقل",
    rich_number: "رقم أو نتيجة",
    rich_tasks: "مهمتان أو أكثر",
    an_title: "نقرأ كلماتك…",
    an_save: "حفظ تجربتك",
    an_find: "البحث عن المهارات في جملك",
    an_prepare: "تحضير اقتراحاتك",
    sky_caption: "كل نجمة مهارة مقترحة. قل نعم فتضيء.",
    confirmed: { zero: "لم تُؤكَّد أي مهارة بعد", one: "مهارة واحدة مؤكَّدة", two: "مهارتان مؤكَّدتان", few: "# مهارات مؤكَّدة", many: "# مهارة مؤكَّدة", other: "# مهارة مؤكَّدة" },
    pick_hint: "هذا يضبط بوصلتك فقط. لا يُرسَل أي شيء لأي أحد.",
  },
  sg: {
    rules: "وجدها محرك القواعد",
    ai: "اقترحها الذكاء الاصطناعي من كلماتك",
    added: "أُضيفت إلى جوازك",
    skipped: "لم تُضَف",
  },
  inst: {
    kicker: "بوابة المؤسسة",
    privacy_title: "الخصوصية في صميم التصميم",
    privacy_body: "لا تشمل الإحصاءات إلا الطلبة الذين اختاروا المشاركة، وفي مجموعات من {min} أو أكثر. لا تظهر الأسماء إلا في طلبات التوثيق التي يرسلها إليك الطلبة.",
    copy_code: "نسخ رمز الانضمام",
    pending: { zero: "لا طلبات قيد الانتظار", one: "طلب واحد قيد الانتظار", two: "طلبان قيد الانتظار", few: "# طلبات قيد الانتظار", many: "# طلباً قيد الانتظار", other: "# طلب قيد الانتظار" },
    proof: "دليل مرفق",
    no_proof: "لا دليل مرفق بعد",
    requested: "طُلب في {date}",
    share: "نسبة الطلبة الذين لديهم هذه المهارة",
  },
  ad: {
    kicker: "لوحة التشغيل",
    signals: "مؤشرات",
    tools: "تشغيل الأدوات",
    retrieval: "البحث في المعرفة",
    retrieval_d: "{n} عملية بحث · الوسيط {ms} م.ث · {empty} دون نتائج",
    feedback: "تقييم الإجابات",
    email: "صندوق البريد الصادر",
    feature: "الميزة",
    engine: "المحرك",
    tokens: "الرموز الداخلة / الخارجة",
    flag: "الخيار",
    on: "مفعّل",
    slug: "المعرّف",
    kind: "النوع",
    lang: "اللغة",
    title: "العنوان",
    archived: "مؤرشف",
    anonymous: "مجهول",
    st_open: "مفتوح",
    st_in_progress: "قيد المعالجة",
    st_closed: "مغلق",
    role_student: "طالب",
    role_institution_admin: "مسؤول مؤسسة",
    role_platform_admin: "مسؤول المنصة",
    members: { zero: "لا أعضاء", one: "عضو واحد", two: "عضوان", few: "# أعضاء", many: "# عضواً", other: "# عضو" },
    of_signup: "{pct}% من المسجّلين",
    f_title_fr: "العنوان (بالفرنسية)",
    f_title_en: "العنوان (بالإنجليزية)",
    f_title_ar: "العنوان (بالعربية)",
    f_org: "الجهة",
    f_source: "اسم المصدر",
    f_source_url: "رابط المصدر (إلزامي)",
    f_apply: "رابط التقديم",
    f_deadline: "آخر أجل",
    f_required: "معرّفات المهارات المطلوبة، مفصولة بفواصل",
    f_nice: "معرّفات المهارات المستحسنة",
    f_desc: "الوصف (بالفرنسية)",
    f_remote: "عن بُعد",
    f_verified_today: "موثّقة (تم التحقق من المصدر اليوم)",
    f_unverified: "غير موثّقة",
    f_editorial: "تحريري",
    f_draft: "مسودة",
    f_published: "منشورة",
    f_body: "المحتوى (Markdown)",
    f_verified_at: "تاريخ التوثيق",
  },
};

const ary: S = {
  a: {
    kicker: "البوصلة ديالك فالخدمة",
    try: "جرّب تسوّل",
    thinking: "كيفكّر…",
    steps: "شنو دار المساعد",
    followups: "سوّل من بعد",
    hint: "Enter باش تصيفط · Shift + Enter لسطر جديد",
    basic_note: "الأجوبة جاية من محرك القواعد ديال بوصلة ومن قاعدة المعرفة ديالو اللي فيها المصادر: قصيرة شوية على الذكاء الاصطناعي، ولكن كل معلومة كتبيّن منين جات.",
    source: "المصدر {n}",
    day: "النهار {n}",
    close_history: "سدّ المحادثات",
    more_steps: { zero: "ما كاينش خطوات خرين", one: "+ خطوة وحدة خرى", two: "+ جوج خطوات خرين", few: "+ # خطوات خرين", many: "+ # خطوة خرين", other: "+ # خطوة خرين" },
  },
  ob: {
    steps: { lang: "اللغة", you: "عليك", exp: "التجربة", skills: "المهارات", target: "الهدف" },
    progress: "فين وصلتي فالإعداد",
    rich_title: "شنو كيخلّي الوصف مزيان",
    rich_words: "15 كلمة على الأقل",
    rich_number: "شي رقم ولا شي نتيجة",
    rich_tasks: "جوج مهام ولا كثر",
    an_title: "كنقراو الكلام ديالك…",
    an_save: "كنسجّلو التجربة ديالك",
    an_find: "كنقلبو على المهارات فالجمل ديالك",
    an_prepare: "كنوجدو الاقتراحات ديالك",
    sky_caption: "كل نجمة هي مهارة مقترحة. قول آه وتضوي.",
    confirmed: { zero: "مازال ما أكّدتي حتى مهارة", one: "مهارة وحدة مأكّدة", two: "جوج مهارات مأكّدين", few: "# مهارات مأكّدين", many: "# مهارة مأكّدة", other: "# مهارة مأكّدة" },
    pick_hint: "هادشي غير كيضبط البوصلة ديالك. ما كيتصيفط والو لحتى واحد.",
  },
  sg: {
    rules: "لقاها محرك القواعد",
    ai: "اقترحها الذكاء الاصطناعي من الكلام ديالك",
    added: "تزادت للجواز ديالك",
    skipped: "ما تزادتش",
  },
  inst: {
    kicker: "بوابة المؤسسة",
    privacy_title: "الخصوصية من الأساس",
    privacy_body: "الإحصائيات فيها غير الطلبة اللي بغاو يشاركو، وفمجموعات ديال {min} ولا كثر. الأسماء كتبان غير فطلبات التوثيق اللي كيصيفطو ليك الطلبة.",
    copy_code: "نسخ كود الانضمام",
    pending: { zero: "ما كاين حتى طلب كيتسنى", one: "طلب واحد كيتسنى", two: "جوج طلبات كيتسناو", few: "# طلبات كيتسناو", many: "# طلب كيتسنى", other: "# طلب كيتسنى" },
    proof: "الدليل مرفوق",
    no_proof: "مازال ما كاين حتى دليل",
    requested: "تطلب نهار {date}",
    share: "شحال من طالب عندو هاد المهارة",
  },
  ad: {
    kicker: "لوحة التشغيل",
    signals: "المؤشرات",
    tools: "تشغيل الأدوات",
    retrieval: "البحث فالمعرفة",
    retrieval_d: "{n} بحث · الوسيط {ms} م.ث · {empty} بلا نتيجة",
    feedback: "التقييم ديال الأجوبة",
    email: "الإيميلات اللي خارجين",
    feature: "الميزة",
    engine: "المحرك",
    tokens: "الرموز داخلين / خارجين",
    flag: "الخيار",
    on: "خدّام",
    slug: "المعرّف",
    kind: "النوع",
    lang: "اللغة",
    title: "العنوان",
    archived: "فالأرشيف",
    anonymous: "بلا سمية",
    st_open: "مفتوح",
    st_in_progress: "كنخدمو عليه",
    st_closed: "مسدود",
    role_student: "طالب",
    role_institution_admin: "مسؤول المؤسسة",
    role_platform_admin: "مسؤول المنصة",
    members: { zero: "ما كاين حتى عضو", one: "عضو واحد", two: "جوج أعضاء", few: "# أعضاء", many: "# عضو", other: "# عضو" },
    of_signup: "{pct}% من اللي تسجّلو",
    f_title_fr: "العنوان (بالفرنسية)",
    f_title_en: "العنوان (بالإنجليزية)",
    f_title_ar: "العنوان (بالعربية)",
    f_org: "الجهة",
    f_source: "سمية المصدر",
    f_source_url: "رابط المصدر (ضروري)",
    f_apply: "رابط الترشيح",
    f_deadline: "آخر أجل",
    f_required: "المعرّفات ديال المهارات المطلوبة، مفروقين بفاصلة",
    f_nice: "المعرّفات ديال المهارات اللي مزيان تكون",
    f_desc: "الوصف (بالفرنسية)",
    f_remote: "عن بعد",
    f_verified_today: "موثّقة (تشافت فالمصدر اليوم)",
    f_unverified: "ما موثّقاش",
    f_editorial: "تحريري",
    f_draft: "مسودة",
    f_published: "منشورة",
    f_body: "المحتوى (Markdown)",
    f_verified_at: "تاريخ التوثيق",
  },
};

const zgh: S = {
  a: {
    kicker: "ⵜⴰⵙⵎⵓⵜⵜⴳⵜ ⵏⵏⴽ ⵏ ⵜⵡⵓⵔⵉ", // review
    try: "ⴰⵔⵎ ⴰⴷ ⵜⵙⵇⵙⴰⵜ", // review
    thinking: "ⵉⵙⵙⴰⵡⴰⵍ ⴷ ⵉⵅⴼ ⵏⵏⵙ…", // review
    steps: "ⵎⴰ ⵉⵙⴽⵔ ⵓⵎⵄⴰⵡⵏ", // review
    followups: "ⵙⵇⵙⴰ ⴷⴼⴼⵉⵔ ⴰⵢⴰ", // review
    hint: "↵ ⵉ ⵓⵣⵏ · ⇧ + ↵ ⵉ ⵓⵣⵔⵉⴳ ⴰⵎⴰⵢⵏⵓ", // review
    basic_note: "ⵜⵉⵔⴰⵔⵉⵏ ⴷ ⵉⴷⴷⴰⵏ ⵙⴳ ⵜⵎⴰⵙⵉⵏⵜ ⵏ ⵉⵍⵓⴳⴰⵏ ⴷ ⵜⵖⵔⴰⵙⵜ ⵏ ⵜⵓⵙⵙⵏⴰ ⵏ BAWSALA: ⴷⵔⵓⵙⵏⵜ, ⵎⴰⵛⴰ ⴽⵓ ⵜⴰⵏⴰⴼⵓⵜ ⵜⵙⵙⵎⴰⵍ ⴰⵖⴱⴰⵍⵓ ⵏⵏⵙ.", // review
    source: "ⴰⵖⴱⴰⵍⵓ {n}",
    day: "ⴰⵙⵙ {n}",
    close_history: "ⵔⴳⵍ ⵉⵎⵙⴰⵡⴰⵍⵏ", // review
    more_steps: { one: "+ # ⵜⴰⵙⵓⵔⵉⴼⵜ ⵢⴰⴹⵏ", other: "+ # ⵜⵉⵙⵓⵔⵉⴼⵉⵏ ⵢⴰⴹⵏⵉⵏ" }, // review
  },
  ob: {
    steps: { lang: "ⵜⵓⵜⵍⴰⵢⵜ", you: "ⵅⴼ ⴽ", exp: "ⵜⵉⵔⵎⵉⵜ", skills: "ⵜⵉⵣⵎⴰⵔ", target: "ⵉⵙⵡⵉ" }, // review
    progress: "ⴰⵙⵡⵓⵔ ⵏ ⵓⵙⵡⵊⴷ", // review
    rich_title: "ⵎⴰ ⵢⴰⵜⵙⵏ ⴰⴳⵍⴰⵎ ⵉⵙⵎⵓⵔⵏ", // review
    rich_words: "15 ⵏ ⵡⴰⵡⴰⵍⵏ ⵓⴳⴳⴰⵔ", // review
    rich_number: "ⵢⴰⵏ ⵓⵎⴹⴰⵏ ⵏⵖ ⵢⴰⵜ ⵜⵢⴰⴼⵓⵜ", // review
    rich_tasks: "ⵙⵏⴰⵜ ⵜⵡⵓⵔⵉⵡⵉⵏ ⵏⵖ ⵓⴳⴳⴰⵔ", // review
    an_title: "ⴰⵔ ⵏⵖⵔⵔⴰ ⴰⵡⴰⵍ ⵏⵏⴽ…", // review
    an_save: "ⴰⵙⵎⵔⵙ ⵏ ⵜⵉⵔⵎⵉⵜ ⵏⵏⴽ", // review
    an_find: "ⴰⵔⵣⵣⵓ ⵅⴼ ⵜⵉⵣⵎⴰⵔ ⴳ ⵜⵉⴼⵔⴰⵙ ⵏⵏⴽ", // review
    an_prepare: "ⴰⵙⵡⵊⴷ ⵏ ⵉⵙⵓⵎⴰⵔ ⵏⵏⴽ", // review
    sky_caption: "ⴽⵓ ⵉⵜⵔⵉ ⵜⴳⴰ ⵜⵣⵎⵔⵜ ⵉⵜⵜⵓⵙⵓⵎⵔⵏ. ⵉⵏⵉ ⵢⴰⵀ ⴰⴷ ⵉⵙⴼⴰⵡ.", // review
    confirmed: { one: "# ⵜⵣⵎⵔⵜ ⵉⵜⵜⵓⵙⴷⵓⵙⵏ", other: "# ⵜⵉⵣⵎⴰⵔ ⵉⵜⵜⵓⵙⴷⵓⵙⵏⵉⵏ" }, // review
    pick_hint: "ⴰⵢⴰ ⵉⵙⵡⵓⴷⴷⵓ ⵖⴰⵙ ⵜⴰⵙⵎⵓⵜⵜⴳⵜ ⵏⵏⴽ. ⵓⵔ ⵉⵜⵜⵓⵣⵏ ⵓⵍⴰ ⵢⴰⵜ.", // review
  },
  sg: {
    rules: "ⵜⵓⴼⴰ ⵜⵜ ⵜⵎⴰⵙⵉⵏⵜ ⵏ ⵉⵍⵓⴳⴰⵏ", // review
    ai: "ⵜⵙⵓⵎⵔ ⵜⵜ ⵜⵎⵓⵙⵏⵉ ⵜⴰⵎⵙⵙⵓⴽⵙⵜ ⵙⴳ ⵡⴰⵡⴰⵍ ⵏⵏⴽ", // review
    added: "ⵜⵜⵓⵔⵏⴰ ⵖⵔ ⵓⴱⴰⵙⴱⵓⵔ ⵏⵏⴽ", // review
    skipped: "ⵓⵔ ⵜⵜⵓⵔⵏⴰ", // review
  },
  inst: {
    kicker: "ⴰⵙⵓⵔ ⵏ ⵜⵙⵓⴷⴰⵙⵜ", // review
    privacy_title: "ⵜⴰⵙⵔⵜⵉⵜ ⵙⴳ ⵓⵙⵏⵓⵍⴼⵓ", // review
    privacy_body: "ⵉⵎⴹⴰⵏⵏ ⵙⵙⵉⴷⴼⵏ ⵖⴰⵙ ⵉⵏⵍⵎⴰⴷⵏ ⵍⵍⵉ ⵉⵅⵜⴰⵔⵏ ⴰⴷ ⴱⴹⵓⵏ, ⴳ ⵜⵔⴰⴱⴱⵓⵜⵉⵏ ⵏ {min} ⵏⵖ ⵓⴳⴳⴰⵔ. ⵉⵙⵎⴰⵡⵏ ⴰⴷ ⴷ ⴱⴰⵢⵏⵏ ⵖⴰⵙ ⴳ ⵜⵓⵜⵔⵉⵡⵉⵏ ⵏ ⵓⵙⴱⴱⵜ ⵍⵍⵉ ⴽ ⴷ ⵙⵙⵓⴼⵓⵖⵏ ⵉⵏⵍⵎⴰⴷⵏ.", // review
    copy_code: "ⵙⵏⵖⵍ ⵜⴰⵏⴳⴰⵍⵜ ⵏ ⵓⴽⵛⴰⵎ", // review
    pending: { one: "# ⵜⵓⵜⵔⴰ ⵉⵜⵜⵔⴰⵊⵓⵏ", other: "# ⵜⵓⵜⵔⵉⵡⵉⵏ ⵉⵜⵜⵔⴰⵊⵓⵏ" }, // review
    proof: "ⴰⵏⴰⴳⵉ ⵉⵜⵜⵓⵔⵏⴰⵏ", // review
    no_proof: "ⵎⴰⵣⴰⵍ ⵓⵔ ⵉⵍⵍⵉ ⵓⵏⴰⴳⵉ", // review
    requested: "ⵉⵜⵜⵓⵜⵔ ⴳ {date}", // review
    share: "ⵜⴰⵙⵖⵓⵏⵜ ⵏ ⵉⵏⵍⵎⴰⴷⵏ ⵙ ⵜⵣⵎⵔⵜ ⴰⴷ", // review
  },
  ad: {
    kicker: "ⵜⴰⴼⵍⵡⵉⵜ ⵏ ⵓⵙⵎⵔⵙ", // review
    signals: "ⵉⵎⵜⵜⴰⵡⵏ", // review
    tools: "ⴰⵙⵎⵔⵙ ⵏ ⵉⵎⴰⵙⵙⵏ", // review
    retrieval: "ⴰⵔⵣⵣⵓ ⴳ ⵜⵓⵙⵙⵏⴰ", // review
    retrieval_d: "{n} ⵏ ⵓⵔⵣⵣⵓ · ⴰⵏⴰⵎⵎⵙ {ms} ⵎⵙ · {empty} ⴱⵍⴰ ⵜⵢⴰⴼⵓⵜ", // review
    feedback: "ⵜⵉⵏⵏⴰⵡⵉⵏ ⵅⴼ ⵜⵉⵔⴰⵔⵉⵏ", // review
    email: "ⵉⵎⴰⵢⵍⵏ ⵉⴼⴼⵖⵏ", // review
    feature: "ⵜⴰⵎⵙⵙⵓⵔⵜ", // review
    engine: "ⵜⴰⵎⴰⵙⵉⵏⵜ", // review
    tokens: "ⵉⵣⴰⵎⴰⵍⵏ ⵉⴽⵛⵎⵏ / ⵉⴼⴼⵖⵏ", // review
    flag: "ⴰⵙⵜⴰⵢ", // review
    on: "ⵉⵔⵥⵎ", // review
    slug: "ⴰⵙⵎⴰⴳⵏ", // review
    kind: "ⴰⵏⴰⵡ",
    lang: "ⵜⵓⵜⵍⴰⵢⵜ",
    title: "ⴰⵣⵡⵍ", // review
    archived: "ⴳ ⵓⵙⵔⴰⴳ", // review
    anonymous: "ⴱⵍⴰ ⵉⵙⵎ", // review
    st_open: "ⵉⵔⵥⵎ", // review
    st_in_progress: "ⴰⵔ ⵉⵜⵜⵓⵙⴽⴰⵔ", // review
    st_closed: "ⵉⵇⵇⵏ", // review
    role_student: "ⴰⵏⵍⵎⴰⴷ",
    role_institution_admin: "ⴰⵎⵙⵡⴰⵔ ⵏ ⵜⵙⵓⴷⴰⵙⵜ", // review
    role_platform_admin: "ⴰⵎⵙⵡⴰⵔ ⵏ ⵜⵖⵔⵖⴰⵔⵜ", // review
    members: { one: "# ⵓⴳⵎⴰⵎ", other: "# ⵉⴳⵎⴰⵎⵏ" }, // review
    of_signup: "{pct}% ⵙⴳ ⵉⵎⵣⵎⵎⴰⵔⵏ", // review
    f_title_fr: "ⴰⵣⵡⵍ (ⵜⴰⴼⵔⴰⵏⵙⵉⵙⵜ)", // review
    f_title_en: "ⴰⵣⵡⵍ (ⵜⴰⵏⴳⵍⵉⵣⵉⵜ)", // review
    f_title_ar: "ⴰⵣⵡⵍ (ⵜⴰⵄⵔⴰⴱⵜ)", // review
    f_org: "ⵜⴰⵙⵓⴷⴰⵙⵜ", // review
    f_source: "ⵉⵙⵎ ⵏ ⵓⵖⴱⴰⵍⵓ", // review
    f_source_url: "ⴰⵙⵖⵏ ⵏ ⵓⵖⴱⴰⵍⵓ (ⵉⵍⴰⵇ)", // review
    f_apply: "ⴰⵙⵖⵏ ⵏ ⵓⵙⵓⵜⵔ", // review
    f_deadline: "ⴰⵣⵎⵣ ⴰⵏⴳⴳⴰⵔⵓ",
    f_required: "ⵉⵙⵎⴰⴳⵏ ⵏ ⵜⵉⵣⵎⴰⵔ ⵉⵜⵜⵓⵃⵜⴰⵊⵏ, ⵙ ⵜⵉⵙⵙⵓⵜⵍⴰ", // review
    f_nice: "ⵉⵙⵎⴰⴳⵏ ⵏ ⵜⵉⵣⵎⴰⵔ ⵉⵖⵓⴷⴰⵏ", // review
    f_desc: "ⴰⴳⵍⴰⵎ (ⵜⴰⴼⵔⴰⵏⵙⵉⵙⵜ)", // review
    f_remote: "ⵙ ⵜⵉⴳⵉⵡⵜ", // review
    f_verified_today: "ⵉⵜⵜⵓⵙⴱⴱⵜ (ⵉⵜⵜⵓⵙⵙⵏ ⴳ ⵓⵖⴱⴰⵍⵓ ⴰⵙⵙⴰ)", // review
    f_unverified: "ⵓⵔ ⵉⵜⵜⵓⵙⴱⴱⵜ",
    f_editorial: "ⴰⵎⵙⵙⵓⴳⵓⵔ", // review
    f_draft: "ⴰⵙⵓⴳⵓⵔ", // review
    f_published: "ⵉⵜⵜⵓⵙⵙⵓⴼⵖ", // review
    f_body: "ⴰⴳⴱⵓⵔ (MD)", // review
    f_verified_at: "ⴰⵙⴰⴽⵓⴷ ⵏ ⵓⵙⴱⴱⵜ", // review
  },
};

export const flow = { en, fr, ar, ary, zgh };
