import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { FeedbackForm } from "@/components/feedback-form";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("help.title") }; }

export default async function Page() {
  const { t } = await getT();
  const faqs = [1, 2, 3, 4, 5, 6] as const;
  return (
    <div className="container section stack-lg" style={{ maxWidth: 820 }}>
      <h1>{t("help.title")}</h1>
      <section className="stack" aria-labelledby="faq">
        <h2 id="faq">{t("help.faq_title")}</h2>
        {faqs.map((n) => (
          <details key={n} className="panel">
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>{t(`help.q${n}`)}</summary>
            <p style={{ marginTop: 12 }} className="muted">{t(`help.a${n}`)}</p>
          </details>
        ))}
      </section>
      <section className="panel stack" aria-labelledby="contact">
        <h2 id="contact">{t("help.contact_title")}</h2>
        <p className="muted">{t("help.contact_sub")}</p>
        <FeedbackForm />
      </section>
    </div>
  );
}
