import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonClass = "fb-button";
export function Button({ className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`${buttonClass} ${className}`} {...props}/>;
}
export function ButtonLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`${buttonClass} ${className}`}>{children}</Link>;
}
