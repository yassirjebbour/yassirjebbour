/* Generated from the BAWSALA v2 prototype data (scripts in PROJECT_STATUS.md) and then curated.
 * Content languages: en / fr / ar. Darija falls back to Arabic, Tamazight to French for
 * professional content until a native reviewer signs off (see docs/I18N.md). */
import type { Localized } from "../../i18n/config";

export interface SkillDef { id: string; category: string; names: Localized; learn: { title: Localized; hours: number | null; url: string | null } | null }
export interface SampleOpportunity { slug: string; organization: string; city: string; kind: "job" | "internship"; title: Localized; required: string[]; nice: string[]; project?: Localized }

export const SKILLS: SkillDef[] = [
 {
  "id": "customer_service",
  "category": "communication",
  "names": {
   "en": "Customer service",
   "fr": "Service client",
   "ar": "خدمة الزبائن"
  },
  "learn": {
   "title": {
    "en": "HubSpot Academy — customer service course",
    "fr": "HubSpot Academy — cours sur le service client",
    "ar": "HubSpot Academy — دورة في خدمة الزبائن"
   },
   "hours": 4,
   "url": "https://academy.hubspot.com/courses"
  }
 },
 {
  "id": "sales",
  "category": "communication",
  "names": {
   "en": "Sales",
   "fr": "Vente",
   "ar": "البيع"
  },
  "learn": {
   "title": {
    "en": "HubSpot Academy — Inbound Sales",
    "fr": "HubSpot Academy — Inbound Sales",
    "ar": "HubSpot Academy — دورة Inbound Sales"
   },
   "hours": 5,
   "url": "https://academy.hubspot.com/courses/inbound-sales"
  }
 },
 {
  "id": "negotiation",
  "category": "communication",
  "names": {
   "en": "Negotiation",
   "fr": "Négociation",
   "ar": "التفاوض"
  },
  "learn": {
   "title": {
    "en": "Coursera — Successful Negotiation",
    "fr": "Coursera — Successful Negotiation",
    "ar": "Coursera — دورة Successful Negotiation"
   },
   "hours": 6,
   "url": "https://www.coursera.org/learn/negotiation-skills"
  }
 },
 {
  "id": "cash",
  "category": "operations",
  "names": {
   "en": "Cash handling",
   "fr": "Gestion de caisse",
   "ar": "تسيير الصندوق"
  },
  "learn": {
   "title": {
    "en": "Khan Academy — budgeting basics",
    "fr": "Khan Academy — bases du budget",
    "ar": "Khan Academy — أساسيات الميزانية"
   },
   "hours": 3,
   "url": "https://www.khanacademy.org/college-careers-more/personal-finance"
  }
 },
 {
  "id": "inventory",
  "category": "operations",
  "names": {
   "en": "Stock management",
   "fr": "Gestion de stock",
   "ar": "تسيير المخزون"
  },
  "learn": {
   "title": {
    "en": "A short course on stock basics: FIFO and reorder points",
    "fr": "Un cours court sur la gestion de stock : FIFO et point de commande",
    "ar": "دورة قصيرة في أساسيات المخزون: FIFO ونقطة إعادة الطلب"
   },
   "hours": 4,
   "url": null
  }
 },
 {
  "id": "social_media",
  "category": "digital",
  "names": {
   "en": "Social media",
   "fr": "Réseaux sociaux",
   "ar": "شبكات التواصل الاجتماعي"
  },
  "learn": {
   "title": {
    "en": "Meta Blueprint — organic social basics",
    "fr": "Meta Blueprint — bases des réseaux sociaux",
    "ar": "Meta Blueprint — أساسيات المحتوى غير المموَّل على شبكات التواصل"
   },
   "hours": 4,
   "url": "https://www.facebook.com/business/learn"
  }
 },
 {
  "id": "content",
  "category": "digital",
  "names": {
   "en": "Content creation",
   "fr": "Création de contenu",
   "ar": "صناعة المحتوى"
  },
  "learn": {
   "title": {
    "en": "Canva Design School — lessons",
    "fr": "Canva Design School — leçons",
    "ar": "Canva Design School — دروس"
   },
   "hours": 4,
   "url": "https://www.canva.com/designschool/"
  }
 },
 {
  "id": "teamwork",
  "category": "people",
  "names": {
   "en": "Teamwork",
   "fr": "Travail d’équipe",
   "ar": "العمل الجماعي"
  },
  "learn": {
   "title": {
    "en": "A guide to team roles (Belbin)",
    "fr": "Un guide des rôles d’équipe (Belbin)",
    "ar": "دليل أدوار الفريق (Belbin)"
   },
   "hours": 2,
   "url": null
  }
 },
 {
  "id": "leadership",
  "category": "people",
  "names": {
   "en": "Leading people",
   "fr": "Diriger une équipe",
   "ar": "قيادة الفرق"
  },
  "learn": {
   "title": {
    "en": "Coursera — Leading People and Teams",
    "fr": "Coursera — Leading People and Teams",
    "ar": "Coursera — دورة قيادة الفرق"
   },
   "hours": 5,
   "url": null
  }
 },
 {
  "id": "event",
  "category": "operations",
  "names": {
   "en": "Event planning",
   "fr": "Organisation d’événements",
   "ar": "تنظيم الأنشطة"
  },
  "learn": {
   "title": {
    "en": "An event-planning checklist and budget template",
    "fr": "Une liste de contrôle et un modèle de budget d’événement",
    "ar": "قائمة تحقّق ونموذج ميزانية لتنظيم نشاط"
   },
   "hours": 3,
   "url": null
  }
 },
 {
  "id": "research",
  "category": "analysis",
  "names": {
   "en": "Research",
   "fr": "Recherche",
   "ar": "البحث"
  },
  "learn": {
   "title": {
    "en": "Google Forms + a survey-design guide",
    "fr": "Google Forms + un guide de conception de questionnaire",
    "ar": "Google Forms ودليل لتصميم الاستبيانات"
   },
   "hours": 4,
   "url": null
  }
 },
 {
  "id": "presentation",
  "category": "people",
  "names": {
   "en": "Presenting",
   "fr": "Prise de parole",
   "ar": "العرض والتقديم"
  },
  "learn": {
   "title": {
    "en": "Coursera — Introduction to Public Speaking",
    "fr": "Coursera — Introduction to Public Speaking",
    "ar": "Coursera — مقدمة في التحدث أمام الجمهور"
   },
   "hours": 4,
   "url": null
  }
 },
 {
  "id": "problem_solving",
  "category": "analysis",
  "names": {
   "en": "Problem solving",
   "fr": "Résolution de problèmes",
   "ar": "حلّ المشكلات"
  },
  "learn": {
   "title": {
    "en": "The 5 Whys method, with one real case",
    "fr": "La méthode des 5 pourquoi, sur un cas réel",
    "ar": "طريقة «لماذا؟» الخماسية، مطبّقة على حالة حقيقية"
   },
   "hours": 2,
   "url": null
  }
 },
 {
  "id": "multilingual",
  "category": "languages",
  "names": {
   "en": "Multilingual communication",
   "fr": "Communication multilingue",
   "ar": "التواصل بعدة لغات"
  },
  "learn": {
   "title": {
    "en": "Mock speaking tests (TCF / IELTS style)",
    "fr": "Oraux blancs (style TCF / IELTS)",
    "ar": "اختبارات شفوية تجريبية على نمط TCF وIELTS"
   },
   "hours": 5,
   "url": null
  }
 },
 {
  "id": "excel",
  "category": "analysis",
  "names": {
   "en": "Excel",
   "fr": "Excel",
   "ar": "Excel"
  },
  "learn": {
   "title": {
    "en": "Microsoft’s Excel training: PivotTables and XLOOKUP",
    "fr": "Formation Excel de Microsoft : tableaux croisés et RECHERCHEX",
    "ar": "تكوين Microsoft في Excel: الجداول المحورية وXLOOKUP"
   },
   "hours": 4,
   "url": "https://support.microsoft.com/en-us/excel"
  }
 },
 {
  "id": "crm",
  "category": "digital",
  "names": {
   "en": "CRM",
   "fr": "CRM",
   "ar": "CRM"
  },
  "learn": {
   "title": {
    "en": "HubSpot Academy — CRM basics",
    "fr": "HubSpot Academy — bases du CRM",
    "ar": "HubSpot Academy — أساسيات CRM"
   },
   "hours": 6,
   "url": "https://academy.hubspot.com/courses"
  }
 },
 {
  "id": "b2b",
  "category": "communication",
  "names": {
   "en": "B2B sales",
   "fr": "Vente B2B",
   "ar": "البيع للشركات"
  },
  "learn": {
   "title": {
    "en": "LinkedIn Learning — selling to businesses",
    "fr": "LinkedIn Learning — vente aux entreprises",
    "ar": "LinkedIn Learning — البيع للشركات"
   },
   "hours": 5,
   "url": null
  }
 },
 {
  "id": "powerbi",
  "category": "analysis",
  "names": {
   "en": "Power BI",
   "fr": "Power BI",
   "ar": "Power BI"
  },
  "learn": {
   "title": {
    "en": "Microsoft Learn — Get started with Power BI",
    "fr": "Microsoft Learn — Bien démarrer avec Power BI",
    "ar": "Microsoft Learn — ابدأ مع Power BI"
   },
   "hours": 6,
   "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi"
  }
 },
 {
  "id": "sql",
  "category": "analysis",
  "names": {
   "en": "SQL",
   "fr": "SQL",
   "ar": "SQL"
  },
  "learn": {
   "title": {
    "en": "SQLBolt — the first six lessons",
    "fr": "SQLBolt — les six premières leçons",
    "ar": "SQLBolt — الدروس الستة الأولى"
   },
   "hours": 6,
   "url": "https://www.khanacademy.org/computing/computer-programming/sql"
  }
 },
 {
  "id": "ads",
  "category": "digital",
  "names": {
   "en": "Paid ads",
   "fr": "Publicité payante",
   "ar": "الإعلانات المموَّلة"
  },
  "learn": {
   "title": {
    "en": "Meta Blueprint — ads fundamentals",
    "fr": "Meta Blueprint — bases de la publicité",
    "ar": "Meta Blueprint — أساسيات الإعلانات"
   },
   "hours": 5,
   "url": "https://www.facebook.com/business/learn"
  }
 },
 {
  "id": "accounting",
  "category": "operations",
  "names": {
   "en": "Accounting",
   "fr": "Comptabilité",
   "ar": "المحاسبة"
  },
  "learn": {
   "title": {
    "en": "Coursera — Introduction to Financial Accounting (Wharton)",
    "fr": "Coursera — Introduction to Financial Accounting (Wharton)",
    "ar": "Coursera — مدخل إلى المحاسبة المالية (Wharton)"
   },
   "hours": 6,
   "url": "https://www.coursera.org/learn/wharton-accounting"
  }
 },
 {
  "id": "project_management",
  "category": "operations",
  "names": {
   "en": "Project management",
   "fr": "Gestion de projet",
   "ar": "تسيير المشاريع"
  },
  "learn": {
   "title": {
    "en": "Google — Foundations of Project Management",
    "fr": "Google — Fondamentaux de la gestion de projet",
    "ar": "Google — أساسيات تسيير المشاريع"
   },
   "hours": 6,
   "url": "https://www.coursera.org/learn/project-management-foundations"
  }
 },
 {
  "id": "writing",
  "category": "communication",
  "names": {
   "en": "Professional writing",
   "fr": "Rédaction professionnelle",
   "ar": "الكتابة المهنية"
  },
  "learn": {
   "title": {
    "en": "Coursera — Writing in the Sciences / business writing basics",
    "fr": "Coursera — bases de la rédaction professionnelle",
    "ar": "Coursera — أساسيات الكتابة المهنية"
   },
   "hours": 4,
   "url": "https://www.coursera.org/learn/sciwrite"
  }
 },
 {
  "id": "graphic_design",
  "category": "digital",
  "names": {
   "en": "Graphic design",
   "fr": "Design graphique",
   "ar": "التصميم الغرافيكي"
  },
  "learn": {
   "title": {
    "en": "Canva Design School — graphic design basics",
    "fr": "Canva Design School — bases du design graphique",
    "ar": "Canva Design School — أساسيات التصميم الغرافيكي"
   },
   "hours": 5,
   "url": "https://www.canva.com/designschool/"
  }
 },
 {
  "id": "programming",
  "category": "digital",
  "names": {
   "en": "Programming",
   "fr": "Programmation",
   "ar": "البرمجة"
  },
  "learn": {
   "title": {
    "en": "freeCodeCamp — Responsive Web Design / JavaScript",
    "fr": "freeCodeCamp — Responsive Web Design / JavaScript",
    "ar": "freeCodeCamp — تصميم المواقع وJavaScript"
   },
   "hours": 10,
   "url": "https://www.freecodecamp.org/learn"
  }
 },
 {
  "id": "data_analysis",
  "category": "analysis",
  "names": {
   "en": "Data analysis",
   "fr": "Analyse de données",
   "ar": "تحليل البيانات"
  },
  "learn": {
   "title": {
    "en": "Google — Data Analytics: Foundations",
    "fr": "Google — Analyse de données : fondamentaux",
    "ar": "Google — أساسيات تحليل البيانات"
   },
   "hours": 8,
   "url": "https://www.coursera.org/learn/foundations-data"
  }
 }
];

export const CITIES: Record<string, Localized> = {
 "casa": {
  "en": "Casablanca",
  "fr": "Casablanca",
  "ar": "الدار البيضاء"
 },
 "tng": {
  "en": "Tangier",
  "fr": "Tanger",
  "ar": "طنجة"
 },
 "rabat": {
  "en": "Rabat",
  "fr": "Rabat",
  "ar": "الرباط"
 },
 "mrk": {
  "en": "Marrakech",
  "fr": "Marrakech",
  "ar": "مراكش"
 },
 "fes": {
  "en": "Fès",
  "fr": "Fès",
  "ar": "فاس"
 },
 "tet": {
  "en": "Tétouan",
  "fr": "Tétouan",
  "ar": "تطوان"
 },
 "remote": {
  "en": "Remote",
  "fr": "À distance",
  "ar": "عن بُعد"
 }
};

/** Illustrative roles from the prototype. Organisations are fictional; always shown with a "Sample" label. */
export const SAMPLE_OPPORTUNITIES: SampleOpportunity[] = [
 {
  "slug": "bizdev",
  "organization": "Tanmia B2B",
  "city": "casa",
  "kind": "job",
  "title": {
   "en": "Business Development Associate",
   "fr": "Chargé de développement commercial",
   "ar": "مساعد في تطوير الأعمال"
  },
  "required": [
   "sales",
   "negotiation",
   "crm"
  ],
  "nice": [
   "customer_service",
   "b2b",
   "excel",
   "presentation"
  ],
  "project": {
   "en": "Build a mini sales pipeline: 15 local businesses qualified in HubSpot’s starter version, with a 5-line pitch for the top 3.",
   "fr": "Constituer un mini-portefeuille de prospects : 15 entreprises locales qualifiées dans la version de base de HubSpot, avec un argumentaire de 5 lignes pour les 3 meilleures.",
   "ar": "أنشئ خط مبيعات صغيراً: 15 مقاولة محلية مؤهَّلة في النسخة المجانية من HubSpot، مع عرض بيعي من 5 أسطر لأفضل 3 منها."
  }
 },
 {
  "slug": "retail",
  "organization": "Qantara Retail",
  "city": "tng",
  "kind": "job",
  "title": {
   "en": "Retail Sales Supervisor",
   "fr": "Superviseur des ventes",
   "ar": "مشرف مبيعات في متجر"
  },
  "required": [
   "sales",
   "customer_service",
   "inventory"
  ],
  "nice": [
   "leadership",
   "cash",
   "excel"
  ],
  "project": {
   "en": "Visit two shops and write 5 concrete improvements to stock layout and customer welcome.",
   "fr": "Visiter deux magasins et rédiger 5 améliorations concrètes de l’agencement du stock et de l’accueil client.",
   "ar": "زُر متجرين واكتب 5 تحسينات عملية في ترتيب السلع واستقبال الزبائن."
  }
 },
 {
  "slug": "cs",
  "organization": "Assafir Telecom",
  "city": "tet",
  "kind": "job",
  "title": {
   "en": "Bilingual Customer Success Agent",
   "fr": "Chargé de réussite client bilingue",
   "ar": "مكلّف بنجاح الزبائن (بلغتين)"
  },
  "required": [
   "customer_service",
   "multilingual",
   "problem_solving"
  ],
  "nice": [
   "crm",
   "excel"
  ],
  "project": {
   "en": "Answer 10 real customer questions from a public forum in two languages, and log them like support tickets.",
   "fr": "Répondre à 10 vraies questions de clients issues d’un forum public, en deux langues, et les consigner comme des tickets de support.",
   "ar": "أجب بلغتين عن 10 أسئلة حقيقية طرحها زبائن في منتدى عام، وسجّلها كتذاكر دعم."
  }
 },
 {
  "slug": "events",
  "organization": "Medina Events",
  "city": "mrk",
  "kind": "internship",
  "title": {
   "en": "Event Coordinator Intern",
   "fr": "Stagiaire coordination d’événements",
   "ar": "متدرّب في تنسيق الأنشطة"
  },
  "required": [
   "event",
   "leadership"
  ],
  "nice": [
   "negotiation",
   "cash",
   "social_media"
  ],
  "project": {
   "en": "Plan a 50-person student event on one page: budget, 3 supplier quotes, timeline and team roles.",
   "fr": "Planifier sur une page un événement étudiant de 50 personnes : budget, 3 devis de fournisseurs, calendrier et rôles de l’équipe.",
   "ar": "خطّط لنشاط طلابي لخمسين شخصاً في صفحة واحدة: الميزانية، و3 عروض أسعار من الموردين، والجدول الزمني، وأدوار الفريق."
  }
 },
 {
  "slug": "marketing",
  "organization": "Pixel Atlas",
  "city": "remote",
  "kind": "internship",
  "title": {
   "en": "Digital Marketing Intern",
   "fr": "Stagiaire en marketing numérique",
   "ar": "متدرّب في التسويق الرقمي"
  },
  "required": [
   "social_media",
   "content",
   "ads"
  ],
  "nice": [
   "excel",
   "presentation"
  ],
  "project": {
   "en": "Promote one post for a local shop and report reach, clicks and cost on one page.",
   "fr": "Promouvoir une publication pour un commerce local et résumer sur une page la portée, les clics et le coût.",
   "ar": "روّج لمنشور واحد لمتجر محلي، ولخّص في صفحة واحدة الوصول والنقرات والتكلفة."
  }
 },
 {
  "slug": "community",
  "organization": "Nour Studio",
  "city": "remote",
  "kind": "job",
  "title": {
   "en": "Community Manager",
   "fr": "Gestionnaire de communauté",
   "ar": "مسيّر المجتمع الرقمي"
  },
  "required": [
   "social_media",
   "content"
  ],
  "nice": [
   "multilingual",
   "presentation",
   "ads"
  ],
  "project": {
   "en": "Plan two weeks of posts for a real local brand, with 3 finished visuals.",
   "fr": "Planifier deux semaines de publications pour une vraie marque locale, avec 3 visuels finis.",
   "ar": "حضّر منشورات أسبوعين لعلامة محلية حقيقية، مع 3 تصاميم مكتملة."
  }
 },
 {
  "slug": "fieldsales",
  "organization": "Saïs Foods",
  "city": "fes",
  "kind": "job",
  "title": {
   "en": "Field Sales Representative",
   "fr": "Commercial terrain",
   "ar": "مندوب مبيعات ميداني"
  },
  "required": [
   "sales",
   "negotiation"
  ],
  "nice": [
   "b2b",
   "customer_service",
   "cash"
  ],
  "project": {
   "en": "Visit 5 shops, pitch one product, and record each owner’s objection and your answer.",
   "fr": "Visiter 5 commerces, présenter un produit, et noter l’objection de chaque gérant et votre réponse.",
   "ar": "زُر 5 متاجر، واعرض منتجاً واحداً، ودوّن اعتراض كل صاحب متجر وجوابك عليه."
  }
 },
 {
  "slug": "supply",
  "organization": "Boughaz Logistics",
  "city": "tng",
  "kind": "job",
  "title": {
   "en": "Inventory and Supply Assistant",
   "fr": "Assistant stock et approvisionnement",
   "ar": "مساعد المخزون والتموين"
  },
  "required": [
   "inventory",
   "excel"
  ],
  "nice": [
   "negotiation",
   "problem_solving",
   "sql"
  ],
  "project": {
   "en": "Turn a month of real stock movements into an Excel file with reorder alerts.",
   "fr": "Transformer un mois de mouvements de stock réels en fichier Excel avec alertes de réassort.",
   "ar": "حوّل حركة المخزون الحقيقية لشهر واحد إلى ملف Excel فيه تنبيهات إعادة الطلب."
  }
 },
 {
  "slug": "bank",
  "organization": "Noujoum Finance",
  "city": "rabat",
  "kind": "job",
  "title": {
   "en": "Junior Client Advisor",
   "fr": "Conseiller clientèle junior",
   "ar": "مستشار زبائن مبتدئ"
  },
  "required": [
   "customer_service",
   "sales",
   "cash"
  ],
  "nice": [
   "excel",
   "multilingual"
  ],
  "project": {
   "en": "Compare 3 student bank offers in one table and pitch the best one in 60 seconds.",
   "fr": "Comparer 3 offres bancaires pour étudiants dans un tableau et présenter la meilleure en 60 secondes.",
   "ar": "قارن 3 عروض بنكية للطلبة في جدول، واعرض أفضلها في 60 ثانية."
  }
 },
 {
  "slug": "ngo",
  "organization": "Jisr Association",
  "city": "tng",
  "kind": "job",
  "title": {
   "en": "Programme Assistant",
   "fr": "Assistant de programme",
   "ar": "مساعد البرامج"
  },
  "required": [
   "event",
   "teamwork"
  ],
  "nice": [
   "research",
   "presentation",
   "leadership"
  ],
  "project": {
   "en": "Survey 20 students about one campus problem and present 3 solutions on two slides.",
   "fr": "Interroger 20 étudiants sur un problème du campus et présenter 3 solutions sur deux diapositives.",
   "ar": "استطلع آراء 20 طالباً حول مشكلة في الجامعة، واعرض 3 حلول في شريحتين."
  }
 },
 {
  "slug": "research",
  "organization": "Majal Studies",
  "city": "casa",
  "kind": "internship",
  "title": {
   "en": "Market Research Intern",
   "fr": "Stagiaire études de marché",
   "ar": "متدرّب في دراسات السوق"
  },
  "required": [
   "research",
   "excel",
   "presentation"
  ],
  "nice": [
   "sql",
   "powerbi"
  ],
  "project": {
   "en": "Run a 30-answer survey, analyse it in Excel and present 3 findings.",
   "fr": "Mener un sondage de 30 réponses, l’analyser dans Excel et présenter 3 résultats.",
   "ar": "أجرِ استطلاعاً يجمع 30 إجابة، وحلّله في Excel، واعرض 3 خلاصات."
  }
 },
 {
  "slug": "analyst",
  "organization": "Dataverse Maroc",
  "city": "rabat",
  "kind": "job",
  "title": {
   "en": "Junior Business Analyst",
   "fr": "Analyste métier junior",
   "ar": "محلل أعمال مبتدئ"
  },
  "required": [
   "excel",
   "powerbi",
   "sql"
  ],
  "nice": [
   "research",
   "presentation",
   "problem_solving"
  ],
  "project": {
   "en": "Build a 3-chart Power BI dashboard from open HCP data, with one insight per chart.",
   "fr": "Construire un tableau de bord Power BI de 3 graphiques à partir des données ouvertes du HCP, avec un enseignement par graphique.",
   "ar": "أنشئ لوحة Power BI من 3 رسوم بيانية انطلاقاً من البيانات المفتوحة للمندوبية السامية للتخطيط، مع خلاصة لكل رسم."
  }
 }
];

/** Practice and proof steps per skill, used to build 30-day paths. */
export const DRILLS: Record<string, { practice: Localized; prove: Localized; days?: Array<Localized | null> }> = {
 "crm": {
  "practice": {
   "en": "Log 10 real prospects in HubSpot with their stage",
   "fr": "Saisir 10 vrais prospects dans HubSpot avec leur étape",
   "ar": "أدخل 10 زبائن محتملين حقيقيين في HubSpot مع مرحلة كل منهم"
  },
  "prove": {
   "en": "Screenshot your pipeline of 10 qualified prospects",
   "fr": "Capture d’écran de votre suivi de 10 prospects qualifiés",
   "ar": "التقط لقطة شاشة لخط مبيعاتك وفيه 10 زبائن محتملين مؤهَّلين"
  }
 },
 "b2b": {
  "practice": {
   "en": "Pitch 2 real businesses by phone and note objections",
   "fr": "Présenter l’offre à 2 vraies entreprises par téléphone et noter les objections",
   "ar": "اعرض خدمتك هاتفياً على شركتين حقيقيتين، ودوّن الاعتراضات"
  },
  "prove": {
   "en": "Write up 2 B2B calls and how you handled each objection",
   "fr": "Résumer 2 appels B2B et la réponse apportée à chaque objection",
   "ar": "لخّص مكالمتَي البيع للشركات وكيف تعاملت مع كل اعتراض"
  }
 },
 "excel": {
  "practice": {
   "en": "Turn a month of real numbers into a PivotTable",
   "fr": "Transformer un mois de chiffres réels en tableau croisé",
   "ar": "حوّل أرقاماً حقيقية لشهر واحد إلى جدول محوري"
  },
  "prove": {
   "en": "Save a PivotTable and chart built from real numbers",
   "fr": "Enregistrer un tableau croisé et un graphique fondés sur de vrais chiffres",
   "ar": "احفظ جدولاً محورياً ورسماً بيانياً من أرقام حقيقية"
  }
 },
 "powerbi": {
  "days": [
   {
    "en": "Install Power BI and learn the interface",
    "fr": "Installer Power BI et découvrir l’interface",
    "ar": "ثبّت Power BI وتعرّف على واجهته"
   },
   {
    "en": "Import your first data file",
    "fr": "Importer votre premier fichier de données",
    "ar": "استورد أول ملف بيانات"
   },
   {
    "en": "Build a simple dashboard with two charts",
    "fr": "Créer un tableau de bord simple à deux graphiques",
    "ar": "أنشئ لوحة قيادة بسيطة من رسمين بيانيين"
   },
   {
    "en": "Clean the data with Power Query",
    "fr": "Nettoyer les données avec Power Query",
    "ar": "نظّف البيانات بأداة Power Query"
   },
   {
    "en": "Write your first three DAX measures",
    "fr": "Écrire vos trois premières mesures DAX",
    "ar": "اكتب أول ثلاثة مقاييس DAX"
   },
   null,
   {
    "en": "Explain your dashboard in three sentences",
    "fr": "Expliquer votre tableau de bord en trois phrases",
    "ar": "اشرح لوحتك في ثلاث جمل"
   }
  ],
  "practice": {
   "en": "Import a real file and build two visuals",
   "fr": "Importer un vrai fichier et créer deux visuels",
   "ar": "استورد ملفاً حقيقياً وأنشئ رسمين بيانيين"
  },
  "prove": {
   "en": "A two-chart dashboard with one insight per chart",
   "fr": "Un tableau de bord de deux graphiques, avec un enseignement par graphique",
   "ar": "لوحة قيادة من رسمين مع خلاصة لكل رسم"
  }
 },
 "sql": {
  "days": [
   {
    "en": "Learn SELECT and WHERE (SQLBolt 1–2)",
    "fr": "Apprendre SELECT et WHERE (SQLBolt 1–2)",
    "ar": "تعلّم SELECT وWHERE (دروس SQLBolt 1–2)"
   },
   {
    "en": "Sort and limit your results",
    "fr": "Trier et limiter les résultats",
    "ar": "رتّب النتائج وحدّد عددها"
   },
   null,
   {
    "en": "Join two tables",
    "fr": "Joindre deux tables",
    "ar": "اربط بين جدولين باستعمال JOIN"
   },
   {
    "en": "Group and count with GROUP BY",
    "fr": "Regrouper et compter avec GROUP BY",
    "ar": "جمّع واحسب باستعمال GROUP BY"
   },
   null,
   {
    "en": "Rewrite your queries more simply",
    "fr": "Réécrire vos requêtes plus simplement",
    "ar": "أعد كتابة استعلاماتك بشكل أبسط"
   }
  ],
  "practice": {
   "en": "Write 10 queries on a sample sales database",
   "fr": "Écrire 10 requêtes sur une base de ventes d’exemple",
   "ar": "اكتب 10 استعلامات على قاعدة بيانات مبيعات نموذجية"
  },
  "prove": {
   "en": "A file of 10 working queries, each with its question",
   "fr": "Un fichier de 10 requêtes fonctionnelles, chacune avec sa question",
   "ar": "ملف من 10 استعلامات تعمل، مع السؤال الذي يجيب عنه كل منها"
  }
 },
 "ads": {
  "practice": {
   "en": "Draft a campaign targeting your city in Ads Manager",
   "fr": "Préparer dans Ads Manager une campagne ciblant votre ville",
   "ar": "حضّر حملة تستهدف مدينتك في Ads Manager"
  },
  "prove": {
   "en": "A live promoted post and its results on one page",
   "fr": "Une publication promue et ses résultats sur une page",
   "ar": "منشور مُروَّج وحصيلته في صفحة واحدة"
  }
 },
 "negotiation": {
  "practice": {
   "en": "Negotiate one real price — a supplier, a rent, a service",
   "fr": "Négocier un vrai prix : fournisseur, loyer, service",
   "ar": "فاوض على سعر حقيقي: مورّد، أو كراء، أو خدمة"
  },
  "prove": {
   "en": "Write what you asked, what you got, and how",
   "fr": "Noter ce que vous avez demandé, obtenu, et comment",
   "ar": "اكتب ما طلبته، وما حصلت عليه، وكيف"
  }
 },
 "presentation": {
  "practice": {
   "en": "Record a 2-minute talk on your best project",
   "fr": "Enregistrer 2 minutes sur votre meilleur projet",
   "ar": "سجّل حديثاً من دقيقتين عن أفضل مشروع أنجزته"
  },
  "prove": {
   "en": "Share the recording with one person and note their feedback",
   "fr": "Montrer l’enregistrement à une personne et noter son retour",
   "ar": "اعرض التسجيل على شخص واحد ودوّن ملاحظاته"
  }
 }
};
