"use client";
import { BankDetails } from "./BankDetails";
import { brandFacts } from "@/content/brand-facts";
import { ConversionEvent } from "@/components/Analytics";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { vnd } from "@/lib/data";

type Order = {
  code: string; status: string; payment_method: "cod" | "bank_transfer"; customer_name: string; address: string;
  subtotal: number; shipping_fee: number; total: number; items: { name: string; variant_name: string | null; price: number; qty: number }[];
};

function Inner() {
  const sp = useSearchParams();
  const code = sp.get("code") ?? "";
  const phone = sp.get("phone") ?? "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("lookup_order", { p_code: code, p_phone: phone });
      setOrder(data ?? null);
      setLoading(false);
    })();
  }, [code, phone]);

  if (loading) return <div className="py-16 text-center text-black/50">Đang tải…</div>;
  if (!order)
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold text-brand-dark">Thông tin đơn hàng</h1><p>Không tìm thấy đơn hàng. Kiểm tra lại mã đơn và số điện thoại.</p>
        <Link href="/tra-cuu-don" className="mt-4 inline-block underline text-brand-dark">Tra cứu đơn hàng</Link>
      </div>
    );
  return (
    <div className="order-success mx-auto max-w-2xl py-10"><ConversionEvent name="purchase" transactionId={order.code} params={{ transaction_id: order.code, currency: "VND", value: order.total, shipping: order.shipping_fee, items: order.items.map(i => ({ item_name: i.name, item_variant: i.variant_name, price: i.price, quantity: i.qty })) }}/>
      <div className="rounded border border-brand bg-brand/10 p-6 text-center">
        <div className="text-3xl">✓</div>
        <h1 className="mt-1 text-2xl font-semibold text-brand-dark">Đặt hàng thành công</h1>
        <p className="mt-2">Mã đơn hàng của bạn: <b className="text-lg">{order.code}</b></p>
        <p className="text-sm text-black/60">Hãy lưu lại mã đơn và số điện thoại để tra cứu. Shop sẽ liên hệ xác nhận sớm.</p>
      </div>
      {order.payment_method === "bank_transfer" && (
        <BankDetails bank={brandFacts.bank} code={order.code} total={order.total} />
      )}
      <div className="mt-6 rounded border border-black/10 p-4 text-sm">
        <h2 className="mb-2 font-semibold uppercase text-brand">Chi tiết đơn</h2>
        <p>Người nhận: {order.customer_name}</p>
        <p>Địa chỉ: {order.address}</p>
        <p>Thanh toán: {order.payment_method === "cod" ? "Khi nhận hàng (COD)" : "Chuyển khoản"}</p>
        <ul className="mt-3 divide-y divide-black/10">
          {order.items.map((i, k) => (
            <li key={k} className="flex justify-between py-1.5"><span>{i.name}{i.variant_name ? ` (${i.variant_name})` : ""} × {i.qty}</span><span>{vnd(i.price * i.qty)}</span></li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between gap-3"><span>Phí vận chuyển</span><span className="text-right">{order.shipping_fee ? vnd(order.shipping_fee) : "Tính theo biểu phí SPX"}</span></div>
        <div className="mt-1 flex justify-between text-base font-semibold"><span>Tổng</span><span className="text-price">{vnd(order.total)}</span></div>
      </div>
      <div className="mt-6 text-center"><Link href="/san-pham" className="fb-button">Tiếp tục mua sắm</Link></div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Suspense fallback={<div className="py-16 text-center text-black/50">Đang tải…</div>}><Inner /></Suspense>
    </div>
  );
}
