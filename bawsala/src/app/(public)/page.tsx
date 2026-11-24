import "@/styles/proto-home.css";
import { getT } from "@/i18n/server";
import { getCurrentUser } from "@/server/auth/current";
import { SAMPLE_OPPORTUNITIES, CITIES, SKILLS } from "@/server/domain/catalog";
import { SKILL_NAMES } from "@/lib/skill-names";
import { ProtoHome } from "@/components/public/proto-home/proto-home";
import { renderTryOut, type TryData } from "@/components/public/proto-home/try-out";
import { STRINGS, TXA, TXZ } from "@/components/public/proto-home/strings";
import { tx, type HomeLocale } from "@/components/public/proto-home/format";
import en from "@/components/public/proto-home/snap.en";
import fr from "@/components/public/proto-home/snap.fr";
import ar from "@/components/public/proto-home/snap.ar";
import ary from "@/components/public/proto-home/snap.ary";
import zgh from "@/components/public/proto-home/snap.zgh";

const SNAPS = { en, fr, ar, ary, zgh };
const initials = (s: string) => s.trim().split(/\s+/).map((w) => [...w][0]).slice(0, 2).join("");

/**
 * The original BAWSALA homepage (legacy/prototypes/BAWSALA.html), in the visitor's language. The design is the
 * prototype's own markup and styles; actions and the try-it analysis run on the app's real routes and engine.
 */
export default async function Landing() {
  const { locale } = await getT();
  const l = locale as HomeLocale;
  const snap = SNAPS[l];
  const user = await getCurrentUser();
  const home = user ? (user.role === "platform_admin" ? "/admin" : user.role === "institution_admin" ? "/institution" : "/app") : null;
  const tryData: TryData = {
    roles: SAMPLE_OPPORTUNITIES.map((o) => ({
      ini: initials(o.organization), title: tx(o.title, l, TXA, TXZ), org: o.organization, city: tx(CITIES[o.city], l, TXA, TXZ) || o.city,
      req: [...o.required.map((id) => [id, true] as [string, boolean]), ...o.nice.map((id) => [id, false] as [string, boolean])],
    })),
    names: Object.fromEntries(Object.keys(SKILL_NAMES).map((id) => [id, tx(SKILL_NAMES[id], l, TXA, TXZ) || id])),
    hours: Object.fromEntries(SKILLS.map((s) => [s.id, s.learn?.hours ?? null])),
  };
  // Signed-in visitors: the prototype's own "open my passport" label on the start buttons.
  const S = STRINGS[l];
  const startLabel = (html: string) => (home ? html.split(`>${S.pub_start} `).join(`>${S.pub_open} `) : html);
  const main = startLabel(snap.main).replace("<!--TRYOUT-->", renderTryOut("", l, tryData));
  return (
    <ProtoHome locale={l} header={startLabel(snap.header)} headerMenu={startLabel(snap.headerMenu)} main={main} footer={startLabel(snap.footer)} pop={snap.pop}
      tryData={tryData} startHref={home ?? "/signup"} />
  );
}
