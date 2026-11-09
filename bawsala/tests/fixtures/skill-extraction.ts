/**
 * Labelled multilingual dataset for skill extraction (deterministic engine and LLM).
 * `expected` = skills a careful human reviewer finds clearly shown in the text.
 * `forbidden` = skills that must NOT be suggested (negations, wishes, plans).
 * Written by the BAWSALA team for evaluation; extend with real (consented, anonymised) inputs.
 */
export interface Case { id: string; lang: "en" | "fr" | "ar" | "ary_ar" | "ary_lat" | "zgh" | "mixed"; text: string; expected: string[]; forbidden?: string[] }

export const CASES: Case[] = [
  { id: "en-shop", lang: "en", text: "I help at my family's shop: I handle the till, talk with customers every day and track stock in Excel.", expected: ["cash", "customer_service", "inventory", "excel"] },
  { id: "en-club", lang: "en", text: "I organised a charity event for our student club with 80 people and led a team of 5 volunteers.", expected: ["event", "leadership", "teamwork"] },
  { id: "en-insta", lang: "en", text: "I sell handmade bags on Instagram, I make the photos and reels myself and ran two sponsored ads.", expected: ["sales", "social_media", "content", "ads"] },
  { id: "en-neg", lang: "en", text: "I have never sold anything and I don't know Excel yet, but I want to learn sales.", expected: [], forbidden: ["sales", "excel"] },
  { id: "en-data", lang: "en", text: "For my thesis I ran a survey of 200 students and analysed the results with SPSS, then presented them to a jury.", expected: ["research", "data_analysis", "presentation"] },
  { id: "fr-stage", lang: "fr", text: "Étudiante en gestion, j'ai fait un stage de 2 mois en comptabilité, je gère la caisse du magasin de ma mère et je parle trois langues.", expected: ["accounting", "cash", "multilingual"] },
  { id: "fr-event", lang: "fr", text: "J'ai organisé un tournoi de football pour l'association du quartier et négocié avec les fournisseurs pour les maillots.", expected: ["event", "leadership", "negotiation"] },
  { id: "fr-neg", lang: "fr", text: "Je n'ai jamais fait de vente et je ne connais pas Excel.", expected: [], forbidden: ["sales", "excel"] },
  { id: "fr-web", lang: "fr", text: "J'ai développé un site web en HTML, CSS et JavaScript pour un restaurant et rédigé tous les textes.", expected: ["programming", "writing"] },
  { id: "ar-msa", lang: "ar", text: "أدرت صندوق المتجر وتعاملت مع الزبائن وأعددت عروضاً تقديمية باستخدام إكسل.", expected: ["cash", "customer_service", "excel"] },
  { id: "ar-msa2", lang: "ar", text: "نظمت حملة توعية في الجامعة مع فريق من المتطوعين وقمت ببحث ميداني عبر استمارة.", expected: ["event", "teamwork", "research"] },
  { id: "ary-ar-shop", lang: "ary_ar", text: "كنعاون الواليد فالحانوت ديال العائلة: كنسيّر الكاسة، كنهضر مع الكليان وكنتبع السلعة فExcel.", expected: ["cash", "customer_service", "inventory", "excel"] },
  { id: "ary-ar-insta", lang: "ary_ar", text: "كنبيع الحوايج فإنستغرام وكنصوّر الفيديوهات بوحدي.", expected: ["sales", "social_media", "content"] },
  { id: "ary-ar-event", lang: "ary_ar", text: "كنت مسؤول على نشاط ديال الجمعية حضرو فيه 80 واحد.", expected: ["leadership", "event", "teamwork"] },
  { id: "ary-lat-shop", lang: "ary_lat", text: "kansa3ed baba f7anout, kanbi3 l klyan w kanhseb lflous f lkasa", expected: ["sales", "customer_service", "cash"] },
  { id: "ary-lat-event", lang: "ary_lat", text: "organisit nashat dyal nadi f l3am li fat w kan m3aya fari9 dyal 6 dyal nass", expected: ["leadership", "event", "teamwork"] },
  { id: "ary-lat-insta", lang: "ary_lat", text: "kanbi3 lhwayej f insta w kandir sponso", expected: ["sales", "social_media", "ads"] },
  { id: "ary-lat-neg", lang: "ary_lat", text: "ma3ndi hta tajriba walakin kanbghi nkhdem f marketing", expected: [], forbidden: ["sales", "ads", "social_media"] },
  { id: "zgh-shop", lang: "zgh", text: "ⵜⵜⵖⵔⵖ ⴰⵙⴳⴳⵯⴰⵙ ⴰⵏⴳⴳⴰⵔⵓ. ⴰⵔ ⵙⵅⴷⴰⵎⵖ Excel ⴰⴷ ⴹⴼⵔⵖ ⴰⵣⵣⵏⵣⵉ ⵏ ⵜⵃⴰⵏⵓⵜ.", expected: ["excel", "sales"] },
  { id: "mixed-cs", lang: "mixed", text: "Je travaille comme agent call center, kanjaweb 3la les appels dyal les clients et je résous leurs problèmes.", expected: ["customer_service", "problem_solving"] },
  { id: "noise", lang: "en", text: "asdf qwer zxcv lorem ipsum", expected: [] },
];
