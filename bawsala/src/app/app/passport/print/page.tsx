import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { getPassport } from "@/server/repo/skills";
import { pick } from "@/i18n/config";
import { SKILLS } from "@/server/domain/catalog";
import { PrintButton } from "@/components/app/print-button";

/** Printable / PDF-able passport (browser "Save as PDF"). States are spelled out so readers know what each means. */
export default async function Page() {
  const user = await requireUser();
  const { t, locale } = await getT();
  const skills = await getPassport(user.id);
  const label = (s: string) => ({ declared: t("passport.status_declared"), inferred: t("passport.status_inferred"), evidenced: t("passport.status_evidenced"), verified: t("passport.status_verified") }[s] ?? s);
  const today = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale === "fr" || locale === "zgh" ? "fr-MA" : "ar-MA", { dateStyle: "long", numberingSystem: "latn" }).format(new Date());
  return (
    <article className="stack" style={{ maxWidth: 760, marginInline: "auto" }}>
      <div className="row-between"><h1>{t("passport.print_title", { name: user.name })}</h1><PrintButton label={t("passport.print")} /></div>
      <p className="small muted">{t("passport.print_note", { date: today })}</p>
      {skills.map((s) => (
        <section key={s.id} className="panel stack-sm">
          <div className="row-between"><h2>{pick(SKILLS.find((x) => x.id === s.skill_id)?.names, locale)}</h2><span className={`badge b-${s.status}`}>{label(s.status)}</span></div>
          {s.evidence.map((e) => <p key={e.id} className="quote">{e.text}{e.url ? ` — ${e.url}` : ""}</p>)}
        </section>
      ))}
    </article>
  );
}
