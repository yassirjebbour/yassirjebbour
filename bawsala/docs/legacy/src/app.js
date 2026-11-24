const BUILD = "demo", SK = {
  customer_service: {
    en: "Customer service",
    fr: "Service client",
    ar: "خدمة الزبائن"
  },
  sales: {
    en: "Sales",
    fr: "Vente",
    ar: "البيع"
  },
  negotiation: {
    en: "Negotiation",
    fr: "Négociation",
    ar: "التفاوض"
  },
  cash: {
    en: "Cash handling",
    fr: "Gestion de caisse",
    ar: "تسيير الصندوق"
  },
  inventory: {
    en: "Stock management",
    fr: "Gestion de stock",
    ar: "تسيير المخزون"
  },
  social_media: {
    en: "Social media",
    fr: "Réseaux sociaux",
    ar: "شبكات التواصل الاجتماعي"
  },
  content: {
    en: "Content creation",
    fr: "Création de contenu",
    ar: "صناعة المحتوى"
  },
  teamwork: {
    en: "Teamwork",
    fr: "Travail d’équipe",
    ar: "العمل الجماعي"
  },
  leadership: {
    en: "Leading people",
    fr: "Diriger une équipe",
    ar: "قيادة الفرق"
  },
  event: {
    en: "Event planning",
    fr: "Organisation d’événements",
    ar: "تنظيم الأنشطة"
  },
  research: {
    en: "Research",
    fr: "Recherche",
    ar: "البحث"
  },
  presentation: {
    en: "Presenting",
    fr: "Prise de parole",
    ar: "العرض والتقديم"
  },
  problem_solving: {
    en: "Problem solving",
    fr: "Résolution de problèmes",
    ar: "حلّ المشكلات"
  },
  multilingual: {
    en: "Multilingual communication",
    fr: "Communication multilingue",
    ar: "التواصل بعدة لغات"
  },
  excel: {
    en: "Excel",
    fr: "Excel",
    ar: "Excel"
  },
  crm: {
    en: "CRM",
    fr: "CRM",
    ar: "CRM"
  },
  b2b: {
    en: "B2B sales",
    fr: "Vente B2B",
    ar: "البيع للشركات"
  },
  powerbi: {
    en: "Power BI",
    fr: "Power BI",
    ar: "Power BI"
  },
  sql: {
    en: "SQL",
    fr: "SQL",
    ar: "SQL"
  },
  ads: {
    en: "Paid ads",
    fr: "Publicité payante",
    ar: "الإعلانات المموَّلة"
  }
}, RARE = new Set([ "negotiation", "cash", "inventory", "leadership", "event", "multilingual" ]), HINT = {
  customer_service: /customer|(?:^|[\s،.؛:!؟"(])[وف]?(?:أقدم الطلبات|الطلبات|الجيران|للجيران)|\bserv(?:e|ing|ed) |je sers|client|touris|visitor|visiteur|guest|(?:^|[\s،.؛:!؟"(])[وف]?(?:السياح|سياح|العملاء|عملاء|زوار|الزوار|الضيوف|استقبال)|زبون|زبناء|زبائن|الكليان|كليان|كليانة|أستقبل|ⵉⵎⵙⴰⵖⵏ|ⵎⵙⴰⵖⵏ|ⴰⵎⵙⴰⵖ/i,
  sales: /\bsales?\b|\bsell|\bsold\b|vente|vend[su]|بيع|بعت|مبيعات|كنبيع|بيعت|بعنا|أبيع|ⵣⵣⵏⵣ|ⵣⵏⵣ|ⴰⵣⵣⵏⵣⵉ/i,
  negotiation: /negotiat|négoci|supplier|fournisseur|bargain|haggl|marchand[eé]|ساوم|ناقشت.{0,25}سعر|تفاوض|مورد|كنتفاوض|الفورنيسور|أفاوض|فاوضت|ⵎⵎⵙⴰⵙⴰ|ⵎⵙⴰⵙⴰ|ⴰⵎⵣⵣⵏⵣ|ⵉⵎⵣⵣⵏⵣⵏ/i,
  cash: /cash|\btill\b|caisse|budget|argent|money|register|dépenses|expenses|مصاريف|المصاريف|المداخيل|النقود|صندوق|ميزانية|المال|الكاسة|الفلوس|الحساب|ⵜⵉⵇⵇⵉⵜ|ⵜⵙⵎⴷⵉⵜ|ⵜⴰⵙⵎⴷⵉⵜ|ⵉⴷⵔⵉⵎⵏ/i,
  inventory: /stock|inventor|warehouse|entrepôt|rayon|المخزن|مخزن|المستودع|السلع|مخزون|السلعة|الستوك|ⴰⵙⵖⴱⴰⵍⵓ|ⵓⵙⵖⴱⴰⵍⵓ/i,
  social_media: /instagram|facebook|tiktok|linkedin|social media|réseaux sociaux|إنستغرام|انستغرام|انستا|إنستا|فيسبوك|تيك ?توك|ⵉⵣⴷⴰⵢⵏ ⵉⵎⵜⵜⵎⴰⵙⴰⵢⵏ/i,
  content: /photo|vid[eé]o|\bcontent|contenu|canva|\bdesign|affiche|poster|كانفا|ملصق|أصمم|صممت|نصمم|صور|تصاور|فيديو|محتوى|تصميم|مونتاج|ⵜⵉⵡⵍⴰⴼⵉⵏ|ⵜⴰⵡⵍⴰⴼⵜ|ⴰⴳⴱⵓⵔ/i,
  teamwork: /\bteam|équipe|volunteer|bénévol|تطوع|فريق|متطوع|الجمعية|الفرقة|ⵜⴰⵔⴱⴰⵄⵜ|ⵜⵎⵙⵎⵓⵏⵜ|ⵜⴰⵎⵙⵎⵓⵏⵜ/i,
  leadership: /coordinat|coordonn|organisé|j'ai organis|(?:^|[\s،.؛:!؟"(])[وف]?(?:نظمت|نظّمت|أنظم|ننظم|قدت)|\bled\b|\blead|organi[sz]ed|managed|encadr|supervis|in charge|responsable d|مسؤولا عن|مسؤولة عن|مسؤول عن|أقود|نقود|أشرف|نسقت|قدت|أشرفت|سيرت|كنسير|مسؤول على|أدرت|ⵙⵙⵓⴷⵙⵖ|ⵙⵙⵓⴷⵓⵖ|ⵙⵙⵓⴷⵓⵙⵖ|ⴰⵏⴱⴱⴰⴹ/i,
  event: /\bevent|المخيم|مخيم|camp\b|colonie|événement|evenement|campaign|campagne|tournament|tournoi|soirée|soiree|\bparty|\bfête|festival|conference|conférence|workshop|atelier|wedding|mariage|حملة|فعالية|تظاهرة|نشاط|حفلة|حفل|دوري|بطولة|مهرجان|ورشة عمل|ورشات|ورشة تكوين|خرجة|عرس|سهرة|ⵜⴰⵎⵖⵔⴰ|ⵜⵎⵖⵔⴰ|ⵜⵉⵎⵖⵔⵉⵡⵉⵏ/i,
  research: /survey|questionnaire|sondage|feedback|avis des|آراء|market study|étude de marché|research|recherche|دراسة سوق|استمارة|سونداج|بحث|استطلاع|ⴰⵙⵇⵙⵉ|ⵓⵙⵇⵙⵉ|ⴰⵔⵣⵣⵓ/i,
  presentation: /present|présent|jury|pitch|soutenance|\btutor|\bteach|taught|enseign|cours de|(?:^|[\s،.؛:!؟"(])[وف]?(?:أعلم|علمت|أدرس|درست|دروس|تدريس|أشرح)|قدمت|لجنة|عرضت|برزنتاسيون|ⵙⵙⴽⴰⵏⵖ|ⵙⵙⴽⵏⵖ|ⵣⴰⵜ ⵢⴰⵜ ⵜⴳⵔⴰⵡⵜ/i,
  problem_solving: /problem|problème|\bsolv|résolu|solution|\brépar|repair|\bfix(?:ed|es|ing)?\b|dépann|troubleshoot|(?:^|[\s،.؛:!؟"(])[وف]?(?:أحل|نحل|حلا|حلول|أصلح|أصلحت|إصلاح|صلحت|كنصلح)|مشكل|حلول|حللت|حليت|مشكلة|ⵜⴰⵎⵓⴽⵔⵉⵙⵜ|ⵜⵎⵓⴽⵔⵉⵙⵜ|ⴼⵔⵓⵖ/i,
  multilingual: /french|english|spanish|german|français|anglais|espagnol|allemand|الفرنسية|الإنجليزية|الإسبانية|الانجليزية|بالفرنسية|بالفرونسي|بالنكليزية|بالإسبانية|بالسبنيولية|ⵜⴼⵔⴰⵏⵙⵉⵙⵜ|ⵜⴰⴼⵔⴰⵏⵙⵉⵙⵜ|ⵜⵏⴳⵍⵉⵣⵜ|ⵜⴰⵏⴳⵍⵉⵣⵜ|ⵜⵙⴱⵏⵢⵓⵍⵉⵜ/i,
  excel: /excel|spreadsheet|tableur|pivot|tableaux? crois|إكسل|اكسل|إكسيل|اكسيل|ⵜⵉⴼⵍⵡⵉⵏ ⵏ ⵜⵙⵍⵍⵖⵜ/i,
  crm: /\bcrm|hubspot|salesforce/i,
  b2b: /b2b|companies|entreprises|شركات|مقاولات|الشركات/i,
  powerbi: /power ?bi|dashboard|tableau de bord|لوحة قيادة/i,
  sql: /\bsql|requête|quer(y|ies)|استعلام/i,
  ads: /\bads?\b|publicité|sponsoris|إعلان|سبونسور|ⴰⵙⴼⴼⵍⴰⵍ|ⵉⵙⴼⴼⵍⴰⵍ/i
}, LANG_WORDS = [ /ⴼⵔⴰⵏⵙⵉⵙⵜ|french|français|الفرنسية|بالفرنسية|بالفرونسي/i, /ⵏⴳⵍⵉⵣⵜ|english|anglais|الإنجليزية|الانجليزية|بالنكليزية/i, /ⵙⴱⵏⵢⵓⵍⵉⵜ|spanish|espagnol|الإسبانية|بالإسبانية|بالسبنيولية/i, /german|allemand|الألمانية/i, /arab|arabe|العربية|الدارجة|darija/i, /amazigh|tamazight|الأمازيغية|تشلحيت/i ], C = {
  casa: {
    en: "Casablanca",
    fr: "Casablanca",
    ar: "الدار البيضاء"
  },
  tng: {
    en: "Tangier",
    fr: "Tanger",
    ar: "طنجة"
  },
  rabat: {
    en: "Rabat",
    fr: "Rabat",
    ar: "الرباط"
  },
  mrk: {
    en: "Marrakech",
    fr: "Marrakech",
    ar: "مراكش"
  },
  fes: {
    en: "Fès",
    fr: "Fès",
    ar: "فاس"
  },
  tet: {
    en: "Tétouan",
    fr: "Tétouan",
    ar: "تطوان"
  },
  remote: {
    en: "Remote",
    fr: "À distance",
    ar: "عن بُعد"
  }
}, OPPS = [ {
  id: "bizdev",
  org: "Tanmia B2B",
  ini: "TB",
  type: "job",
  city: "casa",
  title: {
    en: "Business Development Associate",
    fr: "Chargé de développement commercial",
    ar: "مساعد في تطوير الأعمال"
  },
  short: {
    en: "Business dev",
    fr: "Dév. commercial",
    ar: "تطوير الأعمال"
  },
  req: [ [ "sales", 1 ], [ "negotiation", 1 ], [ "crm", 1 ], [ "customer_service", 0 ], [ "b2b", 0 ], [ "excel", 0 ], [ "presentation", 0 ] ],
  project: {
    en: "Build a mini sales pipeline: 15 local businesses qualified in HubSpot’s starter version, with a 5-line pitch for the top 3.",
    fr: "Constituer un mini-portefeuille de prospects : 15 entreprises locales qualifiées dans la version de base de HubSpot, avec un argumentaire de 5 lignes pour les 3 meilleures.",
    ar: "أنشئ خط مبيعات صغيراً: 15 مقاولة محلية مؤهَّلة في النسخة المجانية من HubSpot، مع عرض بيعي من 5 أسطر لأفضل 3 منها."
  }
}, {
  id: "retail",
  org: "Qantara Retail",
  ini: "QR",
  type: "job",
  city: "tng",
  title: {
    en: "Retail Sales Supervisor",
    fr: "Superviseur des ventes",
    ar: "مشرف مبيعات في متجر"
  },
  short: {
    en: "Retail lead",
    fr: "Superviseur vente",
    ar: "مشرف مبيعات"
  },
  req: [ [ "sales", 1 ], [ "customer_service", 1 ], [ "inventory", 1 ], [ "leadership", 0 ], [ "cash", 0 ], [ "excel", 0 ] ],
  project: {
    en: "Visit two shops and write 5 concrete improvements to stock layout and customer welcome.",
    fr: "Visiter deux magasins et rédiger 5 améliorations concrètes de l’agencement du stock et de l’accueil client.",
    ar: "زُر متجرين واكتب 5 تحسينات عملية في ترتيب السلع واستقبال الزبائن."
  }
}, {
  id: "cs",
  org: "Assafir Telecom",
  ini: "AT",
  type: "job",
  city: "tet",
  title: {
    en: "Bilingual Customer Success Agent",
    fr: "Chargé de réussite client bilingue",
    ar: "مكلّف بنجاح الزبائن (بلغتين)"
  },
  short: {
    en: "Customer success",
    fr: "Réussite client",
    ar: "نجاح الزبائن"
  },
  req: [ [ "customer_service", 1 ], [ "multilingual", 1 ], [ "problem_solving", 1 ], [ "crm", 0 ], [ "excel", 0 ] ],
  project: {
    en: "Answer 10 real customer questions from a public forum in two languages, and log them like support tickets.",
    fr: "Répondre à 10 vraies questions de clients issues d’un forum public, en deux langues, et les consigner comme des tickets de support.",
    ar: "أجب بلغتين عن 10 أسئلة حقيقية طرحها زبائن في منتدى عام، وسجّلها كتذاكر دعم."
  }
}, {
  id: "events",
  org: "Medina Events",
  ini: "ME",
  type: "intern",
  city: "mrk",
  title: {
    en: "Event Coordinator Intern",
    fr: "Stagiaire coordination d’événements",
    ar: "متدرّب في تنسيق الأنشطة"
  },
  short: {
    en: "Events",
    fr: "Événementiel",
    ar: "تنسيق الأنشطة"
  },
  req: [ [ "event", 1 ], [ "leadership", 1 ], [ "negotiation", 0 ], [ "cash", 0 ], [ "social_media", 0 ] ],
  project: {
    en: "Plan a 50-person student event on one page: budget, 3 supplier quotes, timeline and team roles.",
    fr: "Planifier sur une page un événement étudiant de 50 personnes : budget, 3 devis de fournisseurs, calendrier et rôles de l’équipe.",
    ar: "خطّط لنشاط طلابي لخمسين شخصاً في صفحة واحدة: الميزانية، و3 عروض أسعار من الموردين، والجدول الزمني، وأدوار الفريق."
  }
}, {
  id: "marketing",
  org: "Pixel Atlas",
  ini: "PA",
  type: "intern",
  city: "remote",
  title: {
    en: "Digital Marketing Intern",
    fr: "Stagiaire en marketing numérique",
    ar: "متدرّب في التسويق الرقمي"
  },
  short: {
    en: "Digital marketing",
    fr: "Marketing numérique",
    ar: "التسويق الرقمي"
  },
  req: [ [ "social_media", 1 ], [ "content", 1 ], [ "ads", 1 ], [ "excel", 0 ], [ "presentation", 0 ] ],
  project: {
    en: "Promote one post for a local shop and report reach, clicks and cost on one page.",
    fr: "Promouvoir une publication pour un commerce local et résumer sur une page la portée, les clics et le coût.",
    ar: "روّج لمنشور واحد لمتجر محلي، ولخّص في صفحة واحدة الوصول والنقرات والتكلفة."
  }
}, {
  id: "community",
  org: "Nour Studio",
  ini: "NS",
  type: "job",
  city: "remote",
  title: {
    en: "Community Manager",
    fr: "Gestionnaire de communauté",
    ar: "مسيّر المجتمع الرقمي"
  },
  short: {
    en: "Community",
    fr: "Communauté",
    ar: "المجتمع الرقمي"
  },
  req: [ [ "social_media", 1 ], [ "content", 1 ], [ "multilingual", 0 ], [ "presentation", 0 ], [ "ads", 0 ] ],
  project: {
    en: "Plan two weeks of posts for a real local brand, with 3 finished visuals.",
    fr: "Planifier deux semaines de publications pour une vraie marque locale, avec 3 visuels finis.",
    ar: "حضّر منشورات أسبوعين لعلامة محلية حقيقية، مع 3 تصاميم مكتملة."
  }
}, {
  id: "fieldsales",
  org: "Saïs Foods",
  ini: "SF",
  type: "job",
  city: "fes",
  title: {
    en: "Field Sales Representative",
    fr: "Commercial terrain",
    ar: "مندوب مبيعات ميداني"
  },
  short: {
    en: "Field sales",
    fr: "Commercial terrain",
    ar: "مبيعات ميدانية"
  },
  req: [ [ "sales", 1 ], [ "negotiation", 1 ], [ "b2b", 0 ], [ "customer_service", 0 ], [ "cash", 0 ] ],
  project: {
    en: "Visit 5 shops, pitch one product, and record each owner’s objection and your answer.",
    fr: "Visiter 5 commerces, présenter un produit, et noter l’objection de chaque gérant et votre réponse.",
    ar: "زُر 5 متاجر، واعرض منتجاً واحداً، ودوّن اعتراض كل صاحب متجر وجوابك عليه."
  }
}, {
  id: "supply",
  org: "Boughaz Logistics",
  ini: "BL",
  type: "job",
  city: "tng",
  title: {
    en: "Inventory and Supply Assistant",
    fr: "Assistant stock et approvisionnement",
    ar: "مساعد المخزون والتموين"
  },
  short: {
    en: "Logistics",
    fr: "Logistique",
    ar: "التموين"
  },
  req: [ [ "inventory", 1 ], [ "excel", 1 ], [ "negotiation", 0 ], [ "problem_solving", 0 ], [ "sql", 0 ] ],
  project: {
    en: "Turn a month of real stock movements into an Excel file with reorder alerts.",
    fr: "Transformer un mois de mouvements de stock réels en fichier Excel avec alertes de réassort.",
    ar: "حوّل حركة المخزون الحقيقية لشهر واحد إلى ملف Excel فيه تنبيهات إعادة الطلب."
  }
}, {
  id: "bank",
  org: "Noujoum Finance",
  ini: "NF",
  type: "job",
  city: "rabat",
  title: {
    en: "Junior Client Advisor",
    fr: "Conseiller clientèle junior",
    ar: "مستشار زبائن مبتدئ"
  },
  short: {
    en: "Client advisor",
    fr: "Conseiller clientèle",
    ar: "مستشار زبائن"
  },
  req: [ [ "customer_service", 1 ], [ "sales", 1 ], [ "cash", 1 ], [ "excel", 0 ], [ "multilingual", 0 ] ],
  project: {
    en: "Compare 3 student bank offers in one table and pitch the best one in 60 seconds.",
    fr: "Comparer 3 offres bancaires pour étudiants dans un tableau et présenter la meilleure en 60 secondes.",
    ar: "قارن 3 عروض بنكية للطلبة في جدول، واعرض أفضلها في 60 ثانية."
  }
}, {
  id: "ngo",
  org: "Jisr Association",
  ini: "JA",
  type: "job",
  city: "tng",
  title: {
    en: "Programme Assistant",
    fr: "Assistant de programme",
    ar: "مساعد البرامج"
  },
  short: {
    en: "NGO programmes",
    fr: "Programmes ONG",
    ar: "برامج الجمعية"
  },
  req: [ [ "event", 1 ], [ "teamwork", 1 ], [ "research", 0 ], [ "presentation", 0 ], [ "leadership", 0 ] ],
  project: {
    en: "Survey 20 students about one campus problem and present 3 solutions on two slides.",
    fr: "Interroger 20 étudiants sur un problème du campus et présenter 3 solutions sur deux diapositives.",
    ar: "استطلع آراء 20 طالباً حول مشكلة في الجامعة، واعرض 3 حلول في شريحتين."
  }
}, {
  id: "research",
  org: "Majal Studies",
  ini: "MS",
  type: "intern",
  city: "casa",
  title: {
    en: "Market Research Intern",
    fr: "Stagiaire études de marché",
    ar: "متدرّب في دراسات السوق"
  },
  short: {
    en: "Market research",
    fr: "Études de marché",
    ar: "دراسات السوق"
  },
  req: [ [ "research", 1 ], [ "excel", 1 ], [ "presentation", 1 ], [ "sql", 0 ], [ "powerbi", 0 ] ],
  project: {
    en: "Run a 30-answer survey, analyse it in Excel and present 3 findings.",
    fr: "Mener un sondage de 30 réponses, l’analyser dans Excel et présenter 3 résultats.",
    ar: "أجرِ استطلاعاً يجمع 30 إجابة، وحلّله في Excel، واعرض 3 خلاصات."
  }
}, {
  id: "analyst",
  org: "Dataverse Maroc",
  ini: "DM",
  type: "job",
  city: "rabat",
  title: {
    en: "Junior Business Analyst",
    fr: "Analyste métier junior",
    ar: "محلل أعمال مبتدئ"
  },
  short: {
    en: "Business analyst",
    fr: "Analyste métier",
    ar: "محلل أعمال"
  },
  req: [ [ "excel", 1 ], [ "powerbi", 1 ], [ "sql", 1 ], [ "research", 0 ], [ "presentation", 0 ], [ "problem_solving", 0 ] ],
  project: {
    en: "Build a 3-chart Power BI dashboard from open HCP data, with one insight per chart.",
    fr: "Construire un tableau de bord Power BI de 3 graphiques à partir des données ouvertes du HCP, avec un enseignement par graphique.",
    ar: "أنشئ لوحة Power BI من 3 رسوم بيانية انطلاقاً من البيانات المفتوحة للمندوبية السامية للتخطيط، مع خلاصة لكل رسم."
  }
} ], ELIG = {
  bizdev: {
    lv: "grad",
    lg: [ "fr", "ar" ]
  },
  retail: {
    lv: "fy",
    lg: [ "ar", "fr" ]
  },
  cs: {
    lv: "fy",
    lg: [ "fr", "es" ]
  },
  events: {
    lv: "any",
    lg: [ "fr", "ar" ]
  },
  marketing: {
    lv: "any",
    lg: [ "fr" ]
  },
  community: {
    lv: "fy",
    lg: [ "ar", "fr" ]
  },
  fieldsales: {
    lv: "any",
    lg: [ "ar" ]
  },
  supply: {
    lv: "fy",
    lg: [ "fr" ]
  },
  bank: {
    lv: "grad",
    lg: [ "fr", "ar" ]
  },
  ngo: {
    lv: "fy",
    lg: [ "ar", "fr" ]
  },
  research: {
    lv: "any",
    lg: [ "fr" ]
  },
  analyst: {
    lv: "fy",
    lg: [ "fr", "en" ]
  }
}, PLANGS = [ "ar", "fr", "en", "es", "zgh" ], RES = {
  customer_service: {
    h: 4,
    en: "HubSpot Academy — customer service course",
    fr: "HubSpot Academy — cours sur le service client",
    ar: "HubSpot Academy — دورة في خدمة الزبائن"
  },
  sales: {
    h: 5,
    en: "HubSpot Academy — Inbound Sales",
    fr: "HubSpot Academy — Inbound Sales",
    ar: "HubSpot Academy — دورة Inbound Sales"
  },
  negotiation: {
    h: 6,
    en: "Coursera — Successful Negotiation",
    fr: "Coursera — Successful Negotiation",
    ar: "Coursera — دورة Successful Negotiation"
  },
  cash: {
    h: 3,
    en: "Khan Academy — budgeting basics",
    fr: "Khan Academy — bases du budget",
    ar: "Khan Academy — أساسيات الميزانية"
  },
  inventory: {
    h: 4,
    en: "A short course on stock basics: FIFO and reorder points",
    fr: "Un cours court sur la gestion de stock : FIFO et point de commande",
    ar: "دورة قصيرة في أساسيات المخزون: FIFO ونقطة إعادة الطلب"
  },
  social_media: {
    h: 4,
    en: "Meta Blueprint — organic social basics",
    fr: "Meta Blueprint — bases des réseaux sociaux",
    ar: "Meta Blueprint — أساسيات المحتوى غير المموَّل على شبكات التواصل"
  },
  content: {
    h: 4,
    en: "Canva Design School — lessons",
    fr: "Canva Design School — leçons",
    ar: "Canva Design School — دروس"
  },
  teamwork: {
    h: 2,
    en: "A guide to team roles (Belbin)",
    fr: "Un guide des rôles d’équipe (Belbin)",
    ar: "دليل أدوار الفريق (Belbin)"
  },
  leadership: {
    h: 5,
    en: "Coursera — Leading People and Teams",
    fr: "Coursera — Leading People and Teams",
    ar: "Coursera — دورة قيادة الفرق"
  },
  event: {
    h: 3,
    en: "An event-planning checklist and budget template",
    fr: "Une liste de contrôle et un modèle de budget d’événement",
    ar: "قائمة تحقّق ونموذج ميزانية لتنظيم نشاط"
  },
  research: {
    h: 4,
    en: "Google Forms + a survey-design guide",
    fr: "Google Forms + un guide de conception de questionnaire",
    ar: "Google Forms ودليل لتصميم الاستبيانات"
  },
  presentation: {
    h: 4,
    en: "Coursera — Introduction to Public Speaking",
    fr: "Coursera — Introduction to Public Speaking",
    ar: "Coursera — مقدمة في التحدث أمام الجمهور"
  },
  problem_solving: {
    h: 2,
    en: "The 5 Whys method, with one real case",
    fr: "La méthode des 5 pourquoi, sur un cas réel",
    ar: "طريقة «لماذا؟» الخماسية، مطبّقة على حالة حقيقية"
  },
  multilingual: {
    h: 5,
    en: "Mock speaking tests (TCF / IELTS style)",
    fr: "Oraux blancs (style TCF / IELTS)",
    ar: "اختبارات شفوية تجريبية على نمط TCF وIELTS"
  },
  excel: {
    h: 4,
    en: "Microsoft’s Excel training: PivotTables and XLOOKUP",
    fr: "Formation Excel de Microsoft : tableaux croisés et RECHERCHEX",
    ar: "تكوين Microsoft في Excel: الجداول المحورية وXLOOKUP"
  },
  crm: {
    h: 6,
    en: "HubSpot Academy — CRM basics",
    fr: "HubSpot Academy — bases du CRM",
    ar: "HubSpot Academy — أساسيات CRM"
  },
  b2b: {
    h: 5,
    en: "LinkedIn Learning — selling to businesses",
    fr: "LinkedIn Learning — vente aux entreprises",
    ar: "LinkedIn Learning — البيع للشركات"
  },
  powerbi: {
    h: 6,
    en: "Microsoft Learn — Get started with Power BI",
    fr: "Microsoft Learn — Bien démarrer avec Power BI",
    ar: "Microsoft Learn — ابدأ مع Power BI"
  },
  sql: {
    h: 6,
    en: "SQLBolt — the first six lessons",
    fr: "SQLBolt — les six premières leçons",
    ar: "SQLBolt — الدروس الستة الأولى"
  },
  ads: {
    h: 5,
    en: "Meta Blueprint — ads fundamentals",
    fr: "Meta Blueprint — bases de la publicité",
    ar: "Meta Blueprint — أساسيات الإعلانات"
  }
}, DRILL = {
  crm: {
    practice: {
      en: "Log 10 real prospects in HubSpot with their stage",
      fr: "Saisir 10 vrais prospects dans HubSpot avec leur étape",
      ar: "أدخل 10 زبائن محتملين حقيقيين في HubSpot مع مرحلة كل منهم"
    },
    prove: {
      en: "Screenshot your pipeline of 10 qualified prospects",
      fr: "Capture d’écran de votre suivi de 10 prospects qualifiés",
      ar: "التقط لقطة شاشة لخط مبيعاتك وفيه 10 زبائن محتملين مؤهَّلين"
    }
  },
  b2b: {
    practice: {
      en: "Pitch 2 real businesses by phone and note objections",
      fr: "Présenter l’offre à 2 vraies entreprises par téléphone et noter les objections",
      ar: "اعرض خدمتك هاتفياً على شركتين حقيقيتين، ودوّن الاعتراضات"
    },
    prove: {
      en: "Write up 2 B2B calls and how you handled each objection",
      fr: "Résumer 2 appels B2B et la réponse apportée à chaque objection",
      ar: "لخّص مكالمتَي البيع للشركات وكيف تعاملت مع كل اعتراض"
    }
  },
  excel: {
    practice: {
      en: "Turn a month of real numbers into a PivotTable",
      fr: "Transformer un mois de chiffres réels en tableau croisé",
      ar: "حوّل أرقاماً حقيقية لشهر واحد إلى جدول محوري"
    },
    prove: {
      en: "Save a PivotTable and chart built from real numbers",
      fr: "Enregistrer un tableau croisé et un graphique fondés sur de vrais chiffres",
      ar: "احفظ جدولاً محورياً ورسماً بيانياً من أرقام حقيقية"
    }
  },
  powerbi: {
    days: [ {
      en: "Install Power BI and learn the interface",
      fr: "Installer Power BI et découvrir l’interface",
      ar: "ثبّت Power BI وتعرّف على واجهته"
    }, {
      en: "Import your first data file",
      fr: "Importer votre premier fichier de données",
      ar: "استورد أول ملف بيانات"
    }, {
      en: "Build a simple dashboard with two charts",
      fr: "Créer un tableau de bord simple à deux graphiques",
      ar: "أنشئ لوحة قيادة بسيطة من رسمين بيانيين"
    }, {
      en: "Clean the data with Power Query",
      fr: "Nettoyer les données avec Power Query",
      ar: "نظّف البيانات بأداة Power Query"
    }, {
      en: "Write your first three DAX measures",
      fr: "Écrire vos trois premières mesures DAX",
      ar: "اكتب أول ثلاثة مقاييس DAX"
    }, null, {
      en: "Explain your dashboard in three sentences",
      fr: "Expliquer votre tableau de bord en trois phrases",
      ar: "اشرح لوحتك في ثلاث جمل"
    } ],
    practice: {
      en: "Import a real file and build two visuals",
      fr: "Importer un vrai fichier et créer deux visuels",
      ar: "استورد ملفاً حقيقياً وأنشئ رسمين بيانيين"
    },
    prove: {
      en: "A two-chart dashboard with one insight per chart",
      fr: "Un tableau de bord de deux graphiques, avec un enseignement par graphique",
      ar: "لوحة قيادة من رسمين مع خلاصة لكل رسم"
    }
  },
  sql: {
    days: [ {
      en: "Learn SELECT and WHERE (SQLBolt 1–2)",
      fr: "Apprendre SELECT et WHERE (SQLBolt 1–2)",
      ar: "تعلّم SELECT وWHERE (دروس SQLBolt 1–2)"
    }, {
      en: "Sort and limit your results",
      fr: "Trier et limiter les résultats",
      ar: "رتّب النتائج وحدّد عددها"
    }, null, {
      en: "Join two tables",
      fr: "Joindre deux tables",
      ar: "اربط بين جدولين باستعمال JOIN"
    }, {
      en: "Group and count with GROUP BY",
      fr: "Regrouper et compter avec GROUP BY",
      ar: "جمّع واحسب باستعمال GROUP BY"
    }, null, {
      en: "Rewrite your queries more simply",
      fr: "Réécrire vos requêtes plus simplement",
      ar: "أعد كتابة استعلاماتك بشكل أبسط"
    } ],
    practice: {
      en: "Write 10 queries on a sample sales database",
      fr: "Écrire 10 requêtes sur une base de ventes d’exemple",
      ar: "اكتب 10 استعلامات على قاعدة بيانات مبيعات نموذجية"
    },
    prove: {
      en: "A file of 10 working queries, each with its question",
      fr: "Un fichier de 10 requêtes fonctionnelles, chacune avec sa question",
      ar: "ملف من 10 استعلامات تعمل، مع السؤال الذي يجيب عنه كل منها"
    }
  },
  ads: {
    practice: {
      en: "Draft a campaign targeting your city in Ads Manager",
      fr: "Préparer dans Ads Manager une campagne ciblant votre ville",
      ar: "حضّر حملة تستهدف مدينتك في Ads Manager"
    },
    prove: {
      en: "A live promoted post and its results on one page",
      fr: "Une publication promue et ses résultats sur une page",
      ar: "منشور مُروَّج وحصيلته في صفحة واحدة"
    }
  },
  negotiation: {
    practice: {
      en: "Negotiate one real price — a supplier, a rent, a service",
      fr: "Négocier un vrai prix : fournisseur, loyer, service",
      ar: "فاوض على سعر حقيقي: مورّد، أو كراء، أو خدمة"
    },
    prove: {
      en: "Write what you asked, what you got, and how",
      fr: "Noter ce que vous avez demandé, obtenu, et comment",
      ar: "اكتب ما طلبته، وما حصلت عليه، وكيف"
    }
  },
  presentation: {
    practice: {
      en: "Record a 2-minute talk on your best project",
      fr: "Enregistrer 2 minutes sur votre meilleur projet",
      ar: "سجّل حديثاً من دقيقتين عن أفضل مشروع أنجزته"
    },
    prove: {
      en: "Share the recording with one person and note their feedback",
      fr: "Montrer l’enregistrement à une personne et noter son retour",
      ar: "اعرض التسجيل على شخص واحد ودوّن ملاحظاته"
    }
  }
}, EXAMPLE = {
  en: "I’m in my final year of Economics and Management in Tétouan. For two years I have kept my family shop’s sales and stock in Excel, with pivot tables and a monthly report. At weekends I serve customers and close sales. When a supplier was late, I solved the problem by finding a second one and negotiating new delivery dates. For my market research course, I ran a survey of 60 students and presented the results to a jury.",
  fr: "Je suis en dernière année d’économie et gestion à Tétouan. Depuis deux ans, je tiens les ventes et le stock de la boutique familiale sur Excel, avec des tableaux croisés et un bilan mensuel. Le week-end, je sers les clients et je conclus des ventes. Quand un fournisseur a pris du retard, j’ai résolu le problème en trouvant un second fournisseur et en négociant de nouveaux délais de livraison. Pour mon cours de marketing, j’ai mené une étude de marché par questionnaire auprès de 60 étudiants et présenté les résultats devant un jury.",
  ar: "أنا في السنة الأخيرة من شعبة الاقتصاد والتسيير بتطوان. منذ سنتين أتابع مبيعات متجر العائلة ومخزونه على إكسل، بجداول محورية وتقرير شهري. في نهاية الأسبوع أستقبل الزبائن وأبيع. وحين تأخّر أحد الموردين، حللت المشكلة بإيجاد مورد ثانٍ والتفاوض على مواعيد تسليم جديدة. وفي مادة التسويق أجريت استطلاعاً شمل 60 طالباً، وقدّمت النتائج أمام لجنة."
}, STARTERS = {
  en: [ "I help at my family's shop. ", "I organised an event at uni. ", "I run an Instagram page. " ],
  fr: [ "J'aide dans la boutique familiale. ", "J'ai organisé un événement à la fac. ", "Je gère une page Instagram. " ],
  ar: [ "أساعد في متجر العائلة. ", "نظّمت نشاطاً في الجامعة. ", "أدير صفحة على إنستغرام. " ]
}, FIELDS = [ "f_eco", "f_eng", "f_it", "f_law", "f_lang", "f_other" ], UNI = {
  kpi: {
    joined: 812,
    invited: 1240,
    skills: 4630,
    hidden: 38,
    ready: 146
  },
  funnel: [ 1240, 812, 640, 402, 287, 146 ],
  gaps: [ [ "powerbi", 46 ], [ "excel", 41 ], [ "sql", 33 ], [ "crm", 29 ], [ "presentation", 24 ] ],
  dims: [ [ "u_dim1", 65 ], [ "u_dim2", 48 ], [ "u_dim3", 40 ], [ "u_dim4", 35 ] ],
  outcomes: [ [ "u_out1", 87 ], [ "u_out2", 34 ], [ "u_out3", 12 ] ],
  strengths: [ [ "customer_service", 61 ], [ "teamwork", 57 ], [ "sales", 44 ], [ "multilingual", 39 ], [ "social_media", 35 ] ],
  months: {
    zgh: [ "ⵎⴰⵕⵚ", "ⵉⴱⵔⵉⵔ", "ⵎⴰⵢⵢⵓ", "ⵢⵓⵏⵢⵓ", "ⵢⵓⵍⵢⵓⵣ", "ⵖⵓⵛⵜ", "ⵛⵓⵜⴰⵏⴱⵉⵔ" ],
    en: [ "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep" ],
    fr: [ "mars", "avr.", "mai", "juin", "juil.", "août", "sept." ],
    ar: [ "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر" ]
  },
  active: [ 42, 58, 71, 66, 48, 94, 188 ],
  programmes: [ {
    p: "f_eco",
    n: 270,
    pp: 213,
    gap: "powerbi",
    r: 52
  }, {
    p: "f_it",
    n: 155,
    pp: 122,
    gap: "presentation",
    r: 58
  }, {
    p: "f_lang",
    n: 130,
    pp: 102,
    gap: "excel",
    r: 44
  }, {
    p: "f_law",
    n: 114,
    pp: 90,
    gap: "excel",
    r: 39
  }, {
    p: "f_eng",
    n: 143,
    pp: 113,
    gap: "b2b",
    r: 55
  } ],
  queue: [ {
    id: "q1",
    ini: "SA",
    name: "Rania A.",
    p: "f_eco",
    skill: "negotiation",
    ev: {
      en: "I negotiated a 12% discount with the print shop for our club’s gala.",
      fr: "J’ai négocié 12 % de remise avec l’imprimeur pour le gala du club.",
      ar: "فاوضت المطبعة على تخفيض بنسبة 12% لحفل النادي."
    },
    proof: {
      en: "Invoice photo + reference from the club president",
      fr: "Photo de la facture + recommandation du président du club",
      ar: "صورة الفاتورة + تزكية من رئيس النادي"
    }
  }, {
    id: "q2",
    ini: "YB",
    name: "Youssef B.",
    p: "f_it",
    skill: "sql",
    ev: {
      en: "I wrote 25 SQL queries for my end-of-studies project database.",
      fr: "J’ai écrit 25 requêtes SQL pour la base de mon PFE.",
      ar: "كتبت 25 استعلاماً بلغة SQL لقاعدة بيانات مشروع نهاية الدراسة."
    },
    proof: {
      en: "GitHub repository link",
      fr: "Lien du dépôt GitHub",
      ar: "رابط المستودع على GitHub"
    }
  }, {
    id: "q3",
    ini: "IM",
    name: "Imane M.",
    p: "f_lang",
    skill: "multilingual",
    ev: {
      en: "Every summer I welcome guests at my family’s guesthouse in Chefchaouen, in French, English and Spanish.",
      fr: "Chaque été, j’accueille les clients de la maison d’hôtes familiale à Chefchaouen, en français, en anglais et en espagnol.",
      ar: "أستقبل كل صيف نزلاء دار الضيافة العائلية في شفشاون بالفرنسية والإنجليزية والإسبانية."
    },
    proof: {
      en: "Two written guest reviews and a letter from the guesthouse",
      fr: "Deux avis écrits de clients et une attestation de la maison d’hôtes",
      ar: "تقييمان مكتوبان من النزلاء وشهادة من دار الضيافة"
    }
  }, {
    id: "q4",
    ini: "HK",
    name: "Hamza K.",
    p: "f_eco",
    skill: "cash",
    ev: {
      en: "I closed the till every night at a café for 8 months.",
      fr: "J’ai fait la caisse chaque soir dans un café pendant 8 mois.",
      ar: "كنت أُغلق صندوق مقهى كل ليلة لمدة 8 أشهر."
    },
    proof: {
      en: "Signed letter from the café owner",
      fr: "Lettre signée du gérant du café",
      ar: "رسالة موقّعة من صاحب المقهى"
    }
  } ]
}, T = {
  lang_en: [ "English", "English", "English" ],
  lang_fr: [ "Français", "Français", "Français" ],
  lang_ar: [ "العربية", "العربية", "العربية" ],
  lang_ary: [ "الدارجة", "الدارجة", "الدارجة" ],
  tagline: [ "Skills → opportunities", "Compétences → opportunités", "من تجربة إلى فرصة" ],
  nav_home: [ "Home", "Accueil", "الرئيسية" ],
  nav_pass: [ "Passport", "Passeport", "الجواز" ],
  nav_opps: [ "Opportunities", "Opportunités", "الفرص" ],
  nav_plan: [ "Path", "Parcours", "المسار" ],
  tab_plan: [ "Path", "Parcours", "المسار" ],
  nav_iv: [ "Interview", "Entretien", "المقابلة" ],
  nav_prog: [ "Progress", "Progression", "التقدّم" ],
  nav_set: [ "Settings", "Paramètres", "الإعدادات" ],
  nav_uni: [ "Institution view", "Vue établissement", "واجهة المؤسسة" ],
  back: [ "Back", "Retour", "رجوع" ],
  next: [ "Next", "Suivant", "التالي" ],
  close: [ "Close", "Fermer", "إغلاق" ],
  cancel: [ "Cancel", "Annuler", "إلغاء" ],
  send: [ "Send", "Envoyer", "إرسال" ],
  copy: [ "Copy", "Copier", "نسخ" ],
  copied: [ "Copied", "Copié", "نُسخ" ],
  try_again: [ "Try again", "Réessayer", "أعد المحاولة" ],
  demo: [ "Demo", "Démo", "تجريبي" ],
  saved: [ "Saved", "Enregistré", "حُفظ" ],
  min_n: [ "{n} min", "{n} min", "{n|zero:# دقيقة|one:دقيقة واحدة|two:دقيقتان|few:# دقائق|many:# دقيقة|other:# دقيقة}" ],
  day_n: [ "Day {n}", "Jour {n}", "اليوم {n}" ],
  ai_live: [ "AI active", "IA active", "الذكاء الاصطناعي متّصل" ],
  ai_off: [ "Built-in reader", "Lecteur intégré", "المحلّل المدمج" ],
  ai_check: [ "Connecting to AI…", "Connexion à l’IA…", "جارٍ الاتصال…" ],
  ai_off_d: [ "AI is unreachable. The built-in reader takes over.", "L’IA est injoignable. Le lecteur intégré prend le relais.", "يعمل المحلّل المدمج في هذه الصفحة دون ذكاء اصطناعي." ],
  ai_fail: [ "The AI did not respond. The built-in reader took over.", "L’IA n’a pas répondu. Le lecteur intégré a pris le relais.", "لم يستجب الذكاء الاصطناعي، فاستُخدم المحلّل المدمج." ],
  ai_denied: [ "AI is turned off here. The built-in reader takes over.", "L’IA est désactivée ici. Le lecteur intégré prend le relais.", "الذكاء الاصطناعي غير مفعّل هنا. يُستخدم المحلّل المدمج." ],
  ai_busy: [ "Too many requests. Wait a minute, then try again.", "Trop de demandes. Patientez une minute, puis réessayez.", "عدد الطلبات كبير. انتظر دقيقة ثم أعد المحاولة." ],
  lp_q: [ "What’s the last thing you did?", "Quelle est la dernière chose que vous avez faite ?", "ما آخر شيء قمت به؟" ],
  lp_sub: [ "A job, the family shop, a club, a project. Say it in your own words, even in Darija. SKILMA finds the skills it proves, where they can take you, and what to do next.", "Un emploi, la boutique familiale, un club, un projet. Racontez-le avec vos mots, même en darija. SKILMA repère les compétences qu’il démontre, où elles mènent et quoi faire ensuite.", "عمل، أو متجر العائلة، أو نادٍ، أو مشروع. احكِه بكلماتك، ولو بالدارجة. تستخرج سكيلما المهارات التي يُثبتها، وتُريك أين يمكن أن تقودك، وما الخطوة التالية." ],
  lp_ph: [ "e.g. I help at my dad’s shop on weekends. I serve customers and…", "Ex. : j’aide mon père à la boutique le week-end. Je sers les clients et…", "مثال: أساعد والدي في متجره نهاية الأسبوع، وأستقبل الزبائن و…" ],
  lp_go: [ "Find my skills", "Trouver mes compétences", "اكتشف مهاراتي" ],
  lp_try: [ "Try a sample story", "Essayer un exemple", "جرّب قصة جاهزة" ],
  lp_eyebrow: [ "For students in Morocco", "Pour les étudiants au Maroc", "لطلبة المغرب" ],
  lp_promise: [ "Turn what you’ve done into proof, and proof into your first opportunity.", "Transformez ce que vous avez fait en preuves, et vos preuves en première opportunité.", "حوّل ما أنجزته إلى إثبات، والإثبات إلى أول فرصة لك." ],
  lp_demo_t: [ "One sentence. Five answers.", "Une phrase. Cinq réponses.", "جملة واحدة. خمس إجابات." ],
  lp_demo_d: [ "An illustrative example, analysed by the engine you are about to use.", "Un exemple illustratif, analysé par le moteur que vous allez utiliser.", "مثال توضيحي عالجه المحرّك نفسه الذي ستستخدمه." ],
  ax_exp: [ "Experience", "Expérience", "التجربة" ],
  ax_opp: [ "Where it leads", "Débouchés", "إلى أين تقود" ],
  ax_gap: [ "What’s missing", "Ce qui manque", "ما ينقص" ],
  ax_next: [ "Next move", "Prochaine action", "الخطوة التالية" ],
  ax_input: [ "“I help at my dad’s shop. I serve customers, handle the cash and negotiate with suppliers.”", "« J’aide à la boutique de mon père. Je sers les clients, je tiens la caisse et je négocie avec les fournisseurs. »", "«أساعد والدي في المتجر. أستقبل الزبائن، وأتولّى الصندوق، وأفاوض الموردين على الأسعار.»" ],
  ax_try: [ "Try it with your own experience", "Essayez avec votre propre expérience", "جرّبها بقصتك" ],
  lp_uni_t: [ "For institutions", "Pour les établissements", "للمؤسسات" ],
  tr1: [ "Nothing enters your passport without your yes.", "Rien n’entre dans votre passeport sans votre accord.", "لا يدخل شيء إلى جوازك دون موافقتك." ],
  tr2: [ "Every skill shows the words it came from.", "Chaque compétence indique les mots dont elle provient.", "كل مهارة تعرض الكلمات التي استُخرجت منها." ],
  tr3: [ "Your institution sees groups, never you individually, unless you share.", "Votre établissement voit des groupes, jamais votre profil seul, sauf si vous le partagez.", "ترى مؤسستك مجموعات، ولا تراك فرداً إلا إذا شاركت بياناتك." ],
  nav_how: [ "How it works", "Fonctionnement", "طريقة العمل" ],
  nav_trust: [ "Trust", "Confiance", "الثقة" ],
  lp_start: [ "Get started", "Commencer", "ابدأ الآن" ],
  h_title: [ "Turn what you have done into proof employers can trust.", "Transformez ce que vous avez fait en preuves fiables pour les recruteurs.", "حوّل ما أنجزته إلى إثبات يثق به أصحاب العمل." ],
  h_cta2: [ "See how it works", "Voir le fonctionnement", "اطّلع على طريقة العمل" ],
  win_t: [ "New experience", "Nouvelle expérience", "تجربة جديدة" ],
  live_t: [ "Detected as you type", "Détecté pendant la saisie", "يُرصد أثناء الكتابة" ],
  live_0: [ "Skills appear here as you write.", "Les compétences s’affichent ici pendant la saisie.", "تظهر المهارات هنا أثناء الكتابة." ],
  how_t: [ "From one sentence to your first opportunity", "D’une phrase à votre première opportunité", "من جملة واحدة إلى أول فرصة" ],
  s1t: [ "Tell", "Racontez", "احكِ" ],
  s1d: [ "Describe one real thing you did, in any language.", "Décrivez une chose réelle que vous avez faite, dans n’importe quelle langue.", "صِف شيئاً حقيقياً قمت به، بأي لغة." ],
  s2t: [ "Confirm", "Confirmez", "أكّد" ],
  s2d: [ "Each skill comes with the words it came from. You decide.", "Chaque compétence est accompagnée des mots dont elle provient. Vous décidez.", "تأتي كل مهارة مع الكلمات التي استُخرجت منها. القرار لك." ],
  s3t: [ "Aim", "Visez", "استهدف" ],
  s3d: [ "See where your skills fit, and exactly what’s missing.", "Voyez où vos compétences correspondent et ce qui manque précisément.", "اعرف أين تلائم مهاراتك، وما الذي ينقصك بالتحديد." ],
  s4t: [ "Prove", "Prouvez", "أثبِت" ],
  s4d: [ "Close the gap in 30 days, one small proof at a time.", "Comblez l’écart en 30 jours, une petite preuve à la fois.", "سُدّ الفجوة في 30 يوماً، بإثبات صغير في كل مرة." ],
  uni_h: [ "Employability you can act on.", "Des indicateurs d’employabilité pour agir.", "قابلية تشغيل تستطيعون تحسينها." ],
  trust_h: [ "Built on consent, not on guesses.", "Fondé sur le consentement, pas sur des suppositions.", "مبنيّة على الموافقة، لا على التخمين." ],
  final_t: [ "Your first opportunity starts with one sentence.", "Votre première opportunité commence par une phrase.", "فرصتك الأولى تبدأ بجملة واحدة." ],
  hx_sub: [ "Tell us what you did. SKILMA finds your skills and the jobs that fit.", "Racontez ce que vous avez fait. SKILMA trouve vos compétences et les emplois qui vous vont.", "احكِ ما قمت به، وسكيلما تجد مهاراتك والوظائف التي تناسبك." ],
  st_h: [ "Three steps. A few minutes.", "Trois étapes. Quelques minutes.", "ثلاث خطوات. دقائق قليلة." ],
  st1t: [ "Write one sentence", "Écrivez une phrase", "اكتب جملة" ],
  st1d: [ "About anything you did: work, a club, helping at home.", "Sur ce que vous avez fait : un travail, un club, aider à la maison.", "عن أي شيء قمت به: عمل، نادٍ، مساعدة في البيت." ],
  st2t: [ "Say yes to your skills", "Validez vos compétences", "أكّد مهاراتك" ],
  st2d: [ "We show the words each skill came from. You keep only what is true.", "On montre les mots d’où vient chaque compétence. Vous gardez ce qui est vrai.", "نُريك الكلمات التي جاءت منها كل مهارة، وتحتفظ بما هو صحيح فقط." ],
  st3t: [ "See where you can go", "Voyez où aller", "اعرف إلى أين تتجه" ],
  st3d: [ "Jobs that fit, what is missing, and a 30-day plan.", "Les emplois qui vous vont, ce qui manque, et un plan de 30 jours.", "وظائف تناسبك، وما ينقصك، وخطة من 30 يوماً." ],
  ax_btn: [ "Display", "Affichage", "العرض" ],
  wf_h: [ "Whoever you are, your story counts.", "Qui que vous soyez, votre histoire compte.", "أيّاً كنت، لقصتك قيمة." ],
  wf_sub: [ "Five very different lives. Each one already holds skills employers look for.", "Cinq vies très différentes. Chacune contient déjà des compétences recherchées.", "خمس حيوات مختلفة، وفي كل واحدة منها مهارات يبحث عنها المشغّلون." ],
  wf_w1: [ "University student", "Étudiant·e à la fac", "طالب جامعي" ],
  wf_w2: [ "Helps at the family shop", "Aide à la boutique familiale", "يساعد في متجر العائلة" ],
  wf_w3: [ "Learns on their own", "Apprend en autodidacte", "يتعلّم وحده" ],
  wf_w4: [ "Working, no diploma", "Travaille, sans diplôme", "يعمل دون شهادة" ],
  wf_w5: [ "Back to work after years at home", "Reprend après des années au foyer", "تعود إلى العمل بعد سنوات في البيت" ],
  wf_gt: [ "Teacher, parent or career centre?", "Enseignant, parent ou centre d’orientation ?", "معلّم، وليّ أمر أو مركز توجيه؟" ],
  wf_gd: [ "Sit next to a young person and write their first sentence together. Five minutes is enough.", "Asseyez-vous à côté d’un jeune et écrivez ensemble sa première phrase. Cinq minutes suffisent.", "اجلس بجانب شاب واكتبا معاً جملته الأولى. خمس دقائق تكفي." ],
  ax_all: [ "Made for every hand", "Pensé pour tout le monde", "مصمّمة للجميع" ],
  wf_s1: [ "I organised a charity day at my faculty and led a team of 12 volunteers.", "J'ai organisé une journée solidaire à la fac et j'ai dirigé une équipe de 12 bénévoles.", "نظّمت يوماً تضامنياً في كليتي وقدت فريقاً من 12 متطوعاً." ],
  wf_s2: [ "I help my father at the shop: I serve customers, count the cash and order new stock.", "J'aide mon père au magasin : je sers les clients, je compte la caisse et je commande le stock.", "أساعد أبي في المتجر: أستقبل الزبائن وأحسب الصندوق وأطلب السلع." ],
  wf_s3: [ "I learned video editing on YouTube and I run the Instagram page of a local café.", "J'ai appris le montage vidéo sur YouTube et je gère la page Instagram d'un café du quartier.", "تعلّمت المونتاج على يوتيوب وأدير صفحة إنستغرام لمقهى في الحي." ],
  wf_s4: [ "I worked in a café for three years, I trained the new waiters and solved problems with customers.", "J'ai travaillé trois ans dans un café, j'ai formé les nouveaux serveurs et réglé les problèmes avec les clients.", "عملت ثلاث سنوات في مقهى، ودرّبت النُّدُل الجدد وحللت مشاكل الزبائن." ],
  wf_s5: [ "For years I managed the family budget and I help the neighbours' children with their homework.", "Pendant des années j'ai géré le budget de la famille et j'aide les enfants des voisins à faire leurs devoirs.", "لسنوات أدرت ميزانية الأسرة، وأساعد أطفال الجيران في واجباتهم المدرسية." ],
  lp_free: [ "About ten minutes", "Environ dix minutes", "نحو عشر دقائق" ],
  lp_private: [ "Nothing is shared without your yes", "Rien n’est partagé sans votre accord", "لا يُشارَك شيء دون موافقتك" ],
  lp_any: [ "Any language, even Darija", "Toutes les langues, même la darija", "بأي لغة، حتى الدارجة" ],
  lp_s1t: [ "Tell", "Racontez", "احكِ" ],
  lp_s1d: [ "One real experience. One minute.", "Une expérience réelle. Une minute.", "تجربة حقيقية واحدة. دقيقة واحدة." ],
  lp_s2t: [ "Discover", "Découvrez", "اكتشف" ],
  lp_s2d: [ "AI finds skills you did not know you had.", "L’IA repère des compétences que vous ignoriez.", "يكتشف الذكاء الاصطناعي مهارات لم تكن تعلم أنك تملكها." ],
  lp_s3t: [ "Get ready", "Préparez-vous", "استعدّ" ],
  lp_s3d: [ "A 30-day path to your first opportunity.", "Un parcours de 30 jours vers votre première opportunité.", "مسار 30 يوماً نحو أول فرصة." ],
  lp_uni: [ "For institutions", "Pour les établissements", "للمؤسسات" ],
  lp_short: [ "Write a little more: at least one full sentence.", "Écrivez un peu plus : au moins une phrase complète.", "أضف المزيد: جملة كاملة على الأقل." ],
  lp_resume: [ "Continue where I left off", "Reprendre où j’en étais", "تابع من حيث توقفت" ],
  say_hi: [ "Tell me one thing you did.", "Décrivez une chose que vous avez faite.", "اكتب شيئاً واحداً قمت به." ],
  say_listen: [ "I’m listening…", "J’écoute…", "أقرأ…" ],
  say_rare: [ "A rare skill.", "Une compétence rare.", "مهارة نادرة." ],
  say_yes1: [ "Done.", "C’est fait.", "تمّ." ],
  say_yes2: [ "Added.", "Ajoutée.", "أُضيفت." ],
  say_yes3: [ "Added to your passport.", "Ajoutée à votre passeport.", "أُضيفت إلى جوازك." ],
  say_no: [ "Understood.", "Entendu.", "لا بأس." ],
  say_day: [ "Day complete.", "Journée terminée.", "أُنجزت مهمة اليوم." ],
  say_back: [ "Welcome back, {name}.", "Bon retour, {name}.", "مرحباً بعودتك، {name}." ],
  say_ready: [ "You can apply now.", "Vous pouvez maintenant postuler.", "جاهزيتك مكتملة. قدّم الآن." ],
  rd_1: [ "Reading your story…", "Lecture de votre récit…", "أقرأ قصتك…" ],
  rd_2: [ "Finding what you actually did…", "Repérage de ce que vous avez réellement fait…", "أبحث عمّا قمت به بالتحديد…" ],
  rd_3: [ "Linking it to recognised skills…", "Rapprochement avec des compétences reconnues…", "أربطه بمهارات معروفة…" ],
  rd_4: [ "Almost done…", "Presque terminé…", "أوشكت على الانتهاء…" ],
  th_rare: [ "Rare on CVs", "Rare sur les CV", "نادرة في السِّيَر الذاتية" ],
  th_skill: [ "Skill found", "Compétence trouvée", "مهارة مُكتشفة" ],
  th_check: [ "Worth checking", "À vérifier", "تحتاج تأكيداً" ],
  th_of: [ "{i} of {n}", "{i} sur {n}", "{i} من {n}" ],
  th_yes: [ "Yes, add it", "Oui, l’ajouter", "نعم، أضِفها" ],
  th_no: [ "No, leave it out", "Non, l’écarter", "لا، استبعِدها" ],
  th_all: [ "Confirm all", "Tout confirmer", "أكّد الكل" ],
  th_by_ai: [ "Found by AI in your words", "Trouvé par l’IA dans vos mots", "وجدها الذكاء الاصطناعي في كلماتك" ],
  th_by_rules: [ "Found in your words", "Trouvé dans vos mots", "وجدناها في كلماتك" ],
  th_rare_why: [ "Students rarely list this on a CV. Employers look for it.", "Les étudiants l’indiquent rarement sur un CV. Les recruteurs la recherchent.", "قلّما يكتبها الطلبة في سيرهم الذاتية، ويبحث عنها أصحاب العمل." ],
  why_count: [ "Requested by {n|one:# opportunity|other:# opportunities} out of {m} on your map.", "Demandée par {n|one:# opportunité|other:# opportunités} sur {m} de votre carte.", "تطلبها {n} من فرص خريطتك البالغ عددها {m}." ],
  why_any: [ "Useful in almost every role.", "Utile dans presque tous les postes.", "مفيدة في كل وظيفة تقريباً." ],
  th_q: [ "Does this describe you?", "Est-ce que cela vous décrit ?", "هل يصفك هذا؟" ],
  conf_high: [ "Clearly shown", "Clairement établie", "ظاهرة بوضوح" ],
  conf_med: [ "Implied — check it", "Implicite — à vérifier", "مستنتجة: تحقّق منها" ],
  dn_left: [ "{n|one:# skill left out|other:# skills left out}. Restore anytime from your passport.", "{n|one:# compétence écartée|other:# compétences écartées}. Restauration possible depuis votre passeport.", "{n|zero:لم تُستبعد أي مهارة|one:استُبعدت مهارة واحدة|two:استُبعدت مهارتان|few:استُبعدت # مهارات|many:استُبعدت # مهارة|other:استُبعدت # مهارة}. يمكنك إعادتها من الجواز." ],
  st_sugg: [ "Suggested", "Suggérée", "مقترحة" ],
  st_miss: [ "Missing", "Manquante", "ناقصة" ],
  st_rej: [ "Left out", "Écartée", "مستبعدة" ],
  restore: [ "Restore", "Restaurer", "استرجاع" ],
  remove: [ "Remove", "Retirer", "استبعاد" ],
  pp_q: [ "What you can prove", "Ce que vous pouvez prouver", "ما تستطيع إثباته" ],
  pp_unlocks: [ "Counts for {n|one:# opportunity|other:# opportunities}", "Compte pour {n|one:# opportunité|other:# opportunités}", "{n|zero:لا تُحتسب في أي فرصة|one:تُحتسب في فرصة واحدة|two:تُحتسب في فرصتين|few:تُحتسب في # فرص|many:تُحتسب في # فرصة|other:تُحتسب في # فرصة}" ],
  src_story: [ "From your story", "De votre récit", "من قصتك" ],
  src_plan: [ "From your path", "De votre parcours", "من مسارك" ],
  src_chat: [ "From a chat", "D’une discussion", "من محادثة" ],
  pp_left: [ "Left out", "Écartées", "مستبعدة" ],
  pp_card_flip: [ "Turn the card", "Retourner la carte", "اقلب البطاقة" ],
  fit_est: [ "Estimated fit: {p}%", "Adéquation estimée : {p} %", "توافق تقديري بنسبة {p}%" ],
  fit_skills: [ "{a} of {b} required skills", "{a} compétences requises sur {b}", "المهارات المطلوبة: {a} من {b}" ],
  fit_core: [ "{n|one:# key skill missing|other:# key skills missing}", "{n|one:# compétence clé manquante|other:# compétences clés manquantes}", "{n|zero:لا تنقص أي مهارة أساسية|one:تنقص مهارة أساسية واحدة|two:تنقص مهارتان أساسيتان|few:تنقص # مهارات أساسية|many:تنقص # مهارة أساسية|other:تنقص # مهارة أساسية}" ],
  fit_core0: [ "Every key skill", "Toutes les compétences clés", "كل المهارات الأساسية متوفرة" ],
  fit_how: [ "How is this calculated?", "Comment est-ce calculé ?", "كيف يُحسب هذا؟" ],
  fit_how_d: [ "Skills alignment counts the role’s required skills you have confirmed. Core skills are shown apart because they matter most. Known requirements (level, languages) and your preferences are checked separately. It is guidance, not a hiring decision.", "L’adéquation compte les compétences requises que vous avez confirmées. Les compétences clés sont montrées à part, car elles comptent le plus. Les exigences connues (niveau, langues) et vos préférences sont vérifiées séparément. C’est un repère, pas une décision d’embauche.", "يحسب التوافق المهارات المطلوبة التي أكّدتها، مع إبراز المهارات الأساسية على حدة لأنها الأهم. أما المتطلبات المعروفة (المستوى واللغات) وتفضيلاتك فتُفحص كلٌّ على حدة. إنه توجيه، لا قرار توظيف." ],
  ready_how: [ "Readiness is a checklist, not a prediction: every required skill confirmed by you, every core skill backed by evidence from your path or your institution, one full mock interview, and your Day 30 project. “Ready to apply” means the first two are complete. It is guidance, never a hiring decision.", "La préparation est une liste, pas une prédiction : chaque compétence requise confirmée par vous, chaque compétence clé appuyée par une preuve de votre parcours ou de votre établissement, un entretien blanc complet et votre projet du jour 30. « Prêt à postuler » signifie que les deux premiers points sont complets. C’est un repère, jamais une décision d’embauche.", "الجاهزية قائمة وليست توقّعاً: كل مهارة مطلوبة أكّدتها أنت، وكل مهارة أساسية مدعومة بدليل من مسارك أو من مؤسستك، ومقابلة تدريبية كاملة، ومشروع اليوم 30. وتعني «جاهز للترشّح» اكتمال البندين الأولين. إنها توجيه، لا قرار توظيف." ],
  od_next: [ "Your next move", "Votre prochaine action", "خطوتك التالية" ],
  od_start: [ "Start with: {x}", "Commencez par : {x}", "البداية: {x}" ],
  hm_why: [ "Why this step: {x}", "Pourquoi cette étape : {x}", "سبب هذه الخطوة: {x}" ],
  hm_dest: [ "Your goal", "Votre objectif", "هدفك" ],
  hm_req: [ "Required skills matched: {a} of {b}", "Compétences requises couvertes : {a} sur {b}", "مهارات مطلوبة متوافقة: {a} من {b}" ],
  hm_missing: [ "Still missing", "Il manque encore", "ما زال ناقصاً" ],
  hm_in_path: [ "in your path", "dans votre parcours", "في مسارك" ],
  hm_change: [ "Change goal", "Changer d’objectif", "غيّر الهدف" ],
  pg_req: [ "Required skills matched", "Compétences requises couvertes", "مهارات مطلوبة متوافقة" ],
  pg_proven: [ "All skills with proof", "Toutes les compétences avec preuve", "كل المهارات التي لها دليل" ],
  pg_moved: [ "Steps done", "Étapes faites", "خطوات منجزة" ],
  pg_mile: [ "Milestones", "Jalons", "المحطات" ],
  pg_mile0: [ "Your milestones appear here as you go.", "Vos jalons apparaîtront ici.", "ستظهر محطاتك هنا تباعاً." ],
  ev_story: [ "Experience described", "Expérience décrite", "رويت تجربة" ],
  ev_skills: [ "{n|one:# skill confirmed|other:# skills confirmed}", "{n|one:# compétence confirmée|other:# compétences confirmées}", "{n|zero:لم تؤكّد أي مهارة|one:أكّدت مهارة واحدة|two:أكّدت مهارتين|few:أكّدت # مهارات|many:أكّدت # مهارة|other:أكّدت # مهارة}" ],
  ev_goal: [ "Goal set: {x}", "Objectif défini : {x}", "الهدف: {x}" ],
  ev_proven: [ "Proof added: {x}", "Preuve ajoutée : {x}", "أُضيف دليل: {x}" ],
  ev_iv: [ "Mock interview: {s}/100", "Entretien blanc : {s}/100", "مقابلة تدريبية: {s}/100" ],
  ev_ver: [ "Verified by the institution", "Vérifié par l’établissement", "وثّقت المؤسسة جوازك" ],
  ev_apply: [ "Tracking: {x}", "Suivi : {x}", "قيد المتابعة: {x}" ],
  tk_proven: [ "{skill} now has proof in your passport", "{skill} a maintenant une preuve dans votre passeport", "{skill}: أصبح لها دليل في جوازك" ],
  tk_why_proof: [ "This task adds proof to your passport.", "Cette tâche ajoute une preuve à votre passeport.", "هذه المهمة تضيف دليلاً إلى جوازك." ],
  pl_block_s: [ "{skill}: show it → prove it", "{skill} : la montrer → la prouver", "{skill}: اعرضها ← أثبِتها" ],
  hm_unproven: [ "Confirmed, no proof yet", "Confirmées, sans preuve", "مؤكَّدة، دون دليل بعد" ],
  pl_block: [ "{skill}: learn → practise → prove", "{skill} : apprendre → pratiquer → prouver", "{skill}: تعلّم ← تدرّب ← أثبِت" ],
  pl_block_proj: [ "Portfolio project for {org}", "Projet de portfolio pour {org}", "مشروع ملف الأعمال لفائدة {org}" ],
  pl_block_end: [ "Interview and application", "Entretien et candidature", "المقابلة والترشّح" ],
  roles_t: [ "View as", "Afficher en tant que", "العرض بصفة" ],
  v_student: [ "Student", "Étudiant", "طالب" ],
  v_uni: [ "Institution", "Établissement", "مؤسسة" ],
  v_ops: [ "Operations", "Opérations", "العمليات" ],
  u_week: [ "This week", "Cette semaine", "هذا الأسبوع" ],
  u_attn: [ "Needs attention", "À traiter", "يحتاج إلى متابعة" ],
  u_cohort: [ "{n|one:# student|other:# students}", "{n|one:# étudiant|other:# étudiants}", "{n|zero:لا طلبة|one:طالب واحد|two:طالبان|few:# طلبة|many:# طالباً|other:# طالب}" ],
  u_evid: [ "Evidence", "Constats", "المعطيات" ],
  u_outcome: [ "Expected outcome", "Résultat attendu", "النتيجة المتوقعة" ],
  u_plan_btn: [ "Plan this", "Planifier", "جدولة" ],
  u_planned: [ "Planned", "Planifié", "مُجدوَل" ],
  u_changed: [ "What changed", "Ce qui a changé", "ما الذي تغيّر" ],
  u_analytics: [ "Analytics", "Analyses", "التحليلات" ],
  u_role: [ "Viewing as career advisor · groups of {n} or more students, plus passports students chose to share.", "Vue conseiller carrière · groupes de {n} étudiants ou plus, et passeports partagés volontairement.", "العرض بصفة مستشار توجيه · مجموعات من {n} طلبة فأكثر، والجوازات التي اختار أصحابها مشاركتها." ],
  u_shared: [ "Shared by the student for verification", "Partagé par l’étudiant pour vérification", "شاركه الطالب للتوثيق" ],
  ua1t: [ "238 students built a passport but chose no goal", "238 étudiants ont un passeport mais aucun objectif", "238 طالباً أنشؤوا جوازاً دون اختيار هدف" ],
  ua1e: [ "Passport 640 → goal 402 · biggest drop in the journey", "Passeport 640 → objectif 402 · plus forte déperdition du parcours", "الجواز 640 ← الهدف 402 · أكبر تراجع في المسار" ],
  ua1a: [ "Run 20-minute goal sessions in week 2, by programme", "Organiser des séances de 20 min sur l’objectif en semaine 2, par filière", "نظّموا جلسات من 20 دقيقة لتحديد الهدف في الأسبوع الثاني، حسب الشعبة" ],
  ua1o: [ "+80 students with a goal within 3 weeks", "+80 étudiants avec un objectif en 3 semaines", "+80 طالباً لديهم هدف خلال 3 أسابيع" ],
  ua2t: [ "126 students aiming at data or business roles have no Power BI proof yet", "126 étudiants visant des postes data ou business n’ont pas encore de preuve Power BI", "126 طالباً يستهدفون وظائف البيانات أو الأعمال دون إثبات في Power BI بعد" ],
  ua2e: [ "Power BI is the top gap (46%) and is required in 2 of 12 roles", "Power BI est l’écart n° 1 (46 %) et figure dans 2 postes sur 12", "Power BI هي أكبر فجوة (46%)، وهي مطلوبة في وظيفتين من أصل 12" ],
  ua2a: [ "Open a 4-week Power BI workshop on a real public dataset", "Ouvrir un atelier Power BI de 4 semaines sur un vrai jeu de données public", "نظّموا ورشة في Power BI مدتها 4 أسابيع على بيانات عمومية حقيقية" ],
  ua2o: [ "Power BI proof from about 60% of participants", "Preuves Power BI chez environ 60 % des participants", "إثباتات في Power BI لدى نحو 60% من المشاركين" ],
  uc1: [ "New active students: 188 in September, double August", "Nouveaux actifs : 188 en septembre, le double d’août", "طلبة نشطون جدد: 188 في شتنبر، ضعف شهر غشت" ],
  uc2: [ "Verification requests waiting: {n}", "Demandes de vérification en attente : {n}", "طلبات توثيق في الانتظار: {n}" ],
  o_title: [ "Control centre", "Centre de contrôle", "مركز التحكم" ],
  o_sub: [ "Live from this device: every analysis, the engine that ran it, and what the student decided.", "En direct depuis cet appareil : chaque analyse, son moteur et la décision de l’étudiant.", "مباشرة من هذا الجهاز: كل تحليل، والمحرّك الذي نفّذه، وقرار الطالب." ],
  o_engine: [ "Engine", "Moteur", "المحرّك" ],
  o_engine_ai: [ "Claude (Anthropic)", "Claude (Anthropic)", "Claude (Anthropic)" ],
  o_engine_rules: [ "Built-in reader", "Lecteur intégré", "المحلّل المدمج" ],
  o_tax: [ "Skills taxonomy", "Taxonomie des compétences", "تصنيف المهارات" ],
  o_runs: [ "Runs", "Exécutions", "عمليات التشغيل" ],
  o_ai_share: [ "By AI", "Par IA", "بالذكاء الاصطناعي" ],
  o_fallback: [ "Fallback", "Repli", "احتياطي" ],
  o_latency: [ "Median AI latency", "Latence IA médiane", "الزمن الوسيط لاستجابة الذكاء الاصطناعي" ],
  o_conf_rate: [ "Suggestions accepted", "Suggestions acceptées", "الاقتراحات المقبولة" ],
  o_rej: [ "Most left-out suggestions", "Suggestions les plus écartées", "أكثر الاقتراحات استبعاداً" ],
  o_fresh: [ "Opportunity data", "Données d’opportunités", "بيانات الفرص" ],
  o_log: [ "Run log", "Journal d’exécution", "سجل التشغيل" ],
  o_empty: [ "No runs yet. Analyse a story to see it here.", "Aucune exécution. Analysez un récit pour l’afficher ici.", "لا عمليات تشغيل بعد. حلّل قصة لتظهر هنا." ],
  o_truth: [ "What works today", "Ce qui fonctionne aujourd’hui", "ما يعمل اليوم" ],
  o_t1: [ "Working in this version: skill reading, matching, the 30-day path, interview feedback and the assistant. AI answers when it is reachable; otherwise the built-in reader does.", "Opérationnel dans cette version : lecture des compétences, correspondance, parcours de 30 jours, retours d’entretien et assistant. L’IA répond lorsqu’elle est joignable ; sinon, le lecteur intégré prend le relais.", "يعمل في هذه النسخة: قراءة المهارات، والمطابقة، ومسار 30 يوماً، وملاحظات المقابلة، والمساعد. يجيب الذكاء الاصطناعي متى كان متاحاً، وإلا تولّى المحلّل المدمج الإجابة." ],
  o_t2: [ "Your data stays in this browser. Only the text you ask the AI to read is sent to the AI service.", "Vos données restent dans ce navigateur. Seuls les textes que vous soumettez à l’IA sont transmis au service d’IA.", "تبقى بياناتك في هذا المتصفح، ولا يُرسَل إلى خدمة الذكاء الاصطناعي إلا النص الذي تطلب منه قراءته." ],
  o_th_t: [ "Time", "Heure", "الوقت" ],
  o_th_k: [ "Task", "Tâche", "المهمة" ],
  o_th_e: [ "Engine", "Moteur", "المحرّك" ],
  o_th_ms: [ "Duration", "Durée", "المدة" ],
  o_th_l: [ "Lang", "Langue", "اللغة" ],
  o_th_s: [ "Status", "Statut", "الحالة" ],
  ok: [ "OK", "OK", "ناجحة" ],
  failed: [ "Failed", "Échec", "فشلت" ],
  k_discover: [ "Skill analysis", "Analyse de compétences", "تحليل المهارات" ],
  k_plan: [ "Path", "Parcours", "المسار" ],
  k_iv: [ "Interview feedback", "Retour d’entretien", "ملاحظات المقابلة" ],
  k_copilot: [ "Copilot", "Copilote", "المساعد" ],
  k_explain: [ "Fit explanation", "Explication de l’adéquation", "شرح التوافق" ],
  k_insights: [ "Insights", "Analyses", "الاستنتاجات" ],
  dn_t: [ "skills found", "compétences trouvées", "مهارات مُكتشفة" ],
  dn_rare: [ "{n} rare", "{n|one:# rare|other:# rares}", "منها {n} نادرة" ],
  dn_sub: [ "You have more skills than your CV shows.", "Vous avez plus de compétences que votre CV n’en montre.", "تملك أكثر مما تُظهره سيرتك الذاتية." ],
  dn_go: [ "Where can I work?", "Où puis-je travailler ?", "أين يمكنني العمل؟" ],
  dn_back: [ "Back to my passport", "Retour à mon passeport", "العودة إلى الجواز" ],
  dn_none: [ "No clear skills found yet. Describe what you did, with verbs: sold, organised, managed.", "Aucune compétence claire repérée. Décrivez ce que vous avez fait, avec des verbes : vendu, organisé, géré.", "لم أجد مهارات واضحة بعد. صِف ما قمت به بأفعال: بعت، نظّمت، أدرت." ],
  dn_retry: [ "Add more detail", "Ajouter des détails", "أضف تفاصيل" ],
  dn_skip: [ "{n|one:# skill|other:# skills} already in your passport", "{n|one:# compétence|other:# compétences} déjà dans votre passeport", "{n|zero:لا مهارة منها في جوازك مسبقاً|one:مهارة واحدة موجودة في جوازك مسبقاً|two:مهارتان موجودتان في جوازك مسبقاً|few:# مهارات موجودة في جوازك مسبقاً|many:# مهارة موجودة في جوازك مسبقاً|other:# مهارة موجودة في جوازك مسبقاً}" ],
  su_name_t: [ "What should I call you?", "Comment dois-je vous appeler ?", "بمَ نناديك؟" ],
  su_name_ph: [ "Your first name", "Votre prénom", "اسمك الأول" ],
  su_field: [ "What do you study?", "Qu’étudiez-vous ?", "ما تخصصك؟" ],
  su_next: [ "Continue", "Continuer", "متابعة" ],
  su_goal_t: [ "Pick a goal. You can change it anytime.", "Choisissez un objectif. Vous pourrez le changer à tout moment.", "اختر هدفاً. يمكنك تغييره متى شئت." ],
  su_goal_s: [ "Ranked by how many required skills you already have.", "Classés selon le nombre de compétences requises que vous avez déjà.", "مرتّبة حسب عدد المهارات المطلوبة التي تملكها." ],
  su_later: [ "Choose later", "Choisir plus tard", "اختر لاحقاً" ],
  su_map: [ "See all on the map", "Tout voir sur la carte", "عرض الكل على الخريطة" ],
  su_building: [ "Building your 30-day path…", "Construction de votre parcours de 30 jours…", "نبني مسار 30 يوماً الخاص بك…" ],
  su_building_d: [ "One small task a day, from your real gaps.", "Une petite tâche par jour, à partir de vos écarts réels.", "مهمة صغيرة كل يوم، انطلاقاً من فجواتك الفعلية." ],
  f_eco: [ "Economics and management", "Économie et gestion", "الاقتصاد والتدبير" ],
  f_eng: [ "Engineering", "Ingénierie", "الهندسة" ],
  f_it: [ "Computer science", "Informatique", "المعلوميات" ],
  f_law: [ "Law", "Droit", "القانون" ],
  f_lang: [ "Languages", "Langues", "اللغات" ],
  f_other: [ "Something else", "Autre", "تخصص آخر" ],
  fit_strong: [ "Every key skill", "Toutes les compétences clés", "كل المهارات الأساسية" ],
  fit_worth: [ "One key skill missing", "Une compétence clé manquante", "تنقص مهارة أساسية واحدة" ],
  fit_stretch: [ "Two or more missing", "Deux manquantes ou plus", "تنقص مهارتان أو أكثر" ],
  fit_pct: [ "{p}% fit", "{p} % d’adéquation", "توافق {p}%" ],
  hi_m: [ "Good morning, {name}", "Bonjour, {name}", "صباح الخير، {name}" ],
  hi_e: [ "Good evening, {name}", "Bonsoir, {name}", "مساء الخير، {name}" ],
  hm_a: [ "You’re", "Votre préparation atteint", "جاهزيتك" ],
  hm_b: [ "ready for:", "pour :", "لوظيفة:" ],
  hm_nogoal: [ "You have {n|one:# skill|other:# skills}. Choose a goal to see what it asks for.", "Vous avez {n|one:# compétence|other:# compétences}. Choisissez un objectif pour voir ce qu’il demande.", "{n|zero:لا مهارات لديك بعد|one:لديك مهارة واحدة|two:لديك مهارتان|few:لديك # مهارات|many:لديك # مهارة|other:لديك # مهارة}. اختر هدفاً لترى ما يتطلّبه." ],
  hm_next: [ "Next step", "Prochaine étape", "الخطوة التالية" ],
  start_now: [ "Start now", "Commencer", "ابدأ الآن" ],
  hm_pick: [ "Choose a goal", "Choisir un objectif", "اختر هدفاً" ],
  hm_pick_d: [ "{n|one:# opportunity is|other:# opportunities are} waiting on your map.", "{n|one:# opportunité vous attend|other:# opportunités vous attendent} sur votre carte.", "{n|zero:لا فرص في خريطتك بعد|one:فرصة واحدة تنتظرك في خريطتك|two:فرصتان تنتظرانك في خريطتك|few:# فرص تنتظرك في خريطتك|many:# فرصة تنتظرك في خريطتك|other:# فرصة تنتظرك في خريطتك}." ],
  hm_done: [ "Your path is complete. Apply when you are ready.", "Votre parcours est terminé. Postulez quand vous le souhaitez.", "اكتمل مسارك. قدّم ترشيحك متى شئت." ],
  ch_pass: [ "skills", "compétences", "مهارات" ],
  ch_opps: [ "opportunities", "opportunités", "فرص" ],
  ch_plan: [ "days done", "jours accomplis", "أيام منجزة" ],
  ch_iv: [ "interview score", "score d’entretien", "نتيجة المقابلة" ],
  streak: [ "{n}-day streak", "{n|one:# jour d’affilée|other:# jours d’affilée}", "مواظبة: {n|zero:لا أيام|one:يوم واحد|two:يومان|few:# أيام|many:# يوماً|other:# يوم}" ],
  this_week: [ "This week", "Cette semaine", "هذا الأسبوع" ],
  tip_t: [ "From SKILMA", "De la part de SKILMA", "من سكيلما" ],
  ask: [ "Ask a question", "Poser une question", "اسأل سكيلما" ],
  tip_nogoal: [ "Your closest role is {role}: you already have {a} of its {b} required skills. See why?", "Le poste le plus proche est {role} : vous avez déjà {a} de ses {b} compétences requises. Voir pourquoi ?", "أقرب وظيفة إليك: {role}، ولديك {a} من مهاراتها المطلوبة البالغة {b}. تريد معرفة السبب؟" ],
  tip_gap: [ "{skill} is the gap that matters most for {role}. 20 minutes a day will help close it.", "{skill} est l’écart le plus important pour {role}. 20 minutes par jour aident à le combler.", "مهارة {skill} هي أهم فجوة لوظيفة {role}. عشرون دقيقة يومياً تكفي لسدّها." ],
  tip_prove: [ "{skill} is confirmed but has no evidence yet. One evidence task strengthens your passport more than a course.", "{skill} est confirmée mais sans preuve. Une tâche de preuve renforce votre passeport plus qu’un cours.", "{skill} مؤكَّدة لكن دون دليل بعد. مهمة إثبات واحدة تقوّي جوازك أكثر من دورة تكوينية." ],
  tip_iv: [ "Your skills are there. Now practise presenting them: try the mock interview.", "Vos compétences sont là. Entraînez-vous à les présenter : essayez l’entretien blanc.", "مهاراتك حاضرة. تدرّب الآن على الحديث عنها في المقابلة التدريبية." ],
  tip_ready: [ "Every required skill is confirmed and every core skill has evidence. You are ready to apply.", "Chaque compétence requise est confirmée et chaque compétence clé a une preuve. Vous êtes prêt à postuler.", "كل المهارات المطلوبة مؤكَّدة، وكل مهارة أساسية مدعومة بدليل. أنت جاهز للترشّح." ],
  pp_title: [ "Skills Passport", "Passeport de compétences", "جواز المهارات" ],
  pp_sub: [ "Every skill here comes from something you did.", "Chaque compétence provient de quelque chose que vous avez fait.", "كل مهارة هنا مصدرها شيء قمت به." ],
  pp_cover: [ "SKILLS PASSPORT", "PASSEPORT DE COMPÉTENCES", "جواز المهارات" ],
  pp_no: [ "Passport no.", "N° de passeport", "رقم الجواز" ],
  pp_issued: [ "Issued", "Émis le", "تاريخ الإصدار" ],
  pp_field: [ "Field", "Filière", "التخصص" ],
  pp_holder: [ "Holder", "Titulaire", "صاحب الجواز" ],
  pp_skills: [ "Skills", "Compétences", "المهارات" ],
  pp_exps: [ "Experiences", "Expériences", "التجارب" ],
  pp_verif: [ "Verification", "Vérification", "التوثيق" ],
  st_conf: [ "Confirmed by you", "Confirmée par vous", "أكّدتها بنفسك" ],
  st_proof: [ "With proof", "Avec preuve", "مع دليل" ],
  st_ver: [ "Verified by institution", "Vérifiée par l’établissement", "موثَّقة من المؤسسة" ],
  ev_n: [ "{n|one:# proof|other:# proofs}", "{n|one:# preuve|other:# preuves}", "{n|zero:لا إثباتات|one:إثبات واحد|two:إثباتان|few:# إثباتات|many:# إثباتاً|other:# إثبات}" ],
  pp_add: [ "Add an experience", "Ajouter une expérience", "أضف تجربة" ],
  pp_share: [ "Share", "Partager", "مشاركة" ],
  pp_prev: [ "Previous page", "Page précédente", "الصفحة السابقة" ],
  pp_nextp: [ "Next page", "Page suivante", "الصفحة التالية" ],
  pp_drag: [ "Drag or swipe to turn the page", "Faites glisser pour tourner la page", "اسحب لقلب الصفحة" ],
  pp_none: [ "No skills yet. Describe an experience to fill your passport.", "Pas encore de compétences. Décrivez une expérience pour remplir votre passeport.", "لا مهارات بعد. احكِ تجربة لتملأ جوازك." ],
  vs1: [ "You confirmed your skills", "Vous avez confirmé vos compétences", "أكّدت مهاراتك" ],
  vs1d: [ "{n|one:# skill, drawn from your own words|other:# skills, each drawn from your own words}", "{n|one:# compétence, tirée de vos propres mots|other:# compétences, toutes tirées de vos propres mots}", "{n|zero:لا مهارات بعد|one:مهارة واحدة|two:مهارتان|few:# مهارات|many:# مهارة|other:# مهارة}، من كلماتك أنت" ],
  vs2: [ "You added proof", "Vous avez ajouté des preuves", "أضفت إثباتات" ],
  vs2d: [ "{n|one:# proof|other:# proofs} from your path", "{n|one:# preuve issue|other:# preuves issues} de votre parcours", "{n|zero:لا إثباتات|one:إثبات واحد|two:إثباتان|few:# إثباتات|many:# إثباتاً|other:# إثبات} من مسارك" ],
  vs2d0: [ "Finish a “Prove” task in your path", "Terminez une tâche « Prouver » de votre parcours", "أنجز مهمة «أثبِت» في مسارك" ],
  vs3: [ "Institution verification", "Vérification par l’établissement", "توثيق المؤسسة" ],
  vs3d0: [ "Ask your career centre to verify", "Demandez la vérification à votre service carrière", "اطلب التوثيق من مركز التوجيه المهني" ],
  vs3dw: [ "Waiting for the career centre", "En attente du service carrière", "في انتظار مركز التوجيه المهني" ],
  vs3dv: [ "Verified on {d}", "Vérifié le {d}", "وُثّق بتاريخ {d}" ],
  ask_verify: [ "Ask my institution to verify", "Demander la vérification à mon établissement", "اطلب التوثيق من مؤسستي" ],
  verify_sent: [ "Request sent to Boughaz University. Their answer will appear here.", "Demande envoyée à l’Université du Boughaz. Sa réponse s’affichera ici.", "أُرسل الطلب إلى جامعة البوغاز، وسيظهر ردّها هنا." ],
  verified_note: [ "Boughaz University verified your passport.", "L’Université du Boughaz a vérifié votre passeport.", "وثّقت جامعة البوغاز جوازك." ],
  share_t: [ "Share your passport", "Partager votre passeport", "شارك جوازك" ],
  share_d: [ "Employers see your skills and the evidence behind them. Nothing else.", "Les recruteurs voient vos compétences et leurs preuves. Rien d’autre.", "يرى أصحاب العمل مهاراتك وإثباتاتها، ولا شيء غير ذلك." ],
  share_demo: [ "Preview of your public link", "Aperçu de votre lien public", "معاينة رابطك العام" ],
  legend_t: [ "How a skill grows", "Comment une compétence progresse", "كيف تنمو المهارة" ],
  pp_hint: [ "Tip: drag the page.", "Astuce : faites glisser la page.", "نصيحة: اسحب الصفحة." ],
  om_title: [ "Your opportunity map", "Votre carte des opportunités", "خريطة فرصك" ],
  om_sub: [ "You are at the centre. The closer a role, the more of its skills you have.", "Vous êtes au centre. Plus un poste est proche, plus vous avez ses compétences.", "أنت في المركز. كلما اقتربت الوظيفة، زادت مهاراتها التي تملكها." ],
  om_you: [ "You", "Vous", "أنت" ],
  f_all: [ "All", "Toutes", "الكل" ],
  f_job: [ "Jobs", "Emplois", "وظائف" ],
  f_intern: [ "Internships", "Stages", "تداريب" ],
  v_map: [ "Map", "Carte", "خريطة" ],
  v_list: [ "List", "Liste", "قائمة" ],
  od_have: [ "You have", "Vous avez", "لديك" ],
  od_need: [ "You need", "Il vous manque", "ما ينقصك" ],
  od_hours: [ "~{h} h", "env. {h} h", "{h|zero:أقل من ساعة|one:ساعة واحدة تقريباً|two:ساعتان تقريباً|few:# ساعات تقريباً|many:# ساعة تقريباً|other:# ساعة تقريباً}" ],
  od_why: [ "Why you fit", "Pourquoi vous", "لماذا تناسبك" ],
  od_explain: [ "Explain with AI", "Expliquer avec l’IA", "اشرح بالذكاء الاصطناعي" ],
  od_project: [ "Prove it with a project", "Prouvez-le par un projet", "أثبِت ذلك بمشروع" ],
  od_goal: [ "Make this my goal", "En faire mon objectif", "اجعلها هدفي" ],
  od_isgoal: [ "Your goal", "Votre objectif", "هدفك" ],
  od_apply: [ "Apply", "Postuler", "قدّم ترشيحك" ],
  od_applied: [ "Applied", "Candidature envoyée", "تمّ الترشّح" ],
  od_apply_at: [ "Applications open at 70% readiness", "Candidature possible dès 70 % de préparation", "يُتاح الترشّح عند بلوغ جاهزية 70%" ],
  od_switch: [ "Switch goal? Your current path will restart.", "Changer d’objectif ? Votre parcours recommencera.", "تغيير الهدف؟ سيبدأ مسارك الحالي من جديد." ],
  yes_switch: [ "Switch", "Changer", "تغيير" ],
  applied_toast: [ "Added to your applications", "Ajouté à vos candidatures", "أُضيف إلى ترشّحاتك" ],
  type_job: [ "Job", "Emploi", "وظيفة" ],
  type_intern: [ "Internship", "Stage", "تدريب" ],
  core: [ "key", "clé", "أساسية" ],
  why_rules: [ "You already have {have}: {a} of the {b} required skills.", "Vous avez déjà {have} : {a} des {b} compétences requises.", "لديك مسبقاً {have}، أي {a} من المهارات المطلوبة البالغة {b}." ],
  why_gap: [ "The gap: {miss}. About {h} hours of learning.", "L’écart : {miss}. Environ {h} h d’apprentissage.", "الفجوة: {miss}. تحتاج إلى {h|zero:أقل من ساعة|one:ساعة واحدة|two:ساعتين|few:# ساعات|many:# ساعة|other:# ساعة} من التعلّم تقريباً." ],
  why_nogap: [ "No gap left. Practise the interview and apply.", "Plus aucun écart. Entraînez-vous à l’entretien et postulez.", "لم تبقَ أي فجوة. تدرّب على المقابلة ثم قدّم ترشيحك." ],
  pl_title: [ "Your 30-day path", "Votre parcours de 30 jours", "مسار 30 يوماً" ],
  pl_for: [ "Toward {role}", "Vers {role}", "نحو {role}" ],
  pl_ai: [ "Written by AI from your gaps", "Rédigé par l’IA à partir de vos écarts", "كتبه الذكاء الاصطناعي انطلاقاً من فجواتك" ],
  pl_base: [ "Built-in path", "Parcours intégré", "مسار مدمج" ],
  pl_regen: [ "Regenerate with AI", "Régénérer avec l’IA", "أعد بناءه بالذكاء الاصطناعي" ],
  pl_open: [ "Open task", "Ouvrir la tâche", "افتح المهمة" ],
  pl_week: [ "Week {n}", "Semaine {n}", "الأسبوع {n}" ],
  pl_days: [ "{n}/30 days", "{n}/30 jours", "{n}/30 يوماً" ],
  pl_ready: [ "ready", "préparation", "الجاهزية" ],
  pl_streak: [ "streak", "série", "أيام متتالية" ],
  pl_nogoal: [ "Choose a goal first. Your path covers what it requires that you cannot prove yet.", "Choisissez d’abord un objectif. Votre parcours couvre ce qu’il exige et que vous ne prouvez pas encore.", "اختر هدفاً أولاً. يُبنى مسارك على ما يتطلّبه هذا الهدف ولا تستطيع إثباته بعد." ],
  pl_locked: [ "Finish today’s task first.", "Terminez d’abord la tâche du jour.", "أنجز مهمة اليوم أولاً." ],
  pl_all: [ "30 days complete.", "30 jours accomplis.", "أنجزت 30 يوماً." ],
  pl_week_list: [ "This week’s tasks", "Tâches de la semaine", "مهام هذا الأسبوع" ],
  k_learn: [ "Learn", "Apprendre", "تعلّم" ],
  k_practice: [ "Practise", "Pratiquer", "تدرّب" ],
  k_prove: [ "Prove", "Prouver", "أثبِت" ],
  k_review: [ "Reflect", "Réfléchir", "تأمّل" ],
  k_project: [ "Project", "Projet", "مشروع" ],
  k_interview: [ "Interview", "Entretien", "مقابلة" ],
  k_apply: [ "Apply", "Postuler", "ترشّح" ],
  tk_why: [ "Why", "Pourquoi", "لماذا" ],
  tk_steps: [ "Steps", "Étapes", "الخطوات" ],
  tk_proof: [ "Your proof", "Votre preuve", "إثباتك" ],
  tk_res: [ "Resource", "Ressource", "المرجع" ],
  tk_proof_ph: [ "A link (Drive, GitHub, LinkedIn…) or what you made, with one result.", "Un lien (Drive, GitHub, LinkedIn…) ou ce que vous avez réalisé, avec un résultat.", "رابط (Drive أو GitHub أو LinkedIn…) أو وصف لما أنجزته مع نتيجة واحدة." ],
  tk_proof_need: [ "Add a link to your work, or describe it in at least two sentences.", "Ajoutez un lien vers votre travail, ou décrivez-le en deux phrases au moins.", "أضف رابطاً لعملك، أو صِفه في جملتين على الأقل." ],
  tk_done: [ "Done", "Terminé", "أنجزتها" ],
  tk_was: [ "Completed", "Terminée", "مُنجزة" ],
  tk_help: [ "Need help? Ask a question", "Besoin d’aide ? Posez une question", "تحتاج إلى مساعدة؟ اسألني" ],
  tk_go_iv: [ "Open the interview", "Ouvrir l’entretien", "افتح المقابلة" ],
  tk_toast: [ "Day {d} done · {x} steps toward the role", "Jour {d} terminé · {x} étapes vers le poste", "انتهى اليوم {d} · {x} خطوات نحو الوظيفة" ],
  tk_skill: [ "{skill} added to your passport", "{skill} ajoutée à votre passeport", "أُضيفت مهارة {skill} إلى جوازك" ],
  cel_t: [ "Path complete.", "Parcours terminé.", "اكتمل المسار." ],
  cel_d: [ "Your project is now in your passport. Checklist for {role}: {x} steps done.", "Votre projet est dans votre passeport. Liste pour {role} : {x} étapes faites.", "مشروعك الآن في جوازك. قائمة {role}: {x} خطوات منجزة." ],
  cert_dl: [ "Download the certificate (PDF)", "Télécharger l’attestation (PDF)", "تحميل الشهادة (PDF)" ],
  cert_saved: [ "Certificate saved", "Attestation enregistrée", "حُفظت الشهادة" ],
  cert_title: [ "Certificate of completion", "Attestation de parcours", "شهادة إتمام المسار" ],
  cert_body: [ "completed a 30-day path for", "a terminé un parcours de 30 jours pour", "إتمام مسار جاهزية مدّته 30 يوماً لوظيفة" ],
  cert_ready: [ "Checklist", "Liste de préparation", "قائمة الجاهزية" ],
  cert_skills: [ "Skills", "Compétences", "المهارات" ],
  cert_date: [ "Date", "Date", "التاريخ" ],
  cert_no: [ "The download did not start. You can still keep the image above.", "Le téléchargement n’a pas démarré. Vous pouvez conserver l’image ci-dessus.", "لم يكتمل التحميل. يمكنك الاحتفاظ بالصورة أعلاه." ],
  demo_jump: [ "Jump to day 29", "Aller au jour 29", "انتقل إلى اليوم 29" ],
  t_learn1: [ "Start: {res}", "Commencer : {res}", "ابدأ: {res}" ],
  t_learn2: [ "Finish part 1 of {res}", "Terminer la partie 1 : {res}", "أنهِ الجزء الأول من {res}" ],
  t_learn3: [ "Go deeper: 2 more lessons on {skill}", "Approfondir : 2 leçons de plus sur {skill}", "تعمّق: درسان إضافيان في {skill}" ],
  t_practice: [ "Use {skill} once on a real case", "Utiliser {skill} une fois sur un cas réel", "طبّق {skill} مرة واحدة على حالة حقيقية" ],
  t_practice2: [ "Practise {skill} again, faster", "Pratiquer à nouveau {skill}, plus vite", "تدرّب على {skill} مجدداً وبسرعة أكبر" ],
  t_prove: [ "Create one proof of {skill}", "Créer une preuve de {skill}", "أنشئ إثباتاً واحداً على {skill}" ],
  t_review: [ "Write your {skill} story in 3 lines", "Décrire en 3 lignes votre expérience de {skill}", "اكتب قصتك مع {skill} في 3 أسطر" ],
  t_num: [ "Put numbers on your {skill} story", "Chiffrer votre expérience de {skill}", "أضف أرقاماً إلى قصتك مع {skill}" ],
  t_ref: [ "Get a 2-line reference for {skill}", "Obtenir une recommandation de 2 lignes pour {skill}", "احصل على تزكية من سطرين بشأن {skill}" ],
  t_voice: [ "Record 60 seconds on your {skill} story", "Enregistrer 60 secondes sur votre expérience de {skill}", "سجّل 60 ثانية تحكي فيها قصتك مع {skill}" ],
  t_p1: [ "Plan the project", "Planifier le projet", "خطّط للمشروع" ],
  t_p2: [ "Project: gather what you need", "Projet : rassembler le nécessaire", "المشروع: اجمع ما تحتاجه" ],
  t_p3: [ "Project: build version 1", "Projet : construire la version 1", "المشروع: أنجز النسخة الأولى" ],
  t_p4: [ "Project: finish and polish", "Projet : finir et peaufiner", "المشروع: أنهِه وحسّنه" ],
  t_p5: [ "Write a one-page project summary", "Rédiger une synthèse du projet en une page", "اكتب ملخصاً للمشروع في صفحة واحدة" ],
  t_p6: [ "Show it to one person, get feedback", "Le montrer à une personne et recueillir son avis", "اعرضه على شخص واحد واطلب رأيه" ],
  t_iv1: [ "Mock interview: 3 questions", "Entretien blanc : 3 questions", "مقابلة تدريبية: 3 أسئلة" ],
  t_iv2: [ "Full mock interview, fix weak answers", "Entretien blanc complet, corriger les réponses faibles", "مقابلة تدريبية كاملة، ثم حسّن الأجوبة الضعيفة" ],
  t_apply: [ "Apply to {org}", "Postuler chez {org}", "قدّم ترشيحك لدى {org}" ],
  s_learn: [ [ "Search the resource named above and open it", "Do 20 focused minutes, phone away", "Write one thing you learned" ], [ "Cherchez la ressource indiquée et ouvrez-la", "20 minutes de travail concentré, téléphone à l’écart", "Notez une chose apprise" ], [ "ابحث عن المرجع المذكور أعلاه وافتحه", "خصّص 20 دقيقة من التركيز، بعيداً عن الهاتف", "اكتب شيئاً واحداً تعلّمته" ] ],
  s_practice: [ [ "Pick a real case", "Do it once", "Note what worked and what didn’t" ], [ "Choisissez un cas réel", "Faites-le une fois", "Notez ce qui a fonctionné ou non" ], [ "اختر حالة حقيقية", "نفّذها مرة واحدة", "دوّن ما نجح وما لم ينجح" ] ],
  s_prove: [ [ "Create the file, photo or screenshot", "Add a one-line description", "Paste it as proof below" ], [ "Créez le fichier, la photo ou la capture d’écran", "Ajoutez une description d’une ligne", "Collez-la comme preuve ci-dessous" ], [ "أنشئ الملف أو الصورة أو لقطة الشاشة", "أضف وصفاً من سطر واحد", "الصقه إثباتاً في الأسفل" ] ],
  s_review: [ [ "Situation in one line", "What you did", "The result, with a number" ], [ "La situation en une ligne", "Ce que vous avez fait", "Le résultat, chiffré" ], [ "الموقف في سطر واحد", "ما قمت به", "النتيجة، مدعومة برقم" ] ],
  s_project: [ [ "Re-read the brief", "Do today’s piece", "Save your progress" ], [ "Relisez le cahier des charges", "Réalisez la partie du jour", "Enregistrez votre avancement" ], [ "أعد قراءة المطلوب", "أنجز جزء اليوم", "احفظ تقدّمك" ] ],
  s_interview: [ [ "Open the interview", "Answer out loud", "Read the feedback, retry one answer" ], [ "Ouvrez l’entretien", "Répondez à voix haute", "Lisez le retour, reprenez une réponse" ], [ "افتح المقابلة", "أجب بصوت مسموع", "اقرأ الملاحظات وأعد صياغة جواب واحد" ] ],
  s_apply: [ [ "Check your passport", "Write a 3-line message", "Press Apply" ], [ "Vérifiez votre passeport", "Rédigez un message de 3 lignes", "Cliquez sur Postuler" ], [ "راجع جوازك", "اكتب رسالة من 3 أسطر", "اضغط «قدّم ترشيحك»" ] ],
  w_learn: [ "This closes your gap in {skill}.", "Cela comble votre écart en {skill}.", "تسدّ هذه المهمة فجوتك في {skill}." ],
  w_practice: [ "Knowing is not doing. One real attempt counts.", "Savoir n’est pas faire. Une vraie tentative compte.", "المعرفة ليست تطبيقاً. محاولة حقيقية واحدة لها وزنها." ],
  w_prove: [ "Employers trust proof, not claims.", "Les recruteurs se fient aux preuves, pas aux déclarations.", "يثق أصحاب العمل بالإثبات، لا بالادّعاء." ],
  w_review: [ "A short story with a number convinces in interviews.", "Un récit court et chiffré convainc en entretien.", "القصة القصيرة المدعومة برقم تُقنع في المقابلات." ],
  w_project: [ "The project is the proof {org} will look at.", "Le projet est la preuve que {org} regardera.", "المشروع هو الإثبات الذي ستطّلع عليه {org}." ],
  w_interview: [ "Saying it well is a skill too.", "Bien le dire est aussi une compétence.", "حسن الحديث عن مهاراتك مهارة أيضاً." ],
  w_apply: [ "You built the proof. Now use it.", "Vous avez construit la preuve. Utilisez-la.", "بنيت الإثبات. حان وقت استخدامه." ],
  iv_title: [ "Mock interview", "Entretien blanc", "مقابلة تدريبية" ],
  iv_sub: [ "{role} · 5 questions · about 10 min", "{role} · 5 questions · environ 10 min", "{role} · 5 أسئلة · نحو 10 دقائق" ],
  iv_start: [ "Start the interview", "Commencer l’entretien", "ابدأ المقابلة" ],
  iv_ph: [ "Answer as you would speak. One real example and a number.", "Répondez comme à l’oral. Un exemple réel et un chiffre.", "أجب كما تتحدث: مثال حقيقي واحد ورقم." ],
  iv_send: [ "Send answer", "Envoyer la réponse", "إرسال الجواب" ],
  iv_star: [ "Tell it in 4 steps: situation, task, action, result", "Racontez en 4 temps : situation, tâche, action, résultat", "احكِ في 4 خطوات: الموقف، المهمة، ما فعلته، النتيجة" ],
  st_s: [ "Situation", "Situation", "الموقف" ],
  st_t: [ "Task", "Tâche", "المهمة" ],
  st_a: [ "Action", "Action", "ما قمت به" ],
  st_r: [ "Result", "Résultat", "النتيجة" ],
  st_sd: [ "Where, when", "Où, quand", "أين ومتى" ],
  st_td: [ "Your goal", "Votre but", "هدفك" ],
  st_ad: [ "What you did", "Ce que vous avez fait", "دورك أنت" ],
  st_rd: [ "With a number", "Avec un chiffre", "برقم" ],
  sc_c: [ "Clarity", "Clarté", "الوضوح" ],
  sc_e: [ "Evidence", "Preuves", "الأدلة" ],
  sc_r: [ "Relevance", "Pertinence", "الصلة بالوظيفة" ],
  fb_good: [ "What worked", "Ce qui fonctionne", "ما نجح" ],
  fb_improve: [ "Make it stronger", "Pour renforcer", "لتقوية الجواب" ],
  fb_better: [ "See a stronger version", "Voir une version plus solide", "اطّلع على صيغة أقوى" ],
  iv_q_n: [ "Question {i} of {n}", "Question {i} sur {n}", "السؤال {i} من {n}" ],
  iv_done_t: [ "Interview complete", "Entretien terminé", "انتهت المقابلة" ],
  iv_score: [ "Your score", "Votre score", "نتيجتك" ],
  iv_again: [ "Practise again", "S’entraîner à nouveau", "تدرّب مجدداً" ],
  iv_read: [ "Read questions aloud", "Lire les questions à voix haute", "قراءة الأسئلة بصوت مسموع" ],
  iv_thinking: [ "Reading your answer…", "Lecture de votre réponse…", "أقرأ جوابك…" ],
  iv_tip_t: [ "Before you start", "Avant de commencer", "قبل أن تبدأ" ],
  iv_tip1: [ "Answer in 4–6 sentences.", "Répondez en 4 à 6 phrases.", "أجب في 4 إلى 6 جمل." ],
  iv_tip2: [ "One real example per answer.", "Un exemple réel par réponse.", "قصة حقيقية واحدة في كل جواب." ],
  iv_tip3: [ "End with a measurable result.", "Terminez par un résultat chiffré.", "اختم بنتيجة قابلة للقياس." ],
  iv_short: [ "Write a little more: at least two sentences.", "Écrivez un peu plus : au moins deux phrases.", "أضف المزيد: جملتان على الأقل." ],
  iv_by_ai: [ "AI interviewer", "Recruteur IA", "محاوِر بالذكاء الاصطناعي" ],
  iv_by_rules: [ "Built-in interviewer", "Recruteur intégré", "المحاور المدمج" ],
  iv_best: [ "Best: {s}", "Meilleur : {s}", "أفضل نتيجة: {s}" ],
  iv_back_plan: [ "Back to my path", "Retour à mon parcours", "العودة إلى المسار" ],
  q1: [ "Tell me about yourself in one minute, and why {role}.", "Présentez-vous en une minute et dites pourquoi ce poste : {role}.", "عرّفنا بنفسك في دقيقة واحدة، ولماذا اخترت وظيفة {role}؟" ],
  q2: [ "Tell me about a time you used {skill}. What happened?", "Racontez-moi une situation où vous avez utilisé {skill}. Que s’est-il passé ?", "حدّثنا عن موقف استعملت فيه مهارة {skill}. ماذا حدث؟" ],
  q3: [ "You do not have {gap} yet. How will you learn it quickly?", "Vous ne maîtrisez pas encore {gap}. Comment allez-vous l’apprendre rapidement ?", "لا تتقن مهارة {gap} بعد. كيف ستتعلّمها بسرعة؟" ],
  q4: [ "Tell me about a problem with a customer or a colleague. How did you solve it?", "Parlez-moi d’un problème avec un client ou un collègue. Comment l’avez-vous résolu ?", "حدّثنا عن مشكلة مع زبون أو زميل. كيف حللتها؟" ],
  q5: [ "Why should we choose you over other candidates?", "Pourquoi vous choisir plutôt qu’un autre candidat ?", "لماذا نختارك أنت دون غيرك من المرشّحين؟" ],
  fr_num: [ "You used a number: that makes it credible.", "Vous avez donné un chiffre : c’est crédible.", "ذكرت رقماً، وهذا يمنح جوابك مصداقية." ],
  fr_act: [ "Strong action verbs.", "Des verbes d’action forts.", "أفعال واضحة وقوية." ],
  fr_len: [ "Good length.", "Bonne longueur.", "طول مناسب." ],
  fi_num: [ "Add a number: how many, how much, how fast.", "Ajoutez un chiffre : combien, quel volume, en combien de temps.", "أضف رقماً: العدد، أو القيمة، أو المدة." ],
  fi_ex: [ "Give one real example, not general qualities.", "Donnez un exemple réel, pas des qualités générales.", "اذكر مثالاً حقيقياً واحداً بدل الصفات العامة." ],
  fi_role: [ "Link it to the role: why does this matter for {role}?", "Reliez-le au poste : en quoi est-ce utile pour {role} ?", "اربطه بالوظيفة: لماذا يهمّ هذا في وظيفة {role}؟" ],
  fi_short: [ "Too short. Aim for 4–6 sentences.", "Trop court. Visez 4 à 6 phrases.", "الجواب قصير. احرص على 4 إلى 6 جمل." ],
  better_tpl: [ "S — {ev}\nT — What you had to achieve, in one line.\nA — The 2–3 things you did yourself.\nR — The result, with a number.", "S — {ev}\nT — Ce que vous deviez accomplir, en une ligne.\nA — Les 2 ou 3 actions que vous avez menées vous-même.\nR — Le résultat, chiffré.", "1 — {ev}\n2 — ما كان عليك تحقيقه، في سطر واحد.\n3 — ما قمت به بنفسك، في نقطتين أو ثلاث.\n4 — النتيجة، مدعومة برقم." ],
  pg_title: [ "Your progress", "Votre progression", "تقدّمك" ],
  pg_ready: [ "Your checklist over time", "Votre liste au fil du temps", "قائمتك عبر الزمن" ],
  pg_skills: [ "Skills confirmed", "Compétences confirmées", "مهارات مؤكَّدة" ],
  pg_proofs: [ "Proofs", "Preuves", "الإثباتات" ],
  pg_best: [ "Best interview", "Meilleur entretien", "أفضل مقابلة" ],
  pg_apps: [ "Applications you track", "Candidatures suivies", "الترشّحات التي تتابعها" ],
  pg_badges: [ "Milestones", "Jalons", "المحطات" ],
  pg_one: [ "Your line rises with every task.", "Votre courbe progresse à chaque tâche.", "يرتفع منحناك مع كل مهمة." ],
  b_first: [ "First skill", "Première compétence", "أول مهارة" ],
  b_rare: [ "Rare skill", "Compétence rare", "مهارة نادرة" ],
  b_goal: [ "Goal set", "Objectif choisi", "تحديد هدف" ],
  b_proof: [ "First proof", "Première preuve", "أول إثبات" ],
  b_streak: [ "7-day streak", "7 jours d’affilée", "7 أيام متتالية" ],
  b_iv: [ "Interview completed", "Entretien terminé", "مقابلة مُنجزة" ],
  b_ver: [ "Verified", "Vérifié", "جواز موثَّق" ],
  b_ready: [ "Ready to apply", "Prêt à postuler", "جاهز للترشّح" ],
  pg_none_apps: [ "Nothing tracked yet. Add a role from Opportunities.", "Rien de suivi pour l’instant. Ajoutez un poste depuis Opportunités.", "لا شيء قيد المتابعة بعد. أضف وظيفة من صفحة الفرص." ],
  pg_sent: [ "Tracked", "Suivie", "قيد المتابعة" ],
  set_title: [ "Settings", "Paramètres", "الإعدادات" ],
  set_name: [ "First name", "Prénom", "الاسم" ],
  set_lang: [ "Language", "Langue", "اللغة" ],
  set_sound: [ "Sound effects", "Effets sonores", "المؤثرات الصوتية" ],
  set_sound_d: [ "Short sounds when you complete a task.", "De courts sons lorsque vous terminez une tâche.", "أصوات قصيرة عند إنجاز شيء." ],
  set_voice: [ "Voice", "Voix", "القراءة الصوتية" ],
  set_voice_d: [ "Read skills and interview questions aloud.", "Lire les compétences et les questions à voix haute.", "قراءة المهارات وأسئلة المقابلة بصوت مسموع." ],
  set_calm: [ "Calm mode", "Mode calme", "الوضع الهادئ" ],
  set_calm_d: [ "Fewer animations.", "Moins d’animations.", "حركة أقل في الواجهة." ],
  set_ai: [ "AI", "IA", "الذكاء الاصطناعي" ],
  set_ai_live: [ "Connected. AI runs only when you press a button.", "Connectée. L’IA ne s’exécute que lorsque vous cliquez sur un bouton.", "متّصل. لا يعمل إلا عندما تضغط زراً." ],
  set_demo: [ "Demo tools", "Outils de démo", "أدوات التجربة" ],
  set_reset: [ "Start over", "Tout recommencer", "البدء من جديد" ],
  set_reset_q: [ "Delete your passport, path and chats on this device?", "Supprimer votre passeport, votre parcours et vos discussions sur cet appareil ?", "حذف جوازك ومسارك ومحادثاتك من هذا الجهاز؟" ],
  yes_reset: [ "Delete", "Supprimer", "حذف" ],
  set_privacy: [ "Privacy", "Confidentialité", "الخصوصية" ],
  set_privacy_d: [ "Everything stays in this browser. Your institution sees groups of 10 or more students, never you individually, unless you request verification.", "Tout reste dans ce navigateur. Votre établissement voit des groupes de 10 étudiants ou plus, jamais votre profil seul, sauf si vous demandez une vérification.", "تبقى بياناتك كلها في هذا المتصفح. ترى مؤسستك مجموعات من 10 طلبة فأكثر، ولا تراك فرداً إلا إذا طلبت التوثيق." ],
  set_uni: [ "Open the institution console", "Ouvrir la console établissement", "افتح واجهة المؤسسة" ],
  set_goal: [ "Goal", "Objectif", "الهدف" ],
  set_nogoal: [ "None yet", "Aucun pour l’instant", "لم يُحدَّد بعد" ],
  cp_name: [ "Skilma", "Skilma", "سكيلما" ],
  cp_sub: [ "Your career copilot", "Votre copilote carrière", "مساعدك المهني" ],
  cp_hello: [ "Hello {name}. I know your passport and your path. Ask me anything.", "Bonjour {name}. Je connais votre passeport et votre parcours. Posez-moi vos questions.", "مرحباً {name}. أعرف جوازك ومسارك. اسألني ما تريد." ],
  cp_ph: [ "Ask Skilma…", "Demandez à Skilma…", "اسأل سكيلما…" ],
  cp_s1: [ "What should I do today?", "Que dois-je faire aujourd’hui ?", "ماذا أفعل اليوم؟" ],
  cp_s2: [ "Why does my goal fit me?", "Pourquoi cet objectif me correspond-il ?", "لماذا يناسبني هذا الهدف؟" ],
  cp_s3: [ "Write my application message", "Rédiger mon message de candidature", "اكتب رسالة ترشيحي" ],
  cp_s4: [ "Am I ready for the interview?", "Ma préparation suffit-elle pour l’entretien ?", "هل أنا مستعد للمقابلة؟" ],
  cp_off: [ "Quick mode: short answers for now.", "Mode rapide : réponses courtes pour le moment.", "الوضع السريع: أجوبة مختصرة حالياً." ],
  cp_did_open: [ "Opened: {x}", "Ouvert : {x}", "تمّ فتح: {x}" ],
  cp_did_goal: [ "Goal set: {x}", "Objectif défini : {x}", "حُدّد الهدف: {x}" ],
  cp_did_skill: [ "Added to passport: {x}", "Ajoutée au passeport : {x}", "أُضيف إلى جوازك: {x}" ],
  cp_err: [ "I could not answer. Try again.", "Je n’ai pas pu répondre. Réessayez.", "تعذّر الرد. أعد المحاولة." ],
  cp_open: [ "Open your copilot", "Ouvrir votre copilote", "افتح مساعدك المهني" ],
  cpo_today: [ "Today: {task} — {min} min. Open it from your path.", "Aujourd’hui : {task} — {min} min. Ouvrez-la depuis votre parcours.", "اليوم: {task} ({min|zero:# دقيقة|one:دقيقة واحدة|two:دقيقتان|few:# دقائق|many:# دقيقة|other:# دقيقة}). افتحها من مسارك." ],
  cpo_nogoal: [ "Choose a goal first: your map ranks them for you.", "Choisissez d’abord un objectif : votre carte les classe pour vous.", "اختر هدفاً أولاً؛ فالخريطة ترتّب الفرص لك." ],
  cpo_iv: [ "Your best interview score is {s}. Aim for 70 or more: one story and one number per answer.", "Votre meilleur score d’entretien : {s}. Visez 70 ou plus : un exemple et un chiffre par réponse.", "أفضل نتيجة لك في المقابلة: {s}. استهدف 70 فأكثر: قصة واحدة ورقم واحد في كل جواب." ],
  cpo_iv0: [ "No practice yet. Five questions, ten minutes. Start now?", "Aucun entraînement pour l’instant. Cinq questions, dix minutes. Commencer maintenant ?", "لم تتدرّب بعد. خمسة أسئلة في عشر دقائق. هل نبدأ؟" ],
  cpo_letter: [ "Dear {org} team,\n\nI’m {name}, a {field} student. {ev}\n\nI would like to bring this to your {role} role. My Skills Passport shows the evidence: {skills}.\n\nThank you for your time,\n{name}", "À l’attention de l’équipe {org},\n\nJe m’appelle {name} et je poursuis des études en {field}. {ev}\n\nJe souhaite mettre cette expérience au service du poste de {role}. Mon passeport de compétences en présente les preuves : {skills}.\n\nJe vous remercie de votre attention.\n{name}", "تحية طيبة إلى فريق {org}،\n\nأنا {name}، أدرس {field}. {ev}\n\nأودّ أن أضع هذه التجربة في خدمة وظيفة {role} لديكم. ويعرض جواز مهاراتي الإثباتات على: {skills}.\n\nشكراً على وقتكم،\n{name}" ],
  cpo_default: [ "I can help with today’s task, your goal, an application message or the interview. Pick one below.", "Je peux vous aider pour la tâche du jour, votre objectif, un message de candidature ou l’entretien. Choisissez ci-dessous.", "أستطيع مساعدتك في مهمة اليوم، أو هدفك، أو رسالة الترشيح، أو المقابلة. اختر من الاقتراحات أدناه." ],
  u_name: [ "Boughaz University", "Université du Boughaz", "جامعة البوغاز" ],
  u_console: [ "Career centre", "Service carrière", "مركز التوجيه المهني" ],
  u_demo: [ "Sample data", "Données d’exemple", "بيانات نموذجية" ],
  u_back: [ "Student view", "Vue étudiant", "واجهة الطالب" ],
  u_nav_ov: [ "Overview", "Vue d’ensemble", "نظرة عامة" ],
  u_nav_ver: [ "Verification", "Vérification", "التوثيق" ],
  u_nav_ins: [ "AI insights", "Analyses IA", "استنتاجات الذكاء الاصطناعي" ],
  u_nav_coh: [ "Programmes", "Filières", "الشعب" ],
  u_sem: [ "Semester 1 · 2026–2027", "Semestre 1 · 2026–2027", "الأسدس الأول · ⁦2026–2027⁩" ],
  u_k1: [ "Students joined", "Étudiants inscrits", "الطلبة المنضمّون" ],
  u_k1d: [ "of {n} invited", "sur {n|one:# invité|other:# invités}", "من أصل {n|zero:# مدعوّ|one:مدعوّ واحد|two:مدعوَّين|few:# مدعوّين|many:# مدعوّاً|other:# مدعوّ}" ],
  u_k2: [ "Skills confirmed", "Compétences confirmées", "مهارات مؤكَّدة" ],
  u_k3: [ "Hidden skills", "Compétences cachées", "مهارات خفيّة" ],
  u_k3d: [ "never on a CV before", "jamais mentionnées sur un CV auparavant", "لم تُذكر قطّ في سيرة ذاتية" ],
  u_k4: [ "Ready to apply", "Prêts à postuler", "جاهزون للترشّح" ],
  u_k4d: [ "every key skill with proof", "chaque compétence clé avec preuve", "كل مهارة أساسية مع دليل" ],
  u_funnel: [ "Where do students stop?", "Où les étudiants s’arrêtent-ils ?", "أين يتوقف الطلبة؟" ],
  u_f0: [ "Invited", "Invités", "مدعوّون" ],
  u_f1: [ "Joined", "Inscrits", "منضمّون" ],
  u_f2: [ "Built a passport", "Passeport créé", "أنشؤوا جوازاً" ],
  u_f3: [ "Chose a goal", "Objectif choisi", "اختاروا هدفاً" ],
  u_f4: [ "Working on a path", "Parcours en cours", "يعملون على المسار" ],
  u_f5: [ "Ready to apply", "Prêts à postuler", "جاهزون للترشّح" ],
  u_funnel_i: [ "37% of students with a passport have not chosen a goal. A 20-minute advising session can help.", "37 % des étudiants ayant un passeport n’ont pas choisi d’objectif. Une séance de conseil de 20 minutes peut les aider.", "37% من حاملي الجواز لم يختاروا هدفاً. جلسة توجيه من 20 دقيقة تحلّ المشكلة لمعظمهم." ],
  u_gaps: [ "Most common gaps", "Écarts les plus fréquents", "الفجوات الأكثر شيوعاً" ],
  u_str: [ "Most common strengths", "Forces les plus fréquentes", "نقاط القوة الأكثر شيوعاً" ],
  u_act: [ "New active students per month", "Nouveaux étudiants actifs par mois", "طلبة نشطون جدد شهرياً" ],
  u_act_i: [ "The September jump follows orientation week.", "Le pic de septembre suit la semaine d’orientation.", "جاء ارتفاع شتنبر بعد أسبوع التوجيه." ],
  u_q_t: [ "Verification requests", "Demandes de vérification", "طلبات التوثيق" ],
  u_q_d: [ "Students asked you to confirm an experience. Check the proof, then decide.", "Des étudiants vous demandent de confirmer une expérience. Examinez la preuve, puis décidez.", "طلب منكم طلبة تأكيد تجربة. راجعوا الدليل ثم قرّروا." ],
  u_verify: [ "Verify", "Vérifier", "توثيق" ],
  u_more: [ "Ask for more evidence", "Demander plus de preuves", "طلب إثباتات إضافية" ],
  u_new: [ "New", "Nouveau", "جديد" ],
  u_you: [ "you", "vous", "أنت" ],
  u_vt: [ "Verified. The student is notified.", "Vérifié. L’étudiant en est informé.", "وُثّق، وأُشعر الطالب بذلك." ],
  u_at: [ "Request for more evidence sent.", "Demande de preuves complémentaires envoyée.", "أُرسل طلب إثباتات إضافية." ],
  u_q_empty: [ "No pending requests.", "Aucune demande en attente.", "لا طلبات معلّقة." ],
  u_proof: [ "Proof", "Preuve", "الإثبات" ],
  u_ins_d: [ "SKILMA’s AI reads this semester’s anonymised figures and suggests next steps.", "L’IA de SKILMA analyse les chiffres anonymisés du semestre et propose des actions.", "يقرأ الذكاء الاصطناعي في سكيلما أرقام هذا الأسدس المجهولة الهوية، ويقترح الخطوات التالية." ],
  u_ins_go: [ "Generate insights", "Générer les analyses", "إنشاء الاستنتاجات" ],
  u_ins_base: [ "Built-in insights", "Analyses intégrées", "استنتاجات مدمجة" ],
  u_ins_ai: [ "Written by AI from your figures", "Rédigé par l’IA à partir de vos chiffres", "كتبها الذكاء الاصطناعي من أرقامكم" ],
  u_th_p: [ "Programme", "Filière", "الشعبة" ],
  u_th_n: [ "Students", "Étudiants", "الطلبة" ],
  u_th_pp: [ "Passports", "Passeports", "الجوازات" ],
  u_th_gap: [ "Top gap", "Écart principal", "أكبر فجوة" ],
  u_th_r: [ "Readiness steps done", "Étapes de préparation faites", "خطوات الجاهزية المنجزة" ],
  u_priv: [ "Figures cover groups of {n} or more students. No individual data without consent.", "Les chiffres couvrent des groupes de {n} étudiants ou plus. Aucune donnée individuelle sans consentement.", "تغطي الأرقام مجموعات من {n} طلبة فأكثر. لا بيانات فردية دون موافقة." ],
  ui1t: [ "Unblock the goal step", "Débloquer l’étape objectif", "عالجوا تعثّر اختيار الهدف" ],
  ui1d: [ "238 students have a passport but no goal. Most stop after seeing the map.", "238 étudiants ont un passeport mais pas d’objectif. La plupart s’arrêtent devant la carte.", "238 طالباً لديهم جواز دون هدف، ويتوقف أغلبهم عند الخريطة." ],
  ui1a: [ "Run 20-minute goal sessions in week 2.", "Organiser des séances de 20 min sur l’objectif en semaine 2.", "نظّموا جلسات من 20 دقيقة لتحديد الهدف في الأسبوع الثاني." ],
  ui2t: [ "Teach CRM and Excel together", "Enseigner le CRM et Excel ensemble", "درّسوا CRM وExcel معاً" ],
  ui2d: [ "They are the two most common gaps, and both block sales and analyst roles.", "Ce sont les deux écarts les plus fréquents ; ils freinent l’accès aux postes de vente et d’analyste.", "هما الفجوتان الأكثر شيوعاً، وكلتاهما تعيق الوصول إلى وظائف البيع والتحليل." ],
  ui2a: [ "Open a 4-week evening workshop.", "Ouvrir un atelier du soir de 4 semaines.", "نظّموا ورشة مسائية مدتها 4 أسابيع." ],
  ui3t: [ "Informal work is your hidden asset", "Le travail informel est un atout caché", "العمل غير الرسمي رصيدكم الخفي" ],
  ui3d: [ "About a third of confirmed skills come from family shops, clubs and side jobs.", "Environ un tiers des compétences confirmées viennent de commerces familiaux, de clubs et d’emplois d’appoint.", "نحو ثلث المهارات المؤكَّدة مصدرها متاجر العائلة والنوادي والأعمال الجانبية." ],
  ui3a: [ "Show employers these verified skills at the next careers fair.", "Présenter ces compétences vérifiées aux employeurs lors du prochain forum.", "اعرضوا هذه المهارات الموثَّقة على أصحاب العمل في ملتقى التشغيل القادم." ],
  pub_students: [ "For students", "Pour les étudiants", "للطلبة" ],
  pub_inst: [ "For institutions", "Pour les établissements", "للمؤسسات" ],
  pub_trust: [ "Trust", "Confiance", "الثقة" ],
  pub_signin: [ "Sign in", "Se connecter", "تسجيل الدخول" ],
  pub_start: [ "Get started", "Commencer", "ابدأ الآن" ],
  pub_menu: [ "Menu", "Menu", "القائمة" ],
  hm_kicker: [ "For students and graduates in Morocco", "Pour les étudiants et diplômés au Maroc", "لطلبة المغرب وخرّيجيه" ],
  hm_h1: [ "From experience to opportunity.", "De l’expérience à l’opportunité.", "من تجربة إلى فرصة." ],
  hm_watch: [ "Watch how it works", "Voir le fonctionnement", "شاهد طريقة العمل" ],
  film_1: [ "Tell", "Racontez", "احكِ" ],
  film_2: [ "Discover", "Découvrez", "اكتشف" ],
  film_3: [ "Aim", "Visez", "استهدف" ],
  film_4: [ "Prove", "Prouvez", "أثبِت" ],
  film_1c: [ "One real experience, in your words.", "Une expérience réelle, avec vos mots.", "تجربة حقيقية واحدة، بكلماتك." ],
  film_2c: [ "Skills, each with the words it came from.", "Des compétences, chacune avec ses mots d’origine.", "مهارات، كلٌّ منها مع الكلمات التي استُخرجت منها." ],
  film_3c: [ "Where you fit, and exactly what’s missing.", "Où vous correspondez, et ce qui manque précisément.", "أين تلائمك الفرص، وما الذي ينقصك بالتحديد." ],
  film_4c: [ "Small pieces of evidence, step by step.", "De petites preuves, étape par étape.", "أدلة صغيرة، خطوة بعد خطوة." ],
  film_passport: [ "Passport", "Passeport", "الجواز" ],
  film_rich: [ "Detail", "Détail", "التفاصيل" ],
  film_pause: [ "Pause", "Pause", "إيقاف" ],
  film_play: [ "Play", "Lecture", "تشغيل" ],
  lg_have: [ "{n} you have", "{n|one:# acquise|other:# acquises}", "{n|zero:لا مهارات تملكها|one:مهارة واحدة تملكها|two:مهارتان تملكهما|few:# مهارات تملكها|many:# مهارة تملكها|other:# مهارة تملكها}" ],
  lg_gap: [ "{n} to develop", "{n} à développer", "{n|zero:لا مهارات للتطوير|one:مهارة واحدة للتطوير|two:مهارتان للتطوير|few:# مهارات للتطوير|many:# مهارة للتطوير|other:# مهارة للتطوير}" ],
  lg_part: [ "{n} partly", "{n} en partie", "{n|zero:لا مهارات متوفرة جزئياً|one:مهارة واحدة متوفرة جزئياً|two:مهارتان متوفرتان جزئياً|few:# مهارات متوفرة جزئياً|many:# مهارة متوفرة جزئياً|other:# مهارة متوفرة جزئياً}" ],
  aud_s_t: [ "A passport that proves what you can do", "Un passeport qui prouve ce que vous savez faire", "جواز يُثبت ما تستطيع فعله" ],
  aud_s_d: [ "Every skill shows its source. A 30-day path closes the gap to a real role.", "Chaque compétence indique sa source. Un parcours de 30 jours comble l’écart vers un vrai poste.", "تعرض كل مهارة مصدرها، ويسدّ مسار 30 يوماً الفجوة نحو وظيفة حقيقية." ],
  aud_i_t: [ "Know what your students can prove", "Sachez ce que vos étudiants peuvent prouver", "اعرفوا ما يستطيع طلبتكم إثباته" ],
  aud_i_d: [ "See where they get stuck, act where it matters, verify one experience at a time.", "Voyez où ils bloquent, agissez là où cela compte, vérifiez une expérience à la fois.", "اعرفوا أين يتعثرون، وتدخّلوا حيث يلزم، ووثّقوا تجربة واحدة في كل مرة." ],
  aud_i_cta: [ "See the institution view", "Voir l’espace établissement", "اطّلع على واجهة المؤسسة" ],
  fin_t: [ "Your first opportunity starts with one sentence.", "Votre première opportunité commence par une phrase.", "فرصتك الأولى تبدأ بجملة واحدة." ],
  foot_note: [ "Opportunities, employers and institution figures shown are examples.", "Les opportunités, employeurs et chiffres d’établissement présentés sont des exemples.", "الفرص وجهات العمل وأرقام المؤسسات المعروضة أمثلة." ],
  ip_h1: [ "Employability you can act on.", "Des indicateurs d’employabilité pour agir.", "قابلية تشغيل تستطيعون تحسينها." ],
  ip_sub: [ "Aggregated, consented evidence of what your students can do — and the interventions that move them forward.", "Des preuves agrégées et consenties de ce que vos étudiants savent faire — et les actions qui les font avancer.", "إثباتات مجمَّعة، بموافقة أصحابها، على ما يستطيع طلبتكم فعله، والتدخلات التي تدفعهم إلى الأمام." ],
  ip_cta: [ "Explore with sample data", "Explorer avec des données d’exemple", "استكشف ببيانات نموذجية" ],
  ip_f1t: [ "Act first, then analyse", "Agir d’abord, analyser ensuite", "التدخّل أولاً، ثم التحليل" ],
  ip_f1d: [ "Each week opens with what needs attention, the cohort affected and the expected outcome.", "Chaque semaine s’ouvre sur ce qui demande votre attention, la cohorte concernée et le résultat attendu.", "يبدأ كل أسبوع بما يحتاج إلى متابعة، والفئة المعنية، والنتيجة المتوقعة." ],
  ip_f2t: [ "Verify one experience", "Vérifier une expérience", "توثيق تجربة واحدة" ],
  ip_f2d: [ "You confirm a single experience, under a named signer. Nothing more is implied.", "Vous confirmez une seule expérience, sous un signataire nommé. Rien d’autre n’est sous-entendu.", "توثّقون تجربة واحدة باسم موقِّع محدد، ولا يُستنتج من ذلك شيء آخر." ],
  ip_f3t: [ "Private by design", "Confidentialité dès la conception", "الخصوصية من الأساس" ],
  ip_f3d: [ "Figures cover groups of 10 or more. A student is visible only if they choose to share.", "Les chiffres couvrent des groupes de 10 ou plus. Un étudiant n’est visible que s’il choisit de partager.", "تغطي الأرقام مجموعات من 10 طلبة فأكثر، ولا يظهر الطالب إلا إذا اختار المشاركة." ],
  tp_h1: [ "You prove every skill.", "Vous prouvez chaque compétence.", "أنت من يُثبت كل مهارة." ],
  tp_sub: [ "Six commitments the product keeps, on every screen.", "Six engagements tenus sur chaque écran.", "ستة التزامات تحترمها سكيلما في كل شاشة." ],
  tp1t: [ "Nothing without your yes", "Rien sans votre accord", "لا شيء دون موافقتك" ],
  tp1d: [ "SKILMA suggests. You confirm or leave out. Only confirmed skills enter your passport.", "SKILMA suggère. Vous confirmez ou écartez. Seules les compétences confirmées entrent dans votre passeport.", "تقترح سكيلما، وأنت تؤكّد أو تستبعد. لا يدخل الجواز إلا ما أكّدته." ],
  tp2t: [ "Every skill has a source", "Chaque compétence a une source", "لكل مهارة مصدر" ],
  tp2d: [ "Each skill keeps the exact words or the proof it came from.", "Chaque compétence garde les mots exacts ou la preuve d’origine.", "تحتفظ كل مهارة بالكلمات نفسها أو بالإثبات الذي جاءت منه." ],
  tp3t: [ "Scores you can read", "Des scores lisibles", "نسب يمكن قراءتها" ],
  tp3d: [ "Every percentage shows how it is calculated. It is an estimate, never a hiring decision.", "Chaque pourcentage montre son calcul. C’est une estimation, jamais une décision d’embauche.", "تعرض كل نسبة طريقة حسابها، وهي تقدير، لا قرار توظيف." ],
  tp4t: [ "Groups, not individuals", "Des groupes, pas des individus", "مجموعات لا أفراد" ],
  tp4d: [ "Institutions see groups of 10 or more, unless you share your passport.", "Les établissements voient des groupes de 10 ou plus, sauf si vous partagez votre passeport.", "ترى المؤسسات مجموعات من 10 طلبة فأكثر، إلا إذا شاركت جوازك." ],
  tp5t: [ "Honest about limits", "Honnête sur ses limites", "صريحة بشأن حدودها" ],
  tp5d: [ "If a story shows no clear skill, SKILMA says so. It does not invent one.", "Si un récit ne montre aucune compétence claire, SKILMA le dit. Elle n’en invente pas.", "إذا لم تُظهر القصة مهارة واضحة، تقول سكيلما ذلك صراحة، ولا تخترع مهارة." ],
  tp6t: [ "Yours to delete", "Vous pouvez tout supprimer", "الحذف بيدك" ],
  tp6d: [ "Today, everything is saved on this device. One button removes all of it.", "Aujourd’hui, tout est enregistré sur cet appareil. Un bouton suffit pour tout supprimer.", "اليوم، يُحفظ كل شيء على هذا الجهاز، وزرّ واحد يحذفه كله." ],
  si_h1: [ "Enter SKILMA", "Entrer dans SKILMA", "ادخل إلى سكيلما" ],
  si_sub: [ "Continue your passport, open the example account, or start from scratch.", "Reprenez votre passeport, ouvrez le compte exemple ou commencez de zéro.", "تابع جوازك، أو افتح الحساب النموذجي، أو ابدأ من الصفر." ],
  si_new_t: [ "New student", "Nouvel étudiant", "طالب جديد" ],
  si_new_d: [ "Start with one experience. About ten minutes.", "Commencez par une expérience. Environ dix minutes.", "ابدأ بتجربة واحدة، في نحو عشر دقائق." ],
  si_demo_t: [ "Demo student", "Profil de démonstration", "حساب طالب تجريبي" ],
  si_demo_d: [ "Sara, final year in Economics and Management: passport, goal and path under way.", "Sara, en dernière année d’économie et gestion : passeport, objectif et parcours engagés.", "سارة، في سنة التخرج بشعبة الاقتصاد والتسيير: جوازها وهدفها ومسارها قيد الإنجاز." ],
  si_uni_t: [ "Institution", "Établissement", "مؤسسة" ],
  si_ops_t: [ "Operations", "Opérations", "العمليات" ],
  si_ops_d: [ "SKILMA control centre: AI runs, quality, audit.", "Centre de contrôle SKILMA : IA, qualité, audit.", "مركز التحكم في سكيلما: عمليات الذكاء الاصطناعي، والجودة، والتدقيق." ],
  si_cont: [ "Continue as {name}", "Continuer en tant que {name}", "المتابعة باسم {name}" ],
  si_cont_d: [ "Your own passport, on this device.", "Votre propre passeport, sur cet appareil.", "جوازك الخاص، على هذا الجهاز." ],
  cm_t: [ "What’s the last thing you did?", "Quelle est la dernière chose que vous avez faite ?", "ما آخر شيء قمت به؟" ],
  cm_sub: [ "Write it as you would tell a friend. Any language works.", "Écrivez-le comme vous le raconteriez à un proche. Toutes les langues sont acceptées.", "اكتبه كما ترويه لصديق. أي لغة تصلح." ],
  cm_type: [ "What kind of experience?", "Quel type d’expérience ?", "ما نوع التجربة؟" ],
  ty_work: [ "Job", "Emploi", "عمل" ],
  ty_family: [ "Family business", "Commerce familial", "تجارة العائلة" ],
  ty_study: [ "Studies", "Études", "دراسة" ],
  ty_vol: [ "Volunteering", "Bénévolat", "تطوّع" ],
  ty_project: [ "Project", "Projet", "مشروع" ],
  ty_free: [ "Freelance", "Travail indépendant", "عمل حر" ],
  cm_guide: [ "What helps SKILMA see more", "Ce qui aide SKILMA à en voir plus", "ما يساعد سكيلما على رؤية المزيد" ],
  cm_g1: [ "What you did yourself", "Ce que vous avez fait vous-même", "ما قمت به بنفسك" ],
  cm_g2: [ "A number or a result", "Un chiffre ou un résultat", "رقم أو نتيجة" ],
  cm_g3: [ "Who it was for", "Pour qui", "لمن كان ذلك" ],
  rich_thin: [ "A start — add one detail", "Un début — ajoutez un détail", "بداية: أضف تفصيلاً واحداً" ],
  rich_ok: [ "Good — one more detail helps", "Bien — un détail de plus aidera", "جيد: تفصيل إضافي سيفيد" ],
  rich_rich: [ "Rich — ready to analyse", "Riche — prêt pour l’analyse", "غنيّ: جاهز للتحليل" ],
  cm_back: [ "Back", "Retour", "رجوع" ],
  demo_name: [ "Sara", "Sara", "سارة" ],
  u_nav_rep: [ "Reports", "Rapports", "التقارير" ],
  u_nav_set: [ "Settings", "Paramètres", "الإعدادات" ],
  ur_t: [ "Reports", "Rapports", "التقارير" ],
  ur_d: [ "Export what you see, at group level only.", "Exportez ce que vous voyez, au niveau des groupes uniquement.", "صدّروا ما ترونه، على مستوى المجموعات فقط." ],
  ur1t: [ "Semester summary", "Synthèse du semestre", "ملخص الأسدس" ],
  ur1d: [ "Funnel, readiness and activity for the semester.", "Entonnoir, préparation et activité du semestre.", "مراحل التقدّم والجاهزية والنشاط خلال الأسدس." ],
  ur2t: [ "Skills by programme", "Compétences par filière", "المهارات حسب الشعبة" ],
  ur2d: [ "Top gap and average readiness, programme by programme.", "Écart principal et préparation moyenne, filière par filière.", "أكبر فجوة ومتوسط الجاهزية لكل شعبة." ],
  ur3t: [ "Verification log", "Journal des vérifications", "سجل التوثيق" ],
  ur3d: [ "Every decision, with date and signer.", "Chaque décision, avec date et signataire.", "كل قرار، بتاريخه واسم الموقِّع." ],
  ur_dl: [ "Download CSV", "Télécharger le CSV", "تحميل CSV" ],
  ur_saved: [ "Report saved", "Rapport enregistré", "حُفظ التقرير" ],
  ur_fail: [ "The download did not start.", "Le téléchargement n’a pas démarré.", "لم يكتمل التحميل." ],
  us_t: [ "Settings", "Paramètres", "الإعدادات" ],
  us_priv: [ "Privacy threshold", "Seuil de confidentialité", "حدّ الخصوصية" ],
  us_priv_d: [ "Smallest group shown in any figure.", "Plus petit groupe affiché dans un chiffre.", "أصغر مجموعة تظهر في أي رقم." ],
  us_min: [ "{n|one:# student|other:# students}", "{n|one:# étudiant|other:# étudiants}", "{n|zero:لا طلبة|one:طالب واحد|two:طالبان|few:# طلبة|many:# طالباً|other:# طالب}" ],
  us_roles: [ "Roles", "Rôles", "الأدوار" ],
  r_admin: [ "Administrator", "Administrateur", "مسؤول" ],
  r_admin_d: [ "Everything, including settings and exports.", "Tout, y compris les paramètres et les exports.", "كل الصلاحيات، بما فيها الإعدادات والتصدير." ],
  r_adv: [ "Career advisor", "Conseiller carrière", "مستشار توجيه" ],
  r_adv_d: [ "Groups, insights and passports students share.", "Groupes, analyses et passeports partagés par les étudiants.", "المجموعات والتحليلات والجوازات التي يشاركها الطلبة." ],
  r_view: [ "Viewer", "Observateur", "مُطّلِع" ],
  r_view_d: [ "The overview only.", "La vue d’ensemble uniquement.", "النظرة العامة فقط." ],
  us_you: [ "You", "Vous", "أنتم" ],
  o_nav_ov: [ "Overview", "Vue d’ensemble", "نظرة عامة" ],
  o_nav_inst: [ "Institutions", "Établissements", "المؤسسات" ],
  o_nav_audit: [ "Audit log", "Journal d’audit", "سجل التدقيق" ],
  oi_t: [ "Institutions", "Établissements", "المؤسسات" ],
  oi_d: [ "Who uses SKILMA, and how healthy each account is.", "Qui utilise SKILMA, et l’état de chaque compte.", "من يستخدم سكيلما، وما حالة كل حساب." ],
  oi_name: [ "Institution", "Établissement", "المؤسسة" ],
  oi_city: [ "City", "Ville", "المدينة" ],
  oi_st: [ "Students", "Étudiants", "الطلبة" ],
  oi_ver: [ "Verifications", "Vérifications", "التوثيقات" ],
  oi_state: [ "Status", "Statut", "الحالة" ],
  oi_active: [ "Active", "Actif", "نشط" ],
  oi_setup: [ "Setting up", "En configuration", "قيد الإعداد" ],
  oa_t: [ "Audit log", "Journal d’audit", "سجل التدقيق" ],
  oa_d: [ "Every action that changed data, on this device, newest first.", "Chaque action qui a modifié des données, sur cet appareil, la plus récente d’abord.", "كل إجراء غيّر البيانات على هذا الجهاز، من الأحدث إلى الأقدم." ],
  oa_empty: [ "Nothing recorded yet.", "Rien d’enregistré pour l’instant.", "لا شيء مسجَّل بعد." ],
  oa_who: [ "Actor", "Auteur", "الفاعل" ],
  oa_what: [ "Action", "Action", "الإجراء" ],
  oa_when: [ "When", "Quand", "التوقيت" ],
  who_student: [ "Student", "Étudiant", "طالب" ],
  who_inst: [ "Institution", "Établissement", "مؤسسة" ],
  who_ai: [ "AI", "IA", "ذكاء اصطناعي" ],
  who_rules: [ "Built-in reader", "Lecteur intégré", "المحلّل المدمج" ],
  sign_out: [ "Sign out", "Se déconnecter", "تسجيل الخروج" ],
  u_priv2: [ "Every export covers groups of {n|one:# student|other:# students} or more.", "Chaque export couvre des groupes de {n|one:# étudiant|other:# étudiants} ou plus.", "يغطي كل تصدير مجموعات من {n|zero:# طالب|one:طالب واحد|two:طالبَين|few:# طلبة|many:# طالباً|other:# طالب} فأكثر." ],
  pub_open: [ "Open my passport", "Ouvrir mon passeport", "افتح جوازي" ],
  si_replace: [ "This replaces the passport saved on this device.", "Cela remplace le passeport enregistré sur cet appareil.", "سيحلّ هذا محلّ الجواز المحفوظ على هذا الجهاز." ],
  si_replace_ok: [ "Replace", "Remplacer", "استبدال" ],
  si_demo_in: [ "Signed in as {name} (demo)", "Session ouverte : {name} (démo)", "تمّ الدخول باسم {name} (حساب تجريبي)" ],
  so_d: [ "Back to the public site. Your passport stays on this device.", "Retour au site public. Votre passeport reste sur cet appareil.", "العودة إلى الموقع العام، ويبقى جوازك على هذا الجهاز." ],
  us_saved: [ "Threshold updated", "Seuil mis à jour", "حُدِّث حدّ الخصوصية" ],
  all: [ "All", "Tous", "الكل" ],
  or: [ "or", "ou", "أو" ],
  more: [ "More", "Plus", "المزيد" ],
  today: [ "Today", "Aujourd’hui", "اليوم" ],
  days_ago: [ "{n|one:# day ago|other:# days ago}", "il y a {n|one:# jour|other:# jours}", "{n|zero:اليوم|one:منذ يوم واحد|two:منذ يومين|few:منذ # أيام|many:منذ # يوماً|other:منذ # يوم}" ],
  months_n: [ "{n|one:# month|other:# months}", "{n} mois", "{n|zero:# شهر|one:شهر واحد|two:شهران|few:# أشهر|many:# شهراً|other:# شهر}" ],
  acc_menu: [ "Account menu", "Menu du compte", "قائمة الحساب" ],
  nav_main: [ "Main navigation", "Navigation principale", "التنقل الرئيسي" ],
  signed_out: [ "Signed out", "Session fermée", "تمّ تسجيل الخروج" ],
  err_email: [ "Enter a valid email address.", "Saisissez une adresse e-mail valide.", "أدخل بريداً إلكترونياً صحيحاً." ],
  err_name: [ "Enter your name.", "Indiquez votre nom.", "أدخل اسمك." ],
  err_inst: [ "Enter the institution’s name.", "Indiquez le nom de l’établissement.", "أدخل اسم المؤسسة." ],
  err_fb: [ "Write a few words first.", "Écrivez d’abord quelques mots.", "اكتب بضع كلمات أولاً." ],
  ai_rules: [ "Built-in reader", "Lecteur intégré", "المحلّل المدمج" ],
  maint_msg: [ "Scheduled maintenance tonight, 23:00–23:30. Your passport and data are safe.", "Maintenance prévue ce soir, de 23 h à 23 h 30. Votre passeport et vos données sont en sécurité.", "صيانة مقرّرة الليلة من 23:00 إلى 23:30. جوازك وبياناتك في أمان." ],
  demo_proof: [ "Screenshot of a CRM pipeline with 10 qualified prospects", "Capture d’écran d’un suivi CRM avec 10 prospects qualifiés", "لقطة شاشة لخط مبيعات في CRM يضم 10 عملاء محتملين مؤهَّلين" ],
  pt_label: [ "SKILMA products", "Produits SKILMA", "منتجات سكيلما" ],
  pt_site: [ "Website", "Site", "الموقع" ],
  pt_student: [ "Student", "Étudiant", "الطالب" ],
  pt_uni: [ "Institution", "Établissement", "المؤسسة" ],
  pt_ops: [ "Operations", "Opérations", "العمليات" ],
  pal_open: [ "Search", "Rechercher", "بحث" ],
  pal_ph: [ "Search pages, skills, roles…", "Rechercher des pages, compétences, postes…", "ابحث في الصفحات والمهارات والوظائف…" ],
  pal_pages: [ "Pages", "Pages", "الصفحات" ],
  pal_actions: [ "Actions", "Actions", "إجراءات" ],
  pal_skills: [ "Your skills", "Vos compétences", "مهاراتك" ],
  pal_opps: [ "Opportunities", "Opportunités", "الفرص" ],
  pal_none: [ "Nothing matches. Try another word.", "Aucun résultat. Essayez un autre mot.", "لا نتائج. جرّب كلمة أخرى." ],
  pal_move: [ "move", "naviguer", "تنقّل" ],
  pal_open_k: [ "open", "ouvrir", "فتح" ],
  pub_home: [ "Home", "Accueil", "الرئيسية" ],
  pub_how: [ "How it works", "Fonctionnement", "طريقة العمل" ],
  pub_example: [ "Example passport", "Exemple de passeport", "جواز نموذجي" ],
  pub_nav: [ "Site", "Site", "الموقع" ],
  foot_promise: [ "SKILMA connects young people’s skills to career opportunities, and gives each person the path to reach them.", "SKILMA relie les compétences des jeunes aux opportunités professionnelles, et donne à chacun le chemin pour y parvenir.", "تربط سكيلما مهارات الشباب بالفرص المهنية، وتمنح كل واحد منهم الطريق للوصول إليها." ],
  ft_product: [ "Product", "Produit", "المنتج" ],
  ft_inst: [ "Institutions", "Établissements", "المؤسسات" ],
  ft_trust: [ "Your data", "Vos données", "بياناتك" ],
  ft_uni_in: [ "Institution sign-in", "Connexion établissement", "دخول المؤسسات" ],
  ft_team: [ "Operations", "Opérations", "العمليات" ],
  in_k: [ "What a CV can’t see", "Ce qu’un CV ne voit pas", "ما لا تراه السيرة الذاتية" ],
  in_h: [ "Most of what you can do, you learned outside the classroom.", "L’essentiel de ce que vous savez faire, vous l’avez appris hors de la salle de classe.", "أغلب ما تُتقنه تعلّمته خارج القسم." ],
  in_sub: [ "At the family shop, in a student club, in a summer job. It counts, but nobody writes it down.", "À la boutique familiale, dans un club étudiant, pendant un emploi d’été. Cela compte, mais personne ne l’écrit.", "في متجر العائلة، وفي نادٍ طلابي، وفي عمل صيفي. كل ذلك له قيمة، لكن لا أحد يكتبه." ],
  xl1: [ "I help my father at the shop on weekends. I serve customers, close the till and deal with suppliers.", "J’aide mon père à la boutique le week-end. Je sers les clients, je fais la caisse et je traite avec les fournisseurs.", "أساعد والدي في المتجر نهاية الأسبوع. أخدم الزبائن، وأُغلق الصندوق، وأتعامل مع الموردين." ],
  xl1_who: [ "Economics, 3rd year", "Économie, 3e année", "اقتصاد، السنة الثالثة" ],
  xl2: [ "I organised our club’s charity gala: 300 guests, 12 volunteers, one month to prepare.", "J’ai organisé le gala caritatif du club : 300 invités, 12 bénévoles, un mois de préparation.", "نظّمت حفل النادي الخيري: 300 ضيف، و12 متطوعاً، وشهر واحد للتحضير." ],
  xl2_who: [ "Law, 2nd year", "Droit, 2e année", "قانون، السنة الثانية" ],
  xl3: [ "Every summer I welcome guests at my family’s guesthouse in Chefchaouen, in French, English and Spanish.", "Chaque été, j’accueille les clients de la maison d’hôtes familiale à Chefchaouen, en français, en anglais et en espagnol.", "أستقبل كل صيف نزلاء دار الضيافة العائلية في شفشاون بالفرنسية والإنجليزية والإسبانية." ],
  xl3_who: [ "Languages, master’s", "Langues, master", "لغات، ماستر" ],
  in_note: [ "Three ordinary sentences. Nine skills an employer is looking for.", "Trois phrases ordinaires. Neuf compétences qu’un employeur recherche.", "ثلاث جمل عادية، وتسع مهارات يبحث عنها أصحاب العمل." ],
  ch_k: [ "The idea", "L’idée", "الفكرة" ],
  ch_h: [ "One thread, from what you lived to where you’re going.", "Un fil conducteur, de votre vécu à votre objectif.", "خيط واحد، مما عشته إلى حيث تتجه." ],
  ch_sub: [ "Every step uses the one before it. Nothing is asked twice, nothing is guessed.", "Chaque étape s’appuie sur la précédente. Rien n’est demandé deux fois, rien n’est deviné.", "كل خطوة تبني على التي قبلها؛ لا شيء يُطلب مرتين، ولا شيء يُخمَّن." ],
  ch1: [ "Experience", "Expérience", "التجربة" ],
  ch1d: [ "What you did, in your words", "Ce que vous avez fait, avec vos mots", "ما قمت به، بكلماتك" ],
  ch2: [ "Capability", "Capacité", "القدرة" ],
  ch3: [ "Direction", "Orientation", "الاتجاه" ],
  ch3d: [ "Roles where you already fit", "Les postes qui vous correspondent déjà", "وظائف تناسبك منذ الآن" ],
  ch4: [ "Gap", "Écart", "الفجوة" ],
  ch4d: [ "Exactly what’s missing", "Ce qui manque précisément", "ما ينقص بالتحديد" ],
  ch5: [ "Action", "Action", "التنفيذ" ],
  ch5d: [ "A 30-day path, day by day", "Un parcours de 30 jours, jour après jour", "مسار 30 يوماً، يوماً بيوم" ],
  ch6: [ "Proof", "Preuve", "الإثبات" ],
  ch6d: [ "Small things you can show", "Des réalisations concrètes à montrer", "أشياء صغيرة يمكنك عرضها" ],
  ch7: [ "Readiness", "Préparation", "الجاهزية" ],
  ch7d: [ "A score you can read", "Un score lisible", "نسبة يمكنك قراءتها" ],
  ch8: [ "Opportunity", "Opportunité", "الفرصة" ],
  ch8d: [ "Apply when you are ready", "Postulez le moment venu", "ترشّح حين تكتمل جاهزيتك" ],
  ps_k: [ "The passport", "Le passeport", "الجواز" ],
  ps_h: [ "Proof, not promises.", "Des preuves, pas des promesses.", "إثباتات، لا وعود." ],
  ps_sub: [ "Each skill carries its source and its state: suggested, confirmed by you, backed by evidence, or verified by your institution.", "Chaque compétence garde sa source et son état : suggérée, confirmée par vous, appuyée par une preuve, ou vérifiée par votre établissement.", "تحمل كل مهارة مصدرها وحالتها: مقترحة، أو أكّدتها أنت، أو مدعومة بدليل، أو تحقّقت منها مؤسستك." ],
  ps_s1: [ "SKILMA suggests it from your words. Nothing is decided yet.", "SKILMA la suggère à partir de vos mots. Rien n’est encore décidé.", "تقترحها سكيلما من كلماتك، ولم يُحسم شيء بعد." ],
  ps_s2: [ "You confirmed it from your own story.", "Vous l’avez confirmée à partir de votre récit.", "أكّدتها من قصتك." ],
  ps_s3: [ "You added proof: a file, a link or a result.", "Vous avez ajouté une preuve : un fichier, un lien ou un résultat.", "أضفت دليلاً: ملفاً أو رابطاً أو نتيجة." ],
  ps_s4: [ "Your institution confirmed that the experience happened. It does not grade your level.", "Votre établissement a confirmé que l’expérience a eu lieu. Il ne note pas votre niveau.", "أكّدت مؤسستك أن التجربة حدثت فعلاً، دون أن تقيّم مستواك." ],
  ps_cta: [ "See an example passport", "Voir un exemple de passeport", "شاهد جوازاً نموذجياً" ],
  jy_k: [ "An example journey", "Un exemple de parcours", "رحلة نموذجية" ],
  jy_h: [ "Thirty days, one goal, real progress.", "Trente jours, un objectif, des progrès réels.", "ثلاثون يوماً، هدف واحد، تقدّم حقيقي." ],
  jy_sub: [ "Sara, a final-year Economics and Management student in Tétouan, aims to become a Junior Business Analyst.", "Sara, en dernière année d’économie et gestion à Tétouan, vise un poste d’analyste métier junior.", "سارة، طالبة في سنة التخرج بشعبة الاقتصاد والتسيير بتطوان، تطمح إلى وظيفة محللة أعمال مبتدئة." ],
  jy1: [ "Tells what she does", "Raconte ce qu’elle fait", "تحكي ما تقوم به" ],
  jy1d: [ "The family shop and a class survey. Eight skills found.", "La boutique familiale et une enquête de cours. Huit compétences trouvées.", "متجر العائلة واستطلاع في مادة دراسية. ثماني مهارات مُكتشفة." ],
  jy2: [ "Chooses a goal", "Choisit un objectif", "تختار هدفاً" ],
  jy2d: [ "Junior Business Analyst. Two skills are missing: Power BI and SQL.", "Analyste métier junior. Il lui manque deux compétences : Power BI et SQL.", "محللة أعمال مبتدئة. تنقصها مهارتان: Power BI وSQL." ],
  jy3: [ "Proves Power BI", "Démontre Power BI", "تُثبت Power BI" ],
  jy3d: [ "Day 6: a two-chart dashboard, her first proof.", "Jour 6 : un tableau de bord de deux graphiques, sa première preuve.", "اليوم 6: لوحة قيادة من رسمين، أول إثبات لها." ],
  jy4: [ "Proves SQL", "Démontre SQL", "تُثبت SQL" ],
  jy4d: [ "Day 13: ten working queries on a sales database.", "Jour 13 : dix requêtes fonctionnelles sur une base de ventes.", "اليوم 13: عشرة استعلامات تعمل على قاعدة بيانات مبيعات." ],
  jy5: [ "Practises the interview", "S’entraîne à l’entretien", "تتدرّب على المقابلة" ],
  jy5d: [ "Five questions, scored answers, one clear tip each.", "Cinq questions, des réponses notées, un conseil clair à chaque fois.", "خمسة أسئلة، وإجابات مقيّمة، ونصيحة واضحة لكل منها." ],
  jy6: [ "Publishes her project", "Publie son projet", "تنشر مشروعها" ],
  jy6d: [ "Day 30: a three-chart Power BI dashboard on open HCP data, in her passport.", "Jour 30 : un tableau de bord Power BI de trois graphiques sur les données ouvertes du HCP, dans son passeport.", "اليوم 30: لوحة Power BI من ثلاثة رسوم على بيانات المندوبية السامية للتخطيط المفتوحة، في جوازها." ],
  jy_note: [ "Illustrative journey. Sara is an example profile you can open from “Sign in”.", "Parcours illustratif. Sara est un profil d’exemple accessible depuis « Se connecter ».", "رحلة توضيحية. سارة حساب نموذجي يمكنك فتحه من صفحة تسجيل الدخول." ],
  ai_k: [ "Honest AI", "Une IA honnête", "ذكاء اصطناعي صريح" ],
  ai_h: [ "AI that shows its work.", "Une IA qui montre son travail.", "ذكاء اصطناعي يُظهر طريقة عمله." ],
  ai_sub: [ "SKILMA reads your story as a good career advisor would, then hands the decision back to you.", "SKILMA lit votre récit comme le ferait un bon conseiller, puis vous rend la décision.", "تقرأ سكيلما قصتك كما يقرؤها مستشار توجيه جيد، ثم تعيد إليك القرار." ],
  ai_p1: [ "It quotes you", "Elle vous cite", "تقتبس كلماتك" ],
  ai_p1d: [ "Every suggested skill comes with the exact words it was found in.", "Chaque compétence suggérée est accompagnée des mots exacts dont elle est tirée.", "كل مهارة مقترحة تأتي مع الكلمات نفسها التي وُجدت فيها." ],
  ai_p2: [ "You decide", "Vous décidez", "أنت تقرّر" ],
  ai_p2d: [ "Yes or no, one skill at a time. Nothing enters your passport on its own.", "Oui ou non, une compétence à la fois. Rien n’entre seul dans votre passeport.", "نعم أو لا، مهارة بعد مهارة. لا يدخل شيء إلى جوازك تلقائياً." ],
  ai_p3: [ "It admits limits", "Elle reconnaît ses limites", "تعترف بحدودها" ],
  ai_p3d: [ "When a story is too thin, it says so and asks one more question.", "Quand un récit est trop mince, elle le dit et pose une question de plus.", "إذا كانت القصة مقتضبة جداً، تقول ذلك وتطرح سؤالاً إضافياً." ],
  aid_you: [ "You", "Vous", "أنت" ],
  aid_story: [ "Last month I convinced a supplier to lower his price by 8% for the shop.", "Le mois dernier, j’ai convaincu un fournisseur de baisser son prix de 8 % pour la boutique.", "في الشهر الماضي أقنعت مورّداً بتخفيض سعره بنسبة 8% لفائدة المتجر." ],
  aid_found: [ "Found in your words", "Trouvé dans vos mots", "مستخرَجة من كلماتك" ],
  aid_quote: [ "convinced a supplier to lower his price", "convaincu un fournisseur de baisser son prix", "أقنعت مورّداً بتخفيض سعره" ],
  aid_why: [ "Negotiation is rare on student CVs and asked for in 4 roles here.", "La négociation est rare sur les CV étudiants et demandée dans 4 postes ici.", "التفاوض نادر في السِّيَر الذاتية للطلبة، ومطلوب في 4 وظائف هنا." ],
  au_k: [ "Who it’s for", "Pour qui", "لمن صُمّمت سكيلما" ],
  au_h: [ "One passport, three readers.", "Un passeport, trois lecteurs.", "جواز واحد، يقرؤه ثلاثة أطراف." ],
  au_emp: [ "Employers", "Employeurs", "أصحاب العمل" ],
  aud_e_t: [ "See what a candidate can actually do", "Voyez ce qu’un candidat sait réellement faire", "اعرفوا ما يستطيع المرشح فعله حقاً" ],
  aud_e_d: [ "Skills with their source, proof you can open, and verification from the institution.", "Des compétences avec leur source, des preuves consultables et la vérification de l’établissement.", "مهارات بمصادرها، وإثباتات يمكن فتحها، وتوثيق من المؤسسة." ],
  fq_k: [ "Questions", "Questions", "أسئلة" ],
  fq_h: [ "What students ask first", "Ce que les étudiants demandent d’abord", "ما يسأل عنه الطلبة أولاً" ],
  fq1: [ "How is it different from ChatGPT?", "En quoi est-ce différent de ChatGPT ?", "ما الفرق بينها وبين ChatGPT؟" ],
  fq1a: [ "ChatGPT gives general advice. SKILMA starts from what you have actually done, compares it with roles in Morocco, gives you a 30-day path, follows your progress and helps you prove it.", "ChatGPT donne des conseils généraux. SKILMA part de ce que vous avez réellement fait, le compare aux postes au Maroc, vous donne un parcours de 30 jours, suit vos progrès et vous aide à les prouver.", "يقدّم ChatGPT نصائح عامة. أما سكيلما فتنطلق مما قمت به فعلاً، وتقارنه بوظائف في المغرب، وتمنحك مساراً من 30 يوماً، وتتابع تقدّمك وتساعدك على إثباته." ],
  fq2: [ "I’ve never had a job. Can I still use it?", "Je n’ai jamais travaillé. Puis-je quand même l’utiliser ?", "لم أعمل من قبل. هل يمكنني استعمالها؟" ],
  fq2a: [ "Yes. Family business, volunteering, a club, a class project, helping at home — all of it counts.", "Oui. Commerce familial, bénévolat, club, projet de cours, aide à la maison — tout compte.", "نعم. تجارة العائلة، والتطوع، والنادي، ومشروع دراسي، ومساعدة الأسرة: كل ذلك يُحتسب." ],
  fq3: [ "Can I write in Darija?", "Puis-je écrire en darija ?", "هل يمكنني الكتابة بالدارجة؟" ],
  fq3a: [ "Yes. Write in Darija, Arabic, French, English, or a mix. The site itself is in Arabic, French and English.", "Oui. Écrivez en darija, arabe, français, anglais, ou en mélangeant. Le site est en arabe, français et anglais.", "نعم. اكتب بالدارجة أو العربية أو الفرنسية أو الإنجليزية، أو امزج بينها. والموقع نفسه بالعربية والفرنسية والإنجليزية." ],
  fq4: [ "Who sees my passport?", "Qui voit mon passeport ?", "من يرى جوازي؟" ],
  fq4a: [ "Only you, until you turn on a public link or share it with your institution. You can turn both off at any time.", "Personne d’autre que vous, tant que vous n’activez pas un lien public ou le partage avec votre établissement. Vous pouvez désactiver les deux à tout moment.", "أنت وحدك، إلى أن تفعّل رابطاً عاماً أو تشاركه مع مؤسستك. ويمكنك إيقاف الأمرين في أي وقت." ],
  fq5: [ "Does a high score guarantee the role?", "Un bon score garantit-il le poste ?", "هل تعني النسبة العالية أنني سأحصل على الوظيفة؟" ],
  fq5a: [ "No. Readiness is a checklist of what you have shown, with each step visible. The employer decides.", "Non. La préparation est une liste de ce que vous avez montré, chaque étape visible. L’employeur décide.", "لا. الجاهزية قائمة بما أظهرته، وكل خطوة فيها ظاهرة. والقرار للمشغّل." ],
  fq6: [ "What if SKILMA finds a skill I don’t have?", "Et si SKILMA trouve une compétence que je n’ai pas ?", "ماذا لو وجدت سكيلما مهارة لا أملكها؟" ],
  fq6a: [ "Say no. It is left out of your passport.", "Répondez non. Elle est écartée de votre passeport.", "قل لا، فتُستبعد، وتتعلّم سكيلما أن هذا النوع من الاقتراحات كان خاطئاً." ],
  fq7: [ "How long does it take?", "Combien de temps cela prend-il ?", "كم يستغرق ذلك؟" ],
  fq7a: [ "About ten minutes for your first passport. The 30-day path asks 20 to 45 minutes a day.", "Environ dix minutes pour votre premier passeport. Le parcours de 30 jours demande 20 à 45 minutes par jour.", "نحو عشر دقائق لجوازك الأول، ويتطلب مسار 30 يوماً من 20 إلى 45 دقيقة يومياً." ],
  fin_d: [ "About ten minutes, in your language. Nothing enters your passport without your yes.", "Environ dix minutes, dans votre langue. Rien n’entre dans votre passeport sans votre accord.", "نحو عشر دقائق، وبلغتك. ولا يدخل جوازك شيء دون موافقتك." ],
  hw_h1: [ "From one story to your first opportunity.", "D’un récit à votre première opportunité.", "من قصة واحدة إلى أول فرصة." ],
  hw_sub: [ "Five steps. Each is shown exactly as it appears in the product.", "Cinq étapes, présentées telles qu’elles apparaissent dans le produit.", "خمس خطوات، تظهر كل منها كما تبدو في المنتج تماماً." ],
  hw1t: [ "Tell what you have done", "Racontez ce que vous avez fait", "احكِ ما قمت به" ],
  hw1d: [ "Write it as you would tell a friend, in any language. SKILMA highlights the words behind each skill; you confirm or reject each one.", "Écrivez comme vous le raconteriez à un ami, dans la langue de votre choix. SKILMA surligne les mots dont découle chaque compétence ; vous validez ou écartez chacune.", "اكتب كما تحكي لصديق، بأي لغة. تُبرز سكيلما الكلمات التي تدلّ على كل مهارة، وأنت تؤكّد كل واحدة أو تستبعدها." ],
  hw1p1: [ "Any language, even Darija", "Toutes les langues, même la darija", "بأي لغة، حتى الدارجة" ],
  hw1p2: [ "You decide on every skill", "Vous validez chaque compétence", "أنت من يقرّر بشأن كل مهارة" ],
  hw2t: [ "See where you fit", "Voyez où vous correspondez", "اعرف أين تلائمك الفرص" ],
  hw2d: [ "Roles are ranked by fit. Open one to see what you already have.", "Les postes sont classés par adéquation. Ouvrez-en un pour voir ce que vous avez déjà.", "تُرتَّب الوظائف حسب التوافق. افتح واحدة لترى ما تملكه مسبقاً." ],
  hw2p1: [ "Key skills come first", "Les compétences clés d’abord", "المهارات الأساسية أولاً" ],
  hw2p2: [ "Every score shows its calculation", "Chaque score montre son calcul", "كل نسبة تُظهر طريقة حسابها" ],
  hw3t: [ "See exactly what is missing", "Voyez précisément ce qui manque", "اعرف بالضبط ما ينقصك" ],
  hw3d: [ "For each role: the missing skills, a resource to learn each one, and the hours it takes.", "Pour chaque poste : les compétences manquantes, une ressource pour apprendre chacune et le temps nécessaire.", "لكل وظيفة: المهارات الناقصة، ومورد لتعلّم كل واحدة منها، والوقت اللازم." ],
  hw3p1: [ "Core gaps first", "Les écarts clés d’abord", "الفجوات الأساسية أولاً" ],
  hw3p2: [ "Hours to close each gap", "Heures nécessaires pour chaque écart", "عدد الساعات اللازمة لسدّ كل فجوة" ],
  hw4t: [ "Follow a 30-day path", "Suivez un parcours de 30 jours", "اتّبع مساراً من 30 يوماً" ],
  hw4p1: [ "Works on a phone", "Fonctionne sur téléphone", "يعمل على الهاتف" ],
  hw4p2: [ "Resources anyone can open first", "D’abord des ressources accessibles à tous", "الموارد المتاحة للجميع أولاً" ],
  mt_k: [ "Method", "Méthode", "المنهجية" ],
  mt_h: [ "Every number shows its calculation.", "Chaque chiffre indique son calcul.", "كل رقم يعرض طريقة حسابه." ],
  mt_sub: [ "No black box. These two counts are behind every number you see.", "Pas de boîte noire. Ces deux comptes sont derrière chaque chiffre affiché.", "لا صندوق أسود. هذان العدّان وراء كل رقم تراه." ],
  mt_fit: [ "Fit with a role", "Adéquation avec un poste", "التوافق مع وظيفة" ],
  mt_other: [ "Other", "Autres", "الأخرى" ],
  mt_fit_d: [ "For example 4/6: you have 4 of the 6 skills the role asks for. Roles are sorted by this count, key skills first.", "Par exemple 4/6 : vous avez 4 des 6 compétences demandées. Les postes sont classés selon ce compte, compétences clés d’abord.", "مثلاً 4/6: تملك 4 من أصل 6 مهارات تطلبها الوظيفة. تُرتَّب الوظائف حسب هذا العدد، والمهارات الأساسية أولاً." ],
  mt_ready: [ "Readiness", "Préparation", "الجاهزية" ],
  mt_proof: [ "Proof for each key skill", "Une preuve par compétence clé", "دليل لكل مهارة أساسية" ],
  mt_iv: [ "One mock interview", "Un entretien blanc", "مقابلة تدريبية واحدة" ],
  mt_ready_d: [ "A checklist, for example 9/11 steps done. Each step is something you did and can show; nothing is weighted in secret.", "Une liste, par exemple 9/11 étapes faites. Chaque étape est une chose faite et visible ; rien n’est pondéré en secret.", "قائمة خطوات، مثلاً 9/11 خطوات منجزة. كل خطوة شيء قمت به ويمكنك إظهاره، ولا شيء يُوزن في الخفاء." ],
  mt_limit: [ "Limits", "Limites", "الحدود" ],
  mt_limit_h: [ "An estimate, never a verdict.", "Une estimation, jamais un verdict.", "تقدير، لا حكم." ],
  mt_limit_d: [ "Scores help you choose what to do next. They are never sent to an employer as a decision.", "Les scores vous aident à choisir la prochaine étape. Ils ne sont jamais transmis à un employeur comme une décision.", "تساعدك النسب على اختيار ما تفعله بعد ذلك، ولا تُرسل أبداً إلى صاحب عمل على أنها قرار." ],
  ip_k: [ "What you get", "Ce que vous obtenez", "ما تحصلون عليه" ],
  ip_h2: [ "A console built around action.", "Une console pensée pour agir.", "لوحة مصمَّمة للتدخّل." ],
  ip_f4t: [ "Reports in one click", "Rapports en un clic", "تقارير بنقرة واحدة" ],
  ip_f4d: [ "Semester summary, skills by programme, verification log — ready for your board.", "Synthèse du semestre, compétences par filière, journal des vérifications — prêts pour vos instances.", "ملخص الأسدس، والمهارات حسب الشعبة، وسجل التوثيق، جاهزة لمجلس مؤسستكم." ],
  ip_see_k: [ "Privacy", "Confidentialité", "الخصوصية" ],
  ip_see_h: [ "What you see — and what you never see.", "Ce que vous voyez — et ce que vous ne voyez jamais.", "ما ترونه، وما لن تروه أبداً." ],
  ip_see_y: [ "You see", "Vous voyez", "ترون" ],
  ip_see_n: [ "You never see", "Vous ne voyez jamais", "لن تروا" ],
  ip_y1: [ "Figures for groups of 10 students or more", "Des chiffres pour des groupes de 10 étudiants ou plus", "أرقاماً لمجموعات من 10 طلبة فأكثر" ],
  ip_y2: [ "The skills each programme can prove", "Les compétences que chaque filière peut prouver", "المهارات التي تستطيع كل شعبة إثباتها" ],
  ip_y3: [ "Passports students choose to share", "Les passeports que les étudiants choisissent de partager", "الجوازات التي يختار الطلبة مشاركتها" ],
  ip_y4: [ "Verification requests addressed to you", "Les demandes de vérification qui vous sont adressées", "طلبات التوثيق الموجّهة إليكم" ],
  ip_n1: [ "A student’s stories, unless they share", "Les récits d’un étudiant, sauf s’il les partage", "قصص الطالب، إلا إذا شاركها" ],
  ip_n2: [ "Skills a student left out", "Les compétences qu’un étudiant a écartées", "المهارات التي استبعدها الطالب" ],
  ip_n3: [ "Anything from another institution", "Les données d’un autre établissement", "أي شيء من مؤسسة أخرى" ],
  ip_pilot_k: [ "Pilot", "Pilote", "التجربة النموذجية" ],
  ip_pilot_t: [ "Request a pilot", "Demander un pilote", "اطلبوا تجربة نموذجية" ],
  ip_pilot_d: [ "One semester, one or two programmes, a career team that wants to act on evidence.", "Un semestre, une ou deux filières, une équipe carrière qui souhaite agir à partir de preuves.", "أسدس واحد، وشعبة أو اثنتان، وفريق توجيه يريد العمل بناءً على الأدلة." ],
  ip_ps1: [ "Tell us about your institution", "Présentez-nous votre établissement", "عرّفونا بمؤسستكم" ],
  ip_ps2: [ "A 30-minute call to choose programmes", "Un appel de 30 minutes pour choisir les filières", "مكالمة من 30 دقيقة لاختيار الشُّعب" ],
  ip_ps3: [ "Your console can be ready within a week", "Votre console peut être prête en une semaine", "تكون لوحتكم جاهزة خلال أسبوع" ],
  pf_name: [ "Your name", "Votre nom", "اسمك" ],
  pf_role: [ "Your role", "Votre fonction", "صفتك" ],
  pf_inst: [ "Institution", "Établissement", "المؤسسة" ],
  pf_email: [ "Work email", "E-mail professionnel", "البريد المهني" ],
  pf_city: [ "City", "Ville", "المدينة" ],
  pf_size: [ "Number of students", "Nombre d’étudiants", "عدد الطلبة" ],
  pf_send: [ "Send request", "Envoyer la demande", "أرسل الطلب" ],
  pf_note: [ "Used only to reply to this request.", "Utilisé uniquement pour répondre à cette demande.", "يُستعمل فقط للرد على هذا الطلب." ],
  pf_ok_t: [ "Request saved", "Demande enregistrée", "حُفظ الطلب" ],
  pf_ok_d: [ "Thank you. Your pilot request for {inst} is saved. Pilots open in stages.", "Merci. Votre demande de pilote pour {inst} est enregistrée. Les pilotes ouvrent par étapes.", "شكراً لكم. حُفظ طلب التجربة الخاص بـ{inst}. تنطلق التجارب على مراحل." ],
  fi1: [ "What does a pilot involve?", "Que comprend un pilote ?", "ماذا تتضمّن التجربة؟" ],
  fi1a: [ "One semester, one or two programmes, and a career team that wants to act on evidence. What follows is agreed together.", "Un semestre, une ou deux filières, et une équipe carrière prête à agir sur des faits. La suite se décide ensemble.", "فصل دراسي واحد، وشعبة أو شعبتان، وفريق توجيه يريد العمل بالأدلة. وما بعد ذلك نتفق عليه معاً." ],
  fi2: [ "Do we need to integrate with our systems?", "Faut-il une intégration à nos systèmes ?", "هل نحتاج إلى ربطها بأنظمتنا؟" ],
  fi2a: [ "No. Students join with an invitation link. Single sign-on is optional.", "Non. Les étudiants rejoignent SKILMA via un lien d’invitation. L’authentification unique est facultative.", "لا. ينضم الطلبة برابط دعوة، والدخول الموحّد اختياري." ],
  fi3: [ "Who owns the data?", "À qui appartiennent les données ?", "لمن تعود ملكية البيانات؟" ],
  fi3a: [ "Each student owns their passport. You own the aggregated figures for your institution.", "Chaque étudiant est propriétaire de son passeport. Vous êtes propriétaire des chiffres agrégés de votre établissement.", "يملك كل طالب جوازه، وتملكون الأرقام المجمَّعة الخاصة بمؤسستكم." ],
  fi4: [ "What does verifying commit us to?", "À quoi la vérification nous engage-t-elle ?", "بماذا يُلزمنا التوثيق؟" ],
  fi4a: [ "Only that the experience happened as described. Not a judgement of the student’s level.", "Uniquement à attester que l’expérience a eu lieu comme décrite. Pas à juger le niveau de l’étudiant.", "فقط بأن التجربة حدثت كما وُصفت، لا بالحكم على مستوى الطالب." ],
  ts_k: [ "Your data", "Vos données", "بياناتك" ],
  ts_h: [ "Who sees what, and why.", "Qui voit quoi, et pourquoi.", "من يرى ماذا، ولماذا." ],
  ts_data: [ "Data", "Donnée", "البيانات" ],
  ts_who: [ "Who can see it", "Qui peut la voir", "من يستطيع رؤيتها" ],
  ts_why: [ "Why", "Pourquoi", "لماذا" ],
  ts_r1: [ "Your stories", "Vos récits", "قصصك" ],
  ts_w1: [ "You only", "Vous uniquement", "أنت وحدك" ],
  ts_y1: [ "To find your skills.", "Pour repérer vos compétences.", "لاكتشاف مهاراتك." ],
  ts_r2: [ "Confirmed skills and proof", "Compétences confirmées et preuves", "المهارات المؤكَّدة والإثباتات" ],
  ts_w2: [ "You, and anyone with your public link", "Vous, et toute personne disposant de votre lien public", "أنت، ومن يملك رابطك العام" ],
  ts_y2: [ "To show employers what you can do.", "Pour montrer aux employeurs ce que vous savez faire.", "لتُظهر لأصحاب العمل ما تستطيع فعله." ],
  ts_r3: [ "Your passport summary", "Le résumé de votre passeport", "ملخص جوازك" ],
  ts_w3: [ "Your institution, if you share", "Votre établissement, si vous partagez", "مؤسستك، إذا شاركت" ],
  ts_y3: [ "To verify your experiences and support you.", "Pour vérifier vos expériences et vous accompagner.", "لتوثيقك ودعمك." ],
  ts_r4: [ "Group figures", "Chiffres de groupe", "أرقام المجموعات" ],
  ts_w4: [ "Your institution (10 or more students)", "Votre établissement (10 étudiants ou plus)", "مؤسستك (10 طلبة فأكثر)" ],
  ts_y4: [ "To plan workshops and partnerships.", "Pour organiser des ateliers et des partenariats.", "لتخطيط الورشات والشراكات." ],
  ex_h1: [ "What an employer sees.", "Ce que voit un employeur.", "ما يراه صاحب العمل." ],
  ex_sub: [ "A complete SKILMA passport, as it appears behind a public link.", "Un passeport SKILMA complet, tel qu’il apparaît derrière un lien public.", "جواز سكيلما كامل، كما يظهر خلف رابط عام." ],
  ex_note: [ "Example passport · Sara is an example profile.", "Exemple de passeport · Sara est un profil d’exemple.", "جواز نموذجي · سارة حساب نموذجي." ],
  ex_cta: [ "Build your own passport", "Créer votre passeport", "ابنِ جوازك" ],
  pub_aim: [ "aiming for {x}", "vise {x}", "الهدف: {x}" ],
  pub_exps: [ "Experiences", "Expériences", "التجارب" ],
  pub_g_ver: [ "Verified by the institution", "Vérifiées par l’établissement", "موثَّقة من المؤسسة" ],
  pub_g_proven: [ "Backed by evidence the student added", "Appuyées par des preuves ajoutées par l’étudiant", "مدعومة بأدلة أضافها الطالب" ],
  pub_g_conf: [ "Confirmed by the student", "Confirmées par l’étudiant", "مؤكَّدة من الطالب" ],
  pub_ver_by: [ "verified by the institution", "vérifié par l’établissement", "موثَّقة من المؤسسة" ],
  pub_how_read: [ "Each skill shows the words or proof it comes from. Verification confirms an experience happened; it does not grade the student.", "Chaque compétence indique les mots ou la preuve dont elle provient. La vérification atteste qu’une expérience a eu lieu ; elle ne note pas l’étudiant.", "تعرض كل مهارة الكلمات أو الإثبات الذي جاءت منه. ويؤكد التوثيق أن التجربة حدثت، ولا يقيّم الطالب." ],
  pub_private_t: [ "This passport is private", "Ce passeport est privé", "هذا الجواز خاص" ],
  pub_private_d: [ "Its owner has not turned on a public link.", "Son titulaire n’a pas activé de lien public.", "لم يفعّل صاحبه رابطاً عاماً." ],
  pub_src_story: [ "From the student’s own story", "Tiré du récit de l’étudiant", "من قصة الطالب نفسه" ],
  pub_src_plan: [ "Proof added by the student", "Preuve ajoutée par l’étudiant", "إثبات أضافه الطالب" ],
  fi_h: [ "What institutions ask first", "Ce que les établissements demandent d’abord", "ما تسأل عنه المؤسسات أولاً" ],
  skip: [ "Skip to content", "Aller au contenu", "انتقل إلى المحتوى" ],
  print_pdf: [ "Print or save as PDF", "Imprimer ou enregistrer en PDF", "طباعة أو حفظ بصيغة PDF" ],
  ver_wait: [ "Waiting", "En attente", "قيد الانتظار" ],
  ev_pub_on: [ "Public link turned on", "Lien public activé", "تفعيل الرابط العام" ],
  ev_pub_off: [ "Passport made private", "Passeport rendu privé", "جعل الجواز خاصاً" ],
  ev_uni_on: [ "Passport shared with your institution", "Passeport partagé avec votre établissement", "مشاركة الجواز مع المؤسسة" ],
  ev_uni_off: [ "Sharing with your institution stopped", "Partage avec l’établissement arrêté", "إيقاف المشاركة مع المؤسسة" ],
  pub_on: [ "Public", "Public", "عام" ],
  pub_off: [ "Private", "Privé", "خاص" ],
  nf_t: [ "This page does not exist.", "Cette page n’existe pas.", "هذه الصفحة غير موجودة." ],
  nf_d: [ "The link may be out of date. Search, or go back home.", "Le lien est peut-être obsolète. Lancez une recherche ou revenez à l’accueil.", "ربما يكون الرابط قديماً. ابحث، أو عُد إلى الرئيسية." ],
  nf_home: [ "Back home", "Retour à l’accueil", "العودة إلى الرئيسية" ],
  si_link: [ "Send me a sign-in link", "Recevoir un lien de connexion", "أرسل لي رابط الدخول" ],
  si_nopass: [ "No password. A one-time link by email, or by SMS to your phone.", "Pas de mot de passe. Un lien à usage unique par e-mail, ou par SMS.", "بلا كلمة مرور: رابط يُستعمل مرة واحدة عبر البريد أو رسالة نصية." ],
  si_or: [ "or open a demo", "ou ouvrez une démo", "أو افتح حساباً تجريبياً" ],
  si_newq: [ "New here?", "Première visite ?", "أول زيارة لك؟" ],
  si_sent_t: [ "Check your messages", "Consultez vos messages", "تفقّد رسائلك" ],
  si_sent_d: [ "Your one-time sign-in link for {email} is ready. Open it below.", "Votre lien de connexion à usage unique pour {email} est prêt. Ouvrez-le ci-dessous.", "رابط الدخول الخاص بـ{email} جاهز. افتحه من هنا." ],
  si_open: [ "Open the link", "Ouvrir le lien", "افتح الرابط" ],
  si_other: [ "Use another email", "Utiliser un autre e-mail", "استعمل بريداً آخر" ],
  si_in_new: [ "Signed in. Start with one experience.", "Session ouverte. Commencez par une expérience.", "تمّ الدخول. ابدأ بتجربة واحدة." ],
  si_side: [ "Your passport is yours. It is saved on this device and leaves it only when you choose to share it.", "Votre passeport vous appartient. Il est enregistré sur cet appareil et n’en sort que si vous choisissez de le partager.", "جوازك ملكك. يُحفظ على هذا الجهاز، ولا يخرج منه إلا إذا اخترت مشاركته." ],
  si_other_p: [ "Not a student?", "Vous n’êtes pas étudiant ?", "لست طالباً؟" ],
  csi_demo: [ "Sample university: explore with example data. Every action is recorded in the audit log.", "Établissement exemple : explorez avec des données d’exemple. Chaque action est enregistrée dans le journal d’audit.", "جامعة نموذجية: استكشف ببيانات نموذجية، وكل إجراء يُسجَّل في سجل التدقيق." ],
  usi_t: [ "Sign in to your institution", "Connexion à votre établissement", "تسجيل الدخول إلى مؤسستك" ],
  usi_d: [ "Career centres and faculty teams.", "Services carrière et équipes pédagogiques.", "مراكز التوجيه المهني والفرق البيداغوجية." ],
  usi_sso: [ "Continue with your institution account", "Continuer avec le compte de l’établissement", "المتابعة بحساب الجامعة" ],
  usi_email: [ "Work email", "E-mail professionnel", "البريد المهني" ],
  usi_link: [ "Email me a link", "Recevoir un lien", "أرسل لي رابطاً" ],
  usi_demo: [ "Explore a sample university", "Explorer un établissement exemple", "استكشف جامعة نموذجية" ],
  usi_foot: [ "Access is granted by your institution’s administrator.", "L’accès est accordé par l’administrateur de votre établissement.", "يمنح مسؤول مؤسستك صلاحية الدخول." ],
  usi_new: [ "Not a partner yet?", "Pas encore partenaire ?", "لستم شركاء بعد؟" ],
  usi_pilot: [ "Request a pilot", "Demander un pilote", "اطلبوا تجربة نموذجية" ],
  usi_sent: [ "Sign-in link ready for {email}.", "Lien de connexion prêt pour {email}.", "رابط الدخول جاهز لـ{email}." ],
  usi_ok: [ "Signed in to Boughaz University", "Session ouverte : Université du Boughaz", "تمّ تسجيل الدخول إلى جامعة البوغاز" ],
  osi_t: [ "Operator sign-in", "Connexion opérateur", "دخول المشغّلين" ],
  osi_d: [ "Restricted to the SKILMA operations team.", "Réservé à l’équipe des opérations de SKILMA.", "مخصّص لفريق العمليات في سكيلما." ],
  osi_email: [ "SKILMA email", "E-mail SKILMA", "بريد سكيلما" ],
  osi_key: [ "Continue with security key", "Continuer avec la clé de sécurité", "المتابعة بمفتاح الأمان" ],
  osi_touch: [ "Touch your security key…", "Touchez votre clé de sécurité…", "المس مفتاح الأمان…" ],
  osi_demo: [ "Sign in as a demo operator", "Se connecter en tant qu’opérateur de démo", "الدخول بصفة مشغّل تجريبي" ],
  osi_foot: [ "Every action in this console is recorded in the audit log.", "Chaque action dans cette console est enregistrée dans le journal d’audit.", "كل إجراء في هذه اللوحة يُسجَّل في سجل التدقيق." ],
  osi_ok: [ "Signed in to operations", "Session ouverte : opérations", "تمّ الدخول إلى العمليات" ],
  pp_tab_skills: [ "Skills", "Compétences", "المهارات" ],
  pp_tab_exp: [ "Experiences", "Expériences", "التجارب" ],
  pp_tab_share: [ "Share and verify", "Partager et vérifier", "المشاركة والتوثيق" ],
  pp_public_view: [ "View public passport", "Voir le passeport public", "عرض الجواز العام" ],
  exp_none: [ "No skills kept from this experience", "Aucune compétence retenue", "لم تُحفظ منها أي مهارة" ],
  exp_add_d: [ "Each new story can reveal skills you did not list.", "Chaque nouveau récit peut révéler des compétences oubliées.", "قد تكشف كل قصة جديدة مهارات لم تذكرها." ],
  sh_pub_t: [ "Public link", "Lien public", "رابط عام" ],
  sh_pub_d: [ "Prepares your public page: confirmed skills and proof only, never your left-out skills. Today it opens on this device; share it as a PDF.", "Prépare votre page publique : compétences confirmées et preuves uniquement, jamais celles écartées. Aujourd’hui, elle s’ouvre sur cet appareil ; partagez-la en PDF.", "تُعدّ صفحتك العامة: المهارات المؤكَّدة والإثباتات فقط، ولا تظهر أبداً المهارات المستبعدة. تُفتح اليوم على هذا الجهاز، ويمكنك مشاركتها بصيغة PDF." ],
  sh_off: [ "Your passport is private.", "Votre passeport est privé.", "جوازك خاص." ],
  sh_preview: [ "Preview", "Aperçu", "معاينة" ],
  sh_uni_t: [ "Share with Boughaz University", "Partager avec l’Université du Boughaz", "المشاركة مع جامعة البوغاز" ],
  sh_uni_d: [ "Your career centre can see your passport summary and support you. They never see your stories.", "Votre service carrière voit le résumé de votre passeport pour vous accompagner. Jamais vos récits.", "يرى مركز التوجيه المهني ملخص جوازك ليدعمك، ولا يرى قصصك أبداً." ],
  sh_ver_d: [ "Ask your institution to verify your experiences.", "Demandez à votre établissement de vérifier vos expériences.", "اطلب من مؤسستك توثيق تجاربك." ],
  sh_ver_wait: [ "Request sent. Your career centre usually replies within a few days.", "Demande envoyée. Votre service carrière répond généralement sous quelques jours.", "أُرسل الطلب. يردّ مركز التوجيه المهني عادةً في غضون أيام." ],
  sh_ver_done: [ "Your institution verified your experiences.", "Votre établissement a vérifié vos expériences.", "وثّقت مؤسستك تجاربك." ],
  sh_cert_t: [ "Passport PDF", "Passeport en PDF", "الشهادة" ],
  sh_cert_d: [ "A one-page PDF of your passport, to attach to an application.", "Un PDF d’une page de votre passeport, à joindre à une candidature.", "ملف PDF من صفحة واحدة لجوازك، لإرفاقه بملف ترشيح." ],
  sh_pub_on: [ "Public link on", "Lien public activé", "تمّ تفعيل الرابط العام" ],
  sh_pub_off: [ "Passport private again", "Passeport à nouveau privé", "عاد جوازك خاصاً" ],
  sh_uni_on: [ "Shared with your institution", "Partagé avec votre établissement", "تمّت المشاركة مع مؤسستك" ],
  sh_uni_off: [ "No longer shared", "Partage arrêté", "أُوقفت المشاركة" ],
  nt_title: [ "Notifications", "Notifications", "الإشعارات" ],
  nt_sub: [ "What changed in your passport and your path.", "Ce qui a changé dans votre passeport et votre parcours.", "ما تغيّر في جوازك ومسارك." ],
  nt_today: [ "Today", "Aujourd’hui", "اليوم" ],
  nt_earlier: [ "Earlier", "Plus tôt", "سابقاً" ],
  nt_now: [ "just now", "à l’instant", "الآن" ],
  nt_new: [ "New", "Nouveau", "جديد" ],
  nt_all: [ "Mark all as read", "Tout marquer comme lu", "اعتبار الكل مقروءاً" ],
  nt_all_ok: [ "All marked as read", "Tout est lu", "لا جديد" ],
  nt_prefs: [ "Choose your notifications in", "Choisissez vos notifications dans", "اختر الإشعارات التي تصلك من" ],
  nt_welcome: [ "Welcome to SKILMA", "Bienvenue sur SKILMA", "مرحباً بك في سكيلما" ],
  nt_welcome_d: [ "Your passport is ready. Add a second experience to find more.", "Votre passeport est prêt. Ajoutez une deuxième expérience pour en découvrir davantage.", "جوازك جاهز. أضف تجربة ثانية لاكتشاف المزيد." ],
  nt_ver: [ "Your institution verified your passport", "Votre établissement a vérifié votre passeport", "وثّقت مؤسستك جوازك" ],
  nt_ver_d: [ "Verified skills now carry a seal on your public passport.", "Les compétences vérifiées portent désormais un sceau sur votre passeport public.", "تحمل المهارات الموثَّقة الآن ختماً في جوازك العام." ],
  nt_more: [ "Your career centre needs one more detail", "Votre service carrière a besoin d’un détail supplémentaire", "يحتاج مركز التوجيه المهني إلى تفصيل إضافي" ],
  nt_more_d: [ "Add evidence to one experience, then ask again.", "Ajoutez une preuve à une expérience, puis redemandez.", "أضف دليلاً إلى تجربة واحدة، ثم أعد الطلب." ],
  nt_proven: [ "Proof added: {x}", "Preuve ajoutée : {x}", "أُضيف دليل: {x}" ],
  nt_proven_d: [ "It counts in your checklist. Only your institution can verify it.", "Elle compte dans votre liste. Seul votre établissement peut la vérifier.", "يُحتسب في قائمتك، والتحقّق منه من اختصاص مؤسستك وحدها." ],
  nt_goal: [ "New goal: {x}", "Nouvel objectif : {x}", "هدف جديد: {x}" ],
  nt_goal_d: [ "Your 30-day path is ready.", "Votre parcours de 30 jours est prêt.", "مسار 30 يوماً جاهز." ],
  nt_apply: [ "Tracking: {x}", "Suivi : {x}", "قيد المتابعة: {x}" ],
  nt_apply_d: [ "Saved in your applications.", "Enregistré dans vos candidatures.", "حُفظ في ترشّحاتك." ],
  nt_iv: [ "Mock interview: {s}/100", "Entretien blanc : {s}/100", "تدريب على المقابلة: {s}/100" ],
  nt_iv_d: [ "Each answer comes with one tip to improve.", "Chaque réponse comporte un conseil pour progresser.", "لكل جواب نصيحة واحدة للتحسين." ],
  nt_ready: [ "{p}% readiness for {x}", "Préparation de {p} % pour {x}", "جاهزية {p}% لوظيفة {x}" ],
  nt_ready50: [ "Half of your checklist is done. Keep adding evidence.", "La moitié de votre liste est faite. Continuez à ajouter des preuves.", "أنجزت نصف قائمتك. واصل إضافة الأدلة." ],
  nt_ready70: [ "Every key skill now has proof.", "Chaque compétence clé a désormais une preuve.", "كل مهارة أساسية أصبح لها دليل." ],
  nt_opps: [ "{n|one:# role where you have every core skill|other:# roles where you have every core skill}", "{n|one:# poste où vous avez toutes les compétences clés|other:# postes où vous avez toutes les compétences clés}", "{n|zero:لا وظائف تملك كل مهاراتها الأساسية|one:وظيفة واحدة تملك كل مهاراتها الأساسية|two:وظيفتان تملك كل مهاراتهما الأساسية|few:# وظائف تملك كل مهاراتها الأساسية|many:# وظيفة تملك كل مهاراتها الأساسية|other:# وظيفة تملك كل مهاراتها الأساسية}" ],
  nt_week: [ "This week: {n|one:# day|other:# days} done", "Cette semaine : {n|one:# jour accompli|other:# jours accomplis}", "هذا الأسبوع: {n|zero:لم تُنجز أي يوم|one:أنجزت يوماً واحداً|two:أنجزت يومين|few:أنجزت # أيام|many:أنجزت # يوماً|other:أنجزت # يوم}" ],
  nt_week_d: [ "Small steps add up. Open your path.", "Les petits pas s’additionnent. Ouvrez votre parcours.", "الخطوات الصغيرة تتراكم. افتح مسارك." ],
  help_t: [ "Help", "Aide", "المساعدة" ],
  help_sub: [ "Short answers, and a way to reach us.", "Des réponses courtes, et un moyen de nous joindre.", "إجابات قصيرة، وطريقة للتواصل معنا." ],
  hq1: [ "How do I add another experience?", "Comment ajouter une autre expérience ?", "كيف أضيف تجربة أخرى؟" ],
  hq1a: [ "Passport → Add an experience. New skills are suggested the same way, and you decide again.", "Passeport → Ajouter une expérience. Les nouvelles compétences sont suggérées de la même façon, et vous décidez à nouveau.", "الجواز ← أضف تجربة. تُقترح المهارات الجديدة بالطريقة نفسها، وتقرّر من جديد." ],
  hq2: [ "How do I prove a skill?", "Comment prouver une compétence ?", "كيف أُثبت مهارة؟" ],
  hq2a: [ "Days marked with a file icon in your path ask for proof: a link, a photo, a short note with a result.", "Dans votre parcours, les jours marqués d’une icône de fichier demandent une preuve : un lien, une photo, une courte note avec un résultat.", "الأيام المميّزة بأيقونة ملف في مسارك تطلب إثباتاً: رابطاً أو صورة أو ملاحظة قصيرة تتضمّن نتيجة." ],
  hq3: [ "Can I change my goal?", "Puis-je changer d’objectif ?", "هل يمكنني تغيير هدفي؟" ],
  hq3a: [ "Yes, from Opportunities. Your skills and proof stay; only the path changes.", "Oui, depuis Opportunités. Vos compétences et vos preuves restent ; seul le parcours change.", "نعم، من صفحة الفرص. تبقى مهاراتك وإثباتاتك، ويتغيّر المسار فقط." ],
  hq4: [ "Who can see my passport?", "Qui peut voir mon passeport ?", "من يستطيع رؤية جوازي؟" ],
  hq4a: [ "Only you, unless you turn on a public link or share with your institution in Passport → Share.", "Personne d’autre que vous, sauf si vous activez un lien public ou partagez avec votre établissement dans Passeport → Partager.", "أنت وحدك، إلا إذا فعّلت رابطاً عاماً أو شاركته مع مؤسستك من الجواز ← المشاركة." ],
  hq5: [ "What if a suggestion is wrong?", "Et si une suggestion est fausse ?", "ماذا لو كان الاقتراح خاطئاً؟" ],
  hq5a: [ "Leave it out. You can restore it later from your passport.", "Écartez-la. Vous pourrez la restaurer plus tard depuis votre passeport.", "استبعده، ويمكنك استرجاعه لاحقاً من جوازك." ],
  hq6: [ "How do I delete my data?", "Comment supprimer mes données ?", "كيف أحذف بياناتي؟" ],
  hq6a: [ "Settings → Your data → Start over. Everything on this device is erased.", "Paramètres → Vos données → Tout recommencer. Tout est effacé de cet appareil.", "الإعدادات ← بياناتك ← البدء من جديد. يُحذف كل شيء من هذا الجهاز." ],
  fb_t: [ "Write to us", "Écrivez-nous", "شاركنا ملاحظتك" ],
  fb_d: [ "A bug, an idea, a wrong suggestion. The team reads every message.", "Un bogue, une idée, une suggestion erronée. L’équipe lit chaque message.", "خلل، أو فكرة، أو اقتراح خاطئ. يقرأ الفريق كل رسالة." ],
  fb_ph: [ "What happened?", "Que s’est-il passé ?", "ماذا حدث؟" ],
  fb_send: [ "Send", "Envoyer", "إرسال" ],
  fb_ok: [ "Thank you. Sent to the SKILMA team", "Merci. Message envoyé à l’équipe SKILMA", "شكراً، أُرسلت إلى فريق سكيلما" ],
  kb_t: [ "Keyboard", "Clavier", "لوحة المفاتيح" ],
  kb_1: [ "Search anything", "Tout rechercher", "البحث في كل شيء" ],
  kb_2: [ "Analyse your story", "Analyser votre récit", "تحليل قصتك" ],
  kb_3: [ "Close a window", "Fermer une fenêtre", "إغلاق نافذة" ],
  set_sub: [ "Your profile, your privacy, your data.", "Votre profil, votre confidentialité, vos données.", "ملفك، وخصوصيتك، وبياناتك." ],
  set_prof: [ "Profile", "Profil", "الملف الشخصي" ],
  set_notif: [ "Notifications", "Notifications", "الإشعارات" ],
  set_acc: [ "Accessibility", "Accessibilité", "إمكانية الوصول" ],
  set_data: [ "Your data", "Vos données", "بياناتك" ],
  sn_week: [ "Weekly summary", "Résumé hebdomadaire", "ملخص أسبوعي" ],
  sn_week_d: [ "Days completed on your path.", "Jours accomplis dans votre parcours.", "الأيام المنجزة في مسارك." ],
  sn_ver: [ "Verification updates", "Suivi des vérifications", "تحديثات التوثيق" ],
  sn_ver_d: [ "When your institution replies.", "Quand votre établissement répond.", "حين تردّ مؤسستك." ],
  sn_opps: [ "New matches", "Nouvelles correspondances", "فرص متوافقة جديدة" ],
  sn_opps_d: [ "Roles where you have every core skill.", "Postes où vous avez toutes les compétences clés.", "وظائف تملك كل مهاراتها الأساسية." ],
  sd_export: [ "Download my data", "Télécharger mes données", "تحميل بياناتي" ],
  sd_export_d: [ "Everything in your passport, as a JSON file.", "Tout votre passeport, en fichier JSON.", "كل ما في جوازك، في ملف JSON." ],
  sd_ok: [ "Data downloaded", "Données téléchargées", "تمّ تحميل البيانات" ],
  u_center: [ "Career centre", "Service carrière", "مركز التوجيه المهني" ],
  ug_stu: [ "Students", "Étudiants", "الطلبة" ],
  ug_act: [ "Act", "Agir", "التدخّل" ],
  u_nav_stu: [ "Students", "Étudiants", "الطلبة" ],
  u_nav_sk: [ "Skills", "Compétences", "المهارات" ],
  u_nav_op: [ "Opportunities", "Opportunités", "الفرص" ],
  u_k2d: [ "confirmed by students", "confirmées par les étudiants", "أكّدها الطلبة" ],
  ur_dl_short: [ "Export", "Exporter", "تصدير" ],
  ur_upd: [ "updated today", "mis à jour aujourd’hui", "محدَّث اليوم" ],
  u_see_sk: [ "Skills by programme", "Compétences par filière", "المهارات حسب الشعبة" ],
  u_stu_d: [ "Students who chose to share their passport with you.", "Les étudiants qui ont choisi de partager leur passeport avec vous.", "الطلبة الذين اختاروا مشاركة جوازهم معكم." ],
  us_tab_sh: [ "Shared passports", "Passeports partagés", "الجوازات المُشارَكة" ],
  us_tab_pr: [ "Programmes", "Filières", "الشُّعب" ],
  u_find: [ "Find a student", "Trouver un étudiant", "ابحث عن طالب" ],
  u_none: [ "No one matches these filters.", "Personne ne correspond à ces filtres.", "لا أحد يطابق هذه الشروط." ],
  u_th_n2: [ "Student", "Étudiant", "الطالب" ],
  u_th_goal: [ "Goal", "Objectif", "الهدف" ],
  u_th_last: [ "Last active", "Dernière activité", "آخر نشاط" ],
  u_new_share: [ "New", "Nouveau", "جديد" ],
  u_stu_priv: [ "Active students sharing their passport: {n} of {m}. The others appear only in group figures.", "Étudiants actifs partageant leur passeport : {n} sur {m}. Les autres n’apparaissent que dans les chiffres de groupe.", "يشارك {n} من الطلبة النشطين البالغ عددهم {m} جوازاتهم معكم، ولا يظهر الباقون إلا في أرقام المجموعات." ],
  u_dr_act: [ "Support", "Accompagner", "الدعم" ],
  u_dr_ws: [ "Suggest a workshop", "Proposer un atelier", "اقتراح ورشة" ],
  u_dr_meet: [ "Invite to a meeting", "Inviter à un rendez-vous", "دعوة إلى لقاء" ],
  u_dr_priv: [ "You see what the student shared. Their stories stay private.", "Vous voyez ce que l’étudiant a partagé. Ses récits restent privés.", "ترون ما شاركه الطالب، وتبقى قصصه خاصة." ],
  u_nudge_ok: [ "Workshop suggestion sent", "Suggestion d’atelier envoyée", "أُرسل اقتراح الورشة" ],
  u_meet_ok: [ "Invitation sent", "Invitation envoyée", "أُرسلت الدعوة" ],
  u_sk_d: [ "What your students can show, next to what employers ask for.", "Ce que vos étudiants peuvent montrer, face à ce que demandent les employeurs.", "ما يستطيع طلبتكم إظهاره، مقابل ما يطلبه أصحاب العمل." ],
  u_heat: [ "Skills by programme", "Compétences par filière", "المهارات حسب الشعبة" ],
  u_heat_k: [ "% of students with the skill", "% d’étudiants ayant la compétence", "نسبة الطلبة الذين يملكون المهارة (%)" ],
  u_heat_hint: [ "Select a cell to read it.", "Sélectionnez une case pour la lire.", "اختر خانة لقراءتها." ],
  u_heat_sel: [ "{n}% of {p} students have confirmed {x}.", "{n} % des étudiants en {p} ont confirmé {x}.", "{n}% من طلبة {p} أكّدوا مهارة {x}." ],
  u_dvs: [ "Demand vs supply", "Demande et offre", "الطلب مقابل العرض" ],
  u_dem: [ "Asked by employers", "Demandée par les employeurs", "يطلبها أصحاب العمل" ],
  u_sup: [ "Held by students", "Détenue par les étudiants", "يملكها الطلبة" ],
  u_dvs_d: [ "Demand = share of the {n|one:# open role|other:# open roles} that require the skill. The biggest gaps come first.", "Demande = part des {n|one:# poste ouvert|other:# postes ouverts} qui exigent la compétence. Les plus grands écarts en premier.", "الطلب = نسبة الوظائف المفتوحة ({n}) التي تتطلب المهارة. أكبر الفجوات أولاً." ],
  u_op_d: [ "The roles your students aim for, and how ready they are.", "Les postes visés par vos étudiants, et leur niveau de préparation.", "الوظائف التي يستهدفها طلبتكم، ومدى جاهزيتهم." ],
  u_th_role: [ "Role", "Poste", "الوظيفة" ],
  u_th_tg: [ "Students aiming for it", "Étudiants qui le visent", "الطلبة المستهدِفون" ],
  u_th_act: [ "Action", "Action", "الإجراء" ],
  u_share_op: [ "Share with students", "Partager avec les étudiants", "مشاركة مع الطلبة" ],
  u_shared_ok: [ "Shared", "Partagé", "تمّت المشاركة" ],
  u_shared_toast: [ "{x} shared with matching students", "{x} partagé avec les étudiants concernés", "تمّت مشاركة {x} مع الطلبة المعنيين" ],
  u_op_note: [ "Shared roles appear in the students’ opportunities with your institution’s name.", "Les postes partagés apparaissent dans les opportunités des étudiants avec le nom de votre établissement.", "تظهر الوظائف المُشارَكة في فرص الطلبة مقرونة باسم مؤسستكم." ],
  u_vr_t: [ "What verifying means", "Ce que signifie vérifier", "معنى التوثيق" ],
  u_vr1: [ "You confirm the experience happened as described.", "Vous confirmez que l’expérience a eu lieu comme décrite.", "تؤكدون أن التجربة حدثت كما وُصفت." ],
  u_vr2: [ "You don’t grade the student’s level.", "Vous ne notez pas le niveau de l’étudiant.", "لا تقيّمون مستوى الطالب." ],
  u_vr3: [ "Your name appears as the signer.", "Votre nom apparaît comme signataire.", "يظهر اسمكم بصفتكم الموقِّع." ],
  us_org: [ "Institution", "Établissement", "المؤسسة" ],
  us_progs: [ "Programmes", "Filières", "الشُّعب" ],
  us_sso: [ "Single sign-on", "Authentification unique", "الدخول الموحّد" ],
  us_sso_on: [ "Connected", "Connecté", "مفعّل" ],
  o_org: [ "SKILMA Operations", "Opérations SKILMA", "عمليات سكيلما" ],
  o_org_sub: [ "Sample environment", "Environnement d’exemple", "بيئة نموذجية" ],
  o_env: [ "Sample environment", "Environnement d’exemple", "بيئة نموذجية" ],
  og_people: [ "People", "Personnes", "الأشخاص" ],
  og_content: [ "Content", "Contenu", "المحتوى" ],
  og_quality: [ "Quality", "Qualité", "الجودة" ],
  o_nav_users: [ "Users", "Utilisateurs", "المستخدمون" ],
  o_nav_skills: [ "Skills taxonomy", "Taxonomie des compétences", "تصنيف المهارات" ],
  o_nav_opps: [ "Opportunities", "Opportunités", "الفرص" ],
  o_nav_quality: [ "AI quality", "Qualité IA", "جودة الذكاء الاصطناعي" ],
  o_nav_set: [ "Settings", "Paramètres", "الإعدادات" ],
  o_attn: [ "Needs attention", "À traiter", "يحتاج إلى متابعة" ],
  o_attn_0: [ "Nothing to handle. All systems normal.", "Rien à traiter. Tous les systèmes fonctionnent normalement.", "لا شيء يستدعي المعالجة. كل الأنظمة تعمل بشكل طبيعي." ],
  o_a_pilot: [ "Pilot request: {x}", "Demande de pilote : {x}", "طلب تجربة نموذجية: {x}" ],
  o_a_flag: [ "{x} rejected {p}% of the time", "{x} rejetée dans {p} % des cas", "رُفضت مهارة {x} في {p}% من الحالات" ],
  o_a_flag_d: [ "{n|one:# decision|other:# decisions} on this device. Check the hint words.", "{n|one:# décision|other:# décisions} sur cet appareil. Vérifiez les mots-clés.", "{n|zero:لا قرارات|one:قرار واحد|two:قراران|few:# قرارات|many:# قراراً|other:# قرار} على هذا الجهاز. راجع الكلمات المفتاحية." ],
  o_a_fail: [ "{n|one:# AI run failed|other:# AI runs failed}", "{n|one:# exécution IA a échoué|other:# exécutions IA ont échoué}", "{n|zero:لم تفشل أي عملية للذكاء الاصطناعي|one:فشلت عملية واحدة للذكاء الاصطناعي|two:فشلت عمليتان للذكاء الاصطناعي|few:فشلت # عمليات للذكاء الاصطناعي|many:فشلت # عملية للذكاء الاصطناعي|other:فشلت # عملية للذكاء الاصطناعي}" ],
  o_a_fail_d: [ "The built-in reader took over for students.", "Le lecteur intégré a pris le relais pour les étudiants.", "حصل الطلبة على نتائج المحلّل المدمج بدلاً منها." ],
  o_a_fb: [ "Student feedback", "Retour d’étudiant", "ملاحظة من طالب" ],
  o_review: [ "Review", "Examiner", "مراجعة" ],
  o_done: [ "Handled", "Traité", "تمّت المعالجة" ],
  o_platform: [ "Platform", "Plateforme", "المنصة" ],
  o_k_inst: [ "Institutions", "Établissements", "المؤسسات" ],
  o_k_inst_d: [ "{n} pending", "{n} en attente", "{n} قيد الانتظار" ],
  o_k_stu: [ "Students", "Étudiants", "الطلبة" ],
  o_k_stu_d: [ "across institutions", "tous établissements confondus", "في كل المؤسسات" ],
  o_k_opps: [ "Published roles", "Postes publiés", "الوظائف المنشورة" ],
  o_k_opps_d: [ "visible to students", "visibles par les étudiants", "مرئية للطلبة" ],
  o_runs_chart: [ "AI runs per month", "Exécutions IA par mois", "عمليات الذكاء الاصطناعي شهرياً" ],
  o_runs_chart_d: [ "all institutions", "tous établissements", "كل المؤسسات" ],
  o_live: [ "This device", "Cet appareil", "هذا الجهاز" ],
  o_live_tag: [ "live", "en direct", "مباشر" ],
  o_maint_on: [ "Maintenance banner on", "Bannière de maintenance activée", "لافتة الصيانة مفعّلة" ],
  o_maint_off: [ "Maintenance banner off", "Bannière de maintenance désactivée", "لافتة الصيانة معطّلة" ],
  o_plan_pilot: [ "Pilot licence", "Licence pilote", "ترخيص التجربة النموذجية" ],
  o_plan_setup: [ "Onboarding", "Intégration", "قيد الإدماج" ],
  o_plan_req: [ "Request from the website", "Demande depuis le site", "طلب من الموقع" ],
  o_approve: [ "Approve", "Approuver", "قبول" ],
  o_decline: [ "Decline", "Refuser", "رفض" ],
  o_activate: [ "Activate", "Activer", "تفعيل" ],
  o_pause: [ "Pause", "Suspendre", "إيقاف مؤقت" ],
  o_resume: [ "Resume", "Reprendre", "استئناف" ],
  o_reopen: [ "Reopen", "Rouvrir", "إعادة فتح" ],
  oi_since: [ "Since", "Depuis", "منذ" ],
  oi_contact: [ "Contact", "Contact", "جهة الاتصال" ],
  oi_onb: [ "Onboarding", "Intégration", "الإدماج" ],
  oi_s1: [ "Request reviewed", "Demande examinée", "مراجعة الطلب" ],
  oi_s2: [ "Console set up, programmes chosen", "Console configurée, filières choisies", "إعداد اللوحة واختيار الشُّعب" ],
  oi_s3: [ "Students invited, account active", "Étudiants invités, compte actif", "دعوة الطلبة وبدء نشاطهم" ],
  oi_open: [ "Open their console", "Ouvrir leur console", "افتح لوحتها" ],
  oi_open_d: [ "See exactly what this institution sees.", "Voir exactement ce que voit cet établissement.", "اطّلع على ما تراه هذه المؤسسة بالضبط." ],
  ost_pending: [ "Pending", "En attente", "قيد الانتظار" ],
  ost_active: [ "Active", "Actif", "نشط" ],
  ost_setup: [ "Setting up", "En configuration", "قيد الإعداد" ],
  ost_paused: [ "Paused", "Suspendu", "موقوف" ],
  ost_declined: [ "Declined", "Refusé", "مرفوض" ],
  ost_invited: [ "Invited", "Invité", "مدعوّ" ],
  ost_off: [ "Deactivated", "Désactivé", "معطَّل" ],
  ost_pub: [ "Published", "Publié", "منشور" ],
  ost_ok: [ "OK", "OK", "ناجح" ],
  ou_d: [ "Operators and institution staff with access to SKILMA consoles.", "Opérateurs et personnel des établissements ayant accès aux consoles SKILMA.", "المشغّلون وموظفو المؤسسات الذين يملكون صلاحية الوصول إلى لوحات سكيلما." ],
  ou_invite: [ "Invite someone", "Inviter quelqu’un", "ادعُ شخصاً" ],
  ou_inv_d: [ "They’ll receive a sign-in link. Access can be removed at any time.", "La personne recevra un lien de connexion. L’accès peut être retiré à tout moment.", "سيتلقى رابطاً لتسجيل الدخول، ويمكن سحب الصلاحية في أي وقت." ],
  ou_name: [ "Person", "Personne", "الشخص" ],
  ou_role: [ "Role", "Rôle", "الدور" ],
  ou_org: [ "Organisation", "Organisation", "الجهة" ],
  ou_invited: [ "Invitation sent", "Invitation envoyée", "أُرسلت الدعوة" ],
  ou_send: [ "Send invitation", "Envoyer l’invitation", "أرسل الدعوة" ],
  ou_sent: [ "Invitation sent", "Invitation envoyée", "أُرسلت الدعوة" ],
  ou_note: [ "Operators sign in with a security key. Institution staff use their institution account.", "Les opérateurs se connectent avec une clé de sécurité. Le personnel des établissements utilise son compte d’établissement.", "يدخل المشغّلون بمفتاح أمان، ويستعمل موظفو المؤسسات حسابهم الجامعي." ],
  rl_op: [ "Operator", "Opérateur", "مشغّل" ],
  rl_rev: [ "AI quality reviewer", "Relecteur qualité IA", "مراجِع جودة الذكاء الاصطناعي" ],
  rl_iadm: [ "Institution administrator", "Administrateur d’établissement", "مسؤول مؤسسة" ],
  rl_adv: [ "Career advisor", "Conseiller carrière", "مستشار توجيه" ],
  os_d: [ "The skills SKILMA can find. Turning one off removes it from every new analysis.", "Les compétences que SKILMA peut trouver. En désactiver une la retire de toute nouvelle analyse.", "المهارات التي تستطيع سكيلما اكتشافها. إيقاف إحداها يُخرجها من كل تحليل جديد." ],
  os_find: [ "Find a skill", "Trouver une compétence", "ابحث عن مهارة" ],
  os_count: [ "{n|one:# skill|other:# skills}", "{n|one:# compétence|other:# compétences}", "{n|zero:لا مهارات|one:مهارة واحدة|two:مهارتان|few:# مهارات|many:# مهارة|other:# مهارة}" ],
  os_skill: [ "Skill", "Compétence", "المهارة" ],
  os_cat: [ "Category", "Catégorie", "الفئة" ],
  os_opps: [ "Roles", "Postes", "الوظائف" ],
  os_conf: [ "Confirmed by students", "Confirmée par les étudiants", "أكّدها الطلبة" ],
  os_on: [ "Active", "Active", "مفعّلة" ],
  os_rare: [ "Rare", "Rare", "نادرة" ],
  os_note: [ "Confirmation rate comes from real yes/no decisions on this device.", "Le taux de confirmation provient de décisions oui/non réelles sur cet appareil.", "تُستمدّ نسبة التأكيد من قرارات «نعم/لا» فعلية على هذا الجهاز." ],
  os_on_t: [ "{x} is active again", "{x} est de nouveau active", "أُعيد تفعيل مهارة {x}" ],
  os_off_t: [ "{x} turned off", "{x} désactivée", "أُوقفت مهارة {x}" ],
  c_com: [ "Commercial", "Commercial", "التجارة" ],
  c_dig: [ "Digital", "Numérique", "الرقمنة" ],
  c_org: [ "Organisation", "Organisation", "التنظيم" ],
  c_ppl: [ "People", "Relationnel", "العمل مع الآخرين" ],
  c_lng: [ "Languages", "Langues", "اللغات" ],
  c_ana: [ "Analysis", "Analyse", "التحليل" ],
  oo_d: [ "Every role students can see. Pausing one hides it from students immediately.", "Tous les postes visibles par les étudiants. En suspendre un le masque immédiatement.", "كل الوظائف التي يراها الطلبة. إيقاف إحداها يُخفيها عنهم فوراً." ],
  oo_type: [ "Type", "Type", "النوع" ],
  oo_req: [ "Skills", "Compétences", "المهارات" ],
  oo_core: [ "{n} core", "{n|one:# clé|other:# clés}", "{n|zero:لا مهارات أساسية|one:مهارة أساسية واحدة|two:مهارتان أساسيتان|few:# مهارات أساسية|many:# مهارة أساسية|other:# مهارة أساسية}" ],
  oo_note: [ "Employers shown are examples.", "Les employeurs présentés sont des exemples.", "جهات العمل المعروضة أمثلة." ],
  oo_on_t: [ "Role published", "Poste publié", "نُشرت الوظيفة" ],
  oo_off_t: [ "Role hidden from students", "Poste masqué pour les étudiants", "أُخفيت الوظيفة عن الطلبة" ],
  oq_d: [ "Compare the AI with the built-in reader on any story, and watch every run.", "Comparez l’IA au lecteur intégré sur n’importe quel récit et suivez chaque exécution.", "قارن الذكاء الاصطناعي بالمحلّل المدمج على أي قصة، وتابع كل عملية تشغيل." ],
  oq_bench: [ "Test bench", "Banc d’essai", "منصة الاختبار" ],
  oq_bench_d: [ "Both readers, same text.", "Les deux lecteurs, même texte.", "المحرّكان على النص نفسه." ],
  oq_langs: [ "Darija, Arabic, French or English", "Darija, arabe, français ou anglais", "الدارجة أو العربية أو الفرنسية أو الإنجليزية" ],
  oq_run: [ "Run both", "Lancer les deux", "شغّل الاثنين" ],
  oq_running: [ "Running…", "En cours…", "جارٍ التشغيل…" ],
  oq_noai: [ "AI is not available here, or the engine is set to built-in only.", "L’IA n’est pas disponible ici, ou le moteur est réglé sur le lecteur intégré.", "الذكاء الاصطناعي غير متاح هنا، أو المحرّك مضبوط على المحلّل المدمج فقط." ],
  oq_agree: [ "agreement", "concordance", "نسبة التطابق" ],
  oq_agree_d: [ "Skills found by both, out of all skills found.", "Compétences trouvées par les deux, sur toutes celles trouvées.", "المهارات التي وجدها المحرّكان معاً، من مجموع المهارات المكتشفة." ],
  oq_flags: [ "Skills students reject", "Compétences rejetées par les étudiants", "مهارات يرفضها الطلبة" ],
  oq_flags_0: [ "No skill is rejected often enough to flag.", "Aucune compétence n’est assez rejetée pour être signalée.", "لا مهارة تُرفض بما يكفي لإطلاق تنبيه." ],
  oq_flags_d: [ "Flagged at 40% rejection or more.", "Signalée à partir de 40 % de rejets.", "يُطلَق التنبيه عند نسبة رفض 40% فأكثر." ],
  oq_prompts: [ "Prompt versions", "Versions des invites", "إصدارات التعليمات" ],
  k_bench: [ "Test bench", "Banc d’essai", "منصة الاختبار" ],
  ost_d: [ "Settings apply to every product immediately.", "Les paramètres s’appliquent immédiatement à tous les produits.", "تُطبَّق الإعدادات على كل المنتجات فوراً." ],
  oset_ai: [ "AI engine", "Moteur IA", "محرك الذكاء الاصطناعي" ],
  oset_engine: [ "Engine for students", "Moteur pour les étudiants", "المحرك المستعمل للطلبة" ],
  oset_engine_d: [ "“Built-in only” switches every student to the built-in reader, e.g. during an incident.", "« Lecteur intégré seul » bascule tous les étudiants sur le lecteur intégré, par exemple en cas d’incident.", "خيار «المحلّل المدمج فقط» ينقل كل الطلبة إلى المحلّل القائم على القواعد، مثلاً عند وقوع عطل." ],
  oset_e_ai: [ "AI with fallback", "IA avec repli", "ذكاء اصطناعي مع محرّك احتياطي" ],
  oset_e_rules: [ "Built-in only", "Lecteur intégré seul", "المحلّل المدمج فقط" ],
  oset_avail: [ "The model is reachable from this device.", "Le modèle est joignable depuis cet appareil.", "النموذج متاح من هذا الجهاز." ],
  oset_unavail: [ "The model is not reachable from this device.", "Le modèle n’est pas joignable depuis cet appareil.", "النموذج غير متاح من هذا الجهاز." ],
  oset_plat: [ "Platform", "Plateforme", "المنصة" ],
  oset_maint: [ "Maintenance banner", "Bannière de maintenance", "لافتة الصيانة" ],
  oset_maint_d: [ "Shown on the website, the student app and institution consoles.", "Affichée sur le site, l’application étudiant et les consoles des établissements.", "تظهر في الموقع وتطبيق الطالب ولوحات المؤسسات." ],
  oset_priv: [ "Privacy", "Confidentialité", "الخصوصية" ],
  oset_priv_d: [ "Default smallest group shown to institutions.", "Plus petit groupe affiché aux établissements, par défaut.", "أصغر مجموعة تظهر للمؤسسات افتراضياً." ],
  oset_ret: [ "Data retention", "Conservation des données", "مدة الاحتفاظ بالبيانات" ],
  oset_ret_d: [ "Inactive accounts are deleted after this period.", "Les comptes inactifs sont supprimés après cette durée.", "تُحذف الحسابات غير النشطة بعد هذه المدة." ],
  oset_danger: [ "Demo data", "Données de démo", "البيانات التجريبية" ],
  oset_reset: [ "Reset everything", "Tout réinitialiser", "إعادة تعيين كل شيء" ],
  oset_reset_d: [ "Clears all four products on this device.", "Efface les quatre produits sur cet appareil.", "يمسح بيانات المنتجات الأربعة على هذا الجهاز." ],
  oset_reset_q: [ "Erase every student, institution and operations change on this device?", "Effacer toutes les modifications étudiants, établissements et opérations sur cet appareil ?", "مسح كل تغييرات الطلبة والمؤسسات والعمليات على هذا الجهاز؟" ],
  oset_reset_ok: [ "Demo reset", "Démo réinitialisée", "أُعيد تعيين النسخة التجريبية" ],
  who_ops: [ "Operations", "Opérations", "العمليات" ],
  who_site: [ "Website", "Site", "الموقع" ],
  audit_signin: [ "Signed in", "Connexion", "تسجيل الدخول" ],
  audit_signout: [ "Signed out", "Déconnexion", "تسجيل الخروج" ],
  audit_pilot: [ "Pilot requested: {x}", "Pilote demandé : {x}", "طلب تجربة نموذجية: {x}" ],
  audit_fb: [ "Feedback sent", "Retour envoyé", "إرسال ملاحظة" ],
  audit_fb_done: [ "Feedback handled", "Retour traité", "معالجة ملاحظة" ],
  audit_inst: [ "{x} → {s}", "{x} → {s}", "{x} ← {s}" ],
  audit_invite: [ "Invited {x}", "Invitation : {x}", "دعوة {x}" ],
  audit_user_on: [ "Access restored: {x}", "Accès rétabli : {x}", "استعادة صلاحية: {x}" ],
  audit_user_off: [ "Access removed: {x}", "Accès retiré : {x}", "سحب صلاحية: {x}" ],
  audit_sk_on: [ "Skill turned on: {x}", "Compétence activée : {x}", "تفعيل مهارة: {x}" ],
  audit_sk_off: [ "Skill turned off: {x}", "Compétence désactivée : {x}", "إيقاف مهارة: {x}" ],
  audit_op_on: [ "Role published: {x}", "Poste publié : {x}", "نشر وظيفة: {x}" ],
  audit_op_off: [ "Role paused: {x}", "Poste suspendu : {x}", "إيقاف وظيفة: {x}" ],
  audit_bench: [ "Test bench run", "Banc d’essai lancé", "تشغيل منصة الاختبار" ],
  audit_engine: [ "Engine set to {x}", "Moteur réglé sur {x}", "ضبط المحرك على {x}" ],
  audit_maint_on: [ "Maintenance banner on", "Bannière de maintenance activée", "تفعيل لافتة الصيانة" ],
  audit_maint_off: [ "Maintenance banner off", "Bannière de maintenance désactivée", "إيقاف لافتة الصيانة" ],
  audit_reset: [ "Demo data reset", "Données de démo réinitialisées", "إعادة تعيين البيانات التجريبية" ],
  cm_ideas: [ "Need a starting point?", "Besoin d’un point de départ ?", "تبحث عن فكرة للبدء؟" ],
  pt_demo2: [ "Demo version", "Version de démonstration", "نسخة تجريبية" ],
  pt_now: [ "You’re viewing:", "Vous êtes sur :", "أنت الآن في:" ],
  pt_switch: [ "Switch product", "Changer de produit", "بدّل المنتج" ],
  pt_panel_t: [ "SKILMA is four connected products", "SKILMA réunit quatre produits reliés", "تتكوّن سكيلما من أربعة منتجات مترابطة" ],
  pt_site_d: [ "The public website: what SKILMA is and who it is for.", "Le site public : ce qu’est SKILMA et à qui il s’adresse.", "الموقع العام: ما هي سكيلما، ولمن صُمّمت." ],
  pt_student_d: [ "The student app: passport, opportunities, 30-day path.", "L’application étudiant : passeport, opportunités, parcours de 30 jours.", "تطبيق الطالب: الجواز، والفرص، ومسار 30 يوماً." ],
  pt_uni_d: [ "For career centres: cohorts, verification, reports.", "Pour les services carrière : cohortes, vérification, rapports.", "لمراكز التوجيه المهني: الأفواج، والتوثيق، والتقارير." ],
  pt_ops_d: [ "For the SKILMA team: institutions, content, AI quality.", "Pour l’équipe SKILMA : établissements, contenu, qualité IA.", "لفريق سكيلما: المؤسسات، والمحتوى، وجودة الذكاء الاصطناعي." ],
  pt_here: [ "You’re here", "Vous êtes ici", "أنت هنا" ],
  pt_open: [ "Open", "Ouvrir", "افتح" ],
  h2_kicker: [ "For students and young graduates in Morocco", "Pour les étudiants et jeunes diplômés au Maroc", "لطلبة المغرب وخرّيجيه الجدد" ],
  h2_h1: [ "Turn what you have lived into proof employers can read.", "Transformez votre vécu en preuves lisibles par les employeurs.", "حوّل ما عشته إلى فرصة عمل." ],
  h2_sub: [ "Write one experience in your own words. SKILMA finds your skills, shows the roles that fit you and prepares you for them step by step.", "Décrivez une expérience avec vos mots. SKILMA repère vos compétences, vous montre les postes qui vous correspondent et vous y prépare pas à pas.", "اكتب تجربة واحدة بكلماتك، فتكتشف سكيلما مهاراتك، وتريك الوظائف التي تناسبك، وتجهّزك لها خطوة بخطوة." ],
  h2_cta2: [ "See an example", "Voir un exemple", "شاهد مثالاً" ],
  h2_f1: [ "10 minutes", "10 minutes", "10 دقائق" ],
  h2_f2: [ "Any language, even Darija", "Toutes les langues, même la darija", "بأي لغة، حتى الدارجة" ],
  h2_f3: [ "No CV needed", "Pas besoin de CV", "دون حاجة إلى سيرة ذاتية" ],
  lv_label: [ "Animation: a student’s sentence becomes skills in a passport, then a role match.", "Animation : la phrase d’une étudiante devient des compétences dans un passeport, puis une adéquation avec un poste.", "رسم متحرك: جملة طالب تتحوّل إلى مهارات في جواز، ثم إلى وظيفة مناسبة." ],
  lv_a: [ "Your experience", "Votre expérience", "تجربتك" ],
  lv_name: [ "Sara", "Sara", "سارة" ],
  lv_skills: [ "skills", "compétences", "مهارات" ],
  lv_match: [ "match", "correspondance", "توافق" ],
  lv_ready: [ "Path ready: 30 days", "Parcours prêt : 30 jours", "مسارك جاهز: 30 يوماً" ],
  lv_gap: [ "To learn", "À apprendre", "للتعلّم" ],
  lv_s1: [ "Tell", "Racontez", "احكِ" ],
  lv_s2: [ "Discover", "Découvrez", "اكتشف" ],
  lv_s3: [ "Get ready", "Préparez-vous", "استعدّ" ],
  lv_c1: [ "A final-year Economics student describes what she does.", "Une étudiante en dernière année d’économie décrit ce qu’elle fait.", "طالبة في سنة التخرج بشعبة الاقتصاد تصف ما تقوم به." ],
  lv_c2: [ "Her Skills Passport maps what she can really do.", "Son passeport de compétences montre ce qu’elle sait vraiment faire.", "يرسم جواز المهارات ما تستطيع فعله حقاً." ],
  lv_c3: [ "She is two skills away from Junior Business Analyst. A 30-day path closes the gap.", "Il lui manque deux compétences pour le poste d’analyste métier junior. Un parcours de 30 jours comble l’écart.", "تفصلها مهارتان عن وظيفة محللة أعمال مبتدئة، ومسار 30 يوماً يسدّ الفجوة." ],
  lv_pause: [ "Pause animation", "Mettre en pause", "إيقاف الحركة" ],
  lv_play: [ "Play animation", "Lancer l’animation", "تشغيل الحركة" ],
  st_k: [ "How it works", "Fonctionnement", "طريقة العمل" ],
  st_h: [ "Three steps. About ten minutes.", "Trois étapes. Une dizaine de minutes.", "ثلاث خطوات، في نحو عشر دقائق." ],
  st1t: [ "Tell one experience", "Racontez une expérience", "احكِ تجربة" ],
  st1d: [ "A job, volunteering, the family shop, a club: anything you have actually done.", "Un emploi, du bénévolat, la boutique familiale, un club : tout ce que vous avez réellement fait.", "عمل، أو تطوّع، أو تجارة العائلة، أو نادٍ: أي شيء قمت به فعلاً." ],
  st2t: [ "Confirm your skills", "Confirmez vos compétences", "أكّد مهاراتك" ],
  st2d: [ "SKILMA suggests each skill with the words that prove it. You keep only what is true.", "SKILMA suggère chaque compétence avec les mots qui la prouvent. Vous ne gardez que ce qui est vrai.", "تقترح سكيلما كل مهارة مع الكلمات التي تُثبتها، وتحتفظ أنت بما هو صحيح فقط." ],
  st3t: [ "Aim for a role", "Visez un poste", "استهدف وظيفة" ],
  st3d: [ "See the roles that fit you, what is missing, and a 30-day path to get ready.", "Voyez les postes qui vous correspondent, ce qui manque, et un parcours de 30 jours pour vous préparer.", "اطّلع على الوظائف التي تناسبك، وما ينقصك، ومسار 30 يوماً لتبلغ الجاهزية." ],
  ex2_k: [ "Illustrative examples", "Exemples illustratifs", "أمثلة توضيحية" ],
  ex2_h: [ "Ordinary sentences. Real skills.", "Des phrases ordinaires. De vraies compétences.", "جمل عادية، ومهارات حقيقية." ],
  ex2_sub: [ "This is how SKILMA reads everyday experiences.", "Voici comment SKILMA lit les expériences du quotidien.", "هكذا تقرأ سكيلما التجارب اليومية." ],
  fg_k: [ "What you get", "Ce que vous obtenez", "ما تحصل عليه" ],
  fg_h: [ "Everything you need to prepare for your first job, in one place.", "Tout ce qu’il faut pour préparer votre premier emploi, au même endroit.", "كل ما تحتاجه لوظيفتك الأولى، في مكان واحد." ],
  fg1t: [ "A Skills Passport", "Un passeport de compétences", "جواز مهارات" ],
  fg1d: [ "Every skill shows where it comes from. Share it with one link.", "Chaque compétence indique sa source. Partagez-le avec un lien.", "تعرض كل مهارة مصدرها، ويمكنك مشاركة الجواز برابط واحد." ],
  fg2t: [ "Roles that fit you", "Des postes qui vous correspondent", "وظائف تناسبك" ],
  fg2d: [ "Jobs and internships, ranked by how well you fit.", "Emplois et stages, classés selon votre adéquation.", "وظائف وتداريب مرتّبة حسب توافقك معها." ],
  fg3t: [ "A 30-day path", "Un parcours de 30 jours", "مسار 30 يوماً" ],
  fg3d: [ "One small task a day. Each piece of evidence completes your checklist.", "Une petite tâche par jour. Chaque preuve complète votre liste.", "مهمة صغيرة كل يوم، وكل دليل يُكمل قائمتك." ],
  fg4t: [ "Interview practice", "Entraînement à l’entretien", "تدريب على المقابلة" ],
  fg4d: [ "Interview questions, instant feedback, one clear tip each time.", "Des questions d’entretien, des retours immédiats, un conseil clair à chaque fois.", "أسئلة واقعية، وملاحظات فورية، ونصيحة واضحة في كل مرة." ],
  iv_q_sample: [ "Why should we choose you over another candidate?", "Pourquoi vous choisir plutôt qu’un autre candidat ?", "لماذا نختارك بدل مرشح آخر؟" ],
  fg_ready: [ "ready", "préparation", "الجاهزية" ],
  ib_k: [ "For institutions and career centres", "Pour les établissements et les services carrière", "للجامعات ومراكز التوجيه المهني" ],
  ib_h: [ "Know what your students can prove — and act on it.", "Sachez ce que vos étudiants peuvent prouver, et agissez.", "اعرفوا ما يستطيع طلبتكم إثباته، وتدخّلوا بناءً عليه." ],
  ib_d: [ "A console that starts each week with what needs attention, built on consented, group-level evidence.", "Une console qui ouvre chaque semaine sur ce qui demande votre attention, à partir de preuves agrégées et consenties.", "لوحة تبدأ كل أسبوع بما يحتاج إلى متابعة، قائمة على أدلة مجمَّعة بموافقة أصحابها." ],
  tr2_k: [ "Your data, your decision", "Vos données, votre décision", "بياناتك، قرارك" ],
  tour_next: [ "Next", "Suivant", "التالي" ],
  tour_done: [ "Got it", "Compris", "فهمت" ],
  tour_skip: [ "Skip tour", "Passer la visite", "تخطَّ الجولة" ],
  tour_of: [ "{a} of {b}", "{a} sur {b}", "{a} من {b}" ],
  tour_take: [ "Take the tour", "Faire la visite", "ابدأ الجولة" ],
  ts1t: [ "Your next step", "Votre prochaine étape", "خطوتك التالية" ],
  ts1d: [ "One small task at a time. Start here every day.", "Une petite tâche à la fois. Commencez ici chaque jour.", "مهمة صغيرة في كل مرة. ابدأ من هنا كل يوم." ],
  ts2t: [ "Your goal and checklist", "Votre objectif et votre liste", "هدفك وقائمتك" ],
  ts2d: [ "Each step is explicit: confirm the skills, add evidence, practise one interview, publish your project.", "Chaque étape est explicite : confirmer les compétences, ajouter des preuves, faire un entretien blanc, publier votre projet.", "كل خطوة واضحة: أكّد المهارات، وأضف الأدلة، وتدرّب على مقابلة، وانشر مشروعك." ],
  ts3t: [ "Your passport", "Votre passeport", "جوازك" ],
  ts3d: [ "Every confirmed skill, with its source. Share it when you are ready.", "Toutes vos compétences confirmées, avec leur source. Partagez-le le moment venu.", "كل مهاراتك المؤكَّدة بمصادرها. شارك جوازك متى اكتملت جاهزيتك." ],
  ts4t: [ "Ask SKILMA", "Interroger SKILMA", "اسأل سكيلما" ],
  ts4d: [ "Stuck on a task? Ask here, in any language.", "Une tâche vous bloque ? Posez votre question ici, dans votre langue.", "هل توقفت عند مهمة؟ اسأل هنا، بأي لغة." ],
  tu1t: [ "What needs attention", "Ce qui demande votre attention", "ما يحتاج إلى متابعة" ],
  tu1d: [ "Each week opens with the cohorts to act on, the evidence and the expected outcome.", "Chaque semaine s’ouvre sur les cohortes à suivre, les constats et le résultat attendu.", "يبدأ كل أسبوع بالفئات التي تحتاج تدخّلاً، والأدلة، والنتيجة المتوقعة." ],
  tu2t: [ "Verification requests", "Demandes de vérification", "طلبات التوثيق" ],
  tu2d: [ "Confirm one experience at a time. Your name appears as the signer.", "Confirmez une expérience à la fois. Votre nom apparaît comme signataire.", "وثّقوا تجربة واحدة في كل مرة، ويظهر اسمكم بصفتكم الموقِّع." ],
  tu3t: [ "Students and skills", "Étudiants et compétences", "الطلبة والمهارات" ],
  tu3d: [ "Only students who chose to share appear by name. Everything else is group-level.", "Seuls les étudiants qui ont choisi de partager apparaissent nommément. Le reste est agrégé.", "لا يظهر بالاسم إلا من اختار المشاركة، والباقي أرقام مجمَّعة." ],
  to1t: [ "Needs attention", "À traiter", "يحتاج إلى متابعة" ],
  to1d: [ "Pilot requests, flagged skills, failed AI runs and student feedback land here.", "Demandes de pilote, compétences signalées, échecs IA et retours étudiants arrivent ici.", "تصل هنا طلبات التجربة النموذجية، والمهارات المنبَّه عليها، وعمليات الذكاء الاصطناعي الفاشلة، وملاحظات الطلبة." ],
  to2t: [ "AI quality", "Qualité IA", "جودة الذكاء الاصطناعي" ],
  to2d: [ "Test the AI against the built-in reader on any story, and watch every run.", "Testez l’IA face au lecteur intégré sur n’importe quel récit, et suivez chaque exécution.", "اختبروا الذكاء الاصطناعي مقابل المحلّل المدمج على أي قصة، وتابعوا كل عملية تشغيل." ],
  to3t: [ "Settings that reach everyone", "Des paramètres qui s’appliquent à tous", "إعدادات تصل إلى الجميع" ],
  to3d: [ "Engine, maintenance banner and privacy apply to every product at once.", "Moteur, bannière de maintenance et confidentialité s’appliquent à tous les produits à la fois.", "تُطبَّق إعدادات المحرّك ولافتة الصيانة والخصوصية على كل المنتجات دفعة واحدة." ],
  lang_zgh: [ "ⵜⴰⵎⴰⵣⵉⵖⵜ", "ⵜⴰⵎⴰⵣⵉⵖⵜ", "ⵜⴰⵎⴰⵣⵉⵖⵜ" ],
  zgh_note: [ "Tamazight: first draft, under review by native speakers. Untranslated parts appear in French.", "Tamazight : première version, en relecture par des locuteurs natifs. Les parties non traduites s’affichent en français.", "الأمازيغية: نسخة أولى قيد المراجعة من متحدثين أصليين، وتظهر الأجزاء غير المترجمة بالفرنسية." ],
  h4_h1: [ "Discover what you can do, not just what you studied.", "Découvrez ce que vous savez faire, pas seulement ce que vous avez étudié.", "اكتشف ما تستطيع فعله، لا ما درسته فقط." ],
  h4_sub: [ "Write what you have done. SKILMA finds your skills, the roles that fit, what is missing, and a 30-day path to get there.", "Racontez ce que vous avez fait. SKILMA trouve vos compétences, les postes qui vous correspondent, ce qui vous manque, et un parcours de 30 jours pour y arriver.", "احكِ ما قمت به، وستجد سكيلما مهاراتك والوظائف التي تلائمك وما ينقصك، ومساراً من 30 يوماً للوصول إليها." ],
  h4_f1: [ "About ten minutes", "Environ dix minutes", "نحو عشر دقائق" ],
  h4_f2: [ "Arabic, French or English, and you can write in Darija", "Arabe, français ou anglais, et vous pouvez écrire en darija", "العربية أو الفرنسية أو الإنجليزية، ويمكنك الكتابة بالدارجة" ],
  listen: [ "Listen", "Écouter", "استمع" ],
  lv_pass: [ "Skills Passport", "Passeport de compétences", "جواز المهارات" ],
  lv_away: [ "Two skills away", "À deux compétences", "على بُعد مهارتين" ],
  lv_d30: [ "Day 30: project", "Jour 30 : projet", "اليوم 30: مشروع" ],
  lv_two: [ "2 skills away", "À 2 compétences", "على بُعد مهارتين" ],
  pb_k: [ "The problem", "Le problème", "المشكلة" ],
  pb_h: [ "Students don’t lack potential. They lack clarity.", "Les étudiants ne manquent pas de potentiel. Ils manquent de clarté.", "الطلبة لا تنقصهم القدرات، بل ينقصهم الوضوح." ],
  pb_q1: [ "What are my skills really worth?", "Que valent vraiment mes compétences ?", "ما قيمة مهاراتي الحقيقية؟" ],
  pb_q2: [ "Which roles fit me?", "Quels postes me correspondent ?", "أي وظيفة تناسبني؟" ],
  pb_q3: [ "What exactly am I missing?", "Qu’est-ce qui me manque exactement ?", "ما الذي ينقصني بالضبط؟" ],
  pb_q4: [ "How do I prove I’m ready?", "Comment prouver ma préparation ?", "كيف أُثبت جاهزيتي؟" ],
  pb_stat: [ "of urban youth in Morocco are unemployed", "des jeunes urbains au Maroc sont au chômage", "من شباب المدن في المغرب عاطلون عن العمل" ],
  pb_src: [ "HCP, Labour Force Survey (EMO 2026), Q3 2026. Strict unemployment rate; advanced diploma includes BTS, faculty and grandes écoles.", "HCP, Enquête sur la main-d’œuvre (EMO 2026), T3 2026. Taux de chômage strict ; le diplôme avancé inclut BTS, faculté et grandes écoles.", "المندوبية السامية للتخطيط، البحث حول القوى العاملة (EMO 2026)، الفصل الثالث 2026. معدل البطالة بالمفهوم الضيق؛ وتشمل الشهادات العليا التقني المتخصص والكليات والمدارس العليا." ],
  pb_close: [ "Behind each figure, a student who could have been ready — if someone had shown them the way.", "Derrière chaque chiffre, un étudiant qui aurait pu être prêt, si quelqu’un lui avait montré le chemin.", "وراء كل رقم طالب كان يمكن أن يكون جاهزاً، لو دلّه أحد على الطريق." ],
  en_k: [ "Our engine", "Notre moteur", "محرّكنا" ],
  en_h: [ "One path, five steps.", "Un chemin, cinq étapes.", "مسار واحد، خمس خطوات." ],
  en_sub: [ "Each step uses the one before it. Illustrated with one example: Junior Business Analyst.", "Chaque étape s’appuie sur la précédente. Illustration avec un exemple : analyste métier junior.", "كل خطوة تبني على التي قبلها. وهذا مثال توضيحي: محلل أعمال مبتدئ." ],
  en1: [ "Skills", "Compétences", "المهارات" ],
  en1d: [ "The Skills Passport maps what you can really do.", "Le passeport de compétences montre ce que vous savez vraiment faire.", "يرسم «جواز المهارات» ما تستطيع فعله حقاً." ],
  en2: [ "Opportunities", "Opportunités", "الفرص" ],
  en2d: [ "AI matches you to roles that fit.", "L’IA vous oriente vers les postes qui vous correspondent.", "يربطك الذكاء الاصطناعي بالمسارات المهنية التي تلائمك." ],
  en3: [ "Gaps", "Écarts", "الفجوات" ],
  en3d: [ "The exact skills you are missing.", "Les compétences précises qui vous manquent.", "المهارات التي تنقصك بالضبط." ],
  en4: [ "Action", "Action", "التنفيذ" ],
  en4d: [ "A 30-day path, from day 1 to day 30.", "Un parcours de 30 jours, du jour 1 au jour 30.", "مسار 30 يوماً، من اليوم الأول إلى اليوم الثلاثين." ],
  en5: [ "Readiness", "Préparation", "الجاهزية" ],
  en5d: [ "A portfolio-ready project that proves it.", "Un projet prêt pour votre portfolio, qui le prouve.", "مشروع جاهز لملف أعمالك يُثبت جاهزيتك." ],
  eg_d1: [ "Power BI basics", "Bases de Power BI", "أساسيات Power BI" ],
  eg_d12: [ "First SQL queries", "Premières requêtes SQL", "أول استعلامات SQL" ],
  eg_d30: [ "Dashboard on open HCP data", "Tableau de bord sur les données ouvertes du HCP", "لوحة قيادة ببيانات المندوبية السامية للتخطيط المفتوحة" ],
  eg_proj: [ "A 3-chart Power BI dashboard, ready for the portfolio", "Un tableau de bord Power BI de 3 graphiques, prêt pour le portfolio", "لوحة Power BI من 3 رسوم بيانية، جاهزة لملف الأعمال" ],
  im_k: [ "No one left behind", "Personne laissé de côté", "لا أحد خارج الطريق" ],
  im_h: [ "Wherever you study, SKILMA comes with you.", "Où que vous étudiiez, SKILMA vous accompagne.", "أينما كنت تدرس، سكيلما معك." ],
  im_d: [ "For every 10 students who join, a local partner accompanies one more student from a remote area, step by step. If that student is you, ask for it.", "Pour 10 étudiants inscrits, un partenaire local accompagne pas à pas un étudiant de plus venant d’une zone éloignée. Si c’est vous, demandez-le.", "مقابل كل 10 طلبة ينضمّون، يرافق شريك محلي طالباً آخر من منطقة نائية خطوة بخطوة. إن كنت ذلك الطالب، فاطلب المواكبة." ],
  im_p1: [ "Students are referred and followed by local partners", "Les étudiants sont orientés et suivis par des partenaires locaux", "يرشّح الشركاء المحليون الطلبة ويتابعونهم" ],
  im_p2: [ "Works on weak connections: the built-in reader runs on the device", "Fonctionne avec une connexion faible : le lecteur intégré fonctionne sur l’appareil", "تصلح للاتصال الضعيف: المحلّل المدمج يعمل على الجهاز" ],
  im_p3: [ "Write in Arabic, French, English or Darija", "Écrivez en arabe, français, anglais ou darija", "اكتب بالعربية أو الفرنسية أو الإنجليزية أو الدارجة" ],
  im_cta1: [ "Ask for accompaniment", "Demander un accompagnement", "اطلب المواكبة" ],
  im_cta2: [ "See how it works", "Voir comment ça marche", "شاهد طريقة العمل" ],
  rm_k: [ "How we grow", "Notre développement", "كيف ننمو" ],
  rm_h: [ "We start with one student. We build the bridge step by step.", "Nous commençons par l’étudiant. Nous construisons le pont étape par étape.", "نبدأ بطالب واحد، ونبني الجسر خطوة بخطوة." ],
  rm_sub: [ "Each new layer answers a need observed in real use, not an assumption.", "Chaque nouvelle couche répond à un besoin constaté chez les utilisateurs, non à une supposition.", "كل طبقة جديدة تستجيب لحاجة أثبتها مستخدمون حقيقيون، لا لافتراض." ],
  rm_now: [ "Now", "Maintenant", "الآن" ],
  rm_next: [ "Next", "Ensuite", "بعد ذلك" ],
  rm_then: [ "Then", "Puis", "ثم" ],
  rm_fin: [ "Finally", "Enfin", "وأخيراً" ],
  rm1t: [ "Students", "Étudiants", "الطلبة" ],
  rm1d: [ "Passport, AI matching, 30-day path.", "Passeport, correspondance IA, parcours de 30 jours.", "الجواز، والربط الذكي، ومسار 30 يوماً." ],
  rm1f1: [ "Skills Passport", "Passeport de compétences", "جواز المهارات" ],
  rm1f2: [ "AI skill analysis and matching", "Analyse et correspondance IA", "تحليل المهارات والربط الذكي" ],
  rm1f3: [ "Gap analysis and 30-day path", "Analyse des écarts et parcours de 30 jours", "تحليل الفجوات ومسار 30 يوماً" ],
  rm2t: [ "Employability", "Employabilité", "قابلية التشغيل" ],
  rm2d: [ "Mock interviews and proof of skills.", "Entretiens blancs et preuves de compétences.", "المقابلات التدريبية وإثبات المهارات." ],
  rm2f1: [ "AI mock interviews", "Entretiens blancs avec l’IA", "مقابلات تدريبية بالذكاء الاصطناعي" ],
  rm2f2: [ "Proof of skills and portfolio", "Preuves et portfolio", "إثبات المهارات وملف الأعمال" ],
  rm2f3: [ "Progress tracking", "Suivi des progrès", "تتبّع التقدّم" ],
  rm3t: [ "Institutions", "Établissements", "الجامعات" ],
  rm3d: [ "A skills dashboard showing where students struggle.", "Un tableau de bord des compétences qui montre où les étudiants bloquent.", "لوحة قيادة تُري المؤسسة أين يتعثّر طلبتها." ],
  rm3f1: [ "Skills dashboard", "Tableau de bord des compétences", "لوحة قيادة المهارات" ],
  rm3f2: [ "Employability analytics", "Analyses d’employabilité", "تحليلات قابلية التشغيل" ],
  rm3f3: [ "Data-driven programmes", "Programmes fondés sur les données", "برامج مبنية على المعطيات" ],
  rm4t: [ "Employers", "Employeurs", "أصحاب العمل" ],
  rm4d: [ "Ready, proven talent, matched by skills.", "Des talents prêts et prouvés, appariés par compétences.", "كفاءات جاهزة ومُثبَتة، تُرشَّح حسب المهارات." ],
  rm4f1: [ "Skill-based talent matching", "Appariement par compétences", "ربط الكفاءات حسب المهارات" ],
  rm4f2: [ "Verified profiles", "Profils vérifiés", "ملفات موثَّقة" ],
  rm4f3: [ "Training and mentorship partners", "Partenaires de formation et mentorat", "شركاء التكوين والإرشاد" ],
  rms_ok: [ "Available", "Disponible", "متاح" ],
  rms_pre: [ "In pilot", "En pilote", "قيد التجربة" ],
  rms_soon: [ "Planned", "Prévu", "مُخطَّط له" ],
  pub_vision: [ "Vision", "Vision", "الرؤية" ],
  fin4_t: [ "From potential to a real opportunity.", "Du potentiel à une vraie opportunité.", "من القدرة، إلى فرصة حقيقية لك." ],
  vi_h1: [ "From potential to a real opportunity.", "Du potentiel à une vraie opportunité.", "من القدرة، إلى فرصة حقيقية لك." ],
  vi_sub: [ "SKILMA is an AI-powered career and growth platform. We start with students, and progressively connect institutions, training providers and employers through real skills.", "SKILMA est une plateforme de carrière et de développement fondée sur l’IA. Nous commençons par les étudiants, puis relions progressivement établissements, organismes de formation et employeurs par les compétences réelles.", "سكيلما منصة للتوجيه المهني والتطوير الذاتي قائمة على الذكاء الاصطناعي. نبدأ بالطلبة، ثم نربط تدريجياً الجامعات ومراكز التكوين وأصحاب العمل عبر المهارات الفعلية." ],
  vi_why: [ "We don’t want young people to be defined only by what they studied. We want to help them discover what they can actually do — and show them how to turn that potential into opportunity.", "Nous ne voulons pas que les jeunes soient définis uniquement par ce qu’ils ont étudié. Nous voulons les aider à découvrir ce qu’ils savent réellement faire — et leur montrer comment transformer ce potentiel en opportunité.", "لا نريد أن يُعرَّف الشباب بما درسوه فقط. نريد أن نساعدهم على اكتشاف ما يستطيعون فعله حقاً، وأن نريهم كيف يحوّلون هذه القدرات إلى فرص." ],
  df_k: [ "What makes it different", "Ce qui nous distingue", "ما الذي يميّزها" ],
  df_h: [ "AI is not the difference. How we connect the steps is.", "La différence ne tient pas à l’IA, mais à la façon de relier les étapes.", "الذكاء الاصطناعي ليس ما يصنع الفرق، بل طريقة ربط المراحل." ],
  df1n: [ "Not only: “What did you study?”", "Pas seulement : « Qu’avez-vous étudié ? »", "ليس فقط: «ماذا درست؟»" ],
  df1y: [ "But: what can you actually do?", "Mais : que savez-vous vraiment faire ?", "بل: ماذا تستطيع أن تفعل حقاً؟" ],
  df2n: [ "Not only: “Here are some jobs.”", "Pas seulement : « Voici des offres. »", "ليس فقط: «هذه بعض الوظائف.»" ],
  df2y: [ "But: these fit you, and here is why.", "Mais : celles-ci vous correspondent, et voici pourquoi.", "بل: هذه تناسبك، وهذا هو السبب." ],
  df3n: [ "Not only: “Learn this skill.”", "Pas seulement : « Apprenez cette compétence. »", "ليس فقط: «تعلّم هذه المهارة.»" ],
  df3y: [ "But: you are missing this, and here is how to close it.", "Mais : il vous manque ceci, et voici comment le combler.", "بل: هذا ما ينقصك، وهكذا تسدّه." ],
  df4n: [ "Not leaving the student alone.", "Ne pas laisser l’étudiant seul.", "لا نترك الطالب وحده." ],
  df4y: [ "From discovery to readiness to opportunity.", "De la découverte à la préparation, jusqu’à l’opportunité.", "من الاكتشاف إلى الجاهزية إلى الفرصة." ],
  df5n: [ "Not just a chatbot.", "Pas un simple agent conversationnel.", "ليس مجرد روبوت محادثة." ],
  df5y: [ "AI as the engine: diagnosis, matching, path, preparation.", "L’IA comme moteur : diagnostic, correspondance, parcours, préparation.", "الذكاء الاصطناعي بوصفه محرّكاً: تشخيص، وربط، ومسار، وتحضير." ],
  ec_k: [ "The ecosystem", "L’écosystème", "المنظومة" ],
  ec_h: [ "A bridge between education and the job market.", "Un pont entre l’éducation et le marché du travail.", "جسر بين التعليم وسوق الشغل." ],
  ec_sub: [ "The student sees their gap. The institution sees its students’ gaps. Employers find ready, proven talent. Training is recommended because a gap was found, never as a catalogue.", "L’étudiant voit son écart. L’établissement voit ceux de ses étudiants. Les employeurs trouvent des talents prêts et prouvés. La formation est recommandée parce qu’un écart a été identifié, jamais comme un catalogue.", "يرى الطالب فجوته، وترى الجامعة فجوات طلبتها، ويجد أصحاب العمل كفاءات جاهزة ومُثبَتة. ويُقترح التكوين لأن فجوة اكتُشفت، لا ضمن فهرس دورات." ],
  ec_s: [ "Students", "Étudiants", "الطلبة" ],
  ec_u: [ "Institutions", "Établissements", "الجامعات" ],
  ec_e: [ "Employers", "Employeurs", "أصحاب العمل" ],
  ec_t: [ "Training and mentors", "Formation et mentors", "التكوين والإرشاد" ],
  ec_sp: [ "Associations", "Associations", "الجمعيات" ],
  bm_k: [ "Business model", "Modèle économique", "النموذج الاقتصادي" ],
  bm1t: [ "Students (B2C)", "Étudiants (B2C)", "الطلبة (B2C)" ],
  bm2t: [ "Institutions (B2B)", "Établissements (B2B)", "الجامعات (B2B)" ],
  bm2d: [ "Institutional console and analytics.", "Console et analyses institutionnelles.", "لوحة المؤسسة وتحليلاتها." ],
  bm3t: [ "Through institutions (B2B2C)", "Via les établissements (B2B2C)", "عبر الجامعات (B2B2C)" ],
  bm3d: [ "The institution pays; its students use it.", "L’établissement paie, ses étudiants en bénéficient.", "تدفع الجامعة ويستعملها طلبتها." ],
  bm4t: [ "Employers", "Employeurs", "أصحاب العمل" ],
  bm4d: [ "Skill-based talent discovery, later.", "Découverte de talents par compétences, plus tard.", "اكتشاف الكفاءات حسب المهارات، في مرحلة لاحقة." ],
  bm5t: [ "Partnerships", "Partenariats", "الشراكات" ],
  bm5d: [ "Training providers, mentors and programmes.", "Organismes de formation, mentors et programmes.", "مراكز التكوين والمرشدون والبرامج." ],
  nd_k: [ "Focus", "Priorités", "التركيز" ],
  nd_h: [ "What we deliberately do not build yet.", "Ce que nous ne construisons pas encore, volontairement.", "ما لا نبنيه الآن، عن قصد." ],
  nd1: [ "A full marketplace from day one", "Une place de marché complète dès le premier jour", "سوق متكاملة منذ اليوم الأول" ],
  nd2: [ "A complex recruiter ATS", "Un logiciel de recrutement (ATS) complexe", "نظام معقّد لتتبّع المترشحين (ATS)" ],
  nd3: [ "A massive course platform", "Une immense plateforme de cours", "منصة دورات ضخمة" ],
  nd4: [ "A university management system", "Un système de gestion universitaire", "نظام تسيير جامعي" ],
  nd5: [ "A social network", "Un réseau social", "شبكة اجتماعية" ],
  nd6: [ "Dozens of AI agents", "Des dizaines d’agents IA", "عشرات الوكلاء الأذكياء" ],
  nd_rule: [ "Build → Test → Measure → Learn → Improve → Expand.", "Construire → Tester → Mesurer → Apprendre → Améliorer → Étendre.", "نبني ← نختبر ← نقيس ← نتعلّم ← نحسّن ← نتوسّع." ],
  ac_h1: [ "Accompaniment for the students who need it most.", "Un accompagnement pour les étudiants qui en ont le plus besoin.", "مواكبة للطلبة الأكثر حاجة إليها." ],
  ac_sub: [ "If you study far from big cities or face barriers, ask for accompaniment: a local partner helps you start and follows your path with you.", "Si vous étudiez loin des grandes villes ou rencontrez des obstacles, demandez un accompagnement : un partenaire local vous aide à démarrer et suit votre parcours avec vous.", "إن كنت تدرس بعيداً عن المدن الكبرى أو تواجه صعوبات، فاطلب المواكبة: يساعدك شريك محلي على البداية ويتابع مسارك معك." ],
  ac_tab1: [ "Ask for accompaniment", "Demander un accompagnement", "اطلب المواكبة" ],
  ac_place: [ "Town or region", "Ville ou région", "المدينة أو الجهة" ],
  ac_place_ph: [ "e.g. Tinghir", "Ex. : Tinghir", "مثلاً: تنغير" ],
  ac_school: [ "School or university", "École ou université", "المؤسسة أو الجامعة" ],
  ac_contact: [ "Email or phone", "E-mail ou téléphone", "البريد الإلكتروني أو الهاتف" ],
  ac_why: [ "What applies to you? (optional)", "Ce qui vous concerne (facultatif)", "ما ينطبق عليك؟ (اختياري)" ],
  ac_w1: [ "Rural or remote area", "Zone rurale ou éloignée", "منطقة قروية أو نائية" ],
  ac_w2: [ "Scholarship holder", "Titulaire d’une bourse", "طالب ممنوح" ],
  ac_w3: [ "No regular internet at home", "Pas d’internet régulier à la maison", "لا إنترنت منتظم في البيت" ],
  ac_w4: [ "First generation at university", "Première génération à l’université", "أول من يلتحق بالجامعة في العائلة" ],
  ac_send: [ "Send my request", "Envoyer ma demande", "أرسل طلبي" ],
  ac_note: [ "No documents needed. Your answers stay private.", "Aucun document requis. Vos réponses restent confidentielles.", "لا حاجة إلى وثائق، وتبقى إجاباتك سرية." ],
  ac_s1: [ "Tell us where you study", "Indiquez-nous où vous étudiez", "أخبرنا أين تدرس" ],
  ac_s2: [ "We match you with a local partner", "Nous vous mettons en lien avec un partenaire local", "نربطك بشريك محلي" ],
  ac_s3: [ "They help you start and follow your path with you", "Il vous aide à démarrer et suit votre parcours avec vous", "يساعدك على البداية ويتابع مسارك معك" ],
  ac_ok_t: [ "Request saved", "Demande enregistrée", "حُفظ طلبك" ],
  ac_ok_d: [ "Thank you. Your request is saved. Accompaniment opens region by region. You can start right now.", "Merci. Votre demande est enregistrée. L’accompagnement ouvre région par région. Vous pouvez commencer dès maintenant.", "شكراً لك. حُفظ طلبك. تنطلق المواكبة جهة بعد جهة، ويمكنك أن تبدأ الآن." ],
  sp_org: [ "Company or foundation", "Entreprise ou fondation", "الشركة أو المؤسسة المانحة" ],
  sp_s1: [ "Choose how many students to support", "Choisissez combien d’étudiants soutenir", "اختاروا عدد الطلبة الذين تريدون دعمهم" ],
  sp_s3: [ "You receive an impact report every semester", "Vous recevez un rapport d’impact chaque semestre", "تتلقّون تقرير أثر كل أسدس" ],
  sp_ok_t: [ "Thank you for your support", "Merci pour votre soutien", "شكراً على دعمكم" ],
  sp_ok_d: [ "The SKILMA team will contact you within two working days.", "L’équipe SKILMA vous contactera sous deux jours ouvrés.", "سيتواصل معكم فريق سكيلما خلال يومي عمل." ],
  err_place: [ "Enter your town or region.", "Indiquez votre ville ou région.", "أدخل مدينتك أو جهتك." ],
  err_contact: [ "Enter an email or a phone number.", "Indiquez une adresse e-mail ou un numéro de téléphone.", "أدخل بريداً إلكترونياً أو رقم هاتف." ],
  err_org: [ "Enter the organisation’s name.", "Indiquez le nom de l’organisation.", "أدخل اسم الجهة." ],
  ax_t: [ "Accessibility", "Accessibilité", "إمكانية الوصول" ],
  ax_lite: [ "Data saver", "Économie de données", "توفير البيانات" ],
  ax_size: [ "Text size", "Taille du texte", "حجم النص" ],
  ax_lite_on: [ "Data saver on: no animations, less data", "Économie de données activée : sans animations, moins de données", "توفير البيانات مفعّل: بلا حركة، وبيانات أقل" ],
  ax_lite_off: [ "Data saver off", "Économie de données désactivée", "أُوقف توفير البيانات" ],
  prg_title: [ "Learning", "Formations", "التكوين" ],
  prg_sub: [ "Training chosen because a gap was found, not from a catalogue.", "Des formations choisies parce qu’un écart a été identifié, pas un catalogue.", "تكوينات اختيرت لأن فجوة اكتُشفت، لا فهرس للدورات." ],
  pg_rule: [ "Gap → Recommendation → Learning → Proof → Readiness.", "Écart → Recommandation → Apprentissage → Preuve → Préparation.", "فجوة ← توصية ← تعلّم ← إثبات ← جاهزية." ],
  pg_for: [ "For {x}", "Pour {x}", "لوظيفة {x}" ],
  pg_none: [ "No gap left for this goal. Keep proving what you have.", "Plus aucun écart pour cet objectif. Continuez à prouver ce que vous avez.", "لا فجوة متبقية لهذا الهدف. واصل إثبات ما تملكه." ],
  pg_why_gap: [ "Missing for {x}.", "Manquant pour {x}.", "ينقصك لوظيفة {x}." ],
  pg_why_proof: [ "You have it: now prove it for {x}.", "Vous la maîtrisez : prouvez-la maintenant pour {x}.", "تملكها، فأثبِتها الآن لوظيفة {x}." ],
  pg_day: [ "Day {n} in your path", "Jour {n} de votre parcours", "اليوم {n} في مسارك" ],
  pg_growth: [ "Personal growth", "Développement personnel", "التطوير الذاتي" ],
  gp1t: [ "Leading people", "Diriger une équipe", "قيادة الفرق" ],
  gp1d: [ "Short workshops on running a team and a meeting.", "Ateliers courts pour animer une équipe et une réunion.", "ورشات قصيرة في إدارة فريق وتسيير اجتماع." ],
  gp2t: [ "Time management", "Gestion du temps", "تدبير الوقت" ],
  gp2d: [ "Plan a week, keep a rhythm, finish what you start.", "Planifier une semaine, tenir un rythme, terminer ce que l’on commence.", "خطّط لأسبوعك، وحافظ على الإيقاع، وأنهِ ما بدأته." ],
  gp3t: [ "Communication", "Communication", "التواصل" ],
  gp3d: [ "Speak clearly, write a professional email, present an idea.", "Parler clairement, écrire un e-mail professionnel, présenter une idée.", "تحدّث بوضوح، واكتب بريداً مهنياً، وقدّم فكرة." ],
  gp4t: [ "Mentorship", "Mentorat", "الإرشاد" ],
  gp4d: [ "A professional who has done the job, one hour a month.", "Un professionnel du métier, une heure par mois.", "مهني مارس الوظيفة، ساعة واحدة كل شهر." ],
  pg_note: [ "Programmes open with our training and mentorship partners. They will appear here first for the students whose gaps they close.", "Les programmes ouvriront avec nos partenaires de formation et de mentorat. Ils apparaîtront ici d’abord pour les étudiants dont ils comblent les écarts.", "ستُفتح البرامج مع شركائنا في التكوين والإرشاد، وستظهر هنا أولاً للطلبة الذين تسدّ فجواتهم." ],
  o_nav_impact: [ "Impact", "Impact", "الأثر" ],
  oim_d: [ "Accompaniment requests from remote areas and the partners who follow them.", "Demandes d’accompagnement des zones éloignées et partenaires qui les suivent.", "طلبات المواكبة من المناطق النائية والشركاء الذين يتابعونها." ],
  oim_req: [ "Accompaniment requests", "Demandes d’accompagnement", "طلبات المواكبة" ],
  oim_give: [ "Match a partner", "Associer un partenaire", "اربط بشريك" ],
  oim_given: [ "Partner matched", "Partenaire associé", "رُبط بشريك" ],
  oim_none: [ "No requests yet. They arrive from the website’s accompaniment form.", "Aucune demande pour l’instant. Elles arrivent du formulaire d’accompagnement du site.", "لا طلبات بعد. تصل من استمارة المواكبة في الموقع." ],
  oim_note: [ "Figures on this page are examples.", "Les chiffres de cette page sont des exemples.", "أرقام هذه الصفحة أمثلة." ],
  o_a_access: [ "Accompaniment request: {x}", "Demande d’accompagnement : {x}", "طلب مواكبة: {x}" ],
  audit_access: [ "Accompaniment requested: {x}", "Accompagnement demandé : {x}", "طلب مواكبة: {x}" ],
  audit_acc_ok: [ "Partner matched: {x}", "Partenaire associé : {x}", "رُبط بشريك: {x}" ],
  audit_acc_no: [ "Request declined: {x}", "Demande refusée : {x}", "رُفض الطلب: {x}" ],
  th_label: [ "Appearance", "Apparence", "المظهر" ],
  th_light: [ "Light", "Clair", "فاتح" ],
  th_dark: [ "Dark", "Sombre", "داكن" ],
  th_system: [ "System", "Système", "حسب الجهاز" ],
  th_to_light: [ "Switch to light mode", "Passer en mode clair", "التبديل إلى الوضع الفاتح" ],
  th_to_dark: [ "Switch to dark mode", "Passer en mode sombre", "التبديل إلى الوضع الداكن" ],
  t_p30: [ "Publish your project to your passport", "Publier votre projet dans votre passeport", "انشر مشروعك في جوازك" ],
  k_portfolio: [ "Portfolio", "Portfolio", "ملف الأعمال" ],
  s_portfolio: [ [ "Add the final version (link or file)", "Write three lines: problem, method, result", "Publish it to your passport" ], [ "Ajoutez la version finale (lien ou fichier)", "Rédigez trois lignes : problème, méthode, résultat", "Publiez-la dans votre passeport" ], [ "أضف النسخة النهائية (رابطاً أو ملفاً)", "اكتب ثلاثة أسطر: المشكلة والمنهج والنتيجة", "انشرها في جوازك" ] ],
  od_apply_adv: [ "Recommended from 70% readiness. You can apply now.", "Recommandé à partir de 70 % de préparation. Vous pouvez déjà postuler.", "يُنصح بالترشّح ابتداءً من جاهزية 70%، ويمكنك الترشّح الآن." ],
  pf_title: [ "Portfolio", "Portfolio", "ملف الأعمال" ],
  pf_none: [ "Your Day 30 project will appear here.", "Votre projet du jour 30 apparaîtra ici.", "سيظهر هنا مشروع اليوم الثلاثين." ],
  pf_from: [ "Day 30 project · {role}", "Projet du jour 30 · {role}", "مشروع اليوم 30 · {role}" ],
  ev_portfolio: [ "Project published to the passport", "Projet publié dans le passeport", "نُشر المشروع في الجواز" ],
  pf_open: [ "Open the work", "Ouvrir le travail", "افتح العمل" ],
  si_id: [ "Email or phone number", "E-mail ou numéro de téléphone", "البريد الإلكتروني أو رقم الهاتف" ],
  si_ph: [ "name@example.com or 06 12 34 56 78", "nom@exemple.ma ou 06 12 34 56 78", "name@example.com أو 06 12 34 56 78" ],
  err_id: [ "Enter a valid email or Moroccan phone number.", "Saisissez une adresse e-mail ou un numéro marocain valide.", "أدخل بريداً إلكترونياً أو رقم هاتف مغربياً صحيحاً." ],
  hw5d: [ "Your checklist moves only with what you show: evidence from your path, a mock interview, your Day 30 project.", "Votre liste n’avance qu’avec ce que vous montrez : preuves de votre parcours, un entretien blanc, votre projet du jour 30.", "لا تتقدّم قائمتك إلا بما تُظهره: أدلة من مسارك، ومقابلة تدريبية، ومشروع اليوم 30." ],
  hw5p1: [ "Mock interview with feedback", "Entretien blanc avec retours", "مقابلة تدريبية مع ملاحظات" ],
  hw5p2: [ "Your institution can verify", "Votre établissement peut vérifier", "يمكن لمؤسستك أن توثّق" ],
  mt_pf: [ "Day 30 project", "Projet du jour 30", "مشروع اليوم 30" ],
  pub_emp: [ "Employers", "Employeurs", "أصحاب العمل" ],
  pub_partners: [ "Partners", "Partenaires", "الشركاء" ],
  pub_changes: [ "What’s new", "Nouveautés", "المستجدات" ],
  yes: [ "Yes", "Oui", "نعم" ],
  no: [ "No", "Non", "لا" ],
  pf_org: [ "Organisation", "Organisation", "الجهة" ],
  pf_contact: [ "Email or phone", "E-mail ou téléphone", "البريد الإلكتروني أو الهاتف" ],
  pf_email_w: [ "Work email", "E-mail professionnel", "البريد المهني" ],
  try_k: [ "Try it now · no account", "Essayez maintenant · sans compte", "جرّب الآن · بلا حساب" ],
  try_h: [ "Write one sentence. See your skills.", "Écrivez une phrase. Voyez vos compétences.", "اكتب جملة واحدة، وشاهد مهاراتك." ],
  try_sub: [ "Read instantly in your browser. Nothing is saved unless you choose.", "Lecture instantanée dans votre navigateur. Rien n’est enregistré sans votre accord.", "تُقرأ فوراً في متصفحك، ولا يُحفظ شيء إلا إذا اخترت ذلك." ],
  try_l: [ "What have you done? A job, family help, a club, a class project.", "Qu’avez-vous fait ? Un emploi, une aide familiale, un club, un projet de cours.", "ماذا فعلت؟ عملاً، أو مساعدة عائلية، أو نشاطاً في نادٍ، أو مشروعاً دراسياً." ],
  try_ph: [ "e.g. At weekends I help at my uncle’s shop: I serve customers and keep the stock in Excel.", "Ex. : le week-end, j’aide à la boutique de mon oncle : je sers les clients et je tiens le stock sur Excel.", "مثال: أساعد في متجر عمّي نهاية الأسبوع، أستقبل الزبائن وأتابع المخزون على إكسل." ],
  try_ex: [ "Use Sara’s example", "Utiliser l’exemple de Sara", "استعمل مثال سارة" ],
  try_clear: [ "Clear", "Effacer", "مسح" ],
  try_empty: [ "Your skills will appear here as you type.", "Vos compétences apparaîtront ici au fil de la saisie.", "ستظهر مهاراتك هنا أثناء الكتابة." ],
  try_none: [ "No skill yet. Add what you did, for whom, and a number.", "Aucune compétence pour l’instant. Précisez ce que vous avez fait, pour qui, avec un chiffre.", "لا مهارة بعد. أضف ما فعلته، ولمن، ورقماً." ],
  try_found: [ "{n|one:# skill found|other:# skills found}", "{n|one:# compétence trouvée|other:# compétences trouvées}", "{n|zero:لا مهارات|one:مهارة واحدة مُكتشفة|two:مهارتان مُكتشفتان|few:# مهارات مُكتشفة|many:# مهارة مُكتشفة|other:# مهارة مُكتشفة}" ],
  try_roles: [ "Roles that fit · required skills found", "Postes qui vous correspondent · compétences requises trouvées", "وظائف تناسبك · المهارات المطلوبة المكتشفة" ],
  try_miss: [ "To reach {role}: {miss}. {h|one:About # hour|other:About # hours} of learning.", "Pour viser {role} : {miss}. {h|one:Environ # heure|other:Environ # heures} d’apprentissage.", "للوصول إلى {role}: {miss}. {h|zero:أقل من ساعة|one:نحو ساعة واحدة|two:نحو ساعتين|few:نحو # ساعات|many:نحو # ساعة|other:نحو # ساعة} من التعلّم." ],
  try_save: [ "Save to my passport", "Enregistrer dans mon passeport", "احفظ في جوازي" ],
  try_local: [ "Read on this device by the built-in reader.", "Lu sur cet appareil par le lecteur intégré.", "يقرؤه المحلّل المدمج على هذا الجهاز." ],
  h_try: [ "Try it now", "Essayer maintenant", "جرّب الآن" ],
  em_h1: [ "Hire on proof, not on keywords.", "Recrutez sur preuves, pas sur mots-clés.", "وظّف بناءً على الإثبات، لا على الكلمات المفتاحية." ],
  em_sub: [ "Search students by the skills they can show: verified experience, finished projects, interview practice.", "Recherchez des étudiants selon les compétences qu’ils démontrent : expériences vérifiées, projets réalisés, entretiens blancs.", "ابحث عن الطلبة حسب المهارات التي يثبتونها: تجارب موثّقة، ومشاريع منجزة، وتدريب على المقابلات." ],
  em_cta: [ "Join the employer waitlist", "Rejoindre la liste d’attente", "انضمّ إلى قائمة الانتظار" ],
  em_phase: [ "Employer access opens in phase 4 of our roadmap. Today you can share an internship with our pilot institutions.", "L’accès employeurs ouvrira à la phase 4 de notre feuille de route. Vous pouvez déjà proposer un stage à nos établissements pilotes.", "يُفتح ولوج أصحاب العمل في المرحلة الرابعة من خارطة طريقنا، ويمكنك الآن اقتراح تدريب على مؤسساتنا النموذجية." ],
  em_search: [ "Skill search · preview", "Recherche par compétences · aperçu", "البحث بالمهارات · معاينة" ],
  em_cand: [ "Candidate", "Candidat", "مرشّح" ],
  em_match: [ "{a} of {b} skills", "{a} compétences sur {b}", "المهارات: {a} من {b}" ],
  em_proofs: [ "{n|one:# proof|other:# proofs}", "{n|one:# preuve|other:# preuves}", "{n|zero:لا إثباتات|one:إثبات واحد|two:إثباتان|few:# إثباتات|many:# إثباتاً|other:# إثبات}" ],
  em_iv: [ "interview {s}", "entretien {s}", "المقابلة {s}" ],
  em_anon: [ "Anonymous until the student agrees to share.", "Anonyme jusqu’à l’accord de l’étudiant.", "مجهول الهوية إلى أن يوافق الطالب على المشاركة." ],
  em_k2: [ "What you will get", "Ce que vous obtiendrez", "ما ستحصل عليه" ],
  em_h2: [ "Structured profiles you can trust.", "Des profils structurés et fiables.", "ملفات منظّمة يمكن الوثوق بها." ],
  em_f1t: [ "Skill-based search", "Recherche par compétences", "البحث بالمهارات" ],
  em_f1d: [ "Combine skills, languages and city. Results rank by proof, not by CV keywords.", "Combinez compétences, langues et ville. Les résultats sont classés par preuves, non par mots-clés.", "اجمع بين المهارات واللغات والمدينة، وتُرتَّب النتائج حسب الإثبات لا حسب كلمات السيرة الذاتية." ],
  em_f2t: [ "Proof you can open", "Des preuves consultables", "إثباتات يمكنك فتحها" ],
  em_f3t: [ "Verified by institutions", "Vérifiées par les établissements", "موثّقة من المؤسسات" ],
  em_f3d: [ "Experience confirmed by a named person at the student’s institution.", "Expériences confirmées par une personne identifiée de l’établissement.", "تجارب يؤكّدها شخص معلوم الهوية في مؤسسة الطالب." ],
  em_f4t: [ "Consent first", "Consentement d’abord", "الموافقة أولاً" ],
  em_f4d: [ "Students choose who sees their passport. Nothing is sold.", "Les étudiants choisissent qui voit leur passeport. Rien n’est vendu.", "يختار الطلبة من يطّلع على جوازهم، ولا يُباع شيء." ],
  em_not: [ "We are not building a complex ATS. We send you fewer, better-matched candidates.", "Nous ne construisons pas un logiciel de recrutement complexe. Nous vous présentons moins de candidats, mieux ciblés.", "لا نبني نظام توظيف معقّداً، بل نقدّم لك مرشّحين أقلّ عدداً وأكثر ملاءمة." ],
  em_wl_k: [ "Waitlist", "Liste d’attente", "قائمة الانتظار" ],
  em_wl_h: [ "Be among the first employers.", "Soyez parmi les premiers employeurs.", "كن من أوائل أصحاب العمل." ],
  em_wl_d: [ "Tell us what you hire for. We will contact you when matching opens, and can share your internships with our pilot institutions now.", "Indiquez-nous les postes que vous recrutez. Nous vous contacterons à l’ouverture, et pouvons dès maintenant relayer vos stages auprès de nos établissements pilotes.", "أخبرنا بالوظائف التي توظّف لها؛ سنتواصل معك عند الإطلاق، ويمكننا من الآن نشر عروض تدريبك لدى مؤسساتنا النموذجية." ],
  em_role: [ "Roles you hire for", "Postes recherchés", "الوظائف التي توظّف لها" ],
  em_role_ph: [ "e.g. junior analyst, sales", "Ex. : analyste junior, vente", "مثال: محلل مبتدئ، مبيعات" ],
  em_intern: [ "I have an internship to share now", "J’ai un stage à proposer dès maintenant", "لدي تدريب أودّ نشره الآن" ],
  em_send: [ "Join the waitlist", "Rejoindre la liste", "انضمّ إلى القائمة" ],
  em_ok_t: [ "Thank you. Request received.", "Merci. Demande reçue.", "شكراً، توصّلنا بطلبك." ],
  em_ok_d: [ "We will write to {org} within two working days.", "Nous écrirons à {org} sous deux jours ouvrés.", "سنراسل {org} خلال يومَي عمل." ],
  pt2_h1: [ "Teach the skills students are missing.", "Enseignez les compétences qui manquent aux étudiants.", "علّم المهارات التي تنقص الطلبة." ],
  pt2_sub: [ "Training centres, schools and mentors: SKILMA sends you students at the exact moment a gap is found.", "Centres de formation, écoles et mentors : SKILMA vous adresse des étudiants au moment précis où un écart est identifié.", "مراكز التكوين والمدارس والمرشدون: توجّه إليكم سكيلما الطلبة في اللحظة التي تُكتشف فيها الفجوة." ],
  pt2_rule: [ "Our rule: we recommend training only when a gap is identified. Never a catalogue.", "Notre règle : nous ne recommandons une formation que lorsqu’un écart est identifié. Jamais un catalogue.", "قاعدتنا: لا نقترح تكويناً إلا عند اكتشاف فجوة. لا فهارس دورات أبداً." ],
  pt2_k: [ "For partners", "Pour les partenaires", "للشركاء" ],
  pt2_h2: [ "What partnership brings", "Ce que le partenariat apporte", "ما تقدّمه الشراكة" ],
  pt2_f1t: [ "Students with a precise need", "Des étudiants au besoin précis", "طلبة بحاجة محدّدة" ],
  pt2_f1d: [ "Each student arrives with the gap, the target role and the time available.", "Chaque étudiant arrive avec son écart, le poste visé et le temps dont il dispose.", "يأتي كل طالب بفجوته والوظيفة التي يستهدفها والوقت المتاح له." ],
  pt2_f2t: [ "Completion that counts", "Une réussite qui compte", "إنجاز يُحتسب" ],
  pt2_f2d: [ "When a student finishes your course with a project, it becomes proof in their passport.", "Lorsqu’un étudiant termine votre formation avec un projet, celui-ci devient une preuve dans son passeport.", "حين يُتمّ الطالب تكوينك بمشروع، يصبح ذلك إثباتاً في جوازه." ],
  pt2_f3t: [ "Mentors", "Mentors", "المرشدون" ],
  pt2_f3d: [ "Professionals can give one hour a month to a student preparing for their field.", "Des professionnels peuvent consacrer une heure par mois à un étudiant qui prépare leur métier.", "يمكن للمهنيين تخصيص ساعة في الشهر لطالب يستعدّ لمجالهم." ],
  pt2_f4t: [ "Open to all", "Ouvert à tous", "مفتوح للجميع" ],
  pt2_f4d: [ "Options anyone can start today are shown first, so no student is left out.", "Les options accessibles à tous dès aujourd’hui passent en premier, pour qu’aucun étudiant ne soit exclu.", "تُعرض أولاً الخيارات التي يستطيع الجميع البدء بها اليوم، حتى لا يُقصى أي طالب." ],
  pt2_wl_k: [ "Become a partner", "Devenir partenaire", "كن شريكاً" ],
  pt2_wl_h: [ "Tell us what you teach.", "Dites-nous ce que vous enseignez.", "أخبرنا بما تعلّمه." ],
  pt2_wl_d: [ "We review every offer against real student gaps before listing it.", "Nous comparons chaque offre aux écarts réels des étudiants avant de la proposer.", "نقارن كل عرض بالفجوات الحقيقية لدى الطلبة قبل إدراجه." ],
  pt2_skills: [ "Skills you teach", "Compétences enseignées", "المهارات التي تعلّمها" ],
  pt2_skills_ph: [ "e.g. Power BI, SQL, public speaking", "Ex. : Power BI, SQL, prise de parole", "مثال: Power BI، SQL، الخطابة" ],
  pt2_fmt: [ "Format", "Format", "الصيغة" ],
  pt2_online: [ "Online", "En ligne", "عن بُعد" ],
  pt2_inperson: [ "In person", "En présentiel", "حضورياً" ],
  pt2_free: [ "Open to all", "Ouvert à tous", "مفتوح للجميع" ],
  pt2_cert: [ "Certificate", "Certificat", "شهادة" ],
  pt2_mentor: [ "Mentoring", "Mentorat", "إرشاد" ],
  pt2_send: [ "Send my offer", "Envoyer mon offre", "أرسل عرضي" ],
  pt2_ok_d: [ "We will review the offer from {org} and reply within a week.", "Nous étudierons l’offre de {org} et répondrons sous une semaine.", "سندرس عرض {org} ونردّ خلال أسبوع." ],
  cl_h1: [ "What’s new", "Nouveautés", "المستجدات" ],
  cl_sub: [ "SKILMA improves every week. Here is what changed.", "SKILMA progresse chaque semaine. Voici ce qui a changé.", "تتحسّن سكيلما كل أسبوع، وهذا ما تغيّر." ],
  cl7a: [ "Light, dark and automatic appearance, designed for every screen.", "Apparence claire, sombre ou automatique, conçue pour chaque écran.", "مظهر فاتح وداكن وتلقائي، مصمَّم لكل شاشة." ],
  cl7b: [ "A Day 30 portfolio project, published to the passport.", "Un projet de portfolio au jour 30, publié dans le passeport.", "مشروع لملف الأعمال في اليوم الثلاثين، يُنشر في الجواز." ],
  cl7c: [ "A mock interview report: strengths, weaknesses and questions to practise.", "Un rapport d’entretien blanc : points forts, points faibles et questions à retravailler.", "تقرير للمقابلة التدريبية: نقاط القوة والضعف والأسئلة التي ينبغي التدرّب عليها." ],
  cl7d: [ "Try the reader on the home page, without an account.", "Essayez le lecteur sur la page d’accueil, sans compte.", "جرّب المحلّل في الصفحة الرئيسية دون حساب." ],
  cl7e: [ "Opportunity pages: skills, requirements and your preferences, side by side.", "Pages d’opportunités : compétences, exigences et préférences, côte à côte.", "صفحات الفرص: المهارات والمتطلبات وتفضيلاتك، جنباً إلى جنب." ],
  cl6a: [ "A light mode for weak connections.", "Un mode léger pour les connexions faibles.", "وضع خفيف للاتصالات الضعيفة." ],
  cl6b: [ "Accompaniment requests for students in remote areas.", "Demandes d’accompagnement pour les étudiants des zones éloignées.", "طلبات المواكبة لطلبة المناطق النائية." ],
  cl6c: [ "Text size and read-aloud on public pages.", "Taille du texte et lecture à voix haute sur les pages publiques.", "حجم النص والقراءة الصوتية في الصفحات العامة." ],
  cl5a: [ "Institution console: skills by programme and verification queue.", "Console établissement : compétences par filière et file de vérification.", "لوحة المؤسسة: المهارات حسب الشعبة وقائمة طلبات التوثيق." ],
  cl5b: [ "Institution reports you can export in one click.", "Rapports établissement exportables en un clic.", "تقارير المؤسسات قابلة للتصدير بنقرة واحدة." ],
  cl5c: [ "Public passport link and PDF.", "Lien public du passeport et PDF.", "رابط عام للجواز ونسخة PDF." ],
  em_prev: [ "Illustrative", "Illustratif", "توضيحي" ],
  fr_on: [ "You answered the question asked.", "Vous répondez précisément à la question.", "أجبت عن السؤال المطروح بدقة." ],
  fi_repeat: [ "You told the same story again. Choose a different example for this question.", "Vous reprenez la même histoire. Choisissez un autre exemple pour cette question.", "أعدت القصة نفسها. اختر مثالاً آخر لهذا السؤال." ],
  fi_q1: [ "Say why {role} interests you, in one sentence.", "Dites en une phrase pourquoi le poste de {role} vous intéresse.", "قل في جملة واحدة لماذا تهمّك وظيفة {role}." ],
  fi_q2: [ "Tell one moment where you used {skill}: what you did and what changed.", "Racontez un moment où vous avez mobilisé {skill} : ce que vous avez fait, ce qui a changé.", "احكِ موقفاً استعملت فيه مهارة {skill}: ماذا فعلت، وما الذي تغيّر." ],
  fi_q3: [ "Name how you will learn {gap}: which course, how many hours a week, what you will build.", "Précisez comment vous apprendrez {gap} : quel cours, combien d’heures par semaine, ce que vous réaliserez.", "حدّد كيف ستتعلّم {gap}: أي دورة، وكم ساعة في الأسبوع، وماذا ستنجز." ],
  fi_q4: [ "Describe the problem, what you did to calm or solve it, and the result.", "Décrivez le problème, ce que vous avez fait pour l’apaiser ou le résoudre, et le résultat.", "صِف المشكلة، وما فعلته لتهدئتها أو حلّها، والنتيجة." ],
  fi_q5: [ "Give one strength and the proof behind it, with a number.", "Donnez un atout et la preuve qui l’étaye, avec un chiffre.", "اذكر نقطة قوة والإثبات الذي يدعمها، مع رقم." ],
  iv_rep_t: [ "Your interview report", "Votre rapport d’entretien", "تقرير مقابلتك" ],
  iv_rep_sub: [ "{n|one:# question|other:# questions} · {mode}", "{n|one:# question|other:# questions} · {mode}", "{n|zero:لا أسئلة|one:سؤال واحد|two:سؤالان|few:# أسئلة|many:# سؤالاً|other:# سؤال} · {mode}" ],
  iv_rep_str: [ "Strengths", "Points forts", "نقاط القوة" ],
  iv_rep_imp: [ "To improve", "À améliorer", "ما يجب تحسينه" ],
  iv_rep_again: [ "Practise these again", "À retravailler", "تدرّب عليها من جديد" ],
  iv_rep_q: [ "Q{n}", "Q{n}", "س{n}" ],
  iv_rep_pass: [ "Show my best score on my passport", "Afficher mon meilleur score sur mon passeport", "أظهر أفضل نتيجة في جوازي" ],
  iv_rep_print: [ "Print the report", "Imprimer le rapport", "اطبع التقرير" ],
  iv_rep_retry: [ "Practise the weakest question", "Retravailler la question la plus faible", "تدرّب على أضعف سؤال" ],
  iv_mic: [ "Answer by voice", "Répondre à voix haute", "أجب بصوتك" ],
  iv_mic_on: [ "Listening… press again to stop", "Écoute en cours… appuyez à nouveau pour arrêter", "أستمع إليك… اضغط مرة أخرى للتوقّف" ],
  iv_mic_no: [ "The microphone is not available here. You can type your answer.", "Le micro n’est pas disponible ici. Vous pouvez écrire votre réponse.", "الميكروفون غير متاح هنا، ويمكنك كتابة جوابك." ],
  iv_mode_ai: [ "AI interviewer", "Simulateur IA", "محاور بالذكاء الاصطناعي" ],
  iv_mode_rules: [ "Built-in interviewer", "Simulateur intégré", "المحاور المدمج" ],
  pp_iv: [ "Mock interview", "Entretien blanc", "المقابلة التدريبية" ],
  pp_iv_d: [ "Best score {s}/100 for {role}", "Meilleur score {s}/100 pour {role}", "أفضل نتيجة {s}/100 لوظيفة {role}" ],
  u_dim_t: [ "Where students need support", "Où les étudiants ont besoin d’appui", "أين يحتاج الطلبة إلى دعم" ],
  u_dim_d: [ "Share of active students below what employers ask for", "Part des étudiants actifs sous le niveau attendu", "نسبة الطلبة النشطين دون المستوى المطلوب" ],
  u_dim1: [ "Digital skills", "Compétences numériques", "المهارات الرقمية" ],
  u_dim2: [ "Communication", "Communication", "التواصل" ],
  u_dim3: [ "Practical experience", "Expérience pratique", "الخبرة العملية" ],
  u_dim4: [ "Interview preparation", "Préparation aux entretiens", "الاستعداد للمقابلات" ],
  u_out_t: [ "Outcomes this semester", "Résultats du semestre", "نتائج هذا الأسدس" ],
  u_out_sr: [ "Self-reported", "Déclaratif", "مُصرَّح به" ],
  u_out1: [ "applied to a role", "ont postulé", "ترشّحوا لوظيفة" ],
  u_out2: [ "got an interview", "ont obtenu un entretien", "حصلوا على مقابلة" ],
  u_out3: [ "were hired", "ont été recrutés", "تمّ توظيفهم" ],
  u_out_d: [ "Reported by students in their passport. Used to measure the effect of each workshop, not to rank students.", "Déclaré par les étudiants dans leur passeport. Sert à mesurer l’effet de chaque atelier, pas à classer les étudiants.", "يصرّح به الطلبة في جوازهم، ويُستعمل لقياس أثر كل ورشة، لا لترتيب الطلبة." ],
  tk_removed: [ "{skill} removed from your passport", "Compétence retirée : {skill}", "حُذفت مهارة {skill} من جوازك" ],
  undo: [ "Undo", "Annuler", "تراجع" ],
  ks_t: [ "Keyboard shortcuts", "Raccourcis clavier", "اختصارات لوحة المفاتيح" ],
  ks_pal: [ "Search and go anywhere", "Rechercher et aller partout", "ابحث وانتقل إلى أي مكان" ],
  ks_search: [ "Open search", "Ouvrir la recherche", "افتح البحث" ],
  ks_keys: [ "Show these shortcuts", "Afficher ces raccourcis", "اعرض هذه الاختصارات" ],
  ks_esc: [ "Close a window or menu", "Fermer une fenêtre ou un menu", "أغلق نافذة أو قائمة" ],
  ks_tab: [ "Move between controls", "Passer d’un élément à l’autre", "التنقّل بين العناصر" ],
  vi_why_by: [ "SKILMA", "SKILMA", "سكيلما" ],
  vi_close: [ "Not just career guidance. A path from what you can do to a real opportunity.", "Plus qu’une orientation : un chemin de ce que vous savez faire à une vraie opportunité.", "ليست مجرّد توجيه مهني، بل طريق من قدرتك إلى فرصة حقيقية." ],
  nd7: [ "Every possible mentorship feature", "Toutes les formes de mentorat", "كل أشكال الإرشاد" ],
  nd8: [ "Every certification system", "Tous les systèmes de certification", "كل أنظمة الشهادات" ],
  rm_later: [ "Later", "Plus tard", "لاحقاً" ],
  rm_m1: [ "months 1–3", "mois 1 à 3", "الأشهر 1–3" ],
  rm_m2: [ "months 3–6", "mois 3 à 6", "الأشهر 3–6" ],
  rm_m3: [ "months 6–9", "mois 6 à 9", "الأشهر 6–9" ],
  rm_m4: [ "months 9–12", "mois 9 à 12", "الأشهر 9–12" ],
  rm_m5: [ "year 2+", "année 2 et après", "السنة الثانية وما بعدها" ],
  rm5t: [ "Region", "Région", "التوسّع الإقليمي" ],
  rm5d: [ "Morocco first, then MENA, Africa and emerging markets: infrastructure for career mobility.", "Le Maroc d’abord, puis la région MENA, l’Afrique et les marchés émergents : une infrastructure pour la mobilité professionnelle.", "المغرب أولاً، ثم الشرق الأوسط وشمال إفريقيا، فإفريقيا والأسواق الناشئة: بنية تحتية للحراك المهني." ],
  rm5f1: [ "Arabic, French, English, and stories in Darija", "Arabe, français, anglais, et récits en darija", "العربية والفرنسية والإنجليزية، والقصص بالدارجة" ],
  rm5f2: [ "Skills taxonomy adapted per country", "Référentiel de compétences adapté par pays", "مرجع مهارات مكيَّف حسب كل بلد" ],
  rm5f3: [ "Partnerships with regional institutions", "Partenariats avec des établissements de la région", "شراكات مع مؤسسات المنطقة" ],
  rms_vis: [ "Vision", "Vision", "رؤية" ],
  set_plan: [ "Access", "Accès", "الولوج" ],
  set_plan_free: [ "Accompaniment", "Accompagnement", "المواكبة" ],
  set_plan_free_d: [ "If you study far from big cities or face barriers, ask for a local partner to follow your path with you.", "Si vous étudiez loin des grandes villes ou rencontrez des obstacles, demandez qu’un partenaire local suive votre parcours avec vous.", "إن كنت تدرس بعيداً عن المدن الكبرى أو تواجه صعوبات، فاطلب أن يتابع شريك محلي مسارك معك." ],
  f_remote: [ "Remote", "À distance", "عن بُعد" ],
  o_a_emp: [ "Employer waitlist: {x}", "Liste d’attente employeurs : {x}", "قائمة انتظار أصحاب العمل: {x}" ],
  o_a_partner: [ "Partner offer: {x}", "Offre de partenaire : {x}", "عرض شريك: {x}" ],
  im_h_pub: [ "Wherever you study, SKILMA comes with you.", "Où que vous étudiiez, SKILMA vous accompagne.", "أينما كنت تدرس، سكيلما معك." ],
  im_d_pub: [ "For every 10 students who join, a local partner accompanies one more student from a remote area, step by step. If that student is you, ask for it.", "Pour 10 étudiants inscrits, un partenaire local accompagne pas à pas un étudiant de plus venant d’une zone éloignée. Si c’est vous, demandez-le.", "مقابل كل 10 طلبة ينضمّون، يرافق شريك محلي طالباً آخر من منطقة نائية خطوة بخطوة. إن كنت ذلك الطالب، فاطلب المواكبة." ],
  si_ex_t: [ "Explore an example account", "Explorer un compte exemple", "استكشف حساباً نموذجياً" ],
  foot_note_pub: [ "The opportunities shown are examples.", "Les opportunités présentées sont des exemples.", "الفرص المعروضة أمثلة." ],
  pub_brand: [ "Brand", "Marque", "الهوية البصرية" ],
  pub_inst_nav: [ "Institutions", "Établissements", "المؤسسات" ],
  bk_h1: [ "One mark. A road to a north star.", "Un signe. Une route vers une étoile.", "علامة واحدة، وطريق نحو النجم." ],
  bk_sub: [ "The SKILMA mark is an S drawn as a road. It climbs toward a gold star: the way from where a student is to where they can go.", "Le signe de SKILMA est un S tracé comme une route. Il monte vers une étoile d’or : le chemin de là où l’étudiant se trouve à là où il peut aller.", "علامة سكيلما حرف S مرسوم على شكل طريق، يصعد نحو نجم ذهبي: الطريق من حيث يقف الطالب إلى حيث يستطيع أن يصل." ],
  bk_t1: [ "Primary · on paper", "Principal · sur papier", "الأساسية · على خلفية فاتحة" ],
  bk_t2: [ "Reversed · on SKILMA green", "Inversé · sur le vert SKILMA", "معكوسة · على أخضر سكيلما" ],
  bk_t3: [ "Night · dark mode", "Nuit · mode sombre", "ليلي · الوضع الداكن" ],
  bk_m_k: [ "Meaning", "Sens", "المعنى" ],
  bk_m_h: [ "Three ideas in one shape.", "Trois idées dans une seule forme.", "ثلاث أفكار في شكل واحد." ],
  bk_m1t: [ "The S", "Le S", "حرف S" ],
  bk_m1d: [ "S for skills: SKILMA’s initial. Everything here starts from what a student can already do.", "S comme skills, l’initiale de SKILMA. Tout part de ce que l’étudiant sait déjà faire.", "S كما في كلمة skills أي المهارات، وهو الحرف الأول من سكيلما. كل شيء يبدأ مما يستطيع الطالب فعله الآن." ],
  bk_m2t: [ "The road", "La route", "الطريق" ],
  bk_m2d: [ "The S is the road itself: two bends, always climbing. Progress is never straight, but it always moves forward.", "Le S est la route elle-même : deux virages, toujours en montée. Le progrès n’est jamais rectiligne, mais il avance toujours.", "حرف S هو الطريق نفسه: منعطفان وصعود دائم. فالتقدّم لا يسير في خط مستقيم، لكنه يمضي دائماً إلى الأمام." ],
  bk_m3t: [ "The north star", "L’étoile polaire", "النجم الدليل" ],
  bk_m3d: [ "The goal at the top. A road needs a direction; the star is that direction.", "Le but, tout en haut. Une route a besoin d’une direction ; l’étoile est cette direction.", "الهدف في الأعلى. كل طريق يحتاج إلى اتجاه، والنجم هو ذلك الاتجاه." ],
  bk_l_k: [ "Lockups", "Assemblages", "الصيغ" ],
  bk_l_h: [ "The mark with its name", "Le signe et son nom", "العلامة مع الاسم" ],
  bk_l_sub: [ "Latin name in English and French, Arabic name first in Arabic, Tifinagh as a companion in Tamazight. The app icon keeps only the mark.", "Nom latin en anglais et en français, nom arabe en premier en arabe, tifinagh en accompagnement en tamazight. L’icône d’application ne garde que le signe.", "الاسم اللاتيني بالإنجليزية والفرنسية، والاسم العربي أولاً بالعربية، وتيفيناغ مرافِقاً بالأمازيغية. وتحتفظ أيقونة التطبيق بالعلامة وحدها." ],
  bk_c_k: [ "Colour", "Couleurs", "الألوان" ],
  bk_c_h: [ "Four colours, used sparingly.", "Quatre couleurs, utilisées avec mesure.", "أربعة ألوان، تُستعمل باعتدال." ],
  bk_c1: [ "SKILMA green", "Vert SKILMA", "أخضر سكيلما" ],
  bk_c2: [ "Star gold", "Or de l’étoile", "ذهبي النجم" ],
  bk_c3: [ "Paper", "Papier", "الورقي" ],
  bk_c4: [ "Night", "Nuit", "الليلي" ],
  bk_r_k: [ "Usage", "Usage", "الاستعمال" ],
  bk_r_h: [ "Keep it simple.", "Restez simple.", "ببساطة." ],
  bk_do: [ "Do", "À faire", "افعل" ],
  bk_do1: [ "Leave clear space equal to the star’s height around the mark", "Laissez autour du signe un espace égal à la hauteur de l’étoile", "اترك حول العلامة فراغاً يساوي ارتفاع النجم" ],
  bk_do2: [ "Use green or paper-white for the body, gold only for the star", "Utilisez le vert ou le blanc papier pour le corps, l’or seulement pour l’étoile", "استعمل الأخضر أو الأبيض الورقي للجسم، والذهبي للنجم فقط" ],
  bk_do3: [ "Keep the mark at least 20 px high on screen", "Gardez le signe à au moins 20 px de haut à l’écran", "لا يقلّ ارتفاع العلامة على الشاشة عن 20 بكسل" ],
  bk_dont: [ "Don’t", "À éviter", "تجنّب" ],
  bk_dont1: [ "Stretch, rotate or outline the mark", "Étirer, faire pivoter ou détourer le signe", "تمديد العلامة أو تدويرها أو تحويلها إلى خطوط" ],
  bk_dont2: [ "Fill the road or the star with other colours", "Remplir la route ou l’étoile d’autres couleurs", "تلوين الطريق أو النجم بألوان أخرى" ],
  bk_dont3: [ "Place it on busy photos without a solid background", "La poser sur une photo chargée sans fond uni", "وضعها على صور مزدحمة دون خلفية موحّدة" ],
  bk_dl1: [ "Mark (SVG)", "Signe (SVG)", "العلامة (SVG)" ],
  bk_dl2: [ "White mark (SVG)", "Signe blanc (SVG)", "العلامة البيضاء (SVG)" ],
  bk_dl3: [ "App icon (SVG)", "Icône d’application (SVG)", "أيقونة التطبيق (SVG)" ],
  ex_pf_pbi: [ "A two-chart Power BI dashboard on the family shop’s monthly sales", "Un tableau de bord Power BI de deux graphiques sur les ventes mensuelles de la boutique", "لوحة Power BI من رسمين لمبيعات المتجر الشهرية" ],
  ex_pf_sql: [ "Ten working SQL queries on a sample sales database, each with its question", "Dix requêtes SQL fonctionnelles sur une base de ventes, chacune avec sa question", "عشرة استعلامات SQL تعمل على قاعدة بيانات مبيعات، لكل منها سؤاله" ],
  ex_pf_xl: [ "Monthly stock and sales tracker with pivot tables, 24 months of data", "Suivi mensuel du stock et des ventes avec tableaux croisés, 24 mois de données", "متابعة شهرية للمخزون والمبيعات بجداول محورية لمدة 24 شهراً" ],
  try_ex_res: [ "Example: what SKILMA reads in Sara’s story", "Exemple : ce que SKILMA lit dans le récit de Sara", "مثال: ما تقرؤه سكيلما في قصة سارة" ],
  imp_eq: [ "For every 10 students who join, one more from a remote area is accompanied", "Pour 10 étudiants inscrits, un de plus d’une zone éloignée est accompagné", "مقابل كل 10 طلبة ينضمّون، يُواكَب طالب آخر من منطقة نائية" ],
  sts_ver: [ "Verified", "Vérifiée", "موثّقة" ],
  sts_proven: [ "With proof", "Avec preuve", "مع دليل" ],
  sts_conf: [ "Confirmed", "Confirmée", "مؤكَّدة" ],
  si_sub_pub: [ "No account, no password: your passport is saved on this device.", "Pas de compte, pas de mot de passe : votre passeport est enregistré sur cet appareil.", "بلا حساب ولا كلمة مرور: يُحفظ جوازك على هذا الجهاز." ],
  si_or_pub: [ "or explore first", "ou explorez d’abord", "أو استكشف أولاً" ],
  ph_contact: [ "name@example.com / 06…", "nom@exemple.ma / 06…", "name@example.com / 06…" ],
  pb_sub: [ "The gap is not effort. It is the distance between a diploma and what the job asks for.", "Le problème n’est pas l’effort. C’est l’écart entre le diplôme et ce que demande l’emploi.", "المشكلة ليست في الجهد، بل في المسافة بين الشهادة وما يطلبه سوق الشغل." ],
  pb_par_k: [ "Unemployment rate by diploma", "Taux de chômage selon le diplôme", "معدل البطالة حسب الشهادة" ],
  pb_par_h: [ "The higher the diploma, the higher the unemployment.", "Plus le diplôme est élevé, plus le chômage l’est aussi.", "كلما ارتفعت الشهادة، ارتفعت البطالة." ],
  pb_d1: [ "Advanced", "Avancé", "عليا" ],
  pb_d2: [ "Intermediate", "Intermédiaire", "متوسطة" ],
  pb_d3: [ "Basic", "De base", "أساسية" ],
  pb_d4: [ "None", "Aucun", "بدون شهادة" ],
  pb_youth: [ "of 15–24 year-olds are unemployed", "des 15-24 ans sont au chômage", "من الشباب بين 15 و24 سنة عاطلون عن العمل" ],
  pb_under: [ "of Morocco’s workforce is underused", "de la main-d’œuvre du Maroc est sous-utilisée", "من القوى العاملة في المغرب غير مستغلة بالكامل" ],
  pb_under_y: [ "{p} among 15–24 year-olds", "{p} chez les 15-24 ans", "وتصل إلى {p} لدى الشباب بين 15 و24 سنة" ],
  sv_k: [ "What students told us", "Ce que les étudiants nous ont dit", "ما قاله لنا الطلبة" ],
  sv_h: [ "We asked 86 students and graduates.", "Nous avons interrogé 86 étudiants et diplômés.", "سألنا 86 طالباً وخريجاً." ],
  sv1: [ "had no interview in six months", "n’ont eu aucun entretien en six mois", "لم يحصلوا على أي مقابلة خلال ستة أشهر" ],
  sv2: [ "have never used their career centre", "n’ont jamais utilisé le centre d’orientation de leur établissement", "لم يستعملوا قط مركز التوجيه في مؤسستهم" ],
  sv3: [ "would do a practical task to prove a skill", "feraient une tâche pratique pour prouver une compétence", "مستعدون لإنجاز مهمة تطبيقية تثبت مهاراتهم" ],
  sv4: [ "rate the idea 4 or 5 out of 5", "donnent 4 ou 5 sur 5 à l’idée", "منحوا الفكرة 4 أو 5 من 5" ],
  sv_src: [ "SKILMA field survey, 2–12 October 2026 · 46 final-year students and 40 graduates, mostly in Tétouan and Tangier.", "Enquête terrain SKILMA, 2-12 octobre 2026 · 46 étudiants en dernière année et 40 diplômés, surtout à Tétouan et Tanger.", "استبيان سكيلما الميداني، من 2 إلى 12 أكتوبر 2026 · 46 طالباً في سنة التخرج و40 خريجاً، أغلبهم من تطوان وطنجة." ],
  cl8a: [ "Official unemployment figures (HCP, Q3 2026), each with its source.", "Chiffres officiels du chômage (HCP, T3 2026), chacun avec sa source.", "أرقام البطالة الرسمية (المندوبية السامية للتخطيط، الفصل الثالث 2026)، كل رقم بمصدره." ],
  cl8b: [ "Everyday experiences turned into skills, right on the home page.", "Les expériences du quotidien transformées en compétences, dès l’accueil.", "تجارب الحياة اليومية تتحوّل إلى مهارات، من الصفحة الرئيسية." ],
  cl8c: [ "A readiness checklist you can read at a glance.", "Une liste de préparation lisible d’un coup d’œil.", "قائمة جاهزية تُقرأ بنظرة واحدة." ],
  si_ex_in: [ "You are exploring {name}’s example account", "Vous explorez le compte d’exemple de {name}", "أنت تتصفّح الحساب النموذجي لـ{name}" ],
  tq_k: [ "Where we are", "Où nous en sommes", "أين وصلنا" ],
  tq_h: [ "Six months: from an idea to a tested product.", "Six mois : d’une idée à un produit testé.", "ستة أشهر: من فكرة إلى منتج مُختبَر." ],
  tq1t: [ "The idea", "L’idée", "الفكرة" ],
  tq1d: [ "Defining the problem", "Définir le problème", "تحديد المشكلة" ],
  tq2t: [ "Design thinking", "Design thinking", "التفكير التصميمي" ],
  tq2d: [ "Understanding students’ needs", "Comprendre les besoins des étudiants", "فهم حاجات الطلبة" ],
  tq3t: [ "The survey", "L’enquête", "الاستبيان" ],
  tq3d: [ "86 students and graduates", "86 étudiants et diplômés", "86 طالباً وخريجاً" ],
  tq4t: [ "The product", "Le produit", "المنتج" ],
  tq4d: [ "Four connected products", "Quatre produits connectés", "أربعة منتجات مترابطة" ],
  tq5t: [ "Partnerships", "Partenariats", "الشراكات" ],
  tq_goal: [ "students: our goal for the end of year one", "étudiants : notre objectif à la fin de la première année", "طالب: هدفنا في نهاية السنة الأولى" ],
  tq_y1: [ "Year one: test, learn, build strong partnerships", "Première année : tester, apprendre, nouer des partenariats solides", "السنة الأولى: نختبر ونتعلّم ونبني شراكات قوية" ],
  tq_y2: [ "Year two: larger partners, then North Africa and the Middle East", "Deuxième année : de plus grands partenaires, puis l’Afrique du Nord et le Moyen-Orient", "السنة الثانية: شراكات أكبر، ثم شمال إفريقيا والشرق الأوسط" ],
  cx_k: [ "Alternatives", "Alternatives", "البدائل" ],
  cx_h: [ "Why SKILMA, and not another option?", "Pourquoi SKILMA, et pas une autre option ?", "لماذا سكيلما، وليس بديلاً آخر؟" ],
  cx_c1: [ "Alternative", "Alternative", "البديل" ],
  cx_c2: [ "What it does", "Ce qu’il fait", "ما يفعله" ],
  cx_c3: [ "What it misses", "Ce qui lui manque", "ما ينقصه" ],
  cx1b: [ "General advice and CVs", "Conseils généraux et CV", "نصائح وسير ذاتية عامة" ],
  cx1c: [ "No Moroccan market data, no follow-up, no proof", "Pas de données du marché marocain, ni suivi, ni preuve", "لا بيانات عن السوق المغربية، ولا متابعة ولا إثبات" ],
  cx2b: [ "AI guidance for young people", "Orientation des jeunes par l’IA", "توجيه الشباب بالذكاء الاصطناعي" ],
  cx2c: [ "General guidance, no plan tied to a specific opportunity, no proof", "Orientation générale, sans plan lié à une opportunité précise ni preuve", "توجيه عام، دون خطة مرتبطة بفرصة محددة ودون إثبات" ],
  cx3b: [ "Candidate screening for employers", "Tri des candidats pour les employeurs", "فرز المرشحين لفائدة المشغّلين" ],
  cx3c: [ "Built for the employer, not for the student before applying", "Pensé pour l’employeur, pas pour l’étudiant avant sa candidature", "محوره المشغّل، لا مرافقة الطالب قبل الترشّح" ],
  cx4b: [ "Intermediation and job offers", "Intermédiation et offres d’emploi", "الوساطة وعروض الشغل" ],
  cx4c: [ "No individual diagnosis, no personal plan", "Pas de diagnostic individuel ni de plan personnel", "لا تشخيص فردي ولا خطة شخصية" ],
  cx5b: [ "Technical training", "Formation technique", "تكوين تقني" ],
  cx5c: [ "Technical tracks only, no diagnosis or matching", "Parcours techniques uniquement, sans diagnostic ni correspondance", "مسارات تقنية فقط، دون تشخيص أو مطابقة" ],
  cx6b: [ "Skills → opportunities → gap → plan → proof", "Compétences → opportunités → écart → plan → preuve", "مهارات ← فرص ← فجوة ← خطة ← إثبات" ],
  cx6c: [ "The whole path, in Moroccans’ languages and with their market’s data", "Le parcours complet, dans les langues des Marocains et avec les données de leur marché", "المسار كاملاً، بلغات المغاربة وبيانات سوقهم" ],
  cx_src: [ "Based on our competitive study, 2026.", "D’après notre étude concurrentielle, 2026.", "حسب دراستنا التنافسية، 2026." ],
  rd_steps: [ "steps done", "étapes faites", "خطوات منجزة" ],
  rd_t: [ "Your readiness checklist", "Votre liste de préparation", "قائمة جاهزيتك" ],
  rd_conf: [ "Required skills confirmed: {a} of {b}", "Compétences requises confirmées : {a} sur {b}", "المهارات المطلوبة المؤكَّدة: {a} من {b}" ],
  rd_ev: [ "Key skills with proof: {a} of {b}", "Compétences clés avec preuve : {a} sur {b}", "المهارات الأساسية مع دليل: {a} من {b}" ],
  rd_iv: [ "One full mock interview practised", "Un entretien blanc complet réalisé", "مقابلة تدريبية كاملة أُنجزت" ],
  rd_pf: [ "Day 30 project published", "Projet du jour 30 publié", "مشروع اليوم 30 منشور" ],
  rd_ready: [ "Ready to apply", "Prêt à postuler", "جاهز للترشّح" ],
  rd_note: [ "You can apply at any time. These steps make your application stronger.", "Vous pouvez postuler à tout moment. Ces étapes renforcent votre candidature.", "يمكنك الترشّح في أي وقت، وهذه الخطوات تقوّي ترشّحك." ],
  nt_half: [ "Halfway to {x}", "À mi-chemin vers {x}", "في منتصف الطريق نحو {x}" ],
  nt_rdy: [ "Ready to apply: {x}", "Prêt à postuler : {x}", "جاهز للترشّح: {x}" ],
  od_src: [ "Example listing", "Annonce d’exemple", "إعلان نموذجي" ],
  sig_skills: [ "Skills alignment", "Adéquation des compétences", "توافق المهارات" ],
  sig_skills_d: [ "required skills you have", "compétences requises que vous avez", "مهارات مطلوبة تملكها" ],
  sig_elig: [ "Known requirements", "Exigences connues", "المتطلبات المعروفة" ],
  sig_pref: [ "Your preferences", "Vos préférences", "تفضيلاتك" ],
  el_lv_any: [ "Open to students", "Ouvert aux étudiants", "مفتوح للطلبة" ],
  el_lv_fy: [ "Final year or graduate", "Dernière année ou diplômé", "سنة التخرج أو خريج" ],
  el_lv_grad: [ "Graduates", "Diplômés", "الخريجون" ],
  el_lang: [ "Works in {l}", "Travail en {l}", "العمل باللغة {l}" ],
  el_unknown: [ "Not set", "Non renseigné", "غير محدّد" ],
  el_fill: [ "Some checks are unknown, not failed. Add your level and languages to see them.", "Certains points sont inconnus, pas manqués. Ajoutez votre niveau et vos langues pour les voir.", "بعض البنود غير معروفة، لا ناقصة. أضف مستواك ولغاتك لتظهر." ],
  el_fill_btn: [ "Add them", "Les ajouter", "أضفها" ],
  pl_ar: [ "Arabic", "arabe", "العربية" ],
  pl_fr: [ "French", "français", "الفرنسية" ],
  pl_en: [ "English", "anglais", "الإنجليزية" ],
  pl_es: [ "Spanish", "espagnol", "الإسبانية" ],
  pl_zgh: [ "Amazigh", "amazighe", "الأمازيغية" ],
  od_track: [ "Add to my applications", "Ajouter à mes candidatures", "أضف إلى ترشّحاتي" ],
  od_tracked: [ "In your applications", "Dans vos candidatures", "ضمن ترشّحاتك" ],
  od_untrack: [ "Remove", "Retirer", "إزالة" ],
  od_untracked: [ "Removed from your applications", "Retiré de vos candidatures", "أُزيل من ترشّحاتك" ],
  od_track_n: [ "Your private list. Apply on the employer’s site when you are ready.", "Votre liste privée. Postulez sur le site de l’employeur quand vous êtes prêt.", "قائمتك الخاصة. ترشّح عبر موقع المشغّل حين تكون جاهزاً." ],
  cm_aim: [ "What are you looking for?", "Que cherchez-vous ?", "ماذا تبحث عنه؟" ],
  aim_job: [ "A first job", "Un premier emploi", "أول وظيفة" ],
  aim_intern: [ "An internship", "Un stage", "تدريباً" ],
  aim_explore: [ "Not sure yet", "Je ne sais pas encore", "لست متأكداً بعد" ],
  su_year: [ "Where are you now?", "Où en êtes-vous ?", "أين وصلت الآن؟" ],
  yr_early: [ "Still studying", "En cours d’études", "ما زلت أدرس" ],
  yr_final: [ "Final year", "Dernière année", "سنة التخرج" ],
  yr_grad: [ "Graduate", "Diplômé·e", "خريج" ],
  su_langs: [ "Languages you can work in", "Langues de travail", "اللغات التي تشتغل بها" ],
  su_why: [ "Optional. Used only to check a role’s known requirements; never shown to anyone.", "Facultatif. Sert uniquement à vérifier les exigences connues d’un poste ; jamais montré à personne.", "اختياري. يُستعمل فقط للتحقّق من المتطلبات المعروفة للوظيفة، ولا يُعرض على أحد." ],
  th_fix: [ "Not quite? Choose the right skill", "Pas tout à fait ? Choisissez la bonne compétence", "ليست دقيقة؟ اختر المهارة الصحيحة" ],
  th_fix_d: [ "Pick what this sentence really shows. The suggestion is replaced, not added.", "Choisissez ce que cette phrase montre vraiment. La suggestion est remplacée, pas ajoutée.", "اختر ما تُظهره هذه الجملة فعلاً. يُستبدل الاقتراح ولا يُضاف." ],
  ht_k: [ "Trust", "Confiance", "الثقة" ],
  ht_h: [ "Every skill shows how sure it is.", "Chaque compétence montre son niveau de certitude.", "كل مهارة تُظهر مدى ثبوتها." ],
  ht_sub: [ "Four simple steps, from a suggestion to a skill your school has confirmed.", "Quatre étapes simples, d’une suggestion à une compétence confirmée par votre établissement.", "أربع خطوات بسيطة، من مجرّد اقتراح إلى مهارة أكّدتها مؤسستك." ],
  ht_more: [ "How your data is handled", "Comment vos données sont traitées", "كيف تُعالَج بياناتك" ],
  nn_k: [ "Today", "Aujourd’hui", "اليوم" ],
  nn_sub: [ "Everything below works in your browser today. What needs partners and servers comes next.", "Tout ce qui suit fonctionne aujourd’hui dans votre navigateur. Ce qui demande des partenaires et des serveurs vient ensuite.", "كل ما يلي يعمل اليوم في متصفحك، وما يحتاج إلى شركاء وخوادم يأتي لاحقاً." ],
  nn_next: [ "Comes next, with partners", "Ensuite, avec des partenaires", "لاحقاً، مع الشركاء" ],
  nn_n1: [ "Reading skills from your own story", "Lecture des compétences dans votre récit", "قراءة المهارات من قصتك" ],
  nn_n2: [ "A Skills Passport you control and can share", "Un passeport de compétences que vous contrôlez et partagez", "جواز مهارات تتحكّم فيه وتشاركه" ],
  nn_n3: [ "Matching against sample roles, with each check explained", "Correspondance avec des postes d’exemple, chaque critère expliqué", "مطابقة مع وظائف نموذجية، مع شرح كل معيار" ],
  nn_n4: [ "A 30-day path that ends with a project", "Un parcours de 30 jours qui finit par un projet", "مسار من 30 يوماً ينتهي بمشروع" ],
  nn_n5: [ "Mock interviews with written feedback", "Entretiens blancs avec retour écrit", "مقابلات تدريبية مع ملاحظات مكتوبة" ],
  nn_n6: [ "An institution console with sample data", "Une console établissement avec des données d’exemple", "لوحة للمؤسسات ببيانات نموذجية" ],
  nn_x1: [ "Real opportunities, from partner employers", "De vraies opportunités, d’employeurs partenaires", "فرص حقيقية من مشغّلين شركاء" ],
  nn_x2: [ "Verification by partner institutions", "La vérification par des établissements partenaires", "التحقّق من طرف مؤسسات شريكة" ],
  nn_x3: [ "Accounts and secure storage across devices", "Des comptes et un stockage sécurisé sur tous vos appareils", "حسابات وتخزين آمن على كل الأجهزة" ],
  nn_x4: [ "A Tamazight interface, reviewed by native speakers", "Une interface en tamazight, relue par des locuteurs natifs", "واجهة بالأمازيغية يراجعها ناطقون بها" ],
  fq9: [ "I study far from big cities. Can I get help?", "J’étudie loin des grandes villes. Puis-je être aidé ?", "أدرس بعيداً عن المدن الكبرى. هل يمكنني الحصول على دعم؟" ],
  fq9a: [ "Yes. Ask for accompaniment: a local partner helps you start and follows your path with you.", "Oui. Demandez un accompagnement : un partenaire local vous aide à démarrer et suit votre parcours.", "نعم. اطلب المواكبة: يساعدك شريك محلي على البداية ويتابع مسارك معك." ],
  h4_a: [ "Discover", "Découvrez", "اكتشف" ],
  h4_b: [ "what you can do,", "ce que vous savez faire,", "ما تستطيع فعله،" ],
  h4_c: [ "not just what you studied.", "pas seulement ce que vous avez étudié.", "لا ما درسته فقط." ],
  ls_k: [ "Everyday life is full of skills", "La vie de tous les jours est pleine de compétences", "الحياة اليومية مليئة بالمهارات" ],
  ls_shop: [ "The family shop", "La boutique familiale", "متجر العائلة" ],
  ls_club: [ "A student club", "Un club étudiant", "نادٍ طلابي" ],
  ls_summer: [ "A summer job", "Un job d’été", "عمل صيفي" ],
  ls_vol: [ "Volunteering", "Le bénévolat", "العمل التطوعي" ],
  ls_class: [ "A class project", "Un projet de cours", "مشروع دراسي" ],
  ls_insta: [ "An Instagram page", "Une page Instagram", "صفحة على إنستغرام" ],
  ls_guest: [ "Welcoming tourists", "Accueillir des touristes", "استقبال السياح" ],
  ls_team: [ "Team captain", "Capitaine d’équipe", "قائد الفريق" ],
  ls_tutor: [ "Tutoring a cousin", "Aider un cousin à réviser", "مساعدة قريب في الدراسة" ],
  ls_stall: [ "A market stall", "Un stand au souk", "فرشة في السوق" ],
  ls_survey: [ "A class survey", "Un sondage en classe", "استطلاع في القسم" ],
  nav_more: [ "More", "Plus", "المزيد" ],
  iv_prev: [ "The five questions", "Les cinq questions", "الأسئلة الخمسة" ],
  oim_followed: [ "Students accompanied", "Étudiants accompagnés", "طلبة تتمّ مواكبتهم" ],
  oim_followed_d: [ "followed by a local partner", "suivis par un partenaire local", "يتابعهم شريك محلي" ],
  oim_wait: [ "Requests waiting", "Demandes en attente", "طلبات في الانتظار" ],
  oim_regions: [ "Regions reached", "Régions couvertes", "جهات مشمولة" ],
  oim_regions_d: [ "places named in requests", "lieux cités dans les demandes", "أماكن ذُكرت في الطلبات" ],
  ax_sk: [ "Skills it proves", "Compétences démontrées", "المهارات التي تُثبتها" ],
  lp_uni_d: [ "See which skills your students can prove, where they get stuck and which action helps most. No individual student is visible without their consent.", "Voyez quelles compétences vos étudiants démontrent, où ils bloquent et quelle action aide le plus. Aucun étudiant n’est visible individuellement sans son accord.", "اعرفوا المهارات التي يُثبتها طلبتكم، وأين يتعثّرون، وأيّ تدخّل أنفع لهم، دون الاطلاع على أي طالب لم يشارك بياناته." ],
  h_sub: [ "SKILMA reads your real experience, shows the skills it proves, and builds a 30-day path to your first opportunity.", "SKILMA lit votre expérience réelle, identifie les compétences qu’elle démontre et construit un parcours de 30 jours vers votre première opportunité.", "تقرأ سكيلما تجربتك الحقيقية، وتُظهر المهارات التي تُثبتها، ثم تبني لك مسار 30 يوماً نحو أول فرصة." ],
  hm_sub: [ "Describe what you did. SKILMA shows the skills it proves, where they lead and the next step.", "Décrivez ce que vous avez fait. SKILMA montre les compétences démontrées, où elles mènent et la prochaine étape.", "صِف ما قمت به. تُظهر سكيلما المهارات التي يُثبتها، وإلى أين تقود، والخطوة التالية." ],
  si_uni_d: [ "Boughaz University career centre (fictional).", "Service carrière de l’Université du Boughaz (fictive).", "مركز التوجيه المهني بجامعة البوغاز (افتراضية)." ],
  ch2d: [ "The skills it shows", "Les compétences qu’elle démontre", "المهارات التي تُظهرها" ],
  hw4d: [ "One task of 15 to 30 minutes a day: learn, practise, prove. Day 30 is a portfolio project.", "Une tâche de 15 à 30 minutes par jour : apprendre, pratiquer, démontrer. Le jour 30, un projet de portfolio.", "مهمة واحدة من 15 إلى 30 دقيقة يومياً: تعلّم، ثم تدرّب، ثم أثبِت. وفي اليوم الثلاثين مشروع لملف أعمالك." ],
  hw5t: [ "Prove you are ready", "Démontrez votre préparation", "أثبِت جاهزيتك" ],
  em_f2d: [ "Projects, dashboards and recordings, each linked to the skill it shows.", "Projets, tableaux de bord et enregistrements, chacun relié à la compétence qu’il démontre.", "مشاريع ولوحات قيادة وتسجيلات، يرتبط كل منها بالمهارة التي يثبتها." ],
  usi_t_pub: [ "See the institution console", "Découvrir la console établissement", "اكتشفوا لوحة المؤسسة" ],
  usi_d_pub: [ "A sample university with example data: the weekly priorities, groups and verifications a career centre works with.", "Un établissement exemple avec des données d’exemple : priorités de la semaine, groupes et vérifications d’un service carrière.", "جامعة نموذجية ببيانات نموذجية: أولويات الأسبوع والمجموعات والتوثيقات التي يعمل بها مركز التوجيه." ],
  csi_demo_pub: [ "Institution accounts open with each pilot.", "Les comptes établissement ouvrent avec chaque pilote.", "تُفتح حسابات المؤسسات مع كل تجربة نموذجية." ],
  cert_title_p: [ "Progress certificate", "Attestation de progression", "شهادة تقدّم" ],
  cert_body_p: [ "has completed {d}/30 days of the path for", "a réalisé {d}/30 jours du parcours pour", "أنجز {d}/30 يوماً من مسار الجاهزية لوظيفة" ],
  q3b: [ "{skill} is already in your passport. How would you take it further in this role?", "{skill} figure déjà dans votre passeport. Comment iriez-vous plus loin dans ce poste ?", "مهارة {skill} موجودة في جوازك. كيف ستطوّرها أكثر في هذه الوظيفة؟" ],
  ev_done: [ "Step completed", "Étape terminée", "خطوة منجزة" ],
  pg_path_proven: [ "Path skills with proof", "Compétences du parcours avec preuve", "مهارات المسار التي لها دليل" ],
  ex_pf_proj: [ "Power BI dashboard on HCP open data: 3 charts and a one-page summary (PDF)", "Tableau de bord Power BI sur les données ouvertes du HCP : 3 graphiques et une synthèse d’une page (PDF)", "لوحة Power BI ببيانات المندوبية السامية للتخطيط المفتوحة: 3 رسوم وملخص من صفحة واحدة (PDF)" ],
  ls_play: [ "Play animation", "Relancer l’animation", "شغّل الحركة" ],
  mt_have: [ "Required skills you have", "Compétences requises que vous avez", "المهارات المطلوبة التي تملكها" ],
  mt_req: [ "Required skills", "Compétences requises", "المهارات المطلوبة" ],
  mt_conf: [ "Each required skill confirmed", "Chaque compétence requise confirmée", "تأكيد كل مهارة مطلوبة" ],
  csv_metric: [ "Indicator", "Indicateur", "المؤشر" ],
  csv_value: [ "Value", "Valeur", "القيمة" ],
  csv_signer: [ "Signed by", "Signé par", "الموقّع" ],
  csv_st_ver: [ "Verified", "Vérifiée", "موثّقة" ],
  csv_st_more: [ "More information requested", "Informations demandées", "طُلبت معلومات إضافية" ],
  ou_access_l: [ "Access for {x}", "Accès de {x}", "صلاحية دخول {x}" ],
  u_ins_d_rules: [ "SKILMA’s built-in reader reads this semester’s anonymised figures and suggests next steps.", "Le lecteur intégré de SKILMA analyse les chiffres anonymisés du semestre et propose des actions.", "يقرأ المحلّل المدمج في سكيلما أرقام هذا الأسدس المجهولة الهوية، ويقترح الخطوات التالية." ],
  cl9a: [ "The site is now in Arabic, French and English, and still reads stories written in Darija.", "Le site est désormais en arabe, français et anglais, et lit toujours les récits écrits en darija.", "أصبح الموقع بالعربية والفرنسية والإنجليزية، ويواصل قراءة القصص المكتوبة بالدارجة." ],
  cl9b: [ "Accompaniment for students far from big cities: a local partner helps you start.", "Accompagnement des étudiants loin des grandes villes : un partenaire local vous aide à démarrer.", "مواكبة الطلبة البعيدين عن المدن الكبرى: شريك محلي يساعدك على البداية." ],
  cl9c: [ "Clearer numbers: roles are sorted by the skills you have, and every count says what it counts.", "Des chiffres plus clairs : les postes sont classés selon vos compétences, et chaque compte dit ce qu’il compte.", "أرقام أوضح: تُرتَّب الوظائف حسب المهارات التي تملكها، وكل عدد يوضّح ما يعدّه." ],
  hours_ago: [ "{n|one:# hour ago|other:# hours ago}", "{n|one:il y a # heure|other:il y a # heures}", "{n|zero:الآن|one:منذ ساعة|two:منذ ساعتين|few:منذ # ساعات|many:منذ # ساعة|other:منذ # ساعة}" ],
  ch_pass_n: [ "{n|one:skill|other:skills}", "{n|one:compétence|other:compétences}", "{n|zero:مهارة|one:مهارة|two:مهارتان|few:مهارات|many:مهارة|other:مهارة}" ],
  fb_ok_pub: [ "Thank you. Your note is saved on this device.", "Merci. Votre message est enregistré sur cet appareil.", "شكراً. حُفظت ملاحظتك على هذا الجهاز." ],
  osi_sample: [ "Sample console: explore with example data. Every action is recorded in the audit log.", "Console exemple : explorez avec des données d’exemple. Chaque action est enregistrée dans le journal d’audit.", "لوحة نموذجية: استكشف ببيانات نموذجية، وكل إجراء يُسجَّل في سجل التدقيق." ]
}, ZGH = {}, TXZ = {}, NAMEZ = {
  "Rania Alaoui": "ⵔⴰⵏⵢⴰ ⵍⵄⴰⵍⴰⵡⵉ",
  "Youssef Bennani": "ⵢⵓⵙⴼ ⴱⵏⵏⴰⵏⵉ",
  "Imane Mansouri": "ⵉⵎⴰⵏ ⵍⵎⴰⵏⵚⵓⵔⵉ",
  "Hamza Kadiri": "ⵃⴰⵎⵣⴰ ⵍⵇⴰⴷⵉⵔⵉ",
  "Khadija Ouazzani": "ⵅⴰⴷⵉⵊⴰ ⵍⵡⴰⵣⵣⴰⵏⵉ",
  "Mehdi Tazi": "ⵍⵎⵀⴷⵉ ⵜⵜⴰⵣⵉ",
  "Aya Berrada": "ⴰⵢⴰ ⴱⵕⵕⴰⴷⴰ",
  "Omar Chraibi": "ⵄⵓⵎⴰⵔ ⵛⵛⵔⴰⵢⵉⴱⵉ",
  "Nour Fassi": "ⵏⵓⵔ ⵍⴼⴰⵙⵉ",
  "Reda Idrissi": "ⵔⵉⴹⴰ ⵍⵉⴷⵔⵉⵙⵉ",
  "Rania A.": "ⵔⴰⵏⵢⴰ ⵄ.",
  "Youssef B.": "ⵢⵓⵙⴼ ⴱ.",
  "Imane M.": "ⵉⵎⴰⵏ ⵎ.",
  "Hamza K.": "ⵃⴰⵎⵣⴰ ⵇ.",
  "Leila Haddad": "ⵍⴰⵢⵍⴰ ⵃⴷⴷⴰⴷ",
  "Anas Ziani": "ⴰⵏⴰⵙ ⵣⵣⴰⵢⴰⵏⵉ",
  "Atlas Business School": "ⵜⵉⵏⵎⵍ ⵏ ⵜⵏⴱⴰⴹⵜ ⵏ ⵡⴰⵟⵍⴰⵙ",
  "Saïs Training Centre": "ⴰⵎⵎⴰⵙ ⵏ ⵓⵙⵎⵎⵕ ⵏ ⵙⴰⵢⵉⵙ",
  "Centre de formation du Saïs": "ⴰⵎⵎⴰⵙ ⵏ ⵓⵙⵎⵎⵕ ⵏ ⵙⴰⵢⵉⵙ",
  "Assafir Telecom": "ⴰⵙⵙⴰⴼⵉⵔ ⵜⵉⵍⵉⴽⵓⵎ",
  "Boughaz Logistics": "ⵍⴱⵓⵖⴰⵣ ⵍⵓⵊⵉⵙⵜⵉⴽ",
  "Dataverse Maroc": "ⴷⴰⵜⴰⵠⵉⵔⵙ ⵍⵎⵖⵔⵉⴱ",
  "Jisr Association": "ⵜⴰⵎⵙⵎⵓⵏⵜ ⵏ ⵊⵉⵙⵔ",
  "Majal Studies": "ⵎⴰⵊⴰⵍ ⵙⵜⴰⴷⵉⵣ",
  "Medina Events": "ⵎⴰⴷⵉⵏⴰ ⵉⵠⵉⵏⵜⵙ",
  "Noujoum Finance": "ⵏⵓⵊⵓⵎ ⴼⵉⵏⴰⵏⵙ",
  "Nour Studio": "ⵏⵓⵔ ⵙⵜⴰⴷⵢⵓ",
  "Pixel Atlas": "ⵒⵉⴽⵙⵍ ⴰⵟⵍⴰⵙ",
  "Qantara Retail": "ⵇⴰⵏⵟⴰⵔⴰ ⵔⵉⵜⵉⵍ",
  "Saïs Foods": "ⵙⴰⵢⵉⵙ ⴼⵓⴷⵣ",
  "Tanmia B2B": "ⵜⴰⵏⵎⵢⴰ B2B"
};

EXAMPLE.zgh = "ⵜⵜⵖⵔⵖ ⴰⵙⴳⴳⵯⴰⵙ ⴰⵏⴳⴳⴰⵔⵓ ⵏ ⵜⴷⴰⵎⵙⴰ ⴷ ⵓⵙⴼⵔⴽ ⴳ ⵜⵉⵟⵟⴰⵡⵉⵏ. ⵙⴳ ⵙⵉⵏ ⵉⵙⴳⴳⵯⴰⵙⵏ ⴰⵔ ⵜⵜⴹⴼⴰⵔⵖ ⴰⵣⵣⵏⵣⵉ ⴷ ⵓⵙⵖⴱⴰⵍⵓ ⵏ ⵜⵃⴰⵏⵓⵜ ⵏ ⵜⵡⴰⵛⵓⵍⵜ ⴳ Excel, ⵙ ⵜⴼⵍⵡⵉⵏ ⵏ ⵜⵙⵍⵍⵖⵜ ⴷ ⵢⴰⵏ ⵓⴹⵔⵉⵙ ⴳ ⵡⴰⵢⵓⵔ. ⴳ ⵜⵡⴷ ⵏ ⵉⵎⴰⵍⴰⵙ ⴰⵔ ⵜⵜⵎⵎⴰⴳⴰⵔⵖ ⵉⵎⵙⴰⵖⵏ, ⴰⵔ ⵜⵜⵣⵣⵏⵣⵖ. ⵎⵍⵎⵉ ⵉⵄⵟⵟⵍ ⵢⴰⵏ ⵓⵎⵣⵣⵏⵣ, ⴼⵔⵓⵖ ⵜⴰⵎⵓⴽⵔⵉⵙⵜ ⵙ ⵢⴰⵏ ⵓⵎⵣⵣⵏⵣ ⵡⵉⵙ ⵙⵉⵏ, ⵎⵎⵙⴰⵙⴰⵖ ⵖⴼ ⵓⵣⵎⵣ ⵏ ⵓⵙⵉⴼⴹ. ⴳ ⵜⵎⵙⵉⵔⵜ ⵏ ⵓⵙⵎⵎⵔⵙ, ⵙⴽⵔⵖ ⵢⴰⵏ ⵓⵙⵇⵙⵉ ⵉ 60 ⵏ ⵉⵏⵍⵎⴰⴷⵏ, ⵙⵙⴽⴰⵏⵖ ⵉⴳⵎⵎⴰⴹⵏ ⵣⴰⵜ ⵢⴰⵜ ⵜⴳⵔⴰⵡⵜ.", 
STARTERS.zgh = [ "ⴰⵔ ⵜⵜⵄⴰⵡⴰⵏⵖ ⴳ ⵜⵃⴰⵏⵓⵜ ⵏ ⵜⵡⴰⵛⵓⵍⵜ. ", "ⵙⵙⵓⴷⵙⵖ ⵢⴰⵜ ⵜⵡⵓⵔⵉ ⴳ ⵜⵙⴷⴰⵡⵉⵜ. ", "ⴰⵔ ⵙⵙⵓⴷⵓⵙⵖ ⵢⴰⵜ ⵜⴰⵙⵏⴰ ⴳ Instagram. " ];

const ARY = {}, TXA = {};

EXAMPLE.ary = "أنا فالعام الأخير ديال الاقتصاد والتسيير فتطوان. هادي عامين وأنا كنتبّع المبيعات والستوك ديال الحانوت ديال العائلة فإكسيل، بجداول محورية وتقرير كل شهر. فالويكاند كنستقبل الكليان وكنبيع. ملي تعطّل واحد الفورنيسور، حليت المشكل: لقيت فورنيسور آخر وتفاوضت معاه على مواعيد جداد ديال التسليم. وفمادة التسويق درت سونداج على 60 طالب، وقدّمت النتائج قدام لجنة.", 
STARTERS.ary = [ "كنعاون فالحانوت ديال العائلة. ", "نظّمت نشاط فالجامعة. ", "كنسيّر صفحة فإنستغرام. " ];

const KEY = "skilma.v1", PUBLIC = BUILD === "public", LANGS = [ "ar", "fr", "en" ], LANGS3 = [ "en", "fr", "ar" ], blank = () => ({
  lang: null,
  role: "student",
  stage: "landing",
  screen: "home",
  draft: "",
  profile: {
    name: "",
    field: ""
  },
  stories: [],
  skills: {},
  custom: {},
  goal: null,
  plan: null,
  iv: null,
  ivBest: {},
  applied: {},
  portfolio: [],
  chat: [],
  log: [],
  verify: {
    status: "none",
    at: 0
  },
  notices: [],
  uni: {
    handled: {},
    insights: null,
    insightsAI: !1,
    minGroup: 10,
    log: []
  },
  prefs: {
    sound: !1,
    voice: !1,
    calm: !1,
    lite: !1,
    fs: 1,
    theme: "system"
  },
  created: Date.now(),
  events: [],
  runs: [],
  decisions: {},
  discSave: null,
  pno: null,
  auth: {
    uni: !1,
    ops: !1
  },
  share: {
    pub: !1,
    uni: !1
  },
  access: [],
  employers: [],
  partners: [],
  read: {},
  feedback: [],
  pilots: [],
  notif: {
    week: !0,
    ver: !0,
    opps: !0
  },
  ops: {
    rulesOnly: !1,
    maint: !1,
    skillOff: {},
    oppOff: {},
    users: [],
    inst: {},
    retention: "12"
  },
  tours: {}
});

let S = load();

function load() {
  try {
    const e = JSON.parse(localStorage.getItem(KEY));
    if (!e || "object" != typeof e || Array.isArray(e)) return blank();
    const s = blank(), a = Object.assign({}, s);
    for (const i of Object.keys(s)) {
      if (!(i in e)) continue;
      const o = s[i], r = e[i];
      null !== o && "object" == typeof o ? Array.isArray(o) ? Array.isArray(r) && (a[i] = r) : r && "object" == typeof r && !Array.isArray(r) && (a[i] = Object.assign({}, o, r)) : null !== r && typeof r != typeof o && null !== o || (a[i] = r);
    }
    a.goal && !OPPS.some(e => e.id === a.goal) && (a.goal = null), !a.plan || "object" == typeof a.plan && Array.isArray(a.plan.tasks) && OPPS.some(e => e.id === a.plan.goal) || (a.plan = null), 
    !a.plan || a.plan.done && "object" == typeof a.plan.done || (a.plan.done = {});
    for (const e of Object.keys(a.skills)) {
      const s = a.skills[e];
      s && "object" == typeof s && (SK[e] || String(e).startsWith("c_")) ? Array.isArray(s.ev) || (s.ev = []) : delete a.skills[e];
    }
    return a;
  } catch (e) {}
  return blank();
}

function save() {
  if (!ui.noSave) {
    S.discSave = "discover" === S.stage && ui.disc ? ui.disc : null;
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {}
  }
}

function withState(e, s) {
  const a = S;
  S = e, ui.noSave = !0;
  try {
    return s();
  } finally {
    S = a, ui.noSave = !1;
  }
}

const ui = {
  run: 0,
  flip: !1,
  disc: null,
  sel: null,
  ofilter: "all",
  oview: "list",
  page: 0,
  uview: "ov",
  ivBusy: !1,
  cpBusy: !1,
  setupStep: "name",
  building: !1,
  pub: "home",
  menu: !1,
  pubForce: !1,
  cmType: null,
  ops: "ov"
}, $ = (e, s = document) => s.querySelector(e), $$ = (e, s = document) => [ ...s.querySelectorAll(e) ], MQD = matchMedia("(prefers-color-scheme: dark)"), themeOf = () => {
  const e = S.prefs.theme || "system";
  return "system" === e ? MQD.matches ? "dark" : "light" : e;
};

function applyTheme() {
  const e = themeOf(), s = document.documentElement;
  s.dataset.theme = e, s.style.colorScheme = e, document.querySelectorAll('meta[name="theme-color"]').forEach(s => s.content = "dark" === e ? "#0C1210" : "#F8F6EF");
}

try {
  MQD.addEventListener("change", () => {
    "system" === (S.prefs.theme || "system") && applyTheme();
  });
} catch (e) {}

function setTheme(e, s) {
  const a = themeOf();
  S.prefs.theme = e, save();
  const done = () => {
    applyTheme(), document.querySelectorAll("[data-theme-ui]").forEach(e => e.outerHTML = themeUI(e.dataset.themeUi));
  };
  if (a === themeOf() || RM() || !document.startViewTransition) return void done();
  const i = s && null != s.clientX && s.clientX ? s.clientX : innerWidth / 2, o = s && s.clientY ? s.clientY : 0, r = Math.hypot(Math.max(i, innerWidth - i), Math.max(o, innerHeight - o));
  document.documentElement.classList.add("vt-theme");
  const l = document.startViewTransition(done);
  l.ready.then(() => document.documentElement.animate({
    clipPath: [ `circle(0px at ${i}px ${o}px)`, `circle(${r}px at ${i}px ${o}px)` ]
  }, {
    duration: 520,
    easing: "cubic-bezier(.32,.72,0,1)",
    pseudoElement: "::view-transition-new(root)"
  })).catch(() => {}), l.finished.finally(() => document.documentElement.classList.remove("vt-theme"));
}

function themeUI(e) {
  const s = S.prefs.theme || "system", a = themeOf();
  return "toggle" === e ? `<button class="th-tog" data-theme-ui="toggle" data-act="theme-toggle" aria-label="${esc(t("dark" === a ? "th_to_light" : "th_to_dark"))}" title="${esc(t("dark" === a ? "th_to_light" : "th_to_dark"))}"><span class="th-i th-sun">${ic("sun")}</span><span class="th-i th-moon">${ic("moon")}</span></button>` : `<div class="seg th-seg" data-theme-ui="seg" role="radiogroup" aria-label="${esc(t("th_label"))}">${[ [ "light", "sun", "th_light" ], [ "dark", "moon", "th_dark" ], [ "system", "monitor", "th_system" ] ].map(([e, a, i]) => `<button role="radio" data-act="theme" data-v="${e}" aria-checked="${s === e}" title="${esc(t(i))}">${ic(a)}<span>${esc(t(i))}</span></button>`).join("")}</div>`;
}

const RM = () => S.prefs.calm || S.prefs.lite || matchMedia("(prefers-reduced-motion: reduce)").matches, sleep = e => new Promise(s => setTimeout(s, e));

function detect() {
  for (const e of navigator.languages || [ navigator.language || "" ]) {
    const s = String(e).toLowerCase();
    if ("ar-ma" === s || s.startsWith("ary")) return "ar";
    const a = s.slice(0, 2);
    if ("ar" === a) return "ar";
    if (LANGS.includes(a)) return a;
  }
  return "ar";
}

const L = () => LANGS.includes(S.lang) ? S.lang : detect(), LK = () => "zgh" === L() ? "fr" : "ary" === L() ? "ar" : L(), isAR = () => "ar" === L() || "ary" === L(), langTag = e => "ary" === e ? "ar-MA" : e, LI = () => LANGS3.indexOf(LK()), LOC = () => ({
  en: "en-GB",
  fr: "fr-MA",
  ar: "ar-MA",
  ary: "ar-MA",
  zgh: "fr-MA"
}[L()] || "en-GB"), esc = e => String(e ?? "").replace(/[&<>"']/g, e => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[e])), numOf = e => "number" == typeof e ? e : parseFloat(String(e).replace(/[\u0660-\u0669]/g, e => e.charCodeAt(0) - 1632).replace(/[^\d.\-]/g, ""));

let PR = null, PRL = "";

function plural(e, s, a) {
  if (PRL !== LOC()) {
    try {
      PR = new Intl.PluralRules(LOC());
    } catch (e) {
      PR = null;
    }
    PRL = LOC();
  }
  const i = {};
  s.split("|").forEach(e => {
    const s = e.indexOf(":");
    s > 0 && (i[e.slice(0, s).trim()] = e.slice(s + 1));
  });
  const o = numOf(e), r = PR && !isNaN(o) ? PR.select(o) : "other";
  return (i[r] ?? i.other ?? "").replace(/#/g, a);
}

const fmt = (e, s = {}) => String(e).replace(/\{(\w+)\|([^{}]*)\}/g, (e, a, i) => void 0 !== s[a] ? plural(s[a], i, s[a]) : e).replace(/\{(\w+)\}/g, (e, a) => void 0 !== s[a] ? s[a] : e);

function t(e, s) {
  window.__k && (window.__k[e] = 1);
  const a = T[e];
  if (!a) return console.warn("i18n missing:", e), e;
  const i = "zgh" === L() && void 0 !== ZGH[e] ? ZGH[e] : "ary" === L() && void 0 !== ARY[e] ? ARY[e] : a[LI()] ?? a[0];
  return s && "string" == typeof i ? fmt(i, s) : i;
}

function numLabel(e, s, a = {}) {
  const i = te(e, Object.assign({}, a, {
    n: 0 === s ? 0 : s
  })), o = nfmt(s), r = i.indexOf(o);
  return r < 0 ? `<span>${i}</span>` : `<span>${i.slice(0, r)}<b class="num">${o}</b>${i.slice(r + o.length)}</span>`;
}

const tx = e => e ? e[L()] || "zgh" === L() && TXZ[e.en] || "ary" === L() && TXA[e.en] || e[LK()] || e.en : "", pn = e => "zgh" === L() && void 0 !== NAMEZ && NAMEZ[e] ? NAMEZ[e] : e, exText = () => EXAMPLE[L()] || exText(), starters = () => STARTERS[L()] || starters(), ZM = [ "ⵢⵏⵏⴰⵢⵔ", "ⵅⵓⴱⵕⴰⵢⵕ", "ⵎⴰⵕⵚ", "ⵉⴱⵔⵉⵔ", "ⵎⴰⵢⵢⵓ", "ⵢⵓⵏⵢⵓ", "ⵢⵓⵍⵢⵓⵣ", "ⵖⵓⵛⵜ", "ⵛⵓⵜⴰⵏⴱⵉⵔ", "ⴽⵜⵓⴱⵔ", "ⵏⵓⵡⴰⵏⴱⵉⵔ", "ⴷⵓⵊⴰⵏⴱⵉⵔ" ], hm = e => String(e.getHours()).padStart(2, "0") + ":" + String(e.getMinutes()).padStart(2, "0"), qt = e => isAR() ? "«" + e + "»" : "fr" === L() || "zgh" === L() ? "« " + e + " »" : "“" + e + "”";

function daysAgo(e) {
  if (!e) return t("today");
  if ("zgh" === L()) return t("days_ago", {
    n: nfmt(e)
  });
  try {
    return new Intl.RelativeTimeFormat(LOC(), {
      numeric: "auto"
    }).format(-e, "day");
  } catch (s) {
    return t("days_ago", {
      n: nfmt(e)
    });
  }
}

const skName = e => S.custom[e] ? S.custom[e].name : SK[e] ? tx(SK[e]) : e, opp = e => OPPS.find(s => s.id === e), liveOpps = () => OPPS.filter(e => !S.ops.oppOff[e.id]), owned = e => !(!S.skills[e] || "confirmed" !== S.skills[e].status), confirmed = () => Object.keys(S.skills).filter(owned), NLOC = () => ({
  en: "en-GB",
  fr: "fr-FR",
  ar: "ar-MA",
  ary: "ar-MA",
  zgh: "fr-FR"
}[L()] || "en-GB"), nfmt = e => {
  try {
    return new Intl.NumberFormat(NLOC()).format(e);
  } catch (s) {
    return String(e);
  }
};

function list(e) {
  if (!(e = e.filter(Boolean)).length) return "";
  if ("zgh" === L()) return e.length < 2 ? e[0] : e.slice(0, -1).join(", ") + " ⴷ " + e[e.length - 1];
  try {
    return new Intl.ListFormat(LOC(), {
      style: "long",
      type: "conjunction"
    }).format(e);
  } catch (s) {
    return e.join(", ");
  }
}

function dateFmt(e) {
  if ("zgh" === L()) {
    const s = new Date(e);
    return s.getDate() + " " + ZM[s.getMonth()] + " " + s.getFullYear();
  }
  try {
    return new Intl.DateTimeFormat(LOC(), {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(e));
  } catch (s) {
    return new Date(e).toDateString();
  }
}

function dateTimeFmt(e) {
  if ("zgh" === L()) return dateFmt(e) + " · " + hm(new Date(e));
  try {
    return new Intl.DateTimeFormat(LOC(), {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(e));
  } catch (s) {
    return new Date(e).toLocaleString();
  }
}

const sentences = e => String(e).replace(/([.!?؟])\s+/g, "$1\n").split(/\n+/).map(e => e.trim()).filter(Boolean), uid = () => Math.random().toString(36).slice(2, 9), langName = () => "zgh" === L() ? "Standard Moroccan Tamazight (IRCAM) written only in Tifinagh script, simple words, short sentences" : "ary" === L() ? "Moroccan Darija (الدارجة المغربية) written in Arabic script, warm and simple, short sentences, French loanwords allowed for job titles" : {
  en: "English",
  fr: "French",
  ar: "simple, clear Modern Standard Arabic (فصحى), short sentences, no dialect"
}[LK()], P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  pass: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><circle cx="12" cy="10" r="3.2"/><path d="M8.5 16.5h7"/>',
  map: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  plan: '<rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4"/><path d="m9 14.5 2 2 4-4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  uni: '<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 11.5v4.5c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5M21 9v6"/>',
  send: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  heart: '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>',
  dot: '<circle cx="12" cy="12" r="7.5" stroke-dasharray="2.6 2.6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.4-5.4 3.6-7.6.4 1.5 1.2 2.6 2.2 3.2.3-2.6 1.7-5.1 3.6-6.9.4 2.6 1.9 4.4 2.9 5.9.9 1.4 1.7 3 1.7 5.1C19.5 18.4 16.3 21 12 21z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  vol: '<path d="M4 9.5h4L13 5v14l-5-4.5H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h4L13 5v14l-5-4.5H4z"/><path d="m17 9.5 5 5M22 9.5l-5 5"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  chat: '<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 10h18M16 15h2"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8M12 17.2h.01"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14.5 8.5l2 2"/>',
  out: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.5h.01"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  building: '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18"/><path d="M8 8h3M8 12h3M8 16h3"/>',
  inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z"/>',
  power: '<path d="M12 3v9"/><path d="M6.3 7a8 8 0 1 0 11.4 0"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
  quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  kbd: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'
}, FLIP = new Set([ "arrow", "back", "send", "chev", "out" ]), ic = e => `<svg class="${FLIP.has(e) ? "flip" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[e] || ""}</svg>`, MK_BODY = "M550.9 967.6 C550.9 967.2 554.7 964.5 559.4 961.8 C611.4 931.2 644.2 874.9 639.2 825.1 C634.3 777.3 610.4 747.4 538.7 699.4 C475.0 656.8 451.8 628.0 451.6 591.4 C451.5 568.0 457.9 556.0 488.0 523.7 C514.7 494.9 526.3 474.8 533.5 444.6 C535.8 435.1 535.7 408.9 533.4 400.5 C520.9 354.7 488.4 328.8 437.4 324.0 C396.7 320.3 334.9 337.1 289.6 364.2 C274.9 373.1 275.3 373.3 298.7 368.6 C361.5 355.9 401.6 357.6 434.6 374.2 C468.6 391.4 482.5 422.7 469.0 451.5 C457.1 476.9 438.1 493.7 374.9 534.6 C339.6 557.5 322.8 570.0 308.6 584.4 C271.5 621.6 268.4 655.2 298.6 693.2 C313.7 712.2 329.8 725.8 369.9 753.4 C421.4 788.7 441.6 808.1 454.1 833.9 C459.8 845.7 461.6 852.5 462.3 864.5 C464.0 893.8 448.6 925.9 418.4 956.2 L406.8 967.8 L390.8 967.2 C286.0 963.3 207.8 949.7 151.7 925.6 C68.2 889.7 13.8 835.4 2.1 776.1 C-0.1 765.1 -0.0 743.0 2.2 732.7 C13.4 679.9 53.3 630.3 121.0 585.1 C154.6 562.7 192.9 543.1 243.6 522.6 C260.4 515.8 272.5 511.2 313.2 496.1 C366.6 476.4 398.7 460.2 406.3 449.3 C418.6 431.5 394.7 422.6 352.2 429.2 C330.0 432.7 293.6 442.4 269.1 451.4 C262.9 453.7 255.2 456.5 252.0 457.7 C233.7 464.1 187.7 484.0 163.8 495.7 C145.5 504.8 138.0 509.1 110.6 526.0 C108.3 527.4 107.7 527.5 107.0 526.5 C105.4 524.2 106.7 402.9 108.4 389.8 C115.5 335.5 134.3 292.9 172.7 244.6 C241.8 157.7 343.8 88.1 463.5 46.2 C523.0 25.4 608.7 8.5 689.9 1.6 C708.1 0.1 769.2 0.1 784.0 1.6 C899.8 13.6 971.9 62.9 994.5 145.4 C1000.2 166.2 1002.5 197.1 1000.0 219.9 C993.2 283.6 955.5 349.1 893.8 404.5 C874.4 421.9 867.4 427.4 842.0 445.0 C777.4 490.0 689.9 525.1 586.3 547.7 C578.4 549.4 571.5 550.9 571.1 550.9 C570.7 550.9 570.7 551.2 571.2 551.7 C571.6 552.1 581.3 554.2 592.7 556.2 C617.4 560.7 665.4 569.8 666.1 570.2 C666.3 570.4 673.8 572.0 682.7 573.8 C717.1 580.8 761.4 591.6 783.1 598.1 C898.9 633.2 972.4 692.6 982.6 759.2 C990.9 813.4 945.8 874.6 869.9 912.2 C818.0 938.0 759.9 953.3 679.1 962.6 C642.7 966.8 550.9 970.4 550.9 967.6Z", RD_BODY = "M250 1012L264 1012L278 1011L292 1010L306 1009L320 1008L334 1006L348 1005L362 1004L376 1003L390 1001L404 999L418 998L431 996L445 994L459 992L472 990L485 988L499 986L512 983L525 981L538 978L551 976L564 973L576 970L589 967L601 963L613 960L625 956L637 952L649 949L661 944L672 940L683 936L694 931L705 926L716 921L726 915L736 910L746 904L756 897L766 891L775 884L784 877L793 869L801 861L809 852L817 843L824 834L831 824L837 814L843 803L848 792L852 781L856 769L859 757L861 745L862 733L863 721L863 708L862 696L861 685L859 675L857 666L854 656L852 647L848 638L845 629L840 621L836 613L831 605L826 597L821 590L815 583L809 576L803 570L797 564L790 559L784 553L777 548L770 544L763 539L756 535L749 531L742 527L734 524L727 521L720 518L712 515L705 512L697 510L690 508L682 506L675 504L667 502L660 500L652 499L645 497L637 496L630 495L622 494L615 493L607 492L600 491L592 490L585 490L578 489L570 488L563 488L556 488L549 487L542 487L535 487L528 487L521 486L514 486L508 486L501 486L495 486L488 486L482 486L475 486L468 486L461 486L455 486L448 486L442 485L435 485L429 484L423 484L416 483L410 482L404 482L399 481L393 480L387 479L382 478L376 476L371 475L366 474L361 473L356 471L351 470L347 468L342 466L338 465L334 463L330 461L326 459L322 458L319 456L316 454L312 452L309 450L307 448L304 446L301 444L299 441L297 439L295 437L293 435L291 433L289 431L288 429L286 426L285 424L284 422L283 419L282 417L281 415L280 412L279 409L279 407L278 404L278 401L278 397L278 394L278 390L278 387L279 383L279 379L280 375L281 372L282 369L283 366L284 363L285 360L286 357L288 355L289 352L291 350L292 347L294 345L296 342L298 340L301 338L303 335L306 333L308 331L311 329L314 327L318 325L321 323L325 321L328 319L332 317L336 315L341 313L345 312L350 310L354 308L359 307L364 305L369 304L375 303L380 301L386 300L392 299L398 298L404 297L410 296L416 295L423 295L429 294L436 293L443 293L450 292L457 292L464 292L471 291L479 291L486 291L494 291L502 291L509 291L517 291L525 291L533 292L541 292L550 292L558 293L566 292L574 290L580 285L586 279L589 272L591 264L590 256L588 248L583 242L577 236L570 233L562 231L554 230L545 230L536 229L528 229L520 228L511 228L503 227L495 227L487 227L479 227L471 227L463 226L455 226L447 227L440 227L432 227L425 227L417 228L410 228L403 229L396 229L388 230L381 231L374 232L368 233L361 234L354 235L348 237L341 238L335 240L328 241L322 243L316 245L310 247L304 250L298 252L292 254L287 257L281 260L276 263L270 266L265 270L260 273L255 277L250 281L245 285L241 289L237 294L232 298L228 303L225 308L221 314L218 319L214 325L212 330L209 336L206 342L204 349L202 355L201 361L199 368L198 375L196 382L196 389L195 395L195 402L195 409L196 416L196 422L197 429L199 435L200 442L202 448L204 454L207 460L209 466L212 472L216 478L219 483L223 489L227 494L231 499L235 504L240 508L244 513L249 517L254 521L259 525L264 529L270 533L275 537L281 540L287 544L293 547L299 550L305 553L311 556L317 559L324 561L330 564L337 566L343 569L350 571L357 573L364 575L371 577L378 579L386 580L393 582L400 584L408 585L415 586L423 588L431 589L438 590L446 591L454 592L462 593L470 593L478 594L484 594L490 595L496 596L502 596L508 597L514 597L520 598L527 599L533 600L539 600L545 601L552 602L558 603L564 604L570 605L577 606L583 608L589 609L595 610L601 612L607 613L612 614L618 616L624 618L629 619L635 621L640 623L645 625L650 627L655 629L660 631L664 633L669 635L673 637L677 640L680 642L684 644L687 647L691 649L694 651L696 654L699 656L701 658L703 661L705 663L707 666L709 668L710 670L711 673L713 675L714 678L715 680L715 683L716 685L717 688L717 691L718 694L718 698L718 701L718 704L718 709L717 712L716 716L716 719L714 722L713 725L712 727L711 730L709 732L707 734L705 737L703 739L700 742L698 744L694 747L691 749L687 752L683 755L678 757L673 760L667 763L661 765L655 768L648 770L641 773L634 775L626 778L618 780L610 782L601 784L592 786L583 788L573 789L563 791L553 793L543 794L532 795L521 796L510 797L499 798L488 799L476 800L465 801L453 801L441 802L429 802L416 802L404 802L392 802L379 802L366 802L354 802L341 802L328 801L315 801L302 800L289 800L276 799L263 798L250 798Z", RD_LANE = "M318 916L331 915L345 915L358 914L372 913L385 913L398 912L412 911L425 910L423 888L410 889L397 890L384 891L371 891L357 892L344 892L331 893L317 893ZM538 896L550 894L561 891L573 889L584 887L595 884L606 881L617 878L628 875L638 872L632 854L622 857L612 860L602 863L591 865L580 868L569 870L558 872L546 874L535 876ZM719 836L727 831L734 826L741 821L747 816L754 810L760 804L765 798L770 792L775 785L779 779L783 772L769 764L765 770L761 776L757 781L752 787L747 792L742 797L736 803L730 807L724 812L717 817L710 821ZM796 685L795 678L793 672L792 665L789 659L787 653L784 647L782 641L778 636L775 631L772 626L768 621L764 616L760 612L749 622L753 626L756 630L759 635L762 639L765 644L768 649L771 654L773 659L775 664L777 670L778 676L780 682L781 688ZM697 570L691 567L685 565L679 563L672 561L666 559L659 557L653 555L646 553L640 552L633 550L630 563L637 565L643 566L649 568L656 570L662 572L668 574L674 576L680 578L686 580L691 583ZM565 540L558 539L551 538L544 538L538 537L531 537L525 536L518 536L511 535L505 535L504 547L511 548L517 548L524 548L530 549L537 550L543 550L550 551L557 551L563 552ZM451 533L444 532L437 531L430 531L423 530L416 529L409 528L403 527L396 526L394 536L401 538L408 539L414 540L421 541L428 542L436 543L443 543L450 544ZM347 513L342 511L336 509L331 507L326 505L320 503L316 500L311 498L306 495L301 493L296 502L301 504L306 507L311 510L316 512L321 514L327 517L332 519L338 521L344 523ZM267 466L264 462L262 459L259 455L257 452L254 448L252 444L250 440L248 436L247 432L245 428L236 431L238 435L240 440L242 444L244 449L246 453L248 457L251 461L254 465L257 469L260 472ZM241 392L242 387L242 381L243 376L244 371L245 366L247 362L248 357L250 353L242 349L240 354L238 359L237 364L236 369L234 375L234 380L233 386L232 391ZM269 322L272 319L275 315L278 312L282 309L285 306L289 304L293 301L288 294L284 297L280 300L276 303L273 306L269 309L266 313L262 316ZM320 287L325 285L330 283L335 281L340 279L346 278L351 276L349 269L343 270L338 272L332 274L327 275L322 277L317 279Z", MK_STAR = "M570.0 381.6 C579.2 346.3 594.0 321.3 618.1 300.5 C645.2 277.3 676.9 262.5 717.6 254.3 C724.4 252.9 730.0 251.5 730.0 251.2 C730.0 250.9 724.5 249.3 717.8 247.7 C652.3 232.0 611.3 197.5 592.2 142.2 C588.0 130.2 584.1 115.0 581.9 102.2 C581.1 97.2 580.1 92.8 579.7 92.4 C579.3 92.0 578.1 95.1 577.0 99.2 C562.6 153.2 542.9 187.1 510.2 213.3 C489.1 230.3 459.6 244.3 426.9 252.9 C421.4 254.3 422.1 255.3 429.6 256.5 C506.1 268.3 552.3 311.0 563.9 380.7 C565.7 391.7 566.3 394.4 566.6 394.1 C566.8 393.9 568.3 388.3 570.0 381.6Z", RD_STAR = "M742 86C765.8 202.2 765.8 202.2 882 226C765.8 249.8 765.8 249.8 742 366C718.2 249.8 718.2 249.8 602 226C718.2 202.2 718.2 202.2 742 86Z", mark = () => `<svg class="bw-mark" viewBox="0 0 1000 968" aria-hidden="true" focusable="false"><path class="bw-bowl" fill-rule="evenodd" d="${MK_BODY} ${MK_STAR}"/><path class="bw-dot" d="${MK_STAR}"/></svg>`;

let FAV = "";

function setFavicon(e = 0) {
  const s = e ? "n" : "0";
  if (FAV === s) return;
  FAV = s;
  const a = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" rx="224" fill="#0F3D36"/><g transform="translate(190 204) scale(.62)"><path fill="#F8F6EF" fill-rule="evenodd" d="${MK_BODY} ${MK_STAR}"/><path fill="#D9B784" d="${MK_STAR}"/></g>${e ? '<circle cx="820" cy="180" r="170" fill="#C2410C" stroke="#F8F6EF" stroke-width="40"/>' : ""}</svg>`;
  try {
    let e = document.querySelector('link[rel="icon"]');
    e || (e = document.createElement("link"), e.rel = "icon", document.head.appendChild(e)), 
    e.type = "image/svg+xml", e.href = "data:image/svg+xml," + encodeURIComponent(a);
  } catch (e) {}
}

const starD = (e, s, a, i = .18) => `M${e} ${s - a}C${e + a * i} ${s - a * i} ${e + a * i} ${s - a * i} ${e + a} ${s}C${e + a * i} ${s + a * i} ${e + a * i} ${s + a * i} ${e} ${s + a}C${e - a * i} ${s + a * i} ${e - a * i} ${s + a * i} ${e - a} ${s}C${e - a * i} ${s - a * i} ${e - a * i} ${s - a * i} ${e} ${s - a}Z`, brand = () => isAR() ? `<span class="brand ar">${mark()}<span class="bw-ar-main">سكيلما</span><span class="bw-sub">SKILMA</span></span>` : `<span class="brand">${mark()}<span class="bw-name">SKILMA</span>${"zgh" === L() ? '<span class="bw-ar">ⵙⴽⵉⵍⵎⴰ</span>' : ""}</span>`;

function mascot(e = "neutral", s = "") {
  return `<svg class="masc" viewBox="0 0 100 100" data-mood="${e}" aria-hidden="true" ${s}><circle class="m-bowl" cx="50" cy="50" r="48"/><path class="m-dot" d="${starD(50, 50, 26, .2)}"/></svg>`;
}

function setMood(e, s = document) {
  $$(".masc", s).forEach(s => s.dataset.mood = e);
}

let sayTimer = 0;

function say(e, s) {
  const a = $(".fab") || $(".lp-masc") || $(".th-masc") || $(".reading-m");
  if (s && setMood(s, a || document), !a || !e) return;
  $$(".say", document).forEach(e => e.remove());
  const i = document.createElement("div");
  i.className = "say", i.textContent = e, i.setAttribute("role", "status"), a.appendChild(i), 
  clearTimeout(sayTimer), sayTimer = setTimeout(() => {
    i.remove(), s && "neutral" !== s && setMood("neutral", a);
  }, 2800), voice(e);
}

function toast(e, s = "check", a = !1, i = null) {
  const o = $("#toasts");
  if (!o) return;
  const r = document.createElement("div");
  r.className = "toast" + (a ? " amb" : "") + (i ? " has-act" : ""), r.setAttribute("role", "status"), 
  r.innerHTML = `${ic(s)}<span>${esc(e)}</span>${i ? `<button class="toast-act">${esc(i.label)}</button>` : ""}`;
  const kill = () => {
    r.classList.add("out"), setTimeout(() => r.remove(), 180);
  };
  i && r.querySelector(".toast-act").addEventListener("click", () => {
    i.fn(), kill();
  }), o.appendChild(r), setTimeout(kill, i ? 7e3 : 3300);
}

const SND = {
  ctx: null,
  play(e) {
    if (S.prefs.sound) try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext);
      const s = this.ctx;
      ({
        pop: [ 660, 990 ],
        ok: [ 523, 659, 784 ],
        tick: [ 1200 ],
        err: [ 260, 190 ],
        win: [ 523, 659, 784, 1047, 1319 ],
        turn: [ 420 ]
      }[e] || [ 660 ]).forEach((a, i) => {
        const o = s.createOscillator(), r = s.createGain(), l = s.currentTime + .075 * i;
        o.type = "err" === e ? "triangle" : "sine", o.frequency.value = a, r.gain.setValueAtTime(1e-4, l), 
        r.gain.exponentialRampToValueAtTime("tick" === e ? .04 : .11, l + .015), r.gain.exponentialRampToValueAtTime(1e-4, l + .24), 
        o.connect(r).connect(s.destination), o.start(l), o.stop(l + .26);
      });
    } catch (e) {}
  }
};

function voice(e, s) {
  if ((S.prefs.voice || s) && e && "speechSynthesis" in window) try {
    speechSynthesis.cancel();
    const s = new SpeechSynthesisUtterance(e);
    s.lang = {
      en: "en-US",
      fr: "fr-FR",
      ar: "ar-MA"
    }[LK()], s.rate = 1.02, speechSynthesis.speak(s);
  } catch (e) {}
}

const FX = {
  parts: [],
  raf: 0,
  cv: null,
  ctx: null
};

function confetti(e, s, a = 60, i = 1) {
  if (RM()) return;
  if (FX.cv = FX.cv || $("#fx"), !FX.cv) return;
  FX.ctx = FX.ctx || FX.cv.getContext("2d");
  const o = Math.min(2, window.devicePixelRatio || 1);
  FX.cv.width !== innerWidth * o && (FX.cv.width = innerWidth * o, FX.cv.height = innerHeight * o, 
  FX.ctx.setTransform(o, 0, 0, o, 0, 0));
  const r = [ "#0F3D36", "#D4AF7C", "#6B8F7D", "#D6D0BF" ];
  for (let o = 0; o < a; o++) {
    const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1, l = (6 + 9 * Math.random()) * i;
    FX.parts.push({
      x: e,
      y: s,
      vx: Math.cos(a) * l,
      vy: Math.sin(a) * l,
      g: .32 + .15 * Math.random(),
      s: 4 + 6 * Math.random(),
      r: 6 * Math.random(),
      vr: .4 * (Math.random() - .5),
      c: r[o % r.length],
      life: 90 + 50 * Math.random(),
      shape: Math.random() < .35 ? "c" : "r"
    });
  }
  FX.raf || (FX.raf = requestAnimationFrame(tickFx));
}

function tickFx() {
  const e = FX.ctx;
  e.clearRect(0, 0, innerWidth, innerHeight), FX.parts = FX.parts.filter(e => e.life > 0 && e.y < innerHeight + 40);
  for (const s of FX.parts) s.vx *= .985, s.vy = .985 * s.vy + s.g, s.x += s.vx, s.y += s.vy, 
  s.r += s.vr, s.life--, e.save(), e.globalAlpha = Math.min(1, s.life / 30), e.translate(s.x, s.y), 
  e.rotate(s.r), e.fillStyle = s.c, "c" === s.shape ? (e.beginPath(), e.arc(0, 0, s.s / 2.4, 0, 2 * Math.PI), 
  e.fill()) : e.fillRect(-s.s / 2, -s.s / 4, s.s, s.s / 2), e.restore();
  FX.raf = FX.parts.length ? requestAnimationFrame(tickFx) : 0, FX.raf || e.clearRect(0, 0, innerWidth, innerHeight);
}

function burstFrom(e, s = 40, a = .8) {
  if (!e) return;
  const i = e.getBoundingClientRect();
  confetti(i.left + i.width / 2, i.top + i.height / 2, s, a);
}

function bigCelebration() {
  if (RM()) return;
  const e = innerWidth;
  confetti(.2 * e, .75 * innerHeight, 90, 1.25), setTimeout(() => confetti(.8 * e, .75 * innerHeight, 90, 1.25), 220), 
  setTimeout(() => confetti(.5 * e, .6 * innerHeight, 110, 1.4), 480);
}

const pc = e => pfmt(e, 0), CL = () => "fr" === L() ? " : " : ": ", pfmt = (e, s = 1) => {
  try {
    return new Intl.NumberFormat(NLOC(), {
      style: "percent",
      minimumFractionDigits: s,
      maximumFractionDigits: s
    }).format(e / 100);
  } catch (s) {
    return e + "%";
  }
};

function countUp(e, s, a = 1100, i = "", o = 0, r = null) {
  const l = performance.now(), c = r ? +(e.dataset.pct || 0) : 0, out = e => r ? r(e) : nfmt(Math.round(e)) + i;
  if (RM()) return void (e.textContent = out(s));
  const step = i => {
    const r = Math.min(1, (i - l) / a), p = 1 - Math.pow(1 - r, 3), d = o + (s - o) * p;
    e.textContent = out(c ? Math.round(d * 10 ** c) / 10 ** c : Math.round(d)), r < 1 && requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const pctOf = e => null != e.dataset.pct ? s => pfmt(s, +e.dataset.pct) : null;

function runCounts(e = document, s = "count") {
  $$(`[data-${s}]`, e).forEach(e => countUp(e, +e.dataset[s], 1200, e.dataset.suffix || "", 0, pctOf(e)));
}

function ring(e, s = 120, a = 8, i = "", o = !0, r = null) {
  const l = Math.max(0, Math.min(100, Math.round(e))), c = "M31.22 18.68A40 40 0 1 0 68.78 18.68";
  return `<svg class="gauge ${i}" viewBox="0 0 100 98" width="${s}" height="${Math.round(.98 * s)}" aria-hidden="true"><path class="g-trk" d="${c}" pathLength="100"/><path class="g-val" d="${c}" pathLength="100" data-off="${l}"/><path class="g-dot ${(null === r ? l >= 100 : r) ? "on" : ""}" d="${starD(50, 13, 9, .22)}"/>${o ? "string" == typeof o ? `<text x="50" y="56" text-anchor="middle" dominant-baseline="central" class="g-frac"><tspan>${esc(o)}</tspan></text>` : `<text x="50" y="56" text-anchor="middle" dominant-baseline="central"><tspan data-count="${l}" data-suffix="%">0%</tspan></text>` : ""}</svg>`;
}

function drawRings(e = document) {
  requestAnimationFrame(() => requestAnimationFrame(() => $$(".gauge .g-val", e).forEach(e => e.style.strokeDasharray = e.dataset.off + " 100")));
}

function shake(e) {
  e && (e.classList.remove("shake"), e.offsetWidth, e.classList.add("shake"), SND.play("err"));
}

function bounce(e, s = "bounce") {
  e && (e.classList.remove(s), e.offsetWidth, e.classList.add(s));
}

function typeInto(e, s, a = 34, i) {
  if (!e) return;
  if (RM()) return e.textContent = s, void (i && i());
  const o = [ ...s ];
  let r = 0;
  e.textContent = "";
  const l = document.createElement("span");
  l.className = "caret";
  const tick = () => {
    e.isConnected && (e.textContent = o.slice(0, ++r).join(""), e.appendChild(l), r < o.length ? setTimeout(tick, a + 30 * Math.random()) : (setTimeout(() => l.remove(), 2400), 
    i && i()));
  };
  tick();
}

function flyTo(e, s, a, i) {
  if (!e || !s || RM()) return void (i && i());
  const o = e.getBoundingClientRect(), r = s.getBoundingClientRect(), l = document.createElement("div");
  l.className = "flyer", l.textContent = a, document.body.appendChild(l);
  const c = l.offsetWidth, p = l.offsetHeight, d = o.left + o.width / 2 - c / 2, u = o.top + o.height / 2 - p / 2, _ = r.left + r.width / 2 - c / 2, h = r.top + r.height / 2 - p / 2, v = (d + _) / 2, f = Math.min(u, h) - 160, g = [];
  for (let e = 0; e <= 16; e++) {
    const s = e / 16, a = (1 - s) * (1 - s) * d + 2 * (1 - s) * s * v + s * s * _, i = (1 - s) * (1 - s) * u + 2 * (1 - s) * s * f + s * s * h;
    g.push({
      transform: `translate(${a}px,${i}px) scale(${1 - .65 * s})`,
      opacity: s > .92 ? 0 : 1
    });
  }
  l.animate(g, {
    duration: 850,
    easing: "cubic-bezier(.5,0,.3,1)"
  }).onfinish = () => {
    l.remove(), bounce(s, "got"), i && i();
  };
}

function initCursor() {}

const AI = {
  fn: null,
  state: "checking",
  tools: !1
};

async function initAI() {
  try {
    if (window.claude && "function" == typeof window.claude.use && (AI.fn = await window.claude.use("sample"), 
    AI.fn)) try {
      const e = await AI.fn.limits();
      AI.tools = !(!e || !e.tools);
    } catch (e) {}
  } catch (e) {
    AI.fn = null;
  }
  AI.state = AI.fn ? "live" : "off", refreshPills();
}

let DL = null;

async function initDownloads() {
  try {
    window.claude && "function" == typeof window.claude.use && (DL = await window.claude.use("downloads"));
  } catch (e) {
    DL = null;
  }
}

function aiPill() {
  const e = "live" === AI.state && S.ops.rulesOnly ? "rules" : AI.state, s = "live" === e ? "teal live" : "", a = t("live" === e ? "ai_live" : "checking" === e ? "ai_check" : "rules" === e ? "ai_rules" : "ai_off");
  return `<span class="pill ${s}" data-ai-pill title="${esc("off" === e ? t("ai_off_d") : "")}"><span class="dot"></span>${esc(a)}</span>`;
}

function refreshPills() {
  $$("[data-ai-pill]").forEach(e => {
    e.outerHTML = "s" === e.dataset.aiPill ? aiShort() : aiPill();
  });
}

function aiError(e) {
  const s = e && e.code;
  "not_granted" === s || "capability_disabled" === s || "capability_removed" === s || "unavailable" === s ? (AI.fn = null, 
  AI.state = "off", refreshPills(), toast(t("ai_denied"), "lock")) : "rate_limited" === s ? toast(t("ai_busy"), "clock") : "cancelled" !== s && toast(t("ai_fail"), "bolt");
}

const aiOn = () => !!AI.fn && !S.ops.rulesOnly;

async function aiJSON(e, s = "default", a = "other") {
  if (!aiOn()) return null;
  const i = performance.now();
  try {
    const o = await AI.fn.json(e, {
      modelTier: s
    });
    return logRun(a, "ai", performance.now() - i, !0, {
      tier: s,
      v: PROMPT_V[a] || ""
    }), o;
  } catch (e) {
    return logRun(a, "ai", performance.now() - i, !1, {
      tier: s,
      err: e && e.code || "error",
      v: PROMPT_V[a] || ""
    }), aiError(e), null;
  }
}

async function aiText(e, s, a = {}, i = "other") {
  if (!aiOn()) return null;
  const o = performance.now(), r = a.modelTier || "default";
  try {
    const l = await AI.fn(e, Object.assign({
      modelTier: "default",
      onText: e => s && s(e.text)
    }, a));
    return logRun(i, "ai", performance.now() - o, !0, {
      tier: r,
      v: PROMPT_V[i] || ""
    }), l.text;
  } catch (e) {
    return logRun(i, "ai", performance.now() - o, !1, {
      tier: r,
      err: e && e.code || "error",
      v: PROMPT_V[i] || ""
    }), aiError(e), null;
  }
}

function profileBrief() {
  const e = S.goal && opp(S.goal);
  return JSON.stringify({
    name: S.profile.name || null,
    field: S.profile.field ? t(S.profile.field) : null,
    skills: confirmed().map(e => ({
      id: e,
      name: skName(e),
      evidence: (S.skills[e].ev[0] || {}).text || ""
    })),
    goal: e ? {
      id: e.id,
      role: tx(e.title),
      org: e.org,
      readiness: readiness(e),
      missing: gaps(e).map(skName)
    } : null,
    plan: S.plan ? {
      day: todayDay(),
      done: doneCount(),
      today: (task(todayDay()) || {}).title || null
    } : null,
    interview_best: e && S.ivBest[e.id] || null,
    opportunities: liveOpps().map(e => ({
      id: e.id,
      role: tx(e.title),
      org: e.org,
      fit: fit(e)
    }))
  });
}

async function aiDiscover(e) {
  const s = `You are SKILMA, a career copilot for Moroccan university students. Read the student's story below. It may be in Moroccan Darija, Arabic, French, English or a mix. Identify the concrete, employable skills the student clearly USED.\n\nAllowed skill ids: ${Object.keys(SK).join(", ")}.\nIf a clearly shown skill is not in that list, you may add at most 2 with "id":"custom" and a short "name".\n\nRules:\n- Only include a skill if the story shows the student actually doing something that uses it.\n- "evidence": copy a phrase EXACTLY, character for character, from the story (3 to 20 words). Never translate or rephrase it.\n- "why": one short sentence (max 14 words) in ${langName()}, addressed to the student, saying why employers value this skill.\n- "rare": true for skills students rarely put on a CV (negotiation, handling cash, managing stock, leading people, organising events, speaking several languages).\n- "confidence": "high" if clearly shown, "medium" if implied.\n- At most 10 skills, strongest first.\n\nReply with only JSON like: {"skills":[{"id":"negotiation","evidence":"…","why":"…","rare":true,"confidence":"high"}]}\n\nStory:\n"""${e.slice(0, 4e3)}"""`, a = await aiJSON(s, "default", "discover");
  if (!a || !Array.isArray(a.skills)) return null;
  const i = [], o = new Set;
  for (const s of a.skills.slice(0, 10)) {
    if (!s || "object" != typeof s) continue;
    let a = String(s.id || "").trim();
    if ("custom" === a) {
      const e = String(s.name || "").trim().slice(0, 40);
      if (!e) continue;
      a = "c_" + e.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "_").slice(0, 24), S.custom[a] = {
        name: e
      };
    } else if (!SK[a] || S.ops.skillOff[a]) continue;
    if (o.has(a)) continue;
    o.add(a);
    let r = String(s.evidence || "").trim().replace(/^["“«]|["”»]$/g, "");
    const l = r && e.includes(r);
    if (!l) {
      const s = sentences(e).find(e => HINT[a] && HINT[a].test(norm(e)));
      s && (r = s);
    }
    i.push({
      id: a,
      evidence: r,
      term: l ? "" : termFor(a, r),
      why: String(s.why || "").slice(0, 160),
      rare: !!s.rare || RARE.has(a),
      conf: "medium" === s.confidence ? "medium" : "high"
    });
  }
  return i.length ? sortFinds(i) : null;
}

function termFor(e, s) {
  const a = HINT[e] && String(s).match(HINT[e]);
  return a ? a[0] : "";
}

function sortFinds(e) {
  return e.sort((e, s) => s.rare - e.rare || ("high" === s.conf) - ("high" === e.conf));
}

const norm = e => String(e).replace(/[\u064B-\u0652\u0640]/g, ""), NEG_RE = /(\b(not|never|no|without|didn['’]?t|don['’]?t|haven['’]?t|wasn['’]?t|couldn['’]?t|can['’]?t)\b|n['’]t\b|\b(ne|n['’]|jamais|pas|sans|aucun|aucune)\b|(^|\s)(لا|لم|لن|ليس|لست|بدون|بلا|ما|عمري ما|ماشي)(\s|$))/i;

function negated(e, s) {
  const a = e.match(s);
  if (!a) return !1;
  const i = e.slice(Math.max(0, a.index - 28), a.index);
  return NEG_RE.test(i);
}

function rulesDiscover(e) {
  const s = sentences(e).map(norm), a = [];
  e = norm(e);
  for (const i of Object.keys(HINT)) {
    if (S.ops.skillOff[i]) continue;
    if ("multilingual" === i) {
      if (LANG_WORDS.filter(s => s.test(e)).length < 2) continue;
    }
    const o = s.find(e => HINT[i].test(e) && !negated(e, HINT[i]));
    o && a.push({
      id: i,
      evidence: o,
      term: termFor(i, o),
      why: "",
      rare: RARE.has(i),
      conf: "high"
    });
  }
  return sortFinds(a).slice(0, 10);
}

function whyFor(e) {
  if (e.why) return e.why;
  if (e.rare) return t("th_rare_why");
  const s = liveOpps().filter(s => s.req.some(s => s[0] === e.id)).length;
  return s ? t("why_count", {
    n: s,
    m: liveOpps().length
  }) : t("why_any");
}

function addSkill(e, s, a = "story", i = "") {
  const o = S.skills[e] || (S.skills[e] = {
    status: "confirmed",
    ev: [],
    rare: RARE.has(e),
    why: "",
    at: Date.now()
  });
  o.status = "confirmed", i && (o.why = i), s && !o.ev.some(e => e.text === s) && o.ev.push({
    text: s,
    src: a,
    at: Date.now()
  });
}

function fit(e) {
  let s = 0, a = 0;
  for (const [i, o] of e.req) {
    const r = o ? 2 : 1;
    s += r, a += owned(i) ? r : r * gapProgress(i, e);
  }
  return Math.round(100 * a / s);
}

const fitRank = e => haves(e).length / e.req.length + e.req.filter(([e, s]) => s && owned(e)).length / 1e3 + fit(e) / 1e6, gaps = e => e.req.filter(([e]) => !owned(e)).sort((e, s) => s[1] - e[1]).map(e => e[0]), haves = e => e.req.filter(([e]) => owned(e)).map(e => e[0]);

function gapProgress(e, s) {
  if (!S.plan || S.plan.goal !== s.id) return 0;
  const a = S.plan.tasks.filter(s => s.skill === e && "prove" !== s.kind);
  return a.length ? .25 * a.filter(e => S.plan.done[e.day]).length / a.length : 0;
}

const coreGaps = e => e.req.filter(([e, s]) => s && !owned(e)).length, fitBand = (e, s) => {
  if (s) {
    const e = coreGaps(s);
    return 0 === e ? "strong" : 1 === e ? "worth" : "stretch";
  }
  return e >= 70 ? "strong" : e >= 45 ? "worth" : "stretch";
}, doneCount = () => S.plan ? Object.keys(S.plan.done).length : 0, todayDay = () => {
  if (!S.plan) return 0;
  for (let e = 1; e <= 30; e++) if (!S.plan.done[e]) return e;
  return 31;
}, task = e => S.plan && S.plan.tasks.find(s => s.day === e), hasEvidence = e => {
  const s = S.skills[e];
  return !(!s || "confirmed" !== s.status || !s.ver && !s.ev.some(e => "plan" === e.src));
};

function readyItems(e) {
  if (!e) return [];
  const s = [];
  for (const [a, i] of e.req) s.push({
    k: "conf",
    id: a,
    core: i,
    done: owned(a)
  }), i && s.push({
    k: "ev",
    id: a,
    core: i,
    done: hasEvidence(a)
  });
  return s.push({
    k: "iv",
    done: !!S.ivBest[e.id]
  }), s.push({
    k: "pf",
    done: (S.portfolio || []).some(s => s.goal === e.id)
  }), s;
}

const readyCount = e => {
  const s = readyItems(e);
  return {
    d: s.filter(e => e.done).length,
    n: s.length
  };
}, isReady = e => !!e && readyItems(e).filter(e => "conf" === e.k || "ev" === e.k).every(e => e.done);

function readiness(e) {
  if (!e) return 0;
  const s = readyCount(e);
  return s.n ? Math.round(100 * s.d / s.n) : 0;
}

const readyLabel = e => {
  const s = readyCount(e);
  return nfmt(s.d) + "/" + nfmt(s.n);
};

function logReady() {
  const e = S.goal && opp(S.goal), s = e ? readiness(e) : 0, a = !!e && isReady(e), i = S.log[S.log.length - 1];
  i && i.r === s && i.g === S.goal || S.log.push({
    t: Date.now(),
    r: s,
    g: S.goal,
    rd: a
  }), S.log.length > 60 && (S.log = S.log.slice(-60));
}

function event(e, s = {}) {
  S.events.push(Object.assign({
    t: Date.now(),
    type: e
  }, s)), S.events.length > 120 && (S.events = S.events.slice(-120));
}

function logRun(e, s, a, i = !0, o = {}) {
  S.runs.push(Object.assign({
    t: Date.now(),
    kind: e,
    engine: s,
    ms: Math.round(a),
    ok: i,
    lang: L()
  }, o)), S.runs.length > 200 && (S.runs = S.runs.slice(-200));
}

const PROMPT_V = {
  discover: "discover-4.2",
  plan: "path-3.1",
  interview: "interview-2.4",
  copilot: "copilot-2.0",
  explain: "explain-1.3",
  insights: "insights-1.1"
}, proofCount = () => confirmed().filter(e => S.skills[e].ev.some(e => "plan" === e.src)).length + (S.portfolio || []).length, passNo = () => S.pno || "SK-" + String(Math.abs([ ...(S.profile.name || "x") + S.created ].reduce((e, s) => 31 * e + s.charCodeAt(0) | 0, 7)) % 9e5 + 1e5);

function planSeed(e) {
  if (!e || !e.tasks) return null;
  if (e.seed) return e.seed;
  const s = [], a = [];
  return e.tasks.filter(e => e.day >= 1 && e.day <= 21 && e.skill).forEach(e => {
    "strengthen" === e.mode ? "review" === e.kind && a.push(e.skill) : s.includes(e.skill) || s.push(e.skill);
  }), {
    g: s,
    h: a
  };
}

function fallbackPlan(e, s) {
  const a = s ? s.g.filter(e => SK[e] || S.custom[e]) : gaps(e), i = (L(), e => t("s_" + e)), mk = (s, a, o, r, l, c) => ({
    day: s,
    kind: a,
    title: o,
    min: r,
    skill: l || "",
    why: c || t("w_" + a, {
      skill: l ? skName(l) : "",
      org: e.org
    }),
    steps: i(a)
  }), o = [];
  let r = 1;
  const strengthen = e => {
    const s = skName(e), m = e => Object.assign(e, {
      mode: "strengthen"
    });
    o.push(m(mk(r++, "review", t("t_num", {
      skill: s
    }), 15, e))), o.push(m(mk(r++, "practice", t("t_voice", {
      skill: s
    }), 15, e))), o.push(m(mk(r++, "prove", t("t_ref", {
      skill: s
    }), 20, e)));
  };
  a.slice(0, 3).forEach(e => {
    const s = tx(RES[e] || {
      en: skName(e)
    }), a = skName(e), i = DRILL[e], l = i && i.days ? i.days : [], ttl = (e, s) => l[e] ? tx(l[e]) : s;
    o.push(mk(r++, "learn", ttl(0, t("t_learn1", {
      res: s
    })), 20, e)), o.push(mk(r++, "learn", ttl(1, t("t_learn2", {
      res: s
    })), 25, e)), o.push(mk(r++, "practice", ttl(2, i ? tx(i.practice) : t("t_practice", {
      skill: a
    })), 25, e)), o.push(mk(r++, "learn", ttl(3, t("t_learn3", {
      skill: a
    })), 20, e)), o.push(mk(r++, "practice", ttl(4, t("t_practice2", {
      skill: a
    })), 20, e)), o.push(mk(r++, "prove", ttl(5, i ? tx(i.prove) : t("t_prove", {
      skill: a
    })), 30, e)), o.push(mk(r++, "review", ttl(6, t("t_review", {
      skill: a
    })), 15, e));
  });
  const l = s && s.h.length ? s.h : haves(e).sort((s, a) => e.req.find(e => e[0] === a)[1] - e.req.find(e => e[0] === s)[1]);
  let c = 0;
  for (;r <= 21; ) {
    strengthen(l[c % Math.max(1, l.length)] || e.req[0][0]), c++;
  }
  o.length = 21, r = 22;
  const p = tx(e.project), P = (s, a, o) => ({
    day: 0,
    kind: "project",
    title: t(s),
    min: a,
    skill: "",
    why: 0 === o ? p : t("w_project", {
      org: e.org
    }),
    steps: i("project")
  });
  return o.push(P("t_p1", 20, 0), P("t_p2", 25), P("t_p3", 30), mk(0, "interview", t("t_iv1"), 20, ""), P("t_p4", 30), P("t_p5", 20), mk(0, "interview", t("t_iv2"), 30, ""), P("t_p6", 15)), 
  o.push({
    day: 30,
    kind: "portfolio",
    title: t("t_p30"),
    min: 20,
    skill: "",
    why: p,
    steps: i("portfolio")
  }), o.map((e, s) => Object.assign(e, {
    day: s + 1
  }));
}

async function aiPlan(e) {
  const s = gaps(e), a = haves(e), i = `Create a 30-day micro-task plan for a Moroccan university student preparing for the role "${tx(e.title)}" at ${e.org} (${tx(C[e.city])}).\nSkills they already have: ${a.map(skName).join(", ") || "none yet"}.\nSkills they are missing (ids): ${s.join(", ") || "none"}.\nSkills they claim but have not proven yet (ids): ${a.join(", ") || "none"}. If fewer than 3 are missing, use the remaining weeks to produce proof for these claimed skills (a reference, numbers, a short recording, a document).\nStudy field: ${S.profile.field ? t(S.profile.field) : "unknown"}.\n\nEach day is ONE task of 15 to 30 minutes, realistic with a phone or laptop and free resources (HubSpot Academy, Microsoft Learn, Coursera free audit, Meta Blueprint, Google Sheets, Canva, YouTube).\nStructure: days 1-21 close the missing skills with learn → practice → prove cycles (tag each with the skill id it builds; every 7-day block ends with a "prove" task that produces a concrete artifact). Days 22-30 are fixed (portfolio project "${tx(e.project)}", two mock interviews, day 30 publishes the project): return them too, but they will be kept as planned.\nWrite in ${langName()}. Titles: at most 7 words. Each step: at most 10 words. "why": one short sentence.\nReply with only a JSON array of exactly 30 objects:\n[{"day":1,"kind":"learn","skill":"crm","title":"…","min":20,"why":"…","steps":["…","…","…"]}]\n"kind" is one of: learn, practice, prove, review. "skill" is one of the missing ids or "".`, o = await aiJSON(i, "default", "plan");
  if (!Array.isArray(o) || o.length < 25) return null;
  const r = fallbackPlan(e), l = new Set([ "learn", "practice", "prove", "review" ]);
  return r.map((a, i) => {
    if (i >= 21) return a;
    const r = o.find(e => e && +e.day === i + 1) || o[i] || {}, c = l.has(r.kind) ? r.kind : a.kind;
    let p = SK[r.skill] && e.req.some(e => e[0] === r.skill) ? r.skill : "";
    !p && i < 21 && (p = a.skill || s[Math.floor(i / 7)] || "");
    const d = Array.isArray(r.steps) && r.steps.length ? r.steps.slice(0, 4).map(e => String(e).slice(0, 120)) : a.steps;
    return {
      day: i + 1,
      mode: a.mode,
      kind: c,
      skill: p,
      title: String(r.title || a.title).slice(0, 90),
      min: Math.max(10, Math.min(45, +r.min || a.min)),
      why: String(r.why || a.why).slice(0, 200),
      steps: d
    };
  });
}

function ivQuestions(e) {
  const s = haves(e), a = gaps(e), i = skName(s.find(s => e.req.find(e => e[0] === s && e[1])) || s[0] || e.req[0][0]), o = s.find(e => skName(e) !== i) || s[0] || e.req[e.req.length - 1][0];
  return [ t("q1", {
    role: tx(e.title)
  }), t("q2", {
    skill: i
  }), a.length ? t("q3", {
    gap: skName(a[0])
  }) : t("q3b", {
    skill: skName(o)
  }), t("q4"), t("q5") ];
}

const ACTION_RE = /\b(led|built|sold|launched|negotiat\w*|coordinat\w*|organi[sz]ed|grew|increased|managed|served|presented|raised|solved|created)\b|lancé|coordonn|vendu|négoci|organisé|présenté|géré|augmenté|résolu|créé|نسقت|طلقت|أطلقت|بعت|تفاوضت|نظمت|قدمت|طلعو|رفعت|جمعنا|سيرت|حليت|درت|بنيت/i, IV_RE = {
  learn: /learn|course|practi[cs]e|tutorial|study|apprend|formation|cours|pratiqu|exerc|تعلم|أتعلم|دورة|تكوين|أتدرب|تمرين|نتعلم|غادي نتعلم/i,
  why: /because|interest|passion|motiv|goal|parce que|intéress|motiv|objectif|لأن|أحب|يهمني|هدفي|حيت|كنبغي/i,
  conflict: /problem|conflict|complain|angry|late|issue|solv|calm|listen|problème|conflit|plainte|retard|résolu|calme|écout|مشكل|مشكلة|شكاية|تأخر|حللت|حليت|هدوء|استمعت|سمعت/i,
  value: /strength|unique|prove|result|deliver|reliable|atout|force|résultat|fiable|démontr|نقطة قوة|نتيجة|أثبت|موثوق|كنقدر/i
}, words = e => norm(String(e).toLowerCase()).split(/[^\p{L}\p{N}]+/u).filter(e => e.length > 2);

function overlap(e, s) {
  const a = new Set(words(e)), i = new Set(words(s));
  if (!a.size || !i.size) return 0;
  let o = 0;
  return a.forEach(e => {
    i.has(e) && o++;
  }), o / Math.min(a.size, i.size);
}

function rulesFeedback(e, s, a = 0, i = []) {
  const o = e.trim().split(/\s+/).length, r = /\d/.test(e), l = ACTION_RE.test(e), skillRe = e => {
    const s = e.map(e => HINT[e] ? HINT[e].source : "").filter(Boolean).join("|");
    return s ? new RegExp(s, "i") : null;
  }, c = haves(s), p = gaps(s), d = words(tx(s.title)).some(s => norm(e.toLowerCase()).includes(s)) || (skillRe(s.req.map(e => e[0])) || /$^/).test(e), u = (skillRe([ c.find(e => s.req.find(s => s[0] === e && s[1])) || c[0] || s.req[0][0] ]) || /$^/).test(e), _ = (skillRe([ p[0] || s.req[s.req.length - 1][0] ]) || /$^/).test(e), h = [ [ d, IV_RE.why.test(e) ], [ u, l ], [ _ || IV_RE.learn.test(e), IV_RE.learn.test(e) ], [ IV_RE.conflict.test(e), l ], [ IV_RE.value.test(e) || d, r ] ][Math.min(4, a)], v = i.some(s => s && overlap(s, e) > .6), f = Math.min(95, 35 + .55 * Math.min(o, 90) + (sentences(e).length >= 3 ? 10 : 0)), g = Math.min(95, 25 + (r ? 35 : 0) + (l ? 25 : 0) + .15 * Math.min(o, 60));
  let b = 30 + (h[0] ? 40 : 0) + (h[1] ? 20 : 0);
  v && (b = Math.min(b, 35)), b = Math.min(95, b);
  const k = [ h[0] && t("fr_on", {}), r && t("fr_num"), l && t("fr_act"), o >= 40 && t("fr_len") ].filter(Boolean)[0] || t("fr_len"), w = v ? t("fi_repeat") : h[0] ? o < 25 ? t("fi_short") : r ? l ? t("fi_role", {
    role: tx(s.title)
  }) : t("fi_ex") : t("fi_num") : t([ "fi_q1", "fi_q2", "fi_q3", "fi_q4", "fi_q5" ][Math.min(4, a)], {
    role: tx(s.title),
    skill: skName(c[0] || s.req[0][0]),
    gap: skName(p[0] || s.req[0][0])
  }), A = confirmed().map(e => S.skills[e].ev[0]).filter(Boolean)[0];
  return {
    clarity: Math.round(f),
    evidence: Math.round(g),
    relevance: Math.round(b),
    good: k,
    improve: w,
    better: t("better_tpl", {
      ev: A ? A.text : "…"
    }),
    next: null,
    repeat: v
  };
}

async function aiFeedback(e, s, a, i, o) {
  const r = `You are a friendly but honest interviewer at ${a.org}, hiring for "${tx(a.title)}". The candidate is a Moroccan university student.\nCandidate's skills (with evidence): ${confirmed().map(e => skName(e) + ": " + ((S.skills[e].ev[0] || {}).text || "")).join(" | ").slice(0, 1500)}\nQuestion asked: "${e}"\nCandidate's answer: """${s.slice(0, 2500)}"""\n\nScore each 0-100: clarity, evidence (a concrete example, numbers), relevance (to this role).\nWrite all text in ${langName()}, addressed to the candidate. Be specific to what they wrote.\n${o ? 'Set "next" to "".' : `"next": the next interview question, one sentence, different from these: ${JSON.stringify(i)}. Make it build on their answer or probe a skill this role needs.`}\nReply with only JSON: {"clarity":70,"evidence":55,"relevance":80,"good":"one sentence","improve":"one sentence","better":"a stronger version of THEIR answer in first person, 3-5 sentences, keeping their real facts","next":"…"}`, l = await aiJSON(r, "default", "interview");
  if (!l || "object" != typeof l) return null;
  const n = e => Math.max(0, Math.min(100, Math.round(+e || 0)));
  return {
    clarity: n(l.clarity),
    evidence: n(l.evidence),
    relevance: n(l.relevance),
    good: String(l.good || ""),
    improve: String(l.improve || ""),
    better: String(l.better || ""),
    next: l.next ? String(l.next) : null,
    ai: !0
  };
}

function drawCertificate() {
  const e = opp(S.goal), s = 1684, a = document.createElement("canvas");
  a.width = s, a.height = 1190;
  const i = a.getContext("2d"), o = isAR(), r = o ? '"IBM Plex Sans Arabic","IBM Plex Sans",Tahoma,sans-serif' : '"IBM Plex Sans","Noto Sans Tifinagh",system-ui,sans-serif';
  i.fillStyle = "#F8F6EF", i.fillRect(0, 0, s, 1190), i.fillStyle = "#0F3D36", i.fillRect(0, 0, s, 300), 
  i.save(), i.translate(842, 150), i.scale(4.2, 4.2), i.translate(-16, -16), i.strokeStyle = "#F8F6EF", 
  i.lineWidth = 2.6, i.lineCap = "round", i.beginPath(), i.moveTo(5.5, 12.6), i.lineTo(5.5, 14.2), 
  i.arc(16, 14.2, 10.5, Math.PI, 0, !0), i.lineTo(26.5, 12.6), i.stroke(), i.fillStyle = "#F8F6EF", 
  i.beginPath(), i.arc(16, 6.4, 2.8, 0, 2 * Math.PI), i.fill(), i.restore(), i.direction = o ? "rtl" : "ltr", 
  i.textAlign = "center", i.fillStyle = "#9A7744", i.font = `600 30px ${r}`;
  const l = !!S.plan && doneCount() >= 30;
  i.fillText(t(l ? "cert_title" : "cert_title_p"), 842, 400), i.fillStyle = "#16201D", 
  i.font = `700 92px ${r}`, i.fillText(S.profile.name || "—", 842, 515), i.fillStyle = "#46504B", 
  i.font = `400 36px ${r}`, i.fillText(t(l ? "cert_body" : "cert_body_p", {
    d: nfmt(S.plan ? doneCount() : 0)
  }), 842, 595), i.fillStyle = "#0F3D36", i.font = `700 56px ${r}`, i.fillText(tx(e.title) + " · " + e.org, 842, 680), 
  i.strokeStyle = "#E6E1D3", i.lineWidth = 2, i.beginPath(), i.moveTo(220, 760), i.lineTo(1464, 760), 
  i.stroke();
  return [ [ t("cert_ready"), readyLabel(e) ], [ t("cert_skills"), String(confirmed().length) ], [ t("cert_date"), dateFmt(Date.now()) ] ].forEach(([e, s], a) => {
    const l = 842 + 420 * (a - 1) * (o ? -1 : 1);
    i.fillStyle = "#6B736E", i.font = `500 26px ${r}`, i.fillText(e, l, 840), i.fillStyle = "#16201D", 
    i.font = `700 46px ${r}`, i.fillText(s, l, 900);
  }), i.fillStyle = "#6B736E", i.font = '500 24px "IBM Plex Sans",system-ui,sans-serif', 
  i.direction = "ltr", i.fillText("SKILMA  ·  " + passNo(), 842, 1080), a;
}

function jpegPDF(e, s, a) {
  const i = new TextEncoder, o = [], r = [];
  let l = 0;
  const push = e => {
    const s = "string" == typeof e ? i.encode(e) : e;
    o.push(s), l += s.length;
  };
  push("%PDF-1.4\n");
  const obj = (e, s) => {
    r[e] = l, push(`${e} 0 obj\n${s}\nendobj\n`);
  };
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>"), obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>"), 
  obj(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>"), 
  r[4] = l, push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${s} /Height ${a} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${e.length} >>\nstream\n`), 
  push(e), push("\nendstream\nendobj\n");
  const c = "q 842 0 0 595 0 0 cm /Im0 Do Q";
  obj(5, `<< /Length 30 >>\nstream\n${c}\nendstream`);
  const p = l;
  return push(`xref\n0 6\n0000000000 65535 f \n${[ 1, 2, 3, 4, 5 ].map(e => String(r[e]).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${p}\n%%EOF`), 
  new Blob(o, {
    type: "application/pdf"
  });
}

async function downloadCertificate() {
  const e = drawCertificate(), s = e.toDataURL("image/jpeg", .92), a = atob(s.split(",")[1]), i = new Uint8Array(a.length);
  for (let e = 0; e < a.length; e++) i[e] = a.charCodeAt(e);
  const o = jpegPDF(i, e.width, e.height), r = "skilma-certificate.pdf";
  if (DL) try {
    await DL.save({
      filename: r,
      data: o
    }), toast(t("cert_saved"));
  } catch (e) {
    e && "declined" !== e.code && toast(t("cert_no"), "x");
  } else try {
    const e = document.createElement("a");
    e.href = URL.createObjectURL(o), e.download = r, document.body.appendChild(e), e.click(), 
    setTimeout(() => {
      URL.revokeObjectURL(e.href), e.remove();
    }, 1500), toast(t("cert_saved"));
  } catch (e) {
    toast(t("cert_no"), "x");
  }
}

OPPS.forEach(e => {
  const s = e.org, a = e.ini;
  Object.defineProperty(e, "org", {
    get: () => pn(s),
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "ini", {
    get: () => "zgh" === L() && NAMEZ && NAMEZ[s] ? NAMEZ[s].split(/\s+/).slice(0, 2).map(e => [ ...e ][0]).join("") : a,
    enumerable: !0,
    configurable: !0
  });
});

const te = (e, s) => esc(t(e, s)), bdi = e => `<bdi>${esc(e)}</bdi>`, KIND_IC = {
  learn: "book",
  practice: "tool",
  prove: "file",
  review: "pen",
  project: "target",
  interview: "mic",
  portfolio: "trophy",
  apply: "send"
}, NAV = [ [ "home", "home", "nav_home" ], [ "passport", "pass", "nav_pass" ], [ "opps", "map", "nav_opps" ], [ "plan", "plan", "nav_plan" ], [ "interview", "mic", "nav_iv" ] ], smallIc = (e, s) => ic(e).replace("<svg", `<svg style="width:15px;height:15px;vertical-align:-3px${s ? ";color:" + s : ""}"`), LNAME = {
  ary: "الدارجة",
  ar: "العربية",
  fr: "Français",
  en: "English",
  zgh: "ⵜⴰⵎⴰⵣⵉⵖⵜ"
}, LCODE = {
  ary: "دارجة",
  en: "EN",
  fr: "FR",
  ar: "ع",
  zgh: "ⵣ"
};

function langPick() {
  return `<button class="lang-pick" data-act="lang-pick" data-pop aria-haspopup="menu" aria-expanded="false" aria-label="${te("set_lang")}: ${esc(LNAME[L()])}" title="${te("set_lang")}">${ic("globe")}<span lang="${langTag(L())}">${LCODE[L()]}</span></button>`;
}

function langMenu(e) {
  openPop(e, `<div class="lp-menu">${LANGS.map(e => `<button role="menuitemradio" aria-checked="${L() === e}" class="lp-i" data-act="lang" data-l="${e}" lang="${langTag(e)}" dir="${"ar" === e || "ary" === e ? "rtl" : "ltr"}"><span>${LNAME[e]}</span>${L() === e ? ic("check") : ""}</button>`).join("")}</div>`);
}

function langSeg() {
  return `<div class="seg" role="group" aria-label="${te("set_lang")}">${LANGS.map(e => `<button data-act="lang" data-l="${e}" aria-pressed="${L() === e}" lang="${langTag(e)}" aria-label="${te("lang_" + e)}">${"ar" === e ? "ع" : "ary" === e ? "دارجة" : "zgh" === e ? "ⵣ" : e.toUpperCase()}</button>`).join("")}</div>`;
}

const stage = e => `<div class="stage"><header class="stage-top">${brand()}<div class="top-r">${langPick()}${themeUI("toggle")}</div></header>${e}</div>`;

function hl(e, s) {
  const a = String(e);
  if (!s) return esc(a);
  let i = a.toLowerCase().indexOf(String(s).toLowerCase());
  if (i < 0) return esc(a);
  let o = i + s.length;
  const r = /[\s.,;:!?،؟«»“”"()]/;
  for (;i > 0 && !r.test(a[i - 1]); ) i--;
  for (;o < a.length && !r.test(a[o]); ) o++;
  return esc(a.slice(0, i)) + "<mark>" + esc(a.slice(i, o)) + "</mark>" + esc(a.slice(o));
}

const passMini = () => `<span class="pass-mini" id="passMini"><span class="pi">${ic("pass")}</span><span><span class="num" id="pmCount">${nfmt(confirmed().length)}</span> ${te("ch_pass_n", {
  n: confirmed().length
})}</span></span>`;

function aiShort() {
  const e = "live" === AI.state;
  return `<span class="pill ${e ? "teal live" : ""}" data-ai-pill="s" title="${esc(t(e ? "ai_live" : "ai_off_d"))}"><span class="dot"></span>${te(e ? "set_ai" : "ai_off")}</span>`;
}

const STATE = {
  sugg: [ "spark", "st_sugg" ],
  conf: [ "check", "st_conf" ],
  proven: [ "file", "st_proof" ],
  ver: [ "shield", "st_ver" ],
  miss: [ "target", "st_miss" ],
  rej: [ "x", "st_rej" ]
}, stateTag = (e, s) => `<span class="state s-${e}" title="${te(STATE[e][1])}">${ic(STATE[e][0])}${void 0 !== s ? esc(s) : te(STATE[e][1])}</span>`;

function skillState(e) {
  const s = S.skills[e];
  return s ? "rejected" === s.status ? "rej" : s.ver ? "ver" : s.ev.some(e => "plan" === e.src) ? "proven" : "conf" : "miss";
}

function fitFacts(e) {
  const s = haves(e).length, a = coreGaps(e);
  return `<span class="num">${te("fit_skills", {
    a: nfmt(s),
    b: nfmt(e.req.length)
  })}</span> · <span>${a ? te("fit_core", {
    n: nfmt(a)
  }) : te("fit_core0")}</span>`;
}

function vDiscover() {
  const e = ui.disc, s = `<header class="stage-top">${brand()}<div class="top-r">${"reading" === e.phase ? aiPill() : passMini()}</div></header>`;
  let a = "";
  if ("reading" === e.phase) {
    const s = e.story.split(/(\s+)/).map(e => /\s+/.test(e) ? e : `<span class="w">${esc(e)}</span>`).join("");
    a = `<section class="reading"><div class="reading-m" style="position:relative;width:104px;height:104px">${mascot("thinking")}</div>\n      <p class="status-line" id="rdline" aria-live="polite">${te("rd_1")}</p>\n      <div class="scan" id="scan" aria-hidden="true">${s}</div>\n      <div class="found-live" id="foundLive" aria-hidden="true"></div></section>`;
  } else if ("reveal" === e.phase) {
    const s = e.items[e.i];
    a = `<section class="theater" aria-live="polite">\n      <div class="spot"></div>\n      <div class="th-prog"><span class="num">${te("th_of", {
      i: nfmt(e.i + 1),
      n: nfmt(e.items.length)
    })}</span><span class="th-bar" aria-hidden="true">${e.items.map((s, a) => `<i class="${"yes" === s.res ? "done" : "no" === s.res ? "no" : a === e.i ? "cur" : ""}"></i>`).join("")}</span></div>\n      <div class="th-tags">${stateTag("sugg")}${s.rare ? `<span class="th-badge rare" id="thBadge">${ic("star")}${te("th_rare")}</span>` : ""}${"ai" === e.src ? `<span class="th-conf ${s.conf}">${te("medium" === s.conf ? "conf_med" : "conf_high")}</span>` : ""}</div>\n      <h1 class="th-name" id="thName">${esc(skName(s.id))}</h1>\n      ${s.evidence ? `<blockquote class="th-quote"><span class="th-src">${ic("ai" === e.src ? "spark" : "book")}${te("ai" === e.src ? "th_by_ai" : "th_by_rules")}</span>${hl(s.evidence, s.term)}</blockquote>` : ""}\n      <p class="th-why">${esc(whyFor(s))}</p>\n      <p class="th-ask">${te("th_q")}</p>\n      <div class="th-acts"><button class="btn lg" data-act="th-yes" id="thYes">${ic("check")}${te("th_yes")}</button><button class="btn ghost lg" data-act="th-no">${ic("x")}${te("th_no")}</button></div>\n      <button class="linkbtn th-fix-b" data-act="th-fix" aria-expanded="false" aria-controls="thFix">${te("th_fix")}</button><div class="th-fix" id="thFix" hidden></div>\n      <button class="linkbtn th-all" data-act="th-all">${te("th_all")}</button>\n      <div class="th-masc">${mascot(s.rare ? "happy" : "curious")}</div>\n    </section>`;
  } else if ("done" === e.phase) {
    const s = e.items.filter(e => "yes" === e.res), i = e.items.filter(e => "no" === e.res).length, o = s.filter(e => e.rare).length;
    a = `<section class="done-wrap">\n      <div class="reading-m" style="position:relative;width:110px;height:110px">${mascot(s.length ? "celebrate" : "calm")}</div>\n      <div class="big-num num" data-count="${s.length}">0</div>\n      <h1 style="font-size:clamp(26px,4vw,40px)">${te("dn_t")}${o ? ` <span class="mute">· ${te("dn_rare", {
      n: nfmt(o)
    })}</span>` : ""}</h1>\n      <p class="lead">${te("dn_sub")}</p>\n      <div class="chips-wrap">${s.map(e => `<span class="state s-conf">${ic(e.rare ? "star" : "check")}${esc(skName(e.id))}</span>`).join("")}</div>\n      ${i ? `<p class="dim" style="font-size:14px">${te("dn_left", {
      n: nfmt(i)
    })}</p>` : ""}\n      ${e.skipped ? `<p class="dim" style="font-size:14px">${te("dn_skip", {
      n: nfmt(e.skipped)
    })}</p>` : ""}\n      <button class="btn lg" data-act="disc-next">${te(e.ret ? "dn_back" : "dn_go")} ${ic("arrow")}</button>\n    </section>`;
  } else a = `<section class="done-wrap"><div class="reading-m" style="position:relative;width:100px;height:100px">${mascot("calm")}</div>\n      <h1 style="font-size:clamp(22px,3.4vw,32px)">${te("dn_none")}</h1>\n      ${e.skipped ? `<p class="dim">${te("dn_skip", {
    n: nfmt(e.skipped)
  })}</p>` : ""}\n      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn lg" data-act="disc-retry">${ic("pen")}${te("dn_retry")}</button>${e.ret ? `<button class="btn ghost lg" data-act="disc-next">${te("dn_back")}</button>` : ""}</div></section>`;
  return `<main class="stage" id="main">${s}${a}</main>`;
}

function goalCard(e, s) {
  return `<button class="goal-card" data-act="pick-goal" data-id="${e.id}">\n    <span class="logo">${esc(e.ini)}</span>\n    <span style="min-width:0;display:grid;gap:4px"><span class="h3">${esc(tx(e.title))}</span><span class="meta">${bdi(e.org)} · ${esc(tx(C[e.city]))}</span>\n      <span class="meta">${fitFacts(e)}</span></span>\n    <span class="go"><span class="fit-big amber num">${nfmt(haves(e).length)}/${nfmt(e.req.length)}</span><span class="dim" style="font-size:12px">${te("fit_" + fitBand(s, e))}</span></span></button>`;
}

const AIMS = [ [ "job", "aim_job" ], [ "intern", "aim_intern" ], [ "explore", "aim_explore" ] ], YEARS = [ [ "y_early", "yr_early" ], [ "y_final", "yr_final" ], [ "y_grad", "yr_grad" ] ], chipGroup = (e, s, a, i, o) => `<div class="field"><span class="flabel" id="${e}">${te(s)}</span><div class="chips-wrap" role="group" aria-labelledby="${e}" style="justify-content:flex-start">${i.map(([e, s]) => `<button class="chip ${o(e) ? "on" : ""}" data-act="${a}" data-k="${e}" aria-pressed="${o(e)}">${te(s)}</button>`).join("")}</div></div>`, yearGroup = () => chipGroup("yrL", "su_year", "su-year", YEARS, e => S.profile.year === e), langGroup = () => chipGroup("lgL", "su_langs", "su-lang", PLANGS.map(e => [ e, "pl_" + e ]), e => (S.profile.langs || []).includes(e)), aimGroup = () => chipGroup("aimL", "cm_aim", "cm-aim", AIMS, e => S.profile.aim === e);

function vSetup() {
  if ("name" === ui.setupStep) return stage(`<section class="setup">\n    <div class="reading-m" style="position:relative;width:80px;height:80px">${mascot("happy")}</div>\n    <h1>${te("su_name_t")}</h1>\n    <div class="field"><label for="nm" class="sr">${te("su_name_ph")}</label><input id="nm" class="inp" autocomplete="given-name" maxlength="40" placeholder="${te("su_name_ph")}" value="${esc(S.profile.name)}" style="font-size:20px"></div>\n    <div class="field"><span class="flabel" id="fieldL">${te("su_field")}</span><div class="chips-wrap" role="group" aria-labelledby="fieldL" style="justify-content:flex-start">${FIELDS.map(e => `<button class="chip ${S.profile.field === e ? "on" : ""}" data-act="field" data-f="${e}" aria-pressed="${S.profile.field === e}">${te(e)}</button>`).join("")}</div></div>\n    ${yearGroup()}${langGroup()}<p class="dim" style="font-size:13px;margin:0">${te("su_why")}</p>\n    <div><button class="btn lg" data-act="su-name">${te("su_next")} ${ic("arrow")}</button></div></section>`);
  const e = S.profile.aim, s = liveOpps().map(s => ({
    o: s,
    p: fitRank(s) + (e && "explore" !== e && s.type === e ? .12 : 0)
  })).sort((e, s) => s.p - e.p).slice(0, 3).map(e => ({
    o: e.o,
    p: fit(e.o)
  }));
  return stage(`<section class="setup">\n    <h1>${te("su_goal_t")}</h1><p class="mute">${te("su_goal_s")}</p>\n    <div class="goal-grid">${s.map(({o: e, p: s}) => goalCard(e, s)).join("")}</div>\n    <details class="how"><summary>${te("fit_how")}</summary><p>${te("fit_how_d")}</p></details>\n    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn ghost" data-act="su-map">${ic("map")}${te("su_map")}</button><button class="btn ghost" data-act="su-later">${te("su_later")}</button></div></section>`);
}

function weekDots() {
  const e = todayDay(), s = Math.floor((Math.min(30, e) - 1) / 7), a = [];
  for (let e = 7 * s + 1; e <= Math.min(30, 7 * s + 7); e++) a.push(e);
  return `<div class="wdots">${a.map(s => `<button class="wd ${S.plan.done[s] ? "done" : ""} ${s === e ? "today" : ""} ${"prove" === task(s).kind ? "prove" : ""}" data-act="open-task" data-day="${s}" data-d="${s}" aria-label="${te("day_n", {
    n: s
  })}: ${esc(task(s).title)}"><i>${S.plan.done[s] ? ic("check") : "prove" === task(s).kind ? ic("file") : ""}</i><span class="num">${nfmt(s)}</span></button>`).join("")}</div>`;
}

function readyList(e) {
  const s = readyItems(e), a = s.filter(e => "conf" === e.k), i = s.filter(e => "ev" === e.k), o = s.find(e => "iv" === e.k), r = s.find(e => "pf" === e.k), row = (e, s) => `<li class="${e ? "ok" : ""}">${ic(e ? "check" : "dot")}<span>${s}</span></li>`, all = e => e.every(e => e.done);
  return `<ul class="rlist">${row(all(a), te("rd_conf", {
    a: nfmt(a.filter(e => e.done).length),
    b: nfmt(a.length)
  }))}${row(all(i), te("rd_ev", {
    a: nfmt(i.filter(e => e.done).length),
    b: nfmt(i.length)
  }))}${row(o.done, te("rd_iv"))}${row(r.done, te("rd_pf"))}</ul>\n    <p class="rl-note">${isReady(e) ? `<span class="pill teal">${ic("check")}${te("rd_ready")}</span>` : `<span class="dim">${te("rd_note")}</span>`}</p>`;
}

function homeTip() {
  const e = S.goal && opp(S.goal);
  if (!e) {
    const e = liveOpps().map(e => ({
      x: e,
      p: fitRank(e)
    })).sort((e, s) => s.p - e.p)[0];
    return {
      text: t("tip_nogoal", {
        role: tx(e.x.title),
        a: nfmt(haves(e.x).length),
        b: nfmt(e.x.req.length)
      }),
      act: `data-act="open-opp" data-id="${e.x.id}"`,
      btn: t("od_why")
    };
  }
  const s = gaps(e);
  if (isReady(e)) return {
    text: t("tip_ready"),
    q: t("cp_s3")
  };
  if (s.length) return {
    text: t("tip_gap", {
      skill: skName(s[0]),
      role: tx(e.title)
    }),
    q: t("cp_s1")
  };
  const a = e.req.filter(([e, s]) => s && owned(e) && "conf" === skillState(e)).map(e => e[0]);
  return a.length ? {
    text: t("tip_prove", {
      skill: skName(a[0])
    }),
    q: t("cp_s1")
  } : {
    text: t("tip_iv"),
    q: t("cp_s4")
  };
}

function vHome() {
  const e = S.goal && opp(S.goal), s = e ? readiness(e) : 0, a = S.profile.name || "", i = (new Date).getHours(), o = te(i >= 4 && i < 17 ? "hi_m" : "hi_e", {
    name: a
  }), r = todayDay(), l = task(r), c = confirmed().length;
  let p, d;
  if (e) if (r > 30) p = `<section class="next"><div style="min-width:0"><div class="k">${ic("trophy")}${te("pl_all")}</div><h1 class="next-t">${te("hm_done")}</h1></div><button class="btn amber lg" data-act="open-opp" data-id="${e.id}">${te("od_apply")} ${ic("arrow")}</button></section>`; else {
    const e = l.skill ? owned(l.skill) ? skillState(l.skill) : "miss" : null;
    p = `<section class="next"><div style="min-width:0"><div class="k">${ic(KIND_IC[l.kind])}${te("hm_next")} · <span class="num">${te("day_n", {
      n: nfmt(r)
    })}</span> · <span class="num">${te("min_n", {
      n: nfmt(l.min)
    })}</span></div>\n      <h1 class="next-t">${esc(l.title)}</h1><p class="next-why">${te("hm_why", {
      x: l.why
    })}</p>\n      <div class="next-meta">${e ? stateTag(e, skName(l.skill)) : ""}${"prove" === l.kind ? `<span class="pill teal">${ic("file")}${te("tk_why_proof")}</span>` : ""}</div></div>\n      <button class="btn lg" data-act="open-task" data-day="${r}">${te("start_now")} ${ic("arrow")}</button></section>`;
  } else p = `<section class="next opp-next"><div style="min-width:0"><div class="k">${ic("map")}${te("hm_next")}</div><h1 class="next-t">${te("hm_pick")}</h1><p class="next-why">${te("hm_nogoal", {
    n: nfmt(c)
  })}</p></div><button class="btn amber lg" data-act="go" data-to="opps">${te("nav_opps")} ${ic("arrow")}</button></section>`;
  if (e) {
    const a = gaps(e);
    haves(e);
    d = `<section class="dest">\n      <div class="dest-ring">${ring(s, 128, 9, "", readyLabel(e), isReady(e))}<span class="dim" style="font-size:12px">${te("rd_steps")}</span></div>\n      <div style="min-width:0;display:grid;gap:8px;align-content:start">\n        <p class="eyebrow">${te("hm_dest")}</p>\n        <h2 class="dest-t"><button class="linkbtn amber" data-act="open-opp" data-id="${e.id}">${esc(tx(e.title))}</button></h2><p class="dim dest-org">${bdi(e.org)} · ${esc(tx(C[e.city]))}</p>\n        ${readyList(e)}\n        <details class="how"><summary>${te("fit_how")}</summary><p>${te("ready_how")}</p></details>\n      </div>\n      <div class="dest-gaps">${(() => {
      const s = e.req.filter(([e]) => owned(e) && "conf" === skillState(e)).map(e => e[0]), row = (e, s) => {
        const a = S.plan && S.plan.tasks.find(s => s.skill === e && !S.plan.done[s.day]);
        return `<div class="gap-row">${stateTag(s, skName(e))}<span class="dim num" style="font-size:13px">${a ? te("day_n", {
          n: nfmt(a.day)
        }) + " · " + te("hm_in_path") : ""}</span></div>`;
      };
      return (a.length ? `<p class="eyebrow">${te("hm_missing")}</p>` + a.map(e => row(e, "miss")).join("") : "") + (s.length ? `<p class="eyebrow" style="margin-top:${a.length ? 12 : 0}px">${te("hm_unproven")}</p>` + s.slice(0, 4).map(e => row(e, "conf")).join("") : "") || `<p class="mute">${te("why_nogap")}</p>`;
    })()}</div>\n    </section>`;
  } else d = `<section class="dest"><div style="min-width:0;display:grid;gap:12px;grid-column:1/-1"><p class="eyebrow">${te("pp_q")}</p><div class="chips-wrap" style="justify-content:flex-start">${confirmed().map(e => stateTag(skillState(e), skName(e))).join("")}</div></div></section>`;
  const u = homeTip();
  return `<p class="hm-hi">${o}</p>` + p + d + `<div class="two">\n    ${S.plan ? `<section class="panel"><div class="week-head"><h3>${te("this_week")}</h3><span class="dim num">${te("pl_days", {
    n: nfmt(doneCount())
  })}</span></div>${weekDots()}</section>` : `<section class="panel"><h3>${te("pp_title")}</h3><p class="mute" style="margin-top:8px">${te("vs1d", {
    n: nfmt(c)
  })}</p><button class="btn ghost sm" data-act="go" data-to="passport" style="margin-top:12px">${te("nav_pass")} ${ic("arrow")}</button></section>`}\n    <section class="panel tip"><div class="tip-m" style="position:relative">${mascot("happy")}</div><div style="min-width:0"><p class="eyebrow">${te("tip_t")}</p><p style="margin-top:6px">${esc(u.text)}</p><button class="btn ghost sm" ${u.act || `data-act="copilot" data-q="${esc(u.q)}"`}>${ic("chat")}${esc(u.btn || t("ask"))}</button></div></section>\n  </div>`;
}

function qrCells() {
  const e = [], s = [ ...passNo() ].reduce((e, s) => 7 * e + s.charCodeAt(0) | 0, 3);
  for (let a = 0; a < 169; a++) {
    const i = a % 13, o = Math.floor(a / 13), r = i < 5 ? i : i > 7 ? i - 8 : -1, l = o < 5 ? o : o > 7 ? o - 8 : -1, c = r >= 0 && l >= 0 && !(i > 7 && o > 7) ? 0 === r || 4 === r || 0 === l || 4 === l || 2 === r && 2 === l : 1 & (s >> a % 23 ^ 2654435761 * a >>> 7);
    e.push(`<i class="${c ? "" : "o"}"></i>`);
  }
  return e.join("");
}

function verSteps() {
  const e = confirmed(), s = proofCount(), a = S.verify.status;
  return `<div class="ver-steps">\n    <div class="vs on"><i>${ic("check")}</i><div><b>${te("vs1")}</b><span>${te("vs1d", {
    n: nfmt(e.length)
  })}</span></div></div>\n    <div class="vs ${s ? "on" : ""}"><i>${ic(s ? "check" : "file")}</i><div><b>${te("vs2")}</b><span>${s ? te("vs2d", {
    n: nfmt(s)
  }) : te("vs2d0")}</span></div></div>\n    <div class="vs ${"verified" === a ? "on" : "requested" === a ? "wait" : ""}"><i>${ic("verified" === a ? "check" : "requested" === a ? "clock" : "uni")}</i><div><b>${te("vs3")}</b><span>${"verified" === a ? te("vs3dv", {
    d: dateFmt(S.verify.at)
  }) : te("requested" === a ? "vs3dw" : "vs3d0")}</span></div></div></div>`;
}

function vPassport() {
  const e = confirmed(), s = S.profile.name || "—", a = e.filter(e => "proven" === skillState(e) || "ver" === skillState(e)).length, i = Object.keys(S.skills).filter(e => "rejected" === S.skills[e].status), o = `<div class="idwrap"><div class="idcard ${ui.flip ? "flipped" : ""}" id="idcard" role="img" aria-label="${te("pp_title")} · ${esc(s)} · ${passNo()}">\n      <div class="idf front"><div class="id-top"><span class="ttl">${te("pp_cover")}</span><span class="mono dim">${passNo()}</span></div>\n        <div class="id-mid"><div class="emb">${mascot("calm")}</div><div style="min-width:0"><h2>${esc(s)}</h2><p class="dim">${S.profile.field ? te(S.profile.field) : ""}</p></div></div>\n        <div class="id-stats"><div><b class="num">${nfmt(e.length)}</b><span>${te("pp_skills")}</span></div><div><b class="num">${nfmt(a)}</b><span>${te("st_proof")}</span></div><div><b class="num">${"verified" === S.verify.status ? ic("shield") : "—"}</b><span>${te("st_ver")}</span></div></div>\n        <div class="id-foot"><span>${te("pp_issued")} ${esc(dateFmt(S.created))}</span>${"verified" === S.verify.status ? `<span class="stamp">${ic("shield")}${te("st_ver")}</span>` : ""}</div></div>\n      <div class="idf back"><div class="qr" aria-hidden="true">${qrCells()}</div>${verSteps()}</div>\n    </div>\n    <div class="id-ctl"><button class="btn ghost sm" data-act="flip-card">${ic("refresh")}${te("pp_card_flip")}</button>${"none" === S.verify.status ? `<button class="btn sm" data-act="ask-verify">${ic("shield")}${te("ask_verify")}</button>` : "requested" === S.verify.status ? `<button class="btn ghost sm" data-act="role" data-r="uni">${ic("uni")}${te("nav_uni")}</button>` : ""}</div></div>`, r = e.length ? e.map(e => {
    const s = S.skills[e], a = skillState(e), i = s.ev[s.ev.length - 1] || {}, o = liveOpps().filter(s => s.req.some(s => s[0] === e)).length;
    return `<article class="cap"><div class="cap-h"><h3>${s.rare ? smallIc("star") + " " : ""}${esc(skName(e))}</h3>${stateTag(a)}</div>\n        ${i.text ? `<blockquote class="cap-ev">${esc(i.text)}</blockquote>` : ""}\n        <div class="cap-f"><span>${te("plan" === i.src || "note" === i.src ? "src_plan" : "chat" === i.src ? "src_chat" : "src_story")}${s.ev.length > 1 ? ` · ${te("ev_n", {
      n: nfmt(s.ev.length)
    })}` : ""}</span>${o ? `<span>${te("pp_unlocks", {
      n: nfmt(o)
    })}</span>` : ""}<button class="linkbtn dim" data-act="skill-remove" data-id="${e}">${te("remove")}</button></div></article>`;
  }).join("") : `<p class="mute">${te("pp_none")}</p>`, l = ui.ppTab || "skills", c = `<div class="ph"><div><h1>${te("pp_title")}</h1><p>${te("pp_sub")}</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost" data-act="pal-go" data-h="#/experience/new">${ic("plus")}${te("pp_add")}</button><button class="btn" data-act="pp-tab" data-t="share">${ic("share")}${te("pp_share")}</button></div></div>` + ppTabs();
  return "experiences" === l ? c + vExperiences() : "share" === l ? c + vShare() : c + `<div class="pp">${o}\n    <div class="pp-main"><div class="sec-h"><h2>${te("pp_q")}</h2><span class="dim num">${nfmt(e.length)}</span></div><div class="caps">${r}</div>\n      ${proofBlock()}\n      ${i.length ? `<div class="sec-h"><h2>${te("pp_left")}</h2></div><div class="chips-wrap" style="justify-content:flex-start">${i.map(e => `<span class="state s-rej">${ic("x")}${esc(skName(e))}<button class="linkbtn" data-act="skill-restore" data-id="${e}">${te("restore")}</button></span>`).join("")}</div>` : ""}\n    </div></div>`;
}

function proofBlock(e) {
  const s = S.portfolio || [], a = S.goal && opp(S.goal), i = a && S.ivBest[a.id] && !0 === S.share.iv ? S.ivBest[a.id] : 0;
  if (e && !s.length && !i) return "";
  return `<div class="sec-h"><h2>${te("pf_title")}</h2>${s.length ? `<span class="dim num">${nfmt(s.length)}</span>` : ""}</div>\n    <div class="pf-list">${s.length ? s.map(e => `<article class="pf"><span class="pf-i">${ic("trophy")}</span><div class="pf-t"><b>${esc(e.title)}</b><small>${te("pf_from", {
    role: opp(e.goal) ? tx(opp(e.goal).title) : ""
  })} · ${esc(dateFmt(e.at))}</small>${e.proof && !LINK_RE.test(e.proof) ? `<p>${esc(e.proof)}</p>` : ""}</div>${(e => {
    const s = String(e.proof || "").match(LINK_RE);
    return s ? `<a class="lnk pf-l" href="${esc(/^https?:/i.test(s[0]) ? s[0] : "https://" + s[0])}" target="_blank" rel="noopener noreferrer">${ic("link")}${te("pf_open")}</a>` : "";
  })(e)}</article>`).join("") : `<p class="mute pf-none">${ic("trophy")}<span>${te("pf_none")}</span></p>`}\n      ${i ? `<article class="pf"><span class="pf-i">${ic("mic")}</span><div class="pf-t"><b>${te("pp_iv")}</b><small>${te("pp_iv_d", {
    s: nfmt(i),
    role: tx(a.title)
  })}</small></div></article>` : ""}</div>`;
}

function whyRules(e) {
  const s = haves(e), a = gaps(e);
  fit(e);
  return ((s.length ? t("why_rules", {
    have: list(s.map(skName)),
    a: nfmt(s.length),
    b: nfmt(e.req.length)
  }) : "") + " " + (a.length ? t("why_gap", {
    miss: list(a.map(skName)),
    h: a.reduce((e, s) => e + (RES[s] ? RES[s].h : 4), 0)
  }) : t("why_nogap"))).trim();
}

function mapSVG(e) {
  const s = 300, a = 300, rad = e => 104 + 186 * (1 - e / 100), i = ui.sel, o = {}, r = Math.max(1, e.length);
  e.forEach(({o: e, p: i}, l) => {
    const c = (360 * l / r - 75) * Math.PI / 180, p = rad(i);
    o[e.id] = {
      x: Math.max(34, Math.min(566, s + Math.cos(c) * p)),
      y: Math.max(34, Math.min(566, a + Math.sin(c) * p)),
      s: 8 + i / 100 * 12,
      a: c
    };
  });
  const l = new Set([ i, S.goal, e[0] && e[0].o.id ].filter(Boolean)), c = [ 75, 50, 25 ].map(e => `<circle class="orb" cx="300" cy="300" r="${rad(e)}"/>`).join(""), p = i && o[i] ? `<line class="link" x1="300" y1="300" x2="${o[i].x}" y2="${o[i].y}"/>` : "", d = e.map(({o: e, p: s}) => {
    const a = o[e.id], r = fitBand(s, e), c = tx(e.short), p = 7.6 * c.length;
    a.x, a.s;
    return `<g class="dot ${r} ${i === e.id ? "sel" : ""}" data-act="sel-opp" data-id="${e.id}" tabindex="0" role="button" aria-label="${esc(tx(e.title))} · ${te("fit_skills", {
      a: nfmt(haves(e).length),
      b: nfmt(e.req.length)
    })}"><circle class="halo" cx="${a.x}" cy="${a.y}" r="${1.6 * a.s}"/><circle class="core" cx="${a.x}" cy="${a.y}" r="${a.s}"/>${S.goal === e.id ? `<circle cx="${a.x}" cy="${a.y}" r="${a.s + 6}" class="goal-r"/>` : ""}</g>\n      ${l.has(e.id) ? (() => {
      const s = Math.cos(a.a), o = Math.sin(a.a), r = a.s + 12, l = s >= .5 ? 1 : s <= -.5 || o < 0 ? 0 : 1, p = 8 * c.length, d = a.x + r + p < 594, u = a.x - r - p > 6;
      if (!d && !u) {
        const s = Math.max(p / 2 + 6, Math.min(594 - p / 2, a.x));
        return `<text class="dlab ${i === e.id ? "" : "dim"}" x="${s}" y="${a.y + a.s + 20}" text-anchor="middle">${esc(c)}</text>`;
      }
      const _ = l ? d : !u;
      return `<text class="dlab ${i === e.id ? "" : "dim"}" x="${_ ? a.x + r : a.x - r}" y="${a.y + 5 + 6 * o}" text-anchor="${_ ? "start" : "end"}">${esc(c)}</text>`;
    })() : ""}`;
  }).join("");
  return `<svg class="map" viewBox="0 0 600 600" style="direction:ltr" role="group" aria-label="${te("om_title")}">${c}${p}${d}\n    <g class="me">${mascot("happy", 'x="270" y="270" width="60" height="60" style="width:60px;height:60px;overflow:visible"')}<text class="dlab" x="300" y="352" text-anchor="middle">${te("om_you")}</text></g></svg>\n    <div class="map-legend"><span><i class="lgd strong"></i>${te("fit_strong")}</span><span><i class="lgd worth"></i>${te("fit_worth")}</span><span><i class="lgd stretch"></i>${te("fit_stretch")}</span></div>`;
}

function listHTML(e) {
  return `<div class="olist">${e.map(({o: e, p: s}) => `<button class="orow ${ui.sel === e.id ? "sel" : ""}" data-act="sel-opp" data-id="${e.id}"><span class="logo">${esc(e.ini)}</span><span style="min-width:0"><span class="h3" style="font-size:16px">${esc(tx(e.title))}</span><span class="meta" style="display:block">${bdi(e.org)} · ${fitFacts(e)}</span></span><span class="fit amber num">${nfmt(haves(e).length)}/${nfmt(e.req.length)}</span></button>`).join("")}</div>`;
}

function eligRows(e) {
  const s = ELIG[e.id] || {
    lv: "any",
    lg: []
  }, a = S.profile.year, i = S.profile.langs, o = [ [ "any" === s.lv || (a ? "fy" === s.lv ? [ "y_final", "y_grad" ].includes(a) : "y_grad" === a : null), te("el_lv_" + s.lv) ] ];
  return s.lg.forEach(e => o.push([ i && i.length ? i.includes(e) : null, te("el_lang", {
    l: t("pl_" + e)
  }) ])), o;
}

function prefRows(e) {
  const s = S.profile.aim, a = [];
  return a.push([ s && "explore" !== s ? s === e.type : null, te("job" === e.type ? "type_job" : "type_intern") ]), 
  "remote" === e.city && a.push([ !0, te("f_remote") ]), a;
}

const sigRow = ([e, s]) => `<li class="${!0 === e ? "ok" : !1 === e ? "no" : "unk"}">${ic(!0 === e ? "check" : !1 === e ? "x" : "dot")}<span>${s}</span>${null === e ? `<small>${te("el_unknown")}</small>` : ""}</li>`;

function oppDetail(e) {
  const s = opp(e);
  if (!s) return "";
  fit(s);
  const a = haves(s), i = gaps(s), o = S.goal === e, r = S.applied[e], l = o && S.plan ? task(todayDay()) : null, c = eligRows(s), p = prefRows(s), d = c.concat(p).some(e => null === e[0]);
  return `<div class="od-h"><span class="logo">${esc(s.ini)}</span><div style="min-width:0"><h2>${esc(tx(s.title))}</h2><div class="meta">${bdi(s.org)} · ${esc(tx(C[s.city]))} · ${te("job" === s.type ? "type_job" : "type_intern")} · <span class="ex-tag">${te("od_src")}</span></div></div></div>\n    <div class="sig3">\n      <section class="sig"><p class="sig-k">${te("sig_skills")}</p><p class="sig-v"><b class="num">${nfmt(a.length)}/${nfmt(s.req.length)}</b><span>${te("sig_skills_d")}</span></p><p class="sig-s">${coreGaps(s) ? te("fit_core", {
    n: nfmt(coreGaps(s))
  }) : te("fit_core0")}</p></section>\n      <section class="sig"><p class="sig-k">${te("sig_elig")}</p><ul class="sig-l">${c.map(sigRow).join("")}</ul></section>\n      <section class="sig"><p class="sig-k">${te("sig_pref")}</p><ul class="sig-l">${p.map(sigRow).join("")}</ul></section>\n    </div>\n    ${d ? `<p class="od-fill">${ic("info")}<span>${te("el_fill")}</span><button class="linkbtn" data-act="go" data-to="settings">${te("el_fill_btn")}</button></p>` : ""}\n    <details class="how"><summary>${te("fit_how")}</summary><p>${te("fit_how_d")}</p></details>\n    <div><div class="sec-t">${te("od_why")}</div><div class="chips-wrap" style="justify-content:flex-start;margin-bottom:10px">${a.map(e => stateTag(skillState(e), skName(e))).join("") || '<span class="dim">—</span>'}</div><p class="ai-out" id="whyOut">${esc(whyRules(s))}</p>${aiOn() ? `<button class="btn ghost sm" data-act="explain" data-id="${s.id}" style="margin-top:10px">${ic("spark")}${te("od_explain")}</button>` : ""}</div>\n    <div><div class="sec-t">${te("od_need")}</div>${i.length ? i.map(e => `<div class="gap-row"><span style="min-width:0">${stateTag("miss", skName(e))}${s.req.find(s => s[0] === e)[1] ? ` <span class="pill">${te("core")}</span>` : ""}<br><small>${esc(tx(RES[e]))}</small></span><span class="dim num">${te("od_hours", {
    h: nfmt(RES[e].h)
  })}</span></div>`).join("") : `<p class="mute">${te("why_nogap")}</p>`}</div>\n    ${o ? `<div><div class="sec-t">${te("rd_t")}</div>${readyList(s)}</div>` : ""}\n    <div class="od-next"><div class="sec-t">${te("od_next")}</div>\n      ${o ? l ? `<p>${te("od_start", {
    x: l.title
  })}</p><button class="btn" data-act="open-task" data-day="${l.day}">${ic("arrow")}${te("start_now")}</button>` : `<p>${te("hm_done")}</p>` : `<button class="btn" data-act="set-goal" data-id="${s.id}">${ic("target")}${te("od_goal")}</button>`}\n      <div id="switchBox"></div></div>\n    <div><div class="sec-t">${te("od_project")}</div><p class="mute" style="font-size:15px">${esc(tx(s.project))}</p></div>\n    <div class="od-apply">${r ? `<span class="pill teal">${ic("check")}${te("od_tracked")}</span><button class="linkbtn" data-act="untrack" data-id="${s.id}">${te("od_untrack")}</button>` : `<button class="btn ghost" data-act="apply" data-id="${s.id}">${ic("plus")}${te("od_track")}</button>`}<p class="dim od-apply-n">${te("od_track_n")}</p></div>`;
}

function vOpps() {
  const e = liveOpps().filter(e => "all" === ui.ofilter || ("remote" === ui.ofilter ? "remote" === e.city : e.type === ui.ofilter)).map(e => ({
    o: e,
    p: fit(e),
    k: fitRank(e)
  })).sort((e, s) => s.k - e.k);
  return ui.sel && e.find(e => e.o.id === ui.sel) || (ui.sel = S.goal && e.find(e => e.o.id === S.goal) ? S.goal : e[0] && e[0].o.id), 
  `<div class="ph"><div><h1>${te("om_title")}</h1><p>${te("om_sub")}</p>${PUBLIC ? `<p class="ex-note">${smallIc("info")}${te("foot_note_pub")}</p>` : ""}</div>\n    <div style="display:flex;gap:8px;flex-wrap:wrap"><div class="seg" role="group">${[ "all", "job", "intern", "remote" ].map(e => `<button data-act="ofilter" data-f="${e}" aria-pressed="${ui.ofilter === e}">${te("f_" + e)}</button>`).join("")}</div><div class="seg" role="group">${[ "map", "list" ].map(e => `<button data-act="oview" data-v="${e}" aria-pressed="${ui.oview === e}">${te("v_" + e)}</button>`).join("")}</div></div></div>\n  <div class="om"><div class="map-card" id="mapCard">${"map" === ui.oview ? mapSVG(e) : listHTML(e)}</div><section class="panel od" id="od" aria-live="polite">${oppDetail(ui.sel)}</section></div>`;
}

function pathBlocks() {
  const e = [], s = S.plan.tasks;
  for (let a = 0; a < 3; a++) {
    const i = s.slice(7 * a, 7 * a + 7), o = i.find(e => e.skill), r = o && o.skill;
    e.push({
      label: r ? t("strengthen" === o.mode ? "pl_block_s" : "pl_block", {
        skill: skName(r)
      }) : t("pl_week", {
        n: nfmt(a + 1)
      }),
      days: i,
      skill: r
    });
  }
  return e.push({
    label: t("pl_block_proj", {
      org: opp(S.plan.goal).org
    }),
    days: s.slice(21, 30)
  }), e;
}

function vPlan() {
  if (!S.plan) return emptyGoal();
  const e = opp(S.plan.goal), s = (readiness(e), todayDay()), a = doneCount(), i = task(s), o = [ ...new Set(S.plan.tasks.map(e => e.skill).filter(Boolean)) ], r = o.filter(e => [ "proven", "ver" ].includes(skillState(e))).length, l = `<button class="iv-entry" data-act="go" data-to="interview"><span class="iv-ic" aria-hidden="true">${ic("mic")}</span><span class="iv-t"><b>${te("iv_title")}</b><small>${te("iv_sub", {
    role: tx(e.title)
  })}</small></span>${ic("arrow")}</button><div class="plan-h"><div style="min-width:0"><p class="eyebrow">${te("pl_title")}</p><h1 style="font-size:clamp(26px,3.6vw,38px);margin-top:6px">${te("pl_for", {
    role: "§"
  }).replace("§", `<span class="amber">${esc(tx(e.title))}</span>`)}</h1>\n      <p class="plan-badge" style="margin-top:12px;flex-wrap:wrap">${S.plan.ai ? `<span class="pill teal">${ic("spark")}${te("pl_ai")}</span>` : `<span class="pill">${te("pl_base")}</span>`}${aiOn() ? `<button class="btn ghost sm" data-act="regen">${ic("refresh")}${te("pl_regen")}</button>` : ""}</p></div>\n    <div class="plan-stats"><div class="stat"><b class="num"><bdi dir="ltr">${esc(readyLabel(e))}</bdi></b><span>${te("rd_steps")}</span></div><div class="stat"><b class="num">${nfmt(r)}<span class="dim" style="font-size:16px">/${nfmt(o.length)}</span></b><span>${te("pg_path_proven")}</span></div><div class="stat"><b class="num">${nfmt(a)}<span class="dim" style="font-size:16px">/30</span></b><span>${te("ch_plan")}</span></div></div></div>`, c = s <= 30 ? `<section class="today-card"><div style="min-width:0"><div class="d">${ic(KIND_IC[i.kind])}<span class="num">${te("day_n", {
    n: nfmt(s)
  })} · ${te("min_n", {
    n: nfmt(i.min)
  })}</span> · ${te("k_" + i.kind)}</div><h2>${esc(i.title)}</h2><p>${esc(i.why)}</p></div><button class="btn lg" data-act="open-task" data-day="${s}">${te("pl_open")} ${ic("arrow")}</button></section>` : `<section class="today-card"><div style="min-width:0"><div class="d">${ic("trophy")}${te("pl_all")}</div><h2>${te("cel_t")}</h2></div><button class="btn amber lg" data-act="celebrate">${ic("download")}${te("cert_dl")}</button></section>`, p = pathBlocks(), d = p.map(e => `<div class="wk ${e.skill && [ "proven", "ver" ].includes(skillState(e.skill)) ? "won" : ""}"><div class="lab">${esc(e.label)}<small class="num">${nfmt(e.days.filter(e => S.plan.done[e.day]).length)}/${nfmt(e.days.length)}${e.skill && [ "proven", "ver" ].includes(skillState(e.skill)) ? " · " + te("st_proof") : ""}</small></div><div class="wk-dots">${e.days.map(e => {
    const a = e.day, i = !!S.plan.done[a];
    return `<button class="day ${i ? "done" : ""} ${a === s ? "today" : ""} ${30 === a ? "goal" : ""} ${"prove" === e.kind ? "prove" : ""}" data-act="open-task" data-day="${a}" data-d="${a}" aria-label="${te("day_n", {
      n: a
    })} · ${te("k_" + e.kind)}: ${esc(e.title)}">${i ? ic("check") : 30 === a ? ic("trophy") : "prove" === e.kind ? ic("file") : `<span class="num">${nfmt(a)}</span>`}</button>`;
  }).join("")}</div></div>`).join(""), u = p.find(e => e.days.some(e => e.day === Math.min(30, s))) || p[0];
  return l + c + `<section class="panel"><div class="weeks">${d}</div><p class="dim legend-line">${smallIc("file")} ${te("k_prove")} · ${te("tk_why_proof")}</p></section>\n    <section><h3 class="sub-h">${esc(u.label)}</h3><div class="tasks">${u.days.map(e => `<button class="trow ${S.plan.done[e.day] ? "done" : ""}" data-act="open-task" data-day="${e.day}"><span class="dn num">${S.plan.done[e.day] ? ic("check") : nfmt(e.day)}</span><span style="min-width:0"><b>${esc(e.title)}</b><small>${te("k_" + e.kind)} · ${te("min_n", {
    n: nfmt(e.min)
  })}${"prove" === e.kind || "portfolio" === e.kind ? " · " + te("tk_proof") : ""}</small></span>${e.day > s ? ic("lock") : ic("arrow")}</button>`).join("")}</div></section>\n`;
}

function emptyGoal() {
  return `<section class="panel" style="display:grid;gap:16px;justify-items:start"><div style="width:72px;height:72px;position:relative">${mascot("curious")}</div><h2 style="font-size:22px">${te("pl_nogoal")}</h2><button class="btn amber" data-act="go" data-to="opps">${ic("map")}${te("hm_pick")}</button></section>`;
}

function bars(e) {
  return `<div class="bars">${[ [ "clarity", "sc_c" ], [ "evidence", "sc_e" ], [ "relevance", "sc_r" ] ].map(([s, a]) => `<div class="bar"><span>${te(a)}</span><b class="num">${nfmt(e[s])}</b><span class="tr"><i data-w="${e[s]}"></i></span></div>`).join("")}</div>`;
}

const fbScore = e => Math.round((e.clarity + e.evidence + e.relevance) / 3);

function vInterview() {
  if (!S.goal) return emptyGoal();
  const e = opp(S.goal), s = S.iv && S.iv.goal === e.id ? S.iv : null, a = S.ivBest[e.id], i = `<div class="ph"><div><h1>${te("iv_title")}</h1><p>${te("iv_sub", {
    role: tx(e.title)
  })}</p></div><button class="btn ghost sm" data-act="toggle-voice" aria-pressed="${S.prefs.voice}">${ic(S.prefs.voice ? "vol" : "mute")}${te("iv_read")}</button></div>`, o = `<section class="panel"><h3 style="font-size:16px;margin-bottom:12px">${te("iv_star")}</h3><div class="star">${[ "s", "t", "a", "r" ].map((e, s) => `<div><b>${"en" === L() || "fr" === L() ? e.toUpperCase() : nfmt(s + 1)}</b>${te("st_" + e)}<br><span class="dim">${te("st_" + e + "d")}</span></div>`).join("")}</div></section>`;
  if (!s) return i + `<div class="iv"><section class="panel" style="display:grid;gap:18px">\n      <div style="display:flex;gap:16px;align-items:center"><div style="width:64px;height:64px;position:relative;flex:none">${mascot("neutral")}</div><div><p class="eyebrow">${te("iv_tip_t")}</p>${a ? `<p class="mute" style="margin-top:4px">${te("iv_best", {
    s: nfmt(a)
  })}</p>` : ""}</div></div>\n      <ul class="tips">${[ "iv_tip1", "iv_tip2", "iv_tip3" ].map(e => `<li>${ic("check")}<span>${te(e)}</span></li>`).join("")}</ul>\n      <div><button class="btn lg" data-act="iv-start">${ic("mic")}${te("iv_start")}</button></div>\n      <div class="iv-prev"><p class="eyebrow">${te("iv_prev")}</p><ol>${ivQuestions(e).map((e, s) => `<li><span class="num">${nfmt(s + 1)}</span><span>${esc(e)}</span></li>`).join("")}</ol></div></section><div class="side">${o}</div></div>`;
  const qOf = a => !s.ai && null != a.qi && ivQuestions(e)[a.qi] || a.q, fbOf = (a, i) => a.fb && a.fb.rules && a.a ? Object.assign({}, a.fb, rulesFeedback(a.a, e, a.qi ?? i, s.items.slice(0, i).map(e => e.a)), {
    rules: !0
  }) : a.fb, r = s.items.map((e, a) => {
    const i = Object.assign({}, e, {
      q: qOf(e),
      fb: fbOf(e, a)
    });
    return `\n    <div class="iv-q"><div style="width:38px;height:38px;position:relative">${mascot(i.fb ? "happy" : "neutral")}</div><div style="min-width:0"><p class="dim" style="font-size:12px;margin-bottom:4px">${te("iv_q_n", {
      i: nfmt(a + 1),
      n: nfmt(s.single ? 1 : 5)
    })}</p><div class="bub" dir="auto" ${a !== s.items.length - 1 || i.a ? "" : 'id="lastQ"'}>${esc(i.q)}</div></div></div>\n    ${i.a ? `<div class="iv-a" dir="auto">${esc(i.a)}</div>` : ""}\n    ${i.fb ? `<div class="fb">${bars(i.fb)}<div class="fb-l"><strong>${te("fb_good")}</strong>${esc(i.fb.good)}</div><div class="fb-l"><strong>${te("fb_improve")}</strong>${esc(i.fb.improve)}</div>${i.fb.better ? `<details class="better"><summary>${te("fb_better")}</summary><p>${esc(i.fb.better)}</p></details>` : ""}</div>` : ""}\n    ${i.a && !i.fb ? `<div class="fb" aria-live="polite"><p class="mute">${te("iv_thinking")}</p><span class="skel l" style="width:80%"></span><span class="skel l" style="width:60%"></span></div>` : ""}`;
  }).join(""), l = s.items[s.items.length - 1];
  let c = "";
  s.done ? c = ivReport(Object.assign({}, s, {
    items: s.items.map((e, s) => Object.assign({}, e, {
      q: qOf(e),
      fb: fbOf(e, s)
    }))
  }), e) : l.a || (c = `<div class="iv-compose"><label class="sr" for="ivA">${te("iv_ph")}</label><textarea id="ivA" class="inp" rows="4" placeholder="${te("iv_ph")}"></textarea><div class="row"><span class="dim" style="font-size:13px">${te(aiOn() ? "iv_by_ai" : "iv_by_rules")}</span><span class="row-r">${SR ? `<button class="btn ghost mic" data-act="iv-mic" aria-pressed="false">${ic("mic")}<span>${te("iv_mic")}</span></button>` : ""}<button class="btn" data-act="iv-send">${ic("send")}${te("iv_send")}</button></span></div></div>`);
  const p = s.items.filter(e => e.fb).length;
  return i + `<div class="iv"><section class="panel iv-chat" id="ivChat">${r}${c}</section><aside class="side">\n    <section class="panel" style="display:grid;gap:10px"><p class="eyebrow num">${te("iv_q_n", {
    i: nfmt(Math.min(5, p + (s.done ? 0 : 1))),
    n: nfmt(5)
  })}</p><div class="th-bar" style="display:flex">${[ 0, 1, 2, 3, 4 ].map(e => `<i class="${e < p ? "done" : e === p ? "cur" : ""}"></i>`).join("")}</div>${a ? `<p class="mute" style="font-size:14px">${te("iv_best", {
    s: nfmt(a)
  })}</p>` : ""}</section>${o}</aside></div>`;
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;

function ivReport(e, s) {
  const a = e.items.filter(e => e.fb), i = a.length, avg = e => Math.round(a.reduce((s, a) => s + a.fb[e], 0) / Math.max(1, i)), o = Math.round(a.reduce((e, s) => e + fbScore(s.fb), 0) / Math.max(1, i)), uniq = e => {
    const s = new Set, i = [];
    return a.forEach((a, o) => {
      const r = a.fb[e];
      r && !s.has(r) && (s.add(r), i.push([ o, r ]));
    }), i.slice(0, 3);
  }, r = a.map((e, s) => [ s, fbScore(e.fb) ]).sort((e, s) => e[1] - s[1]).slice(0, 2), li = ([e, s]) => `<li><span class="iv-qn num">${te("iv_rep_q", {
    n: nfmt(e + 1)
  })}</span><span>${esc(s)}</span></li>`;
  return `<section class="iv-rep" aria-labelledby="ivRepT"><header class="iv-rep-h"><div><p class="eyebrow">${te("iv_done_t")}</p><h2 id="ivRepT">${te("iv_rep_t")}</h2><p class="mute">${te("iv_rep_sub", {
    n: nfmt(i),
    mode: t(e.ai ? "iv_mode_ai" : "iv_mode_rules")
  })} · ${esc(tx(s.title))}</p></div><div class="iv-rep-score">${ring(o, 104, 9)}<span class="dim">${te("iv_score")}</span></div></header>\n    ${bars({
    clarity: avg("clarity"),
    evidence: avg("evidence"),
    relevance: avg("relevance")
  })}\n    <div class="iv-rep-cols"><div><h3>${ic("check")}${te("iv_rep_str")}</h3><ul>${uniq("good").map(li).join("")}</ul></div><div><h3>${ic("target")}${te("iv_rep_imp")}</h3><ul>${uniq("improve").map(li).join("")}</ul></div></div>\n    <div class="iv-rep-again"><h3>${te("iv_rep_again")}</h3>${r.map(([e, s]) => `<p><span class="iv-qn num">${te("iv_rep_q", {
    n: nfmt(e + 1)
  })} · ${nfmt(s)}</span>${esc(a[e].q)}</p>`).join("")}</div>\n    <label class="sw-l iv-rep-pass"><input type="checkbox" class="sw" data-act="iv-pass" ${!0 === S.share.iv ? "checked" : ""}><span>${te("iv_rep_pass")}</span></label>\n    <div class="iv-rep-acts no-print"><button class="btn" data-act="iv-retry" data-i="${r[0] ? r[0][0] : 0}">${ic("refresh")}${te("iv_rep_retry")}</button><button class="btn ghost" data-act="iv-start">${te("iv_again")}</button><button class="btn ghost" data-act="print">${ic("download")}${te("iv_rep_print")}</button><button class="linkbtn" data-act="go" data-to="plan">${te("iv_back_plan")}</button></div></section>`;
}

function chartSVG() {
  const e = S.log.filter(e => !S.goal || e.g === S.goal).slice(-24), s = S.goal && opp(S.goal);
  !s || e.length && e[e.length - 1].r === readiness(s) || e.push({
    t: Date.now(),
    r: readiness(s),
    g: S.goal
  });
  const a = e.length < 2 ? [ {
    r: 0
  } ].concat(e.length ? e : [ {
    r: 0
  } ]) : e, i = 44, o = 178, x = e => i + (1 === a.length ? 0 : 576 * e / (a.length - 1)), y = e => 200 - e / 100 * o, r = a.map((e, s) => `${s ? "L" : "M"}${x(s).toFixed(1)} ${y(e.r).toFixed(1)}`).join(""), l = r + `L${x(a.length - 1).toFixed(1)} 200L44 200Z`;
  let c = 0;
  for (let e = 1; e < a.length; e++) c += Math.hypot(x(e) - x(e - 1), y(a[e].r) - y(a[e - 1].r));
  const p = a[a.length - 1];
  return `<svg class="chart" viewBox="0 0 640 230" role="img" aria-label="${te("pg_ready")}: ${s ? esc(readyLabel(s)) : pc(p.r)}" style="direction:ltr"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F3D36" stop-opacity=".12"/><stop offset="1" stop-color="#0F3D36" stop-opacity="0"/></linearGradient></defs>\n    <g class="grid">${[ 0, 50, 100 ].map(e => `<line x1="44" x2="620" y1="${y(e)}" y2="${y(e)}"/><text x="36" y="${y(e) + 5}" text-anchor="end">${s ? nfmt(Math.round(e / 100 * readyItems(s).length)) : e + "%"}</text>`).join("")}</g>\n    <path class="area" d="${l}"/><path class="ln" d="${r}" style="--len:${Math.ceil(c) + 2}"/><circle class="end" cx="${x(a.length - 1)}" cy="${y(p.r)}" r="6"/><text class="end-l" x="${Math.min(616, x(a.length - 1))}" y="${Math.max(14, y(p.r) - 14)}" text-anchor="end">${s ? esc(readyLabel(s)) : pc(p.r)}</text>${a[0].t ? `<text class="ax" x="44" y="226">${esc(dateFmt(a[0].t))}</text>` : ""}<text class="ax" x="620" y="226" text-anchor="end">${te("today")}</text></svg>`;
}

function evLabel(e) {
  switch (e.type) {
   case "story":
    return [ ic("chat"), t("ev_story") ];

   case "skills":
    return [ ic("check"), t("ev_skills", {
      n: nfmt(e.n)
    }) ];

   case "goal":
    return [ ic("target"), t("ev_goal", {
      x: tx(opp(e.id).title)
    }) ];

   case "proven":
    return [ ic("file"), t("ev_proven", {
      x: skName(e.id)
    }) ];

   case "iv":
    return [ ic("mic"), t("ev_iv", {
      s: nfmt(e.s)
    }) ];

   case "ver":
    return [ ic("shield"), t("ev_ver") ];

   case "apply":
    return [ ic("send"), t("ev_apply", {
      x: tx(opp(e.id).title)
    }) ];

   case "pub_on":
   case "pub_off":
   case "uni_on":
   case "uni_off":
    return [ ic(e.type.endsWith("on") ? "link" : "lock"), t("ev_" + e.type) ];

   case "vermore":
    return [ ic("chat"), t("nt_more") ];

   case "portfolio":
    return [ ic("trophy"), t("ev_portfolio") ];
  }
  return [ ic("check"), T["ev_" + e.type] ? t("ev_" + e.type) : t("ev_done") ];
}

function vProgress() {
  const e = S.goal && opp(S.goal), s = Object.keys(S.applied), a = ((S.log.find(e => e.g === S.goal) || {
    r: 0
  }).r, e && readiness(e), confirmed().filter(e => [ "proven", "ver" ].includes(skillState(e))).length), i = [ [ e ? `${nfmt(haves(e).length)}/${nfmt(e.req.length)}` : "—", "pg_req" ], [ nfmt(a), "pg_proven" ], [ nfmt(proofCount()), "pg_proofs" ], [ e ? readyLabel(e) : "—", "rd_steps" ] ], o = S.events.slice().reverse();
  return `<div class="ph"><div><h1>${te("pg_title")}</h1>${e ? `<p>${te("pl_for", {
    role: tx(e.title)
  })}</p>` : ""}</div></div>\n  <div class="kpis">${i.map(([e, s]) => `<div class="kpi"><b class="num"><bdi dir="ltr">${e}</bdi></b><span>${te(s)}</span></div>`).join("")}</div>\n  <section class="panel"><div class="week-head" style="margin-bottom:12px"><h3>${te("pg_ready")}</h3></div>${chartSVG()}${e ? `<div class="pg-rl">${readyList(e)}</div>` : ""}<details class="how"><summary>${te("fit_how")}</summary><p>${te("ready_how")}</p></details></section>\n  <div class="two"><section class="panel"><h3 style="margin-bottom:12px">${te("pg_mile")}</h3>${o.length ? `<ol class="tl">${o.map(e => {
    const [s, a] = evLabel(e);
    return `<li>${s}<span>${esc(a)}</span><small class="dim">${esc(dateFmt(e.t))}</small></li>`;
  }).join("")}</ol>` : `<p class="mute">${te("pg_mile0")}</p>`}</section>\n  <section class="panel"><h3 style="margin-bottom:12px">${te("pg_apps")}</h3>${s.length ? s.map(e => {
    const s = opp(e);
    return `<div class="gap-row"><span><b>${esc(tx(s.title))}</b><br><small>${bdi(s.org)} · ${esc(dateFmt(S.applied[e]))}</small></span><span class="pill">${te("pg_sent")}</span></div>`;
  }).join("") : `<p class="mute">${te("pg_none_apps")}</p>`}</section></div>`;
}

const VIEWS = {
  home: vHome,
  passport: vPassport,
  opps: vOpps,
  plan: vPlan,
  interview: vInterview,
  programs: vPrograms,
  progress: vProgress,
  settings: vSettings,
  notifications: vNotifications,
  help: vHelp,
  me: vMe
};

function view() {
  return "uni" === S.role ? S.auth.uni ? uniShell((UVIEWS[ui.uview] || UVIEWS.ov)()) : consoleSignin("uni") : "ops" === S.role ? S.auth.ops ? opsShell((OVIEWS[ui.ops] || OVIEWS.ov)()) : consoleSignin("ops") : ui.pubForce || "landing" === S.stage ? vPublic() : "compose" === S.stage ? vCompose() : "discover" === S.stage && ui.disc ? vDiscover() : "discover" === S.stage ? vCompose() : "setup" === S.stage ? vSetup() : "app" === S.stage ? shell((VIEWS[S.screen] || vHome)()) : vPublic();
}

function pageTitle() {
  const e = curPortal();
  return "uni" === e ? S.auth.uni ? t(UNAV.find(e => e[0] === ui.uview)[2]) + " · " + t("u_console") : t("usi_t") : "ops" === e ? S.auth.ops ? t(ONAV.find(e => e[0] === ui.ops)[2]) + " · " + t("pt_ops") : t("osi_t") : "site" === e ? {
    home: t("h4_h1"),
    vision: t("pub_vision"),
    access: t("im_cta1"),
    how: t("pub_how"),
    institutions: t("pub_inst"),
    trust: t("pub_trust"),
    example: t("pub_example"),
    employers: t("pub_emp"),
    partners: t("pub_partners"),
    changelog: t("pub_changes"),
    brand: t("pub_brand"),
    signin: t("pub_signin"),
    p: t("pp_title"),
    404: t("nf_t")
  }[ui.pub] || "" : "compose" === S.stage ? t("cm_t") : "discover" === S.stage || "setup" === S.stage ? t("pt_student") : t({
    home: "nav_home",
    passport: "nav_pass",
    opps: "nav_opps",
    plan: "nav_plan",
    interview: "nav_iv",
    progress: "nav_prog",
    settings: "nav_set",
    notifications: "nt_title",
    help: "help_t",
    programs: "prg_title",
    me: "pt_student"
  }[S.screen] || "nav_home");
}

function applyLang() {
  const e = L();
  document.documentElement.lang = langTag(e), document.documentElement.dir = isAR() ? "rtl" : "ltr";
  const s = pageTitle(), a = "student" === curPortal() && "app" === S.stage && "function" == typeof unread ? unread() : 0;
  setFavicon(a), document.title = (a ? `(${a}) ` : "") + (s ? s.replace(/\.$/, "") + " · " : "") + "SKILMA";
}

function render(e) {
  const run = () => {
    closePop(), TOUR.k && tourEnd(), applyLang();
    const e = curPortal();
    if (document.body.dataset.portal = e, document.body.dataset.stage = S.stage, $("#app").innerHTML = portalBar() + view(), 
    mount(), syncHash(), ui.booted && !ui.noFocus) {
      const e = $("#app main h1, #app .csi h1, #app .stage h1");
      e && !document.activeElement.matches("textarea,input") && (e.setAttribute("tabindex", "-1"), 
      e.focus({
        preventScroll: !0
      }));
    }
    ui.noFocus = !1;
  };
  if (e && document.startViewTransition && !RM()) try {
    return document.startViewTransition(run).updateCallbackDone.catch(() => {});
  } catch (e) {}
  return run(), Promise.resolve();
}

function renderMain() {
  const e = $("#mainIn");
  e ? (e.classList.remove("enter"), e.innerHTML = "uni" === S.role ? (UVIEWS[ui.uview] || UVIEWS.ov)() : "ops" === S.role ? (OVIEWS[ui.ops] || OVIEWS.ov)() : (VIEWS[S.screen] || vHome)(), 
  mountMain(), syncHash()) : render();
}

function go(e) {
  S.role = "student", ui.pubForce = !1, hasPassport() && (S.stage = "app"), "passport" === e && "passport" !== S.screen && (ui.ppTab = "skills"), 
  S.screen = e, save(), render(!0), window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}

function setBars(e = document) {
  requestAnimationFrame(() => requestAnimationFrame(() => $$("[data-w]", e).forEach(e => e.style.width = Math.max(2, +e.dataset.w) + "%")));
}

function fixHeadings(e = document) {
  $$(".tbl-wrap").forEach(e => {
    e.scrollWidth > e.clientWidth + 1 && !e.hasAttribute("tabindex") && (e.tabIndex = 0, 
    e.setAttribute("role", "region"), e.setAttribute("aria-label", (($("caption,th", e) || {}).textContent || document.title).trim().slice(0, 60)));
  });
  let s = 0;
  $$("h1,h2,h3,h4", e).forEach(e => {
    if (e.closest("[hidden],.modal-hidden")) return;
    e.removeAttribute("aria-level");
    const a = +e.tagName[1];
    s && a > s + 1 ? (e.setAttribute("aria-level", s + 1), s += 1) : s = a;
  });
}

function mount() {
  if (fixHeadings(), drawRings(), runCounts(), setBars(), "student" === S.role) {
    if (ui.pubForce || "landing" === S.stage) return pubMount(), $("#film") ? filmMount() : FILM.tok++, 
    void ($("#lv") ? liveMount() : LIVE.tok++);
    if (LIVE.tok++, FILM.tok++, ("compose" === S.stage || "discover" === S.stage && !ui.disc) && composeMount(), 
    "discover" === S.stage && ui.disc) {
      const e = ui.disc;
      if ("reveal" === e.phase) {
        voice(skName(e.items[e.i].id));
        const s = $("#thYes");
        s && s.focus({
          preventScroll: !0
        });
      }
      if ("done" === e.phase) {
        e.items.filter(e => "yes" === e.res).length && SND.play("win");
      }
    }
    if ("setup" === S.stage && "name" === ui.setupStep) {
      const e = $("#nm");
      e && e.focus({
        preventScroll: !0
      });
    }
    "app" === S.stage && mountMain();
  } else ("uni" === S.role && S.auth.uni || "ops" === S.role && S.auth.ops) && mountMain();
}

function mountMain() {
  const e = $("#mainIn") || document;
  if (fixHeadings(), drawRings(e), runCounts(e), setBars(e), "uni" === S.role || "ops" === S.role) return consoleMount(e), 
  void maybeTour();
  if ("passport" === S.screen && bindCard(), maybeTour(), "interview" === S.screen) {
    const e = $("#lastQ"), s = S.iv;
    e && s && ui.ivTyped !== s.items.length && (ui.ivTyped = s.items.length, typeInto(e, s.items[s.items.length - 1].q, 16), 
    voice(s.items[s.items.length - 1].q));
  }
  if ("home" === S.screen && S.notices.length) {
    const e = S.notices.splice(0);
    save(), setTimeout(() => {
      e.includes("verified") && (toast(t("verified_note"), "shield"), say(t("verified_note"), "celebrate"), 
      SND.play("win"));
    }, 500);
  }
  if ("settings" === S.screen) {
    const e = $("#setName");
    e && e.addEventListener("change", () => {
      S.profile.name = e.value.trim().slice(0, 40), save(), toast(t("saved"));
    });
  }
}

function bindCard() {
  const e = $("#idcard");
  if (!e) return;
  let s = 0, a = !1, i = 0, o = 1;
  const r = isAR() ? -1 : 1;
  e.addEventListener("pointerdown", r => {
    a = !0, i = 0, s = r.clientX, o = e.offsetWidth;
    try {
      e.setPointerCapture(r.pointerId);
    } catch (e) {}
    e.classList.add("drag");
  }), e.addEventListener("pointermove", l => {
    if (!a) return;
    i = l.clientX - s;
    const c = ui.flip ? 180 : 0;
    e.style.transform = `rotateY(${c + r * i / o * 180}deg)`;
  });
  e.addEventListener("pointerup", () => {
    a && (a = !1, e.classList.remove("drag"), e.style.transform = "", (Math.abs(i) > .25 * o || Math.abs(i) < 4) && ACT["flip-card"]());
  }), e.addEventListener("pointercancel", () => {
    a = !1, e.classList.remove("drag"), e.style.transform = "";
  });
}

const PUB_PAGES = PUBLIC ? [ "how", "access", "institutions", "trust", "example", "signin", "changelog", "p", "404" ] : [ "how", "vision", "access", "institutions", "trust", "example", "signin", "employers", "partners", "changelog", "brand", "p", "404" ], SCR2HASH = {
  opps: "opportunities",
  plan: "path"
}, HASH2SCR = {
  opportunities: "opps",
  path: "plan"
}, STUDENT_SCREENS = [ "home", "passport", "opps", "plan", "interview", "programs", "progress", "settings", "notifications", "help", "me" ], USLUG = {
  ov: "overview",
  stu: "students",
  sk: "skills",
  op: "opportunities",
  ver: "verify",
  ins: "insights",
  rep: "reports",
  set: "settings"
}, OSLUG = {
  ov: "overview",
  inst: "institutions",
  impact: "impact",
  users: "users",
  skills: "skills",
  opps: "opportunities",
  quality: "quality",
  audit: "audit",
  set: "settings"
}, UID = Object.fromEntries(Object.entries(USLUG).map(([e, s]) => [ s, e ])), OID = Object.fromEntries(Object.entries(OSLUG).map(([e, s]) => [ s, e ]));

function curPortal() {
  return "uni" === S.role ? "uni" : "ops" === S.role ? "ops" : ui.pubForce || "landing" === S.stage ? "site" : "student";
}

function curHash() {
  if ("uni" === S.role) return "#/uni/" + (S.auth.uni ? USLUG[ui.uview] || "overview" : "signin");
  if ("ops" === S.role) return "#/ops/" + (S.auth.ops ? (OSLUG[ui.ops] || "overview") + ("inst" === ui.ops && ui.instSel ? "/" + ui.instSel : "") : "signin");
  if (ui.pubForce || "landing" === S.stage) return "#/" + ("home" !== ui.pub && ui.pub ? "p" === ui.pub ? "p/" + (ui.pubParam || passNo()) : ui.pub : "");
  if ("compose" === S.stage) return ui.cmRet ? "#/experience/new" : "#/start";
  if ("discover" === S.stage) return "#/discover";
  if ("setup" === S.stage) return "#/setup";
  return "#/" + (SCR2HASH[S.screen] || S.screen) + ("passport" === S.screen && ui.ppTab && "skills" !== ui.ppTab ? "/" + ui.ppTab : "");
}

function applyHash(e) {
  const [s, a, i] = String(e || "").replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (ui.menu = !1, ui.drawer = null, "uni" === s) return S.role = "uni", void (a && UID[a] && (ui.uview = UID[a]));
  if (PUBLIC && "ops" === s) return S.role = "student", ui.pubForce = !0, void (ui.pub = "404");
  if ("ops" === s) return S.role = "ops", void (a && OID[a] && (ui.ops = OID[a], ui.instSel = "institutions" === a && i || null));
  if (S.role = "student", !s) return ui.pubForce = !0, void (ui.pub = "home");
  if (PUB_PAGES.includes(s) && "p" !== s && "404" !== s) return ui.pubForce = !0, 
  void (ui.pub = s);
  if ("p" === s) return ui.pubForce = !0, ui.pub = "p", void (ui.pubParam = a || "");
  if ("start" === s || "experience" === s && "new" === a) return ui.pubForce = !1, 
  ui.cmRet = hasPassport(), void (S.stage = "compose");
  if ("discover" === s) return ui.pubForce = !1, void (S.stage = ui.disc ? "discover" : "compose");
  if ("setup" === s) return ui.pubForce = !1, S.stage = confirmed().length ? "setup" : "compose", 
  void (S.profile.name && (ui.setupStep = "goal"));
  const o = HASH2SCR[s] || s;
  if (STUDENT_SCREENS.includes(o)) return hasPassport() ? (ui.pubForce = !1, S.stage = "app", 
  S.screen = o, void ("passport" === o && (ui.ppTab = [ "experiences", "share" ].includes(a) ? a : "skills"))) : (ui.pubForce = !(confirmed().length && !S.profile.name), 
  void (ui.pubForce ? ui.pub = "signin" : S.stage = "setup"));
  ui.pubForce = !0, ui.pub = "404";
}

function syncHash() {
  const e = curHash();
  if (location.hash !== e && (location.hash || "#/" !== e)) try {
    ui.fromPop || !ui.booted ? history.replaceState(null, "", e) : history.pushState(null, "", e);
  } catch (e) {}
}

addEventListener("popstate", () => {
  ui.fromPop = !0, closeModal(), closePop(), applyHash(location.hash), save(), render(!0).then(() => {
    ui.fromPop = !1;
  }), window.scrollTo(0, 0);
});

const PORTALS = [ [ "site", "globe", "pt_site" ], [ "student", "pass", "pt_student" ], [ "uni", "uni", "pt_uni" ], [ "ops", "activity", "pt_ops" ] ].filter(e => !PUBLIC || "ops" !== e[0]);

function portalBar() {
  if (PUBLIC) {
    return `<button class="skip" data-act="skip">${te("skip")}</button>`;
  return;
  }
  const e = curPortal(), s = PORTALS.find(s => s[0] === e);
  return `<button class="skip" data-act="skip">${te("skip")}</button><div class="demo-strip ${e}" role="region" aria-label="${te("pt_label")}"><div class="ds-in">\n    <span class="ds-tag"><span class="pdot"></span>${te("pt_demo2")}</span>\n    <span class="ds-now">${te("pt_now")} <b>${ic(s[1])}${te(s[2])}</b></span>\n    <button class="ds-btn" data-act="portal-panel" data-pop aria-haspopup="menu" aria-expanded="false">${ic("grid")}<span>${te("pt_switch")}</span></button>\n    ${"student" === e && "app" === S.stage && S.plan && todayDay() < 29 ? `<button class="ds-btn" data-act="demo-jump">${ic("bolt")}<span>${te("demo_jump")}</span></button>` : ""}\n    <button class="ds-k" data-act="palette" aria-label="${te("pal_open")}">${ic("search")}<kbd>${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} K</kbd></button>\n  </div></div>`;
}

function portalPanel(e) {
  const s = curPortal();
  openPop(e, `<div class="pp-panel"><p class="pp-t">${te("pt_panel_t")}</p>${PORTALS.map(([e, a, i]) => `<button role="menuitem" class="pp-i ${s === e ? "cur" : ""}" data-act="portal" data-p="${e}"><span class="pp-ic">${ic(a)}</span><span class="pp-tx"><b>${te(i)}</b><small>${te(i + "_d")}</small></span>${s === e ? `<span class="pill teal">${te("pt_here")}</span>` : ic("arrow")}</button>`).join("")}</div>`);
  const a = $("#pop");
  a && a.classList.add("wide");
}

function goPortal(e) {
  if (PUBLIC) {
    "ops" !== e && (closeModal(), closePop(), ui.menu = !1, "site" === e ? (S.role = "student", 
    ui.pubForce = !0, ui.pub = "home") : "student" === e ? (S.role = "student", hasPassport() ? (ui.pubForce = !1, 
    [ "app", "setup", "compose", "discover" ].includes(S.stage) && ("discover" !== S.stage || ui.disc) || (S.stage = "app")) : "setup" === S.stage || "discover" === S.stage && ui.disc || "compose" === S.stage ? ui.pubForce = !1 : (ui.pubForce = !0, 
    ui.pub = "signin")) : (S.role = e, "uni" !== e || S.auth.uni || (S.auth.uni = !0, 
    ui.uview = "ov", uniLog(t("audit_signin"))), "uni" !== e || UVIEWS_OK(ui.uview) || (ui.uview = "ov"), 
    "ops" !== e || OSLUG[ui.ops] || (ui.ops = "ov")), save(), render(!0), window.scrollTo({
      top: 0,
      behavior: "instant"
    }));
  return;
  }
  closeModal(), closePop(), ui.menu = !1, "site" === e ? (S.role = "student", ui.pubForce = !0, 
  ui.pub = "home") : "student" === e ? (S.role = "student", hasPassport() ? (ui.pubForce = !1, 
  [ "app", "setup", "compose", "discover" ].includes(S.stage) && ("discover" !== S.stage || ui.disc) || (S.stage = "app")) : "setup" === S.stage || "discover" === S.stage && ui.disc || "compose" === S.stage ? ui.pubForce = !1 : (ui.pubForce = !0, 
  ui.pub = "signin")) : (S.role = e, "uni" !== e || UVIEWS_OK(ui.uview) || (ui.uview = "ov"), 
  "ops" !== e || OSLUG[ui.ops] || (ui.ops = "ov")), save(), render(!0), window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}

const UVIEWS_OK = e => !!USLUG[e];

function maintBanner() {
  return S.ops.maint ? `<div class="maint" role="status">${ic("info")}<span>${te("maint_msg")}</span></div>` : "";
}

function closePop(e) {
  const s = $("#pop"), a = s && s.contains(document.activeElement);
  s && s.remove();
  const i = $("[aria-expanded=true][data-pop]");
  i && (i.setAttribute("aria-expanded", "false"), (e || a) && i.focus({
    preventScroll: !0
  }));
}

function openPop(e, s) {
  closePop();
  const a = e.getBoundingClientRect(), i = document.createElement("div");
  i.id = "pop", i.className = "mpop", i.setAttribute("role", "menu"), i.innerHTML = s, 
  document.body.appendChild(i);
  const o = i.offsetWidth;
  let r = "rtl" === document.documentElement.dir ? a.left : a.right - o;
  r = Math.max(8, Math.min(innerWidth - o - 8, r));
  let l = a.bottom + 8;
  l + i.offsetHeight > innerHeight - 8 && (l = Math.max(8, a.top - i.offsetHeight - 8)), 
  i.style.left = r + "px", i.style.top = l + "px", e.setAttribute("aria-expanded", "true"), 
  i.style.transformOrigin = `${Math.round(Math.min(o, Math.max(0, a.left + a.width / 2 - r)))}px ${l > a.top ? "0" : "100%"}`;
  const c = $("button, a", i);
  c && c.focus({
    preventScroll: !0
  });
}

function popItems(e, s) {
  return `${e ? `<div class="pop-h">${e}</div>` : ""}${s.map(e => "-" === e ? '<div class="pop-sep"></div>' : `<button role="menuitem" class="pop-i ${e.danger ? "danger" : ""}" ${e.attrs}>${ic(e.icon)}<span>${esc(e.label)}</span></button>`).join("")}`;
}

document.addEventListener("pointerdown", e => {
  const s = $("#pop");
  !s || s.contains(e.target) || e.target.closest("[data-pop]") || closePop();
}, !0);

const avatar = (e, s = "") => `<span class="av-c ${s}">${esc(String(e || "?").trim().slice(0, 2).toUpperCase())}</span>`, initials = e => {
  let s = String(e || "?").trim().split(/\s+/);
  if ("zgh" === L()) {
    const e = s.filter(e => /[\u2D30-\u2D7F]/.test(e));
    e.length && (s = e);
  }
  return s.map(e => [ ...e ][0]).slice(0, 2).join("");
};

function palItems() {
  const e = curPortal(), s = [], add = (e, a, i, o, r = "") => s.push({
    group: e,
    icon: a,
    label: i,
    attrs: o,
    hint: r
  }), go = e => `data-act="pal-go" data-h="${e}"`;
  return "site" === e && ([ [ "", "home", "pub_home" ], [ "how", "plan", "pub_how" ], [ "vision", "target", "pub_vision" ], [ "access", "star", "im_cta1" ], [ "institutions", "uni", "pub_inst" ], [ "trust", "lock", "pub_trust" ], [ "example", "pass", "pub_example" ], [ "employers", "brief", "pub_emp" ], [ "partners", "book", "pub_partners" ], [ "changelog", "list", "pub_changes" ], [ "signin", "user", "pub_signin" ] ].filter(([e]) => !e || PUB_PAGES.includes(e)).forEach(([e, s, a]) => add(t("pal_pages"), s, t(a), go("#/" + e))), 
  add(t("pal_actions"), "spark", t("pub_start"), go("#/start"))), "student" === e && ([ [ "home", "home", "nav_home" ], [ "passport", "pass", "nav_pass" ], [ "passport/experiences", "chat", "pp_tab_exp" ], [ "passport/share", "share", "pp_tab_share" ], [ "opportunities", "map", "nav_opps" ], [ "path", "plan", "nav_plan" ], [ "interview", "mic", "nav_iv" ], [ "progress", "chart", "nav_prog" ], [ "notifications", "bell", "nt_title" ], [ "settings", "gear", "nav_set" ], [ "help", "help", "help_t" ] ].forEach(([e, s, a]) => add(t("pal_pages"), s, t(a), go("#/" + e))), 
  add(t("pal_actions"), "plus", t("pp_add"), go("#/experience/new")), add(t("pal_actions"), "chat", t("cp_open"), 'data-act="copilot"'), 
  add(t("pal_actions"), "eye", t("tour_take"), 'data-act="tour-home"'), confirmed().forEach(e => add(t("pal_skills"), "check", skName(e), go("#/passport"), te(STATE[skillState(e)][1]))), 
  liveOpps().forEach(e => add(t("pal_opps"), "brief", tx(e.title), `data-act="open-opp" data-id="${e.id}"`, nfmt(fit(e)) + "%"))), 
  "uni" === e && S.auth.uni && (Object.entries(USLUG).forEach(([e, s]) => add(t("pal_pages"), UNAV.find(s => s[0] === e)[1], t(UNAV.find(s => s[0] === e)[2]), go("#/uni/" + s))), 
  add(t("pal_actions"), "eye", t("tour_take"), 'data-act="tour" data-k="uni"'), uniStudents().forEach(e => add(t("u_nav_stu"), "user", e.nm, `data-act="u-stu" data-id="${e.id}"`, t(e.p)))), 
  "ops" === e && S.auth.ops && (ONAV.forEach(([e, s, a]) => add(t("pal_pages"), s, t(a), go("#/ops/" + OSLUG[e]))), 
  add(t("pal_actions"), "eye", t("tour_take"), 'data-act="tour" data-k="ops"'), allInsts().forEach(e => add(t("o_nav_inst"), "building", e.name, go("#/ops/institutions/" + e.id))), 
  liveOpps().concat(OPPS.filter(e => S.ops.oppOff[e.id])).forEach(e => add(t("o_nav_opps"), "brief", tx(e.title), go("#/ops/opportunities"), e.org))), 
  PUBLIC || PORTALS.forEach(([e, s, a]) => add(t("pt_label"), s, t(a), `data-act="portal" data-p="${e}"`)), 
  LANGS.forEach(e => add(t("set_lang"), "globe", t("lang_" + e), `data-act="lang" data-l="${e}"`)), 
  s;
}

function openPalette() {
  closePop(), ui.palQ = "", ui.palI = 0, modal(`<div class="pal"><div class="pal-in">${ic("search")}<label class="sr" for="palQ">${te("pal_ph")}</label><input id="palQ" class="pal-q" placeholder="${te("pal_ph")}" autocomplete="off" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="palL"><kbd>Esc</kbd></div><div class="pal-l" id="palL" role="listbox"></div><div class="pal-f"><span><kbd>↑</kbd><kbd>↓</kbd> ${te("pal_move")}</span><span><kbd>↵</kbd> ${te("pal_open_k")}</span></div></div>`, "pal-modal");
  const e = $("#palQ");
  palRender(), e.focus(), e.addEventListener("input", () => {
    ui.palQ = e.value, ui.palI = 0, palRender();
  }), e.addEventListener("keydown", e => {
    const s = $$("#palL .pal-i").length;
    if ("ArrowDown" === e.key && (e.preventDefault(), ui.palI = (ui.palI + 1) % Math.max(1, s), 
    palRender(!0)), "ArrowUp" === e.key && (e.preventDefault(), ui.palI = (ui.palI - 1 + s) % Math.max(1, s), 
    palRender(!0)), "Enter" === e.key) {
      e.preventDefault();
      const s = $$("#palL .pal-i")[ui.palI];
      s && s.click();
    }
  });
}

function palRender(e) {
  const s = $("#palL");
  if (!s) return;
  const a = norm(ui.palQ || "").toLowerCase().trim(), i = palItems().filter(e => !a || norm(e.label).toLowerCase().includes(a) || norm(e.group).toLowerCase().includes(a)).slice(0, 40);
  if (!i.length) return void (s.innerHTML = `<p class="pal-empty">${te("pal_none")}</p>`);
  let o = "", r = -1;
  s.innerHTML = i.map(e => {
    r++;
    return (e.group !== o ? `<p class="pal-g">${esc(o = e.group)}</p>` : "") + `<button class="pal-i ${r === ui.palI ? "on" : ""}" role="option" aria-selected="${r === ui.palI}" ${e.attrs}>${ic(e.icon)}<span class="pal-t">${esc(e.label)}</span>${e.hint ? `<small>${esc(e.hint)}</small>` : ""}</button>`;
  }).join("");
  const l = $(".pal-i.on", s);
  l && e && l.scrollIntoView({
    block: "nearest"
  });
}

function keysModal() {
  const e = [ [ [ /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl", "K" ], "ks_pal" ], [ [ "/" ], "ks_search" ], [ [ "?" ], "ks_keys" ], [ [ "Esc" ], "ks_esc" ], [ [ "Tab" ], "ks_tab" ] ];
  modal(`<button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button><h2>${te("ks_t")}</h2><dl class="keys">${e.map(([e, s]) => `<div><dt>${e.map(e => `<kbd>${e}</kbd>`).join("")}</dt><dd>${te(s)}</dd></div>`).join("")}</dl>`);
}

function consoleSignin(e) {
  if (PUBLIC) {
    const s = "uni" === e;
    return `<main class="csi ${!s ? "dark" : ""}" id="main">\n    <div class="csi-in">\n      <div class="csi-top">${brand()}<span class="csi-tag">${te(s ? "pt_uni" : "pt_ops")}</span><div class="top-r">${themeUI("toggle")}${langSeg()}</div></div>\n      <section class="csi-card" aria-labelledby="csiT">\n        ${s ? "" : `<span class="env"><span class="live-d"></span>${te("o_env")}</span>`}\n        <h1 id="csiT">${te(s ? "usi_t_pub" : "osi_t")}</h1><p class="mute">${te(s ? "usi_d_pub" : "osi_d")}</p>\n        ${s ? `<button class="btn lg block" data-act="csi-demo" data-k="uni">${ic("eye")}${te("usi_demo")}</button><p class="dim csi-foot">${te("csi_demo_pub")}</p>` : s ? `<button class="btn lg block" data-act="csi-sso">${ic("uni")}${te("usi_sso")}</button><div class="or"><span>${te("or")}</span></div>` : ""}\n        ${s ? "" : `<form class="csi-form" data-form="${s ? "usi" : "osi"}" novalidate><label class="flabel" for="csiE">${te(s ? "usi_email" : "osi_email")}</label>\n          <input id="csiE" class="inp" type="email" autocomplete="username" placeholder="${s ? "name@univ-boughaz.ma" : "name@skilma.ma"}" dir="ltr">\n          <button class="btn ${s ? "ghost" : ""} lg block" type="submit">${ic(s ? "mail" : "key")}${te(s ? "usi_link" : "osi_key")}</button></form>\n        <div id="csiState" aria-live="polite"></div>\n        <div class="csi-demo">${ic("info")}<div><p>${te(s ? "csi_demo" : "osi_sample")}</p><button class="linkbtn" data-act="csi-demo" data-k="${e}">${te(s ? "usi_demo" : "osi_demo")} ${ic("arrow")}</button></div></div>\n        <p class="dim csi-foot">${te(s ? "usi_foot" : "osi_foot")}</p>`}\n      </section>\n      ${s ? `<p class="csi-alt">${te("usi_new")} <button class="linkbtn" data-act="pal-go" data-h="#/institutions">${te("usi_pilot")}</button></p>` : ""}\n    </div></main>`;
  return;
  }
  const s = "uni" === e;
  return `<main class="csi ${!s ? "dark" : ""}" id="main">\n    <div class="csi-in">\n      <div class="csi-top">${brand()}<span class="csi-tag">${te(s ? "pt_uni" : "pt_ops")}</span><div class="top-r">${themeUI("toggle")}${langSeg()}</div></div>\n      <section class="csi-card" aria-labelledby="csiT">\n        ${s ? "" : `<span class="env"><span class="live-d"></span>${te("o_env")}</span>`}\n        <h1 id="csiT">${te(s ? "usi_t" : "osi_t")}</h1><p class="mute">${te(s ? "usi_d" : "osi_d")}</p>\n        ${s ? `<button class="btn lg block" data-act="csi-sso">${ic("uni")}${te("usi_sso")}</button><div class="or"><span>${te("or")}</span></div>` : ""}\n        <form class="csi-form" data-form="${s ? "usi" : "osi"}" novalidate><label class="flabel" for="csiE">${te(s ? "usi_email" : "osi_email")}</label>\n          <input id="csiE" class="inp" type="email" autocomplete="username" placeholder="${s ? "name@univ-boughaz.ma" : "name@skilma.ma"}" dir="ltr">\n          <button class="btn ${s ? "ghost" : ""} lg block" type="submit">${ic(s ? "mail" : "key")}${te(s ? "usi_link" : "osi_key")}</button></form>\n        <div id="csiState" aria-live="polite"></div>\n        <div class="csi-demo">${ic("info")}<div><p>${te(s ? "csi_demo" : "osi_sample")}</p><button class="linkbtn" data-act="csi-demo" data-k="${e}">${te(s ? "usi_demo" : "osi_demo")} ${ic("arrow")}</button></div></div>\n        <p class="dim csi-foot">${te(s ? "usi_foot" : "osi_foot")}</p>\n      </section>\n      ${s ? `<p class="csi-alt">${te("usi_new")} <button class="linkbtn" data-act="pal-go" data-h="#/institutions">${te("usi_pilot")}</button></p>` : ""}\n    </div></main>`;
}

async function consoleSignIn(e, s) {
  const a = $("#csiState");
  "ops" === e && "demo" !== s && a && !RM() && (a.innerHTML = `<div class="keywait">${ic("key")}<span>${te("osi_touch")}</span></div>`, 
  await sleep(1300)), S.auth[e] = !0, S.role = e, "uni" === e ? (ui.uview = "ov", 
  uniLog(t("audit_signin"))) : (ui.ops = "ov", opsLog(t("audit_signin"))), save(), 
  render(!0), window.scrollTo(0, 0), setTimeout(() => toast(t("uni" === e ? "usi_ok" : "osi_ok"), "check"), 350);
}

function opsLog(e) {
  (S.ops.log = S.ops.log || []).push({
    t: Date.now(),
    what: e
  }), S.ops.log.length > 200 && S.ops.log.splice(0, S.ops.log.length - 200);
}

document.addEventListener("keydown", e => {
  (e.metaKey || e.ctrlKey) && "k" === e.key.toLowerCase() && (e.preventDefault(), 
  $(".pal") ? closeModal() : openPalette()), "Escape" === e.key && $("#pop") && closePop(!0), 
  "Escape" === e.key && TOUR.k && tourEnd();
  e.target && e.target.matches && e.target.matches("input,textarea,select,[contenteditable]") || e.metaKey || e.ctrlKey || e.altKey || ("?" === e.key ? (e.preventDefault(), 
  keysModal()) : "/" !== e.key || $(".pal") || (e.preventDefault(), openPalette()));
});

const TYPES = [ "ty_work", "ty_family", "ty_study", "ty_vol", "ty_project", "ty_free" ];

function richness(e) {
  const s = norm(e), a = s.trim().split(/\s+/).filter(Boolean).length, i = rulesDiscover(s).length, o = ACTION_RE.test(s) || i > 0, r = /\d/.test(s), l = /customer|client|team|students|people|زبون|زبائن|زبناء|فريق|طلبة|الناس|متطوع|clients|équipe|élèves|bénévoles/i.test(s), c = Math.min(100, Math.round(1.1 * a + 11 * i + (r ? 14 : 0) + (ui.cmType ? 6 : 0)));
  return {
    score: c,
    band: c < 35 ? "thin" : c < 70 ? "ok" : "rich",
    g: [ o, r, l ]
  };
}

function vCompose() {
  const e = richness(S.draft);
  return `<main class="stage writer" id="main"><header class="stage-top">${brand()}<div class="top-r">${langPick()}${themeUI("toggle")}<button class="btn ghost sm cm-back" data-act="cm-back" aria-label="${te("cm_back")}">${ic("back")}<span class="lbl">${te("cm_back")}</span></button></div></header>\n    <section class="cm"><div class="cm-h"><h1>${te("cm_t")}</h1><p class="mute">${te("cm_sub")}</p></div>\n      <div class="cm-grid"><div class="cm-main">\n        <label class="sr" for="story">${te("cm_t")}</label><textarea id="story" class="inp cm-ta" rows="7" maxlength="1200" placeholder="${te("lp_ph")}">${esc(S.draft)}</textarea>\n        <div class="cm-starters"><span class="dim">${te("cm_ideas")}</span>${starters().map((e, s) => `<button class="chip" data-act="starter" data-i="${s}">${ic("plus")}${esc(e.trim())}</button>`).join("")}</div>\n        <div class="cm-meter b-${e.band}" id="cmMeter"><i><b style="width:${e.score}%"></b></i><span id="cmBand">${te("rich_" + e.band)}</span></div>\n        <div class="cm-acts"><button class="linkbtn" data-act="sample">${te("lp_try")}</button><span class="dim num" id="cnt">${nfmt(S.draft.length)}/1200</span><button class="btn lg" data-act="discover">${ic("spark")}${te("lp_go")}</button></div>\n      </div>\n      <div class="cm-side"><div class="panel"><p class="eyebrow">${te("cm_guide")}</p><ul class="cm-checks" id="cmChecks">${[ "cm_g1", "cm_g2", "cm_g3" ].map((s, a) => `<li class="${e.g[a] ? "ok" : ""}">${ic("check")}<span>${te(s)}</span></li>`).join("")}</ul></div>\n        <div class="panel"><p class="eyebrow">${te("live_t")}</p><div class="chips-wrap" id="livePrev" aria-live="polite" style="justify-content:flex-start;margin-top:10px">${liveChips(S.draft)}</div></div></div></div>\n    </section></main>`;
}

function liveChips(e) {
  const s = e.trim().length > 8 ? rulesDiscover(e) : [];
  return s.length ? s.map(e => stateTag("sugg", skName(e.id))).join("") : `<span class="dim">${te("live_0")}</span>`;
}

function composeMount() {
  const e = $("#story");
  if (!e) return;
  let s = 0;
  e.focus({
    preventScroll: !0
  }), e.setSelectionRange(e.value.length, e.value.length), e.addEventListener("input", () => {
    S.draft = e.value, $("#cnt").textContent = nfmt(e.value.length) + "/1200", save(), 
    clearTimeout(s), s = setTimeout(() => {
      const s = richness(e.value), a = $("#cmMeter");
      a && (a.className = "cm-meter b-" + s.band, $("b", a).style.width = s.score + "%", 
      $("#cmBand").textContent = t("rich_" + s.band), $$("#cmChecks li").forEach((e, a) => e.classList.toggle("ok", s.g[a])), 
      $("#livePrev").innerHTML = liveChips(e.value));
    }, 160);
  });
}

async function saveFile(e, s, a) {
  const i = new Blob([ s ], {
    type: a
  });
  if (DL) try {
    return await DL.save({
      filename: e,
      data: i
    }), !0;
  } catch (e) {
    return !(!e || "declined" !== e.code) && null;
  }
  try {
    const s = document.createElement("a");
    return s.href = URL.createObjectURL(i), s.download = e, document.body.appendChild(s), 
    s.click(), setTimeout(() => {
      URL.revokeObjectURL(s.href), s.remove();
    }, 1500), !0;
  } catch (e) {
    return !1;
  }
}

const csv = e => "\ufeff" + e.map(e => e.map(e => `"${String(e).replace(/"/g, '""')}"`).join(",")).join("\n"), PUB_LINKS = PUBLIC ? [ [ "how", "pub_how" ], [ "institutions", "pub_inst_nav" ], [ "trust", "pub_trust" ] ] : [ [ "how", "pub_how" ], [ "institutions", "pub_inst_nav" ], [ "vision", "pub_vision" ] ], PUB_MORE = PUBLIC ? [ [ "example", "pub_example" ], [ "access", "im_cta1" ] ] : [ [ "example", "pub_example" ], [ "trust", "pub_trust" ], [ "access", "im_cta1" ], [ "employers", "pub_emp" ] ];

function pubHeader(e) {
  return `<header class="pub-nav"><div class="lp2-in pub-nav-in">\n    <button class="brand-btn" data-act="pub" data-p="home" aria-label="SKILMA — ${te("pub_home")}">${brand()}</button>\n    <nav class="pub-links" aria-label="${te("pub_nav")}">${PUB_LINKS.map(([s, a]) => `<button class="lnk" data-act="pub" data-p="${s}" ${e === s ? 'aria-current="page"' : ""}>${te(a)}</button>`).join("")}</nav>\n    <div class="top-r">${langPick()}<button class="ibtn ax-open" data-act="ax-open" aria-expanded="${!!ui.ax}" aria-label="${te("ax_btn")}"><b aria-hidden="true">Aa</b></button><button class="btn ghost sm pub-in" data-act="pub" data-p="signin" ${"signin" === e ? 'aria-current="page"' : ""}>${te("pub_signin")}</button><button class="btn sm pub-go" data-act="start">${te(hasPassport() ? "pub_open" : "pub_start")}</button>\n      <button class="ibtn pub-menu" data-act="pub-menu" aria-expanded="${!!ui.menu}" aria-label="${te("pub_menu")}">${ic(ui.menu ? "x" : "list")}</button></div>\n  </div>${ui.ax ? `<div class="ax-pop lp2-in" role="group" aria-label="${te("ax_btn")}">${themeUI("toggle")}<button class="ax-b" data-act="fsize" data-v="${1.25 === (S.prefs.fs || 1) ? 1 : 1.25}" aria-pressed="${1.25 === (S.prefs.fs || 1)}"><b aria-hidden="true">A+</b>${te("ax_size")}</button><button class="ax-b" data-act="listen">${ic("vol")}${te("listen")}</button><button class="ax-b" data-act="lite" aria-pressed="${!!S.prefs.lite}">${ic("bolt")}${te("ax_lite")}</button></div>` : ""}${ui.menu ? `<nav class="pub-drop lp2-in" aria-label="${te("pub_nav")}">${[ [ "home", "pub_home" ] ].concat(PUB_LINKS, PUB_MORE, [ [ "signin", "pub_signin" ] ]).map(([s, a]) => `<button class="lnk" data-act="pub" data-p="${s}" ${e === s ? 'aria-current="page"' : ""}>${te(a)}</button>`).join("")}<button class="btn" data-act="start">${te(hasPassport() ? "pub_open" : "pub_start")} ${ic("arrow")}</button></nav>` : ""}</header>`;
}

function pubFooter() {
  if (PUBLIC) {
    const col = (e, s) => `<div class="ft-col"><p class="ft-h">${te(e)}</p>${s.map(([e, s, a = ""]) => `<button class="lnk" ${e} ${a}>${te(s)}</button>`).join("")}</div>`;
    return `<footer class="pub-foot"><div class="lp2-in">\n    <div class="ft-grid">\n      <div class="ft-brand">${brand()}<p>${te("foot_promise")}</p><div class="ft-langs">${langSeg()}${themeUI("seg")}</div>\n        <div class="a11y-bar" role="group" aria-label="${te("ax_t")}">${"speechSynthesis" in window ? `<button class="chip listen" data-act="listen">${ic("vol")}${te("listen")}</button>` : ""}<button class="chip ${S.prefs.lite ? "on" : ""}" data-act="lite" aria-pressed="${!!S.prefs.lite}">${ic("bolt")}${te("ax_lite")}</button><div class="seg fs-seg" role="group" aria-label="${te("ax_size")}">${[ [ 1, "A" ], [ 1.12, "A+" ], [ 1.25, "A++" ] ].map(([e, s]) => `<button data-act="fsize" data-v="${e}" aria-pressed="${(S.prefs.fs || 1) === e}">${s}</button>`).join("")}</div></div></div>\n      ${col("ft_product", [ [ 'data-act="pub" data-p="how"', "pub_how" ], [ 'data-act="pub" data-p="example"', "pub_example" ], [ 'data-act="pub" data-p="changelog"', "pub_changes" ] ].concat([]))}\n      ${col("ft_inst", [ [ 'data-act="pub" data-p="institutions"', "pub_inst" ], [ 'data-act="pilot"', "ip_pilot_t" ], [ 'data-act="portal" data-p="uni"', "ft_uni_in" ] ].concat([]))}\n      ${col("ft_trust", [ [ 'data-act="pub" data-p="trust"', "pub_trust" ], [ 'data-act="pub" data-p="access"', "im_cta1" ], [ 'data-act="pub" data-p="signin"', "pub_signin" ] ].concat([]))}\n    </div>\n    <div class="ft-bot"><span>© 2026 SKILMA</span><span>${te("foot_note_pub")}</span></div>\n  </div></footer>`;
  return;
  }
  const col = (e, s) => `<div class="ft-col"><p class="ft-h">${te(e)}</p>${s.map(([e, s, a = ""]) => `<button class="lnk" ${e} ${a}>${te(s)}</button>`).join("")}</div>`;
  return `<footer class="pub-foot"><div class="lp2-in">\n    <div class="ft-grid">\n      <div class="ft-brand">${brand()}<p>${te("foot_promise")}</p><div class="ft-langs">${langSeg()}${themeUI("seg")}</div>\n        <div class="a11y-bar" role="group" aria-label="${te("ax_t")}">${"speechSynthesis" in window ? `<button class="chip listen" data-act="listen">${ic("vol")}${te("listen")}</button>` : ""}<button class="chip ${S.prefs.lite ? "on" : ""}" data-act="lite" aria-pressed="${!!S.prefs.lite}">${ic("bolt")}${te("ax_lite")}</button><div class="seg fs-seg" role="group" aria-label="${te("ax_size")}">${[ [ 1, "A" ], [ 1.12, "A+" ], [ 1.25, "A++" ] ].map(([e, s]) => `<button data-act="fsize" data-v="${e}" aria-pressed="${(S.prefs.fs || 1) === e}">${s}</button>`).join("")}</div></div></div>\n      ${col("ft_product", [ [ 'data-act="pub" data-p="how"', "pub_how" ], [ 'data-act="pub" data-p="example"', "pub_example" ], [ 'data-act="pub" data-p="changelog"', "pub_changes" ] ].concat([ [ 'data-act="pub" data-p="vision"', "pub_vision" ], [ 'data-act="pub" data-p="brand"', "pub_brand" ] ]))}\n      ${col("ft_inst", [ [ 'data-act="pub" data-p="institutions"', "pub_inst" ], [ 'data-act="pilot"', "ip_pilot_t" ], [ 'data-act="portal" data-p="uni"', "ft_uni_in" ] ].concat([ [ 'data-act="pub" data-p="employers"', "pub_emp" ], [ 'data-act="pub" data-p="partners"', "pub_partners" ] ]))}\n      ${col("ft_trust", [ [ 'data-act="pub" data-p="trust"', "pub_trust" ], [ 'data-act="pub" data-p="access"', "im_cta1" ], [ 'data-act="pub" data-p="signin"', "pub_signin" ] ].concat([ [ 'data-act="portal" data-p="ops"', "ft_team" ] ]))}\n    </div>\n    <div class="ft-bot"><span>© 2026 SKILMA</span><span>${te("foot_note")}</span></div>\n  </div></footer>`;
}

const pubPage = (e, s) => `<div class="lp2 pub">${maintBanner()}${pubHeader(e)}<main id="main">${s}</main>${pubFooter()}</div>`, secHead = (e, s, a = "") => `<div class="sec-head rv"><p class="lp2-kicker">${e}</p><h2>${s}</h2>${a ? `<p class="lp2-sub">${a}</p>` : ""}</div>`, FILM = {
  tok: 0,
  scene: 0,
  paused: !1,
  dur: [ 5600, 5600, 5e3, 5800 ]
};

function filmData() {
  const e = exText(), s = withState(Object.assign(blank(), {
    ops: S.ops
  }), () => rulesDiscover(e)), a = new Set(s.map(e => e.id)), fitWith = e => {
    let s = 0, i = 0;
    for (const [o, r] of e.req) {
      const e = r ? 2 : 1;
      s += e, a.has(o) && (i += e);
    }
    return Math.round(100 * i / s);
  }, i = opp("analyst") || liveOpps().concat(OPPS).map(e => ({
    o: e,
    p: fitWith(e)
  })).sort((e, s) => s.p - e.p)[0].o, o = i.req.filter(([e]) => !a.has(e)).map(e => e[0]);
  return {
    text: e,
    found: s,
    o: i,
    p: fitWith(i),
    have: i.req.length - o.length,
    miss: o,
    gap: (i.req.find(([e, s]) => s && !a.has(e)) || [ o[0] ])[0]
  };
}

function markAll(e, s) {
  let a = esc(e);
  return s.filter(Boolean).forEach((e, s) => {
    const i = esc(e), o = a.toLowerCase().indexOf(i.toLowerCase());
    if (o < 0) return;
    let r = o, l = o + i.length;
    const c = /[\s.,;:!?،؟]/;
    for (;r > 0 && !c.test(a[r - 1]); ) r--;
    for (;l < a.length && !c.test(a[l]); ) l++;
    a = a.slice(0, r) + `<mark class="fm" data-i="${s}">` + a.slice(r, l) + "</mark>" + a.slice(l);
  }), a;
}

function filmHTML() {
  const e = filmData(), s = e.o, a = [ 1, 2, 3, 4 ].map(e => `<button role="tab" class="ft" data-act="film-go" data-i="${e - 1}" aria-selected="${1 === e}" tabindex="${1 === e ? 0 : -1}"><span class="ft-n num">${nfmt(e)}</span><span>${te("film_" + e)}</span><i class="ft-bar"><b></b></i></button>`).join(""), i = [ 1, 2, 3, 4, 5, 6, 7 ].map(e => `<i class="fd ${6 === e ? "prove" : ""}" data-d="${e}">${ic(6 === e ? "file" : "check")}</i>`).join("");
  return `<div class="film" id="film" data-scene="0" aria-roledescription="carousel" aria-label="${te("hm_watch")}">\n    <div class="film-tabs" role="tablist">${a}</div>\n    <div class="film-stage" aria-live="off">\n      <section class="fs fs0 on" aria-hidden="false"><p class="fc-label">${ic("pen")}${te("win_t")}</p><p class="fc-text" id="f0t"><span class="caret"></span></p>\n        <div class="fc-meter"><span>${te("film_rich")}</span><i><b id="f0m"></b></i></div></section>\n      <section class="fs fs1" aria-hidden="true"><p class="fc-text sm">${markAll(e.text, e.found.map(e => e.term))}</p>\n        <div class="fc-chips">${e.found.map((e, s) => `<span class="state s-sugg fc-chip" data-i="${s}">${ic("spark")}<span>${esc(skName(e.id))}</span></span>`).join("")}</div>\n        <div class="fc-pass"><span class="pi">${ic("pass")}</span><span>${te("film_passport")}</span><b class="num" id="f1n">0</b></div></section>\n      <section class="fs fs2" aria-hidden="true"><div class="fc-opp"><span class="logo">${esc(s.ini)}</span><div style="min-width:0"><b>${esc(tx(s.title))}</b><small>${bdi(s.org)} · ${esc(tx(C[s.city]))}</small></div><b class="fc-fit num" id="f2p">${nfmt(0)}/${nfmt(s.req.length)}</b></div>\n        <div class="fc-ladder"><span class="seg have" style="--f:${e.have}">${numLabel("lg_have", e.have)}</span><span class="seg gap" style="--f:${e.miss.length}">${numLabel("lg_gap", e.miss.length)}</span></div>\n        <div class="fc-gap">${stateTag("miss", skName(e.gap))}<small class="dim num">${te("od_hours", {
    h: nfmt(RES[e.gap].h)
  })}</small></div></section>\n      <section class="fs fs3" aria-hidden="true"><p class="fc-label">${ic("plan")}${esc(t("pl_block", {
    skill: skName(e.gap)
  }))}</p><div class="fc-path">${i}</div>\n        <div class="fc-ready">${ring(36, 104, 8, "", nfmt(4) + "/" + nfmt(11), !1)}<p>${te("tk_why_proof")}</p></div></section>\n    </div>\n    <div class="film-foot"><p class="film-cap" id="filmCap">${te("film_1c")}</p><button class="ibtn" data-act="film-toggle" id="filmBtn" aria-label="${te("film_pause")}">${filmIcon(!1)}</button></div>\n  </div>`;
}

const filmIcon = e => e ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';

function filmAt(e, s, a) {
  setTimeout(() => {
    a === FILM.tok && $("#film") && e();
  }, s);
}

function filmReset(e) {
  const s = $("#film"), a = filmData();
  if (s && (0 === e && ($("#f0t").innerHTML = '<span class="caret"></span>', $("#f0m").style.width = "0%"), 
  1 === e && ($$(".fm", s).forEach(e => e.classList.remove("on")), $$(".fc-chip", s).forEach(e => {
    e.classList.remove("in", "s-conf"), e.classList.add("s-sugg"), e.firstElementChild.outerHTML = ic("spark");
  }), $("#f1n").textContent = nfmt(0)), 2 === e && ($(".fc-opp", s).classList.remove("in"), 
  $(".fc-ladder", s).classList.remove("go"), $(".fc-gap", s).classList.remove("in"), 
  $("#f2p").textContent = nfmt(0) + "/" + nfmt(a.o.req.length)), 3 === e)) {
    $$(".fd", s).forEach(e => e.classList.remove("on"));
    const e = $(".fs3 .g-val", s);
    e.style.transition = "none", e.style.strokeDasharray = "36 100", requestAnimationFrame(() => e.style.transition = ""), 
    $(".fs3 .g-dot", s).classList.remove("on"), $(".fs3 tspan", s).textContent = nfmt(4) + "/" + nfmt(11);
  }
}

function filmFinal(e) {
  const s = $("#film"), a = filmData();
  s && (0 === e && ($("#f0t").textContent = a.text, $("#f0m").style.width = "86%"), 
  1 === e && ($$(".fm", s).forEach(e => e.classList.add("on")), $$(".fc-chip", s).forEach(e => {
    e.classList.add("in", "s-conf"), e.classList.remove("s-sugg"), e.firstElementChild.outerHTML = ic("check");
  }), $("#f1n").textContent = nfmt(a.found.length)), 2 === e && ($(".fc-opp", s).classList.add("in"), 
  $(".fc-ladder", s).classList.add("go"), $(".fc-gap", s).classList.add("in"), $("#f2p").textContent = nfmt(a.have) + "/" + nfmt(a.o.req.length)), 
  3 === e && ($$(".fd", s).forEach(e => e.classList.add("on")), $(".fs3 .g-val", s).style.strokeDasharray = "82 100", 
  $(".fs3 tspan", s).textContent = nfmt(9) + "/" + nfmt(11)));
}

function filmShow(e) {
  const s = $("#film");
  s && (s.dataset.scene = e, FILM.scene = e, $$(".fs", s).forEach((s, a) => {
    s.classList.toggle("on", a === e), s.setAttribute("aria-hidden", a !== e);
  }), $$(".ft", s).forEach((s, a) => {
    s.setAttribute("aria-selected", a === e), s.tabIndex = a === e ? 0 : -1, s.classList.toggle("done", a < e), 
    s.style.setProperty("--d", FILM.dur[e] + "ms");
    const i = $(".ft-bar b", s);
    i.style.animation = "none", i.offsetWidth, i.style.animation = "";
  }), $("#filmCap").textContent = t("film_" + (e + 1) + "c"));
}

function filmPlay(e) {
  const s = ++FILM.tok, a = $("#film");
  if (!a) return;
  if (filmShow(e), RM()) return void filmFinal(e);
  filmReset(e);
  const i = filmData();
  if (0 === e && filmAt(() => {
    typeInto($("#f0t"), i.text, 26), $("#f0m").style.width = "86%";
  }, 250, s), 1 === e && ($$(".fm", a).forEach((e, a) => filmAt(() => e.classList.add("on"), 250 + 380 * a, s)), 
  $$(".fc-chip", a).forEach((e, a) => filmAt(() => {
    e.classList.add("in"), SND.play("tick");
  }, 1100 + 380 * a, s)), $$(".fc-chip", a).forEach((e, i) => filmAt(() => {
    e.classList.remove("s-sugg"), e.classList.add("s-conf"), e.firstElementChild.outerHTML = ic("check"), 
    $("#f1n").textContent = nfmt(i + 1), bounce($(".fc-pass", a), "pop");
  }, 2700 + 420 * i, s))), 2 === e) {
    filmAt(() => $(".fc-opp", a).classList.add("in"), 150, s);
    for (let e = 1; e <= i.have; e++) filmAt(() => {
      const s = $("#f2p");
      s && (s.textContent = nfmt(e) + "/" + nfmt(i.o.req.length));
    }, 450 + 180 * e, s);
    filmAt(() => $(".fc-ladder", a).classList.add("go"), 900, s), filmAt(() => $(".fc-gap", a).classList.add("in"), 2e3, s);
  }
  3 === e && ([ 1, 2, 3, 4, 5 ].forEach((e, i) => filmAt(() => $(`.fd[data-d="${e}"]`, a).classList.add("on"), 300 + 260 * i, s)), 
  filmAt(() => {
    $('.fd[data-d="6"]', a).classList.add("on"), $(".fs3 .g-val", a).style.strokeDasharray = "82 100", 
    [ 5, 6, 7, 8, 9 ].forEach((e, s) => setTimeout(() => {
      const s = $(".fs3 tspan", a);
      s && (s.textContent = nfmt(e) + "/" + nfmt(11));
    }, 220 * s));
  }, 2e3, s), filmAt(() => $('.fd[data-d="7"]', a).classList.add("on"), 3300, s)), 
  filmAt(() => {
    FILM.paused || filmPlay((e + 1) % 4);
  }, FILM.dur[e], s);
}

function filmMount() {
  const e = $("#film");
  if (e) {
    if (FILM.paused = !1, RM()) return [ 0, 1, 2, 3 ].forEach(filmFinal), filmShow(0), 
    void e.classList.add("static");
    filmPlay(0);
  }
}

let PUB_IO = null;

function spotlight() {
  !RM() && matchMedia("(hover:hover) and (pointer:fine)").matches && $$(".feat, .ht-states li, .ht-priv, .hw-vis, .mt-c, .pb-st, .pb-par, .see, .try-out, .xl, .eco, .rmap > li").forEach(e => {
    e.dataset.spot || (e.dataset.spot = "1", e.classList.add("spl"), e.addEventListener("pointermove", s => {
      const a = e.getBoundingClientRect();
      e.style.setProperty("--mx", s.clientX - a.left + "px"), e.style.setProperty("--my", s.clientY - a.top + "px");
    }));
  });
}

function pubMount() {
  PUB_IO && (PUB_IO.disconnect(), PUB_IO = null), spotlight(), tryMount(), skMount(), hxMount();
  const e = $("#film");
  !RM() && "IntersectionObserver" in window ? (PUB_IO = new IntersectionObserver(e => e.forEach(e => {
    if (!e.isIntersecting) return;
    const s = e.target;
    s.classList.add("in"), $("[data-w]", s) && setBars(s), $("[data-cv]", s) && runCounts(s, "cv"), 
    PUB_IO && PUB_IO.unobserve(s), s.classList.contains("jy") && jyPlay(s);
  }), {
    rootMargin: "0px 0px -8% 0px"
  }), $$(".rv, .chain, .jy, .xl, .feat, .engine, .imp").forEach((e, s) => PUB_IO.observe(e)), 
  $$(".rv-g").forEach(e => $$(":scope > *", e).forEach((e, s) => {
    e.classList.add("rv"), e.style.transitionDelay = s % 4 * 80 + "ms", PUB_IO.observe(e);
  })), e && new IntersectionObserver((s, a) => {
    e.isConnected ? s.forEach(s => {
      s.isIntersecting || FILM.paused ? s.isIntersecting && e.dataset.idle && !FILM.paused && (delete e.dataset.idle, 
      filmPlay(FILM.scene)) : (FILM.tok++, e.dataset.idle = "1");
    }) : a.disconnect();
  }).observe(e)) : $$(".rv, .chain, .jy, .xl, .feat, .engine, .imp").forEach(e => e.classList.add("in"));
}

function jyPlay(e) {
  const s = $(".jy-g .g-val", e), a = $(".jy-g tspan", e), i = $$(".jy-s", e);
  let o = 0;
  const r = JY.map(e => e.r), tick = () => {
    if (!e.isConnected) return;
    i.forEach((e, s) => e.classList.toggle("on", s <= o)), s && (s.style.strokeDasharray = r[o] + " 100"), 
    a && (a.textContent = pc(r[o]));
    const l = $(".jy-g .g-dot", e);
    l && l.classList.toggle("on", r[o] >= 70), o++, o < i.length && setTimeout(tick, 700);
  };
  tick();
}

const XL = [ [ "xl1", "f_eco", [ "customer_service", "cash", "negotiation" ] ], [ "xl2", "f_law", [ "event", "leadership", "teamwork" ] ], [ "xl3", "f_lang", [ "multilingual", "customer_service", "presentation" ] ] ], CHAIN = [ "ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8" ], JY = [ {
  d: 1,
  k: "jy1",
  r: 0
}, {
  d: 2,
  k: "jy2",
  r: 21
}, {
  d: 6,
  k: "jy3",
  r: 37
}, {
  d: 13,
  k: "jy4",
  r: 54
}, {
  d: 26,
  k: "jy5",
  r: 79
}, {
  d: 30,
  k: "jy6",
  r: 89
} ], ENGINE = [ "en1", "en2", "en3", "en4", "en5" ];

function engineHTML(e) {
  const s = liveData(), a = s.o, i = [ "bizdev", "fieldsales" ].map(opp).filter(Boolean), o = [ `<div class="eg-chips">${s.found.map(e => stateTag("conf", skName(e.id))).join("")}</div>`, `<div class="eg-list"><div class="eg-row hi"><span>${esc(tx(a.short))}</span><b class="num">${te("lv_two")}</b></div>${i.map(e => `<div class="eg-row"><span>${esc(tx(e.short))}</span></div>`).join("")}</div>`, `<div class="eg-chips">${s.gaps.map(e => stateTag("miss", skName(e))).join("")}</div>`, `<ol class="eg-days"><li><b class="num">${te("day_n", {
    n: nfmt(1)
  })}</b><span>${te("eg_d1")}</span></li><li><b class="num">${te("day_n", {
    n: nfmt(12)
  })}</b><span>${te("eg_d12")}</span></li><li><b class="num">${te("day_n", {
    n: nfmt(30)
  })}</b><span>${te("eg_d30")}</span></li></ol>`, `<div class="eg-ready">${ring(100, 64, 9, "", nfmt(11) + "/" + nfmt(11), !0)}<span>${te("eg_proj")}</span></div>` ];
  return `<ol class="engine ${e ? "compact" : ""}">${ENGINE.map((e, s) => `<li style="--i:${s}"><span class="en-n num">0${nfmt(s + 1)}</span><h3>${te(e)}</h3><p class="mute">${te(e + "d")}</p><div class="en-ex">${o[s]}</div></li>`).join("")}</ol>`;
}

function impactHTML() {
  return `<div class="imp">\n    <figure class="imp-eq" aria-label="${te("imp_eq")}"><div class="imp-dots">${Array.from({
    length: 10
  }, (e, s) => `<i style="--i:${s}"></i>`).join("")}</div><span class="imp-arr" aria-hidden="true">${ic("arrow")}</span><span class="imp-star" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="${starD(50, 50, 40, .2)}"/></svg></span><figcaption>${te("imp_eq")}</figcaption></figure>\n    <div class="imp-t"><p class="lp2-kicker">${te("im_k")}</p><h2>${te(PUBLIC ? "im_h_pub" : "im_h")}</h2><p class="lp2-sub">${te(PUBLIC ? "im_d_pub" : "im_d")}</p>\n      <ul class="imp-pts">${[ "im_p1", "im_p2", "im_p3" ].map((e, s) => `<li>${ic([ "clock", "activity", "globe" ][s])}<span>${te(e)}</span></li>`).join("")}</ul>\n      <div class="lp2-ctas"><button class="btn lg on-ink" data-act="pub" data-p="access">${te("im_cta1")} ${ic("arrow")}</button><button class="btn ghost lg ghost-ink" data-act="pub" data-p="how">${te("im_cta2")}</button></div></div>\n  </div>`;
}

function roadmapHTML(e) {
  return `<ol class="rmap">${[ [ "rm1", "rm_now", "ok" ], [ "rm2", "rm_next", "ok" ], [ "rm3", "rm_then", "pre" ], [ "rm4", "rm_fin", "soon" ], [ "rm5", "rm_later", "vis" ] ].map(([s, a, i], o) => `<li class="rm-${i}" style="--i:${o}"><span class="rm-w">${te(a)} · ${te("rm_m" + (o + 1))}</span><h3>${te(s + "t")}</h3><p class="mute">${te(s + "d")}</p>${e ? `<ul>${[ 1, 2, 3 ].map(e => `<li>${ic("check")}<span>${te(s + "f" + e)}</span></li>`).join("")}</ul>` : ""}<span class="rm-s">${te("rms_" + i)}</span></li>`).join("")}</ol>`;
}

const HCP = {
  dip: [ [ "pb_d1", 18.1 ], [ "pb_d2", 18.1 ], [ "pb_d3", 11.6 ], [ "pb_d4", 4.7 ] ],
  youth: 30.5,
  under: 18.9,
  underY: 41.7
};

function problemHTML(q = 1) {
  const e = HCP.dip[0][1], cv = (e, s = 1) => `<b class="num" data-cv="${e}" data-pct="${s}">${pfmt(e, s)}</b>`;
  return `${q ? `<ul class="pb-qs rv-g">${[ 1, 2, 3, 4 ].map(e => `<li><span class="pb-qm" aria-hidden="true">“</span>${te("pb_q" + e)}</li>`).join("")}</ul>` : ""}\n    <div class="pb2">\n      <figure class="pb-par rv"><figcaption><span class="pb-par-k">${te("pb_par_k")}</span><span class="pb-par-h">${te("pb_par_h")}</span></figcaption>\n        <div class="pb-bars" role="img" aria-label="${esc(HCP.dip.map(([e, s]) => t(e) + " " + pfmt(s)).join(", "))}">${HCP.dip.map(([s, a], i) => `<div class="pb-bar${i ? "" : " top"}" style="--h:${(a / e * 100).toFixed(1)}%;--i:${i}" aria-hidden="true"><span class="pb-c">${cv(a)}<i></i></span><span class="pb-lb">${te(s)}</span></div>`).join("")}</div></figure>\n      <div class="pb-side">\n        <figure class="pb-st ink rv">${cv(HCP.youth)}<figcaption>${te("pb_youth")}</figcaption></figure>\n        \n      </div>\n    </div>\n    <p class="pb-src">${smallIc("info")}<span>${te("pb_src")}</span></p>`;
}

function heroRoad() {
  const e = "M-40 640 C 180 600 220 470 380 470 S 560 560 700 430 S 860 230 1000 200 S 1140 150 1190 96";
  return `<div class="h-road" aria-hidden="true"><svg viewBox="0 0 1280 680" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="hrg" x1="0" x2="1" y1="1" y2="0"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset=".35" stop-color="currentColor" stop-opacity=".55"/><stop offset="1" stop-color="currentColor" stop-opacity=".9"/></linearGradient></defs>\n    <path class="hr-bed" d="${e}"/><path class="hr-line" d="${e}" pathLength="1"/><path class="hr-dash" d="${e}" pathLength="100"/>\n    <circle class="hr-mover" r="5"><animateMotion dur="14s" repeatCount="indefinite" path="${e}" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></circle>\n    <g class="hr-star" transform="translate(1190 96)"><circle r="46" class="hr-glow"/><path d="${starD(0, 0, 26, .22)}"/></g></svg></div>`;
}

function heroTitle() {
  const e = t("h4_a"), s = t("h4_b"), a = t("h4_c");
  return s && "h4_b" !== s ? `${splitWords(e)} <span class="h-hl">${splitWords(s)}</span> ${splitWords(a)}` : splitWords(t("h4_h1"));
}

const LIFE = [ [ "ls_shop", "negotiation", "home" ], [ "ls_club", "event", "users" ], [ "ls_summer", "customer_service", "sun" ], [ "ls_vol", "teamwork", "heart" ], [ "ls_class", "research", "book" ], [ "ls_insta", "social_media", "chat" ], [ "ls_guest", "multilingual", "globe" ], [ "ls_team", "leadership", "star" ], [ "ls_tutor", "presentation", "mic" ], [ "ls_stall", "cash", "brief" ], [ "ls_survey", "excel", "chart" ] ];

function lifeStrip() {
  const item = ([e, s, a]) => `<li><span class="ls-from">${ic(a)}${te(e)}</span><span class="ls-arr" aria-hidden="true">${ic("arrow")}</span><span class="state s-conf">${ic("check")}${esc(skName(s))}</span></li>`, row = (e, s) => `<div class="ls-row ${s}"><ul class="ls-track">${e.map(item).join("")}</ul><ul class="ls-track" aria-hidden="true">${e.map(item).join("")}</ul></div>`, e = LIFE.slice(0, 6), s = LIFE.slice(5).concat(LIFE.slice(0, 1));
  return `<section class="life ${ui.lsPaused ? "paused" : ""}" aria-label="${te("ls_k")}"><div class="life-h"><p class="life-k">${te("ls_k")}</p><button class="ibtn ls-pause" data-act="ls-toggle" aria-pressed="${!!ui.lsPaused}" aria-label="${te(ui.lsPaused ? "ls_play" : "lv_pause")}">${filmIcon(!!ui.lsPaused)}</button></div>${row(e, "")}${row(s, "rev")}</section>`;
}

const MK_CENTER = "M250 905C520 905 800 870 790 700C780 560 600 545 480 540C330 535 215 480 240 370C262 270 390 250 560 262", SK_POSTS = [ [ "ls_shop", "negotiation", "home", 38.5, 86.5, 2.3 ], [ "ls_club", "event", "users", 63.1, 52.2, 4.1 ], [ "ls_summer", "customer_service", "sun", 16.7, 41.4, 5.4 ] ];

function skSky(e = 60, s = 7) {
  let a = s;
  const r = () => (a = (9301 * a + 49297) % 233280) / 233280;
  return `<div class="sk-sky" aria-hidden="true">${Array.from({
    length: e
  }, () => `<i style="left:${(100 * r()).toFixed(2)}%;top:${(78 * r()).toFixed(2)}%;--s:${(1 + 2.2 * r()).toFixed(1)}px;--d:${(7 * r()).toFixed(2)}s;--o:${(.25 + .6 * r()).toFixed(2)}"></i>`).join("")}</div>`;
}

function skRoad(e = 1) {
  const s = liveData().o, a = !RM() && e;
  return `<figure class="sk-road${a ? " anim" : ""}" aria-hidden="true">
    <svg viewBox="180 40 720 990" focusable="false"><defs><radialGradient id="skGlow"><stop offset="0" stop-color="#F1D9A6" stop-opacity=".6"/><stop offset=".45" stop-color="#D4AF7C" stop-opacity=".18"/><stop offset="1" stop-color="#D4AF7C" stop-opacity="0"/></radialGradient>
      <mask id="skRev" maskUnits="userSpaceOnUse" x="0" y="0" width="1100" height="1100"><path class="sk-draw" d="${MK_CENTER}" pathLength="1" fill="none" stroke="#fff" stroke-width="250" stroke-linecap="round"/></mask></defs>
      <circle class="sk-glow" cx="742" cy="226" r="250" fill="url(#skGlow)"/>
      <g mask="url(#skRev)"><path class="sk-body" fill-rule="evenodd" d="${RD_BODY}${RD_LANE}"/></g>
      <path class="sk-star" d="${RD_STAR}"/>
      ${a ? `<circle class="sk-trav" r="13" cx="0" cy="0"><animateMotion dur="5.4s" begin="1.5s" fill="freeze" calcMode="paced" path="${MK_CENTER}"/><animate attributeName="opacity" from="1" to="0" begin="6.7s" dur=".5s" fill="freeze"/></circle>` : ""}
    </svg>
    ${SK_POSTS.map(([e, s, a, i, o, r], l) => `<span class="sk-post p${l}" style="left:${i}%;top:${o}%;--t:${r}s"><span class="sk-life">${ic(a)}${te(e)}</span><span class="sk-skill">${ic("check")}${esc(skName(s))}</span></span>`).join("")}
    <span class="sk-arrive"><span class="logo">${esc(s.ini)}</span><span><b>${esc(tx(s.title))}</b><small>${te("lv_ready")}</small></span></span>
  </figure>`;
}

function skHero() {
  return `<section class="sk-hero" aria-labelledby="skH">${skSky()}<div class="lp2-in sk-hero-in">
    <div class="sk-copy"><h1 id="skH" class="sk-h">${heroTitle()}</h1><p class="sk-sub">${te("h4_sub")}</p>
      <div class="sk-ctas"><button class="btn lg sk-gold" data-act="start">${te(hasPassport() ? "pub_open" : "pub_start")} ${ic("arrow")}</button><button class="btn lg sk-ghost" data-act="scroll-to" data-id="try">${ic("pen")}${te("h_try")}</button></div>
      <ul class="sk-facts"><li>${ic("users")}${te("h2_kicker")}</li><li>${ic("chat")}${te("h4_f2")}</li><li>${ic("lock")}${te("lp_private")}</li></ul></div>
    ${skRoad()}
  </div><div class="sk-horizon" aria-hidden="true"></div></section>`;
}

function skPath() {
  return `<section class="lp2-sec sk-path" id="engine"><div class="lp2-in"><div class="sk-head rv"><h2>${te("en_h")}</h2><p class="lp2-sub">${te("en_sub")}</p></div>
    <div class="sk-route"><div class="sk-line" aria-hidden="true"><i></i></div>${engineHTML()}
      <div class="sk-goal rv"><span class="sk-goal-star" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="${starD(50, 50, 44, .18)}"/></svg></span><p>${te("lv_ready")}</p></div></div>
    <div class="steps-cta rv"><button class="btn ghost" data-act="pub" data-p="how">${te("hm_watch")} ${ic("arrow")}</button></div></div></section>`;
}

const HX_LANGS = [ [ "ar", "العربية", "rtl", "ar" ], [ "fr", "Français", "ltr", "fr" ], [ "en", "English", "ltr", "en" ] ], HX = {
  l: null,
  own: !1,
  t: 0,
  cyc: 0,
  hold: !1,
  done: !1
};

function hxLang() {
  return HX.l || (LIVE_STORY[L()] ? L() : "ar");
}

function hxMarked(e) {
  const s = LIVE_STORY[e];
  let a = esc(s.text);
  const w = /[\p{L}\p{M}\p{N}’'-]/u;
  return s.terms.forEach((e, s) => {
    const i = esc(e);
    let o = a.indexOf(i), r = o + i.length;
    if (o < 0) return;
    for (;o > 0 && w.test(a[o - 1]); ) o--;
    for (;r < a.length && w.test(a[r]); ) r++;
    a = a.slice(0, o) + `<mark class="hx-t" data-k="${s}">${a.slice(o, r)}</mark>` + a.slice(r);
  }), a;
}

function hxFit(e) {
  const s = (e.req || []).map(e => e[0]);
  return {
    k: s.filter(e => LIVE_SK.includes(e)).length,
    n: s.length
  };
}

function hxRole(e, s, a) {
  return e ? `<div class="hx-role${a ? " on" : ""}"><span class="hx-logo" aria-hidden="true">${ic("brief")}</span><div class="hx-rt"><small>${te("try_roles")}</small><b>${esc(tx(e.title))}</b></div><span class="hx-fit num"><b>${nfmt(s.k)}</b>/${nfmt(s.n)}</span><i class="hx-bar" aria-hidden="true"><em style="--p:${(s.k / Math.max(1, s.n)).toFixed(3)}"></em></i></div>` : "";
}

function hxSkills(e, s) {
  return e.map((e, a) => `<li class="hx-sk${s ? " on" : ""}" data-k="${a}"><span class="hx-ck" aria-hidden="true">${ic("check")}</span>${esc(skName(e))}</li>`).join("");
}

function hxHTML() {
  const e = hxLang(), s = HX_LANGS.find(s => s[0] === e), a = liveData().o, i = !RM();
  return `<section class="hx" aria-labelledby="hxH"><div class="lp2-in hx-in">
    <div class="hx-copy"><h1 id="hxH" class="hx-h">${te("final_t")}</h1><p class="hx-sub">${te("hx_sub")}</p>
      <div class="hx-ctas"><button class="btn lg hx-go" data-act="start">${te(hasPassport() ? "pub_open" : "lp_go")} ${ic("arrow")}</button><button class="linkbtn hx-inst" data-act="pub" data-p="institutions">${te("ib_k")} ${ic("arrow")}</button></div>
      <p class="hx-meta">${ic("lock")}<span>${te("lp_private")}</span></p></div>
    <div class="hx-stage hx-card${i ? " anim" : " still"}" id="hx">
      <article class="hx-story">
        <p class="hx-who">${ic("pen")}<span>${te("lv_c1")}</span></p>
        <p class="hx-text" id="hxText" dir="${s[2]}" lang="${s[3]}">${hxMarked(e)}</p>
        <div class="hx-own-wrap" hidden><label class="sr" for="hxT">${te("try_l")}</label><textarea id="hxT" class="hx-ta" rows="4" maxlength="900" dir="auto" placeholder="${te("try_ph")}"></textarea></div>
        <div class="hx-tools"><button class="chip hx-own" data-act="hx-own">${ic("pen")}${te("h_try")}</button><button class="linkbtn dim hx-back" data-act="hx-back" hidden>${te("lp_try")}</button></div>
      </article>
      <article class="hx-pass" aria-live="polite">
        <header class="hx-ph"><span class="hx-av" aria-hidden="true">${esc(initials(t("lv_name")))}</span><div><b>${te("lv_name")}</b><small>${te("lv_pass")}</small></div><span class="hx-seal" aria-hidden="true">${mark()}</span></header>
        <p class="hx-note dim" ${i ? "" : "hidden"}>${te("live_0")}</p>
        <ul class="hx-skills" id="hxSk">${hxSkills(LIVE_SK, !i)}</ul>
        <div id="hxRole">${hxRole(a, hxFit(a), !i)}</div>
        <div class="hx-save" hidden><button class="btn hx-go" data-act="try-save">${ic("pass")}${te("try_save")}</button></div>
      </article>
    </div>
  </div></section>`;
}

function hxLink(e) {
  const s = $("#hx");
  s && s.addEventListener("pointerover", e => {
    const a = e.target.closest("[data-k]");
    $$("[data-k].lit", s).forEach(e => e.classList.remove("lit")), a && $$(`[data-k="${a.dataset.k}"]`, s).forEach(e => e.classList.add("lit"));
  }), s && s.addEventListener("pointerleave", () => $$("[data-k].lit", s).forEach(e => e.classList.remove("lit")));
}

async function hxPlay() {
  const e = $("#hx");
  if (!e || HX.own) return;
  const s = ++HX.t, a = () => s !== HX.t || !e.isConnected || HX.own;
  if (RM()) return e.classList.add("still"), $$(".hx-t", e).forEach(e => e.classList.add("on")), $$(".hx-sk", e).forEach(e => e.classList.add("on")), void ($("#hxRole .hx-role", e) && $("#hxRole .hx-role", e).classList.add("on"));
  const i = $$(".hx-t", e), o = $$(".hx-sk", e), r = !HX.done;
  r && ($(".hx-note", e).hidden = !1);
  for (let s = 0; s < i.length; s++) {
    if (await sleep(s ? 380 : 260), a()) return;
    i[s].classList.add("on");
    const l = o[+i[s].dataset.k];
    if (!l) continue;
    if (r) {
      await sleep(260);
      if (a()) return;
      hxFly(i[s], l), s === 0 && ($(".hx-note", e).hidden = !0);
    } else l.classList.add("pulse"), setTimeout(() => l.classList.remove("pulse"), 700);
  }
  if (await sleep(r ? 640 : 300), a()) return;
  const l = $("#hxRole .hx-role", e);
  l && !l.classList.contains("on") && (l.classList.add("on"), hxCount($(".hx-fit b", l))), HX.done = !0, hxQueue();
}

function hxFly(e, s) {
  const a = e.getBoundingClientRect(), i = s.getBoundingClientRect(), o = s.cloneNode(!0);
  o.classList.add("on", "hx-fly"), o.style.cssText = `left:${a.left}px;top:${a.top}px;width:${i.width}px`, document.body.appendChild(o);
  const r = i.left - a.left, l = i.top - a.top;
  o.animate([ {
    transform: "translate(0,0) scale(.9)",
    opacity: 0
  }, {
    transform: `translate(${.5 * r}px,${.5 * l - 28}px) scale(1.04)`,
    opacity: 1,
    offset: .55
  }, {
    transform: `translate(${r}px,${l}px) scale(1)`,
    opacity: 1
  } ], {
    duration: 620,
    easing: "cubic-bezier(.22,1,.36,1)"
  }).onfinish = () => {
    o.remove(), s.classList.add("on"), SND && SND.play && SND.play("tick");
  };
}

function hxCount(e) {
  if (!e) return;
  const s = +(e.textContent.replace(/\D/g, "") || 0);
  let a = 0;
  const i = () => {
    e.textContent = nfmt(a), a < s && (a++, setTimeout(i, 140));
  };
  i();
}

function hxQueue() {
  return;
  clearTimeout(HX.cyc), RM() || HX.own || (HX.cyc = setTimeout(() => {
    const e = $("#hx");
    if (!e || !e.isConnected || HX.own) return;
    if (HX.hold || document.hidden) return hxQueue();
    const s = HX_LANGS.findIndex(e => e[0] === hxLang());
    hxSet(HX_LANGS[(s + 1) % HX_LANGS.length][0]);
  }, 5200));
}

function hxSet(e) {
  const s = $("#hx");
  if (!s) return;
  HX.l = e;
  const a = HX_LANGS.find(s => s[0] === e), i = $("#hxText", s);
  $$(".hx-lp", s).forEach(s => {
    const a = s.dataset.l === e;
    s.classList.toggle("on", a), s.setAttribute("aria-pressed", a);
  }), i.classList.add("swap"), setTimeout(() => {
    i.innerHTML = hxMarked(e), i.dir = a[2], i.lang = a[3], i.classList.remove("swap"), hxPlay();
  }, RM() ? 0 : 220);
}

function hxOwn(e) {
  const s = $("#hx");
  if (!s) return;
  HX.own = e, HX.t++, clearTimeout(HX.cyc), s.classList.toggle("own", e), $(".hx-own-wrap", s).hidden = !e, $("#hxText", s).hidden = e, $(".hx-own", s).hidden = e, $(".hx-back", s).hidden = !e, $(".hx-who", s).hidden = e;
  const a = $("#hxT", s);
  e ? (a.value = ui.tryText || "", a.focus(), hxRead()) : (ui.tryText = "", $(".hx-save", s).hidden = !0, $(".hx-note", s).hidden = !0, $("#hxSk", s).innerHTML = hxSkills(LIVE_SK, !0), $("#hxRole", s).innerHTML = hxRole(liveData().o, hxFit(liveData().o), !0), hxQueue());
}

let HX_T = 0;

function hxRead() {
  const e = $("#hx"), s = $("#hxT");
  if (!e || !s) return;
  const a = s.value.trim();
  ui.tryText = s.value;
  const i = a ? tryRead(a) : {
    found: [],
    roles: []
  }, o = $(".hx-note", e);
  o.hidden = !!i.found.length, o.textContent = t(a ? "try_none" : "live_0"), $("#hxSk", e).innerHTML = i.found.slice(0, 6).map((e, s) => `<li class="hx-sk on" style="--j:${s}"><span class="hx-ck" aria-hidden="true">${ic(e.rare ? "star" : "check")}</span>${esc(skName(e.id))}</li>`).join("");
  const r = i.roles[0];
  $("#hxRole", e).innerHTML = r ? hxRole(r.o, {
    k: r.o.req.filter(([e]) => i.have.has(e)).length,
    n: r.o.req.length
  }, !0) : "", $(".hx-save", e).hidden = !i.found.length;
}

function hxMount() {
  const e = $("#hx");
  if (!e) return;
  HX.own = !1, HX.done = !1, hxLink(), e.addEventListener("focusin", () => HX.hold = !0), e.addEventListener("focusout", () => HX.hold = !1), e.addEventListener("pointerenter", () => HX.hold = !0), e.addEventListener("pointerleave", () => HX.hold = !1);
  const s = $("#hxT");
  s && s.addEventListener("input", () => {
    clearTimeout(HX_T), HX_T = setTimeout(hxRead, 160);
  });
  const a = new IntersectionObserver(s => {
    s[0].isIntersecting && (a.disconnect(), hxPlay());
  });
  a.observe(e);
}

const WF = [ [ "book", [ "event", "leadership", "teamwork" ] ], [ "building", [ "customer_service", "cash", "inventory" ] ], [ "spark", [ "content", "social_media" ] ], [ "tool", [ "customer_service", "problem_solving", "leadership" ] ], [ "heart", [ "cash", "problem_solving", "leadership" ] ] ];

function wfCard(e) {
  const [s, a] = WF[e];
  return `<div class="wf-who"><span class="wf-ic" aria-hidden="true">${ic(s)}</span><b>${te("wf_w" + (e + 1))}</b></div><p class="wf-q">${te("wf_s" + (e + 1))}</p><ul class="wf-sk" aria-label="${te("pp_skills")}">${a.map(e => `<li>${ic("check")}${esc(skName(e))}</li>`).join("")}</ul>`;
}

function wfHTML() {
  const e = ui.wf || 0;
  return `<section class="lp2-sec wf" id="for-you" aria-labelledby="wfH"><div class="lp2-in wf-in"><div class="sk-head rv"><h2 id="wfH">${te("wf_h")}</h2></div>
    <div class="wf-tabs" role="tablist" aria-label="${te("wf_h")}">${WF.map(([s], a) => `<button role="tab" class="wf-tab" data-act="wf-pick" data-i="${a}" aria-selected="${a === e}"><span aria-hidden="true">${ic(s)}</span>${te("wf_w" + (a + 1))}</button>`).join("")}</div>
    <div class="wf-card" id="wfCard" role="tabpanel" aria-live="polite">${wfCard(e)}</div>
    <p class="wf-guide-l">${ic("users")}<span>${te("wf_gt")}</span><button class="linkbtn" data-act="pub" data-p="institutions">${te("aud_i_cta")} ${ic("arrow")}</button></p>
  </div></section>`;
}

function stHTML() {
  return `<section class="lp2-sec st" aria-labelledby="stH"><div class="lp2-in"><div class="sk-head rv"><h2 id="stH">${te("st_h")}</h2></div>
    <ol class="st-row">${[ [ "pen", 1 ], [ "check", 2 ], [ "target", 3 ] ].map(([e, s]) => `<li class="st-c"><span class="st-n num" aria-hidden="true">${nfmt(s)}</span><span class="st-i" aria-hidden="true">${ic(e)}</span><h3>${te("st" + s + "t")}</h3><p>${te("st" + s + "d")}</p></li>`).join("")}</ol></div></section>`;
}

function pvHTML() {
  return `<section class="lp2-sec pv" aria-labelledby="pvH"><div class="lp2-in pv-in"><span class="pv-i" aria-hidden="true">${ic("shield")}</span><h2 id="pvH">${te("lp_private")}</h2>
    <ul class="pv-l">${[ [ "lock", "tr1" ], [ "file", "tr2" ], [ "users", "tr3" ] ].map(([e, s]) => `<li><span aria-hidden="true">${ic(e)}</span>${te(s)}</li>`).join("")}</ul></div></section>`;
}

function vPubHome() {
  const a = `<section class="lp2-sec sk-trust" id="trust-h"><div class="lp2-in"><div class="sk-head rv"><h2>${te("ht_h")}</h2><p class="lp2-sub">${te("ht_sub")}</p></div>
      <div class="ht rv-g"><ol class="ht-states">${[ [ "sugg", "ps_s1" ], [ "conf", "ps_s2" ], [ "proven", "ps_s3" ], [ "ver", "ps_s4" ] ].map(([e, s]) => `<li>${stateTag(e)}<span>${te(s)}</span></li>`).join("")}</ol>
        <ul class="ht-priv">${[ [ "lock", "tr1" ], [ "file", "tr2" ], [ "users", "tr3" ] ].map(([e, s]) => `<li><span class="tr-i">${ic(e)}</span><span>${te(s)}</span></li>`).join("")}<li class="ht-more"><button class="linkbtn" data-act="pub" data-p="trust">${te("ht_more")} ${ic("arrow")}</button></li></ul></div></div></section>`, i = `<section class="lp2-sec sk-inst" id="inst"><div class="lp2-in split2">
      <div class="lp2-copy"><h2 class="ib-h2">${te("ib_h")}</h2><p class="lp2-sub">${te("ib_d")}</p>
        <div class="lp2-ctas"><button class="btn lg" data-act="pub" data-p="institutions">${te("aud_i_cta")} ${ic("arrow")}</button><button class="btn ghost lg" data-act="portal" data-p="uni" data-sample="1">${ic("eye")}${te("ip_cta")}</button></div></div>
      <div class="win uni-prev rv" aria-hidden="true"><div class="win-bar"><span class="win-t">${te("u_console")} · ${te("u_week")}</span><span class="pill">${te("u_demo")}</span></div>
        <div class="win-body"><article class="attn"><div class="attn-h"><span class="attn-i">${ic("target")}</span><div><h3>${te("ua1t")}</h3></div></div><dl class="attn-d"><div><dt>${te("od_next")}</dt><dd>${te("ua1a")}</dd></div></dl></article>
          <div class="funnel sm">${UNI.funnel.slice(1).map((e, s) => `<div class="fn"><span>${te("u_f" + (s + 1))}</span><span class="tr"><i data-w="${e / UNI.funnel[1] * 100}"></i></span><b class="num">${nfmt(e)}</b></div>`).join("")}</div></div></div>
    </div></section>`, o = `<section class="lp2-sec sk-faq" id="faq"><div class="lp2-in faq-wrap"><div class="sk-head rv"><h2>${te("fq_h")}</h2></div>${faqList([ "fq1", "fq2", "fq3", "fq9" ])}</div></section>`, r = `<section class="sk-final"><div class="lp2-in sk-final-in"><span class="sk-final-mark" aria-hidden="true">${mark(1)}</span><h2>${te("fin4_t")}</h2><p>${te("fin_d")}</p><button class="btn lg sk-gold" data-act="start">${te(hasPassport() ? "pub_open" : "pub_start")} ${ic("arrow")}</button></div></section>`, l = `<section class="lp2-sec sk-problem" id="problem"><div class="lp2-in"><div class="sk-head rv"><h2>${te("pb_h")}</h2><p class="lp2-sub">${te("pb_sub")}</p></div>${problemHTML(0)}</div></section>`, p = `<section class="lp2-sec sec-ink sk-impact" id="impact"><div class="lp2-in">${impactHTML()}</div></section>`;
  return pubPage("home", hxHTML() + wfHTML() + stHTML() + pvHTML() + o + r);
}

function skMount() {
  const e = $(".pub-nav"), s = $(".sk-route");
  if (!e) return;
  const a = () => {
    if (!e.isConnected) return removeEventListener("scroll", a);
    if (e.classList.toggle("scrolled", scrollY > 24), s && s.isConnected) {
      const e = s.getBoundingClientRect(), a = innerHeight * .62, i = Math.min(1, Math.max(0, (a - e.top) / e.height));
      s.style.setProperty("--p", i.toFixed(3)), $$(".engine > li", s).forEach(e => e.classList.toggle("on", e.getBoundingClientRect().top < a));
      s.classList.toggle("done", i > .97);
    }
  };
  removeEventListener("scroll", window.__skS || a), window.__skS = a, addEventListener("scroll", a, {
    passive: !0
  }), a();
}

function vVision() {
  return pubPage("vision", `<section class="hero2 narrow vis-hero"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_vision")}</p><h1 class="lp2-h">${te("vi_h1")}</h1><p class="lp2-sub">${te("vi_sub")}</p></div>\n      <figure class="why-f rv"><blockquote class="why">${esc(qt(t("vi_why")))}</blockquote><figcaption>— ${te("vi_why_by")}</figcaption></figure><p class="vi-close rv">${te("vi_close")}</p></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("en_k"), te("en_h"))}${engineHTML(!0)}</div></section>\n    <section class="lp2-sec"><div class="lp2-in">${secHead(te("df_k"), te("df_h"))}<ol class="diff rv-g">${[ 1, 2, 3, 4, 5 ].map(e => `<li><span class="num">0${nfmt(e)}</span><div><p class="df-not">${te("df" + e + "n")}</p><h3>${te("df" + e + "y")}</h3></div></li>`).join("")}</ol></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in split2">\n      <div class="lp2-copy">${secHead(te("ec_k"), te("ec_h"), te("ec_sub")).replace('class="sec-head rv"', 'class="sec-head"')}</div>\n      <div class="eco rv" aria-label="${te("ec_h")}"><span class="eco-c">${mark()}<b>SKILMA</b></span>${[ [ "users", "ec_s" ], [ "uni", "ec_u" ], [ "brief", "ec_e" ], [ "book", "ec_t" ], [ "star", "ec_sp" ] ].map(([e, s], a) => {
    const i = (72 * a - 90) * Math.PI / 180;
    return `<span class="eco-n" style="left:${(50 + 39 * Math.cos(i)).toFixed(1)}%;top:${(50 + 39 * Math.sin(i)).toFixed(1)}%;--i:${a}"><i>${ic(e)}</i><b>${te(s)}</b></span>`;
  }).join("")}<svg class="eco-r" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="39"/></svg></div>\n    </div></section>\n    <section class="lp2-sec"><div class="lp2-in">${secHead(te("rm_k"), te("rm_h"), te("rm_sub"))}${roadmapHTML(!0)}</div></section>\n    <section class="lp2-sec sec-ink" id="impact"><div class="lp2-in">${impactHTML()}</div></section>`);
}

function vAccess() {
  const e = S.access.find(e => e.mine), s = `<form data-form="access" novalidate>\n      <div class="f2"><div class="field"><label class="flabel" for="acN">${te("pf_name")}</label><input id="acN" class="inp" autocomplete="name"></div>\n        <div class="field"><label class="flabel" for="acC">${te("ac_place")}</label><input id="acC" class="inp" placeholder="${te("ac_place_ph")}"></div></div>\n      <div class="f2"><div class="field"><label class="flabel" for="acS">${te("ac_school")}</label><input id="acS" class="inp"></div>\n        <div class="field"><label class="flabel" for="acE">${te("ac_contact")}</label><input id="acE" class="inp" dir="ltr" placeholder="${te("ph_contact")}"></div></div>\n      <fieldset class="field"><legend class="flabel">${te("ac_why")}</legend><div class="chips-wrap" style="justify-content:flex-start">${[ 1, 2, 3, 4 ].map(e => `<label class="chk"><input type="checkbox" name="acW" value="${e}"><span>${te("ac_w" + e)}</span></label>`).join("")}</div></fieldset>\n      <p class="f-err" id="acErr" role="alert"></p><button class="btn lg block" type="submit">${ic("send")}${te("ac_send")}</button><p class="dim f-note">${smallIc("lock")} ${te("ac_note")}</p></form>`;
  return pubPage("access", `<section class="lp2-sec ex-sec ac-sec"><div class="lp2-in pilot">\n      <div class="lp2-copy"><p class="lp2-kicker">${te("im_k")}</p><h1 class="lp2-h">${te("ac_h1")}</h1><p class="lp2-sub">${te("ac_sub")}</p>\n        <ol class="pilot-steps">${[ 1, 2, 3 ].map(e => `<li><span class="ch-n num">${nfmt(e)}</span><span>${te("ac_s" + e)}</span></li>`).join("")}</ol></div>\n      <div class="panel pilot-f"><h2 class="pf-h">${te("ac_tab1")}</h2>${e ? `<div class="done-state"><span class="ds-i">${ic("check")}</span><h3>${te("ac_ok_t")}</h3><p class="mute">${te("ac_ok_d")}</p></div>` : s}</div>\n    </div></section>`);
}

const faqList = e => `<div class="faq rv-g">${e.map(e => `<details class="fq"><summary><span>${te(e)}</span>${ic("plus")}</summary><p>${te(e + "a")}</p></details>`).join("")}</div>`;

function vPubHow() {
  const e = filmData(), s = e.o, a = [ [ "hw1", `<div class="hw-vis"><p class="fc-text sm">${markAll(e.text, e.found.map(e => e.term)).replace(/class="fm"/g, 'class="fm on"')}</p><div class="fc-chips">${e.found.slice(0, 8).map(e => stateTag("conf", skName(e.id))).join("")}</div></div>` ], [ "hw2", `<div class="hw-vis"><div class="fc-opp in"><span class="logo">${esc(s.ini)}</span><div style="min-width:0"><b>${esc(tx(s.title))}</b><small>${bdi(s.org)} · ${esc(tx(C[s.city]))}</small></div><b class="fc-fit num">${nfmt(e.have)}/${nfmt(s.req.length)}</b></div><div class="fc-ladder go"><span class="seg have" style="--f:${e.have}">${numLabel("lg_have", e.have)}</span><span class="seg gap" style="--f:${e.miss.length}">${numLabel("lg_gap", e.miss.length)}</span></div></div>` ], [ "hw3", `<div class="hw-vis"><div class="hw-gaps">${e.miss.map(e => `<div class="gap-row"><span style="min-width:0">${stateTag("miss", skName(e))}<br><small>${esc(tx(RES[e] || {
    en: ""
  }))}</small></span><span class="dim num">${te("od_hours", {
    h: nfmt((RES[e] || {
      h: 4
    }).h)
  })}</span></div>`).join("")}</div></div>` ], [ "hw4", `<div class="hw-vis"><div class="fc-path">${[ 1, 2, 3, 4, 5, 6, 7 ].map(e => `<i class="fd on ${6 === e ? "prove" : ""}">${ic(6 === e ? "file" : "check")}</i>`).join("")}</div><ul class="hw-days">${(DRILL[e.gap] && DRILL[e.gap].days || []).slice(0, 3).map((e, s) => `<li><b class="num">${te("day_n", {
    n: nfmt(s + 1)
  })}</b><span>${esc(tx(e))}</span></li>`).join("")}<li><b class="num">${te("day_n", {
    n: nfmt(30)
  })}</b><span>${esc(tx(s.project))}</span></li></ul></div>` ], [ "hw5", `<div class="hw-vis"><div class="fc-ready">${ring(100, 96, 8, "", nfmt(11) + "/" + nfmt(11), !0)}<div class="hw-proofs">${stateTag("proven", t("k_portfolio"))}${stateTag("conf", t("rd_iv"))}${stateTag("ver", t("st_ver"))}</div></div></div>` ] ];
  return pubPage("how", `<section class="hero2 narrow"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_how")}</p><h1 class="lp2-h">${te("hw_h1")}</h1><p class="lp2-sub">${te("hw_sub")}</p></div></div></section>\n    <section class="lp2-sec"><div class="lp2-in"><ol class="hw">${a.map(([e, s], a) => `<li class="hw-s rv"><div class="hw-t"><span class="ch-n num">${nfmt(a + 1)}</span><p class="eyebrow">${te("en" + (a + 1))}</p><h2>${te(e + "t")}</h2><p class="mute">${te(e + "d")}</p><ul class="hw-pts">${[ 1, 2 ].map(s => `<li>${ic("check")}<span>${te(e + "p" + s)}</span></li>`).join("")}</ul></div>${s}</li>`).join("")}</ol></div></section>\n    <section class="lp2-sec sec-sunk" id="method"><div class="lp2-in">${secHead(te("mt_k"), te("mt_h"), te("mt_sub"))}\n      <div class="mt-grid rv-g">\n        <article class="mt-c"><p class="eyebrow">${te("mt_fit")}</p><div class="mt-f"><span class="mt-x"><b>${te("mt_have")}</b></span><span>/</span><span class="mt-x"><b>${te("mt_req")}</b></span></div><p class="mute">${te("mt_fit_d")}</p></article>\n        <article class="mt-c"><p class="eyebrow">${te("mt_ready")}</p><div class="mt-f"><span class="mt-x"><b>${te("mt_conf")}</b></span><span>+</span><span class="mt-x"><b>${te("mt_proof")}</b></span><span>+</span><span class="mt-x"><b>${te("mt_iv")}</b></span><span>+</span><span class="mt-x"><b>${te("mt_pf")}</b></span></div><p class="mute">${te("mt_ready_d")}</p></article>\n        <article class="mt-c"><p class="eyebrow">${te("mt_limit")}</p><p class="mt-big">${te("mt_limit_h")}</p><p class="mute">${te("mt_limit_d")}</p></article>\n      </div></div></section>\n    <section class="lp2-sec"><div class="lp2-in faq-wrap">${secHead(te("fq_k"), te("fq_h"))}${faqList([ "fq1", "fq2", "fq3", "fq4", "fq5", "fq6", "fq7" ])}</div></section>\n    <section class="lp2-final"><div class="lp2-in lp2-final-in"><div><h2>${te("fin_t")}</h2><p>${te("fin_d")}</p></div><button class="btn lg" data-act="start">${te("pub_start")} ${ic("arrow")}</button></div></section>`);
}

function vPubInst() {
  const e = S.pilots.find(e => e.mine);
  return pubPage("institutions", `<section class="hero2"><div class="lp2-in hero2-in">\n      <div class="lp2-copy"><p class="lp2-kicker">${te("pub_inst")}</p><h1 class="lp2-h">${te("ip_h1")}</h1><p class="lp2-sub">${te("ip_sub")}</p>\n        <div class="lp2-ctas"><button class="btn lg" data-act="pilot">${te("ip_pilot_t")} ${ic("arrow")}</button><button class="btn ghost lg" data-act="portal" data-p="uni" data-sample="1">${ic("eye")}${te("ip_cta")}</button></div></div>\n      <div class="win uni-prev" aria-hidden="true"><div class="win-bar"><span class="win-t">${te("u_console")} · ${te("u_week")}</span><span class="pill">${te("u_demo")}</span></div>\n        <div class="win-body"><article class="attn"><div class="attn-h"><span class="attn-i">${ic("target")}</span><div><h3>${te("ua1t")}</h3></div></div><dl class="attn-d"><div><dt>${te("u_evid")}</dt><dd>${te("ua1e")}</dd></div><div><dt>${te("od_next")}</dt><dd>${te("ua1a")}</dd></div></dl></article>\n          <div class="funnel sm">${UNI.funnel.slice(1).map((e, s) => `<div class="fn"><span>${te("u_f" + (s + 1))}</span><span class="tr"><i data-w="${e / UNI.funnel[1] * 100}"></i></span><b class="num">${nfmt(e)}</b></div>`).join("")}</div></div></div>\n    </div></section>\n    <section class="lp2-sec"><div class="lp2-in">${secHead(te("ip_k"), te("ip_h2"))}<ul class="feat4 rv-g">${[ [ "ip_f1t", "ip_f1d", "target" ], [ "ip_f2t", "ip_f2d", "shield" ], [ "ip_f3t", "ip_f3d", "lock" ], [ "ip_f4t", "ip_f4d", "download" ] ].map(([e, s, a]) => `<li><span class="tr-i">${ic(a)}</span><h3>${te(e)}</h3><p class="mute">${te(s)}</p></li>`).join("")}</ul></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("ip_see_k"), te("ip_see_h"))}\n      <div class="see2 rv-g"><article class="see yes"><h3>${ic("eye")}${te("ip_see_y")}</h3><ul>${[ 1, 2, 3, 4 ].map(e => `<li>${ic("check")}<span>${te("ip_y" + e)}</span></li>`).join("")}</ul></article>\n        <article class="see no"><h3>${ic("lock")}${te("ip_see_n")}</h3><ul>${[ 1, 2, 3 ].map(e => `<li>${ic("x")}<span>${te("ip_n" + e)}</span></li>`).join("")}</ul></article></div></div></section>\n    <section class="lp2-sec" id="pilot"><div class="lp2-in pilot">\n      <div class="lp2-copy"><p class="lp2-kicker">${te("ip_pilot_k")}</p><h2>${te("ip_pilot_t")}</h2><p class="lp2-sub">${te("ip_pilot_d")}</p>\n        <ol class="pilot-steps">${[ 1, 2, 3 ].map(e => `<li><span class="ch-n num">${nfmt(e)}</span><span>${te("ip_ps" + e)}</span></li>`).join("")}</ol></div>\n      <div class="panel pilot-f">${e ? pilotDone(e) : `<form data-form="pilot" novalidate>\n        <div class="f2"><div class="field"><label class="flabel" for="plN">${te("pf_name")}</label><input id="plN" class="inp" autocomplete="name" required></div>\n          <div class="field"><label class="flabel" for="plR">${te("pf_role")}</label><input id="plR" class="inp" autocomplete="organization-title"></div></div>\n        <div class="field"><label class="flabel" for="plI">${te("pf_inst")}</label><input id="plI" class="inp" autocomplete="organization" required></div>\n        <div class="f2"><div class="field"><label class="flabel" for="plE">${te("pf_email")}</label><input id="plE" class="inp" type="email" autocomplete="email" dir="ltr" required></div>\n          <div class="field"><label class="flabel" for="plC">${te("pf_city")}</label><select id="plC" class="inp">${Object.keys(C).filter(e => "remote" !== e).map(e => `<option value="${e}">${esc(tx(C[e]))}</option>`).join("")}</select></div></div>\n        <div class="field"><span class="flabel" id="plSL">${te("pf_size")}</span><div class="seg" role="group" aria-labelledby="plSL">${[ "<1k", "1–5k", "5k+" ].map((e, s) => `<button type="button" data-act="pf-size" data-v="${s}" aria-pressed="${(ui.pfSize || 0) === s}">${esc(e)}</button>`).join("")}</div></div>\n        <p class="f-err" id="plErr" role="alert"></p>\n        <button class="btn lg block" type="submit">${ic("send")}${te("pf_send")}</button><p class="dim f-note">${smallIc("lock")} ${te("pf_note")}</p></form>`}</div>\n    </div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in faq-wrap">${secHead(te("fq_k"), te("fi_h"))}${faqList([ "fi1", "fi2", "fi3", "fi4" ])}</div></section>`);
}

const pilotDone = e => `<div class="done-state"><span class="ds-i">${ic("check")}</span><h3>${te("pf_ok_t")}</h3><p class="mute">${te("pf_ok_d", {
  inst: e.inst,
  email: e.email
})}</p><button class="btn ghost" data-act="portal" data-p="uni">${te("ip_cta")}</button></div>`;

function vPubTrust() {
  return pubPage("trust", `<section class="hero2 narrow"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_trust")}</p><h1 class="lp2-h">${te("tp_h1")}</h1><p class="lp2-sub">${te("tp_sub")}</p></div></div></section>\n    <section class="lp2-sec"><div class="lp2-in"><ol class="trust6 rv-g">${[ 1, 2, 3, 4, 5, 6 ].map(e => `<li><span class="num t6n">${nfmt(e)}</span><div><h3>${te("tp" + e + "t")}</h3><p class="mute">${te("tp" + e + "d")}</p></div></li>`).join("")}</ol></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("ts_k"), te("ts_h"))}\n      <div class="tbl-wrap panel rv"><table class="tbl stack"><thead><tr><th scope="col">${te("ts_data")}</th><th scope="col">${te("ts_who")}</th><th scope="col">${te("ts_why")}</th></tr></thead><tbody>\n      ${[ 1, 2, 3, 4 ].map(e => `<tr><th scope="row">${te("ts_r" + e)}</th><td data-l="${te("ts_who")}">${te("ts_w" + e)}</td><td class="mute" data-l="${te("ts_why")}">${te("ts_y" + e)}</td></tr>`).join("")}</tbody></table></div>\n</div></section>`);
}

function vSignin() {
  if (PUBLIC) {
    const e = hasPassport();
    ui.siSent;
    return pubPage("signin", `<section class="signin"><div class="lp2-in si-grid">\n    <div class="si-card"><div class="si-h"><h1>${te("si_h1")}</h1><p class="mute">${te("si_sub_pub")}</p></div>\n      \n      \n      <div class="si-list">${e ? `<button class="si-c" data-act="continue"><span class="si-i">${avatar(initials(S.profile.name))}</span><span class="si-t"><b>${te("si_cont", {
      name: S.profile.name
    })}</b><small>${te("si_cont_d")}</small></span>${ic("arrow")}</button>` : ""}\n        <button class="si-c" data-act="demo-student"><span class="si-i">${ic("pass")}</span><span class="si-t"><b>${te("si_ex_t")}</b><small>${te("si_demo_d")}</small></span>${ic("arrow")}</button></div>\n      <div id="siConfirm" aria-live="polite"></div>\n      <p class="si-new">${te("si_newq")} <button class="linkbtn" data-act="start">${te("pub_start")}</button></p></div>\n    <div class="si-side"><div class="si-quote">${mark()}<p>${te("si_side")}</p></div>\n      <p class="dim">${te("si_other_p")}</p><div class="si-mini"><button class="lnk" data-act="portal" data-p="uni">${ic("uni")}${te("ft_uni_in")}</button></div></div>\n  </div></section>`);
  return;
  }
  const e = hasPassport(), s = ui.siSent;
  return pubPage("signin", `<section class="signin"><div class="lp2-in si-grid">\n    <div class="si-card"><div class="si-h"><h1>${te("si_h1")}</h1><p class="mute">${te("si_sub")}</p></div>\n      ${s ? `<div class="done-state"><span class="ds-i">${ic("mail")}</span><h3>${te("si_sent_t")}</h3><p class="mute">${te("si_sent_d", {
    email: s
  })}</p><button class="btn lg block" data-act="si-link">${ic("link")}${te("si_open")}</button><button class="linkbtn" data-act="si-back">${te("si_other")}</button></div>` : `<form data-form="si" novalidate><label class="flabel" for="siE">${te("si_id")}</label><input id="siE" class="inp" type="text" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false" dir="ltr" placeholder="${te("si_ph")}"><p class="f-err" id="siErr" role="alert"></p>\n        <button class="btn lg block" type="submit">${ic("mail")}${te("si_link")}</button></form>\n      <p class="dim f-note">${smallIc("lock")} ${te("si_nopass")}</p>`}\n      <div class="or"><span>${te("si_or")}</span></div>\n      <div class="si-list">${e ? `<button class="si-c" data-act="continue"><span class="si-i">${avatar(initials(S.profile.name))}</span><span class="si-t"><b>${te("si_cont", {
    name: S.profile.name
  })}</b><small>${te("si_cont_d")}</small></span>${ic("arrow")}</button>` : ""}\n        <button class="si-c" data-act="demo-student"><span class="si-i">${ic("pass")}</span><span class="si-t"><b>${te("si_demo_t")}</b><small>${te("si_demo_d")}</small></span>${ic("arrow")}</button></div>\n      <div id="siConfirm" aria-live="polite"></div>\n      <p class="si-new">${te("si_newq")} <button class="linkbtn" data-act="start">${te("pub_start")}</button></p></div>\n    <div class="si-side"><div class="si-quote">${mark()}<p>${te("si_side")}</p></div>\n      <p class="dim">${te("si_other_p")}</p><div class="si-mini"><button class="lnk" data-act="portal" data-p="uni">${ic("uni")}${te("ft_uni_in")}</button><button class="lnk" data-act="portal" data-p="ops">${ic("activity")}${te("ft_team")}</button></div></div>\n  </div></section>`);
}

function demoState() {
  if (demoState.c && demoState.c.lang === L() && demoState.c.v === JSON.stringify(S.ops.skillOff)) return demoState.c.s;
  const e = Object.assign(blank(), {
    lang: S.lang,
    ops: S.ops
  }), s = ui.sel;
  return withState(e, () => buildDemo()), ui.sel = s, withState(e, () => {
    const e = opp("analyst");
    if (!e || !S.plan) return;
    const s = 864e5, a = Date.now() - 31 * s;
    for (let e = 1; e <= 30; e++) S.plan.done[e] || (S.plan.done[e] = {
      at: a + e * s,
      proof: ""
    });
    [ [ "powerbi", "ex_pf_pbi" ], [ "sql", "ex_pf_sql" ], [ "excel", "ex_pf_xl" ] ].forEach(([e, s]) => {
      SK[e] && !S.ops.skillOff[e] && addSkill(e, t(s), "plan");
    }), S.portfolio = [ {
      id: "pf1",
      goal: "analyst",
      title: tx(e.project),
      proof: t("ex_pf_proj"),
      at: Date.now() - s
    } ], S.ivBest[e.id] = 82, S.share.iv = !1, S.created = a - 2 * s, S.pno = "SK-204617";
  }), e.verify = {
    status: "verified",
    at: Date.now() - 1728e5
  }, [ "sales", "customer_service", "negotiation" ].forEach(s => {
    e.skills[s] && (e.skills[s].ver = !0);
  }), demoState.c = {
    lang: L(),
    v: JSON.stringify(S.ops.skillOff),
    s: e
  }, e;
}

function buildDemo() {
  const e = 864e5, s = Date.now() - 9 * e, a = "analyst";
  S.created = s, S.pno = null, S.profile = {
    name: t("demo_name"),
    field: "f_eco",
    year: "y_final",
    aim: "job",
    langs: [ "ar", "fr", "en" ]
  };
  const i = exText(), o = rulesDiscover(i);
  if (S.stories.push({
    id: uid(),
    text: i,
    at: s,
    type: "ty_family",
    skills: o.map(e => e.id)
  }), S.events.push({
    t: s,
    type: "story"
  }), o.forEach(e => {
    addSkill(e.id, e.evidence, "story"), S.skills[e.id].at = s, decide(e.id, !0);
  }), S.events.push({
    t: s + 6e5,
    type: "skills",
    n: confirmed().length
  }), S.log.push({
    t: s + 6e5,
    r: 0,
    g: a
  }), opp(a) && !S.ops.oppOff[a]) {
    applyGoal(a), S.events[S.events.length - 1].t = s + 9e5, S.log.pop(), S.log.push({
      t: s + 9e5,
      r: readiness(opp(a)),
      g: a
    });
    for (let i = 1; i <= 5; i++) S.plan.done[i] = {
      at: s + i * e,
      proof: ""
    }, S.log.push({
      t: s + i * e,
      r: readiness(opp(a)),
      g: a
    });
    S.log.sort((e, s) => e.t - s.t), S.demo = !0;
  } else S.demo = !0;
}

function loadDemoStudent() {
  const e = S.lang, s = {
    ops: S.ops,
    auth: S.auth,
    pilots: S.pilots,
    feedback: S.feedback,
    uni: S.uni,
    runs: S.runs,
    prefs: S.prefs,
    tours: S.tours,
    access: S.access
  };
  S = Object.assign(blank(), s), S.lang = e, buildDemo(), S.share = {
    pub: !0,
    uni: !0
  }, S.stage = "app", S.screen = "home", S.role = "student", ui.pubForce = !1, save();
}

function publicPassport(e, s) {
  return withState(e, () => {
    const e = confirmed(), s = S.goal && opp(S.goal);
    return `<article class="ppub" aria-label="${te("pp_title")} · ${esc(S.profile.name)}">\n      <header class="ppub-h"><div class="ppub-id"><span class="ppub-av">${esc(initials(S.profile.name))}</span><div><p class="eyebrow">${te("pp_cover")}</p><h1>${esc(S.profile.name)}</h1><p class="mute">${S.profile.field ? te(S.profile.field) : ""}${s ? ` · ${te("pub_aim", {
      x: tx(s.title)
    })}` : ""}</p></div></div>\n        <div class="ppub-meta"><span class="mono">${passNo()}</span>${"verified" === S.verify.status ? `<span class="stamp">${ic("shield")}${te("st_ver")}</span>` : ""}<div class="qr sm" aria-hidden="true">${qrCells()}</div></div></header>\n      <div class="ppub-stats"><div><b class="num">${nfmt(e.length)}</b><span>${te("pp_skills")}</span></div><div><b class="num">${nfmt(e.filter(e => "ver" === skillState(e)).length)}</b><span>${te("st_ver")}</span></div><div><b class="num">${nfmt(e.filter(e => "proven" === skillState(e)).length)}</b><span>${te("st_proof")}</span></div><div class="date"><b class="num">${esc(dateFmt(S.created))}</b><span>${te("pp_issued")}</span></div></div>\n      ${[ [ "ver", "pub_g_ver" ], [ "proven", "pub_g_proven" ], [ "conf", "pub_g_conf" ] ].map(([s, a]) => {
      const i = e.filter(e => skillState(e) === s);
      return i.length ? `<section class="ppub-g"><h2>${stateTag(s, "")}<span>${te(a)}</span></h2><div class="ppub-list">${i.map(e => {
        const s = S.skills[e], a = s.ev[s.ev.length - 1] || {}, i = "plan" === a.src || "note" === a.src;
        return `<div class="ppub-r"><b>${esc(skName(e))}</b>${a.text ? i ? `<p class="ppub-pf">${ic("file")}<span>${esc(a.text)}</span></p>` : `<blockquote>${esc(qt(a.text))}</blockquote>` : ""}<small class="dim">${te(i ? "pub_src_plan" : "pub_src_story")}${s.ver ? " · " + te("pub_ver_by") : ""}</small></div>`;
      }).join("")}</div></section>` : "";
    }).join("")}\n      ${(() => {
      const e = proofBlock(!0);
      return e ? `<section class="ppub-g ppub-pf">${e}</section>` : "";
    })()}\n      <footer class="ppub-f"><span>${brand()}</span><p class="dim">${te("pub_how_read")}</p><button class="btn ghost sm no-print" data-act="print">${ic("download")}${te("print_pdf")}</button></footer>\n    </article>`;
  });
}

function vExample() {
  return pubPage("example", `<section class="hero2 narrow"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_example")}</p><h1 class="lp2-h">${te("ex_h1")}</h1><p class="lp2-sub">${te("ex_sub")}</p></div></div></section>\n    <section class="lp2-sec ex-sec"><div class="lp2-in ex-in"><div class="ex-note">${ic("info")}<span>${te("ex_note")}</span></div>${publicPassport(demoState(), !0)}\n    <div class="ex-cta"><button class="btn lg" data-act="start">${te("ex_cta")} ${ic("arrow")}</button></div></div></section>`);
}

function vPublicPass() {
  const e = S.share.pub && hasPassport() && (!ui.pubParam || ui.pubParam === passNo());
  return pubPage("p", `<section class="lp2-sec ex-sec"><div class="lp2-in ex-in">${e ? publicPassport(S) : `<div class="empty-pg"><span class="ds-i">${ic("lock")}</span><h1>${te("pub_private_t")}</h1><p class="mute">${te("pub_private_d")}</p><button class="btn" data-act="pub" data-p="example">${te("pub_example")}</button></div>`}</div></section>`);
}

function v404() {
  return pubPage("404", `<section class="lp2-sec"><div class="lp2-in"><div class="empty-pg"><span class="nf">${mark()}</span><h1>${te("nf_t")}</h1><p class="mute">${te("nf_d")}</p><div class="lp2-ctas" style="justify-content:center"><button class="btn" data-act="pub" data-p="home">${te("nf_home")}</button><button class="btn ghost" data-act="palette">${ic("search")}${te("pal_open")}</button></div></div></div></section>`);
}

const PUB_VIEWS = {
  home: vPubHome,
  how: vPubHow,
  vision: vVision,
  access: vAccess,
  institutions: vPubInst,
  trust: vPubTrust,
  signin: vSignin,
  example: vExample,
  employers: vEmployers,
  partners: vPartners,
  changelog: vChangelog,
  brand: vBrand,
  p: vPublicPass,
  404: v404
};

function vPublic() {
  return (PUB_VIEWS[ui.pub || "home"] || v404)();
}

function tryRead(e) {
  const s = withState(Object.assign(blank(), {
    ops: S.ops
  }), () => rulesDiscover(e)), a = new Set(s.map(e => e.id)), fitWith = e => {
    const s = e.req.filter(([e]) => a.has(e)), i = s.filter(e => e[1]).length;
    return s.length ? s.length / e.req.length + i / 1e3 : 0;
  };
  return {
    found: s,
    roles: s.length ? liveOpps().map(e => ({
      o: e,
      p: fitWith(e)
    })).filter(e => e.p > 0).sort((e, s) => s.p - e.p).slice(0, 3) : [],
    have: a
  };
}

function tryOut() {
  const e = (ui.tryText || "").trim(), s = tryRead(e || exText());
  if (!s.found.length) return `<div class="try-empty"><p class="mute">${te("try_none")}</p></div>`;
  const a = s.roles[0], i = a ? a.o.req.filter(([e]) => !s.have.has(e)).map(e => e[0]) : [], o = i.reduce((e, s) => e + (RES[s] ? RES[s].h : 4), 0);
  return `<div class="try-res ${e ? "" : "is-ex"}">${e ? "" : `<p class="try-ex-l">${ic("user")}${te("try_ex_res")}</p>`}\n    <p class="try-n">${numLabel("try_found", s.found.length)}</p>\n    <div class="try-chips">${s.found.map((e, s) => `<span class="state s-conf" style="--j:${s}">${ic(e.rare ? "star" : "check")}${esc(skName(e.id))}</span>`).join("")}</div>\n    ${s.roles.length ? `<p class="eyebrow">${te("try_roles")}</p><div class="try-roles">${s.roles.map(({o: e, p: a}, i) => `<div class="try-role" style="--j:${i}"><span class="logo">${esc(e.ini)}</span><span class="tr-t"><b>${esc(tx(e.title))}</b><small>${bdi(e.org)} · ${esc(tx(C[e.city]))}</small></span><span class="tr-p num">${nfmt(e.req.filter(([e]) => s.have.has(e)).length)}/${nfmt(e.req.length)}</span><span class="tr-bar" aria-hidden="true"><i style="width:${Math.round(100 * e.req.filter(([e]) => s.have.has(e)).length / e.req.length)}%"></i></span></div>`).join("")}</div>` : ""}\n    ${a && i.length ? `<p class="try-miss">${ic("target")}<span>${te("try_miss", {
    role: tx(a.o.title),
    miss: list(i.map(skName)),
    h: nfmt(o)
  })}</span></p>` : ""}\n    <div class="try-cta"><button class="btn" data-act="try-save">${ic("pass")}${te("try_save")}</button><span class="dim">${te("h4_f1")}</span></div>\n  </div>`;
}

function tryHTML() {
  const e = exText();
  return `<section class="lp2-sec try-sec" id="try"><div class="lp2-in"><div class="sk-head rv"><p class="sk-note">${ic("bolt")}${te("try_k")}</p><h2>${te("try_h")}</h2><p class="lp2-sub">${te("try_sub")}</p></div>\n    <div class="try rv"><div class="try-in"><label class="flabel" for="tryT">${te("try_l")}</label>\n        <textarea id="tryT" class="inp" rows="7" maxlength="900" placeholder="${te("try_ph")}" spellcheck="true">${esc(ui.tryText || "")}</textarea>\n        <div class="try-tools"><button class="chip" data-act="try-ex">${ic("user")}${te("try_ex")}</button>${starters().slice(0, 2).map((e, s) => `<button class="chip" data-act="try-st" data-i="${s}">${ic("plus")}${esc(e.trim())}</button>`).join("")}<button class="linkbtn dim try-clear" data-act="try-clear" ${ui.tryText ? "" : "hidden"}>${te("try_clear")}</button></div>\n        <p class="dim try-local">${smallIc("lock")} ${te("try_local")}</p></div>\n      <div class="try-out" id="tryOut" aria-live="polite">${tryOut()}</div></div>\n    <span hidden data-ex="${esc(e)}"></span></div></section>`;
}

let TRY_T = 0;

function tryMount() {
  const e = $("#tryT");
  e && e.addEventListener("input", () => {
    ui.tryText = e.value, clearTimeout(TRY_T), TRY_T = setTimeout(tryRefresh, 160);
    const s = $(".try-clear");
    s && (s.hidden = !e.value);
  });
}

function tryRefresh() {
  const e = $("#tryOut");
  e && (e.innerHTML = tryOut(), e.classList.remove("fresh"), e.offsetWidth, e.classList.add("fresh"));
}

const EMP_Q = [ "excel", "presentation", "sales", "multilingual", "problem_solving" ];

function vEmployers() {
  const e = (S.employers || []).find(e => e.mine);
  return pubPage("employers", `<section class="hero2"><div class="lp2-in hero2-in">\n      <div class="lp2-copy"><p class="lp2-kicker">${te("pub_emp")}</p><h1 class="lp2-h">${te("em_h1")}</h1><p class="lp2-sub">${te("em_sub")}</p>\n        <div class="lp2-ctas"><button class="btn lg" data-act="em-go">${te("em_cta")} ${ic("arrow")}</button><button class="btn ghost lg" data-act="pub" data-p="example">${ic("pass")}${te("pub_example")}</button></div>\n        <p class="dim em-phase">${smallIc("clock")} ${te("em_phase")}</p></div>\n      <div class="win em-prev" aria-hidden="true"><div class="win-bar"><span class="win-t">${te("em_search")}</span><span class="pill">${te("em_prev")}</span></div>\n        <div class="win-body"><div class="em-q">${EMP_Q.map(e => `<span class="chip on">${esc(skName(e))}</span>`).join("")}</div>\n          ${[ {
    ini: "SA",
    f: "f_eco",
    sk: [ "excel", "presentation", "sales", "problem_solving", "research" ],
    pr: 3,
    iv: 82,
    v: !0
  }, {
    ini: "YB",
    f: "f_lang",
    sk: [ "multilingual", "sales", "presentation", "customer_service" ],
    pr: 2,
    iv: 76,
    v: !0
  }, {
    ini: "IM",
    f: "f_eco",
    sk: [ "excel", "sales", "problem_solving", "multilingual" ],
    pr: 1,
    iv: 0,
    v: !1
  } ].map(e => {
    const s = EMP_Q.filter(s => e.sk.includes(s)).length;
    return `<div class="em-c"><span class="av-c">${e.ini}</span><span class="em-t"><b>${te("em_cand")} · ${te(e.f)}</b><small>${te("em_match", {
      a: nfmt(s),
      b: nfmt(EMP_Q.length)
    })} · ${te("em_proofs", {
      n: nfmt(e.pr)
    })}${e.iv ? " · " + te("em_iv", {
      s: nfmt(e.iv)
    }) : ""}</small></span>${e.v ? stateTag("ver", "") : ""}</div>`;
  }).join("")}\n          <p class="dim em-anon">${smallIc("lock")} ${te("em_anon")}</p></div></div>\n    </div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("em_k2"), te("em_h2"))}<ul class="feat4 rv-g">${[ [ "em_f1", "target" ], [ "em_f2", "file" ], [ "em_f3", "shield" ], [ "em_f4", "lock" ] ].map(([e, s]) => `<li><span class="tr-i">${ic(s)}</span><h3>${te(e + "t")}</h3><p class="mute">${te(e + "d")}</p></li>`).join("")}</ul>\n      <p class="nd-rule rv">${te("em_not")}</p></div></section>\n    <section class="lp2-sec" id="emform"><div class="lp2-in pilot">\n      <div class="lp2-copy"><p class="lp2-kicker">${te("em_wl_k")}</p><h2>${te("em_wl_h")}</h2><p class="lp2-sub">${te("em_wl_d")}</p></div>\n      <div class="panel pilot-f">${e ? `<div class="done-state"><span class="ds-i">${ic("check")}</span><h3>${te("em_ok_t")}</h3><p class="mute">${te("em_ok_d", {
    org: e.org
  })}</p></div>` : `<form data-form="emp" novalidate>\n        <div class="f2"><div class="field"><label class="flabel" for="emO">${te("pf_org")}</label><input id="emO" class="inp" autocomplete="organization" required></div>\n          <div class="field"><label class="flabel" for="emN">${te("pf_name")}</label><input id="emN" class="inp" autocomplete="name" required></div></div>\n        <div class="f2"><div class="field"><label class="flabel" for="emE">${te("pf_email_w")}</label><input id="emE" class="inp" type="email" autocomplete="email" dir="ltr" required></div>\n          <div class="field"><label class="flabel" for="emR">${te("em_role")}</label><input id="emR" class="inp" placeholder="${te("em_role_ph")}"></div></div>\n        <label class="chk"><input type="checkbox" id="emI"><span>${te("em_intern")}</span></label>\n        <p class="f-err" id="emErr" role="alert"></p><button class="btn lg block" type="submit">${te("em_send")}</button><p class="dim f-note">${smallIc("lock")} ${te("pf_note")}</p></form>`}</div>\n    </div></section>`);
}

function vPartners() {
  const e = (S.partners || []).find(e => e.mine);
  return pubPage("partners", `<section class="hero2 narrow"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_partners")}</p><h1 class="lp2-h">${te("pt2_h1")}</h1><p class="lp2-sub">${te("pt2_sub")}</p></div>\n      <p class="nd-rule rv">${te("pt2_rule")}</p></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("pt2_k"), te("pt2_h2"))}<ul class="feat4 rv-g">${[ [ "pt2_f1", "target" ], [ "pt2_f2", "file" ], [ "pt2_f3", "users" ], [ "pt2_f4", "star" ] ].map(([e, s]) => `<li><span class="tr-i">${ic(s)}</span><h3>${te(e + "t")}</h3><p class="mute">${te(e + "d")}</p></li>`).join("")}</ul></div></section>\n    <section class="lp2-sec"><div class="lp2-in pilot">\n      <div class="lp2-copy"><p class="lp2-kicker">${te("pt2_wl_k")}</p><h2>${te("pt2_wl_h")}</h2><p class="lp2-sub">${te("pt2_wl_d")}</p></div>\n      <div class="panel pilot-f">${e ? `<div class="done-state"><span class="ds-i">${ic("check")}</span><h3>${te("em_ok_t")}</h3><p class="mute">${te("pt2_ok_d", {
    org: e.org
  })}</p></div>` : `<form data-form="partner" novalidate>\n        <div class="f2"><div class="field"><label class="flabel" for="paO">${te("pf_org")}</label><input id="paO" class="inp" autocomplete="organization" required></div>\n          <div class="field"><label class="flabel" for="paE">${te("pf_contact")}</label><input id="paE" class="inp" dir="ltr" autocomplete="email" required></div></div>\n        <div class="field"><label class="flabel" for="paS">${te("pt2_skills")}</label><input id="paS" class="inp" placeholder="${te("pt2_skills_ph")}"></div>\n        <fieldset class="field"><legend class="flabel">${te("pt2_fmt")}</legend><div class="chips-wrap" style="justify-content:flex-start">${[ "pt2_online", "pt2_inperson", "pt2_free", "pt2_cert", "pt2_mentor" ].map(e => `<label class="chk"><input type="checkbox" value="${e}"><span>${te(e)}</span></label>`).join("")}</div></fieldset>\n        <p class="f-err" id="paErr" role="alert"></p><button class="btn lg block" type="submit">${te("pt2_send")}</button><p class="dim f-note">${smallIc("lock")} ${te("pf_note")}</p></form>`}</div>\n    </div></section>`);
}

const CHANGES = [ {
  v: "0.9",
  d: "2026-10-16",
  k: [ "cl9a", "cl9b", "cl9c" ]
}, {
  v: "0.8",
  d: "2026-10-15",
  k: [ "cl8a", "cl8b", "cl8c" ]
}, {
  v: "0.7",
  d: "2026-10-08",
  k: [ "cl7a", "cl7b", "cl7c", "cl7d", "cl7e" ]
}, {
  v: "0.6",
  d: "2026-10-01",
  k: [ "cl6a", "cl6b", "cl6c" ]
}, {
  v: "0.5",
  d: "2026-09-24",
  k: [ "cl5a", "cl5b", "cl5c" ]
} ];

function vChangelog() {
  return pubPage("changelog", `<section class="hero2 narrow"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_changes")}</p><h1 class="lp2-h">${te("cl_h1")}</h1><p class="lp2-sub">${te("cl_sub")}</p></div></div></section>\n    <section class="lp2-sec top0"><div class="lp2-in"><ol class="cl">${CHANGES.map(e => `<li class="rv"><div class="cl-h"><time class="pill teal" datetime="${e.d}">${esc(dateFmt(new Date(e.d + "T12:00:00")))}</time></div><ul>${e.k.map(e => `<li>${ic("check")}<span>${te(e)}</span></li>`).join("")}</ul></li>`).join("")}</ol></div></section>`);
}

const finalCTA = () => `<section class="lp2-final"><div class="lp2-in lp2-final-in"><div><h2>${te("fin4_t")}</h2><p>${te("fin_d")}</p></div><button class="btn lg" data-act="start">${te("pub_start")} ${ic("arrow")}</button></div></section>`, BRAND_COLORS = [ [ "#0F3D36", "bk_c1" ], [ "#C9A15F", "bk_c2" ], [ "#F8F6EF", "bk_c3" ], [ "#0C1210", "bk_c4" ] ];

function markSVG(e = "#0F3D36", s = "#C9A15F", a = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a ? "0 0 1000 1000" : "0 0 1000 968"}">${a ? `<rect width="1000" height="1000" rx="224" fill="${a}"/><g transform="translate(170 188) scale(.66)">` : ""}<path fill="${e}" fill-rule="evenodd" d="${MK_BODY} ${MK_STAR}"/><path fill="${s}" d="${MK_STAR}"/>${a ? "</g>" : ""}</svg>`;
}

function vBrand() {
  const tile = (e, s) => `<figure class="bk-tile ${e}">${mark(1)}<figcaption class="cap">${te(s)}</figcaption></figure>`, lock = (e, s) => withLang(e, () => `<div class="bk-tile ${s}">${brand()}</div>`);
  return pubPage("brand", `<section class="hero2 narrow"><div class="lp2-in"><div class="lp2-copy"><p class="lp2-kicker">${te("pub_brand")}</p><h1 class="lp2-h">${te("bk_h1")}</h1><p class="lp2-sub">${te("bk_sub")}</p></div></div></section>\n    <section class="lp2-sec top0"><div class="lp2-in"><div class="bk-grid rv-g">${tile("", "bk_t1")}${tile("ink", "bk_t2")}${tile("night", "bk_t3")}</div></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("bk_m_k"), te("bk_m_h"))}\n      <ol class="bk-meaning rv-g">${[ [ "bk_m1", "pass" ], [ "bk_m2", "map" ], [ "bk_m3", "star" ] ].map(([e, s]) => `<li><span class="tr-i">${ic(s)}</span><h3>${te(e + "t")}</h3><p class="mute">${te(e + "d")}</p></li>`).join("")}</ol></div></section>\n    <section class="lp2-sec"><div class="lp2-in">${secHead(te("bk_l_k"), te("bk_l_h"), te("bk_l_sub"))}\n      <div class="bk-lock rv">${lock("en", "")}${lock("ar", "")}${lock("zgh", "night")}</div>\n      <div class="bk-icons rv" style="margin-top:22px">${[ 120, 72, 40, 24 ].map(e => `<span class="bk-icon" style="width:${e}px;height:${e}px">${mark()}</span>`).join("")}</div></div></section>\n    <section class="lp2-sec sec-sunk"><div class="lp2-in">${secHead(te("bk_c_k"), te("bk_c_h"))}\n      <div class="bk-sw rv-g">${BRAND_COLORS.map(([e, s]) => `<div><i style="background:${e}"></i><b>${te(s)}</b><code dir="ltr">${e}</code></div>`).join("")}</div></div></section>\n    <section class="lp2-sec"><div class="lp2-in">${secHead(te("bk_r_k"), te("bk_r_h"))}\n      <div class="bk-rules see2 rv-g"><article class="see yes"><h3>${ic("check")}${te("bk_do")}</h3><ul>${[ 1, 2, 3 ].map(e => `<li>${ic("check")}<span>${te("bk_do" + e)}</span></li>`).join("")}</ul></article>\n        <article class="see no"><h3>${ic("x")}${te("bk_dont")}</h3><ul>${[ 1, 2, 3 ].map(e => `<li>${ic("x")}<span>${te("bk_dont" + e)}</span></li>`).join("")}</ul></article></div>\n      <div class="bk-dl">${[ [ "mark", "bk_dl1" ], [ "white", "bk_dl2" ], [ "icon", "bk_dl3" ] ].map(([e, s]) => `<button class="btn ghost" data-act="bk-dl" data-k="${e}">${ic("download")}${te(s)}</button>`).join("")}</div></div></section>`);
}

function withLang(e, s) {
  const a = S.lang;
  S.lang = e;
  try {
    return s();
  } finally {
    S.lang = a;
  }
}

const splitWords = e => esc(e).split(/(\s+)/).map((e, s) => /^\s+$/.test(e) ? e : `<span class="hw-w" style="--k:${s}">${e}</span>`).join(""), LIVE = {
  tok: 0,
  paused: !1,
  step: 0,
  ro: null
}, LIVE_STORY = {
  ar: {
    text: "أدرس الاقتصاد في سنتي الأخيرة. أستعمل Excel لتتبّع مبيعات متجر العائلة، وأقدّم العروض أمام زملائي، وعملت في البيع خلال الصيف.",
    terms: [ "Excel", "أقدّم", "البيع" ]
  },
  fr: {
    text: "Je suis en dernière année d'économie. J'utilise Excel pour suivre les ventes de la boutique familiale, je présente souvent devant ma promo et j'ai fait de la vente l'été dernier.",
    terms: [ "Excel", "présente", "vente" ]
  },
  zgh: {
    text: "ⵜⵜⵖⵔⵖ ⴰⵙⴳⴳⵯⴰⵙ ⴰⵏⴳⴳⴰⵔⵓ ⵏ ⵜⴷⴰⵎⵙⴰ. ⴰⵔ ⵙⵅⴷⴰⵎⵖ Excel ⴰⴷ ⴹⴼⵔⵖ ⴰⵣⵣⵏⵣⵉ ⵏ ⵜⵃⴰⵏⵓⵜ ⵏ ⵜⵡⴰⵛⵓⵍⵜ, ⴰⵔ ⵙⵙⴽⴰⵏⵖ ⴰⵟⴰⵙ ⵣⴰⵜ ⵉⵎⴷⴷⵓⴽⴰⵍ ⵉⵏⵓ, ⵅⴷⵎⵖ ⴳ ⵓⵣⵣⵏⵣⵉ ⴳ ⵓⵏⴱⴷⵓ ⵉⵣⵔⵉⵏ.",
    terms: [ "Excel", "ⵙⵙⴽⴰⵏⵖ", "ⵓⵣⵣⵏⵣⵉ" ]
  },
  ary: {
    text: "كنقرا العام الأخير ديال الاقتصاد. كنستعمل Excel باش نتبّع المبيعات ديال الحانوت ديال العائلة، كنقدّم بزاف قدام صحابي فالقسم، وخدمت فالبيع فالصيف اللي فات.",
    terms: [ "Excel", "كنقدّم", "البيع" ]
  },
  en: {
    text: "I'm a final-year Economics student. I use Excel to track sales at my family's shop, I often present in class, and I worked in sales last summer.",
    terms: [ "Excel", "present", "sales" ]
  }
}, LIVE_SK = [ "excel", "presentation", "sales" ], LIVE_GAP = [ "powerbi", "sql" ];

function liveData() {
  const e = LIVE_STORY[L()] || LIVE_STORY[LK()], s = opp("analyst");
  return {
    text: e.text,
    found: LIVE_SK.map((s, a) => ({
      id: s,
      term: e.terms[a]
    })),
    o: s,
    gaps: LIVE_GAP,
    from: 2,
    to: 9,
    n: 11
  };
}

const lvFrac = (e, s) => nfmt(e) + "/" + nfmt(s.n), lvPct = (e, s) => Math.round(100 * e / s.n);

function liveHTML() {
  const e = liveData(), s = e.o;
  return `<div class="lv" id="lv" data-step="0">\n    <div class="lv-stage" role="img" aria-label="${te("lv_label")}">\n      <svg class="lv-wires" aria-hidden="true"><path class="w1"/><path class="w2"/></svg>\n      <article class="lv-card lv-a"><p class="lv-k"><span class="lv-ki">${ic("pen")}</span>${te("lv_a")}<span class="lv-badge num">1</span></p><p class="lv-text" id="lvT">&nbsp;</p></article>\n      <article class="lv-card lv-b"><div class="lv-ph"><span class="lv-m lv-av">${esc(initials(t("lv_name")))}</span><div><b>${te("lv_name")}</b><small>${te("lv_pass")}</small></div><span class="lv-cnt"><b class="num" id="lvN">0</b><small>${te("lv_skills")}</small></span><span class="lv-badge num">2</span></div>\n        <div class="lv-slots">${e.found.map((e, s) => `<span class="lv-slot" data-i="${s}"><span class="state s-conf">${ic("check")}${esc(skName(e.id))}</span></span>`).join("")}</div></article>\n      <article class="lv-card lv-c"><span class="lv-badge num">3</span><div class="lv-job"><span class="logo">${esc(s.ini)}</span><div><b>${esc(tx(s.title))}</b><small>${te("lv_away")}</small></div></div>\n        <div class="lv-match"><div class="lv-ring">${ring(0, 78, 9, "", !1, !1)}</div><div><b class="num" id="lvP">${lvFrac(0, e)}</b><small>${te("rd_steps")}</small></div>\n          <div class="lv-gap">${e.gaps.map(e => stateTag("miss", skName(e))).join("")}</div></div>\n        <div class="lv-path">${[ 1, 2, 3, 4, 5, 6, 7 ].map(e => `<i class="${7 === e ? "pv" : ""}">${ic(7 === e ? "file" : "check")}</i>`).join("")}</div>\n        <p class="lv-pl"><span>${te("day_n", {
    n: nfmt(1)
  })}</span><i></i><span>${te("lv_d30")}</span></p>\n        <span class="lv-stamp">${ic("check")}${te("lv_ready")}</span></article>\n    </div>\n    <div class="lv-foot"><ol class="lv-steps">${[ 1, 2, 3 ].map(e => `<li data-s="${e - 1}"><span class="num">${nfmt(e)}</span><b>${te("lv_s" + e)}</b><i><em></em></i></li>`).join("")}</ol>\n      <button class="ibtn lv-btn" data-act="live-toggle" aria-label="${te("lv_pause")}">${filmIcon(!1)}</button></div>\n    <p class="lv-cap" id="lvCap" aria-live="polite">${te("lv_c1")}</p>\n  </div>`;
}

function liveWires() {
  const e = $("#lv");
  if (!e) return;
  const s = $(".lv-stage", e), a = s.getBoundingClientRect(), i = $(".lv-wires", s);
  i.setAttribute("viewBox", `0 0 ${a.width} ${a.height}`), i.setAttribute("width", a.width), 
  i.setAttribute("height", a.height);
  const box = e => {
    const s = e.getBoundingClientRect();
    return {
      l: s.left - a.left,
      t: s.top - a.top,
      r: s.right - a.left,
      b: s.bottom - a.top,
      cx: (s.left + s.right) / 2 - a.left,
      cy: (s.top + s.bottom) / 2 - a.top
    };
  }, link = (e, s) => {
    const a = box(e), i = box(s);
    if (Math.abs(a.cx - i.cx) > .9 * Math.abs(a.cy - i.cy)) {
      const e = i.cx > a.cx, s = e ? a.r : a.l, o = e ? i.l : i.r, r = a.cy, l = i.cy, c = (s + o) / 2;
      return `M${s} ${r} C${c} ${r} ${c} ${l} ${o} ${l}`;
    }
    const o = i.cy > a.cy, r = o ? a.b : a.t, l = o ? i.t : i.b, c = a.cx, p = i.cx, d = (r + l) / 2;
    return `M${c} ${r} C${c} ${d} ${p} ${d} ${p} ${l}`;
  };
  $(".w1", i).setAttribute("d", link($(".lv-a", s), $(".lv-b", s))), $(".w2", i).setAttribute("d", link($(".lv-b", s), $(".lv-c", s)));
}

function liveAt(e, s, a) {
  setTimeout(() => {
    a === LIVE.tok && $("#lv") && e();
  }, s);
}

function liveStep(e) {
  const s = $("#lv");
  s && (LIVE.step = e, s.dataset.step = e, $$(".lv-steps li", s).forEach((s, a) => {
    s.classList.toggle("on", a === e), s.classList.toggle("done", a < e);
  }), $("#lvCap").textContent = t("lv_c" + (e + 1)));
}

function liveReset() {
  const e = $("#lv");
  if (!e) return;
  liveData();
  e.classList.remove("s1", "s2", "s3", "s4", "fin"), $("#lvT").innerHTML = "&nbsp;", 
  $("#lvN").textContent = nfmt(0), $("#lvP").textContent = lvFrac(0, liveData()), 
  $$(".lv-slot", e).forEach(e => e.classList.remove("on")), $$(".lv-path i", e).forEach(e => e.classList.remove("on"));
  const s = $(".lv-ring .g-val", e);
  s && (s.style.transition = "none", s.style.strokeDasharray = "0 100", s.getBoundingClientRect(), 
  s.style.transition = ""), $$(".lv-fly", e).forEach(e => e.remove());
}

function liveFinal() {
  const e = $("#lv");
  if (!e) return;
  const s = liveData();
  e.classList.add("s1", "s2", "s3", "s4", "fin"), $("#lvT").innerHTML = markAll(s.text, s.found.map(e => e.term)).replace(/class="fm"/g, 'class="fm on"'), 
  $("#lvN").textContent = nfmt(s.found.length), $$(".lv-slot", e).forEach(e => e.classList.add("on")), 
  $$(".lv-path i", e).forEach(e => e.classList.add("on")), $("#lvP").textContent = lvFrac(s.to, s);
  const a = $(".lv-ring .g-val", e);
  a && (a.style.strokeDasharray = lvPct(s.to, s) + " 100"), liveStep(2), liveWires();
}

function liveFly(e, s, a) {
  const i = $("#lv"), o = i.getBoundingClientRect(), r = e.getBoundingClientRect(), l = s.getBoundingClientRect(), c = s.firstElementChild.cloneNode(!0);
  c.classList.add("lv-fly"), c.style.left = r.left - o.left + "px", c.style.top = r.top - o.top - 4 + "px", 
  i.appendChild(c);
  const p = l.left - r.left, d = l.top - r.top + 4;
  c.animate([ {
    transform: "translate(0,0) scale(.7)",
    opacity: 0
  }, {
    transform: `translate(${.5 * p}px,${.5 * d - 28}px) scale(1.06)`,
    opacity: 1,
    offset: .55
  }, {
    transform: `translate(${p}px,${d}px) scale(1)`,
    opacity: 1
  } ], {
    duration: 820,
    easing: "cubic-bezier(.2,.8,.2,1)",
    fill: "forwards"
  }).onfinish = () => {
    c.remove(), a && a();
  };
}

function liveType(e, s, a, i) {
  const o = [ ...s ];
  let r = 0;
  const tick = () => {
    a === LIVE.tok && e.isConnected && (r++, e.innerHTML = esc(o.slice(0, r).join("")) + '<span class="caret"></span>', 
    r < o.length ? setTimeout(tick, 22 + 26 * Math.random()) : setTimeout(() => {
      a === LIVE.tok && i();
    }, 260));
  };
  tick();
}

function livePlay() {
  const e = ++LIVE.tok, s = $("#lv");
  if (!s) return;
  if (RM()) return void liveFinal();
  liveReset(), liveStep(0), liveWires();
  const a = liveData(), i = $("#lvT");
  s.classList.add("s1"), liveAt(() => liveType(i, a.text, e, () => {
    i.innerHTML = markAll(a.text, a.found.map(e => e.term)), s.classList.add("s2"), 
    liveStep(1);
    const o = $$(".fm", i), r = $$(".lv-slot", s);
    r.forEach((a, r) => {
      const l = o[r] || i;
      liveAt(() => l.classList && l.classList.add("on"), 200 + 320 * r, e), liveAt(() => liveFly(l, a, () => {
        e === LIVE.tok && (a.classList.add("on"), $("#lvN").textContent = nfmt(r + 1), bounce($(".lv-cnt", s), "pop"), 
        SND.play("tick"));
      }), 850 + 360 * r, e);
    });
    const l = 850 + 360 * r.length + 900, ringTo = e => {
      const a = $(".lv-ring .g-val", s);
      a && (a.style.strokeDasharray = e + " 100");
    };
    liveAt(() => {
      s.classList.add("s3"), liveStep(2), ringTo(lvPct(a.from, a)), $("#lvP").textContent = lvFrac(a.from, a);
    }, l, e), $$(".lv-path i", s).forEach((s, i) => liveAt(() => {
      s.classList.add("on");
      const e = Math.round(a.from + (a.to - a.from) * (i + 1) / 7);
      ringTo(lvPct(e, a)), $("#lvP").textContent = lvFrac(e, a);
    }, l + 1500 + 260 * i, e)), liveAt(() => {
      s.classList.add("s4", "fin"), bounce($(".lv-ring", s), "pop");
    }, l + 1500 + 1820 + 200, e), liveAt(() => {
      LIVE.paused || s.classList.add("out");
    }, l + 6800, e), liveAt(() => {
      s.classList.remove("out"), LIVE.paused || livePlay();
    }, l + 7300, e);
  }), 350, e);
}

function liveMount() {
  const e = $("#lv");
  if (!e) return;
  if (LIVE.paused = !1, liveWires(), LIVE.ro && LIVE.ro.disconnect(), "ResizeObserver" in window && (LIVE.ro = new ResizeObserver(() => liveWires()), 
  LIVE.ro.observe($(".lv-stage", e))), liveFinal(), RM()) return void e.classList.add("static");
  const s = e.closest(".hero3"), a = $(".lv-stage", e);
  if (s && a && matchMedia("(hover:hover) and (pointer:fine)").matches && !s.dataset.tilt) {
    s.dataset.tilt = "1";
    let e = 0;
    s.addEventListener("pointermove", i => {
      cancelAnimationFrame(e), e = requestAnimationFrame(() => {
        const e = s.getBoundingClientRect(), o = (i.clientX - e.left) / e.width - .5, r = (i.clientY - e.top) / e.height - .5;
        a.style.setProperty("--ry", (7 * o).toFixed(2) + "deg"), a.style.setProperty("--rx", (5 * -r).toFixed(2) + "deg"), 
        s.style.setProperty("--px", (14 * o).toFixed(1) + "px"), s.style.setProperty("--py", (10 * r).toFixed(1) + "px");
      });
    }), s.addEventListener("pointerleave", () => {
      a.style.setProperty("--ry", "0deg"), a.style.setProperty("--rx", "0deg"), s.style.setProperty("--px", "0px"), 
      s.style.setProperty("--py", "0px");
    });
  }
  "IntersectionObserver" in window && new IntersectionObserver((s, a) => {
    e.isConnected ? s.forEach(s => {
      s.isIntersecting ? e.dataset.idle && !LIVE.paused && (delete e.dataset.idle, livePlay()) : (LIVE.tok++, 
      e.dataset.idle = "1");
    }) : a.disconnect();
  }, {
    threshold: .2
  }).observe(e);
  const i = LIVE.tok;
  setTimeout(() => {
    i === LIVE.tok && !LIVE.paused && e.isConnected && (e.classList.add("out"), setTimeout(() => {
      e.classList.remove("out"), livePlay();
    }, 380));
  }, 2600);
}

function liveToggle() {
  const e = $("#lv");
  if (!e) return;
  LIVE.paused = !LIVE.paused, e.classList.toggle("paused", LIVE.paused);
  const s = $(".lv-btn", e);
  s.innerHTML = filmIcon(LIVE.paused), s.setAttribute("aria-label", t(LIVE.paused ? "lv_play" : "lv_pause")), 
  LIVE.paused ? (LIVE.tok++, liveFinal()) : livePlay();
}

function featTiles() {
  const e = withState(demoState(), () => confirmed().slice(0, 3)), s = {
    pass: `<div class="fv fv-pass"><div class="fvp-h"><span class="fvp-av">${esc(initials(t("lv_name")))}</span><b>${te("lv_name")}</b></div>${e.map((e, s) => {
      const a = [ "ver", "proven", "conf" ][s];
      return `<div class="fvp-r" style="--i:${s}"><span>${esc(skName(e))}</span>${stateTag(a, t("sts_" + a))}</div>`;
    }).join("")}</div>`,
    map: `<div class="fv fv-map"><i class="r1"></i><i class="r2"></i><i class="r3"></i><span class="me" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="${starD(50, 50, 40, .2)}"/></svg></span>${[ [ 18, 30 ], [ 72, 22 ], [ 80, 64 ], [ 30, 74 ], [ 58, 48 ] ].map(([e, s], a) => `<b class="pt ${4 === a ? "hi" : ""}" style="left:${e}%;top:${s}%;--i:${a}">${4 === a ? `<em class="num">${nfmt(5)}/${nfmt(6)}</em>` : ""}</b>`).join("")}</div>`,
    path: `<div class="fv fv-path"><div class="fvd">${[ 1, 2, 3, 4, 5, 6, 7 ].map(e => `<i style="--i:${e}" class="${6 === e ? "pv" : ""}">${ic(6 === e ? "file" : "check")}</i>`).join("")}</div><div class="fvr"><span class="tr"><i></i></span><b class="num">${nfmt(8)}/${nfmt(11)}</b><small>${te("rd_steps")}</small></div></div>`,
    iv: `<div class="fv fv-iv"><p class="q">${te("iv_q_sample")}</p><div class="bars3">${[ [ "sc_c", 72 ], [ "sc_e", 86 ], [ "sc_r", 64 ] ].map(([e, s], a) => `<div style="--i:${a};--v:${s}%"><span>${te(e)}</span><span class="tr"><i></i></span></div>`).join("")}</div></div>`
  };
  return [ [ "pass", "pass", "fg1" ], [ "map", "map", "fg2" ], [ "path", "plan", "fg3" ], [ "iv", "mic", "fg4" ] ].map(([e, a, i]) => `<article class="feat">${s[e]}<div class="feat-t"><h3>${ic(a)}${te(i + "t")}</h3><p class="mute">${te(i + "d")}</p></div></article>`).join("");
}

const TOURS = {
  student: [ [ ".next", "ts1" ], [ ".dest", "ts2" ], [ '.rail-nav [data-to="passport"]', '.tabbar [data-to="passport"]', "ts3" ], [ ".fab", "ts4" ] ],
  uni: [ [ ".attn-grid", "tu1" ], [ '.rail [data-to="ver"]', '.tabbar [data-to="ver"]', "tu2" ], [ '.rail [data-to="stu"]', '.tabbar [data-to="stu"]', "tu3" ] ],
  ops: [ [ ".attn-list", ".empty-c", "to1" ], [ '.rail [data-to="quality"]', '.tabbar [data-act="c-more"]', "to2" ], [ '.rail [data-to="set"]', '.tabbar [data-act="c-more"]', "to3" ] ]
}, TOUR = {
  k: null,
  i: 0
};

function visibleOf(e) {
  for (const s of e) {
    const e = $$(s).find(e => {
      const s = e.getBoundingClientRect();
      return s.width && s.height && "hidden" !== getComputedStyle(e).visibility;
    });
    if (e) return e;
  }
  return null;
}

function startTour(e) {
  TOURS[e] && (closePop(), closeModal(), TOUR.k = e, TOUR.i = 0, tourShow());
}

function tourEnd() {
  const e = $("#tour");
  e && e.remove(), TOUR.k && (S.tours = S.tours || {}, S.tours[TOUR.k] = !0, save()), 
  TOUR.k = null, removeEventListener("resize", tourPlace), removeEventListener("scroll", tourPlace, !0);
}

function tourShow() {
  const e = TOURS[TOUR.k], s = e[TOUR.i];
  if (!s) return tourEnd();
  const a = s[s.length - 1], i = visibleOf(s.slice(0, -1));
  if (!i) return TOUR.i++, TOUR.i < e.length ? tourShow() : tourEnd();
  i.scrollIntoView({
    block: "center",
    behavior: RM() ? "auto" : "smooth"
  });
  let o = $("#tour");
  o || (o = document.createElement("div"), o.id = "tour", o.innerHTML = '<div class="tour-spot"></div><div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tourT"></div>', 
  document.body.appendChild(o), o.addEventListener("keydown", e => {
    if ("Tab" !== e.key) return;
    const s = $$(".tour-card button", o);
    if (!s.length) return;
    const a = s.indexOf(document.activeElement);
    e.preventDefault(), s[(a + (e.shiftKey ? -1 : 1) + s.length) % s.length].focus();
  }), addEventListener("resize", tourPlace), addEventListener("scroll", tourPlace, !0));
  const r = TOUR.i === e.length - 1;
  $(".tour-card", o).innerHTML = `<p class="tour-n num">${te("tour_of", {
    a: nfmt(TOUR.i + 1),
    b: nfmt(e.length)
  })}</p><h3 id="tourT">${te(a + "t")}</h3><p>${te(a + "d")}</p>\n    <div class="tour-dots">${e.map((e, s) => `<i class="${s === TOUR.i ? "on" : ""}"></i>`).join("")}</div>\n    <div class="tour-acts">${r ? "" : `<button class="linkbtn dim" data-act="tour-skip">${te("tour_skip")}</button>`}<button class="btn sm" data-act="tour-next">${te(r ? "tour_done" : "tour_next")}${r ? "" : " " + ic("arrow")}</button></div>`, 
  TOUR.el = i, setTimeout(tourPlace, RM() ? 0 : 320), tourPlace();
  const l = $('.tour-card [data-act="tour-next"]');
  l && l.focus({
    preventScroll: !0
  });
}

function tourPlace() {
  const e = $("#tour"), s = TOUR.el;
  if (!e || !s || !s.isConnected) return;
  const a = s.getBoundingClientRect(), i = $(".tour-spot", e), o = $(".tour-card", e);
  i.style.left = a.left - 8 + "px", i.style.top = a.top - 8 + "px", i.style.width = a.width + 16 + "px", 
  i.style.height = a.height + 16 + "px";
  const r = o.offsetWidth, l = o.offsetHeight, c = a.bottom + 16 + l < innerHeight;
  let p = "rtl" === document.documentElement.dir ? a.right - r : a.left;
  p = Math.max(12, Math.min(innerWidth - r - 12, p));
  let d = c ? a.bottom + 16 : a.top - l - 16;
  d < 12 && (d = Math.min(innerHeight - l - 12, Math.max(12, a.top + 12))), o.style.left = p + "px", 
  o.style.top = d + "px";
}

function maybeTour() {
  S.tours = S.tours || {};
  const e = "uni" === S.role ? S.auth.uni && "ov" === ui.uview ? "uni" : null : "ops" === S.role ? S.auth.ops && "ov" === ui.ops ? "ops" : null : "app" !== S.stage || "home" !== S.screen || ui.pubForce ? null : "student";
  !e || S.tours[e] || TOUR.k || ui.tourAsked === e || (ui.tourAsked = e, setTimeout(() => {
    !("student" === e ? "student" === curPortal() && "app" === S.stage && "home" === S.screen : "uni" === e ? "uni" === S.role && "ov" === ui.uview : "ops" === S.role && "ov" === ui.ops) || TOUR.k || $("#layer").innerHTML ? ui.tourAsked = null : startTour(e);
  }, 1100));
}

function studentMenu(e) {
  const s = [ {
    icon: "pass",
    label: t("pp_title"),
    attrs: 'data-act="pal-go" data-h="#/passport"'
  }, {
    icon: "chart",
    label: t("nav_prog"),
    attrs: 'data-act="pal-go" data-h="#/progress"'
  }, {
    icon: "gear",
    label: t("nav_set"),
    attrs: 'data-act="pal-go" data-h="#/settings"'
  }, {
    icon: "help",
    label: t("help_t"),
    attrs: 'data-act="pal-go" data-h="#/help"'
  } ];
  S.share.pub && s.splice(1, 0, {
    icon: "link",
    label: t("pp_public_view"),
    attrs: `data-act="pal-go" data-h="#/p/${passNo()}"`
  }), openPop(e, popItems(`<div class="pop-who">${avatar(initials(S.profile.name))}<div><b>${esc(S.profile.name)}</b><small>${S.profile.field ? te(S.profile.field) : ""}</small></div></div>`, s.concat([ "-", {
    icon: "out",
    label: t("sign_out"),
    attrs: 'data-act="sign-out"'
  } ])));
}

function shell(e) {
  const s = S.goal && opp(S.goal), a = s ? readiness(s) : 0, i = unread(), o = {
    passport: `<span class="n num">${nfmt(confirmed().length)}</span>`,
    plan: S.plan ? `<span class="n num">${nfmt(Math.min(30, doneCount()))}/30</span>` : ""
  }, nb = (e, s, a, i = "") => `<button class="nav-i" data-act="go" data-to="${e}" ${S.screen === e ? 'aria-current="page"' : ""}>${ic(s)}<span>${esc(a)}</span>${i}</button>`;
  return `<div class="shell">\n    <aside class="rail" aria-label="${te("nav_main")}">\n      <button class="brand-btn" data-act="go" data-to="home" aria-label="SKILMA">${brand()}</button>\n      <nav class="rail-nav" aria-label="${te("nav_main")}">${NAV.map(([e, s, a]) => nb(e, s, t(a), o[e] || "")).join("")}</nav>\n      <div class="rail-sep"></div>\n      <nav class="rail-nav" aria-label="${te("nav_more")}">${nb("progress", "chart", t("nav_prog"))}${nb("notifications", "bell", t("nt_title"), i ? `<span class="n hot num">${nfmt(i)}</span>` : "")}${nb("settings", "gear", t("nav_set"))}${nb("help", "help", t("help_t"))}</nav>\n      <div class="rail-foot">\n        ${s ? `<button class="rail-ready" data-act="go" data-to="home">${ring(a, 46, 5, "", !1, isReady(s))}<span class="t"><b class="num"><bdi dir="ltr">${esc(readyLabel(s))}</bdi></b>${esc(tx(s.short))}</span></button>` : ""}\n\n      </div>\n    </aside>\n    <div class="app-col">\n      <header class="atop"><button class="brand-btn m-only" data-act="go" data-to="home" aria-label="SKILMA">${brand()}</button>\n        <button class="search-pill" data-act="palette" aria-label="${te("pal_open")}">${ic("search")}<span>${te("pal_ph")}</span><kbd>${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} K</kbd></button>\n        <div class="top-r">${langPick()}${themeUI("toggle")}\n          <button class="ibtn bell" data-act="go" data-to="notifications" aria-label="${te("nt_title")}${i ? " · " + nfmt(i) : ""}">${ic("bell")}${i ? `<i class="bdg num">${nfmt(i)}</i>` : ""}</button>\n          <button class="av-btn" data-act="s-menu" data-pop aria-haspopup="menu" aria-expanded="false" aria-label="${te("acc_menu")}">${avatar(initials(S.profile.name))}<span class="d-only">${esc(S.profile.name)}</span></button></div></header>\n      ${maintBanner()}\n      <main class="main" id="main"><div class="main-in enter" id="mainIn">${e}</div></main>\n    </div>\n    <nav class="tabbar" aria-label="${te("nav_main")}">${NAV.filter(([e]) => "interview" !== e).map(([e, s, a]) => `<button data-act="go" data-to="${e}" ${S.screen === e ? 'aria-current="page"' : ""}>${ic(s)}<span>${te(a)}</span></button>`).join("")}</nav>\n    <button class="fab" data-act="copilot" aria-label="${te("cp_open")}">${mascot("neutral")}<span>${te("cp_open")}</span></button>\n  </div>`;
}

function notes() {
  const e = [], add = (s, a, i, o, r, l, c = "") => e.push({
    id: s,
    at: a,
    icon: i,
    title: o,
    body: r,
    act: l,
    tone: c
  });
  add("welcome", S.created, "spark", t("nt_welcome"), t("nt_welcome_d"), 'data-act="pal-go" data-h="#/passport"'), 
  S.events.forEach(e => {
    const s = e.type + ":" + e.t;
    "ver" === e.type && S.notif.ver && add(s, e.t, "shield", t("nt_ver"), t("nt_ver_d"), 'data-act="pal-go" data-h="#/passport/share"', "ok"), 
    "vermore" === e.type && S.notif.ver && add(s, e.t, "chat", t("nt_more"), t("nt_more_d"), 'data-act="pal-go" data-h="#/passport/share"'), 
    "proven" === e.type && SK[e.id] && add(s, e.t, "file", t("nt_proven", {
      x: skName(e.id)
    }), t("nt_proven_d"), 'data-act="pal-go" data-h="#/passport"', "ok"), "goal" === e.type && opp(e.id) && add(s, e.t, "target", t("nt_goal", {
      x: tx(opp(e.id).title)
    }), t("nt_goal_d"), 'data-act="go" data-to="plan"'), "apply" === e.type && opp(e.id) && add(s, e.t, "send", t("nt_apply", {
      x: opp(e.id).org
    }), t("nt_apply_d"), `data-act="open-opp" data-id="${e.id}"`, "ok"), "iv" === e.type && add(s, e.t, "mic", t("nt_iv", {
      s: nfmt(e.s)
    }), t("nt_iv_d"), 'data-act="go" data-to="interview"');
  });
  {
    const e = S.log.find(e => e.r >= 50 && opp(e.g)), s = S.log.find(e => e.rd && opp(e.g));
    e && add("half:" + e.g, e.t + 1, "chart", t("nt_half", {
      x: tx(opp(e.g).short)
    }), t("nt_ready50"), 'data-act="go" data-to="home"', "ok"), s && add("ready:" + s.g, s.t + 2, "trophy", t("nt_rdy", {
      x: tx(opp(s.g).short)
    }), t("nt_ready70"), 'data-act="go" data-to="home"', "ok");
  }
  if (S.notif.opps && confirmed().length) {
    const e = liveOpps().filter(e => e.id !== S.goal && 0 === coreGaps(e)), s = S.events.filter(e => "skills" === e.type).pop();
    e.length && add("opps:" + e.map(e => e.id).join(","), (s ? s.t : S.created) + 2, "map", t("nt_opps", {
      n: nfmt(e.length)
    }), list(e.slice(0, 3).map(e => tx(e.short))), 'data-act="go" data-to="opps"');
  }
  if (S.notif.week && S.plan && doneCount()) {
    const e = Math.ceil(Math.min(30, doneCount()) / 7);
    add("week" + e, (S.plan.done[doneCount()] || {}).at || Date.now(), "plan", t("nt_week", {
      n: nfmt(doneCount())
    }), t("nt_week_d"), 'data-act="go" data-to="plan"');
  }
  return e.sort((e, s) => s.at - e.at);
}

const unread = () => notes().filter(e => !S.read[e.id]).length;

function vNotifications() {
  const e = notes(), s = new Date;
  s.setHours(0, 0, 0, 0);
  const a = [ [ "nt_today", e.filter(e => e.at >= +s) ], [ "nt_earlier", e.filter(e => e.at < +s) ] ], when = e => Date.now() - e < 864e5 ? (e => {
    const s = Math.round((Date.now() - e) / 36e5);
    if (s < 1) return t("nt_now");
    if ("zgh" === L()) return s < 24 ? t("hours_ago", {
      n: nfmt(s)
    }) : daysAgo(Math.round(s / 24));
    try {
      return new Intl.RelativeTimeFormat(LOC(), {
        numeric: "auto"
      }).format(-s, "hour");
    } catch (e) {
      return "";
    }
  })(e) : dateFmt(e);
  return `<div class="ph"><div><h1>${te("nt_title")}</h1><p>${te("nt_sub")}</p></div>${unread() ? `<button class="btn ghost sm" data-act="nt-all">${ic("check")}${te("nt_all")}</button>` : ""}</div>\n    ${a.filter(e => e[1].length).map(([e, s]) => `<section class="nt-g"><h2 class="sub-h">${te(e)}</h2><div class="nt-list panel">${s.map(e => `<button class="nt ${S.read[e.id] ? "" : "new"} ${e.tone}" data-act="nt-open" data-id="${esc(e.id)}" ${e.act.replace("data-act=", "data-then=")}>\n      <span class="nt-i">${ic(e.icon)}</span><span class="nt-t"><b>${esc(e.title)}</b><span>${esc(e.body)}</span></span><small class="dim"><time datetime="${new Date(e.at).toISOString()}" title="${esc(dateTimeFmt(e.at))}">${esc(when(e.at))}</time></small>${S.read[e.id] ? "" : `<i class="nt-dot" aria-label="${te("nt_new")}"></i>`}</button>`).join("")}</div></section>`).join("")}\n    <p class="dim set-hint">${smallIc("gear")} ${te("nt_prefs")} <button class="linkbtn" data-act="go" data-to="settings">${te("nav_set")}</button></p>`;
}

const PP_TABS = [ [ "skills", "check", "pp_tab_skills" ], [ "experiences", "chat", "pp_tab_exp" ], [ "share", "share", "pp_tab_share" ] ];

function ppTabs() {
  const e = ui.ppTab || "skills";
  return `<div class="tabs" role="tablist" aria-label="${te("pp_title")}">${PP_TABS.map(([s, a, i]) => `<button role="tab" data-act="pp-tab" data-t="${s}" aria-selected="${e === s}">${ic(a)}${te(i)}${"experiences" === s ? ` <span class="n num">${nfmt(S.stories.length)}</span>` : ""}</button>`).join("")}</div>`;
}

function vExperiences() {
  return `<div class="exp-list">${S.stories.slice().reverse().map(e => {
    const s = (e.skills || []).filter(e => S.skills[e]);
    return `<article class="exp-c"><div class="exp-h"><span class="exp-ty">${e.type ? te(e.type) : te("pp_tab_exp")}</span><small class="dim">${esc(dateFmt(e.at))}</small></div><p>${esc(e.text)}</p>\n      <div class="chips-wrap" style="justify-content:flex-start">${s.map(e => stateTag(owned(e) ? skillState(e) : "rej", skName(e))).join("") || `<span class="dim">${te("exp_none")}</span>`}</div></article>`;
  }).join("")}\n    <button class="exp-add" data-act="pal-go" data-h="#/experience/new">${ic("plus")}<span><b>${te("pp_add")}</b><small>${te("exp_add_d")}</small></span></button></div>`;
}

function vShare() {
  const e = `skilma.ma/p/${passNo()}`, s = S.verify.status;
  return `<div class="share-g">\n    <section class="panel share-c"><div class="sh-h"><span class="tr-i">${ic("link")}</span><div><h3>${te("sh_pub_t")}</h3><p class="mute">${te("sh_pub_d")}</p></div><input type="checkbox" class="sw" data-act="share-pref" data-k="pub" ${S.share.pub ? "checked" : ""} aria-label="${te("sh_pub_t")}"></div>\n      ${S.share.pub ? `<div class="sh-link"><label class="sr" for="shareLink">${te("pp_share")}</label><input id="shareLink" class="inp mono" readonly value="${esc(e)}" dir="ltr"><button class="btn ghost sm" data-act="copy-link">${ic("copy")}${te("copy")}</button><button class="btn sm" data-act="pal-go" data-h="#/p/${passNo()}">${ic("eye")}${te("sh_preview")}</button></div>` : `<p class="dim sh-off">${smallIc("lock")} ${te("sh_off")}</p>`}</section>\n    <section class="panel share-c"><div class="sh-h"><span class="tr-i">${ic("uni")}</span><div><h3>${te("sh_uni_t")}</h3><p class="mute">${te("sh_uni_d")}</p></div><input type="checkbox" class="sw" data-act="share-pref" data-k="uni" ${S.share.uni ? "checked" : ""} aria-label="${te("sh_uni_t")}"></div></section>\n    <section class="panel share-c"><div class="sh-h"><span class="tr-i">${ic("shield")}</span><div><h3>${te("vs3")}</h3><p class="mute">${te("verified" === s ? "sh_ver_done" : "requested" === s ? "sh_ver_wait" : "sh_ver_d")}</p></div>\n      ${"none" === s ? `<button class="btn sm" data-act="ask-verify">${ic("shield")}${te("ask_verify")}</button>` : stateTag("verified" === s ? "ver" : "sugg", t("verified" === s ? "st_ver" : "ver_wait"))}</div>${verSteps()}</section>\n    <section class="panel share-c"><div class="sh-h"><span class="tr-i">${ic("download")}</span><div><h3>${te("sh_cert_t")}</h3><p class="mute">${te("sh_cert_d")}</p></div><button class="btn ghost sm" data-act="cert">${ic("download")}PDF</button></div></section>\n  </div>`;
}

function vHelp() {
  return `<div class="ph"><div><h1>${te("help_t")}</h1><p>${te("help_sub")}</p></div><div class="ph-a"><button class="btn ghost" data-act="tour-home">${ic("eye")}${te("tour_take")}</button><button class="btn" data-act="copilot">${ic("chat")}${te("cp_open")}</button></div></div>\n    <div class="two">${faqList([ "hq1", "hq2", "hq3", "hq4", "hq5", "hq6" ])}\n    <div style="display:grid;gap:14px;align-content:start">\n      <section class="panel"><h3>${te("fb_t")}</h3><p class="mute" style="font-size:14px;margin:4px 0 12px">${te("fb_d")}</p>\n        <form data-form="fb" novalidate><label class="sr" for="fbT">${te("fb_t")}</label><textarea id="fbT" class="inp" rows="4" maxlength="600" placeholder="${te("fb_ph")}"></textarea><p class="f-err" id="fbErr" role="alert"></p><button class="btn sm" type="submit" style="margin-top:10px">${ic("send")}${te("fb_send")}</button></form></section>\n      <section class="panel"><h3 style="margin-bottom:10px">${te("kb_t")}</h3><dl class="kv">${[ [ "Ctrl K", "kb_1" ], [ "Ctrl ↵", "kb_2" ], [ "Esc", "kb_3" ] ].map(([e, s]) => `<div><dt>${te(s)}</dt><dd><kbd>${esc(e.replace("Ctrl", /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"))}</kbd></dd></div>`).join("")}</dl></section></div></div>`;
}

function vMe() {
  const e = [ [ "passport", "pass", "pp_title" ], [ "progress", "chart", "nav_prog" ], [ "notifications", "bell", "nt_title", unread() ], [ "settings", "gear", "nav_set" ], [ "help", "help", "help_t" ] ];
  return `<div class="me-h">${avatar(initials(S.profile.name), "lg")}<div><h1>${esc(S.profile.name)}</h1><p class="mute">${S.profile.field ? te(S.profile.field) : ""} · <span class="mono">${passNo()}</span></p></div></div>\n    <nav class="panel me-l">${e.map(([e, s, a, i]) => `<button data-act="go" data-to="${e}">${ic(s)}<span>${te(a)}</span>${i ? `<span class="n hot num">${nfmt(i)}</span>` : ""}${ic("chev")}</button>`).join("")}</nav>\n    <section class="panel"><div class="set-row" style="border:0"><span><b>${te("set_lang")}</b></span>${langSeg()}</div><div class="set-row"><span><b>${te("th_label")}</b></span>${themeUI("seg")}</div></section>\n    <button class="btn ghost block" data-act="sign-out">${ic("out")}${te("sign_out")}</button>`;
}

function vSettings() {
  const sw = (e, s, a, i, o = "pref") => `<div class="set-row"><label for="${e}"><b>${te(a)}</b><span>${te(i)}</span></label><input type="checkbox" class="sw" id="${e}" data-act="${o}" data-k="${e.slice(2)}" ${s ? "checked" : ""}></div>`, sec = (e, s, a, i) => `<section class="panel set-sec" id="${e}"><h2 class="set-h">${ic(s)}${te(a)}</h2><div class="set-list">${i}</div></section>`;
  return `<div class="ph"><div><h1>${te("set_title")}</h1><p>${te("set_sub")}</p></div></div>\n  <div class="set-wrap"><nav class="set-nav" aria-label="${te("set_title")}">${[ [ "s-prof", "user", "set_prof" ], [ "s-plan", "star", "set_plan" ], [ "s-notif", "bell", "set_notif" ], [ "s-priv", "lock", "set_privacy" ], [ "s-acc", "eye", "set_acc" ], [ "s-data", "download", "set_data" ] ].map(([e, s, a]) => `<button data-act="scroll-to" data-id="${e}">${ic(s)}${te(a)}</button>`).join("")}</nav>\n  <div class="set-col">\n  ${sec("s-prof", "user", "set_prof", `<div class="set-row"><label for="setName"><b>${te("set_name")}</b></label><input id="setName" class="inp" style="max-width:240px;padding:10px 14px" maxlength="40" value="${esc(S.profile.name)}"></div>\n    <div class="set-row col"><span><b>${te("su_field")}</b></span><div class="chips-wrap" style="justify-content:flex-start">${FIELDS.map(e => `<button class="chip ${S.profile.field === e ? "on" : ""}" data-act="field" data-f="${e}" aria-pressed="${S.profile.field === e}">${te(e)}</button>`).join("")}</div></div>\n    <div class="set-row col">${aimGroup()}</div><div class="set-row col">${yearGroup()}</div><div class="set-row col">${langGroup()}</div>\n    <div class="set-row"><span><b>${te("set_lang")}</b></span>${langSeg()}</div><div class="set-row"><span><b>${te("th_label")}</b></span>${themeUI("seg")}</div>\n    <div class="set-row"><span><b>${te("set_goal")}</b><span>${S.goal ? esc(tx(opp(S.goal).title)) : te("set_nogoal")}</span></span><button class="btn ghost sm" data-act="go" data-to="opps">${ic("map")}${te("nav_opps")}</button></div>`)}\n  ${sec("s-plan", "star", "set_plan", `<div class="set-row"><span><b>${te("set_plan_free")}</b><span>${te("set_plan_free_d")}</span></span><button class="btn ghost sm" data-act="access-tab" data-t="req">${te("im_cta1")}</button></div>`)}\n  ${sec("s-notif", "bell", "set_notif", sw("n_week", S.notif.week, "sn_week", "sn_week_d", "notif-pref") + sw("n_ver", S.notif.ver, "sn_ver", "sn_ver_d", "notif-pref") + sw("n_opps", S.notif.opps, "sn_opps", "sn_opps_d", "notif-pref"))}\n  ${sec("s-priv", "lock", "set_privacy", sw("h_pub", S.share.pub, "sh_pub_t", "sh_pub_d", "share-pref") + sw("h_uni", S.share.uni, "sh_uni_t", "sh_uni_d", "share-pref") + `<div class="set-row"><span><b>${te("set_ai")}</b><span>${te(aiOn() ? "set_ai_live" : "ai_off_d")}</span></span>${aiPill()}</div>`)}\n  ${sec("s-acc", "eye", "set_acc", sw("p_sound", S.prefs.sound, "set_sound", "set_sound_d") + sw("p_voice", S.prefs.voice, "set_voice", "set_voice_d") + sw("p_calm", S.prefs.calm, "set_calm", "set_calm_d") + sw("p_lite", S.prefs.lite, "ax_lite", "ax_lite_on") + `<div class="set-row"><span><b>${te("ax_size")}</b></span><div class="seg" role="group" aria-label="${te("ax_size")}">${[ [ 1, "A" ], [ 1.12, "A+" ], [ 1.25, "A++" ] ].map(([e, s]) => `<button data-act="fsize" data-v="${e}" aria-pressed="${(S.prefs.fs || 1) === e}">${s}</button>`).join("")}</div></div>`)}\n  ${sec("s-data", "download", "set_data", `<div class="set-row"><span><b>${te("sd_export")}</b><span>${te("sd_export_d")}</span></span><button class="btn ghost sm" data-act="export-data">${ic("download")}JSON</button></div>\n    <div class="set-row"><span><b>${te("sign_out")}</b><span>${te("so_d")}</span></span><button class="btn ghost sm" data-act="sign-out">${ic("out")}${te("sign_out")}</button></div>\n    <div class="set-row"><span><b>${te("set_reset")}</b><span>${te("set_reset_q")}</span></span><button class="btn ghost sm danger-t" data-act="reset-ask">${ic("refresh")}${te("set_reset")}</button></div>\n    <div id="resetBox"></div>`)}\n  </div></div>`;
}

const GROWTH = [ [ "gp1", "users" ], [ "gp2", "clock" ], [ "gp3", "chat" ], [ "gp4", "star" ] ];

function vPrograms() {
  const e = S.goal && opp(S.goal), s = e ? gaps(e) : [], a = e ? e.req.map(e => e[0]).filter(e => owned(e) && "conf" === skillState(e)) : [], card = (s, a) => {
    const i = RES[s] || {
      h: 4
    }, o = (e => S.plan && (S.plan.tasks.find(s => s.skill === e) || {}).day)(s);
    return `<article class="pg-c"><div class="pg-h">${stateTag(a, skName(s))}<span class="dim num">${te("od_hours", {
      h: nfmt(i.h)
    })}</span></div><p class="pg-r">${ic("book")}<span>${esc(tx(i))}</span></p>\n      <p class="pg-why">${te("miss" === a ? "pg_why_gap" : "pg_why_proof", {
      x: e ? tx(e.short) : ""
    })}</p>${o ? `<button class="btn ghost sm" data-act="open-task" data-day="${o}">${ic("plan")}${te("pg_day", {
      n: nfmt(o)
    })}</button>` : ""}</article>`;
  };
  return `<div class="ph"><div><h1>${te("prg_title")}</h1><p>${te("prg_sub")}</p></div></div>\n    <p class="pg-rule">${ic("info")}<span>${te("pg_rule")}</span></p>\n    ${e ? `<section><div class="sec-h"><h2>${te("pg_for", {
    x: tx(e.title)
  })}</h2><span class="dim num">${nfmt(s.length + a.length)}</span></div>\n      ${s.length + a.length ? `<div class="pg-grid">${s.map(e => card(e, "miss")).join("")}${a.slice(0, 4).map(e => card(e, "conf")).join("")}</div>` : `<div class="panel empty-c"><span class="ds-i">${ic("check")}</span><p class="mute">${te("pg_none")}</p></div>`}</section>` : emptyGoal()}\n    <section><div class="sec-h"><h2>${te("pg_growth")}</h2><span class="pill">${te("rms_soon")}</span></div>\n      <div class="pg-grid g4">${GROWTH.map(([e, s]) => `<article class="pg-c soft"><span class="tr-i">${ic(s)}</span><h3>${te(e + "t")}</h3><p class="mute">${te(e + "d")}</p></article>`).join("")}</div>\n      <p class="dim fine">${smallIc("info")} ${te("pg_note")}</p></section>`;
}

function consoleShell({kind: e, groups: s, cur: a, act: i, inner: o, org: r, user: l, tools: c = ""}) {
  const p = s.flatMap(e => e.items).slice(0, 4), item = ([s, o, r, l]) => `<button class="nav-i" data-act="${i}" data-to="${s}" ${a === s ? 'aria-current="page"' : ""}>${ic(o)}<span>${te(r)}</span>${l ? `<span class="n ${"ops" === e ? "hot" : ""} num">${nfmt(l)}</span>` : ""}</button>`;
  return `<div class="shell con ${e}">\n    <aside class="rail" aria-label="${esc(r.name)}">\n      <div class="org"><span class="org-m">${esc(r.mono)}</span><div><b>${esc(r.name)}</b><small>${esc(r.sub)}</small></div></div>\n      <nav class="rail-nav">${s.map(e => (e.label ? `<p class="nav-g">${te(e.label)}</p>` : "") + e.items.map(item).join("")).join("")}</nav>\n      <div class="rail-foot"><div class="who-card">${avatar(initials(l.name))}<span><b>${esc(l.name)}</b><small>${esc(l.role)}</small></span></div>\n        <button class="nav-i" data-act="sign-out">${ic("out")}<span>${te("sign_out")}</span></button></div>\n    </aside>\n    <div class="app-col">\n      <header class="atop"><span class="m-only org-mini"><span class="org-m">${esc(r.mono)}</span></span>\n        <button class="search-pill" data-act="palette" aria-label="${te("pal_open")}">${ic("search")}<span>${te("pal_ph")}</span><kbd>${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"} K</kbd></button>\n        <div class="top-r">${c}${themeUI("toggle")}<span class="d-only">${langPick()}</span>\n          <button class="av-btn" data-act="c-menu" data-pop aria-haspopup="menu" aria-expanded="false" aria-label="${te("acc_menu")}">${avatar(initials(l.name))}</button></div></header>\n      ${"uni" === e ? maintBanner() : ""}\n      <main class="main" id="main"><div class="main-in enter" id="mainIn">${o}</div></main>\n    </div>\n    <nav class="tabbar" aria-label="${esc(r.name)}">${p.map(([e, s, o, r]) => `<button data-act="${i}" data-to="${e}" ${a === e ? 'aria-current="page"' : ""}>${ic(s)}<span>${te(o)}</span>${r ? `<i class="bdg num">${nfmt(r)}</i>` : ""}</button>`).join("")}\n      <button data-act="c-more" data-pop aria-haspopup="menu" aria-expanded="false" ${p.some(e => e[0] === a) ? "" : 'aria-current="page"'}>${ic("grid")}<span>${te("more")}</span></button></nav>\n  </div>`;
}

function consoleMenu(e, s) {
  const a = "uni" === S.role, i = a ? UNI_USER : OPS_USER;
  if (s) {
    const s = a ? uniGroups() : opsGroups(), i = a ? "ugo" : "ogo";
    return openPop(e, popItems("", s.flatMap(e => e.items).slice(4).map(([e, s, a]) => ({
      icon: s,
      label: t(a),
      attrs: `data-act="${i}" data-to="${e}"`
    }))));
  }
  openPop(e, popItems(`<div class="pop-who">${avatar(initials(tx(i.name)))}<div><b>${esc(tx(i.name))}</b><small>${esc(tx(i.role))}</small></div></div>`, [ {
    icon: "gear",
    label: t("u_nav_set"),
    attrs: `data-act="${a ? "ugo" : "ogo"}" data-to="set"`
  }, {
    icon: "search",
    label: t("pal_open"),
    attrs: 'data-act="palette"'
  }, "-", ...LANGS.map(e => ({
    icon: "globe",
    label: t("lang_" + e) + (L() === e ? " ✓" : ""),
    attrs: `data-act="lang" data-l="${e}"`
  })), "-", {
    icon: "out",
    label: t("sign_out"),
    attrs: 'data-act="sign-out"'
  } ]));
}

function consoleMount(e) {
  $$(".tbl-wrap", e).forEach(e => e.classList.toggle("scrolls", e.scrollWidth > e.clientWidth + 2));
}

const cHead = (e, s, a = "") => `<div class="ph"><div><h1>${esc(e)}</h1>${s ? `<p>${esc(s)}</p>` : ""}</div>${a ? `<div class="ph-a">${a}</div>` : ""}</div>`, kpi = (e, s, a = "", i = "", o = "") => `<div class="kpi"><span class="kpi-l">${s}</span><b class="num">${e}</b>${i ? `<span class="delta ${String(i).startsWith("-") ? "dn" : "up"}"><bdi dir="ltr">${esc(i)}</bdi></span>` : ""}${a ? `<small>${a}</small>` : ""}${o}</div>`;

function sparkline(e, s = 120, a = 32) {
  const i = Math.max(...e), o = Math.min(...e), r = i - o || 1, l = e.map((i, l) => [ l * (s / (e.length - 1)), a - 3 - (i - o) / r * (a - 6) ]);
  return `<svg class="spark" viewBox="0 0 ${s} ${a}" width="${s}" height="${a}" style="direction:ltr" aria-hidden="true"><path d="M${l.map(e => e.map(e => e.toFixed(1)).join(" ")).join(" L")}"/><circle cx="${l[l.length - 1][0]}" cy="${l[l.length - 1][1]}" r="2.6"/></svg>`;
}

function areaChart(e, s, a) {
  const i = 52, o = 16, r = 30, l = 28, c = 50 * Math.ceil(1.08 * Math.max(...e) / 50) || 50, p = 620 - i - o, d = 230 - r - l, x = s => i + s * p / (e.length - 1), y = e => r + d - e / c * d, u = e.map((e, s) => `${s ? "L" : "M"}${x(s).toFixed(1)} ${y(e).toFixed(1)}`).join(" "), _ = [ 0, .5, 1 ].map(e => `<line class="gl" x1="${i}" x2="${620 - o}" y1="${y(c * e)}" y2="${y(c * e)}"/><text class="ax" x="${i - 8}" y="${y(c * e) + 4}" text-anchor="end">${nfmt(Math.round(c * e))}</text>`).join("");
  return `<svg class="chart area" viewBox="0 0 620 230" style="direction:ltr" role="img" aria-label="${esc(a)}">${_}<path class="ar" d="${u} L${x(e.length - 1)} ${r + d} L${i} ${r + d}Z"/><path class="ln" d="${u}" pathLength="1"/>\n    ${e.map((a, i) => `<g class="pt"><circle cx="${x(i)}" cy="${y(a)}" r="${i === e.length - 1 ? 4.5 : 3}" class="${i === e.length - 1 ? "last" : ""}"/><text class="ax" x="${x(i)}" y="222" text-anchor="middle">${esc(s[i])}</text>${i === e.length - 1 ? `<text class="val" x="${x(i)}" y="${y(a) - 12}" text-anchor="middle">${nfmt(a)}</text>` : ""}</g>`).join("")}</svg>`;
}

const UNI_USER = {
  name: {
    en: "Nadia El Amrani",
    fr: "Nadia El Amrani",
    ar: "نادية العمراني"
  },
  role: {
    en: "Career advisor",
    fr: "Conseillère carrière",
    ar: "مستشارة توجيه"
  }
}, UNAV = [ [ "ov", "grid", "u_nav_ov" ], [ "stu", "users", "u_nav_stu" ], [ "sk", "layers", "u_nav_sk" ], [ "op", "brief", "u_nav_op" ], [ "ver", "shield", "u_nav_ver" ], [ "ins", "spark", "u_nav_ins" ], [ "rep", "download", "u_nav_rep" ], [ "set", "gear", "u_nav_set" ] ];

function uniGroups() {
  const e = queue().length, it = s => {
    const a = UNAV.find(e => e[0] === s);
    return "ver" === s && e ? a.concat(e) : a;
  };
  return [ {
    items: [ it("ov"), it("ver") ]
  }, {
    label: "ug_stu",
    items: [ it("stu"), it("sk"), it("op") ]
  }, {
    label: "ug_act",
    items: [ it("ins"), it("rep"), it("set") ]
  } ];
}

function uniShell(e) {
  return consoleShell({
    kind: "uni",
    groups: uniGroups(),
    cur: ui.uview,
    act: "ugo",
    inner: e,
    org: {
      mono: "zgh" === L() ? "ⵜⵍ" : "UB",
      name: t("u_name"),
      sub: t("u_center")
    },
    user: {
      name: tx(UNI_USER.name),
      role: tx(UNI_USER.role)
    },
    tools: `<span class="pill d-only">${te("u_demo")}</span>`
  });
}

function queue() {
  const e = [];
  return "requested" === S.verify.status && e.push({
    me: !0
  }), UNI.queue.forEach(s => {
    S.uni.handled[s.id] || e.push(s);
  }), e;
}

function hbar(e, s = 100) {
  return e.map(([e, a]) => `<div class="hb-r"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(skName(e))}</span><span class="tr"><i data-w="${a / s * 100}"></i></span><b class="num">${nfmt(a)}%</b></div>`).join("");
}

const UNI_STU = [ {
  id: "s1",
  l: "Rania Alaoui",
  ar: "رانيا العلوي",
  p: "f_eco",
  g: "bizdev",
  r: 68,
  sk: [ "sales", "negotiation", "customer_service", "presentation" ],
  pr: 2,
  v: !0,
  d: 1
}, {
  id: "s2",
  l: "Youssef Bennani",
  ar: "يوسف بناني",
  p: "f_it",
  g: "analyst",
  r: 74,
  sk: [ "sql", "excel", "problem_solving", "powerbi" ],
  pr: 3,
  v: !0,
  d: 0
}, {
  id: "s3",
  l: "Imane Mansouri",
  ar: "إيمان المنصوري",
  p: "f_lang",
  g: "cs",
  r: 61,
  sk: [ "multilingual", "customer_service", "presentation" ],
  pr: 1,
  v: !1,
  d: 2
}, {
  id: "s4",
  l: "Hamza Kadiri",
  ar: "حمزة القادري",
  p: "f_eco",
  g: "retail",
  r: 57,
  sk: [ "cash", "customer_service", "inventory", "sales" ],
  pr: 1,
  v: !0,
  d: 4
}, {
  id: "s5",
  l: "Khadija Ouazzani",
  ar: "خديجة الوزاني",
  p: "f_law",
  g: "supply",
  r: 39,
  sk: [ "research", "presentation", "teamwork" ],
  pr: 0,
  v: !1,
  d: 6
}, {
  id: "s6",
  l: "Mehdi Tazi",
  ar: "المهدي التازي",
  p: "f_eng",
  g: "analyst",
  r: 52,
  sk: [ "excel", "problem_solving", "teamwork" ],
  pr: 1,
  v: !1,
  d: 1
}, {
  id: "s7",
  l: "Aya Berrada",
  ar: "آية برادة",
  p: "f_eco",
  g: "marketing",
  r: 71,
  sk: [ "social_media", "content", "ads", "presentation" ],
  pr: 3,
  v: !0,
  d: 0
}, {
  id: "s8",
  l: "Omar Chraibi",
  ar: "عمر الشرايبي",
  p: "f_it",
  g: "cs",
  r: 46,
  sk: [ "customer_service", "problem_solving" ],
  pr: 0,
  v: !1,
  d: 9
}, {
  id: "s9",
  l: "Nour Fassi",
  ar: "نور الفاسي",
  p: "f_lang",
  g: "events",
  r: 63,
  sk: [ "event", "multilingual", "leadership", "teamwork" ],
  pr: 2,
  v: !1,
  d: 3
}, {
  id: "s10",
  l: "Reda Idrissi",
  ar: "رضا الإدريسي",
  p: "f_eng",
  g: "research",
  r: 33,
  sk: [ "teamwork", "research" ],
  pr: 0,
  v: !1,
  d: 12
} ];

function uniStudents() {
  const e = UNI_STU.map(e => Object.assign({}, e, {
    nm: isAR() ? e.ar : pn(e.l),
    g: opp(e.g) ? e.g : liveOpps()[0].id
  }));
  if (S.share.uni && hasPassport()) {
    const s = S.goal && opp(S.goal);
    e.unshift({
      id: "me",
      nm: S.profile.name,
      p: S.profile.field || "f_other",
      g: s ? s.id : null,
      r: s ? readiness(s) : 0,
      sk: confirmed(),
      pr: proofCount(),
      v: "verified" === S.verify.status,
      d: 0,
      me: !0
    });
  }
  return e;
}

const rCell = e => `<span class="rcell"><span class="tr"><i data-w="${e}"></i></span><b class="num">${nfmt(e)}%</b></span>`;

function vUniOv() {
  const e = UNI.kpi, s = UNI.funnel, a = queue().length, i = [ [ "ua1", 238, "target" ], [ "ua2", 126, "book" ] ].map(([e, s, a]) => {
    const i = S.uni.handled[e];
    return `<article class="attn"><div class="attn-h"><span class="attn-i">${ic(a)}</span><div style="min-width:0"><h3>${te(e + "t")}</h3></div></div>\n      <dl class="attn-d"><div><dt>${te("u_evid")}</dt><dd>${te(e + "e")}</dd></div><div><dt>${te("od_next")}</dt><dd>${te(e + "a")}</dd></div><div><dt>${te("u_outcome")}</dt><dd>${te(e + "o")}</dd></div></dl>\n      <div>${i ? `<span class="pill teal">${ic("check")}${te("u_planned")}</span>` : `<button class="btn sm" data-act="u-plan" data-id="${e}">${ic("plan")}${te("u_plan_btn")}</button>`}</div></article>`;
  }).join("");
  return cHead(t("u_week"), t("u_name") + " · " + t("u_sem"), `<button class="btn ghost sm" data-act="ugo" data-to="rep">${ic("download")}${te("ur_dl_short")}</button>`) + `\n  <div class="kpis">\n    ${kpi(`<span data-count="${e.joined}">0</span>`, te("u_k1"), te("u_k1d", {
    n: nfmt(e.invited)
  }), "+9%", sparkline([ 520, 590, 640, 700, 742, 790, 812 ]))}\n    ${kpi(`<span data-count="${e.skills}">0</span>`, te("u_k2"), te("u_k2d"), "+14%", sparkline([ 2100, 2600, 3e3, 3400, 3900, 4300, 4630 ]))}\n    ${kpi(`<span data-count="${e.hidden}" data-suffix="%">0</span>`, te("u_k3"), te("u_k3d"))}\n    ${kpi(`<span data-count="${e.ready}">0</span>`, te("u_k4"), te("u_k4d"), "+31", sparkline([ 40, 52, 61, 80, 97, 121, 146 ]))}</div>\n  <section class="panel dims"><div class="sec-h" style="margin-top:0"><h3>${te("u_dim_t")}</h3><span class="dim">${te("u_dim_d")}</span></div><div class="dim-grid">${UNI.dims.map(([e, s]) => `<div class="dim-c"><b class="num" data-count="${s}" data-suffix="%">0%</b><span>${te(e)}</span><span class="tr"><i data-w="${s}"></i></span></div>`).join("")}</div></section>\n  <section><div class="sec-h"><h2>${te("u_attn")}</h2>${a ? `<button class="btn sm" data-act="ugo" data-to="ver">${ic("shield")}${te("uc2", {
    n: nfmt(a)
  })}</button>` : ""}</div><div class="attn-grid">${i}</div></section>\n  <div class="two"><section class="panel"><div class="sec-h" style="margin-top:0"><h3>${te("u_act")}</h3><span class="dim">${te("u_act_i")}</span></div>${areaChart(UNI.active, UNI.months[L()] || UNI.months[LK()], t("u_act"))}</section>\n    <section class="panel"><h3 style="margin-bottom:16px">${te("u_funnel")}</h3><div class="funnel">${s.map((e, a) => `<div class="fn"><span>${te("u_f" + a)}</span><span class="tr"><i data-w="${e / s[0] * 100}"></i></span><b class="num">${nfmt(e)}</b></div>`).join("")}</div></section></div>\n  <div class="two eq"><section class="panel"><h3 style="margin-bottom:14px">${te("u_gaps")}</h3><div class="hb">${hbar(UNI.gaps)}</div><button class="linkbtn" data-act="ugo" data-to="sk" style="margin-top:12px">${te("u_see_sk")} ${ic("arrow")}</button></section><section class="panel"><h3 style="margin-bottom:14px">${te("u_str")}</h3><div class="hb str">${hbar(UNI.strengths)}</div></section></div>\n  <section class="panel outc"><div class="sec-h" style="margin-top:0"><h3>${te("u_out_t")}</h3><span class="pill">${te("u_out_sr")}</span></div><div class="outc-row">${UNI.outcomes.map(([e, s]) => `<div><b class="num" data-count="${s}">0</b><span>${te(e)}</span></div>`).join("")}</div><p class="dim fine">${te("u_out_d")}</p></section>\n  <p class="dim fine">${smallIc("lock")} ${te("u_priv2", {
    n: nfmt(S.uni.minGroup || 10)
  })}</p>`;
}

function vUniStudents() {
  const e = ui.uStuTab || "shared", s = `<div class="tabs" role="tablist">${[ [ "shared", "users", "us_tab_sh" ], [ "prog", "layers", "us_tab_pr" ] ].map(([s, a, i]) => `<button role="tab" data-act="u-stu-tab" data-t="${s}" aria-selected="${e === s}">${ic(a)}${te(i)}</button>`).join("")}</div>`;
  if ("prog" === e) return cHead(t("u_nav_stu"), t("u_stu_d")) + s + vUniCoh();
  const a = uniStudents(), i = norm(ui.uQ || "").toLowerCase(), o = ui.uProg || "all", r = a.filter(e => ("all" === o || e.p === o) && (!i || norm(e.nm).toLowerCase().includes(i)));
  return cHead(t("u_nav_stu"), t("u_stu_d")) + s + `\n  <div class="filters"><label class="srch">${ic("search")}<span class="sr">${te("u_find")}</span><input id="uQ" class="inp" placeholder="${te("u_find")}" value="${esc(ui.uQ || "")}"></label>\n    <div class="chips-wrap">${[ "all" ].concat(UNI.programmes.map(e => e.p)).map(e => `<button class="chip ${o === e ? "on" : ""}" data-act="u-prog" data-p="${e}" aria-pressed="${o === e}">${te("all" === e ? "all" : e)}</button>`).join("")}</div></div>\n  <section class="panel flush"><div class="tbl-wrap"><table class="tbl hover"><thead><tr><th scope="col">${te("u_th_n2")}</th><th scope="col">${te("u_th_p")}</th><th scope="col">${te("u_th_goal")}</th><th scope="col">${te("u_th_r")}</th><th scope="col">${te("st_proof")}</th><th scope="col">${te("u_th_last")}</th></tr></thead><tbody>\n  ${r.map(e => `<tr data-act="u-stu" data-id="${e.id}" tabindex="0"><th scope="row"><span class="who">${avatar(initials(e.nm))}<span>${esc(e.nm)}${e.me ? ` <span class="pill teal">${te("u_new_share")}</span>` : ""}${e.v ? ` ${smallIc("shield", "#0F3D36")}` : ""}</span></span></th><td>${te(e.p)}</td><td>${e.g ? esc(tx(opp(e.g).short)) : "—"}</td><td>${rCell(e.r)}</td><td class="num">${nfmt(e.pr)}</td><td class="dim">${esc(daysAgo(e.d))}</td></tr>`).join("") || `<tr><td colspan="6" class="dim">${te("u_none")}</td></tr>`}\n  </tbody></table></div></section>\n  <p class="dim fine">${smallIc("lock")} ${te("u_stu_priv", {
    n: nfmt(a.length),
    m: nfmt(UNI.kpi.joined)
  })}</p>`;
}

function stuDrawer(e) {
  const s = uniStudents().find(s => s.id === e);
  if (!s) return;
  const a = s.g && opp(s.g);
  modal(`<div class="dr-h"><span class="who lg">${avatar(initials(s.nm), "lg")}<span><h2>${esc(s.nm)}</h2><small class="dim">${te(s.p)}${s.v ? " · " + te("st_ver") : ""}</small></span></span><button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button></div>\n    <div class="dr-b">\n      ${a ? `<section class="dr-s"><p class="eyebrow">${te("u_th_goal")}</p><div class="dr-goal">${ring(s.r, 84, 8)}<div><b>${esc(tx(a.title))}</b><small class="dim">${bdi(a.org)} · ${esc(tx(C[a.city]))}</small></div></div></section>` : ""}\n      <section class="dr-s"><p class="eyebrow">${te("pp_skills")} · <span class="num">${nfmt(s.sk.length)}</span></p><div class="chips-wrap" style="justify-content:flex-start">${s.sk.map((e, a) => stateTag(s.me ? skillState(e) : s.v && a < 2 ? "ver" : a < s.pr ? "proven" : "conf", skName(e))).join("")}</div></section>\n      ${a ? `<section class="dr-s"><p class="eyebrow">${te("hm_missing")}</p><div class="chips-wrap" style="justify-content:flex-start">${a.req.filter(([e]) => !s.sk.includes(e)).map(([e]) => stateTag("miss", skName(e))).join("") || '<span class="dim">—</span>'}</div></section>` : ""}\n      <section class="dr-s"><p class="eyebrow">${te("u_dr_act")}</p><div class="dr-acts">\n        <button class="btn sm" data-act="u-nudge" data-id="${s.id}">${ic("book")}${te("u_dr_ws")}</button>\n        <button class="btn ghost sm" data-act="u-meet" data-id="${s.id}">${ic("chat")}${te("u_dr_meet")}</button></div></section>\n      <p class="dim fine">${smallIc("lock")} ${te("u_dr_priv")}</p>\n    </div>`, "side");
}

function vUniCoh() {
  return `<section class="panel flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("u_th_p")}</th><th scope="col">${te("u_th_n")}</th><th scope="col">${te("u_th_pp")}</th><th scope="col">${te("u_th_gap")}</th><th scope="col">${te("u_th_r")}</th></tr></thead><tbody>\n  ${UNI.programmes.map(e => `<tr><th scope="row">${te(e.p)}</th><td class="num">${nfmt(e.n)}</td><td class="num">${nfmt(e.pp)} <span class="dim">(${nfmt(Math.round(e.pp / e.n * 100))}%)</span></td><td>${stateTag("miss", skName(e.gap))}</td><td>${rCell(e.r)}</td></tr>`).join("")}\n  </tbody></table></div></section><p class="dim fine">${smallIc("lock")} ${te("u_priv", {
    n: nfmt(S.uni.minGroup || 10)
  })}</p>`;
}

const HEAT_SK = [ "customer_service", "sales", "negotiation", "excel", "crm", "sql", "presentation", "multilingual" ], HEAT = {
  f_eco: [ 64, 52, 31, 38, 14, 6, 41, 33 ],
  f_it: [ 22, 12, 8, 61, 9, 48, 29, 27 ],
  f_lang: [ 47, 18, 15, 19, 4, 3, 52, 78 ],
  f_law: [ 28, 10, 24, 22, 3, 2, 57, 36 ],
  f_eng: [ 19, 15, 11, 58, 7, 31, 34, 24 ]
};

function vUniSkills() {
  const e = liveOpps(), demand = s => Math.round(e.filter(e => e.req.some(e => e[0] === s)).length / Math.max(1, e.length) * 100), s = UNI.programmes.reduce((e, s) => e + s.n, 0), supply = (e, a) => Math.round(UNI.programmes.reduce((e, s) => e + HEAT[s.p][a] * s.n, 0) / s), a = HEAT_SK.map((e, s) => ({
    id: e,
    d: demand(e),
    s: supply(0, s)
  })).sort((e, s) => s.d - s.s - (e.d - e.s)), i = ui.heatSel;
  return cHead(t("u_nav_sk"), t("u_sk_d")) + `\n  <section class="panel"><div class="sec-h" style="margin-top:0"><h3>${te("u_heat")}</h3><span class="heat-key"><i style="--v:.12"></i><i style="--v:.4"></i><i style="--v:.7"></i><i style="--v:1"></i><span class="dim">${te("u_heat_k")}</span></span></div>\n    <div class="tbl-wrap"><table class="heat"><thead><tr><th scope="col"><span class="sr">${te("u_th_p")}</span></th>${HEAT_SK.map(e => `<th scope="col"><span>${esc(skName(e))}</span></th>`).join("")}</tr></thead><tbody>\n    ${UNI.programmes.map(e => `<tr><th scope="row">${te(e.p)}</th>${HEAT[e.p].map((s, a) => `<td><button class="hc ${i === e.p + a ? "sel" : ""} ${s / 80 >= .7 ? "hi" : ""}" style="--v:${(s / 80).toFixed(2)}" data-act="heat" data-k="${e.p + a}" aria-label="${te(e.p)} · ${esc(skName(HEAT_SK[a]))} · ${nfmt(s)}%"><span class="num">${nfmt(s)}</span></button></td>`).join("")}</tr>`).join("")}</tbody></table></div>\n    <p class="dim fine" id="heatNote">${i ? (() => {
    const e = i.replace(/\d+$/, ""), s = +i.match(/\d+$/)[0];
    return te("u_heat_sel", {
      p: t(e),
      x: skName(HEAT_SK[s]),
      n: nfmt(HEAT[e][s])
    });
  })() : te("u_heat_hint")}</p></section>\n  <section class="panel"><div class="sec-h" style="margin-top:0"><h3>${te("u_dvs")}</h3><span class="lg2"><i class="d"></i>${te("u_dem")}<i class="s"></i>${te("u_sup")}</span></div>\n    <div class="dvs">${a.map(e => `<div class="dvs-r"><span>${esc(skName(e.id))}</span><div class="dvs-b"><span class="tr d"><i data-w="${e.d}"></i></span><span class="tr s"><i data-w="${e.s}"></i></span></div><b class="num ${e.d - e.s > 15 ? "gap" : ""}"><bdi dir="ltr">${e.d - e.s > 0 ? "−" : "+"}${nfmt(Math.abs(e.d - e.s))}</bdi></b></div>`).join("")}</div>\n    <p class="dim fine">${te("u_dvs_d", {
    n: nfmt(e.length)
  })}</p></section>`;
}

function vUniOpps() {
  const e = liveOpps(), seed = e => [ ...e ].reduce((e, s) => e + s.charCodeAt(0), 0), s = e.map(e => {
    const s = 18 + seed(e.id) % 70, a = 38 + seed(e.org) % 34, i = (e.req.find(([e, s]) => s && HEAT_SK.includes(e) && supplyOf(e) < 30) || e.req.find(e => e[1]) || e.req[0])[0];
    return {
      o: e,
      n: s,
      r: a,
      gap: i
    };
  }).sort((e, s) => s.n - e.n);
  return cHead(t("u_nav_op"), t("u_op_d")) + `\n  <section class="panel flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("u_th_role")}</th><th scope="col">${te("u_th_tg")}</th><th scope="col">${te("u_th_r")}</th><th scope="col">${te("u_th_gap")}</th><th scope="col"><span class="sr">${te("u_th_act")}</span></th></tr></thead><tbody>\n  ${s.map(({o: e, n: s, r: a, gap: i}) => `<tr><th scope="row"><span class="who"><span class="logo sm">${esc(e.ini)}</span><span>${esc(tx(e.title))}<small class="dim">${bdi(e.org)} · ${esc(tx(C[e.city]))}</small></span></span></th><td class="num">${nfmt(s)}</td><td>${rCell(a)}</td><td>${stateTag("miss", skName(i))}</td>\n    <td>${S.uni.handled["op_" + e.id] ? `<span class="pill teal">${ic("check")}${te("u_shared_ok")}</span>` : `<button class="btn ghost sm" data-act="u-share-op" data-id="${e.id}">${ic("send")}${te("u_share_op")}</button>`}</td></tr>`).join("")}\n  </tbody></table></div></section>\n  <p class="dim fine">${smallIc("info")} ${te("u_op_note")}</p>`;
}

function supplyOf(e) {
  const s = HEAT_SK.indexOf(e);
  if (s < 0) return 50;
  const a = UNI.programmes.reduce((e, s) => e + s.n, 0);
  return Math.round(UNI.programmes.reduce((e, a) => e + HEAT[a.p][s] * a.n, 0) / a);
}

function vUniVer() {
  const e = queue();
  return cHead(t("u_q_t"), t("u_q_d"), `<span class="pill num">${nfmt(e.length)}</span>`) + `\n    <div class="ver-rules panel flat">${ic("info")}<div><b>${te("u_vr_t")}</b><ul>${[ 1, 2, 3 ].map(e => `<li>${te("u_vr" + e)}</li>`).join("")}</ul></div></div>\n    <div class="q-list" id="qList">${e.length ? e.map(e => {
    if (e.me) {
      const e = confirmed(), s = e.slice(0, 3);
      return `<article class="q-card new" data-q="me">${avatar(initials(S.profile.name))}<div style="min-width:0"><div class="q-top"><b>${esc(S.profile.name || "—")}</b><span class="pill teal">${te("u_new")}</span></div>\n      <p class="dim" style="font-size:12px;margin-top:4px">${smallIc("share")} ${te("u_shared")}</p>\n      <div class="chips-wrap" style="justify-content:flex-start;margin-top:8px">${s.map(e => stateTag(skillState(e), skName(e))).join("")}${e.length > 3 ? `<span class="chip">+${nfmt(e.length - 3)}</span>` : ""}</div>\n      ${s[0] ? `<blockquote>${esc((S.skills[s[0]].ev[0] || {}).text || "")}</blockquote>` : ""}<p class="dim" style="font-size:13px">${te("u_proof")}${CL()}${te("vs2d", {
        n: nfmt(proofCount())
      })}</p>\n      <div class="q-acts"><button class="btn sm" data-act="u-verify" data-id="me">${ic("check")}${te("u_verify")}</button><button class="btn ghost sm" data-act="u-more" data-id="me">${te("u_more")}</button></div></div></article>`;
    }
    const s = isAR() ? (UNI_STU.find(s => s.l.startsWith(e.name.split(" ")[0])) || {
      ar: e.name
    }).ar : pn(e.name);
    return `<article class="q-card" data-q="${e.id}">${avatar(e.ini)}<div style="min-width:0"><div class="q-top"><b>${esc(s)}</b>${stateTag("conf", skName(e.skill))}<span class="dim" style="font-size:13px">${te(e.p)}</span></div>\n      <blockquote>${esc(tx(e.ev))}</blockquote><p class="dim" style="font-size:13px">${smallIc("file")} ${te("u_proof")}${CL()}${esc(tx(e.proof))}</p>\n      <div class="q-acts"><button class="btn sm" data-act="u-verify" data-id="${e.id}">${ic("check")}${te("u_verify")}</button><button class="btn ghost sm" data-act="u-more" data-id="${e.id}">${te("u_more")}</button></div></div></article>`;
  }).join("") : `<section class="panel empty-c"><span class="ds-i">${ic("check")}</span><p class="mute">${te("u_q_empty")}</p></section>`}</div>`;
}

const BASE_INS = [ [ "ui1t", "ui1d", "ui1a", "target" ], [ "ui2t", "ui2d", "ui2a", "book" ], [ "ui3t", "ui3d", "ui3a", "star" ] ];

function vUniIns() {
  const e = S.uni.insights || BASE_INS.map(([e, s, a, i]) => ({
    title: t(e),
    detail: t(s),
    action: t(a),
    icon: i
  }));
  return cHead(t("u_nav_ins"), t(aiOn() ? "u_ins_d" : "u_ins_d_rules"), aiOn() ? `<button class="btn" data-act="u-ins">${ic("spark")}${te("u_ins_go")}</button>` : aiPill()) + `\n    <p class="dim fine">${S.uni.insights && S.uni.insightsAI ? `${smallIc("spark", "#0F3D36")} ${te("u_ins_ai")}` : te("u_ins_base")}</p>\n    <div class="ins-list" id="insList">${e.map((e, s) => `<article class="ins" style="animation-delay:${90 * s}ms"><i>${ic(e.icon || [ "target", "book", "star" ][s % 3])}</i><div style="min-width:0"><b>${esc(e.title)}</b><p>${esc(e.detail)}</p><p class="act">${ic("arrow")}${esc(e.action)}</p></div><button class="btn ghost sm" data-act="u-ins-plan" data-i="${s}" ${S.uni.handled["ins" + s] ? "disabled" : ""}>${ic(S.uni.handled["ins" + s] ? "check" : "plan")}${te(S.uni.handled["ins" + s] ? "u_planned" : "u_plan_btn")}</button></article>`).join("")}</div>`;
}

function reportCSV(e) {
  if (1 === e) return csv([ [ t("csv_metric"), t("csv_value") ] ].concat(UNI.funnel.map((e, s) => [ t("u_f" + s), e ])).concat([ [ t("u_k3"), UNI.kpi.hidden + "%" ] ]));
  if (2 === e) return csv([ [ t("u_th_p"), t("u_th_n"), t("u_th_pp"), t("u_th_gap"), t("u_th_r") ] ].concat(UNI.programmes.filter(e => e.n >= (S.uni.minGroup || 10)).map(e => [ t(e.p), e.n, e.pp, skName(e.gap), e.r + "%" ])));
  const s = [ [ t("oa_when"), t("u_th_n2"), t("pp_skills"), t("o_th_s"), t("csv_signer") ] ], a = t("u_console");
  return UNI.queue.forEach(e => {
    const i = S.uni.handled[e.id];
    "verified" !== i && "asked" !== i || s.push([ dateFmt(Date.now()), "string" == typeof e.name ? pn(e.name) : tx(e.name), skName(e.skill), t("verified" === i ? "csv_st_ver" : "csv_st_more"), a ]);
  }), "verified" === S.verify.status && s.push([ dateFmt(S.verify.at), S.profile.name, confirmed().map(skName).join(" · "), t("csv_st_ver"), a ]), 
  csv(s);
}

function vUniRep() {
  return cHead(t("ur_t"), t("ur_d")) + `\n    <div class="rep-list">${[ 1, 2, 3 ].map(e => `<article class="rep"><span class="attn-i">${ic([ "chart", "layers", "shield" ][e - 1])}</span><div style="min-width:0"><h3>${te("ur" + e + "t")}</h3><p class="mute">${te("ur" + e + "d")}</p><small class="dim">CSV · UTF-8 · ${te("ur_upd")}</small></div><button class="btn ghost sm" data-act="u-rep" data-k="${e}">${ic("download")}${te("ur_dl")}</button></article>`).join("")}</div>\n    <p class="dim fine">${smallIc("lock")} ${te("u_priv2", {
    n: nfmt(S.uni.minGroup || 10)
  })}</p>`;
}

function vUniSet() {
  const e = S.uni.minGroup || 10, s = [ [ "r_admin", "r_admin_d", UNI_USER_ADMIN ], [ "r_adv", "r_adv_d", UNI_USER, 1 ], [ "r_view", "r_view_d", UNI_USER_VIEW ] ];
  return cHead(t("us_t"), t("u_name")) + `\n    <section class="panel"><h2 class="set-h">${ic("building")}${te("us_org")}</h2><dl class="kv">${[ [ "oi_name", t("u_name") ], [ "oi_city", tx(C.tng) ], [ "us_progs", nfmt(UNI.programmes.length) ], [ "us_sso", t("us_sso_on") ] ].map(([e, s]) => `<div><dt>${te(e)}</dt><dd>${esc(s)}</dd></div>`).join("")}</dl></section>\n    <section class="panel"><div class="set-row" style="border:0"><span><b>${te("us_priv")}</b><span>${te("us_priv_d")}</span></span><div class="seg" role="group" aria-label="${te("us_priv")}">${[ 10, 20, 30 ].map(s => `<button data-act="u-min" data-n="${s}" aria-pressed="${e === s}">${te("us_min", {
    n: nfmt(s)
  })}</button>`).join("")}</div></div></section>\n    <section class="panel"><h2 class="set-h">${ic("users")}${te("us_roles")}</h2><div class="set-list">${s.map(([e, s, a, i]) => `<div class="set-row"><span class="who">${avatar(initials(tx(a.name)))}<span><b>${esc(tx(a.name))} ${i ? `<span class="pill teal">${te("us_you")}</span>` : ""}</b><span>${te(e)} · ${te(s)}</span></span></span>${ic(i ? "user" : "lock")}</div>`).join("")}</div></section>`;
}

const UNI_USER_ADMIN = {
  name: {
    en: "Karim Lahlou",
    fr: "Karim Lahlou",
    ar: "كريم لحلو"
  }
}, UNI_USER_VIEW = {
  name: {
    en: "Dean's office",
    fr: "Décanat",
    ar: "عمادة الكلية"
  }
}, UVIEWS = {
  ov: vUniOv,
  stu: vUniStudents,
  sk: vUniSkills,
  op: vUniOpps,
  ver: vUniVer,
  ins: vUniIns,
  rep: vUniRep,
  set: vUniSet
}, OPS_USER = {
  name: {
    en: "Mourad Lahrichi",
    fr: "Mourad Lahrichi",
    ar: "مراد الحريشي"
  },
  role: {
    en: "Platform operator",
    fr: "Opérateur plateforme",
    ar: "مشغّل المنصة"
  }
}, ONAV = [ [ "ov", "grid", "o_nav_ov" ], [ "inst", "building", "o_nav_inst" ], [ "impact", "star", "o_nav_impact" ], [ "users", "users", "o_nav_users" ], [ "skills", "layers", "o_nav_skills" ], [ "opps", "brief", "o_nav_opps" ], [ "quality", "activity", "o_nav_quality" ], [ "audit", "list", "o_nav_audit" ], [ "set", "gear", "o_nav_set" ] ];

function opsGroups() {
  const e = allInsts().filter(e => "pending" === e.status).length, s = skillFlags().length + S.runs.filter(e => !e.ok).length, it = (e, s) => ONAV.find(s => s[0] === e).concat(s ? [ s ] : []), a = S.access.filter(e => !e.status).length;
  return [ {
    items: [ it("ov"), it("inst", e), it("impact", a) ]
  }, {
    label: "og_people",
    items: [ it("users") ]
  }, {
    label: "og_content",
    items: [ it("skills"), it("opps") ]
  }, {
    label: "og_quality",
    items: [ it("quality", s), it("audit"), it("set") ]
  } ];
}

function opsShell(e) {
  return consoleShell({
    kind: "ops",
    groups: opsGroups(),
    cur: ui.ops,
    act: "ogo",
    inner: e,
    org: {
      mono: "zgh" === L() ? "ⵜⵏ" : isAR() ? "ع" : "OPS",
      name: t("o_org"),
      sub: t("o_org_sub")
    },
    user: {
      name: tx(OPS_USER.name),
      role: tx(OPS_USER.role)
    },
    tools: `<span class="env d-only"><span class="live-d"></span>${te("o_env")}</span>${S.ops.maint ? `<span class="pill warn">${ic("alert")}${te("o_maint_on")}</span>` : ""}`
  });
}

const tmShort = e => {
  if ("zgh" === L()) {
    const s = new Date(e);
    return s.getDate() + " " + ZM[s.getMonth()] + " · " + hm(s);
  }
  try {
    return new Intl.DateTimeFormat(LOC(), {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(e));
  } catch (e) {
    return "";
  }
}, statusPill = e => `<span class="status s-${e}">${te("ost_" + e)}</span>`, INST_BASE = [ {
  id: "boughaz",
  name: () => t("u_name"),
  city: "tng",
  st: 812,
  ver: () => 41 + Object.values(S.uni.handled).filter(e => "verified" === e).length + ("verified" === S.verify.status ? 1 : 0),
  status: "active",
  since: Date.UTC(2026, 1, 9),
  contact: () => tx(UNI_USER.name),
  plan: "o_plan_pilot"
}, {
  id: "atlas",
  name: () => isAR() ? "مدرسة الأطلس للأعمال" : pn("Atlas Business School"),
  city: "casa",
  st: 430,
  ver: () => 57,
  status: "active",
  since: Date.UTC(2026, 5, 2),
  contact: () => isAR() ? "ليلى حداد" : pn("Leila Haddad"),
  plan: "o_plan_pilot"
}, {
  id: "rif",
  name: () => isAR() ? "مركز سايس للتكوين" : "fr" === L() ? "Centre de formation du Saïs" : pn("Saïs Training Centre"),
  city: "fes",
  st: 0,
  ver: () => 0,
  status: "setup",
  since: Date.UTC(2026, 8, 21),
  contact: () => isAR() ? "أنس الزياني" : pn("Anas Ziani"),
  plan: "o_plan_setup"
} ];

function allInsts() {
  return INST_BASE.map(e => ({
    id: e.id,
    name: e.name(),
    city: e.city,
    st: e.st,
    ver: e.ver(),
    status: S.ops.inst[e.id] || e.status,
    since: e.since,
    contact: e.contact(),
    plan: e.plan,
    base: !0
  })).concat(S.pilots.map(e => ({
    id: e.id,
    name: e.inst,
    city: e.city,
    st: 0,
    ver: 0,
    status: S.ops.inst[e.id] || "pending",
    since: e.at,
    contact: e.name,
    email: e.email,
    role: e.role,
    size: e.size,
    plan: "o_plan_req"
  })));
}

function skillFlags() {
  return Object.entries(S.decisions).filter(([e, s]) => SK[e] && s.no >= 1 && s.no / ((s.yes || 0) + s.no) >= .4).map(([e, s]) => ({
    id: e,
    rate: Math.round(s.no / ((s.yes || 0) + s.no) * 100),
    n: (s.yes || 0) + s.no
  }));
}

function vOpsOv() {
  const e = S.runs, s = e.filter(e => "ai" === e.engine), a = s.filter(e => e.ok).map(e => e.ms).sort((e, s) => e - s), i = a.length ? a[Math.floor(a.length / 2)] : 0, o = a.length ? a[Math.min(a.length - 1, Math.floor(.95 * a.length))] : 0, r = Object.values(S.decisions), l = r.reduce((e, s) => e + (s.yes || 0), 0), c = r.reduce((e, s) => e + (s.no || 0), 0), p = allInsts(), d = p.filter(e => "pending" === e.status), u = skillFlags(), _ = e.filter(e => !e.ok), h = S.feedback.filter(e => !e.done), v = [];
  d.forEach(e => v.push(`<article class="attn-row"><span class="attn-i">${ic("building")}</span><div><b>${te("o_a_pilot", {
    x: e.name
  })}</b><small class="dim">${esc(e.contact)} · ${esc(tx(C[e.city] || C.casa))} · ${esc(tmShort(e.since))}</small></div><button class="btn sm" data-act="pal-go" data-h="#/ops/institutions/${e.id}">${te("o_review")}</button></article>`)), 
  u.forEach(e => v.push(`<article class="attn-row"><span class="attn-i warn">${ic("alert")}</span><div><b>${te("o_a_flag", {
    x: skName(e.id),
    p: nfmt(e.rate)
  })}</b><small class="dim">${te("o_a_flag_d", {
    n: nfmt(e.n)
  })}</small></div><button class="btn ghost sm" data-act="ogo" data-to="skills">${te("o_review")}</button></article>`)), 
  _.length && v.push(`<article class="attn-row"><span class="attn-i warn">${ic("activity")}</span><div><b>${te("o_a_fail", {
    n: nfmt(_.length)
  })}</b><small class="dim">${te("o_a_fail_d")}</small></div><button class="btn ghost sm" data-act="ogo" data-to="quality">${te("o_review")}</button></article>`), 
  S.access.filter(e => !e.status).forEach(e => v.push(`<article class="attn-row"><span class="attn-i">${ic("star")}</span><div><b>${te("o_a_access", {
    x: e.name
  })}</b><small class="dim">${esc(e.place)} · ${esc(tmShort(e.at))}</small></div><button class="btn sm" data-act="ogo" data-to="impact">${te("o_review")}</button></article>`)), 
  (S.employers || []).filter(e => !e.done).forEach(e => v.push(`<article class="attn-row"><span class="attn-i">${ic("brief")}</span><div><b>${te("o_a_emp", {
    x: e.org
  })}</b><small class="dim">${esc(e.roles || "—")}${e.intern ? " · " + te("em_intern") : ""} · ${esc(tmShort(e.at))}</small></div><button class="btn ghost sm" data-act="o-req-done" data-k="employers" data-id="${e.id}">${ic("check")}${te("o_done")}</button></article>`)), 
  (S.partners || []).filter(e => !e.done).forEach(e => v.push(`<article class="attn-row"><span class="attn-i">${ic("book")}</span><div><b>${te("o_a_partner", {
    x: e.org
  })}</b><small class="dim">${esc(e.skills || "—")} · ${esc(tmShort(e.at))}</small></div><button class="btn ghost sm" data-act="o-req-done" data-k="partners" data-id="${e.id}">${ic("check")}${te("o_done")}</button></article>`)), 
  h.forEach(e => v.push(`<article class="attn-row"><span class="attn-i">${ic("inbox")}</span><div><b>${te("o_a_fb")}</b><q class="fb-q">${esc(e.text)}</q><small class="dim">${esc(tmShort(e.t))}</small></div><button class="btn ghost sm" data-act="o-fb-done" data-id="${e.id}">${ic("check")}${te("o_done")}</button></article>`));
  const f = UNI.months[L()] || UNI.months[LK()];
  return cHead(t("o_title"), t("o_sub")) + `\n  <section><div class="sec-h"><h2>${te("o_attn")}</h2><span class="dim num">${nfmt(v.length)}</span></div>${v.length ? `<div class="attn-list panel flush">${v.join("")}</div>` : `<div class="panel empty-c"><span class="ds-i">${ic("check")}</span><p class="mute">${te("o_attn_0")}</p></div>`}</section>\n  <h2 class="sub-h">${te("o_platform")} <span class="pill">${te("demo")}</span></h2>\n  <div class="kpis">\n    ${kpi(nfmt(p.filter(e => [ "active", "setup" ].includes(e.status)).length), te("o_k_inst"), te("o_k_inst_d", {
    n: nfmt(d.length)
  }))}\n    ${kpi(nfmt(p.reduce((e, s) => e + s.st, 0)), te("o_k_stu"), te("o_k_stu_d"), "+12%", sparkline([ 620, 700, 760, 880, 940, 1080, 1242 ]))}\n    ${kpi(nfmt(liveOpps().length) + `<small class="of">/${nfmt(OPPS.length)}</small>`, te("o_k_opps"), te("o_k_opps_d"))}\n    ${kpi(nfmt(Object.keys(SK).length - Object.values(S.ops.skillOff).filter(Boolean).length), te("o_tax"), "zgh" === L() ? "1" : "skills-v1")}</div>\n  <div class="two"><section class="panel"><div class="sec-h" style="margin-top:0"><h3>${te("o_runs_chart")}</h3><span class="dim">${te("o_runs_chart_d")}</span></div>${areaChart([ 310, 420, 515, 498, 466, 702, 1180 ], f, t("o_runs_chart"))}</section>\n    <section class="panel live-p"><div class="sec-h" style="margin-top:0"><h3>${te("o_live")}</h3><span class="env"><span class="live-d"></span>${te("o_live_tag")}</span></div><dl class="kv big">\n      <div><dt>${te("o_runs")}</dt><dd class="num">${nfmt(e.length)} <small class="dim">${te("who_ai")} ${nfmt(s.length)} · ${te("o_fallback")} ${nfmt(e.length - s.length)}</small></dd></div>\n      <div><dt>${te("o_latency")}</dt><dd class="num"><bdi dir="ltr">${i ? (i / 1e3).toFixed(1) + ("zgh" === L() ? " ⵜⵙ" : " s") : "—"}${o ? " · p95 " + (o / 1e3).toFixed(1) + ("zgh" === L() ? " ⵜⵙ" : " s") : ""}</bdi></dd></div>\n      <div><dt>${te("o_conf_rate")}</dt><dd class="num">${l + c ? pc(Math.round(l / (l + c) * 100)) : "—"} <small class="dim">${nfmt(l)}/${nfmt(l + c)}</small></dd></div>\n      <div><dt>${te("o_engine")}</dt><dd>${S.ops.rulesOnly ? te("o_engine_rules") : te(aiOn() ? "o_engine_ai" : "o_engine_rules")}</dd></div></dl></section></div>`;
}

function vOpsInst() {
  if (ui.instSel) {
    const e = allInsts().find(e => e.id === ui.instSel);
    if (e) return instDetail(e);
  }
  const e = allInsts(), s = ui.instF || "all", a = e.filter(e => "all" === s || e.status === s);
  return cHead(t("oi_t"), t("oi_d"), `<span class="pill">${te("demo")}</span>`) + `\n  <div class="filters"><div class="chips-wrap">${[ "all", "pending", "active", "setup", "paused" ].map(a => `<button class="chip ${s === a ? "on" : ""}" data-act="o-inst-f" data-f="${a}" aria-pressed="${s === a}">${te("all" === a ? "all" : "ost_" + a)} <span class="num dim">${nfmt("all" === a ? e.length : e.filter(e => e.status === a).length)}</span></button>`).join("")}</div></div>\n  <section class="panel flush"><div class="tbl-wrap"><table class="tbl hover"><thead><tr><th scope="col">${te("oi_name")}</th><th scope="col">${te("oi_city")}</th><th scope="col">${te("oi_st")}</th><th scope="col">${te("oi_ver")}</th><th scope="col">${te("oi_state")}</th><th scope="col">${te("oi_since")}</th></tr></thead><tbody>\n  ${a.map(e => `<tr data-act="pal-go" data-h="#/ops/institutions/${e.id}" tabindex="0"><th scope="row"><span class="who"><span class="logo sm">${esc(initials(e.name))}</span><span>${esc(e.name)}<small class="dim">${esc(e.contact)}</small></span></span></th><td>${esc(tx(C[e.city] || C.casa))}</td><td class="num">${nfmt(e.st)}</td><td class="num">${nfmt(e.ver)}</td><td>${statusPill(e.status)}</td><td class="dim num">${esc(dateFmt(e.since))}</td></tr>`).join("") || `<tr><td colspan="6" class="dim">${te("u_none")}</td></tr>`}\n  </tbody></table></div></section>`;
}

function instDetail(e) {
  const s = [];
  "pending" === e.status && s.push(`<button class="btn" data-act="o-inst" data-id="${e.id}" data-s="setup">${ic("check")}${te("o_approve")}</button><button class="btn ghost" data-act="o-inst" data-id="${e.id}" data-s="declined">${te("o_decline")}</button>`), 
  "setup" === e.status && s.push(`<button class="btn" data-act="o-inst" data-id="${e.id}" data-s="active">${ic("power")}${te("o_activate")}</button>`), 
  "active" === e.status && s.push(`<button class="btn ghost" data-act="o-inst" data-id="${e.id}" data-s="paused">${te("o_pause")}</button>`), 
  "paused" !== e.status && "declined" !== e.status || s.push(`<button class="btn ghost" data-act="o-inst" data-id="${e.id}" data-s="${"paused" === e.status ? "active" : "pending"}">${te("paused" === e.status ? "o_resume" : "o_reopen")}</button>`);
  const a = Math.max(0, [ "pending", "setup", "active" ].indexOf("paused" === e.status ? "active" : e.status));
  return `<button class="back-l" data-act="pal-go" data-h="#/ops/institutions">${ic("back")}${te("oi_t")}</button>` + cHead(e.name, `${tx(C[e.city] || C.casa)} · ${t(e.plan)}`, s.join("")) + `\n  <div class="kpis">${kpi(nfmt(e.st), te("oi_st"))}${kpi(nfmt(e.ver), te("oi_ver"))}${kpi(statusPill(e.status), te("oi_state"))}${kpi(esc(dateFmt(e.since)), te("oi_since"))}</div>\n  <div class="two eq"><section class="panel"><h3 class="set-h">${ic("user")}${te("oi_contact")}</h3><dl class="kv">${[ [ "pf_name", e.contact ], [ "pf_role", e.role || (e.base ? t("r_admin") : "—") ], [ "pf_email", e.email || (e.base ? "—" : "") ], [ "pf_size", e.size || "—" ] ].filter(e => "" !== e[1]).map(([e, s]) => `<div><dt>${te(e)}</dt><dd>${esc(s)}</dd></div>`).join("")}</dl></section>\n    <section class="panel"><h3 class="set-h">${ic("plan")}${te("oi_onb")}</h3><ol class="onb">${[ "oi_s1", "oi_s2", "oi_s3" ].map((s, i) => `<li class="${i < a || "active" === e.status ? "done" : i === a ? "now" : ""}"><i>${ic(i < a || "active" === e.status ? "check" : "clock")}</i><span>${te(s)}</span></li>`).join("")}</ol></section></div>\n  ${"boughaz" === e.id ? `<section class="panel row-a"><span>${te("oi_open_d")}</span><button class="btn ghost sm" data-act="portal" data-p="uni">${ic("eye")}${te("oi_open")}</button></section>` : ""}`;
}

const USERS_BASE = [ {
  id: "u1",
  n: OPS_USER.name,
  e: "m.lahrichi@skilma.ma",
  r: "rl_op",
  org: "SKILMA",
  last: 0,
  you: !0
}, {
  id: "u2",
  n: {
    en: "Hind Berrada",
    fr: "Hind Berrada",
    ar: "هند برادة"
  },
  e: "h.berrada@skilma.ma",
  r: "rl_rev",
  org: "SKILMA",
  last: 1
}, {
  id: "u3",
  n: UNI_USER.name,
  e: "n.elamrani@univ-boughaz.ma",
  r: "rl_adv",
  org: "boughaz",
  last: 0
}, {
  id: "u4",
  n: UNI_USER_ADMIN.name,
  e: "k.lahlou@univ-boughaz.ma",
  r: "rl_iadm",
  org: "boughaz",
  last: 3
}, {
  id: "u5",
  n: {
    en: "Leila Haddad",
    fr: "Leila Haddad",
    ar: "ليلى حداد"
  },
  e: "l.haddad@atlas-bs.ma",
  r: "rl_iadm",
  org: "atlas",
  last: 2
} ];

function allUsers() {
  return USERS_BASE.map(e => Object.assign({}, e, {
    name: tx(e.n),
    on: !(S.ops.userOff || {})[e.id]
  })).concat(S.ops.users.map(e => Object.assign({}, e, {
    name: e.e.split("@")[0],
    on: !(S.ops.userOff || {})[e.id],
    inv: !0
  })));
}

const orgName = e => "SKILMA" === e ? "SKILMA" : (allInsts().find(s => s.id === e) || {
  name: e
}).name;

function vOpsUsers() {
  const e = allUsers();
  return cHead(t("o_nav_users"), t("ou_d"), `<button class="btn" data-act="o-invite">${ic("plus")}${te("ou_invite")}</button>`) + `\n  <section class="panel flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("ou_name")}</th><th scope="col">${te("ou_role")}</th><th scope="col">${te("ou_org")}</th><th scope="col">${te("u_th_last")}</th><th scope="col">${te("oi_state")}</th></tr></thead><tbody>\n  ${e.map(e => `<tr><th scope="row"><span class="who">${avatar(initials(e.name))}<span>${esc(e.name)}${e.you ? ` <span class="pill teal">${te("us_you")}</span>` : ""}<small class="dim" dir="ltr">${esc(e.e)}</small></span></span></th><td>${te(e.r)}</td><td>${esc(orgName(e.org))}</td><td class="dim">${e.inv ? te("ou_invited") : esc(daysAgo(e.last))}</td>\n    <td>${e.you ? statusPill("active") : `<label class="sw-l"><input type="checkbox" class="sw" data-act="o-user" data-id="${e.id}" ${e.on ? "checked" : ""} aria-label="${te("ou_access_l", {
    x: e.name
  })}"><span>${te(e.on ? e.inv ? "ost_invited" : "ost_active" : "ost_off")}</span></label>`}</td></tr>`).join("")}\n  </tbody></table></div></section><p class="dim fine">${smallIc("key")} ${te("ou_note")}</p>`;
}

function inviteModal() {
  modal(`<button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button><h2>${te("ou_invite")}</h2><p class="mute">${te("ou_inv_d")}</p>\n    <form data-form="invite" novalidate style="display:grid;gap:14px"><div class="field"><label class="flabel" for="ivE">${te("pf_email")}</label><input id="ivE" class="inp" type="email" dir="ltr" required></div>\n    <div class="field"><label class="flabel" for="ivR">${te("ou_role")}</label><select id="ivR" class="inp">${[ "rl_op", "rl_rev", "rl_iadm", "rl_adv" ].map(e => `<option value="${e}">${te(e)}</option>`).join("")}</select></div>\n    <div class="field"><label class="flabel" for="ivO">${te("ou_org")}</label><select id="ivO" class="inp"><option value="SKILMA">SKILMA</option>${allInsts().filter(e => "declined" !== e.status).map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join("")}</select></div>\n    <p class="f-err" id="ivErr" role="alert"></p><button class="btn lg" type="submit">${ic("send")}${te("ou_send")}</button></form>`);
}

const SK_CAT = {
  customer_service: "c_com",
  sales: "c_com",
  negotiation: "c_com",
  b2b: "c_com",
  crm: "c_dig",
  cash: "c_org",
  inventory: "c_org",
  event: "c_org",
  social_media: "c_dig",
  content: "c_dig",
  ads: "c_dig",
  teamwork: "c_ppl",
  leadership: "c_ppl",
  presentation: "c_ppl",
  multilingual: "c_lng",
  research: "c_ana",
  problem_solving: "c_ana",
  excel: "c_ana",
  powerbi: "c_ana",
  sql: "c_ana"
};

function vOpsSkills() {
  const e = norm(ui.oQ || "").toLowerCase(), s = new Map(skillFlags().map(e => [ e.id, e ])), a = Object.keys(SK).filter(s => !e || norm(skName(s)).toLowerCase().includes(e) || s.includes(e));
  return cHead(t("o_nav_skills"), t("os_d")) + `\n  <div class="filters"><label class="srch">${ic("search")}<span class="sr">${te("os_find")}</span><input id="oQ" class="inp" placeholder="${te("os_find")}" value="${esc(ui.oQ || "")}"></label><span class="dim">${te("os_count", {
    n: nfmt(Object.keys(SK).length)
  })}</span></div>\n  <section class="panel flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("os_skill")}</th><th scope="col">${te("os_cat")}</th><th scope="col">${te("os_opps")}</th><th scope="col">${te("os_conf")}</th><th scope="col">${te("os_on")}</th></tr></thead><tbody>\n  ${a.map(e => {
    const a = S.decisions[e], i = a ? (a.yes || 0) + (a.no || 0) : 0, o = i ? Math.round((a.yes || 0) / i * 100) : null, r = s.get(e), l = !S.ops.skillOff[e];
    return `<tr class="${l ? "" : "off"}"><th scope="row">${esc(skName(e))}${RARE.has(e) ? ` <span class="pill gold">${ic("star")}${te("os_rare")}</span>` : ""}</th><td>${te(SK_CAT[e] || "c_ana")}</td><td class="num">${nfmt(OPPS.filter(s => s.req.some(s => s[0] === e)).length)}</td>\n      <td>${null === o ? '<span class="dim">—</span>' : `<span class="num ${r ? "warn-t" : ""}">${nfmt(o)}%</span> <small class="dim num">(${nfmt(i)})</small>${r ? ` ${smallIc("alert")}` : ""}`}</td>\n      <td><input type="checkbox" class="sw" data-act="o-skill" data-id="${e}" ${l ? "checked" : ""} aria-label="${esc(skName(e))}"></td></tr>`;
  }).join("")}\n  </tbody></table></div></section><p class="dim fine">${smallIc("info")} ${te("os_note")}</p>`;
}

function vOpsOpps() {
  return cHead(t("o_nav_opps"), t("oo_d")) + `\n  <section class="panel flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("u_th_role")}</th><th scope="col">${te("oo_type")}</th><th scope="col">${te("oo_req")}</th><th scope="col">${te("oi_state")}</th></tr></thead><tbody>\n  ${OPPS.map(e => {
    const s = !S.ops.oppOff[e.id];
    return `<tr class="${s ? "" : "off"}"><th scope="row"><span class="who"><span class="logo sm">${esc(e.ini)}</span><span>${esc(tx(e.title))}<small class="dim">${bdi(e.org)} · ${esc(tx(C[e.city]))}</small></span></span></th><td>${te("job" === e.type ? "type_job" : "type_intern")}</td>\n    <td><span class="num">${nfmt(e.req.length)}</span> <small class="dim">(${te("oo_core", {
      n: nfmt(e.req.filter(e => e[1]).length)
    })})</small></td>\n    <td><label class="sw-l"><input type="checkbox" class="sw" data-act="o-opp" data-id="${e.id}" ${s ? "checked" : ""} aria-label="${esc(tx(e.title))}"><span>${te(s ? "ost_pub" : "ost_paused")}</span></label></td></tr>`;
  }).join("")}\n  </tbody></table></div></section><p class="dim fine">${smallIc("info")} ${te("oo_note")}</p>`;
}

function vOpsQuality() {
  const e = S.runs, s = {
    discover: "k_discover",
    plan: "k_plan",
    interview: "k_iv",
    copilot: "k_copilot",
    explain: "k_explain",
    insights: "k_insights",
    bench: "k_bench"
  }, a = skillFlags(), i = ui.bench;
  return cHead(t("o_nav_quality"), t("oq_d"), aiPill()) + `\n  <section class="panel bench"><div class="sec-h" style="margin-top:0"><h3>${ic("activity")} ${te("oq_bench")}</h3><span class="dim">${te("oq_bench_d")}</span></div>\n    <label class="sr" for="oqT">${te("oq_bench")}</label><textarea id="oqT" class="inp" rows="3" maxlength="1200">${esc(ui.benchText || t("ax_input").replace(/[“”«»]/g, ""))}</textarea>\n    <div class="cm-acts"><span class="dim">${te("oq_langs")}</span><button class="btn" data-act="o-bench" ${ui.benchBusy ? "disabled" : ""}>${ic("bolt")}${te(ui.benchBusy ? "oq_running" : "oq_run")}</button></div>\n    ${i ? `<div class="bench-r"><div class="br-c"><p class="eyebrow">${te("who_rules")} · <bdi dir="ltr">${nfmt(i.rms)} ${"zgh" === L() ? "ⵎⵙ" : "ms"}</bdi></p><div class="chips-wrap" style="justify-content:flex-start">${i.rules.map(e => stateTag(i.ai && i.ai.includes(e) ? "conf" : "sugg", skName(e))).join("") || '<span class="dim">—</span>'}</div></div>\n      <div class="br-c"><p class="eyebrow">${te("who_ai")}${i.ai ? ` · <bdi dir="ltr">${nfmt(i.ams)} ${"zgh" === L() ? "ⵎⵙ" : "ms"}</bdi>` : ""}</p>${i.ai ? `<div class="chips-wrap" style="justify-content:flex-start">${i.ai.map(e => stateTag(i.rules.includes(e) ? "conf" : "sugg", skName(e))).join("") || '<span class="dim">—</span>'}</div>` : `<p class="dim">${te("oq_noai")}</p>`}</div>\n      ${i.ai ? `<div class="br-sum"><b class="num">${nfmt(i.agree)}%</b><span>${te("oq_agree")}</span><small class="dim">${te("oq_agree_d")}</small></div>` : ""}</div>` : ""}</section>\n  <div class="two eq"><section class="panel"><h3 style="margin-bottom:12px">${te("oq_flags")}</h3>${a.length ? `<div class="hb">${a.map(e => `<div class="hb-r"><span>${esc(skName(e.id))}</span><span class="tr warn"><i data-w="${e.rate}"></i></span><b class="num">${nfmt(e.rate)}%</b></div>`).join("")}</div>` : `<p class="mute">${te("oq_flags_0")}</p>`}<p class="dim fine">${te("oq_flags_d")}</p></section>\n    <section class="panel"><h3 style="margin-bottom:12px">${te("oq_prompts")}</h3><dl class="kv">${Object.entries(PROMPT_V).map(([e, a]) => `<div><dt>${te(s[e] || "k_copilot")}</dt><dd class="mono">${esc("zgh" === L() ? String(a).replace(/\D+/g, " ").trim() : a)}</dd></div>`).join("")}</dl></section></div>\n  <section class="panel flush"><div class="sec-h pad"><h3>${te("o_log")}</h3><span class="dim num">${nfmt(e.length)}</span></div>${e.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("o_th_k")}</th><th scope="col">${te("o_th_e")}</th><th scope="col">${te("o_th_ms")}</th><th scope="col">${te("o_th_l")}</th><th scope="col">${te("o_th_s")}</th><th scope="col">${te("o_th_t")}</th></tr></thead><tbody>\n    ${e.slice(-20).reverse().map(e => `<tr><td>${te(s[e.kind] || "k_copilot")}${"zgh" === L() ? "" : `<small class="dim mono">${esc(e.v || "rules")}</small>`}</td><td>${"ai" === e.engine ? `<span class="pill teal">${te("set_ai")} · ${esc(e.tier || "")}</span>` : `<span class="pill">${te("o_fallback")}</span>`}</td><td class="num"><bdi dir="ltr">${e.ms ? nfmt(e.ms) + ("zgh" === L() ? " ⵎⵙ" : " ms") : "—"}</bdi></td><td>${esc(String(e.lang).toUpperCase())}</td><td>${e.ok ? statusPill("ok") : `<span class="status s-declined">${te("failed")} · ${esc(e.err || "")}</span>`}</td><td class="dim num">${esc(tmShort(e.t))}</td></tr>`).join("")}</tbody></table></div>` : `<p class="mute pad">${te("o_empty")}</p>`}</section>`;
}

function auditRows() {
  const e = [];
  return S.events.forEach(s => {
    const [, a] = evLabel(s);
    e.push({
      t: s.t,
      who: "who_student",
      what: a
    });
  }), S.runs.forEach(s => e.push({
    t: s.t,
    who: "ai" === s.engine ? "who_ai" : "who_rules",
    what: t({
      discover: "k_discover",
      plan: "k_plan",
      interview: "k_iv",
      copilot: "k_copilot",
      explain: "k_explain",
      insights: "k_insights",
      bench: "k_bench"
    }[s.kind] || "k_copilot") + (s.ok ? "" : " · " + t("failed"))
  })), (S.uni.log || []).forEach(s => e.push({
    t: s.t,
    who: "who_inst",
    what: s.what
  })), (S.ops.log || []).forEach(s => e.push({
    t: s.t,
    who: "who_ops",
    what: s.what
  })), S.pilots.forEach(s => e.push({
    t: s.at,
    who: "who_site",
    what: t("audit_pilot", {
      x: s.inst
    })
  })), S.feedback.forEach(s => e.push({
    t: s.t,
    who: "who_student",
    what: t("audit_fb")
  })), S.access.forEach(s => e.push({
    t: s.at,
    who: "who_site",
    what: t("audit_access", {
      x: s.name
    })
  })), (S.employers || []).forEach(s => e.push({
    t: s.at,
    who: "who_site",
    what: t("o_a_emp", {
      x: s.org
    })
  })), (S.partners || []).forEach(s => e.push({
    t: s.at,
    who: "who_site",
    what: t("o_a_partner", {
      x: s.org
    })
  })), e.sort((e, s) => s.t - e.t);
}

function vOpsAudit() {
  const e = auditRows(), s = ui.audF || "all", a = e.filter(e => "all" === s || e.who === s).slice(0, 80);
  return cHead(t("oa_t"), t("oa_d"), `<button class="btn ghost sm" data-act="o-audit-dl">${ic("download")}CSV</button>`) + `\n  <div class="filters"><div class="chips-wrap">${[ "all", "who_student", "who_inst", "who_ops", "who_ai", "who_rules", "who_site" ].map(e => `<button class="chip ${s === e ? "on" : ""}" data-act="o-aud-f" data-f="${e}" aria-pressed="${s === e}">${te("all" === e ? "all" : e)}</button>`).join("")}</div></div>\n  <section class="panel flush">${a.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("oa_what")}</th><th scope="col">${te("oa_who")}</th><th scope="col">${te("oa_when")}</th></tr></thead><tbody>${a.map(e => `<tr><td style="min-width:180px">${esc(e.what)}</td><td><span class="actor a-${e.who}">${te(e.who)}</span></td><td class="num dim" style="white-space:nowrap">${esc(tmShort(e.t))}</td></tr>`).join("")}</tbody></table></div>` : `<p class="mute pad">${te("oa_empty")}</p>`}</section>`;
}

function vOpsSet() {
  const sec = (e, s, a) => `<section class="panel"><h2 class="set-h">${ic(e)}${te(s)}</h2><div class="set-list">${a}</div></section>`;
  return cHead(t("o_nav_set"), t("ost_d")) + `\n  ${sec("spark", "oset_ai", `<div class="set-row col"><span><b>${te("oset_engine")}</b><span>${te("oset_engine_d")}</span></span><div class="seg" role="group" aria-label="${te("oset_engine")}"><button data-act="o-engine" data-v="0" aria-pressed="${!S.ops.rulesOnly}">${te("oset_e_ai")}</button><button data-act="o-engine" data-v="1" aria-pressed="${!!S.ops.rulesOnly}">${te("oset_e_rules")}</button></div></div>\n    <div class="set-row"><span><b>${te("o_engine")}</b><span>${te(AI.fn ? "oset_avail" : "oset_unavail")}</span></span>${aiPill()}</div>`)}\n  ${sec("alert", "oset_plat", `<div class="set-row"><label for="o_maint"><b>${te("oset_maint")}</b><span>${te("oset_maint_d")}</span></label><input type="checkbox" class="sw" id="o_maint" data-act="o-maint" ${S.ops.maint ? "checked" : ""}></div>`)}\n  ${sec("lock", "oset_priv", `<div class="set-row col"><span><b>${te("us_priv")}</b><span>${te("oset_priv_d")}</span></span><div class="seg" role="group" aria-label="${te("us_priv")}">${[ 10, 20, 30 ].map(e => `<button data-act="u-min" data-n="${e}" aria-pressed="${(S.uni.minGroup || 10) === e}">${te("us_min", {
    n: nfmt(e)
  })}</button>`).join("")}</div></div>\n    <div class="set-row col"><span><b>${te("oset_ret")}</b><span>${te("oset_ret_d")}</span></span><div class="seg" role="group" aria-label="${te("oset_ret")}">${[ "6", "12", "24" ].map(e => `<button data-act="o-ret" data-v="${e}" aria-pressed="${S.ops.retention === e}">${te("months_n", {
    n: nfmt(+e)
  })}</button>`).join("")}</div></div>`)}\n  ${sec("refresh", "oset_danger", `<div class="set-row"><span><b>${te("oset_reset")}</b><span>${te("oset_reset_d")}</span></span><button class="btn ghost sm danger-t" data-act="o-reset-ask">${ic("refresh")}${te("set_reset")}</button></div><div id="oResetBox"></div>`)}`;
}

function impactNums() {
  return {
    followed: 31 + S.access.filter(e => "ok" === e.status).length,
    wait: S.access.filter(e => !e.status).length,
    regions: 9 + new Set(S.access.map(e => (e.place || "").trim().toLowerCase()).filter(Boolean)).size
  };
}

function vOpsImpact() {
  const e = impactNums(), s = S.access.slice().reverse();
  return cHead(t("o_nav_impact"), t("oim_d"), `<span class="pill">${te("demo")}</span>`) + `\n  <div class="kpis">${kpi(nfmt(e.followed), te("oim_followed"), te("oim_followed_d"))}${kpi(nfmt(e.wait), te("oim_wait"), "")}${kpi(nfmt(e.regions), te("oim_regions"), te("oim_regions_d"))}</div>\n  <section class="panel flush"><div class="sec-h pad"><h3>${te("oim_req")}</h3><span class="dim num">${nfmt(s.length)}</span></div>${s.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">${te("pf_name")}</th><th scope="col">${te("ac_place")}</th><th scope="col">${te("ac_why")}</th><th scope="col">${te("oi_state")}</th></tr></thead><tbody>\n    ${s.map(e => `<tr><th scope="row">${esc(e.name)}<small class="dim">${esc(e.school || "")}</small></th><td>${esc(e.place)}</td><td>${e.why.map(e => `<span class="pill">${te("ac_w" + e)}</span>`).join(" ") || "—"}</td>\n      <td>${e.status ? statusPill("ok" === e.status ? "active" : "declined") : `<div class="ph-a"><button class="btn sm" data-act="o-acc" data-id="${e.id}" data-s="ok">${ic("check")}${te("oim_give")}</button><button class="btn ghost sm" data-act="o-acc" data-id="${e.id}" data-s="no">${te("o_decline")}</button></div>`}</td></tr>`).join("")}</tbody></table></div>` : `<p class="mute pad">${te("oim_none")}</p>`}</section>\n  <p class="dim fine">${smallIc("info")} ${te("oim_note")}</p>`;
}

const OVIEWS = {
  ov: vOpsOv,
  impact: vOpsImpact,
  inst: vOpsInst,
  users: vOpsUsers,
  skills: vOpsSkills,
  opps: vOpsOpps,
  quality: vOpsQuality,
  audit: vOpsAudit,
  set: vOpsSet
};

let lastFocus = null;

function modal(e, s = "") {
  lastFocus = document.activeElement, $("#layer").innerHTML = `<div class="scrim" data-act="scrim"><div class="modal ${s}" role="dialog" aria-modal="true">${e}</div></div>`;
  {
    const e = $("#layer .modal"), s = e && $("h1,h2,h3,legend,label", e);
    e && (s ? (s.id = s.id || "mdlT", e.setAttribute("aria-labelledby", s.id)) : e.setAttribute("aria-label", document.title));
  }
  const a = $("#layer .modal textarea:not([disabled]), #layer .modal input:not([type=checkbox]), #layer .modal .btn");
  a && a.focus({
    preventScroll: !0
  }), drawRings($("#layer")), runCounts($("#layer"));
}

function closeModal() {
  $("#layer").innerHTML = "", lastFocus && lastFocus.isConnected && lastFocus.focus({
    preventScroll: !0
  });
}

function openTask(e) {
  const s = task(e);
  if (!s) return;
  const a = S.plan.done[e], i = e > todayDay(), o = "prove" === s.kind || "portfolio" === s.kind;
  modal(`<button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button>\n    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="pill ${"portfolio" === s.kind ? "amber" : "teal"}">${ic(KIND_IC[s.kind])}${te("k_" + s.kind)}</span><span class="dim num" style="font-size:14px">${te("day_n", {
    n: nfmt(e)
  })} · ${te("min_n", {
    n: nfmt(s.min)
  })}</span>${s.skill ? stateTag(owned(s.skill) ? skillState(s.skill) : "miss", skName(s.skill)) : ""}</div>\n    <h2>${esc(s.title)}</h2>\n    <div><div class="sec-t">${te("tk_why")}</div><p class="mute">${esc(s.why)}</p>${o ? `<p class="teal" style="margin-top:6px;font-size:14px">${smallIc("file")} ${te("tk_why_proof")}</p>` : ""}</div>\n    ${s.skill && RES[s.skill] && "learn" === s.kind ? `<div><div class="sec-t">${te("tk_res")}</div><p>${smallIc("book", "#0F3D36")} ${esc(tx(RES[s.skill]))}</p></div>` : ""}\n    <div><div class="sec-t">${te("tk_steps")}</div><ul class="steps">${s.steps.map(e => `<li><label><input type="checkbox" data-act="step" ${a ? "checked disabled" : ""}><span>${esc(e)}</span></label></li>`).join("")}</ul></div>\n    ${"interview" === s.kind ? `<div><button class="btn ghost" data-act="go" data-to="interview">${ic("mic")}${te("tk_go_iv")}</button></div>` : ""}\n    <div class="field"><label for="proof">${te("tk_proof")}${o ? " *" : ""}</label><textarea id="proof" class="inp" rows="3" maxlength="600" placeholder="${te("tk_proof_ph")}" ${a || i ? "disabled" : ""} ${o ? 'aria-required="true"' : ""}>${esc(a && a.proof || "")}</textarea></div>\n    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;align-items:center">\n      <button class="btn ghost sm" data-act="task-help" data-day="${e}">${ic("chat")}${te("tk_help")}</button>\n      ${a ? `<span class="pill teal">${ic("check")}${te("tk_was")}</span>` : i ? `<span class="pill">${ic("lock")}${te("pl_locked")}</span>` : `<button class="btn lg" id="doneBtn" data-act="task-done" data-day="${e}">${ic("check")}${te("tk_done")}</button>`}\n    </div>`);
}

function completeTask(e) {
  const s = task(e), a = opp(S.plan.goal), i = $("#proof"), o = i ? i.value.trim() : "";
  if (("prove" === s.kind || "portfolio" === s.kind) && !proofOK(o)) return shake(i), 
  toast(t("tk_proof_need"), "file"), void (i && (i.setAttribute("aria-invalid", "true"), 
  i.focus()));
  readiness(a);
  S.plan.done[e] = {
    at: Date.now(),
    proof: o
  };
  let r = null;
  if ("prove" === s.kind && s.skill) {
    const e = owned(s.skill) && "conf" !== skillState(s.skill);
    addSkill(s.skill, o, "plan"), e || (r = s.skill, event("proven", {
      id: s.skill
    }));
  } else s.skill && o && owned(s.skill) && addSkill(s.skill, o, "note");
  "portfolio" === s.kind && (S.portfolio = (S.portfolio || []).filter(e => e.goal !== a.id), 
  S.portfolio.push({
    id: uid(),
    goal: a.id,
    title: tx(a.project),
    proof: o,
    at: Date.now()
  }), event("portfolio", {
    id: a.id
  })), logReady(), save();
  readiness(a);
  closeModal(), "plan" !== S.screen && "home" !== S.screen || renderMain();
  const l = $(`[data-d="${e}"]`);
  bounce(l), SND.play("ok"), r && (burstFrom(l, 36, .7), setTimeout(() => {
    toast(t("tk_proven", {
      skill: skName(r)
    }), "file"), SND.play("pop");
  }, 700)), toast(t("tk_toast", {
    d: nfmt(e),
    x: readyLabel(a)
  })), say(t("say_day"), "happy"), 30 === e && setTimeout(celebrate, 600);
}

const LINK_RE = /(https?:\/\/|www\.)\S+|\b[\w-]+\.(com|ma|org|net|io|app|dev|me|link|ly|page|site)\/\S*/i, proofOK = e => LINK_RE.test(e) || e.replace(/\s+/g, " ").trim().length >= 60 && e.trim().split(/\s+/).length >= 8;

function celebrate() {
  const e = opp(S.goal);
  if (!e) return;
  let s = "";
  try {
    s = drawCertificate().toDataURL("image/png");
  } catch (e) {}
  modal(`<button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button>\n    <div class="celebrate" style="display:grid;gap:14px"><div style="width:110px;height:110px;position:relative;justify-self:center">${mascot("celebrate")}</div>\n    <h2 style="padding:0;font-size:clamp(28px,4vw,40px)">${te("cel_t")}</h2><p class="mute">${te("cel_d", {
    x: readyLabel(e),
    role: tx(e.title)
  })}</p>\n    ${s ? `<img class="cert-prev" src="${s}" alt="${te("cert_title")}">` : ""}\n    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn lg" data-act="open-opp" data-id="${e.id}">${ic("send")}${te("od_apply")}</button><button class="btn ghost lg" data-act="cert">${ic("download")}${te("cert_dl")}</button></div></div>`, "wide"), 
  bigCelebration(), SND.play("win"), voice(t("cel_t"));
}

function shareModal() {
  const e = "skilma.ma/p/" + passNo();
  modal(`<button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button><h2>${te("share_t")}</h2><p class="mute">${te("share_d")}</p>\n    <div class="panel flat" style="display:grid;gap:10px"><div style="display:flex;gap:12px;align-items:center"><div style="width:44px;height:44px;position:relative">${mascot("happy")}</div><div><b>${esc(S.profile.name || "—")}</b><br><span class="dim mono" style="font-size:13px">${passNo()}</span></div></div><div class="chips-wrap" style="justify-content:flex-start">${confirmed().slice(0, 6).map(e => stateTag(skillState(e), skName(e))).join("")}</div></div>\n    <div class="compose"><label class="sr" for="shareLink">${te("pp_share")}</label><input id="shareLink" class="inp mono" readonly value="${esc(e)}" style="direction:ltr"><button class="btn" data-act="copy-link" style="width:auto;padding:0 18px">${ic("copy")}${te("copy")}</button></div>\n    <p class="dim" style="font-size:13px">${smallIc("eye")} ${te("share_demo")}</p>`);
}

function addExpModal() {
  modal(`<button class="ibtn x" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button><div style="display:flex;gap:14px;align-items:center"><div style="width:52px;height:52px;position:relative;flex:none">${mascot("curious")}</div><h2>${te("lp_q")}</h2></div>\n    <p class="mute">${te("lp_sub")}</p><label class="sr" for="story">${te("lp_q")}</label><textarea id="story" class="inp" rows="5" maxlength="1200" placeholder="${te("lp_ph")}"></textarea>\n    <div style="display:flex;justify-content:flex-end"><button class="btn lg" data-act="discover">${ic("spark")}${te("lp_go")}</button></div>`);
}

function buildingModal() {
  $("#layer").innerHTML = `<div class="scrim"><div class="modal" role="dialog" aria-modal="true" aria-label="${te("su_building")}" aria-live="polite" style="justify-items:center;text-align:center"><div style="width:100px;height:100px;position:relative">${mascot("thinking")}</div><h2 style="padding:0">${te("su_building")}</h2><p class="mute">${te("su_building_d")}</p><div style="display:grid;gap:10px;width:100%">${[ 90, 75, 82, 60 ].map(e => `<span class="skel l" style="width:${e}%;justify-self:center"></span>`).join("")}</div></div></div>`;
}

function chatHTML() {
  let e = `<div class="msg ai">${te("cp_hello", {
    name: S.profile.name || ""
  })}</div>`;
  return aiOn() || (e += `<div class="msg sys">${te("cp_off")}</div>`), e += S.chat.map(e => `<div class="msg ${"user" === e.role ? "me" : "ai"}">${esc(e.content)}${(e.acts || []).map(e => `<div class="act">${ic("bolt")}${esc(e)}</div>`).join("")}</div>`).join(""), 
  e;
}

function openCopilot(e) {
  lastFocus = document.activeElement, $("#layer").innerHTML = `<div class="scrim" data-act="scrim" style="background:rgba(3,11,22,.4)"></div>\n  <div class="drawer" role="dialog" aria-modal="true" aria-label="${te("cp_name")}">\n    <div class="dr-h"><div style="width:42px;height:42px;position:relative">${mascot("happy")}</div><div><b>${te("cp_name")}</b><small>${te("cp_sub")}</small></div>${aiShort()}<button class="ibtn" data-act="close-modal" aria-label="${te("close")}">${ic("x")}</button></div>\n    <div class="chat" id="chat" aria-live="polite">${chatHTML()}</div>\n    <div class="dr-f"><div class="sugs">${[ "cp_s1", "cp_s2", "cp_s3", "cp_s4" ].map(e => `<button class="chip" data-act="cp-sug" data-k="${e}">${te(e)}</button>`).join("")}</div>\n      <form class="compose" id="cpForm"><label class="sr" for="cpIn">${te("cp_ph")}</label><textarea id="cpIn" class="inp" rows="1" placeholder="${te("cp_ph")}"></textarea><button class="btn" type="submit" aria-label="${te("send")}">${ic("send")}</button></form></div>\n  </div>`;
  const s = $("#chat");
  s.scrollTop = s.scrollHeight;
  const a = $("#cpIn");
  e && (a.value = e), a.focus({
    preventScroll: !0
  });
}

function offlineReply(e) {
  const s = e.toLowerCase(), a = S.goal && opp(S.goal);
  if (/today|اليوم|aujourd|ندير|faire|stuck|bloqu|تبلوكيت/.test(s)) {
    if (!a) return t("cpo_nogoal");
    const e = todayDay();
    if (e > 30) return t("hm_done");
    const s = task(e);
    return t("cpo_today", {
      task: s.title,
      min: s.min
    }) + "\n\n" + s.steps.map((e, s) => `${s + 1}. ${e}`).join("\n");
  }
  if (/why|علاش|pourquoi|fit|مناسب|goal|هدف|objectif/.test(s)) return a ? whyRules(a) : t("cpo_nogoal");
  if (/letter|message|رسالة|lettre|candidature|cover|التقديم/.test(s)) {
    if (!a) return t("cpo_nogoal");
    const e = confirmed(), s = e.find(e => a.req.some(s => s[0] === e && s[1])) || e[0], i = s && (S.skills[s].ev[0] || {}).text || "";
    return t("cpo_letter", {
      org: a.org,
      name: S.profile.name || "—",
      field: S.profile.field ? t(S.profile.field) : "—",
      ev: i,
      role: tx(a.title),
      skills: list(e.slice(0, 4).map(skName))
    });
  }
  if (/interview|مقابلة|entretien|واجد|ready|prêt/.test(s)) {
    if (!a) return t("cpo_nogoal");
    const e = S.ivBest[a.id];
    return e ? t("cpo_iv", {
      s: e
    }) : t("cpo_iv0");
  }
  return t("cpo_default");
}

const SCREEN_KEY = {
  home: "nav_home",
  passport: "nav_pass",
  opps: "nav_opps",
  plan: "nav_plan",
  interview: "nav_iv",
  progress: "nav_prog"
};

function copilotTools(e) {
  return [ {
    name: "open_screen",
    description: "Open a screen of the SKILMA app for the student. screen is one of: home, passport, opps, plan, interview, progress. Returns 'ok'.",
    inputSchema: {
      type: "object",
      properties: {
        screen: {
          type: "string",
          enum: Object.keys(SCREEN_KEY)
        }
      },
      required: [ "screen" ]
    },
    execute: s => {
      const a = String(s.screen);
      if (!VIEWS[a]) throw new Error("unknown screen");
      return S.role = "student", S.screen = a, save(), render(), e.push(t("cp_did_open", {
        x: t(SCREEN_KEY[a])
      })), "ok";
    }
  }, {
    name: "set_goal",
    description: "Set the student's goal to one opportunity id from the student data. This rebuilds their 30-day path. Only use when the student asks to choose or change their goal. Returns the new readiness percent.",
    inputSchema: {
      type: "object",
      properties: {
        opportunity_id: {
          type: "string",
          enum: liveOpps().map(e => e.id)
        }
      },
      required: [ "opportunity_id" ]
    },
    execute: s => {
      const a = opp(String(s.opportunity_id));
      if (!a) throw new Error("unknown opportunity");
      return applyGoal(a.id), render(), e.push(t("cp_did_goal", {
        x: tx(a.title)
      })), {
        readiness: readiness(a)
      };
    }
  }, {
    name: "add_skill",
    description: "Add a skill to the student's passport, only when the student clearly describes doing it in this chat. evidence = the student's own words. Returns 'added'.",
    inputSchema: {
      type: "object",
      properties: {
        skill_id: {
          type: "string",
          enum: Object.keys(SK)
        },
        evidence: {
          type: "string"
        }
      },
      required: [ "skill_id", "evidence" ]
    },
    execute: s => {
      const a = String(s.skill_id);
      if (!SK[a]) throw new Error("unknown skill");
      return addSkill(a, String(s.evidence || "").slice(0, 300), "chat"), logReady(), 
      save(), "app" === S.stage && renderMain(), e.push(t("cp_did_skill", {
        x: skName(a)
      })), "added";
    }
  } ];
}

async function sendCopilot(e) {
  if (!(e = String(e || "").trim()) || ui.cpBusy) return;
  ui.cpBusy = !0, S.chat.push({
    role: "user",
    content: e
  }), S.chat.length > 40 && (S.chat = S.chat.slice(-40)), save();
  const s = $("#chat");
  if (!s) return void (ui.cpBusy = !1);
  s.insertAdjacentHTML("beforeend", `<div class="msg me">${esc(e)}</div><div class="msg ai" id="cpLive"><span class="typing"><i></i><i></i><i></i></span></div>`), 
  s.scrollTop = s.scrollHeight, setMood("thinking", $(".dr-h") || document);
  let a = null;
  const i = [];
  if (aiOn()) {
    const s = [ {
      role: "user",
      content: `You are "Skilma" (سكيلما), the career copilot inside the SKILMA app for Moroccan university students.\nPersona: calm, precise, warm. A smart friend, not a motivational coach. Short sentences. Say "you" before "we". No hype, no emojis.\nAlways answer in ${langName()}. Keep answers under 90 words, unless the student asks you to write an application message or letter: then up to 180 words, in a polite formal register of the student's language.\nUse only facts from the student data below. Never invent experiences, numbers or employers. When you recommend something, say why in one short clause.\n${AI.tools ? "You can act inside the app with tools: open_screen, set_goal, add_skill. Use them only when the student asks to go somewhere, choose a goal, or add a skill they clearly describe. After using a tool, say in one short line what you did." : ""}\nStudent data (JSON): ${profileBrief()}`
    } ].concat(S.chat.slice(-12).map(e => ({
      role: e.role,
      content: e.content
    }))), o = {
      cache: !1
    };
    AI.tools && (o.tools = copilotTools(i)), a = await aiText(s, e => {
      const s = $("#cpLive");
      if (s) {
        s.textContent = e;
        const a = $("#chat");
        a && (a.scrollTop = a.scrollHeight);
      }
    }, o, "copilot"), null !== a || aiOn() || (a = offlineReply(e));
  } else {
    const s = performance.now();
    await sleep(550), a = offlineReply(e), logRun("copilot", "rules", performance.now() - s), 
    save();
  }
  const o = $("#cpLive");
  a ? (S.chat.push({
    role: "assistant",
    content: a,
    acts: i
  }), save(), o && (o.removeAttribute("id"), aiOn() ? o.textContent = a : typeInto(o, a, 8), 
  i.forEach(e => o.insertAdjacentHTML("beforeend", `<div class="act">${ic("bolt")}${esc(e)}</div>`)))) : o && (o.removeAttribute("id"), 
  o.textContent = t("cp_err")), setMood("happy", $(".dr-h") || document), ui.cpBusy = !1;
  const r = $("#chat");
  r && (r.scrollTop = r.scrollHeight);
}

async function startDiscover(e, s) {
  ui.disc = {
    phase: "reading",
    story: e,
    items: [],
    i: 0,
    src: "rules",
    ret: s ? "passport" : null,
    skipped: 0
  }, s || (S.draft = e), S.stage = "discover", save(), closeModal(), await render(!0), 
  window.scrollTo(0, 0);
  const a = ++ui.run, i = performance.now(), o = $$("#scan .w"), r = new Map;
  o.forEach((e, s) => {
    for (const [a, i] of Object.entries(HINT)) if (i.test(e.textContent)) {
      r.set(s, a);
      break;
    }
  });
  sentences(e).length;
  const l = new Set;
  let c = 0;
  $("#rdline").textContent = t("rd_1");
  const p = setInterval(() => {
    if (a !== ui.run || !o[0] || !o[0].isConnected) return void clearInterval(p);
    const e = Math.max(1, Math.ceil(o.length / 36));
    for (let s = 0; s < e && c < o.length; s++, c++) if (o[c].classList.add("lit"), 
    r.has(c)) {
      o[c].classList.add("hit");
      const e = r.get(c);
      if (!l.has(e)) {
        l.add(e);
        const s = $("#foundLive");
        s && s.insertAdjacentHTML("beforeend", `<span class="state s-sugg">${ic("spark")}${esc(skName(e))}</span>`), 
        SND.play("tick");
      }
    }
  }, 70), d = [ "rd_2", "rd_3", "rd_4" ];
  let u = 0;
  const _ = setInterval(() => {
    const e = $("#rdline");
    a === ui.run && e ? e.textContent = t(d[Math.min(u++, d.length - 1)]) : clearInterval(_);
  }, 1200), h = sleep(RM() ? 300 : 2800);
  let v = null, f = "rules";
  if (aiOn() && (v = await aiDiscover(e), v && (f = "ai")), v || (v = rulesDiscover(e), 
  logRun("discover", "rules", performance.now() - i, !0, {
    v: "rules-v1"
  })), await h, clearInterval(p), clearInterval(_), a !== ui.run) return;
  S.stories.push({
    id: uid(),
    text: e,
    at: Date.now(),
    type: ui.cmType || null,
    skills: v.map(e => e.id)
  }), ui.cmType = null, event("story");
  const g = v.filter(e => !owned(e.id));
  ui.disc.skipped = v.length - g.length, v.filter(e => owned(e.id)).forEach(e => addSkill(e.id, e.evidence, "story")), 
  ui.disc.items = g, ui.disc.src = f, ui.disc.phase = g.length ? "reveal" : "none", 
  save(), render(!0);
}

function revealNext() {
  const e = ui.disc;
  if (e.i++, e.i >= e.items.length) {
    e.phase = "done";
    const s = e.items.filter(e => "yes" === e.res).length;
    s && event("skills", {
      n: s
    }), logReady(), save();
  }
  render(!0);
}

function decide(e, s) {
  (S.decisions[e] || (S.decisions[e] = {
    yes: 0,
    no: 0
  }))[s ? "yes" : "no"]++;
}

function applyGoal(e) {
  const s = opp(e), a = performance.now();
  S.goal = e, S.plan = {
    goal: e,
    tasks: fallbackPlan(s),
    done: {},
    ai: !1,
    at: Date.now()
  }, S.plan.seed = planSeed(S.plan), S.iv = null, ui.sel = e, event("goal", {
    id: e
  }), logReady(), save(), aiOn() || (logRun("plan", "rules", performance.now() - a, !0, {
    v: "rules-v1"
  }), save());
}

async function setGoal(e) {
  if (applyGoal(e), aiOn()) {
    buildingModal();
    const s = await aiPlan(opp(e));
    s && S.plan && S.plan.goal === e && (S.plan.tasks = s, S.plan.ai = !0, save()), 
    closeModal();
  }
}

async function finishSetupWithGoal(e) {
  await setGoal(e), S.stage = "app", S.screen = "home", save(), render(!0), setTimeout(() => {
    say(t("say_back", {
      name: S.profile.name || ""
    }), "happy"), SND.play("ok");
  }, 400);
}

const hasPassport = () => !(!S.profile.name || !confirmed().length);

function qName(e) {
  if ("me" === e) return S.profile.name || "—";
  const s = UNI.queue.find(s => s.id === e);
  return s ? "string" == typeof s.name ? pn(s.name) : tx(s.name) : e;
}

function uniLog(e) {
  (S.uni.log = S.uni.log || []).push({
    t: Date.now(),
    what: e
  }), S.uni.log.length > 200 && S.uni.log.splice(0, S.uni.log.length - 200);
}

function filmBtn() {
  const e = $("#filmBtn");
  e && (e.innerHTML = filmIcon(FILM.paused), e.setAttribute("aria-label", t(FILM.paused ? "film_play" : "film_pause")));
}

const ACT = {
  noop() {},
  lang(e) {
    const s = L();
    if (S.lang = e.dataset.l, S.plan && !S.plan.ai && s !== S.lang && opp(S.plan.goal)) {
      const e = S.plan.done, s = planSeed(S.plan);
      S.plan.tasks = fallbackPlan(opp(S.plan.goal), s), S.plan.seed = s, S.plan.done = e;
    }
    save(), render(!0);
  },
  role(e) {
    S.role = e.dataset.r, ui.menu = !1, "uni" === S.role && (ui.uview = "ov"), "ops" === S.role && (ui.ops = "ov"), 
    "student" === S.role && (ui.pubForce = !1, "discover" !== S.stage || ui.disc || (S.stage = confirmed().length ? "app" : "compose")), 
    save(), closeModal(), render(!0), window.scrollTo(0, 0);
  },
  ogo(e) {
    ui.ops = e.dataset.to, render(!0), window.scrollTo(0, 0);
  },
  "sign-out"() {
    S.role = "student", ui.pubForce = !0, ui.pub = "home", ui.menu = !1, save(), closeModal(), 
    render(!0), window.scrollTo(0, 0);
  },
  pub(e) {
    const s = e.dataset.p;
    ui.pub = s, ui.menu = !1, "compose" === S.stage && (S.stage = "landing"), "landing" !== S.stage && (ui.pubForce = !0), 
    render(!0), window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  },
  "pub-menu"() {
    ui.menu = !ui.menu;
    const e = $(".pub-nav");
    e && (e.outerHTML = pubHeader(ui.pub));
    const s = $(".pub-menu");
    s && s.focus();
  },
  start() {
    if (ui.menu = !1, hasPassport()) return ACT.continue();
    ui.pubForce = !1, ui.cmRet = !1, S.stage = "compose", S.role = "student", save(), 
    render(!0), window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  },
  continue() {
    ui.menu = !1, ui.pubForce = !1, S.role = "student", [ "app", "setup" ].includes(S.stage) || (S.stage = S.profile.name ? "app" : "setup"), 
    "setup" === S.stage && S.profile.name && (ui.setupStep = "goal"), save(), render(!0), 
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  },
  "cm-type"(e) {
    ui.cmType = ui.cmType === e.dataset.k ? null : e.dataset.k, $$('[data-act="cm-type"]').forEach(e => {
      const s = e.dataset.k === ui.cmType;
      e.classList.toggle("on", s), e.setAttribute("aria-pressed", s);
    });
    const s = $("#story");
    s && s.dispatchEvent(new Event("input"));
  },
  "cm-back"() {
    hasPassport() ? S.stage = "app" : (S.stage = "landing", ui.pub = "home"), ui.pubForce = !1, 
    save(), render(!0), window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  },
  "demo-student"(e) {
    if (!hasPassport() || S.demo || e.dataset.ok) loadDemoStudent(), render(!0), window.scrollTo({
      top: 0,
      behavior: "instant"
    }), setTimeout(() => toast(t(PUBLIC ? "si_ex_in" : "si_demo_in", {
      name: S.profile.name
    }), "user"), 500); else {
      const e = $("#siConfirm");
      e && (e.innerHTML = `<div class="confirm">${te("si_replace")}<button class="btn sm" data-act="demo-student" data-ok="1">${te("si_replace_ok")}</button><button class="btn ghost sm" data-act="si-no">${te("cancel")}</button></div>`);
    }
  },
  "si-no"() {
    const e = $("#siConfirm");
    e && (e.innerHTML = "");
  },
  "film-go"(e) {
    const s = +e.dataset.i, a = $("#film");
    if (a && (FILM.paused = !1, a.classList.remove("paused"), filmBtn(), filmPlay(s), 
    !e.closest("#film"))) {
      const e = a.getBoundingClientRect();
      (e.top < 0 || e.bottom > innerHeight) && a.scrollIntoView({
        behavior: RM() ? "auto" : "smooth",
        block: "center"
      });
    }
  },
  "film-toggle"() {
    const e = $("#film");
    e && (FILM.paused = !FILM.paused, e.classList.toggle("paused", FILM.paused), filmBtn(), 
    FILM.paused ? (FILM.tok++, filmFinal(FILM.scene)) : filmPlay(FILM.scene));
  },
  async "u-rep"(e) {
    const s = +e.dataset.k;
    e.disabled = !0;
    const a = await saveFile(`skilma-${[ "summary", "programmes", "verifications" ][s - 1]}.csv`, reportCSV(s), "text/csv;charset=utf-8");
    e.isConnected && (e.disabled = !1), null !== a && (a ? (uniLog(t("ur" + s + "t") + " · CSV"), 
    save(), toast(t("ur_saved"), "download"), SND.play("ok")) : toast(t("ur_fail"), "x"));
  },
  "u-min"(e) {
    S.uni.minGroup = +e.dataset.n, uniLog(t("us_priv") + " · " + t("us_min", {
      n: nfmt(S.uni.minGroup)
    })), save(), renderMain(), toast(t("us_saved"), "lock");
  },
  ugo(e) {
    ui.uview = e.dataset.to, render(!0), window.scrollTo(0, 0);
  },
  go(e) {
    closeModal(), go(e.dataset.to);
  },
  "focus-story"() {
    const e = $("#story");
    e.scrollIntoView({
      behavior: RM() ? "auto" : "smooth",
      block: "center"
    }), setTimeout(() => e.focus({
      preventScroll: !0
    }), RM() ? 0 : 400);
  },
  "scroll-to"(e) {
    const s = document.getElementById(e.dataset.id);
    s && s.scrollIntoView({
      behavior: RM() ? "auto" : "smooth",
      block: "start"
    });
  },
  starter(e) {
    const s = $("#story");
    s.value = (s.value ? s.value.trim() + " " : "") + starters()[+e.dataset.i], s.dispatchEvent(new Event("input")), 
    s.focus(), s.setSelectionRange(s.value.length, s.value.length);
  },
  sample() {
    const e = $("#story");
    e.value = exText(), e.dispatchEvent(new Event("input")), ACT.discover();
  },
  discover() {
    const e = $("#story"), s = e ? e.value.trim() : "";
    if (s.length < 20 || s.split(/\s+/).length < 4) return shake(e && (e.closest(".lp-box") || e)), 
    toast(t("lp_short"), "pen"), void (e && e.focus());
    startDiscover(s, "app" === S.stage);
  },
  "th-yes"() {
    const e = ui.disc, s = e.items[e.i];
    if (!s || s.res) return;
    s.res = "yes", decide(s.id, !0), addSkill(s.id, s.evidence, "story", s.why), save();
    const a = $("#thName");
    SND.play("pop"), setMood("happy", $(".th-masc") || document), flyTo(a, $("#passMini"), skName(s.id), () => {
      const e = $("#pmCount");
      e && (e.textContent = nfmt(confirmed().length)), revealNext();
    });
  },
  "th-no"() {
    const e = ui.disc, s = e.items[e.i];
    if (!s || s.res) return;
    s.res = "no", decide(s.id, !1), owned(s.id) || (S.skills[s.id] = {
      status: "rejected",
      ev: s.evidence ? [ {
        text: s.evidence,
        src: "story",
        at: Date.now()
      } ] : [],
      rare: RARE.has(s.id),
      why: s.why || "",
      at: Date.now()
    }), save(), setMood("calm", $(".th-masc") || document);
    const a = $("#thName");
    a && a.classList.add("leave"), setTimeout(revealNext, RM() ? 0 : 320);
  },
  "th-fix"(e) {
    const s = ui.disc, a = s.items[s.i], i = $("#thFix");
    if (!a || a.res || !i) return;
    const o = i.hidden;
    if (i.hidden = !o, e.setAttribute("aria-expanded", o), !o) return;
    const r = SK_CAT[a.id], l = new Set(s.items.map(e => e.id).concat(confirmed())), c = Object.keys(SK).filter(e => e !== a.id && !l.has(e) && !S.ops.skillOff[e]).sort((e, s) => (SK_CAT[s] === r) - (SK_CAT[e] === r)).slice(0, 6);
    i.innerHTML = `<p class="dim">${te("th_fix_d")}</p><div class="chips-wrap">${c.map(e => `<button class="chip" data-act="th-pick" data-id="${e}">${esc(skName(e))}</button>`).join("")}</div>`;
    const p = $("button", i);
    p && p.focus();
  },
  "th-pick"(e) {
    const s = ui.disc, a = s.items[s.i], i = e.dataset.id;
    if (!a || a.res || !SK[i]) return;
    decide(a.id, !1), a.fixedFrom = a.id, a.id = i, a.term = "", a.res = "yes", decide(i, !0), 
    addSkill(i, a.evidence, "story"), save(), SND.play("pop");
    const o = $("#thName");
    o && (o.textContent = skName(i)), flyTo(o, $("#passMini"), skName(i), () => {
      const e = $("#pmCount");
      e && (e.textContent = nfmt(confirmed().length)), revealNext();
    });
  },
  "th-all"() {
    const e = ui.disc;
    e.items.forEach((s, a) => {
      a >= e.i && !s.res && (s.res = "yes", decide(s.id, !0), addSkill(s.id, s.evidence, "story", s.why));
    }), e.i = e.items.length - 1, save(), revealNext();
  },
  "disc-next"() {
    const e = ui.disc;
    ui.disc = null, e && e.ret ? (S.stage = "app", S.screen = "passport") : S.profile.name ? (S.stage = S.goal ? "app" : "setup", 
    ui.setupStep = "goal") : (S.stage = "setup", ui.setupStep = "name"), logReady(), 
    save(), render(!0), window.scrollTo(0, 0);
  },
  "disc-retry"() {
    const e = ui.disc;
    ui.disc = null, e && e.ret ? (S.stage = "app", save(), render(), addExpModal(), 
    $("#story").value = e.story) : (S.stage = "compose", save(), render(!0));
  },
  "cm-aim"(e) {
    S.profile.aim = S.profile.aim === e.dataset.k ? null : e.dataset.k, save(), $$('[data-act="cm-aim"]').forEach(e => {
      const s = e.dataset.k === S.profile.aim;
      e.classList.toggle("on", s), e.setAttribute("aria-pressed", s);
    });
  },
  "su-year"(e) {
    S.profile.year = S.profile.year === e.dataset.k ? null : e.dataset.k, save(), $$('[data-act="su-year"]').forEach(e => {
      const s = e.dataset.k === S.profile.year;
      e.classList.toggle("on", s), e.setAttribute("aria-pressed", s);
    });
  },
  "su-lang"(e) {
    const s = e.dataset.k, a = new Set(S.profile.langs || []);
    a.has(s) ? a.delete(s) : a.add(s), S.profile.langs = PLANGS.filter(e => a.has(e)), 
    save(), $$('[data-act="su-lang"]').forEach(e => {
      const s = S.profile.langs.includes(e.dataset.k);
      e.classList.toggle("on", s), e.setAttribute("aria-pressed", s);
    });
  },
  field(e) {
    S.profile.field = e.dataset.f, save(), $$('[data-act="field"]').forEach(e => {
      const s = e.dataset.f === S.profile.field;
      e.classList.toggle("on", s), e.setAttribute("aria-pressed", s);
    });
  },
  "su-name"() {
    const e = $("#nm"), s = e.value.trim();
    if (!s) return shake(e), void e.focus();
    S.profile.name = s.slice(0, 40), save(), ui.setupStep = "goal", render(!0);
  },
  "pick-goal"(e) {
    finishSetupWithGoal(e.dataset.id);
  },
  "su-map"() {
    S.stage = "app", S.screen = "opps", save(), render(!0);
  },
  "su-later"() {
    S.stage = "app", S.screen = "home", save(), render(!0);
  },
  copilot(e) {
    openCopilot(e.dataset.q || "");
  },
  "cp-sug"(e) {
    sendCopilot(t(e.dataset.k));
  },
  "close-modal"() {
    closeModal();
  },
  scrim(e, s) {
    s.target === e && closeModal();
  },
  "open-task"(e) {
    S.plan && openTask(+e.dataset.day);
  },
  "task-done"(e) {
    completeTask(+e.dataset.day);
  },
  "task-help"(e) {
    const s = task(+e.dataset.day);
    closeModal(), openCopilot(`${t("tk_help")} — ${t("day_n", {
      n: s.day
    })}: ${s.title}`);
  },
  step(e) {
    e.checked && (bounce(e), SND.play("tick"));
  },
  "open-opp"(e) {
    ui.sel = e.dataset.id, go("opps");
  },
  "sel-opp"(e) {
    ui.sel = e.dataset.id, SND.play("tick");
    const s = liveOpps().filter(e => "all" === ui.ofilter || e.type === ui.ofilter).map(e => ({
      o: e,
      p: fit(e),
      k: fitRank(e)
    })).sort((e, s) => s.k - e.k);
    $("#mapCard").innerHTML = "map" === ui.oview ? mapSVG(s) : listHTML(s);
    const a = $("#od");
    a.innerHTML = oppDetail(ui.sel), a.style.animation = "none", a.offsetWidth, a.style.animation = "", 
    drawRings(a), runCounts(a), innerWidth < 980 && a.scrollIntoView({
      behavior: RM() ? "auto" : "smooth",
      block: "start"
    });
  },
  ofilter(e) {
    ui.ofilter = e.dataset.f, renderMain();
  },
  oview(e) {
    ui.oview = e.dataset.v, renderMain();
  },
  async explain(e) {
    const s = opp(e.dataset.id), a = $("#whyOut");
    e.disabled = !0, a.innerHTML = '<span class="skel l" style="display:block;width:90%"></span>';
    const i = await aiText(`Tell this student, in 3 short lines each starting with "• ", why they fit the role "${tx(s.title)}" at ${s.org}, quoting their real evidence, and the single most useful first step for their biggest gap. Write in ${langName()}. At most 60 words. Student data: ${profileBrief()}`, e => {
      const s = $("#whyOut");
      s && (s.textContent = e);
    }, {
      modelTier: "quick"
    }, "explain");
    save();
    const o = $("#whyOut");
    o && !i && (o.textContent = whyRules(s)), e.isConnected && (e.disabled = !1);
  },
  "set-goal"(e) {
    const s = e.dataset.id;
    S.plan && S.goal !== s && doneCount() > 0 ? $("#switchBox").innerHTML = `<div class="confirm">${te("od_switch")}<button class="btn sm" data-act="do-switch" data-id="${s}">${te("yes_switch")}</button><button class="btn ghost sm" data-act="no-switch">${te("cancel")}</button></div>` : ACT["do-switch"](e);
  },
  async "do-switch"(e) {
    const s = e.dataset.id;
    await setGoal(s), render(), SND.play("ok"), toast(t("cp_did_goal", {
      x: tx(opp(s).title)
    }), "target"), say(t("say_yes1"), "happy");
  },
  "no-switch"() {
    $("#switchBox").innerHTML = "";
  },
  apply(e) {
    const s = e.dataset.id;
    S.applied[s] || (S.applied[s] = Date.now(), event("apply", {
      id: s
    }), save(), renderMain(), SND.play("tick"), toast(t("applied_toast"), "check", !1, {
      label: t("undo"),
      fn: () => {
        delete S.applied[s], S.events = S.events.filter(e => !("apply" === e.type && e.id === s)), 
        save(), renderMain();
      }
    }));
  },
  untrack(e) {
    const s = e.dataset.id;
    delete S.applied[s], S.events = S.events.filter(e => !("apply" === e.type && e.id === s)), 
    save(), renderMain(), toast(t("od_untracked"), "x");
  },
  async regen(e) {
    if (!S.plan) return;
    e.disabled = !0;
    const s = opp(S.plan.goal);
    buildingModal();
    const a = await aiPlan(s);
    if (closeModal(), a) {
      const e = S.plan.done;
      S.plan.tasks = a, S.plan.done = e, S.plan.ai = !0, save(), renderMain(), toast(t("pl_ai"), "spark");
    } else e.isConnected && (e.disabled = !1);
  },
  "demo-jump"() {
    if (S.plan) {
      for (let e = 1; e <= 28; e++) if (!S.plan.done[e]) {
        const s = task(e), a = "prove" === s.kind ? s.title : "";
        S.plan.done[e] = {
          at: Date.now(),
          proof: a
        }, "prove" !== s.kind || !s.skill || owned(s.skill) && "conf" !== skillState(s.skill) || (addSkill(s.skill, a, "plan"), 
        event("proven", {
          id: s.skill
        }));
      }
      logReady(), save(), go("plan"), toast(t("demo_jump"), "bolt");
    }
  },
  celebrate() {
    celebrate();
  },
  cert() {
    downloadCertificate();
  },
  "flip-card"() {
    ui.flip = !ui.flip;
    const e = $("#idcard");
    e && e.classList.toggle("flipped", ui.flip), SND.play("turn");
  },
  "skill-remove"(e) {
    const s = e.dataset.id;
    if (!S.skills[s]) return;
    const a = S.skills[s].status;
    S.skills[s].status = "rejected", decide(s, !1), logReady(), save(), renderMain(), 
    toast(t("tk_removed", {
      skill: skName(s)
    }), "x", !1, {
      label: t("undo"),
      fn: () => {
        S.skills[s] && (S.skills[s].status = a, decide(s, !0), logReady(), save(), renderMain());
      }
    });
  },
  "skill-restore"(e) {
    const s = e.dataset.id;
    S.skills[s] && (S.skills[s].status = "confirmed", decide(s, !0)), logReady(), save(), 
    renderMain(), SND.play("pop");
  },
  share() {
    shareModal();
  },
  async "copy-link"(e) {
    const s = $("#shareLink");
    try {
      await navigator.clipboard.writeText(s.value);
      const a = e.innerHTML;
      e.innerHTML = ic("check") + te("copied"), e.classList.add("ok"), SND.play("ok"), 
      setTimeout(() => {
        e.isConnected && (e.innerHTML = a, e.classList.remove("ok"));
      }, 2e3);
    } catch (e) {
      s.select();
    }
  },
  "add-exp"() {
    addExpModal();
  },
  "ask-verify"() {
    if (PUBLIC) return;
    S.verify = {
      status: "requested",
      at: Date.now()
    }, save(), renderMain(), toast(t("verify_sent"), "shield");
  },
  "iv-start"() {
    const e = opp(S.goal);
    S.iv = {
      goal: e.id,
      items: [ {
        q: ivQuestions(e)[0],
        qi: 0
      } ],
      done: !1,
      ai: !1
    }, ui.ivTyped = 0, save(), renderMain();
    const s = $("#ivA");
    s && s.focus({
      preventScroll: !0
    });
  },
  async "iv-send"() {
    if (ui.ivBusy) return;
    const e = $("#ivA"), s = e.value.trim(), a = S.iv, i = opp(a.goal);
    if (s.split(/\s+/).length < 8) return shake(e), toast(t("iv_short"), "pen"), void e.focus();
    const o = a.items[a.items.length - 1];
    o.a = s, ui.ivBusy = !0, save(), renderMain();
    const r = $("#ivChat");
    if (r && r.lastElementChild && r.lastElementChild.scrollIntoView({
      block: "end",
      behavior: RM() ? "auto" : "smooth"
    }), ui.rec) try {
      ui.rec.stop();
    } catch (e) {}
    const l = a.single || a.items.length >= 5, c = performance.now();
    let p = aiOn() ? await aiFeedback(o.q, s, i, a.items.map(e => e.q), l) : null;
    if (p ? a.ai = !0 : (await sleep(600), p = rulesFeedback(s, i, o.qi ?? a.items.length - 1, a.items.slice(0, -1).map(e => e.a)), 
    p.rules = !0, logRun("interview", "rules", performance.now() - c, !0, {
      v: "rules-v1"
    })), o.fb = p, l) {
      a.done = !0;
      const e = Math.round(a.items.reduce((e, s) => e + fbScore(s.fb), 0) / a.items.length);
      a.single || (S.ivBest[i.id] = Math.max(S.ivBest[i.id] || 0, e), event("iv", {
        s: e
      }), logReady());
    } else {
      const e = ivQuestions(i), s = p.next && p.next.length > 8;
      a.items.push(s ? {
        q: p.next
      } : {
        q: e[a.items.length],
        qi: a.items.length
      });
    }
    ui.ivBusy = !1, save(), renderMain(), SND.play(l ? "win" : "ok"), l && say(t("say_yes1"), "celebrate");
    const d = $$("#ivChat .fb"), u = d[d.length - 1];
    u && u.scrollIntoView({
      block: "center",
      behavior: RM() ? "auto" : "smooth"
    });
    const _ = $("#ivA");
    _ && _.focus({
      preventScroll: !0
    });
  },
  "iv-retry"(e) {
    const s = opp(S.goal), a = +e.dataset.i || 0, i = S.iv && S.iv.items[a], o = i ? i.q : ivQuestions(s)[0], r = i ? i.qi : 0;
    S.iv = {
      goal: s.id,
      items: [ null != r ? {
        q: o,
        qi: r
      } : {
        q: o
      } ],
      done: !1,
      ai: !1,
      single: !0
    }, ui.ivTyped = 0, save(), renderMain();
    const l = $("#ivA");
    l && l.focus({
      preventScroll: !0
    });
  },
  "iv-pass"(e) {
    S.share.iv = e.checked, save(), toast(t("saved"));
  },
  "iv-mic"(e) {
    if (!SR) return void toast(t("iv_mic_no"), "mic");
    if (ui.rec) {
      try {
        ui.rec.stop();
      } catch (e) {}
      return;
    }
    const s = $("#ivA");
    if (!s) return;
    let a = s.value ? s.value.trim() + " " : "";
    try {
      const i = new SR;
      ui.rec = i, i.lang = {
        en: "en-GB",
        fr: "fr-FR",
        ar: "ar-MA"
      }[LK()], i.interimResults = !0, i.continuous = !0, i.onresult = e => {
        let i = "", o = "";
        for (let s = e.resultIndex; s < e.results.length; s++) {
          const a = e.results[s];
          a.isFinal ? i += a[0].transcript : o += a[0].transcript;
        }
        i && (a += i.trim() + " "), s.value = a + o;
      }, i.onerror = e => {
        "not-allowed" !== e.error && "service-not-allowed" !== e.error && "audio-capture" !== e.error || toast(t("iv_mic_no"), "mic");
      }, i.onend = () => {
        ui.rec = null;
        const e = $("[data-act=iv-mic]");
        e && (e.setAttribute("aria-pressed", "false"), e.classList.remove("on"), $("span", e).textContent = t("iv_mic")), 
        s.focus({
          preventScroll: !0
        });
      }, i.start(), e.setAttribute("aria-pressed", "true"), e.classList.add("on"), $("span", e).textContent = t("iv_mic_on");
    } catch (e) {
      ui.rec = null, toast(t("iv_mic_no"), "mic");
    }
  },
  "toggle-voice"() {
    S.prefs.voice = !S.prefs.voice, save(), renderMain(), S.prefs.voice && voice(t("iv_read"), !0);
  },
  pref(e) {
    const s = e.dataset.k;
    S.prefs[s] = e.checked, save(), applyPrefs(), "sound" === s && e.checked && SND.play("ok"), 
    "voice" === s && e.checked && voice(t("set_voice"), !0);
  },
  "reset-ask"() {
    $("#resetBox").innerHTML = `<div class="confirm">${te("set_reset_q")}<button class="btn sm danger" data-act="reset-do">${te("yes_reset")}</button><button class="btn ghost sm" data-act="reset-no">${te("cancel")}</button></div>`;
  },
  "reset-no"() {
    $("#resetBox").innerHTML = "";
  },
  "reset-do"() {
    const e = S.lang;
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    S = blank(), S.lang = e, ui.disc = null, ui.flip = !1, ui.setupStep = "name", save(), 
    render(!0);
  },
  "u-verify"(e) {
    if (PUBLIC) return toast(t("u_demo"), "info");
    const s = e.dataset.id, a = e.closest(".q-card");
    "me" === s ? (S.verify = {
      status: "verified",
      at: Date.now()
    }, confirmed().forEach(e => S.skills[e].ver = !0), S.notices.push("verified"), event("ver")) : S.uni.handled[s] = "verified", 
    uniLog(t("u_verify") + " · " + qName(s)), save(), a.classList.add("out"), SND.play("ok"), 
    toast(t("u_vt"), "shield"), setTimeout(() => render(), 420);
  },
  "u-more"(e) {
    const s = e.dataset.id, a = e.closest(".q-card");
    "me" === s ? S.verify = {
      status: "none",
      at: 0
    } : S.uni.handled[s] = "asked", uniLog(t("u_more") + " · " + qName(s)), save(), 
    a.classList.add("out"), toast(t("u_at"), "chat"), setTimeout(() => render(), 420);
  },
  "u-plan"(e) {
    S.uni.handled[e.dataset.id] = "planned", uniLog(t("u_planned")), save(), renderMain(), 
    SND.play("ok"), toast(t("u_planned"), "plan");
  },
  async "u-ins"(e) {
    e.disabled = !0;
    $("#insList").innerHTML = [ 0, 1, 2 ].map(() => `<article class="ins"><i>${ic("spark")}</i><div style="display:grid;gap:8px"><span class="skel l" style="width:60%"></span><span class="skel l" style="width:95%"></span><span class="skel l" style="width:80%"></span></div></article>`).join("");
    const s = JSON.stringify({
      university: "Boughaz University (fictional demo)",
      semester: "S1 2026-2027",
      kpi: UNI.kpi,
      funnel: {
        invited: UNI.funnel[0],
        joined: UNI.funnel[1],
        passport: UNI.funnel[2],
        goal: UNI.funnel[3],
        plan: UNI.funnel[4],
        ready: UNI.funnel[5]
      },
      top_gaps_pct: Object.fromEntries(UNI.gaps.map(([e, s]) => [ tx(SK[e]), s ])),
      top_strengths_pct: Object.fromEntries(UNI.strengths.map(([e, s]) => [ tx(SK[e]), s ])),
      new_active_by_month: UNI.active,
      programmes: UNI.programmes.map(e => ({
        programme: t(e.p),
        students: e.n,
        passports: e.pp,
        top_gap: tx(SK[e.gap]),
        avg_readiness: e.r
      }))
    }), a = await aiJSON(`You advise a Moroccan university career centre. Read these anonymous, aggregated figures and write exactly 3 insights a career director can act on this month.\nEach insight must name WHO (a cohort with a number of students), WHY (the evidence in the numbers), WHAT TO DO (one concrete intervention) and how to MEASURE it. Never name or single out individuals.\nWrite in ${"ar" === L() ? "Modern Standard Arabic" : "ary" === L() ? "Moroccan Darija written in Arabic script" : langName()}.\nReply with only JSON: [{"title":"max 9 words, starts with the number of students","detail":"one or two sentences with numbers","action":"one concrete action and how to measure it, max 18 words"}]\nData: ${s}`, "default", "insights");
    Array.isArray(a) && a.length && (S.uni.insights = a.slice(0, 3).map((e, s) => ({
      title: String(e.title || ""),
      detail: String(e.detail || ""),
      action: String(e.action || ""),
      icon: [ "target", "book", "star" ][s]
    })), S.uni.insightsAI = !0, uniLog(t("k_insights"))), save(), renderMain(), SND.play("ok");
  }
};

document.addEventListener("click", e => {
  const s = e.target.closest("[data-act]");
  if (!s) return;
  const a = ACT[s.dataset.act];
  a && (("INPUT" !== s.tagName || "checkbox" !== s.type) && "scrim" !== s.dataset.act ? (e.preventDefault(), 
  a(s, e)) : a(s, e));
}), document.addEventListener("keydown", e => {
  if ("Escape" === e.key && $("#layer").innerHTML) return void closeModal();
  if ("Escape" === e.key && ui.menu) return void ACT["pub-menu"]();
  const s = e.target;
  if (("Enter" === e.key || " " === e.key) && s.matches && s.matches(".map .dot") && (e.preventDefault(), 
  ACT["sel-opp"](s)), "Enter" === e.key && (e.metaKey || e.ctrlKey) && "story" === s.id && (e.preventDefault(), 
  ACT.discover()), "Enter" === e.key && !e.shiftKey && "cpIn" === s.id) {
    e.preventDefault();
    const a = s.value;
    s.value = "", sendCopilot(a);
  }
  if ("Enter" === e.key && "nm" === s.id && (e.preventDefault(), ACT["su-name"]()), 
  "Tab" === e.key && $("#layer [aria-modal=true]")) {
    const s = $$("#layer [aria-modal=true] button:not([disabled]), #layer [aria-modal=true] textarea:not([disabled]), #layer [aria-modal=true] input:not([disabled]), #layer [aria-modal=true] summary");
    if (!s.length) return;
    const a = s[0], i = s[s.length - 1];
    e.shiftKey && document.activeElement === a ? (e.preventDefault(), i.focus()) : e.shiftKey || document.activeElement !== i || (e.preventDefault(), 
    a.focus());
  }
}), document.addEventListener("submit", e => {
  if ("cpForm" === e.target.id) {
    e.preventDefault();
    const s = $("#cpIn"), a = s.value;
    s.value = "", sendCopilot(a);
  }
});

const scrollTop = () => window.scrollTo({
  top: 0,
  behavior: "instant"
});

function navTo(e) {
  return closeModal(), closePop(), applyHash(e), save(), render(!0).then(scrollTop);
}

const valid = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e).trim()), validPhone = e => /^(\+212|00212|0)[5-7](\d{8})$/.test(String(e).replace(/[\s.\-()]/g, ""));

function fieldErr(e, s, a) {
  const i = $("#" + e);
  i && (i.textContent = s || ""), a && (a.setAttribute("aria-invalid", s ? "true" : "false"), 
  s && (shake(a), a.focus()));
}

Object.assign(ACT, {
  portal(e) {
    e.dataset.sample && "uni" === e.dataset.p && !S.auth.uni && (S.auth.uni = !0, ui.uview = "ov", 
    uniLog(t("audit_signin"))), goPortal(e.dataset.p);
  },
  palette() {
    openPalette();
  },
  "live-toggle"() {
    liveToggle();
  },
  "ls-toggle"(e) {
    ui.lsPaused = !ui.lsPaused;
    const s = e.closest(".life");
    s && s.classList.toggle("paused", ui.lsPaused), e.setAttribute("aria-pressed", String(ui.lsPaused)), 
    e.setAttribute("aria-label", t(ui.lsPaused ? "ls_play" : "lv_pause")), e.innerHTML = filmIcon(ui.lsPaused);
  },
  listen(e) {
    if (!("speechSynthesis" in window)) return;
    if (speechSynthesis.speaking) return speechSynthesis.cancel(), void e.classList.remove("on");
    const s = new SpeechSynthesisUtterance([ t("h4_h1"), t("h4_sub"), t("pb_h"), t("en_h") ].join(". "));
    s.lang = {
      en: "en-US",
      fr: "fr-FR",
      ar: "ar-MA"
    }[LK()], s.rate = .98, s.onend = () => e.classList.remove("on"), e.classList.add("on"), 
    speechSynthesis.speak(s);
  },
  "lang-pick"(e) {
    if ("true" === e.getAttribute("aria-expanded")) return closePop(!0);
    langMenu(e);
  },
  theme(e, s) {
    setTheme(e.dataset.v, s);
  },
  async "bk-dl"(e) {
    const s = e.dataset.k, a = "white" === s ? markSVG("#F8F6EF", "#D9B784") : "icon" === s ? markSVG("#F8F6EF", "#D9B784", "#0F3D36") : markSVG(), i = await saveFile(`skilma-${s}.svg`, a, "image/svg+xml");
    toast(t(i ? "saved" : "cert_no"), i ? "download" : "x");
  },
  "o-req-done"(e) {
    const s = (S[e.dataset.k] || []).find(s => s.id === e.dataset.id);
    s && (s.done = !0, opsLog(t("o_done") + " · " + s.org), save(), renderMain(), toast(t("o_done"), "check"));
  },
  "try-ex"() {
    const e = $("#tryT");
    e && (e.value = exText(), e.dispatchEvent(new Event("input")), e.focus({
      preventScroll: !0
    }));
  },
  "try-st"(e) {
    const s = $("#tryT");
    s && (s.value = (s.value.trim() ? s.value.trim() + " " : "") + starters()[+e.dataset.i], 
    s.dispatchEvent(new Event("input")), s.focus({
      preventScroll: !0
    }), s.setSelectionRange(s.value.length, s.value.length));
  },
  "try-clear"() {
    const e = $("#tryT");
    e && (e.value = "", e.dispatchEvent(new Event("input")), e.focus({
      preventScroll: !0
    }));
  },
  "ax-open"() {
    ui.ax = !ui.ax, ui.menu = !1, render();
  },
  "wf-pick"(e) {
    const s = +e.dataset.i;
    ui.wf = s, $$(".wf-tab").forEach((e, a) => e.setAttribute("aria-selected", a === s));
    const a = $("#wfCard");
    a && (a.classList.remove("in"), a.innerHTML = wfCard(s), void a.offsetWidth, a.classList.add("in"));
  },
  "hx-lang"(e) {
    HX.own && hxOwn(!1), HX.hold = !0, clearTimeout(HX.cyc), hxSet(e.dataset.l);
  },
  "hx-own"() {
    hxOwn(!0);
  },
  "hx-back"() {
    hxOwn(!1);
  },
  "try-save"() {
    const e = (ui.tryText || "").trim();
    e && (S.draft = e, ui.menu = !1, S.role = "student", ui.pubForce = !1, ui.cmRet = hasPassport(), 
    S.stage = "compose", save(), render(!0), window.scrollTo({
      top: 0,
      behavior: "instant"
    }));
  },
  "em-go"() {
    const e = document.getElementById("emform");
    if (e) {
      e.scrollIntoView({
        behavior: RM() ? "auto" : "smooth",
        block: "start"
      });
      const s = $("#emO");
      s && setTimeout(() => s.focus({
        preventScroll: !0
      }), RM() ? 0 : 500);
    }
  },
  "theme-toggle"(e, s) {
    setTheme("dark" === themeOf() ? "light" : "dark", s);
  },
  lite() {
    S.prefs.lite = !S.prefs.lite, applyPrefs(), save(), render(), toast(t(S.prefs.lite ? "ax_lite_on" : "ax_lite_off"), "bolt");
  },
  fsize(e) {
    S.prefs.fs = +e.dataset.v, applyPrefs(), save(), render();
  },
  "access-tab"(e) {
    "access" !== ui.pub || "site" !== curPortal() ? (S.role = "student", ui.pubForce = !0, 
    ui.pub = "access", render(!0).then(scrollTop)) : render();
  },
  "o-acc"(e) {
    const s = S.access.find(s => s.id === e.dataset.id);
    s && (s.status = e.dataset.s, opsLog(t("ok" === s.status ? "audit_acc_ok" : "audit_acc_no", {
      x: s.name
    })), save(), render(), toast(t("ok" === s.status ? "oim_given" : "o_decline"), "star"));
  },
  "portal-panel"(e) {
    portalPanel(e);
  },
  tour(e) {
    startTour(e.dataset.k);
  },
  "tour-home"() {
    S.screen = "home", render(!0).then(() => {
      scrollTop(), setTimeout(() => startTour("student"), 450);
    });
  },
  "tour-next"() {
    TOUR.i++, tourShow();
  },
  "tour-skip"() {
    tourEnd();
  },
  skip() {
    const e = $("#main") || $("main");
    e && (e.setAttribute("tabindex", "-1"), e.focus(), e.scrollIntoView({
      block: "start"
    }));
  },
  print() {
    window.print();
  },
  "pal-go"(e) {
    navTo(e.dataset.h);
  },
  pub(e) {
    S.role = "student", ui.pub = e.dataset.p, ui.menu = !1, ui.pubForce = !0, ui.siSent = "signin" === ui.pub ? ui.siSent : null, 
    save(), render(!0).then(scrollTop);
  },
  pilot() {
    S.role = "student", ui.pubForce = !0, ui.menu = !1;
    const go = () => {
      const e = document.getElementById("pilot");
      if (e) {
        e.scrollIntoView({
          behavior: RM() ? "auto" : "smooth",
          block: "start"
        });
        const s = $("#plN");
        s && setTimeout(() => s.focus({
          preventScroll: !0
        }), RM() ? 0 : 500);
      }
    };
    if ("institutions" === ui.pub && $("#pilot")) return go();
    ui.pub = "institutions", save(), render(!0).then(() => setTimeout(go, 60));
  },
  "pf-size"(e) {
    ui.pfSize = +e.dataset.v, $$('[data-act="pf-size"]').forEach(e => e.setAttribute("aria-pressed", +e.dataset.v === ui.pfSize));
  },
  "si-link"() {
    const e = ui.siSent;
    if (ui.siSent = null, hasPassport()) return ACT.continue();
    S.profile.email = e, ui.pubForce = !1, ui.cmRet = !1, S.stage = "compose", save(), 
    render(!0).then(scrollTop), setTimeout(() => toast(t("si_in_new"), "mail"), 400);
  },
  "si-back"() {
    ui.siSent = null, render();
  },
  "csi-sso"() {
    consoleSignIn("uni", "sso");
  },
  "csi-demo"(e) {
    consoleSignIn(e.dataset.k, "demo");
  },
  "sign-out"() {
    closeModal(), closePop();
    const e = curPortal();
    "uni" === e ? (uniLog(t("audit_signout")), S.auth.uni = !1) : "ops" === e ? (opsLog(t("audit_signout")), 
    S.auth.ops = !1) : (S.role = "student", ui.pubForce = !0, ui.pub = "home"), ui.menu = !1, 
    save(), render(!0).then(scrollTop), toast(t("signed_out"), "out");
  },
  "s-menu"(e) {
    studentMenu(e);
  },
  "c-menu"(e) {
    consoleMenu(e);
  },
  "c-more"(e) {
    consoleMenu(e, !0);
  },
  share() {
    S.screen = "passport", ui.ppTab = "share", go("passport");
  },
  "add-exp"() {
    navTo("#/experience/new");
  },
  "pp-tab"(e) {
    if (ui.ppTab = e.dataset.t, "passport" !== S.screen) S.screen = "passport", render(!0).then(scrollTop); else {
      renderMain();
      const e = $(`[data-act="pp-tab"][data-t="${ui.ppTab}"]`);
      e && e.focus({
        preventScroll: !0
      });
    }
  },
  "nt-open"(e) {
    S.read[e.dataset.id] = !0, save();
    const s = ACT[e.dataset.then];
    s ? s(e) : render();
  },
  "nt-all"() {
    notes().forEach(e => S.read[e.id] = !0), save(), render(), toast(t("nt_all_ok"), "check");
  },
  "share-pref"(e) {
    const s = e.dataset.k;
    S.share[s] = e.checked, event("pub" === s ? e.checked ? "pub_on" : "pub_off" : e.checked ? "uni_on" : "uni_off"), 
    save(), toast(t("pub" === s ? e.checked ? "sh_pub_on" : "sh_pub_off" : e.checked ? "sh_uni_on" : "sh_uni_off"), e.checked ? "link" : "lock"), 
    "passport" === S.screen && renderMain();
  },
  "notif-pref"(e) {
    S.notif[e.dataset.k] = e.checked, save(), render(), toast(t("saved"), "bell");
  },
  async "export-data"() {
    const e = {
      exported: (new Date).toISOString(),
      profile: S.profile,
      stories: S.stories,
      skills: S.skills,
      goal: S.goal,
      plan: S.plan,
      interview: S.ivBest,
      applied: S.applied,
      verify: S.verify,
      share: S.share
    }, s = await saveFile(`skilma-${passNo()}.json`, JSON.stringify(e, null, 2), "application/json");
    s ? toast(t("sd_ok"), "download") : !1 === s && toast(t("ur_fail"), "x");
  },
  ugo(e) {
    ui.uview = e.dataset.to, closePop(), render(!0).then(scrollTop);
  },
  "u-stu-tab"(e) {
    ui.uStuTab = e.dataset.t, renderMain();
  },
  "u-prog"(e) {
    ui.uProg = e.dataset.p, renderMain();
  },
  "u-stu"(e) {
    stuDrawer(e.dataset.id);
  },
  "u-nudge"(e) {
    uniLog(t("u_dr_ws") + " · " + (uniStudents().find(s => s.id === e.dataset.id) || {}).nm), 
    save(), closeModal(), toast(t("u_nudge_ok"), "book"), SND.play("ok");
  },
  "u-meet"(e) {
    uniLog(t("u_dr_meet") + " · " + (uniStudents().find(s => s.id === e.dataset.id) || {}).nm), 
    save(), closeModal(), toast(t("u_meet_ok"), "chat");
  },
  heat(e) {
    ui.heatSel = ui.heatSel === e.dataset.k ? null : e.dataset.k, renderMain();
    const s = $(`[data-act="heat"][data-k="${e.dataset.k}"]`);
    s && s.focus({
      preventScroll: !0
    });
  },
  "u-share-op"(e) {
    const s = opp(e.dataset.id);
    S.uni.handled["op_" + s.id] = !0, uniLog(t("u_share_op") + " · " + tx(s.title)), 
    save(), renderMain(), toast(t("u_shared_toast", {
      x: tx(s.short)
    }), "send");
  },
  "u-ins-plan"(e) {
    S.uni.handled["ins" + e.dataset.i] = "planned", uniLog(t("u_planned") + " · " + t("u_nav_ins")), 
    save(), renderMain(), toast(t("u_planned"), "plan");
  },
  async "u-rep"(e) {
    const s = +e.dataset.k;
    e.disabled = !0;
    const a = await saveFile(`skilma-${[ "summary", "programmes", "verifications" ][s - 1]}.csv`, reportCSV(s), "text/csv;charset=utf-8");
    e.isConnected && (e.disabled = !1), null !== a && (a ? (uniLog(t("ur" + s + "t") + " · CSV"), 
    save(), toast(t("ur_saved"), "download"), SND.play("ok")) : toast(t("ur_fail"), "x"));
  },
  "u-min"(e) {
    S.uni.minGroup = +e.dataset.n, ("ops" === S.role ? opsLog : uniLog)(t("us_priv") + " · " + t("us_min", {
      n: nfmt(S.uni.minGroup)
    })), save(), renderMain(), toast(t("us_saved"), "lock");
  },
  ogo(e) {
    ui.ops = e.dataset.to, ui.instSel = null, closePop(), render(!0).then(scrollTop);
  },
  "o-inst-f"(e) {
    ui.instF = e.dataset.f, renderMain();
  },
  "o-inst"(e) {
    const s = allInsts().find(s => s.id === e.dataset.id);
    S.ops.inst[e.dataset.id] = e.dataset.s, opsLog(t("audit_inst", {
      x: s ? s.name : e.dataset.id,
      s: t("ost_" + e.dataset.s)
    })), save(), render(), toast(t("ost_" + e.dataset.s) + " · " + (s ? s.name : ""), "building"), 
    SND.play("ok");
  },
  "o-invite"() {
    inviteModal();
  },
  "o-user"(e) {
    S.ops.userOff = S.ops.userOff || {}, S.ops.userOff[e.dataset.id] = !e.checked;
    const s = allUsers().find(s => s.id === e.dataset.id);
    if (opsLog(t(e.checked ? "audit_user_on" : "audit_user_off", {
      x: s ? s.name : ""
    })), save(), renderMain(), !e.checked) {
      const a = e.dataset.id;
      toast(t("audit_user_off", {
        x: s ? s.name : ""
      }), "lock", !1, {
        label: t("undo"),
        fn: () => {
          S.ops.userOff[a] = !1, opsLog(t("audit_user_on", {
            x: s ? s.name : ""
          })), save(), renderMain();
        }
      });
    }
  },
  "o-skill"(e) {
    S.ops.skillOff[e.dataset.id] = !e.checked, opsLog(t(e.checked ? "audit_sk_on" : "audit_sk_off", {
      x: skName(e.dataset.id)
    })), save(), renderMain();
    const s = e.dataset.id, a = e.checked;
    toast(t(a ? "os_on_t" : "os_off_t", {
      x: skName(s)
    }), "layers", !1, {
      label: t("undo"),
      fn: () => {
        S.ops.skillOff[s] = a, save(), renderMain();
      }
    });
  },
  "o-opp"(e) {
    S.ops.oppOff[e.dataset.id] = !e.checked, opsLog(t(e.checked ? "audit_op_on" : "audit_op_off", {
      x: tx(opp(e.dataset.id).title)
    })), save(), renderMain(), toast(t(e.checked ? "oo_on_t" : "oo_off_t"), "brief");
  },
  async "o-bench"() {
    const e = $("#oqT"), s = e ? e.value.trim() : "";
    if (s.length < 12) return void shake(e);
    ui.benchText = s, ui.benchBusy = !0, renderMain();
    const a = performance.now(), i = rulesDiscover(s).map(e => e.id), o = Math.max(1, Math.round(performance.now() - a));
    logRun("bench", "rules", o, !0, {
      v: "rules-v1"
    });
    let r = null, l = 0;
    if (aiOn()) {
      const e = performance.now(), a = await aiDiscover(s);
      l = Math.round(performance.now() - e), a && (r = a.map(e => e.id).filter(e => SK[e]));
    }
    const c = new Set(i.concat(r || [])), p = i.filter(e => (r || []).includes(e)).length;
    ui.bench = {
      rules: i,
      ai: r,
      rms: o,
      ams: l,
      agree: c.size ? Math.round(p / c.size * 100) : 100
    }, ui.benchBusy = !1, opsLog(t("audit_bench")), save(), "ops" === S.role && "quality" === ui.ops && renderMain();
  },
  "o-aud-f"(e) {
    ui.audF = e.dataset.f, renderMain();
  },
  async "o-audit-dl"() {
    await saveFile("skilma-audit.csv", csv([ [ t("oa_when"), t("oa_who"), t("oa_what") ] ].concat(auditRows().map(e => [ new Date(e.t).toISOString(), t(e.who), e.what ]))), "text/csv;charset=utf-8") && toast(t("ur_saved"), "download");
  },
  "o-engine"(e) {
    S.ops.rulesOnly = "1" === e.dataset.v, opsLog(t("audit_engine", {
      x: t(S.ops.rulesOnly ? "oset_e_rules" : "oset_e_ai")
    })), save(), renderMain(), refreshPills(), toast(t("saved"), "spark");
  },
  "o-maint"(e) {
    S.ops.maint = e.checked, opsLog(t(e.checked ? "audit_maint_on" : "audit_maint_off")), 
    save(), render(), toast(t(e.checked ? "o_maint_on" : "o_maint_off"), "alert");
  },
  "o-ret"(e) {
    S.ops.retention = e.dataset.v, opsLog(t("oset_ret") + " · " + t("months_n", {
      n: nfmt(+e.dataset.v)
    })), save(), renderMain();
  },
  "o-fb-done"(e) {
    const s = S.feedback.find(s => s.id === e.dataset.id);
    s && (s.done = !0), opsLog(t("audit_fb_done")), save(), render();
  },
  "o-reset-ask"() {
    $("#oResetBox").innerHTML = `<div class="confirm">${te("oset_reset_q")}<button class="btn sm danger" data-act="o-reset-do">${te("yes_reset")}</button><button class="btn ghost sm" data-act="o-reset-no">${te("cancel")}</button></div>`;
  },
  "o-reset-no"() {
    $("#oResetBox").innerHTML = "";
  },
  "o-reset-do"() {
    const e = S.lang;
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    S = blank(), S.lang = e, S.role = "ops", S.auth.ops = !0, ui.disc = null, ui.bench = null, 
    opsLog(t("audit_reset")), save(), render(!0), toast(t("oset_reset_ok"), "refresh");
  },
  "reset-do"() {
    const e = S.lang, s = {
      ops: S.ops,
      auth: S.auth,
      pilots: S.pilots,
      feedback: S.feedback,
      uni: S.uni,
      prefs: S.prefs,
      tours: S.tours
    };
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    S = Object.assign(blank(), s), S.lang = e, ui.disc = null, ui.flip = !1, ui.setupStep = "name", 
    ui.pubForce = !0, ui.pub = "home", save(), render(!0).then(scrollTop);
  }
});

const _uMore = ACT["u-more"];

function applyPrefs() {
  document.body.classList.toggle("calm", !(!S.prefs.calm && !S.prefs.lite)), document.body.classList.toggle("lite", !!S.prefs.lite), 
  document.body.style.zoom = S.prefs.fs && 1 !== S.prefs.fs ? S.prefs.fs : "";
}

ACT["u-more"] = e => {
  "me" === e.dataset.id && event("vermore"), _uMore(e);
}, document.addEventListener("submit", e => {
  const s = e.target, a = s.dataset && s.dataset.form;
  if (a) {
    if (e.preventDefault(), "si" === a) {
      const e = $("#siE"), s = e.value.trim();
      return valid(s) || validPhone(s) ? (ui.siSent = s, void render()) : fieldErr("siErr", t("err_id"), e);
    }
    if ("pilot" === a) {
      const e = $("#plN"), s = $("#plI"), a = $("#plE");
      if (!e.value.trim()) return fieldErr("plErr", t("err_name"), e);
      if (!s.value.trim()) return fieldErr("plErr", t("err_inst"), s);
      if (!valid(a.value)) return fieldErr("plErr", t("err_email"), a);
      const i = {
        id: "req" + uid(),
        name: e.value.trim().slice(0, 60),
        role: $("#plR").value.trim().slice(0, 60),
        inst: s.value.trim().slice(0, 80),
        email: a.value.trim(),
        city: $("#plC").value,
        size: [ "<1k", "1–5k", "5k+" ][ui.pfSize || 0],
        at: Date.now(),
        mine: !0
      };
      S.pilots.push(i), save();
      const o = $(".pilot-f");
      return o && (o.innerHTML = pilotDone(i)), SND.play("win"), void toast(t("pf_ok_t"), "check");
    }
    if ("usi" === a || "osi" === a) {
      const e = $("#csiE");
      return valid(e.value) ? (e.setAttribute("aria-invalid", "false"), "usi" === a ? void ($("#csiState").innerHTML = `<div class="keywait">${ic("mail")}<span>${te("usi_sent", {
        email: e.value.trim()
      })}</span><button class="linkbtn" data-act="csi-demo" data-k="uni">${te("si_open")}</button></div>`) : consoleSignIn("ops", "key")) : (e.setAttribute("aria-invalid", "true"), 
      shake(e), e.focus(), void ($("#csiState").innerHTML = `<p class="f-err" role="alert">${te("err_email")}</p>`));
    }
    if ("access" === a) {
      const e = $("#acN"), s = $("#acC"), a = $("#acE");
      return e.value.trim() ? s.value.trim() ? a.value.trim().length < 6 ? fieldErr("acErr", t("err_contact"), a) : (S.access.push({
        id: "ac" + uid(),
        name: e.value.trim().slice(0, 60),
        place: s.value.trim().slice(0, 60),
        school: $("#acS").value.trim().slice(0, 80),
        contact: a.value.trim().slice(0, 80),
        why: $$("input[name=acW]:checked").map(e => +e.value),
        at: Date.now(),
        mine: !0
      }), save(), render(), SND.play("win"), void toast(t("ac_ok_t"), "check")) : fieldErr("acErr", t("err_place"), s) : fieldErr("acErr", t("err_name"), e);
    }
    if ("emp" === a) {
      const e = $("#emO"), s = $("#emN"), a = $("#emE");
      return e.value.trim() ? s.value.trim() ? valid(a.value) ? (S.employers = (S.employers || []).concat({
        id: "em" + uid(),
        org: e.value.trim().slice(0, 80),
        name: s.value.trim().slice(0, 60),
        email: a.value.trim(),
        roles: $("#emR").value.trim().slice(0, 120),
        intern: $("#emI").checked,
        at: Date.now(),
        mine: !0
      }), save(), render(), SND.play("win"), void toast(t("em_ok_t"), "check")) : fieldErr("emErr", t("err_email"), a) : fieldErr("emErr", t("err_name"), s) : fieldErr("emErr", t("err_org"), e);
    }
    if ("partner" === a) {
      const e = $("#paO"), s = $("#paE");
      return e.value.trim() ? s.value.trim().length < 6 ? fieldErr("paErr", t("err_contact"), s) : (S.partners = (S.partners || []).concat({
        id: "pa" + uid(),
        org: e.value.trim().slice(0, 80),
        contact: s.value.trim().slice(0, 80),
        skills: $("#paS").value.trim().slice(0, 160),
        fmt: $$("form[data-form=partner] input[type=checkbox]:checked").map(e => e.value),
        at: Date.now(),
        mine: !0
      }), save(), render(), SND.play("win"), void toast(t("em_ok_t"), "check")) : fieldErr("paErr", t("err_org"), e);
    }
    if ("fb" === a) {
      const e = $("#fbT"), s = e.value.trim();
      return s.length < 5 ? fieldErr("fbErr", t("err_fb"), e) : (S.feedback.push({
        id: uid(),
        t: Date.now(),
        text: s.slice(0, 600),
        screen: S.screen
      }), save(), e.value = "", fieldErr("fbErr", ""), toast(t(PUBLIC ? "fb_ok_pub" : "fb_ok"), "send"), void SND.play("ok"));
    }
    if ("invite" === a) {
      const e = $("#ivE");
      if (!valid(e.value)) return fieldErr("ivErr", t("err_email"), e);
      const s = {
        id: "inv" + uid(),
        e: e.value.trim(),
        r: $("#ivR").value,
        org: $("#ivO").value,
        last: 0
      };
      return S.ops.users.push(s), opsLog(t("audit_invite", {
        x: s.e
      })), save(), closeModal(), renderMain(), void toast(t("ou_sent"), "mail");
    }
  }
}), document.addEventListener("input", e => {
  const s = e.target;
  if ("uQ" === s.id || "oQ" === s.id) {
    const e = s.id, a = s.selectionStart;
    ui[e] = s.value, renderMain();
    const i = $("#" + e);
    if (i) {
      i.focus();
      try {
        i.setSelectionRange(a, a);
      } catch (e) {}
    }
  }
}), document.addEventListener("keydown", e => {
  const s = e.target;
  ("Enter" === e.key || " " === e.key) && s.matches && s.matches("tr[data-act]") && (e.preventDefault(), 
  s.click());
}), function boot() {
  applyTheme(), applyPrefs(), [ "student", "uni", "ops" ].includes(S.role) || (S.role = "student"), 
  "discover" === S.stage && (S.discSave && S.discSave.items && S.discSave.items.length ? ui.disc = S.discSave : S.stage = confirmed().length ? S.profile.name ? "app" : "setup" : "compose"), 
  "setup" === S.stage && S.profile.name && (ui.setupStep = "goal"), location.hash && "#/" !== location.hash && "#" !== location.hash && applyHash(location.hash), 
  render(), ui.booted = !0, initAI().then(() => {
    ("student" === curPortal() ? "app" === S.stage : "site" !== curPortal() && S.auth[S.role]) ? renderMain() : refreshPills();
  }), initDownloads(), addEventListener("resize", () => {
    FX.cv && (FX.cv.width = 0), closePop();
  }, {
    passive: !0
  });
}();