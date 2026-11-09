import type { Metadata } from "next";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("legal.privacy_title") }; }

/* The policy text is maintained in French and English (legal working languages) and describes
   what the software actually does; see docs/PRIVACY_AND_DATA_INVENTORY.md. Pending legal review. */
export default async function Page() {
  const { t, locale } = await getT();
  const fr = locale === "fr" || locale === "ar" || locale === "ary" || locale === "zgh";
  return (
    <div className="container section prose">
      <h1>{t("legal.privacy_title")}</h1>
      <p className="alert alert-warn" style={{ marginTop: 16 }}>{t("legal.draft")}</p>
      {fr ? (
        <div lang="fr" dir="ltr">
          <h2>Responsable du traitement</h2><p>BAWSALA (projet en phase pilote). Contact : via la page Aide &amp; contact (type « Demande de confidentialité »).</p>
          <h2>Données collectées et finalités</h2>
          <ul>
            <li>Compte : nom, e-mail, mot de passe (stocké sous forme de hachage scrypt), langue — pour vous identifier.</li>
            <li>Profil et expériences que vous écrivez, compétences, preuves, parcours, conversations avec l’assistant — pour fournir le service (analyse de compétences, correspondance, parcours).</li>
            <li>CV téléversés (PDF, DOCX, TXT) — pour l’analyse que vous demandez ; stockés de façon privée.</li>
            <li>Événements d’usage sans contenu (par ex. « parcours créé ») — pour améliorer le produit. Aucun traceur tiers, aucune publicité.</li>
          </ul>
          <h2>Intelligence artificielle</h2><p>Lorsque l’assistant IA est activé, le texte de votre message, un résumé de votre profil (prénom, études, compétences, objectif) et les résultats des outils sont envoyés au fournisseur du modèle (Anthropic) pour générer la réponse. Votre e-mail et votre mot de passe ne sont jamais envoyés. Les compétences proposées par l’IA restent des suggestions tant que vous ne les confirmez pas.</p>
          <h2>Partage</h2><p>Rien n’est partagé avec votre établissement sans votre accord explicite (option « Partager avec mon établissement »). L’établissement ne voit que des statistiques agrégées (groupes d’au moins 5 étudiants) et les demandes de vérification que vous envoyez.</p>
          <h2>Conservation</h2><p>Vos données sont conservées tant que votre compte existe. La suppression du compte efface définitivement vos données de la base ; les sauvegardes sont écrasées selon leur cycle de rotation (voir la procédure de sauvegarde).</p>
          <h2>Vos droits</h2><p>Accès et portabilité : Paramètres → « Télécharger toutes mes données ». Rectification : modifiez votre profil à tout moment. Suppression : Paramètres → « Supprimer mon compte ». Pour toute autre demande, utilisez la page Aide &amp; contact. Au Maroc, la loi n° 09-08 encadre la protection des données personnelles ; la déclaration auprès de la CNDP est en cours de préparation et sera mentionnée ici une fois effectuée.</p>
        </div>
      ) : (
        <div lang="en">
          <h2>Controller</h2><p>BAWSALA (pilot project). Contact: Help &amp; contact page (type “Privacy request”).</p>
          <h2>Data and purposes</h2>
          <ul>
            <li>Account: name, email, password (stored as a scrypt hash), language — to identify you.</li>
            <li>Profile and experiences you write, skills, proof, path, assistant conversations — to provide the service.</li>
            <li>Uploaded CVs (PDF, DOCX, TXT) — for the analysis you ask for; stored privately.</li>
            <li>Content-free usage events (e.g. “path created”) — to improve the product. No third-party trackers, no ads.</li>
          </ul>
          <h2>Artificial intelligence</h2><p>When the AI assistant is enabled, your message, a summary of your profile (first name, studies, skills, goal) and tool results are sent to the model provider (Anthropic) to generate the answer. Your email and password are never sent. AI-suggested skills stay suggestions until you confirm them.</p>
          <h2>Sharing</h2><p>Nothing is shared with your institution unless you turn on sharing. Institutions only see aggregated statistics (groups of at least 5 students) and the verification requests you send.</p>
          <h2>Retention</h2><p>Data is kept while your account exists. Deleting your account permanently erases it from the database; backups expire on their rotation cycle.</p>
          <h2>Your rights</h2><p>Access and portability: Settings → “Download all my data”. Correction: edit your profile any time. Deletion: Settings → “Delete my account”. In Morocco, Law 09-08 governs personal-data protection; the CNDP declaration is being prepared and will be referenced here once filed.</p>
        </div>
      )}
    </div>
  );
}
