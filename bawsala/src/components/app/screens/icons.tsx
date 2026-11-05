/* Screen-level icons (24px grid, currentColor, original simple geometry). */
import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = (p: P, children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>{children}</svg>
);
export const IconArrow = (p: P) => base(p, <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const IconFlame = (p: P) => base(p, <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.2 2.2-5.3 3.6-7.1.5 1.9 1.6 3 2.7 3.4-.3-3 1-5.7 3.3-8.1.3 3 1.6 4.5 3 6.3 1.1 1.4 1.9 3 1.9 5.2C20 18.3 16.6 21 12 21z" />);
export const IconProof = (p: P) => base(p, <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.3 7.5 9.5 4.4-1.2 7.5-4.9 7.5-9.5V6L12 3z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>);
export const IconBook = (p: P) => base(p, <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /></>);
export const IconTarget = (p: P) => base(p, <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>);
export const IconLayers = (p: P) => base(p, <><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></>);
export const IconSendUp = (p: P) => base(p, <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>);
export const IconStar = (p: P) => base(p, <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z" />);
export const IconPrint = (p: P) => base(p, <><path d="M7 9V3h10v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M7 14h10v7H7z" /></>);
export const IconDownload = (p: P) => base(p, <><path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></>);
export const IconCalendar = (p: P) => base(p, <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
export const IconPin = (p: P) => base(p, <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>);
export const IconBookmark = (p: P) => base(p, <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-4-6 4V4.5a1 1 0 0 1 1-1z" />);
export const IconClock = (p: P) => base(p, <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const IconKey = (p: P) => base(p, <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l3 3M15 8l2 2" /></>);
export const IconPalette = (p: P) => base(p, <><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1.1-1.6-1.1-2.7 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>);
export const IconAlert = (p: P) => base(p, <><path d="M12 3.5 2.8 19.5h18.4L12 3.5z" /><path d="M12 10v4.5M12 17.3v.2" /></>);
export const IconLock = (p: P) => base(p, <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
