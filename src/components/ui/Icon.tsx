import type { SVGProps } from "react";

const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  bag: <><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  phone: <path d="m7 3 3 5-3 3c1.5 3 3 4.5 6 6l3-3 5 3-1 4C10 22 2 14 3 4l4-1Z"/>,
  filter: <><path d="M3 6h18M3 12h18M3 18h18"/><path d="M8 3v6m8 0v6M8 15v6"/></>,
  shield: <><path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5l8-3Z"/><path d="m8 11 3 3 5-6"/></>,
  truck: <><path d="M2 5h12v12H2V5Zm12 5h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  return: <><path d="M4 10a8 8 0 1 1 2 9M4 3v7h7"/></>,
  wallet: <><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8V5l13-3v3m1 7h4v5h-4z"/></>,
  pause: <path d="M9 5v14M15 5v14"/>,
  play: <path d="m8 4 12 8-12 8V4Z"/>,
  similar: <><rect x="4" y="8" width="11" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></>,
};
export type IconName = keyof typeof paths;
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
