import type { ReactNode } from "react";
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "sale" | "new" }) {
  return <span className={`fb-badge fb-badge-${tone}`}>{children}</span>;
}
