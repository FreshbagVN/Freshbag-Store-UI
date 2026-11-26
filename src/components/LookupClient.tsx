"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { vnd } from "@/lib/data";

const STATUS: Record<string, string> = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", done: "Hoàn thành", cancelled: "Đã hủy" };
type Order = { code: string; status: string; total: number; created_at: string; items: { name: string; variant_name: string | null; qty: number }[] };

export default function LookupPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setMsg(""); setOrder(null);
    const { data, error } = await supabase.rpc("lookup_order", { p_code: f.get("code"), p_phone: f.get("phone") });
    setBusy(false);
    if (error) return setMsg("Có lỗi, vui lòng thử lại.");
    if (!data) return setMsg("Không tìm thấy đơn hàng. Kiểm tra lại mã đơn và số điện thoại.");
    setOrder(data);
  }
  const input = "form-input";
  return (
    <div className="lookup-page fb-container">
      <div className="page-heading"><h1>Tra cứu đơn hàng</h1><p>Nhập mã đơn và số điện thoại bạn đã dùng khi đặt hàng.</p></div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm">Mã đơn hàng<input name="code" autoComplete="off" required placeholder="FB261126-1001" className={input} /></label>
        <label className="block text-sm">Số điện thoại đặt hàng<input name="phone" type="tel" autoComplete="tel" required inputMode="tel" className={input} /></label>
        <button disabled={busy} className="fb-button w-full">{busy ? "Đang tìm…" : "Tra cứu"}</button>
      </form>
      {msg && <p role="alert" className="mt-4 text-price">{msg}</p>}
      {order && (
        <div role="status" className="order-result mt-6 rounded border border-black/10 p-4 text-sm">
          <p>Mã đơn: <b>{order.code}</b></p>
          <p>Trạng thái: <b className="text-brand-dark">{STATUS[order.status] ?? order.status}</b></p>
          <p>Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}</p>
          <ul className="mt-2 list-disc pl-5">{order.items.map((i, k) => <li key={k}>{i.name}{i.variant_name ? ` (${i.variant_name})` : ""} × {i.qty}</li>)}</ul>
          <p className="mt-2 font-semibold">Tổng: <span className="text-price">{vnd(order.total)}</span></p>
        </div>
      )}
    </div>
  );
}
