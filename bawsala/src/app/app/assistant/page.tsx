import type { Metadata } from "next";
import { requireUser } from "@/server/auth/current";
import { getT } from "@/i18n/server";
import { listConversations } from "@/server/repo/conversations";
import { Chat } from "@/components/app/chat";
import { getProvider } from "@/server/ai/providers";
import { isEnabled } from "@/server/flags";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getT(); return { title: t("assistant.title") }; }

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; file?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const convs = await listConversations(user.id);
  const llm = !!getProvider() && (await isEnabled("ai.llm", user));
  const initial = sp.q ? (sp.file && /^[0-9a-f-]{36}$/i.test(sp.file) ? `${sp.q} (file: ${sp.file})` : sp.q).slice(0, 2000) : null;
  return <Chat key="new" conversations={JSON.parse(JSON.stringify(convs))} conversation={null} messages={[]} userName={user.name.split(/\s+/)[0]} engine={llm ? "llm" : "basic"} initialMessage={initial} />;
}
