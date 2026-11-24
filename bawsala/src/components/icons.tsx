/* Minimal stroke icon set (24px grid, currentColor). Paths are original simple geometry. */
import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = (p: P, children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{children}</svg>
);
export const IconHome = (p: P) => base(p, <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>);
export const IconPassport = (p: P) => base(p, <><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M9 17h6" /></>);
export const IconCompass = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2z" /></>);
export const IconPath = (p: P) => base(p, <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5" /></>);
export const IconChat = (p: P) => base(p, <><path d="M4 5h16v11H8l-4 4V5z" /></>);
export const IconUser = (p: P) => base(p, <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>);
export const IconBell = (p: P) => base(p, <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2z" /><path d="M10 21h4" /></>);
export const IconSettings = (p: P) => base(p, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>);
export const IconHelp = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" /><path d="M12 17.5h.01" /></>);
export const IconCheck = (p: P) => base(p, <path d="m5 12.5 4.5 4.5L19 7.5" />);
export const IconX = (p: P) => base(p, <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>);
export const IconPlus = (p: P) => base(p, <><path d="M12 5v14" /><path d="M5 12h14" /></>);
export const IconSend = (p: P) => base(p, <><path d="M4 12 20 4l-6 16-2.5-6.5L4 12z" /></>);
export const IconStop = (p: P) => base(p, <rect x="7" y="7" width="10" height="10" rx="1.5" />);
export const IconCopy = (p: P) => base(p, <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></>);
export const IconRefresh = (p: P) => base(p, <><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" /><path d="M20 20v-4h-4" /></>);
export const IconThumbUp = (p: P) => base(p, <><path d="M7 11v9H4v-9h3z" /><path d="M7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7" /></>);
export const IconThumbDown = (p: P) => base(p, <><path d="M7 13V4H4v9h3z" /><path d="M7 13l4 7c1.5 0 2.5-1 2.2-2.6L12.6 14H19a2 2 0 0 0 2-2.3l-1.2-6A2 2 0 0 0 17.8 4H7" /></>);
export const IconGlobe = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></>);
export const IconMenu = (p: P) => base(p, <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>);
export const IconLink = (p: P) => base(p, <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>);
export const IconFile = (p: P) => base(p, <><path d="M14 3H6v18h12V7l-4-4z" /><path d="M14 3v4h4" /></>);
export const IconBuilding = (p: P) => base(p, <><path d="M4 21V5l8-2v18" /><path d="M12 9h8v12" /><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" /></>);
export const IconShield = (p: P) => base(p, <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z" />);
export const IconSpark = (p: P) => base(p, <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />);
export const IconTrash = (p: P) => base(p, <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 14h10l1-14" /></>);
export const IconExternal = (p: P) => base(p, <><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v6H4V6h6" /></>);
export const IconLogout = (p: P) => base(p, <><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h10" /></>);
export const IconSearch = (p: P) => base(p, <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>);
