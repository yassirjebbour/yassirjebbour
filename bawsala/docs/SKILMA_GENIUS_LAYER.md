# SKILMA — THE GENIUS LAYER
### One product. Every person. Rich or with zero dirhams, literate or unable to read: everyone leaves with proof of what they can do.

> **Use with:** `SKILMA_MASTER_SPEC.md` (the rebuild spec). This file adds the *vision layer*: the ideas that make people feel SKILMA was built by someone who deeply understood them. Where this file adds features, they plug into the phases of the master spec (see Part 9 here).
> **Date:** 2026-11-19.

---

## PART 0 — WHAT "GENIUS" ACTUALLY MEANS IN A PRODUCT

Products that feel genius do not have more features. They pass these 6 tests:

1. **It understands me before I explain.** A person speaks for 60 seconds in their own Darija, and SKILMA reflects back skills they never knew had a name.
2. **Zero effort to start.** No app to install, no form, no reading required, no money required.
3. **A truth that surprises.** "You think you 'just help at the shop'. You actually prove 4 skills that 3 employers in Tangier are asking for this week."
4. **Dignity.** It never treats the poor as charity cases or the illiterate as lesser. The same passport, the same respect, the same quality.
5. **It does something no one else can.** It turns invisible, informal, real-life ability into proof that a stranger (an employer) trusts.
6. **It gets better the more people use it.** Every job, every 90-day retention, every verification makes everyone's passport more trusted.

**The core principle of this layer:**
> **One promise, many doors.** The promise never changes ("turn what you can do into proof, and proof into opportunity"). The *door* adapts to the person: voice or text, WhatsApp or web, phone call or app, simple or pro, Darija or French or English.

**Strict warning:** "A platform for everyone" usually becomes a platform for no one. SKILMA avoids that because the **engine is one** (the evidence ladder, the passport, the outcomes) and only the **interface adapts**. Never build separate products per segment.

---

## PART 1 — THE PEOPLE (the full spectrum)

| Persona | Reality | What they need | Their door |
|---|---|---|---|
| **Amine**, 22, master's student, laptop, good French | Diploma, no proof of practical skill, 200 CVs sent | Stand out with proof, international options | Web/App, "Pro" mode |
| **Salma**, 24, graduate, unemployed 2 years, Android, limited data | Losing confidence, doesn't know what she's worth | Discover skills, a path, a first job | App (Lite) + WhatsApp |
| **Youssef**, 19, left school at 15, works in his uncle's mechanic shop, reads with difficulty | Real skills, zero paper proof, invisible to formal employers | Talk, not type; proof of craft | **Voice door** (WhatsApp voice notes or a phone call) |
| **Fatima Zahra**, 27, at home, NEET, family constraints, shared phone | Talented (sewing, cooking, managing a household budget), can't travel far | Private, home-based pathways, remote work | WhatsApp voice, "Private mode" |
| **Hajj Abdelkader**, 45, maâlem (master craftsman) in the medina | Trains apprentices, respected, not digital | A way to vouch for his apprentices | **Witness door** (one voice note) |
| **Karim**, 30, engineer, earns well, wants to move to Europe/Canada | Needs his skills translated into international standards | ESCO-mapped portfolio, mobility readiness | Pro mode (optional paid tier) |
| **A career-centre head** | Must report employability, has no data | Cohort outcomes, funder reports | Institution console |
| **An HR manager at a call center** | Wastes time screening, 40% leave in 3 months | Pre-verified candidates who stay | Employer portal |

---

## PART 2 — THE ADAPTIVE DOOR ENGINE

### 2.1 How SKILMA chooses the door (ask once, then adapt silently)
At first contact, SKILMA asks **one** question, shown as 3 large picture-buttons, each of which also plays audio when tapped:
- 🎙️ "I prefer to talk" → **Voice mode**
- ✍️ "I prefer to write" → **Standard mode**
- 💼 "I want the full professional tools" → **Pro mode**

Then it adapts silently from signals: low typing speed, frequent voice use, small screen, slow network → suggest Lite/Voice. All modes can be switched in one tap at any time. **Never label a mode as "for illiterate" or "for poor" people.** The labels describe preferences, not people.

### 2.2 The modes (same engine, different surface)
| Mode | Interface | Key rules |
|---|---|---|
| **Voice** | Big buttons with icons + audio; every screen readable aloud automatically; answers by voice; minimal text; passport also as **audio** | Every step can be completed without reading a single word. Consent is explained by voice and recorded as a verbal consent (with a transcript). |
| **Standard** | The current SKILMA UX | Unchanged. |
| **Lite** | Text-first, no animation, no images, on-device reader | < 100 KB per screen; works on 3G. |
| **Pro** | Dense dashboards, international mapping (ESCO/ISCO), English portfolio export, advanced analytics on your own progress | Never blocks anything that is free in the other modes. |
| **Private** | No public passport, neutral app name in notifications ("S."), quick-exit button, PIN lock | For people who need discretion on a shared phone. |

---

## PART 3 — THE DOORS (channels)

### 3.1 Door A — WhatsApp (the default door for most people)
The **entire core journey** works inside WhatsApp, with no app install:
1. The person sends "سلام" to the SKILMA number (or scans a QR code at a youth centre, a school, or an association).
2. SKILMA replies with a voice note in Darija plus text: "Tell me about the last thing you did that you're proud of, or something you do every day."
3. The person sends a **voice note** (up to 2 minutes).
4. Within 30–60 seconds: "You proved 4 skills: 1) customer service 2) cash handling 3) … Here is your passport 👉 [link]." The link opens a web passport that works without login (a magic link), plus a 20-second audio summary.
5. Next steps arrive at a rhythm the person chooses (max 2 messages per week): a Skill Challenge by voice, an opportunity nearby, a check-in.

### 3.2 Door B — A plain phone call (zero data, zero smartphone)
- A phone number (local or toll-free, depending on what partners can fund): the person **calls**, an AI voice in Darija runs the conversation (IVR + speech recognition + LLM), and the passport link is sent by **SMS**. A trusted person (a teacher, a parent, an association worker) can open it on another phone.
- **Why it's genius:** it reaches people with a basic phone and no internet. Almost no "AI career platform" does this.
- **Reality check:** it needs a telephony provider with Moroccan numbers and good Darija speech recognition. Validate both (cost per minute, recognition accuracy) before committing. Build it in Phase F, not first.

### 3.3 Door C — Web / PWA app
The current SKILMA, with all modes.

### 3.4 Door D — SKILMA Points (physical)
A tablet or a shared PC in partner places: youth centres (*Dar Chabab*), associations, training centres, university career centres. A trained **SKILMA Ambassador** (a young person, paid per verified passport created) helps people start. This is how SKILMA reaches people who would never find it online.

### 3.5 Door E — Witness door (for people who vouch)
A maâlem, a former boss, a client, or a trainer receives a WhatsApp message: "Youssef says he worked with you for 2 years repairing motorbikes. Can you confirm in a voice note what he can do?" They answer **by voice in 30 seconds**. No account, no app (Part 4, idea 3).

---

## PART 4 — THE 14 BREAKTHROUGH IDEAS

Format: **What · Why it's genius · How it works · Guardrails · Priority (P1 = build first).**

### 1. "Talk, and see yourself" (the mirror moment) — P1
- **What:** The first 60 seconds. The person speaks or writes freely about their life, and SKILMA visibly *finds* skills inside their own words, highlighting the exact phrase for each skill.
- **Why genius:** it creates an emotional shock based on truth, not flattery. People realize that informal life experience *is* skill.
- **How:** the existing Discover engine plus voice input plus an animation where words light up in gold and fly into the passport. In Voice mode, SKILMA reads back: "When you said '…', that proves you can …".
- **Guardrails:** never invent skills; only exact quotes (already a SKILMA rule). Show "left out" honestly.

### 2. Proof from real work (photo / video / voice work samples) — P1
- **What:** a tailor sends a photo of a djellaba she made, a mechanic sends a 30-second video explaining a repair, a cook sends photos of a catering order. SKILMA turns this into structured evidence.
- **Why genius:** the poorest and least literate people often have the *most visible* proof of skill: their work. CV-based platforms ignore it completely.
- **How:** a vision-capable model describes the artifact against a rubric ("finishing quality", "complexity") and asks 2 voice follow-up questions to check ownership ("How long did the collar take? Why did you choose this stitch?"). The result is evidence level **Proven** (level 2), not Demonstrated.
- **Guardrails:** a photo can be stolen, so artifacts never reach level 3 without a live follow-up and never reach level 4 without a witness. Strip location metadata (EXIF) from uploads. Never show faces publicly.

### 3. The Maâlem Network (traditional apprenticeship, made verifiable) — P1
- **What:** Morocco's crafts and trades run on master–apprentice trust. SKILMA lets the maâlem, the former boss, or a client **vouch by voice** in a structured format (what the person did, for how long, how well, would you hire them again).
- **Why genius:** it digitizes a trust system that already exists and that formal hiring ignores. Research on standardized reference letters (J-PAL, South Africa) found they **raised employer response rates by 60%**, with larger benefits for women.
- **How:** the witness gets a WhatsApp link with a one-time code, records a 30–60 second voice note answering 4 guided questions, and confirms their phone number. SKILMA transcribes it, structures it, and attaches it as evidence level **Verified (witness)**.
- **Guardrails:** anti-fraud measures: a witness can vouch for a maximum of N people per month; repeated circular vouching is detected; the employer sees the witness's relationship to the candidate. The witness's identity is shared only with their consent.

### 4. The Passport that speaks — P1
- **What:** every passport has a QR code; scanning it shows the skills **and** plays a 20–30 second clip (voice, or video if the person agrees) of the person explaining their best work.
- **Why genius:** employers hire people, not documents. Hearing confidence and clarity in 20 seconds beats a page of text. For a person who can't write a CV, their voice *is* their CV.
- **How:** recorded during onboarding or after a challenge; the person can re-record it anytime; it is off by default and turned on with explicit consent.
- **Guardrails:** voice can reveal gender, region, and accent, which are bias risks. The clip is **never** used in AI scoring, it is shown to employers only after shortlisting (or if the person makes it public), and employers are reminded of fair-hiring rules.

### 5. Paid Proof (the passport that pays on day 1) — P2
- **What:** employers post **paid micro-tasks** (30 minutes to 3 hours of real work: translate a product sheet, call 10 shops to update data, design 3 social posts, test a delivery route). A young person does the task, **gets paid**, and the employer's rating becomes evidence.
- **Why genius:** for someone with zero money, the first thing SKILMA gives is **income**, not a promise. For employers it is a risk-free trial ("try before you hire"). For SKILMA it creates the strongest evidence (real work, real employer) and a transaction revenue line.
- **How:** an escrow-like flow through a licensed payment provider or mobile wallet (to be selected); a minimum fair pay floor per hour set by SKILMA; tasks reviewed before publishing.
- **Guardrails:** labor and tax law review before launch; no unpaid "test tasks" ever; payment guaranteed before the task starts; no tasks that are disguised full-time work.

### 6. The Skill Radar (my city, my skills, this week) — P2
- **What:** a live map: "In Tangier this week, 37 openings ask for customer service + French; you prove 2 of the 3 skills they need."
- **Why genius:** it turns abstract "labor market data" into a personal, local, actionable signal.
- **How:** aggregate job postings from partner employers, institutions, and public sources (respecting site terms and privacy); extract skills; match them to the person's evidence.
- **Guardrails:** show counts only with a clear source and date; never fabricate demand.

### 7. Home-to-Work pathways (for people who can't leave home) — P2
- **What:** curated remote pathways for people with family or mobility constraints: AI data annotation in Darija (Moroccan speech and text data is scarce, so this is real, paid work), online customer support, e-commerce product listing, transcription, and home-based craft sales.
- **Why genius:** about 70% of Moroccan NEET youth are inactive, and young women at home form the largest group (HCP 2026). A platform that offers them a dignified path from home reaches a population almost no one serves.
- **How:** Private mode, flexible hours, remote challenges, partners that hire remotely. SKILMA itself can be the first employer: hire people to label Darija speech for SKILMA's own voice models, with fair pay and consent. That builds SKILMA's dataset while creating jobs.
- **Guardrails:** no exploitative piece rates; transparent pay; never share the person's location.

### 8. Sponsor a Passport (rich helps poor, with dignity) — P2
- **What:** extends the existing "1 for 10" promise. Individuals, the diaspora (Moroccans living abroad), and companies can **sponsor** passports, challenges, voice minutes, and ambassador support for people in remote areas.
- **Why genius:** it turns the price difference between users into a feature. The well-off user pays (or donates), and the person with zero dirhams receives exactly the same quality. Nobody sees who is sponsored (dignity by design).
- **How:** sponsorship credits, a public aggregate impact counter (real numbers only), and an annual impact report for sponsors.
- **Guardrails:** sponsored people are never shown as "beneficiaries" in the UI; no photos of beneficiaries in marketing without explicit consent.

### 9. Diaspora Mentors (voice office hours) — P3
- **What:** Moroccans working abroad give 15-minute voice mentoring sessions to young people in their field.
- **Why genius:** it connects the poorest neighborhoods to global professional networks, in Darija.
- **How:** scheduling, voice calls through the platform, ratings, and safeguarding rules.
- **Guardrails:** verified mentors, recorded consent, reporting tools, adults only, no private contact exchange in v1.

### 10. Pro Mode & International Mobility — P3 (the optional paid tier)
- **What:** for high-income or highly educated users: skills mapped to international taxonomies (ESCO/ISCO), English and French portfolio exports, language-certificate tracking, and a readiness checklist for target countries.
- **Why genius:** the same evidence engine serves the engineer leaving for Europe and the apprentice in the medina. The rich user pays for convenience and premium tooling, never for access to the core.
- **How:** a subscription; part of the revenue funds "Sponsor a Passport".
- **Guardrails:** no promises about visas or recognition; it is information and preparation only.

### 11. The Honest Coach (never fake motivation) — P1
- **What:** the existing copilot persona ("a smart friend, not a motivational coach") extended: it tells the truth kindly. "This role asks for French at B2. You're around A2. Here's a 6-week plan, or here are 3 roles where your Darija + Spanish is an advantage."
- **Why genius:** people have been lied to by motivational content. Respectful honesty builds trust and return visits.
- **How:** the coach uses only the person's real evidence and real opportunities (tool calls), with a voice option.
- **Guardrails:** no job guarantees; distress protocol; no medical, legal, or financial advice.

### 12. Family Mode (parents as allies) — P3
- **What:** with the young person's consent, a parent or guardian receives a simple voice summary of progress ("Salma earned proof of 2 new skills this month").
- **Why genius:** in Morocco, family support often decides whether a young person (especially a young woman) can take a job. Turning family into allies changes outcomes.
- **Guardrails:** consent controlled entirely by the young person, revocable anytime; never shares scores or messages; disabled by default.

### 13. The Employer Truth Report — P2
- **What:** after 90 days, employers get a report: which candidates stayed and which skills predicted retention in *their* company.
- **Why genius:** it makes SKILMA indispensable to employers (a workflow, not a tool) and builds SKILMA's moat: outcome-linked skills data.
- **Guardrails:** aggregated, fairness-checked, and never used to blacklist individuals.

### 14. Zero-cost engineering (making "free" sustainable) — P1
- **What:** a design discipline, not a feature: every free action must cost almost nothing to run.
- **How:** the on-device reader (already in SKILMA) handles a first pass offline; small models for extraction; large models only for scoring and challenges; caching; voice minutes budgeted per person (sponsor credits extend them); WhatsApp messages batched and rate-limited.
- **Rule:** the cost of serving one person with zero money must stay low enough that one institution contract or sponsor covers hundreds of people. Track **cost per passport** and **cost per verified job** in `/ops`.

---

## PART 5 — THE ECONOMICS OF "FREE FOR WHOEVER CAN'T PAY"

| Who pays | For what | Why they pay |
|---|---|---|
| Universities, schools, training centres | Per student per year / license | Employability reporting, outcomes, accreditation |
| NGOs & funded programs | Per beneficiary / outcome reports | Funders demand measured outcomes |
| Employers | Per role, per assessed candidate, Paid Proof commission | Lower screening cost, better retention |
| Sponsors (companies, diaspora, foundations) | Passport and voice credits | CSR, impact, visibility (real numbers only) |
| Pro-mode users | Subscription | Premium tools, international mobility |
| Public programs (later) | Licenses, outcome-based contracts | Large-scale inclusion targets |

**The person with zero dirhams never pays anything to get their passport, take challenges, or apply.**

---

## PART 6 — THE 7 WOW MOMENTS (design these like a film)

| # | Moment | What the person feels | Design |
|---|---|---|---|
| 1 | First 60 seconds (mirror) | "It understood me." | Words light up in gold and become skills; Voice mode reads them back in Darija |
| 2 | Passport created | "I exist on paper now." | A book-cover reveal, the person's name in gold, a soft paper sound (only if sound is on), a 600 ms card flip; a sponsored passport looks exactly the same as any other |
| 3 | First Demonstrated skill | "I proved it myself." | The evidence dot fills from described to demonstrated with one ring ripple, plus their own best quote shown |
| 4 | Witness vouches | "Someone vouched for me." | A notification with the voucher's voice (with consent): "Hajj Abdelkader confirmed your work" |
| 5 | Employer opens the passport | "Someone is looking at me." | "An employer in Tangier viewed your passport" (shows city only, never a name, until the employer contacts them) |
| 6 | First paid task or job | "It changed my life." | One dignified full-screen moment (no confetti spam); option to thank whoever helped (witness, mentor, sponsor), anonymously if preferred |
| 7 | Day 90 still working | "I'm building a career." | The evidence level "Confirmed on the job" appears; a gold seal on the passport; an invitation to become an Ambassador or a witness for others |

**Motion rules:** green/gold identity; transform and opacity only; Calm mode = fades; Lite = none; `prefers-reduced-motion` respected; every wow moment also works as audio only (Voice mode).

---

## PART 7 — ANTI-FEATURES (what a genius product refuses to do)

- ❌ No single "employability score out of 100" for a person. People are not numbers; skills have levels with evidence.
- ❌ No AI decides who gets hired.
- ❌ No selling or renting of personal data, ever. Write it on `/trust`.
- ❌ No gamification that infantilizes adults (badges for logging in, confetti for every click).
- ❌ No "premium" that blocks what poor users need.
- ❌ No fake numbers, testimonials, or partner logos.
- ❌ No public photos of people by default.
- ❌ No unpaid "test work" for employers.
- ❌ No promises of jobs, visas, or salaries.

---

## PART 8 — DATA & SCHEMA ADDITIONS (add to the master spec Part 5.3)
```sql
user_modes(user_id, mode[voice|standard|lite|pro|private], auto_detected bool, changed_at)
channels(user_id, whatsapp_e164, sms_ok bool, phone_call_ok bool, preferred[whatsapp|web|call])
verbal_consents(id, student_id, purpose, audio_path, transcript, notice_version, locale, at)
artifacts(id, student_id, type[photo|video|audio|file|link], storage_path, exif_stripped bool, vision_summary jsonb, followup_turns jsonb, evidence_id)
witnesses(id, phone_hash, display_name_optional, relationship[maalem|employer|client|trainer|teacher|other], vouch_count_month)
witness_statements(id, witness_id, student_id, skill_ids uuid[], audio_path, transcript, structured jsonb, consent_share_identity bool, status, at)
voice_intros(id, student_id, audio_path, video_path, visibility[private|after_shortlist|public], recorded_at)
paid_tasks(id, employer_id, title jsonb, brief jsonb, skill_ids, hours_est, pay_amount, currency, status, escrow_ref)
task_assignments(id, task_id, student_id, submitted_artifact_id, employer_rating jsonb, paid_at, evidence_id)
sponsorships(id, sponsor_type[company|individual|diaspora|foundation], sponsor_ref, credits jsonb, region_focus, at)
sponsored_credits(id, student_id, sponsorship_id, credit_type[voice_minutes|challenges|ambassador], amount, used)   -- never shown in student UI
ambassadors(id, user_id, site_id, payout_rate, verified_passports_count)
skilma_points(id, name, type[dar_chabab|association|career_centre|training_centre], city, partner_institution_id)
mentors(id, user_id, country, fields, verified, safeguarding_ok) ; mentor_sessions(id, mentor_id, student_id, scheduled_at, status, rating)
family_links(id, student_id, guardian_phone_hash, consent_scope, active)
```
**RLS and privacy apply to all of these exactly like the master spec.** Witness and guardian phone numbers are stored hashed when possible; audio follows the retention policy.

---

## PART 9 — PRIORITIES & HOW THIS PLUGS INTO THE MASTER SPEC PHASES

| Idea | Priority | Master-spec phase |
|---|---|---|
| Adaptive modes (Voice, Lite, Private, Pro shell) | P1 | Phase A (Lite and Calm exist; add Voice and Private) and Phase B |
| 1. Mirror moment upgrade | P1 | Phase A |
| 2. Proof from real work (photo, video, voice) | P1 | Phase B |
| 3. Maâlem / witness network | P1 | Phase B |
| 4. Passport that speaks | P1 | Phase B |
| 11. Honest coach | P1 | Phase A (port) → Phase B (tools) |
| 14. Zero-cost engineering | P1 | All phases |
| WhatsApp full journey (Door A) | P1 | Pulled forward to Phase B (master spec had it in E) |
| 6. Skill Radar | P2 | Phase C |
| 13. Employer Truth Report | P2 | Phase D |
| 5. Paid Proof | P2 | Phase D (after legal review) |
| 7. Home-to-Work pathways | P2 | Phase D |
| 8. Sponsor a Passport | P2 | Phase C |
| Door D: SKILMA Points + Ambassadors | P2 | Phase C (operations, little code) |
| Door B: phone-call IVR | P3 | Phase F (new, after Phase E) |
| 9. Diaspora mentors | P3 | Phase F |
| 10. Pro mode & mobility | P3 | Phase F |
| 12. Family mode | P3 | Phase F |

**Rule for the agent:** never build a P2 or P3 item before all P1 items of the current phase pass their acceptance checks.

---

## PART 10 — ACCEPTANCE TESTS FOR "EVERYONE FEELS IT'S FOR THEM"

Run these with real people before calling a phase done (5 people per persona minimum):
- [ ] **Youssef test:** a person who reads with difficulty gets a passport with ≥ 2 skills using only voice, without help, in under 10 minutes.
- [ ] **Zero-data test:** the WhatsApp journey works on a basic Android with WhatsApp only and a weak signal.
- [ ] **Fatima Zahra test:** Private mode on a shared phone leaks nothing in notifications, previews, or app name; quick-exit works.
- [ ] **Hajj Abdelkader test:** a non-digital witness completes a vouch from one WhatsApp link in under 2 minutes.
- [ ] **Karim test:** a highly educated user finds Pro tools sophisticated enough to respect (exports, ESCO mapping) and does not feel the product is "basic".
- [ ] **Employer test:** a recruiter trusts the passport enough to call a candidate they would never have picked from a CV.
- [ ] **Dignity test:** nobody can tell from the UI who is sponsored, who is poor, or who is illiterate.
- [ ] **Wow test:** after the first session, ask "how did it feel?" At least 7 of 10 people describe surprise or recognition ("it understood me", "I didn't know I could…"), not just "it's nice".

---

## PART 11 — MESSAGE TO SEND THE AGENT
```text
Read SKILMA_GENIUS_LAYER.md together with SKILMA_MASTER_SPEC.md.
The genius layer adds adaptive modes (Voice, Lite, Private, Pro) and 14 ideas with priorities (Part 9).
Do not start any new phase. First:
 1) Update the Phase A and Phase B plans to include every P1 item from Part 9, and show the diff against the original plan.
 2) Add the schema additions from Part 8 to the migration plan, with RLS policies and tests.
 3) Design the Voice mode as a complete journey (screens and audio scripts in Darija, Arabic, and French) for: first contact → mirror moment → consent (verbal) → passport → first challenge.
 4) List any legal or partner dependencies (telephony, payments, WhatsApp templates) as open decisions.
Wait for my approval.
```

---

## SOURCES (for claims in this file)
- NEET structure in Morocco (≈70% inactive, young women at home the largest group; ≈76% without a diploma): https://www.moroccoworldnews.com/2026/04/288511/one-in-three-young-moroccans-are-neet-as-2-9-million-face-job-education-gaps/
- Reference letters raised employer response by 60%, larger effects for women (J-PAL / Harambee): https://www.povertyactionlab.org/ar/node/7800624?lang=ar
- Credible shareable skill certificates raised employment and earnings (AER 2022): https://www.povertyactionlab.org/ar/node/3196342
- LLM screening bias and proxy inference (UW): https://www.geekwire.com/2024/ai-overwhelmingly-prefers-white-and-male-job-candidates-in-new-test-of-resume-screening-bias/
- The rest of the sources are listed in `SKILMA_MASTER_SPEC.md`.
