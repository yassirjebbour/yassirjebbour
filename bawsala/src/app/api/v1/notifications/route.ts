import { route, json, apiUser } from "@/server/http/api";
import { listNotifications, unreadCount } from "@/server/notify";

export const GET = route(async () => {
  const user = await apiUser();
  const [items, unread] = await Promise.all([listNotifications(user.id), unreadCount(user.id)]);
  return json({ items, unread });
});
