import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { LanguageSwitcher, ThemeToggle } from "./language-switcher";
import { HeaderTone } from "./public/header-tone";
import { getCurrentUser } from "@/server/auth/current";

export async function PublicHeader() {
  const { t } = await getT();
  const user = await getCurrentUser();
  return (
    <HeaderTone>
      <div className="container">
        <Link href="/" className="brand" aria-label="BAWSALA">
          <Image src="/brand/bawsala-app-icon.svg" alt="" width={30} height={30} unoptimized priority />
          <span>BAWSALA</span>
        </Link>
        <nav className="row" aria-label="BAWSALA">
          <Link href="/#how" className="pub-link hide-mobile">{t("landing.how_title")}</Link>
          <Link href="/help" className="pub-link hide-mobile">{t("nav.help")}</Link>
          <span className="hide-sm row" style={{ gap: 2, flexWrap: "nowrap" }}><LanguageSwitcher compact /><ThemeToggle /></span>
          {user ? (
            <Link className="btn btn-primary btn-sm" href={user.role === "platform_admin" ? "/admin" : user.role === "institution_admin" ? "/institution" : "/app"}>{t("nav.home")}</Link>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm pub-signin" href="/signin">{t("auth.signin")}</Link>
              <Link className="btn btn-primary btn-sm" href="/signup">{t("auth.signup")}</Link>
            </>
          )}
        </nav>
      </div>
    </HeaderTone>
  );
}

export async function PublicFooter() {
  const { t } = await getT();
  return (
    <footer className="pub-foot">
      <div className="container foot-grid">
        <div className="stack-sm foot-brand">
          <Link href="/" className="brand" aria-label="BAWSALA"><Image src="/brand/bawsala-app-icon.svg" alt="" width={30} height={30} unoptimized /><span>BAWSALA</span></Link>
          <p>{t("home.footer_tagline")}</p>
        </div>
        <nav className="foot-links" aria-label={t("landing.footer_help")}>
          <Link href="/#how">{t("landing.how_title")}</Link>
          <Link href="/help">{t("landing.footer_help")}</Link>
          <Link href="/privacy">{t("landing.footer_privacy")}</Link>
          <Link href="/terms">{t("landing.footer_terms")}</Link>
        </nav>
        <div className="foot-lang"><LanguageSwitcher /></div>
        <div className="foot-note">
          <p className="small">{t("landing.footer_note")}</p>
          <p className="small">© {new Date().getFullYear()} BAWSALA</p>
        </div>
      </div>
    </footer>
  );
}
