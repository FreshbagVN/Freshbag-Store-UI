/* eslint-disable @next/next/no-img-element -- PR_RULES 8.4. */
"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui/Icon";

export type ProductMedia = { type: "image" | "video"; src: string; poster?: string };
export function ProductGallery({ media, name, active, onChange }: { media: ProductMedia[]; name: string; active: number; onChange: (index: number) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const move = (delta: number) => onChange((active + delta + media.length) % media.length);
  useEffect(() => () => { if (scrollTimer.current) clearTimeout(scrollTimer.current); }, []);
  useEffect(() => {
    const el = rail.current;
    if (el) el.scrollTo({ left: active * el.clientWidth, behavior: "instant" });
    const thumb = thumbs.current?.children[active] as HTMLElement | undefined;
    if (thumb && thumbs.current) thumbs.current.scrollTo({ left: thumb.offsetLeft - thumbs.current.offsetLeft - 80, behavior: "instant" });
    rail.current?.querySelectorAll("video").forEach(video => { video.pause(); });
  }, [active]);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const modal = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    return () => { modal.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);
  if (!media.length) return <div className="gallery-placeholder">Freshbag · Đang cập nhật ảnh</div>;
  const current = media[active];
  return <div className="pdp-gallery">
    <div className="pdp-stage">
      <div ref={rail} className="pdp-media-rail" aria-label="Ảnh và video sản phẩm" onScroll={e => {
        const el = e.currentTarget;
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => {
          const index = Math.max(0, Math.min(media.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
          if (index !== active) onChange(index);
        }, 120);
      }}>
        {media.map((m, i) => <div className="pdp-media-slide" key={`${m.type}-${m.src}`} aria-label={`${i + 1} / ${media.length}`}>
          {m.type === "video" ? playing ? <video controls playsInline autoPlay preload="none" poster={m.poster} src={m.src} aria-label={`Video ${name}`}/> : <button type="button" className="pdp-video-cover" aria-label="Phát video sản phẩm" onClick={() => setPlaying(true)}>{m.poster && <img src={m.poster} alt={`${name} – ảnh bìa video`} width="800" height="800" fetchPriority="high"/>}<span><Icon name="play" width="32" height="32"/></span></button> : <button type="button" className="pdp-zoom" aria-label={`Phóng to ảnh ${i + 1}`} onClick={() => setOpen(true)}><img src={m.src} alt={`${name.slice(0, 100)} – ảnh ${i + 1}`} width="800" height="800" loading={i < 2 ? "eager" : "lazy"} fetchPriority={i === 0 || (i === 1 && media[0].type === "video") ? "high" : "auto"}/></button>}
        </div>)}
      </div>
      <button type="button" className="icon-button pdp-prev" aria-label="Ảnh trước" onClick={() => move(-1)}>←</button>
      <button type="button" className="icon-button pdp-next" aria-label="Ảnh tiếp theo" onClick={() => move(1)}>→</button>
      <span className="pdp-media-count" aria-live="polite">{active + 1}/{media.length}</span>
    </div>
    <div ref={thumbs} className="pdp-thumbnails" aria-label="Chọn ảnh sản phẩm">{media.map((m, i) => <button type="button" key={m.src} aria-label={m.type === "video" ? "Xem video sản phẩm" : `Xem ảnh ${i + 1}`} aria-pressed={i === active} onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) onChange(i); }} onClick={() => onChange(i)}>{(m.poster || m.type === "image") && <img src={m.poster || m.src} alt={m.type === "video" ? "Ảnh bìa video" : `${name.slice(0, 60)} – ảnh nhỏ ${i + 1}`} width="80" height="80" loading="lazy"/>}{m.type === "video" && <span className="pdp-thumb-play">▶</span>}</button>)}</div>
    <dialog ref={dialog} className="product-lightbox" aria-modal="true" aria-label={`Ảnh phóng to: ${name}`} onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }} onKeyDown={e => { if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } if (e.key === "ArrowRight") { e.preventDefault(); move(1); } }}>
      {open && <><button className="icon-button lightbox-close" type="button" aria-label="Đóng ảnh phóng to" onClick={() => setOpen(false)}><Icon name="close"/></button>{current.type === "image" ? <img src={current.src} alt={`${name} – ảnh phóng to ${active + 1}`} width="1200" height="1200"/> : <video src={current.src} poster={current.poster} controls playsInline/>}<div className="lightbox-controls"><button type="button" className="icon-button" aria-label="Ảnh phóng to trước" onClick={() => move(-1)}>←</button><span>{active + 1}/{media.length}</span><button type="button" className="icon-button" aria-label="Ảnh phóng to tiếp theo" onClick={() => move(1)}>→</button></div></>}
    </dialog>
  </div>;
}
