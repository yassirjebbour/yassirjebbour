import Link from "next/link";
import { getT } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <main id="main" className="auth-wrap"><div className="stack" style={{ textAlign: "center", alignItems: "center" }}>
      <h1>{t("errors.not_found_title")}</h1><p className="muted">{t("errors.not_found_body")}</p>
      <Link className="btn btn-primary" href="/">{t("errors.go_home")}</Link>
    </div></main>
  );
}
