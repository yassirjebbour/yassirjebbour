# Changelog

## 0.1.0 — 2026-11-02 (rebuild)

First version of BAWSALA as a real web application (previous versions were single-file HTML prototypes, preserved in
`legacy/`).

- Accounts with sessions, password reset, export and deletion; consent recorded at sign-up.
- Onboarding, profile, experiences, CV upload (PDF/DOCX/TXT).
- Skill analysis (rules engine for EN/FR/MSA/Darija in both scripts/Tifinagh; LLM extraction with grounding).
- Skills Passport with consent, evidence, institution verification, export and print.
- Opportunity matching with sources and demo labels; gap analysis; 30-day paths with proof.
- Assistant with 15 tools, streaming, citations, plan confirmation; deterministic basic mode.
- Knowledge base with hybrid retrieval (pgvector + full-text + Arabizi expansion) and evaluation.
- Five-language interface (ar, ary, fr, en, zgh) with RTL and Tifinagh.
- Institution portal (k-anonymous stats, verification queue) and admin console.
- Feature flags, notifications, email outbox, first-party analytics, request ids.
- Security review with fixes; backup role and restore test; CI workflow; Dockerfile.
