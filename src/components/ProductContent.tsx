"use client";
import { useId, useState, type ReactNode } from "react";
import ProductCard from "./ProductCard";
import { BottomSheet } from "./ui/BottomSheet";
import { Icon } from "./ui/Icon";
import { listProducts, type Product } from "@/lib/data";

export function ProductSpecifications({ rows }: { rows: [string, string][] }) {
  const [open, setOpen] = useState(false);
  const table = <table className="spec-table"><caption>Thông tin từ dữ liệu sản phẩm</caption><tbody>{rows.map(([key, value], i) => <tr key={i}><th scope="row">{key}</th><td>{value}</td></tr>)}</tbody></table>;
  return <section className="pdp-section pdp-specifications"><div className="pdp-spec-desktop"><h2>Chi tiết sản phẩm</h2>{table}<p className="muted">Kích thước đóng gói phục vụ vận chuyển; kích thước sử dụng xem trong mô tả nếu có.</p></div><button type="button" className="pdp-spec-trigger" onClick={() => setOpen(true)}><strong>Chi tiết sản phẩm</strong><span>Thương hiệu, Kích thước, Trọng lượng…</span><Icon name="chevron" width="16"/></button><BottomSheet open={open} onClose={() => setOpen(false)} title="Chi tiết sản phẩm">{table}<p className="muted">Kích thước đóng gói phục vụ vận chuyển; kích thước sử dụng xem trong mô tả nếu có.</p></BottomSheet></section>;
}
export function ProductDescription({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return <section className="pdp-section pdp-description"><h2>Mô tả sản phẩm</h2><div id={id} className={`pdp-description-body ${expanded ? "is-expanded" : "is-collapsed"}`}>{children}</div><div className="pdp-description-toggle"><button type="button" className="fb-button secondary" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>{expanded ? "Thu gọn" : "Xem thêm"}<Icon name="down" width="16" style={expanded ? { transform: "rotate(180deg)" } : undefined}/></button></div></section>;
}
export type ProductReview = { id: string; author: string; rating: number; text: string; date: string };
/** Only call with actual review rows; an empty dataset produces no section or rating. */
export function ProductReviews({ reviews = [] }: { reviews?: ProductReview[] }) {
  if (!reviews.length) return null;
  return <section className="pdp-section pdp-reviews"><h2>Đánh giá sản phẩm ({reviews.length})</h2>{reviews.map(review => <article key={review.id}><h3>{review.author}</h3><p aria-label={`${review.rating} trên 5 sao`}>{review.rating}/5 ★</p><time>{review.date}</time><p>{review.text}</p></article>)}</section>;
}
export function ProductRecommendations({ initial, categoryId, itemId, pages, excludeIds = [] }: { initial: Product[]; categoryId: number; itemId: number; pages: number; excludeIds?: number[] }) {
  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function loadMore() {
    setBusy(true); setError("");
    try {
      const result = await listProducts({ cat: categoryId, page: page + 1 });
      const excluded = new Set(excludeIds);
      setItems(current => [...current, ...result.items.filter(p => p.item_id !== itemId && !excluded.has(p.item_id) && !current.some(x => x.item_id === p.item_id))]);
      setPage(result.page);
    } catch { setError("Chưa tải được sản phẩm. Vui lòng thử lại."); }
    finally { setBusy(false); }
  }
  if (!items.length) return null;
  return <section className="pdp-recommendations"><h2>Có thể bạn cũng thích</h2><div className="pdp-product-grid">{items.map(p => <ProductCard p={p} key={p.item_id}/>)}</div>{error && <p role="alert">{error}</p>}{page < pages && <button type="button" className="fb-button secondary pdp-load-more" disabled={busy} onClick={loadMore}>{busy ? "Đang tải…" : "Xem thêm sản phẩm"}</button>}</section>;
}
