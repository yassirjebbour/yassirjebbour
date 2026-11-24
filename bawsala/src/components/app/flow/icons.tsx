/* Flow-specific stroke icons (24px grid, currentColor), same style as components/icons.tsx. */
import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = (p: P, children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>{children}</svg>
);
export const ICap = (p: P) => base(p, <><path d="M2 9.5 12 5l10 4.5L12 14 2 9.5z" /><path d="M6 11.5V16c1.8 1.6 3.8 2.4 6 2.4s4.2-.8 6-2.4v-4.5" /><path d="M22 9.5V14" /></>);
export const IScroll = (p: P) => base(p, <><path d="M7 4h11a2 2 0 0 1 2 2v1h-4" /><path d="M16 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1h10" /><path d="M7 4a2 2 0 0 0-2 2v11" /><path d="M9 9h4M9 13h4" /></>);
export const IBriefcase = (p: P) => base(p, <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M3 13h18" /></>);
export const ISearchPerson = (p: P) => base(p, <><circle cx="10" cy="8" r="3.5" /><path d="M3.5 19c.9-3.2 3.4-5 6.5-5 1.1 0 2.1.2 3 .6" /><circle cx="17.5" cy="16.5" r="2.8" /><path d="m19.6 18.6 1.9 1.9" /></>);
export const IDots = (p: P) => base(p, <><circle cx="6" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="18" cy="12" r="1.2" /></>);
export const IBadge = (p: P) => base(p, <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M10 3v3h4V3" /><circle cx="12" cy="12" r="2.5" /><path d="M8.5 17.5c.8-1.3 2-2 3.5-2s2.7.7 3.5 2" /></>);
export const IStore = (p: P) => base(p, <><path d="M4 9.5 5.5 4h13L20 9.5" /><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /><path d="M5.5 12v8h13v-8" /><path d="M10 20v-4.5h4V20" /></>);
export const IUsers = (p: P) => base(p, <><circle cx="9" cy="8" r="3.2" /><path d="M3 19c.8-3 3.2-4.8 6-4.8s5.2 1.8 6 4.8" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.3c2.2.2 3.8 1.7 4.5 4.2" /></>);
export const IHeart = (p: P) => base(p, <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />);
export const IBulb = (p: P) => base(p, <><path d="M9 17.5h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V17h5.2v-1.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" /></>);
export const IBook = (p: P) => base(p, <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /></>);
export const ITarget = (p: P) => base(p, <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>);
export const IChart = (p: P) => base(p, <><path d="M4 20V4" /><path d="M4 20h16" /><path d="m7 15 4-4 3 3 5-6" /></>);
export const IMic = (p: P) => base(p, <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></>);
export const IPencil = (p: P) => base(p, <><path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></>);
export const IArrow = (p: P) => base(p, <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const ILock = (p: P) => base(p, <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
export const IInbox = (p: P) => base(p, <><path d="M3 13.5 5.5 5h13l2.5 8.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5.5z" /><path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5" /></>);
export const IMail = (p: P) => base(p, <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>);
export const ISignal = (p: P) => base(p, <><path d="M3 12h3l3-7 4 14 3-7h5" /></>);
