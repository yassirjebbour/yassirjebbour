import { getT } from "@/i18n/server";
import { pick } from "@/i18n/config";
import { SKILL_NAMES, SKILL_CATEGORY } from "@/lib/skill-names";
import { Constellation, StarField, type SkyStar } from "../viz";

// Illustration only: one skill in each trust state, so the panel shows the whole passport idea.
const SAMPLE: Array<[string, SkyStar["status"]]> = [
  ["customer_service", "verified"], ["excel", "evidenced"], ["inventory", "inferred"], ["teamwork", "inferred"],
  ["event", "suggested"], ["leadership", "evidenced"], ["multilingual", "inferred"], ["social_media", "suggested"],
];

/** Sign-in, sign-up and password pages: the form beside a night panel that explains the product. */
export async function AuthShell({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  const { t, locale } = await getT();
  const stars: SkyStar[] = SAMPLE.map(([id, status]) => ({ id, status, category: SKILL_CATEGORY[id] ?? "other", label: pick(SKILL_NAMES[id], locale) || id }));
  return (
    <div className="auth-split">
      <div className="auth-main">
        <div className="auth-card panel stack enter">
          <div className="stack-sm"><h1>{title}</h1>{sub ? <p className="muted">{sub}</p> : null}</div>
          {children}
        </div>
      </div>
      <aside className="auth-side night">
        <StarField count={36} seed="auth" />
        <Constellation stars={stars} seed="auth-sky" />
        <blockquote>{t("home.auth_quote")}</blockquote>
        <ul>
          <li>{t("home.auth_point_1")}</li>
          <li>{t("home.auth_point_2")}</li>
          <li>{t("home.auth_point_3")}</li>
        </ul>
      </aside>
    </div>
  );
}
