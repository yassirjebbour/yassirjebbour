import { ViewTransition } from "react";

/** Re-mounts on every navigation, so the page content enters and exits with a view transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <ViewTransition enter="page-in" exit="page-out" default="none"><div className="vt-page">{children}</div></ViewTransition>;
}
