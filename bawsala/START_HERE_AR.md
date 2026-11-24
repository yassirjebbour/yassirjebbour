# ابدا من هنا: كيفاش تبني SKILMA بـ Claude Code

> **تحديث 19 نونبر (v1.1):** هاد النسخة فيها القرارات اللي حسمنا: 3 لغات فقط (العربية والفرنسية والإنجليزية)، نفس الألوان واللوغو، بلا أثمنة فالمنصة، والراشدين فقط فالبداية. وزدنا `docs/WEEK1_PLAN.md`: هادي هي الحدود ديال هاد السيمانة، وما كيتبنى والو برا منها. والنسخة القديمة ولات v12 (أخف وكاشف أدق)، ومعاها الكود المقروء فـ `docs/legacy/src/` ومجموعات الاختبار فـ `docs/legacy/evals/`.

## 1. شنو كاين فهاد الكيت
| الملف | شنو كيدير |
|---|---|
| `CLAUDE.md` | Claude Code كيقراه بوحدو فكل جلسة. فيه القواعد والمراجع والمكدس التقني |
| `docs/SKILMA_MASTER_SPEC.md` | الـ spec الأساسية ديال إعادة البناء |
| `docs/SKILMA_GENIUS_LAYER.md` | الرؤية: الأوضاع والأفكار القوية والأولويات |
| `docs/BUILD_SPEC.md` | مرجع تقني مفصل |
| `docs/STRATEGY_BLUEPRINT_AR.md` | الاستراتيجية بالعربية |
| `docs/QUALITY_BAR.md` | تعريف "المستوى العالمي" بمعايير كتتقاس |
| `docs/legacy/SKILMA_v0.9.html` | النسخة القديمة، باش يستخرج منها الترجمات والبيانات |
| `docs/PROGRESS.md` و `docs/DECISIONS.md` | سجل التقدم والقرارات |
| `.claude/agents/` | 5 ديال المراجعين: الالتزام بالـ spec، أمان البيانات، اللغات والـ RTL، جودة الـ AI، والتصميم |
| `.claude/skills/` | أوامر: `/audit-existing` و`/phase-start` و`/phase-audit` و`/extract-legacy` و`/user-test` |
| `.claude/settings.json` | الصلاحيات: ممنوع عليه يقرا `.env`، و`git push` خاصو يسولك قبل |

## 2. التحضير (مرة وحدة)
1. حط هاد الملفات فالمجلد ديال المشروع اللي خدام عليه فـ Claude Code، فالجذر ديالو. إلا كان عندك `CLAUDE.md` قديم، دمج القواعد ديالو فالجديد ولا بدّلو.
2. الحسابات اللي غادي تحتاج: GitHub، وSupabase، وVercel (ولا أي استضافة)، وAPI key ديال الـ LLM (للـ AI ديال التطبيق)، ومن بعد Sentry وWhatsApp Business.
3. الـ keys حطهم غير فـ `.env.local`، وعمرك ما تلصقهم فالشات.

## 3. الترتيب (هادي هي الطريقة اللي كتوصلك للمستوى)
1. **أول حاجة: `/audit-existing`**
   حيت بنيتي شي حوايج والمستوى ديالهم ماشي هو هداك، هاد الأمر كيقيّم كلشي من 1 حتى 5 ويقرر فكل جزء: نخليوه، نصلحوه، ولا نعاودو نبنيوه. ما كيبدلش الكود.
2. **قرا التقرير وحسم.** إلا كانت الأساسات غالطة، بحال الـ API keys فالمتصفح ولا ما كاينش RLS، الإصلاح كيكون أغلى من إعادة البناء.
3. **`/extract-legacy`**: كيستخرج الترجمات والبيانات والـ Prompts من النسخة القديمة بالكود.
4. **`/phase-start A`**: كيعطيك خطة، وكتوافق عليها قبل ما يكتب الكود.
5. البناء خطوة بخطوة، مع commit بعد كل خطوة ناجحة.
6. **حلقة الجودة لكل شاشة:** screenshots، و`design-critic` كيقيّم، كيصلح، وكيعاود حتى يوصل 4 من 5 (و5 من 5 فلحظات الـ wow).
7. **`/phase-audit A`**: ما كتدوزش للمرحلة B حتى تكون كلها PASS.
8. **`/user-test`** مع ناس حقيقيين قبل ما تقول "سالينا".

## 4. قواعد ذهبية مع Claude Code
- **Plan mode** (`Shift+Tab`) قبل أي حاجة كبيرة: يخطط، كتوافق، عاد كيبني.
- **مرحلة وحدة فكل جلسة.** ملي يطوال الشات استعمل `/clear`، حيت الـ `CLAUDE.md` و`PROGRESS.md` كيحفظو الاستمرارية.
- **ما تقبلش "خدام" بلا دليل:** طلب نتائج الاختبارات وscreenshots.
- **ما تطلبش "دير كلشي wow" دقة وحدة.** المستوى كيجي من حلقات صغيرة: تبني، تقيّم، تصلح.
- **القرارات ديالك** (الألوان، الأثمنة، المزودين…) كاينين فـ `docs/DECISIONS.md`. حسم فيهم نتا، ما تخليش الأداة تخمن.

## 5. أول ميساج (فنفس جلسة Claude Code اللي بنات المشروع)
حط ملفات هاد الكيت فالمستودع الموجود (ما تبداش مشروع جديد)، ومن بعد لصق:
```
Read CLAUDE.md, docs/DECISIONS.md, docs/WEEK1_PLAN.md and docs/QUALITY_BAR.md. Open docs/design/skilma-prototype.html in a browser.
This repo already exists: do NOT restart or migrate it. Run /audit-existing (no code changes) and report, against WEEK1_PLAN:
what already passes, what is missing, and the exact order of work. Include the rename BAWSALA → SKILMA, the language change
(ar, fr, en, ary; drop Tamazight UI), and the AI budget caps. Then wait for my approval.
```
