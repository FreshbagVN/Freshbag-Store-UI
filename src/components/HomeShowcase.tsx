/* eslint-disable @next/next/no-img-element -- Ảnh Shopee dùng img theo PR_RULES 8.4. */
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/data";
import ProductCard from "./ProductCard";
import { ButtonLink } from "./ui/Button";
import { Icon } from "./ui/Icon";

export type HeroSlide = { title: string; text: string; label: string; href: string; image: string; productName: string; mobileImage?: string };
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reduced || hovered || slides.length < 2) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduced, hovered, slides.length]);
  const move = (delta: number) => setActive((active + delta + slides.length) % slides.length);
  if (!slides.length) return null;
  return <section className="hero" aria-roledescription="trình chiếu" aria-label="Khám phá Freshbag" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false); }}>
    {slides.map((s, i) => <div className={`hero-slide hero-theme-${i} ${s.mobileImage ? "hero-photo" : ""}`} key={s.title} hidden={active !== i} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>{s.mobileImage && <picture className="hero-photo-picture"><source media="(max-width: 767px)" srcSet={s.mobileImage} width="1080" height="1350"/><img src={s.image} alt={s.productName.slice(0, 125)} width="2400" height="900" loading="eager" fetchPriority={i === 0 ? "high" : "auto"}/></picture>}<div className="hero-layout fb-container"><div className="hero-copy"><span className="eyebrow">FRESHBAG · GROW UP WITH YOU</span>{i === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}<p>{s.text}</p><ButtonLink href={s.href}>{s.label}<Icon name="chevron" width="16"/></ButtonLink></div>{!s.mobileImage && <div className="hero-art"><span className="hero-orbit" aria-hidden="true"/><img src={s.image} alt={s.productName.slice(0, 125)} width="600" height="600" fetchPriority={i === 0 ? "high" : "auto"}/><span className="hero-art-note">MỘT CHIẾC TÚI, NHIỀU HÀNH TRÌNH</span></div>}</div></div>)}
    <button type="button" className="hero-arrow hero-prev icon-button" aria-label="Banner trước" onClick={() => move(-1)}><Icon name="chevron" style={{ transform: "rotate(180deg)" }}/></button><button type="button" className="hero-arrow hero-next icon-button" aria-label="Banner tiếp theo" onClick={() => move(1)}><Icon name="chevron"/></button>
    <div className="hero-controls">{slides.map((s, i) => <button type="button" key={s.title} className="slide-dot" aria-label={`Xem banner ${i + 1}`} aria-current={active === i ? "true" : undefined} onClick={() => setActive(i)}><span/></button>)}<button type="button" className="icon-button" aria-label={paused || reduced ? "Chạy trình chiếu" : "Dừng trình chiếu"} aria-pressed={paused || reduced} onClick={() => { if (!reduced) setPaused(!paused); }} disabled={reduced} title={reduced ? "Đã tắt tự chạy theo cài đặt giảm chuyển động" : undefined}><Icon name={paused || reduced ? "play" : "pause"} width="16"/></button></div>
  </section>;
}
export function CollectionBanners({ items }: { items: { title: string; caption: string; href: string; image?: string; banner?: boolean }[] }) {
  return <div className="collection-banners">{items.map((s, i) => <Link href={s.href} className={`collection-banner collection-tone-${i} ${s.banner ? "collection-photo" : ""}`} key={s.title}><div><span className="eyebrow">{s.caption}</span><h2>{s.title}</h2><span className="banner-cta">XEM THÊM <Icon name="chevron" width="14"/></span></div>{s.image && <img src={s.image} alt={`Sản phẩm Freshbag – ${s.title}`} width={s.banner ? 1200 : 300} height={s.banner ? 750 : 300} loading="lazy"/>}</Link>)}</div>;
}
export function ProductCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(1);
  const scroll = (delta: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: delta * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <div className="product-carousel"><div className="carousel-grid" ref={ref} onScroll={() => { const el = ref.current; if(el) setPosition(Math.round(el.scrollLeft / el.clientWidth) + 1); }}>{products.map((p) => <ProductCard p={p} key={p.item_id}/>)}</div><div className="carousel-controls"><button type="button" className="icon-button outlined" aria-label="Sản phẩm trước" onClick={() => scroll(-1)}><Icon name="chevron" style={{ transform: "rotate(180deg)" }}/></button><span aria-live="polite">Nhóm {position}</span><button type="button" className="icon-button outlined" aria-label="Sản phẩm tiếp theo" onClick={() => scroll(1)}><Icon name="chevron"/></button></div></div>;
}

