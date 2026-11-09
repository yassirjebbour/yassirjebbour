import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/current";
import { getConversation, listConversations } from "@/server/repo/conversations";
import { Chat } from "@/components/app/chat";
import { getProvider } from "@/server/ai/providers";
import { isEnabled } from "@/server/flags";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  let conv;
  try { conv = await getConversation(user.id, id); } catch { notFound(); }
  const convs = await listConversations(user.id);
  const llm = !!getProvider() && (await isEnabled("ai.llm", user));
  return <Chat key={id} conversations={JSON.parse(JSON.stringify(convs))} conversation={JSON.parse(JSON.stringify(conv.conversation))} messages={JSON.parse(JSON.stringify(conv.messages))} userName={user.name.split(/\s+/)[0]} engine={llm ? "llm" : "basic"} initialMessage={null} />;
}
