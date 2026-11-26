"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export type CartLine = {
  key: string; // `${item_id}:${model_id ?? 0}`
  item_id: number;
  model_id: number | null;
  name: string;
  variant_name: string | null;
  image: string | null;
  price: number; // chỉ để hiển thị; giá thật do máy chủ tính lại khi đặt hàng
  qty: number;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (l: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  patch: (key: string, p: Partial<CartLine>) => void;
};

const STORAGE_KEY = "freshbag-cart-v1";
export const lineKey = (itemId: number, modelId: number | null) => `${itemId}:${modelId ?? 0}`;

// ---- Kho ngoài React: localStorage + đồng bộ giữa các tab ----
const EMPTY: CartLine[] = [];
let cache: { raw: string | null; lines: CartLine[] } = { raw: null, lines: EMPTY };
const listeners = new Set<() => void>();

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : EMPTY;
  } catch {
    return EMPTY;
  }
}
function read(): CartLine[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cache.raw) cache = { raw, lines: parse(raw) };
  return cache.lines;
}
function write(next: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
const noopSubscribe = () => () => {};

const actions = {
  add(l: Omit<CartLine, "key">) {
    const key = lineKey(l.item_id, l.model_id);
    const cur = read();
    const ex = cur.find((x) => x.key === key);
    write(
      ex
        ? cur.map((x) => (x.key === key ? { ...x, qty: Math.min(99, x.qty + l.qty), price: l.price } : x))
        : [...cur, { ...l, key, qty: Math.min(99, l.qty) }],
    );
  },
  setQty(key: string, qty: number) {
    write(read().map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(99, qty)) } : x)));
  },
  remove(key: string) {
    write(read().filter((x) => x.key !== key));
  },
  clear() {
    write([]);
  },
  patch(key: string, p: Partial<CartLine>) {
    write(read().map((x) => (x.key === key ? { ...x, ...p } : x)));
  },
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      ready,
      ...actions,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
    }),
    [lines, ready],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart phải nằm trong CartProvider");
  return c;
}
