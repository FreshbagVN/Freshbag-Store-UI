"use client";
/* eslint-disable @next/next/no-img-element -- PR_RULES 8.4. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { useCartNote, setCartNote } from "@/lib/cart-note";
import { vnd } from "@/lib/data";
import { RecentlyViewed } from "@/components/recommend/RecentlyViewed";
import { SimilarSheet } from "@/components/recommend/SimilarSheet";

type Fresh = { price: number | null; stock: number | null };

export default function CartPage() {
  const note = useCartNote();
  const { lines, count, ready, subtotal, setQty, remove, patch } = useCart();
  const [fresh, setFresh] = useState<Record<string, Fresh>>({});

  // Làm mới giá/tồn kho từ máy chủ mỗi lần mở giỏ hàng.
  useEffect(() => {
    if (!ready || lines.length === 0) return;
    const modelIds = lines.map((l) => l.model_id).filter((x): x is number => x != null);
    const itemIds = lines.filter((l) => l.model_id == null).map((l) => l.item_id);
    (async () => {
      const out: Record<string, Fresh> = {};
      if (modelIds.length) {
        const { data } = await supabase.from("product_variants").select("model_id,item_id,price,stock").in("model_id", modelIds);
        for (const r of data ?? []) out[`${r.item_id}:${r.model_id}`] = { price: r.price, stock: r.stock };
      }
      if (itemIds.length) {
        const { data } = await supabase.from("products").select("item_id,min_price,total_stock").in("item_id", itemIds);
        for (const r of data ?? []) out[`${r.item_id}:0`] = { price: r.min_price, stock: r.total_stock };
      }
      setFresh(out);
      for (const l of lines) {
        const f = out[l.key];
        if (f?.price != null && f.price !== l.price) patch(l.key, { price: f.price });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lines.length]);

  if (!ready) return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-black/50">Đang tải giỏ hàng…</div>;

  if (lines.length === 0)
    return (
      <div className="fb-container py-12">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold text-brand-dark">Giỏ hàng của bạn</h1><p>Có 0 sản phẩm trong giỏ hàng</p><h2 className="mt-4">Giỏ hàng đang trống</h2>
          <p className="mt-2 text-black/60">Hãy chọn vài sản phẩm bạn thích.</p>
          <Link href="/san-pham" className="mt-6 inline-block rounded bg-brand px-6 py-2.5 font-medium text-white">Tiếp tục mua sắm</Link>
        </div>
        <RecentlyViewed limit={10} />
      </div>
    );

  const problems = lines.filter((l) => {
    const s = fresh[l.key]?.stock;
    return s != null && l.qty > s;
  });

  return <div className="fb-container cart-page"><div className="page-heading"><h1>Giỏ hàng của bạn</h1><p aria-live="polite">Có {count} sản phẩm trong giỏ hàng</p></div><ul className="cart-lines">{lines.map(l => {
    const stock = fresh[l.key]?.stock;
    const over = stock != null && l.qty > stock;
    return <li key={l.key} className="cart-line">{l.image && <Link href={`/san-pham/${l.item_id}`} className="cart-line-image"><img src={l.image} alt={l.name.slice(0,120)} width="120" height="120"/></Link>}<div className="cart-line-info"><Link href={`/san-pham/${l.item_id}`}>{l.name}</Link>{l.variant_name && <p className="muted">Phân loại: {l.variant_name}</p>}<p className="text-price">{vnd(l.price)}</p><div className="quantity-control"><button aria-label={`Giảm số lượng ${l.name}`} disabled={l.qty <= 1} onClick={() => setQty(l.key,l.qty-1)}>−</button><span aria-live="polite">{l.qty}</span><button aria-label={`Tăng số lượng ${l.name}`} disabled={l.qty >= 99} onClick={() => setQty(l.key,l.qty+1)}>+</button></div>{over && <p role="alert" className="text-price">Chỉ còn {stock} sản phẩm, vui lòng giảm số lượng.</p>}<div className="mt-2"><SimilarSheet productId={l.item_id} productName={l.name} variant="inline" label="Tìm mẫu tương tự"/></div></div><div className="cart-line-end"><button className="remove-line" aria-label={`Xóa ${l.name}`} onClick={() => remove(l.key)}>Xóa</button><strong aria-live="polite">{vnd(l.price*l.qty)}</strong></div></li>;
  })}</ul><div className="cart-bottom"><label className="cart-note" htmlFor="cart-note">Ghi chú đơn hàng<textarea id="cart-note" name="note" rows={4} maxLength={500} placeholder="Lời nhắn cho Freshbag…" value={note} onChange={e => setCartNote(e.target.value)}/></label><aside className="cart-summary"><div className="cart-grand-total" aria-live="polite"><span>Tổng tiền</span><strong>{vnd(subtotal)}</strong></div><p className="muted">Phí vận chuyển được tính ở bước thanh toán.</p>{problems.length > 0 && <p role="alert" className="text-price">Một số sản phẩm vượt tồn kho, vui lòng điều chỉnh.</p>}<div className="action-row"><Link className="fb-button secondary" href="/san-pham">TIẾP TỤC MUA</Link>{problems.length ? <button className="fb-button" disabled>THANH TOÁN</button> : <Link className="fb-button" href="/thanh-toan">THANH TOÁN</Link>}</div></aside></div><RecentlyViewed limit={10}/></div>;
}
