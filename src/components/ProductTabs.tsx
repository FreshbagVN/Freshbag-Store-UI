"use client";
import { useId, useState, type ReactNode } from "react";
export function ProductTabs({ children }: { children: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const labels = ["MÔ TẢ", "THÔNG SỐ", "BẢO HÀNH", "ĐỔI TRẢ"];
  return <section className="product-tabs"><div role="tablist" aria-label="Thông tin sản phẩm" className="product-tab-list">{labels.map((label,i) => <button key={label} id={`${id}-tab-${i}`} role="tab" aria-selected={active === i} aria-controls={`${id}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => { const next = e.key === "ArrowRight" ? (i+1)%4 : e.key === "ArrowLeft" ? (i+3)%4 : e.key === "Home" ? 0 : e.key === "End" ? 3 : null; if(next !== null) { e.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus(); } }}>{label}</button>)}</div>{children.map((child,i) => <div key={i} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={i !== active} tabIndex={0} className="product-tab-panel">{child}</div>)}</section>;
}
