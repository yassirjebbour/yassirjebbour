import Link from "next/link";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { LanguageSwitcher, ThemeToggle } from "./language-switcher";
import { getCurrentUser } from "@/server/auth/current";

export async function PublicHeader() {
  const { t } = await getT();
  const user = await getCurrentUser();
  return (
    <header className="pub-head">
      <div className="container">
        <Link href="/" className="brand" aria-label="BAWSALA"><Image src="/brand/bawsala-app-icon.svg" alt="" width={28} height={28} unoptimized priority /><span>BAWSALA</span></Link>
        <nav className="row" aria-label="BAWSALA">
          <LanguageSwitcher compact />
          <ThemeToggle />
          {user ? (
            <Link className="btn btn-primary btn-sm" href={user.role === "platform_admin" ? "/admin" : user.role === "institution_admin" ? "/institution" : "/app"}>{t("nav.home")}</Link>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" href="/signin">{t("auth.signin")}</Link>
              <Link className="btn btn-primary btn-sm" href="/signup">{t("auth.signup")}</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export async function PublicFooter() {
  const { t } = await getT();
  return (
    <footer className="pub-foot">
      <div className="container stack-sm">
        <nav className="row" aria-label="Footer">
          <Link href="/privacy">{t("landing.footer_privacy")}</Link>
          <Link href="/terms">{t("landing.footer_terms")}</Link>
          <Link href="/help">{t("landing.footer_help")}</Link>
        </nav>
        <p className="small">{t("landing.footer_note")}</p>
        <p className="small">© {new Date().getFullYear()} BAWSALA</p>
      </div>
    </footer>
  );
}
