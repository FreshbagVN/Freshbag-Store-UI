/* eslint-disable @next/next/no-img-element -- PR_RULES 8.4. */
"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { vnd } from "@/lib/data";
import { Drawer } from "./ui/Drawer";
export function MiniCart({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, count, subtotal, setQty, remove } = useCart();
  return <Drawer open={open} onClose={onClose} title="Giỏ hàng của bạn" side="right"><p role="status">Đã thêm vào giỏ · Có {count} sản phẩm</p><ul className="mini-cart-lines">{lines.map(l => <li key={l.key}>{l.image && <img src={l.image} alt={l.name.slice(0, 120)} width="80" height="80"/>}<div><Link href={`/san-pham/${l.item_id}`} onClick={onClose}>{l.name}</Link>{l.variant_name && <p>Phân loại: {l.variant_name}</p>}<strong className="text-price">{vnd(l.price * l.qty)}</strong><div className="quantity-control"><button type="button" aria-label={`Giảm số lượng ${l.name}`} disabled={l.qty <= 1} onClick={() => setQty(l.key,l.qty-1)}>−</button><span aria-live="polite">{l.qty}</span><button type="button" aria-label={`Tăng số lượng ${l.name}`} disabled={l.qty >= 99} onClick={() => setQty(l.key,l.qty+1)}>+</button></div><button className="remove-line" onClick={() => remove(l.key)}>Xóa</button></div></li>)}</ul><div className="mini-cart-total" aria-live="polite"><span>Tạm tính</span><strong>{vnd(subtotal)}</strong></div><p className="muted">Phí vận chuyển được xác nhận ở bước thanh toán.</p><div className="mini-cart-actions"><Link href="/gio-hang" className="fb-button secondary" onClick={onClose}>XEM GIỎ HÀNG</Link>{lines.length > 0 && <Link href="/thanh-toan" className="fb-button" onClick={onClose}>THANH TOÁN</Link>}</div></Drawer>;
}
