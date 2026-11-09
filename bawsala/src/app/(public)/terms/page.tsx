import type { Metadata } from "next";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("legal.terms_title") }; }

export default async function Page() {
  const { t, locale } = await getT();
  const fr = locale !== "en";
  return (
    <div className="container section prose">
      <h1>{t("legal.terms_title")}</h1>
      <p className="alert alert-warn" style={{ marginTop: 16 }}>{t("legal.draft")}</p>
      {fr ? (
        <div lang="fr" dir="ltr">
          <h2>Le service</h2><p>BAWSALA aide à identifier ses compétences, à trouver des pistes professionnelles et à préparer un parcours d’apprentissage. Il s’agit d’un outil d’orientation : il ne garantit ni un emploi ni l’exactitude des informations de tiers.</p>
          <h2>Contenu généré par l’IA</h2><p>Les réponses de l’assistant peuvent contenir des erreurs. Vérifiez les informations importantes auprès des sources officielles indiquées. Aucune décision institutionnelle ou d’embauche n’est prise par l’IA.</p>
          <h2>Offres et données de démonstration</h2><p>Les offres marquées « Démo » sont fictives et servent à illustrer la correspondance. Les autres affichent leur source et leur date ; postulez toujours sur le site d’origine.</p>
          <h2>Votre compte</h2><p>Vous êtes responsable de la confidentialité de votre mot de passe et de l’exactitude de ce que vous déclarez. N’utilisez pas le service pour d’autres personnes ni pour tenter d’accéder aux données d’autrui.</p>
          <h2>Suspension</h2><p>En phase pilote, des fonctionnalités peuvent être suspendues temporairement (maintenance, sécurité). Vos données restent exportables.</p>
        </div>
      ) : (
        <div>
          <h2>The service</h2><p>BAWSALA helps you identify your skills, find career directions and prepare a learning path. It is a guidance tool: it does not guarantee a job or the accuracy of third-party information.</p>
          <h2>AI-generated content</h2><p>Assistant answers may contain mistakes. Check important information with the official sources shown. No institutional or hiring decision is made by AI.</p>
          <h2>Opportunities and demo data</h2><p>Listings marked “Demo” are fictional and illustrate matching. Others show their source and date; always apply on the original site.</p>
          <h2>Your account</h2><p>Keep your password confidential and what you declare accurate. Do not use the service on behalf of others or to try to access other people’s data.</p>
          <h2>Suspension</h2><p>During the pilot, features may be paused temporarily (maintenance, security). Your data remains exportable.</p>
        </div>
      )}
    </div>
  );
}
