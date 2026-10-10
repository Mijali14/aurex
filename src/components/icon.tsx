import type { CSSProperties } from "react";

type IconName = "arrow" | "play" | "pause" | "replay" | "check" | "close" | "menu" | "send";
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  play: <path d="m9 5 10 7-10 7Z" />,
  pause: <><path d="M9 5v14M15 5v14" /></>,
  replay: <><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  send: <><path d="m4 5 16 7-16 7 3-7-3-7ZM7 12h13" /></>,
};

export function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[name]}</svg>;
}
