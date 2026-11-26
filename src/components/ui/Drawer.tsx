"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Native modal dialog supplies focus trapping, inert background and Escape support. */
export function Drawer({ open, onClose, title, children, side = "left" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: "left" | "right" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} className={`fb-drawer ${side === "right" ? "drawer-right" : ""}`} onCancel={(e) => { e.preventDefault(); closeRef.current(); }} onClick={(e) => { if (e.target === e.currentTarget) closeRef.current(); }}>
    <div className="drawer-panel"><div className="drawer-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label={`Đóng ${title.toLowerCase()}`} onClick={onClose}><Icon name="close"/></button></div><div className="drawer-content">{children}</div></div>
  </dialog>;
}
