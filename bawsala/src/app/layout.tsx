import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { getT } from "@/i18n/server";
import { LOCALE_META } from "@/i18n/config";
import { I18nProvider } from "@/components/i18n";
import { ToastProvider } from "@/components/ui";
import { ClientErrorReporter } from "@/components/client-errors";
import { ServiceWorkerRegister } from "@/components/sw-register";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: { default: t("meta.title"), template: `%s · BAWSALA` },
    description: t("meta.description"),
    applicationName: "BAWSALA",
    manifest: "/manifest.webmanifest",
    icons: { icon: "/brand/bawsala-app-icon.svg", apple: "/brand/app-icon-1024.png" },
    openGraph: { title: t("meta.title"), description: t("meta.description"), siteName: "BAWSALA", type: "website", images: ["/brand/app-icon-1024.png"] },
    twitter: { card: "summary", title: t("meta.title"), description: t("meta.description") },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F8F6EF" }, { media: "(prefers-color-scheme: dark)", color: "#0C1210" }],
  width: "device-width",
  initialScale: 1,
};

// Applies the saved theme before paint (no flash). Only reads a non-sensitive UI preference.
const THEME_SCRIPT = `try{var t=localStorage.getItem("bawsala.theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, messages, t } = await getT();
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const meta = LOCALE_META[locale];
  return (
    <html lang={meta.htmlLang} dir={meta.dir} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip">{t("common.skip_to_content")}</a>
        <I18nProvider locale={locale} messages={messages}>
          <ToastProvider>
            {children}
            <ClientErrorReporter />
            <ServiceWorkerRegister />
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
