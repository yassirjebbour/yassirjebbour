/** Public site strings (landing, auth panel, footer). Every locale is type-checked against English. */
import type { MessagesShape } from "../../format";

const en = {
  h1_a: "Discover what you can do,",
  h1_b: "not just what you studied.",
  studio_label: "Write one sentence about something you did",
  examples: "Try an example",
  thinking: "Reading your sentence…",
  roles_title: "Example roles that fit",
  example_badge: "Example",
  why_title: "The sentence behind each skill",
  engine_note: "Analysed instantly by BAWSALA’s rules engine. Your sentence is not stored.",
  sky_label: { one: "Skill map: # skill found", other: "Skill map: # skills found" },
  marquee_label: "Everyday experiences and the skills they show",
  exp_shop: "Family shop",
  exp_club: "Student club",
  exp_summer: "Summer job",
  exp_volunteer: "Volunteering",
  exp_instagram: "An Instagram page",
  exp_tourists: "Welcoming tourists",
  exp_tutor: "Tutoring a cousin",
  exp_captain: "Team captain",
  exp_class: "A class project",
  exp_souk: "Selling at the souk",
  story_title: "From one sentence to your first job",
  story_sub: "Five steps. Each one builds on the one before.",
  illustration: "Illustration with example data",
  story_day: "Day {n}",
  story_ready: "Ready to apply",
  story_interview_q: "Tell me about a time you solved a customer’s problem.",
  story_feedback: "Clear example. Add a number to make it stronger.",
  trust_eyebrow: "Trust",
  trust_quote: "“I handle the till and talk with customers every weekend.”",
  trust_proof: "Photo of the weekly stock sheet",
  trust_by: "Confirmed by your career centre",
  states_label: "The four states of a skill",
  lang_eyebrow: "Five languages",
  lang_title: "Speak your language. BAWSALA understands.",
  lang_sub: "Darija in Arabic letters or Arabizi, Arabic, French, English or Tamazight. Switch at any time — nothing is lost.",
  final_title: "Your compass is ready.",
  final_sub: "Ten minutes today. A clear direction for the next 30 days.",
  footer_tagline: "Skills intelligence for young people in Morocco.",
  auth_quote: "Your skills are stars. BAWSALA draws the lines between them — and points to your next role.",
  auth_point_1: "Skills found in your own words, with the sentence behind each one",
  auth_point_2: "Roles ranked by what you can already do",
  auth_point_3: "A 30-day path where every proof goes into your passport",
};
type S = MessagesShape<typeof en>;

const fr: S = {
  h1_a: "Découvrez ce que vous savez faire,",
  h1_b: "pas seulement ce que vous avez étudié.",
  studio_label: "Écrivez une phrase sur quelque chose que vous avez fait",
  examples: "Essayez un exemple",
  thinking: "Lecture de votre phrase…",
  roles_title: "Exemples de postes qui correspondent",
  example_badge: "Exemple",
  why_title: "La phrase derrière chaque compétence",
  engine_note: "Analyse instantanée par le moteur de règles de BAWSALA. Votre phrase n’est pas enregistrée.",
  sky_label: { one: "Carte des compétences : # compétence trouvée", other: "Carte des compétences : # compétences trouvées" },
  marquee_label: "Des expériences du quotidien et les compétences qu’elles montrent",
  exp_shop: "Boutique familiale",
  exp_club: "Club étudiant",
  exp_summer: "Job d’été",
  exp_volunteer: "Bénévolat",
  exp_instagram: "Une page Instagram",
  exp_tourists: "Accueillir des touristes",
  exp_tutor: "Aider un cousin à réviser",
  exp_captain: "Capitaine d’équipe",
  exp_class: "Un projet de classe",
  exp_souk: "Vendre au souk",
  story_title: "D’une phrase à votre premier emploi",
  story_sub: "Cinq étapes. Chacune s’appuie sur la précédente.",
  illustration: "Illustration avec des données d’exemple",
  story_day: "Jour {n}",
  story_ready: "Prêt·e à postuler",
  story_interview_q: "Parlez-moi d’une fois où vous avez résolu le problème d’un client.",
  story_feedback: "Exemple clair. Ajoutez un chiffre pour le renforcer.",
  trust_eyebrow: "Confiance",
  trust_quote: "« Je tiens la caisse et je parle avec les clients chaque week-end. »",
  trust_proof: "Photo du tableau de stock hebdomadaire",
  trust_by: "Confirmé par votre centre de carrière",
  states_label: "Les quatre états d’une compétence",
  lang_eyebrow: "Cinq langues",
  lang_title: "Parlez votre langue. BAWSALA comprend.",
  lang_sub: "La darija en lettres arabes ou en arabizi, l’arabe, le français, l’anglais ou le tamazight. Changez quand vous voulez — rien n’est perdu.",
  final_title: "Votre boussole est prête.",
  final_sub: "Dix minutes aujourd’hui. Une direction claire pour les 30 prochains jours.",
  footer_tagline: "L’intelligence des compétences pour les jeunes au Maroc.",
  auth_quote: "Vos compétences sont des étoiles. BAWSALA trace les liens entre elles — et indique votre prochain poste.",
  auth_point_1: "Des compétences trouvées dans vos propres mots, avec la phrase qui les montre",
  auth_point_2: "Des postes classés selon ce que vous savez déjà faire",
  auth_point_3: "Un parcours de 30 jours où chaque preuve rejoint votre passeport",
};

const ar: S = {
  h1_a: "اكتشف ما تستطيع فعله،",
  h1_b: "لا ما درسته فقط.",
  studio_label: "اكتب جملة واحدة عن شيء قمتَ به",
  examples: "جرّب مثالاً",
  thinking: "نقرأ جملتك…",
  roles_title: "أمثلة لوظائف تناسبك",
  example_badge: "مثال",
  why_title: "الجملة التي تُظهر كل مهارة",
  engine_note: "تحليل فوري بمحرّك القواعد في بوصلة. لا تُحفظ جملتك.",
  sky_label: { zero: "خريطة المهارات: لم نجد مهارات", one: "خريطة المهارات: مهارة واحدة", two: "خريطة المهارات: مهارتان", few: "خريطة المهارات: # مهارات", many: "خريطة المهارات: # مهارة", other: "خريطة المهارات: # مهارة" },
  marquee_label: "تجارب يومية والمهارات التي تُظهرها",
  exp_shop: "متجر العائلة",
  exp_club: "نادٍ طلابي",
  exp_summer: "عمل صيفي",
  exp_volunteer: "التطوّع",
  exp_instagram: "صفحة على إنستغرام",
  exp_tourists: "استقبال السيّاح",
  exp_tutor: "مساعدة قريب في الدراسة",
  exp_captain: "قائد فريق",
  exp_class: "مشروع دراسي",
  exp_souk: "البيع في السوق",
  story_title: "من جملة واحدة إلى عملك الأول",
  story_sub: "خمس خطوات، كل واحدة تُبنى على التي قبلها.",
  illustration: "رسم توضيحي ببيانات مثال",
  story_day: "اليوم {n}",
  story_ready: "جاهز للتقديم",
  story_interview_q: "حدّثني عن موقف حللتَ فيه مشكلة زبون.",
  story_feedback: "مثال واضح. أضف رقماً ليصبح أقوى.",
  trust_eyebrow: "الثقة",
  trust_quote: "«أتولّى الصندوق وأتحدث مع الزبائن كل نهاية أسبوع.»",
  trust_proof: "صورة لجدول المخزون الأسبوعي",
  trust_by: "أكّدها مركز التوجيه المهني",
  states_label: "الحالات الأربع للمهارة",
  lang_eyebrow: "خمس لغات",
  lang_title: "تكلّم بلغتك. بوصلة تفهمك.",
  lang_sub: "الدارجة بالحروف العربية أو اللاتينية، والعربية، والفرنسية، والإنجليزية، والأمازيغية. غيّر اللغة متى شئت دون أن تفقد شيئاً.",
  final_title: "بوصلتك جاهزة.",
  final_sub: "عشر دقائق اليوم، واتجاه واضح للأيام الثلاثين القادمة.",
  footer_tagline: "ذكاء المهارات للشباب في المغرب.",
  auth_quote: "مهاراتك نجوم. بوصلة ترسم الخطوط بينها، وتشير إلى وظيفتك القادمة.",
  auth_point_1: "مهارات تُكتشف من كلماتك، مع الجملة التي تُظهر كل واحدة",
  auth_point_2: "وظائف مرتّبة حسب ما تستطيع فعله الآن",
  auth_point_3: "مسار من 30 يوماً، كل دليل فيه يدخل جوازك",
};

const ary: S = {
  h1_a: "اكتاشف شنو كتعرف دير،",
  h1_b: "ماشي غير شنو قريتي.",
  studio_label: "كتب جملة وحدة على شي حاجة درتيها",
  examples: "جرّب مثال",
  thinking: "كنقراو الجملة ديالك…",
  roles_title: "أمثلة ديال خدمات مناسبين ليك",
  example_badge: "مثال",
  why_title: "الجملة اللي كتبيّن كل مهارة",
  engine_note: "تحليل فالبلاصة بمحرّك القواعد ديال بوصلة. الجملة ديالك ما كتتسجّلش.",
  sky_label: { zero: "خريطة المهارات: ما لقينا حتى مهارة", one: "خريطة المهارات: مهارة وحدة", two: "خريطة المهارات: جوج مهارات", few: "خريطة المهارات: # مهارات", many: "خريطة المهارات: # مهارة", other: "خريطة المهارات: # مهارة" },
  marquee_label: "تجارب ديال كل نهار والمهارات اللي كتبيّن",
  exp_shop: "حانوت العائلة",
  exp_club: "نادي فالكلية",
  exp_summer: "خدمة ديال الصيف",
  exp_volunteer: "التطوّع",
  exp_instagram: "صفحة فإنستغرام",
  exp_tourists: "استقبال السيّاح",
  exp_tutor: "كتعاون ولد عمّك فالقراية",
  exp_captain: "كابيتان ديال الفرقة",
  exp_class: "مشروع فالقراية",
  exp_souk: "البيع فالسوق",
  story_title: "من جملة وحدة حتى للخدمة الأولى ديالك",
  story_sub: "خمس خطوات، كل وحدة مبنية على اللي قبلها.",
  illustration: "رسم توضيحي بمعطيات ديال مثال",
  story_day: "النهار {n}",
  story_ready: "واجد تقدّم",
  story_interview_q: "عاود ليّا على مرة حلّيتي فيها مشكل ديال شي كليان.",
  story_feedback: "مثال واضح. زيد شي رقم باش يولّي أقوى.",
  trust_eyebrow: "الثقة",
  trust_quote: "«كنسيّر الكاسة وكنهضر مع الكليان كل ويكاند.»",
  trust_proof: "تصويرة ديال جدول السلعة ديال السيمانة",
  trust_by: "أكّداتها مصلحة التوجيه ديال الكلية",
  states_label: "الحالات الأربعة ديال المهارة",
  lang_eyebrow: "خمس لغات",
  lang_title: "هضر بلغتك. بوصلة كتفهمك.",
  lang_sub: "الدارجة بالحروف العربية ولا بالعربيزي، العربية، الفرنسية، الإنجليزية ولا الأمازيغية. بدّل اللغة وقتما بغيتي وما غادي يضيع والو.",
  final_title: "البوصلة ديالك واجدة.",
  final_sub: "عشر دقايق اليوم، وطريق واضح لـ30 يوم الجايين.",
  footer_tagline: "ذكاء المهارات للشباب فالمغرب.",
  auth_quote: "المهارات ديالك نجوم. بوصلة كترسم الخيوط بيناتهم، وكتورّيك الخدمة الجاية.",
  auth_point_1: "مهارات كتلقاها من الكلام ديالك، مع الجملة اللي كتبيّن كل وحدة",
  auth_point_2: "خدمات مرتّبين على حساب شنو كتعرف دير دابا",
  auth_point_3: "طريق ديال 30 يوم، كل دليل فيه كيدخل للجواز ديالك",
};

const zgh: S = {
  h1_a: "ⴰⴼ ⵎⴰ ⵜⵣⵎⵔⵜ ⴰⴷ ⵜⵙⴽⵔⵜ,",
  h1_b: "ⵓⵔ ⴷ ⵖⴰⵙ ⵎⴰ ⵜⵖⵔⵉⵜ.",
  studio_label: "ⴰⵔⵉ ⵢⴰⵜ ⵜⴼⵢⵉⵔⵜ ⵖⴼ ⴽⵔⴰ ⵜⵙⴽⵔⵜ",
  examples: "ⵄⵔⴹ ⵢⴰⵏ ⵓⵎⴷⵢⴰ", // review
  thinking: "ⴰⵔ ⵏⵖⵔⵔⴰ ⵜⴰⴼⵢⵉⵔⵜ ⵏⵏⴽ…", // review
  roles_title: "ⵉⵎⴷⵢⴰ ⵏ ⵜⵡⵓⵔⵉⵡⵉⵏ ⵍⵍⵉ ⴽ ⵉⵍⴰⵇⵏ", // review
  example_badge: "ⴰⵎⴷⵢⴰ",
  why_title: "ⵜⴰⴼⵢⵉⵔⵜ ⵍⵍⵉ ⵉⵙⵙⴽⴰⵏⵏ ⴽⵔⴰⵢⴳⴰⵜⵜ ⵜⴰⵣⵎⵔⵜ", // review
  engine_note: "ⴰⵙⵖⵣⵏ ⵉⵎⵉⴽ ⵙ ⵓⵎⵙⵙⵓⴷⵙ ⵏ ⵜⵏⴼⵍⵓⵜⵉⵏ ⵏ ⴱⴰⵡⵙⴰⵍⴰ. ⵜⴰⴼⵢⵉⵔⵜ ⵏⵏⴽ ⵓⵔ ⵜⵜⵓⵃⴹⴰ.", // review
  sky_label: { one: "ⴰⴽⴰⵔⵟⵉ ⵏ ⵜⵉⵣⵎⴰⵔ: # ⵜⵣⵎⵔⵜ", other: "ⴰⴽⴰⵔⵟⵉ ⵏ ⵜⵉⵣⵎⴰⵔ: # ⵜⵉⵣⵎⴰⵔ" }, // review
  marquee_label: "ⵜⵉⵔⵎⵉⵜⵉⵏ ⵏ ⴽⵓ ⴰⵙⵙ ⴷ ⵜⵉⵣⵎⴰⵔ ⵍⵍⵉ ⵙⵙⴽⴰⵏⵏⵜ", // review
  exp_shop: "ⵜⴰⵃⴰⵏⵓⵜ ⵏ ⵜⵡⴰⵛⵓⵍⵜ",
  exp_club: "ⴰⴽⵍⵓⴱ ⵏ ⵉⵏⵍⵎⴰⴷⵏ", // review
  exp_summer: "ⵜⴰⵡⵓⵔⵉ ⵏ ⵓⵏⴱⴷⵓ", // review
  exp_volunteer: "ⵜⴰⵡⵓⵔⵉ ⵙ ⵓⴼⵓⵙ",
  exp_instagram: "ⵜⴰⵙⵏⴰ ⴳ Instagram", // review
  exp_tourists: "ⴰⵙⵏⵓⴱⴳ ⵏ ⵉⵎⵔⵣⵉⴳⵏ", // review
  exp_tutor: "ⴰⵙⵍⵎⴷ ⵉ ⵢⵉⵡ ⵏ ⵄⵎⵎⵉ", // review
  exp_captain: "ⴰⵏⴱⴱⴰⴹ ⵏ ⵜⵔⴱⴰⵄⵜ", // review
  exp_class: "ⴰⵙⵏⴼⴰⵔ ⴳ ⵜⵖⵓⵔⵉ", // review
  exp_souk: "ⴰⵣⵣⵏⵣⵉ ⴳ ⵓⵙⵡⵉⵇ", // review
  story_title: "ⵙⴳ ⵢⴰⵜ ⵜⴼⵢⵉⵔⵜ ⴰⵔ ⵜⴰⵡⵓⵔⵉ ⵏⵏⴽ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ", // review
  story_sub: "ⵙⵎⵓⵙ ⵏ ⵜⵙⵓⵔⵉⴼⵉⵏ. ⴽⵔⴰⵢⴳⴰⵜⵜ ⵢⴰⵜ ⵜⴱⵏⴰ ⵖⴼ ⵜⵉⵏ ⵣⵡⴰⵔⵏⵉⵏ.", // review
  illustration: "ⴰⵙⵓⵏⵖ ⵙ ⵉⵙⴼⴽⴰ ⵏ ⵓⵎⴷⵢⴰ", // review
  story_day: "ⴰⵙⵙ {n}",
  story_ready: "ⵉⵡⵊⴷ ⵉ ⵓⵙⵓⵜⵔ", // review
  story_interview_q: "ⵉⵏⵉ ⵢⵉ ⵖⴼ ⵢⴰⵜ ⵜⵉⴽⴽⵍⵜ ⵜⴼⵙⵉⵜ ⴳⵉⵙ ⵜⴰⵎⵓⴽⵔⵉⵙⵜ ⵏ ⵓⵎⵙⴰⵖ.", // review
  story_feedback: "ⴰⵎⴷⵢⴰ ⵉⴼⴰⵡⵏ. ⵔⵏⵓ ⵢⴰⵏ ⵓⵎⴹⴰⵏ ⴰⴷ ⵉⴳ ⵓⴳⴳⴰⵔ ⵜⴰⴷⵓⵙⵉ.", // review
  trust_eyebrow: "ⵜⴰⴼⵍⵙⵜ", // review
  trust_quote: "«ⴰⵔ ⵜⵜⴹⴼⴰⵔⵖ ⵜⴰⵙⵏⴷⵓⵇⵜ ⴰⵔ ⵙⴰⵡⴰⵍⵖ ⴷ ⵉⵎⵙⴰⵖⵏ ⴽⵓ ⵜⴰⵏⴳⵉⵔⴰ ⵏ ⵉⵎⴰⵍⴰⵙ.»", // review
  trust_proof: "ⵜⴰⵡⵍⴰⴼⵜ ⵏ ⵜⴼⵍⵡⵉⵜ ⵏ ⵓⵙⵖⴱⴰⵍⵓ ⵏ ⵉⵎⴰⵍⴰⵙ", // review
  trust_by: "ⵜⵙⴱⴱⵜ ⵜⵜ ⵜⵙⵓⴷⴰⵙⵜ ⵏⵏⴽ", // review
  states_label: "ⴽⴽⵓⵥ ⵏ ⵜⴰⴷⴷⵓⵔⵉⵡⵉⵏ ⵏ ⵜⵣⵎⵔⵜ", // review
  lang_eyebrow: "ⵙⵎⵓⵙ ⵏ ⵜⵓⵜⵍⴰⵢⵉⵏ",
  lang_title: "ⵙⵙⵉⵡⵍ ⵙ ⵜⵓⵜⵍⴰⵢⵜ ⵏⵏⴽ. ⴱⴰⵡⵙⴰⵍⴰ ⴰⴷ ⴽ ⵜⴼⵀⵎ.", // review
  lang_sub: "ⵜⴰⴷⴰⵔⵉⵊⵜ, ⵜⴰⵄⵔⴰⴱⵜ, ⵜⴰⴼⵔⴰⵏⵙⵉⵙⵜ, ⵜⴰⵏⴳⵍⵉⵣⵜ ⵏⵉⵖ ⵜⴰⵎⴰⵣⵉⵖⵜ. ⵙⵏⴼⵍ ⵜⵓⵜⵍⴰⵢⵜ ⴽⵔⴰⵢⴳⴰⵜⵜ ⵜⵉⴽⴽⵍⵜ — ⵓⵔ ⵉⵜⵜⵓⵔⵥⴰ ⵡⴰⵍⵓ.", // review
  final_title: "ⵜⴰⴱⵓⵙⵍⴰ ⵏⵏⴽ ⵜⵡⵊⴷ.", // review
  final_sub: "ⵎⵔⴰⵡ ⵜⵓⵙⴷⵉⴷⵉⵏ ⴰⵙⵙ ⴰ. ⵢⴰⵏ ⵓⴱⵔⵉⴷ ⵉⴼⴰⵡⵏ ⵉ 30 ⵡⵓⵙⵙⴰⵏ ⵉⴷ ⵉⵜⵜⴰⵙⵏ.", // review
  footer_tagline: "ⵜⵉⵎⵙⵙⵓⴽⵙⵜ ⵏ ⵜⵉⵣⵎⴰⵔ ⵉ ⵉⵎⵓⵔⴰⵢⵏ ⴳ ⵍⵎⵖⵔⵉⴱ.", // review
  auth_quote: "ⵜⵉⵣⵎⴰⵔ ⵏⵏⴽ ⴷ ⵉⵜⵔⴰⵏ. ⴱⴰⵡⵙⴰⵍⴰ ⴰⵔ ⵜⵙⵙⵓⵔⵓⵢ ⵉⵣⵔⵉⴳⵏ ⴳⵔ ⴰⵙⵏⵜ — ⵜⵙⵙⴽⴰⵏ ⵜⴰⵡⵓⵔⵉ ⵏⵏⴽ ⵢⵓⵛⴽⴰⵏ.", // review
  auth_point_1: "ⵜⵉⵣⵎⴰⵔ ⵜⵜⵡⴰⴼⵏⵜ ⵙⴳ ⵡⴰⵡⴰⵍ ⵏⵏⴽ, ⵙ ⵜⴼⵢⵉⵔⵜ ⵍⵍⵉ ⵜⵏⵜ ⵉⵙⵙⴽⴰⵏⵏ",
  auth_point_2: "ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⵜⵜⵡⴰⵙⵙⵎⵓⵜⵜⴳⵏⵜ ⵙ ⵎⴰ ⵜⵣⵎⵔⵜ ⴰⴷ ⵜⵙⴽⵔⵜ ⵖⵉⵍⴰ", // review
  auth_point_3: "ⵢⴰⵏ ⵓⴱⵔⵉⴷ ⵏ 30 ⵡⵓⵙⵙⴰⵏ, ⴽⵔⴰⵢⴳⴰⵜⵜ ⴰⵏⴰⴳⵉ ⴰⴷ ⵉⴽⵛⵎ ⵖⵔ ⵓⴱⴰⵙⴱⵓⵔ ⵏⵏⴽ",
};

export const home = { en, fr, ar, ary, zgh };
