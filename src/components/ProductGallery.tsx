/* eslint-disable @next/next/no-img-element -- PR_RULES 8.4. */
"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui/Icon";

export type ProductMedia = { type: "image" | "video"; src: string; poster?: string };
export function ProductGallery({ media, name, active, onChange }: { media: ProductMedia[]; name: string; active: number; onChange: (index: number) => void }) {
  const images = media.filter((m) => m.type === "image");
  const rail = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const safeActive = images.length ? Math.max(0, Math.min(images.length - 1, active)) : 0;
  const move = (delta: number) => onChange((safeActive + delta + images.length) % images.length);
  useEffect(() => () => { if (scrollTimer.current) clearTimeout(scrollTimer.current); }, []);
  useEffect(() => {
    const el = rail.current;
    if (el) el.scrollTo({ left: safeActive * el.clientWidth, behavior: "instant" });
    const thumb = thumbs.current?.children[safeActive] as HTMLElement | undefined;
    if (thumb && thumbs.current) thumbs.current.scrollTo({ left: thumb.offsetLeft - thumbs.current.offsetLeft - 80, behavior: "instant" });
  }, [safeActive]);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const modal = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => { modal.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);
  if (!images.length) return <div className="gallery-placeholder">Freshbag · Đang cập nhật ảnh</div>;
  const current = images[safeActive];
  return <div className="pdp-gallery">
    <div className="pdp-stage">
      <div ref={rail} className="pdp-media-rail" aria-label="Ảnh sản phẩm" onScroll={e => {
        const el = e.currentTarget;
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => {
          const index = Math.max(0, Math.min(images.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
          if (index !== safeActive) onChange(index);
        }, 120);
      }}>
        {images.map((m, i) => <div className="pdp-media-slide" key={m.src} aria-label={`${i + 1} / ${images.length}`}>
          <button type="button" className="pdp-zoom" aria-label={`Phóng to ảnh ${i + 1}`} onClick={() => setOpen(true)}><img src={m.src} alt={`${name.slice(0, 100)} – ảnh ${i + 1}`} width="800" height="800" loading={i < 2 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"}/></button>
        </div>)}
      </div>
      <button type="button" className="icon-button pdp-prev" aria-label="Ảnh trước" onClick={() => move(-1)}>←</button>
      <button type="button" className="icon-button pdp-next" aria-label="Ảnh tiếp theo" onClick={() => move(1)}>→</button>
      <span className="pdp-media-count" aria-live="polite">{safeActive + 1}/{images.length}</span>
    </div>
    <div ref={thumbs} className="pdp-thumbnails" aria-label="Chọn ảnh sản phẩm">{images.map((m, i) => <button type="button" key={m.src} aria-label={`Xem ảnh ${i + 1}`} aria-pressed={i === safeActive} onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) onChange(i); }} onClick={() => onChange(i)}><img src={m.src} alt={`${name.slice(0, 60)} – ảnh nhỏ ${i + 1}`} width="80" height="80" loading="lazy"/></button>)}</div>
    <dialog ref={dialog} className="product-lightbox" aria-modal="true" aria-label={`Ảnh phóng to: ${name}`} onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }} onKeyDown={e => { if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } if (e.key === "ArrowRight") { e.preventDefault(); move(1); } }}>
      {open && <><button className="icon-button lightbox-close" type="button" aria-label="Đóng ảnh phóng to" onClick={() => setOpen(false)}><Icon name="close"/></button><img src={current.src} alt={`${name} – ảnh phóng to ${safeActive + 1}`} width="1200" height="1200"/><div className="lightbox-controls"><button type="button" className="icon-button" aria-label="Ảnh phóng to trước" onClick={() => move(-1)}>←</button><span>{safeActive + 1}/{images.length}</span><button type="button" className="icon-button" aria-label="Ảnh phóng to tiếp theo" onClick={() => move(1)}>→</button></div></>}
    </dialog>
  </div>;
}
