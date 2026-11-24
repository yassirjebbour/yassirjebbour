/**
 * Labelled retrieval evaluation set. Each query lists the knowledge-base document(s) that answer it.
 * Language codes: en, fr, ar (MSA), ary_ar (Darija, Arabic script), ary_lat (Darija, Latin/Arabizi), zgh (Tifinagh).
 * Written by the BAWSALA team; queries are phrased the way students actually ask (short, informal).
 */
export interface RQ { q: string; lang: "en" | "fr" | "ar" | "ary_ar" | "ary_lat" | "zgh"; expect: string[] }

export const QUERIES: RQ[] = [
  // ANAPEC
  { lang: "en", q: "How do I register with ANAPEC?", expect: ["ma-anapec"] },
  { lang: "fr", q: "Comment s'inscrire à l'ANAPEC pour chercher un emploi ?", expect: ["ma-anapec"] },
  { lang: "ar", q: "كيف أسجل في الوكالة الوطنية لإنعاش التشغيل؟", expect: ["ma-anapec"] },
  { lang: "ary_ar", q: "كيفاش نتسجل فأنابيك باش نلقى خدمة؟", expect: ["ma-anapec"] },
  { lang: "ary_lat", q: "kifach ntsejel f anapec bach nl9a khdma", expect: ["ma-anapec"] },
  { lang: "zgh", q: "ⵎⴰⵎⴽ ⴰⴷ ⵙⵊⵊⵍⵖ ⴳ ANAPEC?", expect: ["ma-anapec"] },
  // OFPPT / vocational training
  { lang: "en", q: "Where can I do vocational training to learn a trade?", expect: ["ma-ofppt"] },
  { lang: "fr", q: "formation professionnelle technicien spécialisé inscription", expect: ["ma-ofppt"] },
  { lang: "ar", q: "أين يمكنني الحصول على تكوين مهني؟", expect: ["ma-ofppt"] },
  { lang: "ary_lat", q: "bghit ndir takwin mihani f ofppt", expect: ["ma-ofppt"] },
  // self-employment
  { lang: "en", q: "How can I work as a freelancer legally in Morocco?", expect: ["ma-auto-entrepreneur"] },
  { lang: "fr", q: "Comment devenir auto-entrepreneur au Maroc ?", expect: ["ma-auto-entrepreneur"] },
  { lang: "ar", q: "كيف أصبح مقاولاً ذاتياً؟", expect: ["ma-auto-entrepreneur"] },
  { lang: "ary_ar", q: "بغيت نخدم بوحدي كمقاول ذاتي، كيفاش؟", expect: ["ma-auto-entrepreneur"] },
  // labour market statistics
  { lang: "en", q: "What is the youth unemployment rate in Morocco?", expect: ["ma-labour-market-hcp-2026-q2"] },
  { lang: "fr", q: "taux de chômage des diplômés au Maroc", expect: ["ma-labour-market-hcp-2026-q2"] },
  { lang: "ar", q: "ما هو معدل البطالة عند الشباب في المغرب؟", expect: ["ma-labour-market-hcp-2026-q2"] },
  { lang: "ary_lat", q: "ch7al nisba dyal chomage f lmaghrib", expect: ["ma-labour-market-hcp-2026-q2"] },
  // interview
  { lang: "en", q: "How should I answer interview questions?", expect: ["guide-interview-star"] },
  { lang: "fr", q: "Comment réussir un entretien d'embauche ?", expect: ["guide-interview-star"] },
  { lang: "ar", q: "كيف أستعد لمقابلة العمل؟", expect: ["guide-interview-star"] },
  { lang: "ary_ar", q: "كيفاش نوجد راسي للمقابلة ديال الخدمة؟", expect: ["guide-interview-star"] },
  { lang: "ary_lat", q: "kifach nwajad rasi l mo9abala dyal lkhdma", expect: ["guide-interview-star"] },
  // CV
  { lang: "en", q: "How do I write a good CV?", expect: ["guide-cv-morocco", "intl-europass"] },
  { lang: "fr", q: "Comment rédiger mon CV en une page ?", expect: ["guide-cv-morocco"] },
  { lang: "ar", q: "كيف أكتب سيرة ذاتية جيدة؟", expect: ["guide-cv-morocco", "intl-europass"] },
  { lang: "ary_lat", q: "kifach nkteb cv mzyan", expect: ["guide-cv-morocco"] },
  // informal experience
  { lang: "en", q: "Does helping in my family's shop count as experience?", expect: ["guide-informal-experience"] },
  { lang: "fr", q: "Le travail dans le commerce familial compte-t-il comme expérience ?", expect: ["guide-informal-experience"] },
  { lang: "ary_ar", q: "واش الخدمة فالحانوت ديال العائلة كتحسب تجربة؟", expect: ["guide-informal-experience"] },
  { lang: "ary_lat", q: "wach lkhdma f 7anout dyal l3a2ila kat7seb tajriba", expect: ["guide-informal-experience"] },
  // passport states
  { lang: "en", q: "What does a verified skill mean?", expect: ["guide-proving-skills"] },
  { lang: "fr", q: "Quelle différence entre compétence prouvée et vérifiée ?", expect: ["guide-proving-skills"] },
  { lang: "ar", q: "ما معنى مهارة موثقة؟", expect: ["guide-proving-skills"] },
  // Europe
  { lang: "en", q: "CV format for applying to a scholarship in Europe", expect: ["intl-europass"] },
  { lang: "fr", q: "niveaux de langue A1 B2 C1 pour postuler à l'étranger", expect: ["intl-europass"] },
  // skills & roles (generated docs)
  { lang: "en", q: "Where can I learn SQL for free?", expect: ["skill-sql"] },
  { lang: "fr", q: "cours gratuit Power BI", expect: ["skill-powerbi"] },
  { lang: "ar", q: "كيف أتعلم التفاوض؟", expect: ["skill-negotiation"] },
  { lang: "en", q: "What skills does a business development associate need?", expect: ["occupation-bizdev"] },
  { lang: "fr", q: "compétences pour devenir community manager", expect: ["occupation-community", "occupation-marketing"] },
  { lang: "ary_lat", q: "chno khasni bach nwli analyst", expect: ["occupation-analyst"] },
];
