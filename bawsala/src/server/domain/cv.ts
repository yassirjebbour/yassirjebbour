/**
 * CV checks (deterministic). Detects structure, contact details, measurable results, action
 * verbs and sensitive data that should not be on a CV. Skill detection is delegated to
 * the analysis pipeline by the caller.
 */
export interface CvReport {
  words: number;
  sections: { experience: boolean; education: boolean; skills: boolean; languages: boolean };
  contact: { email: boolean; phone: boolean; link: boolean };
  numbers: number;
  actionVerbs: number;
  sensitive: string[]; // codes: national_id, birth_date, marital_status
  issues: string[]; // codes, most important first
}

const SECTION = {
  experience: /exp[ée]rience|stages?|internship|employment|work history|خبرة|خبرات|تجارب|التجربة المهنية|تداريب/i,
  education: /education|formation|dipl[ôo]me|cursus|études|التكوين|التعليم|المسار الدراسي|الدراسة|شهادات/i,
  skills: /skills|compétences|competences|savoir-faire|المهارات|الكفاءات/i,
  languages: /languages|langues|اللغات/i,
};
const VERBS = /\b(led|managed|organi[sz]ed|created|built|sold|negotiated|designed|analy[sz]ed|developed|improved|increased|reduced|launched|trained|coordinated|géré|organisé|créé|vendu|négocié|conçu|analysé|développé|amélioré|augmenté|réduit|lancé|formé|coordonné|encadré)\b|أدرت|نظمت|أنجزت|طورت|حللت|صممت|بعت|أشرفت|نسقت/giu;

export function analyzeCvText(text: string): CvReport {
  const words = (text.match(/\S+/g) ?? []).length;
  const sections = {
    experience: SECTION.experience.test(text), education: SECTION.education.test(text),
    skills: SECTION.skills.test(text), languages: SECTION.languages.test(text),
  };
  const contact = {
    email: /[\w.+-]+@[\w-]+\.[\w.]+/.test(text),
    phone: /(\+212|00212|\b0)[\s.-]?[5-7](?:[\s.-]?\d){8}\b/.test(text),
    link: /(linkedin\.com|github\.com|behance\.net|https?:\/\/)/i.test(text),
  };
  const numbers = (text.match(/\b\d+([.,]\d+)?\s?(%|k|dh|mad|درهم|clients?|ventes|participants|personnes|people)?/giu) ?? []).length;
  const actionVerbs = (text.match(VERBS) ?? []).length;
  const sensitive: string[] = [];
  if (/\b(CIN|C\.I\.N|carte nationale|البطاقة الوطنية)\b|\b[A-Z]{1,2}\d{5,7}\b/.test(text)) sensitive.push("national_id");
  if (/\b(né|née|date de naissance|born on|date of birth|تاريخ الازدياد|تاريخ الميلاد)\b/i.test(text)) sensitive.push("birth_date");
  if (/\b(célibataire|marié|mariée|married|single|متزوج|أعزب)\b/i.test(text)) sensitive.push("marital_status");
  const issues: string[] = [];
  if (words < 80) issues.push("too_short");
  if (words > 900) issues.push("too_long");
  if (!contact.email) issues.push("missing_email");
  if (!contact.phone) issues.push("missing_phone");
  if (!sections.experience) issues.push("missing_experience_section");
  if (!sections.education) issues.push("missing_education_section");
  if (!sections.skills) issues.push("missing_skills_section");
  if (!sections.languages) issues.push("missing_languages_section");
  if (numbers < 2) issues.push("few_numbers");
  if (actionVerbs < 3) issues.push("few_action_verbs");
  if (sensitive.length) issues.push("sensitive_data");
  if (!contact.link) issues.push("no_link");
  return { words, sections, contact, numbers, actionVerbs, sensitive, issues };
}
