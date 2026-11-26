"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/lib/data";
import {
  clearRecentlyViewed,
  getRecentlyViewed,
  MAX_RECENTLY_VIEWED,
  RECENTLY_VIEWED_EVENT,
  RECENTLY_VIEWED_KEY,
} from "@/lib/recently-viewed";

type RecentlyViewedProps = {
  excludeId?: number;
  limit?: number;
  title?: string;
  className?: string;
};

type ViewState = "idle" | "loading" | "ready" | "empty";

/**
 * Dải cuộn ngang "Sản phẩm bạn đã xem":
 * - Đọc id từ localStorage sau mount, gọi API lấy giá/tồn/ảnh mới nhất từ DB.
 * - Có skeleton cùng tỷ lệ thẻ sản phẩm để tránh CLS; tự ẩn khi rỗng.
 */
export function RecentlyViewed({
  excludeId,
  limit = 12,
  title = "Sản phẩm bạn đã xem",
  className = "",
}: RecentlyViewedProps) {
  const [state, setState] = useState<ViewState>("idle");
  const [skeletonCount, setSkeletonCount] = useState(0);
  const [items, setItems] = useState<Product[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const safeLimit = Math.max(1, Math.min(MAX_RECENTLY_VIEWED, limit));

  const loadProducts = useCallback(
    async (signal?: AbortSignal) => {
      const ids = getRecentlyViewed()
        .map((entry) => entry.id)
        .filter((id) => id !== excludeId)
        .slice(0, safeLimit);

      if (ids.length === 0) {
        setItems([]);
        setSkeletonCount(0);
        setState("empty");
        return;
      }

      setSkeletonCount(ids.length);
      setState((prev) => (prev === "ready" ? "ready" : "loading"));

      try {
        const res = await fetch(`/api/recommend/by-ids?ids=${ids.join(",")}`, {
          signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Không tải được sản phẩm đã xem");
        const data = (await res.json()) as { items?: Product[] };
        const nextItems = Array.isArray(data.items) ? data.items : [];
        if (nextItems.length === 0) {
          setItems([]);
          setState("empty");
          return;
        }
        setItems(nextItems);
        setState("ready");
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setItems([]);
        setState("empty");
      }
    },
    [excludeId, safeLimit],
  );

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => { if (!controller.signal.aborted) void loadProducts(controller.signal); });

    const onLocalUpdate = () => {
      void loadProducts();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === RECENTLY_VIEWED_KEY || e.key === null) {
        void loadProducts();
      }
    };

    window.addEventListener(RECENTLY_VIEWED_EVENT, onLocalUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      controller.abort();
      window.removeEventListener(RECENTLY_VIEWED_EVENT, onLocalUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadProducts]);

  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
    setSkeletonCount(0);
    setState("empty");
  };

  const scrollStrip = (delta: number) => {
    const el = stripRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: delta * Math.max(240, el.clientWidth * 0.8),
      behavior: reduced ? "instant" : "smooth",
    });
  };

  if (state === "idle" || state === "empty") return null;

  return (
    <section
      className={`related-products ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">LỊCH SỬ XEM GẦN ĐÂY</span>
          <h2
            id={headingId}
            className="mt-1 text-xl font-bold text-[#263532] sm:text-2xl"
          >
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center px-3 text-xs font-semibold text-[#5c6662] underline underline-offset-4 hover:text-[#263532]"
            onClick={handleClear}
          >
            Xóa lịch sử
          </button>
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              className="icon-button outlined min-h-[44px] min-w-[44px]"
              aria-label="Cuộn sản phẩm đã xem sang trái"
              onClick={() => scrollStrip(-1)}
            >
              <Icon name="chevron" style={{ transform: "rotate(180deg)" }} />
            </button>
            <button
              type="button"
              className="icon-button outlined min-h-[44px] min-w-[44px]"
              aria-label="Cuộn sản phẩm đã xem sang phải"
              onClick={() => scrollStrip(1)}
            >
              <Icon name="chevron" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={stripRef}
        className="grid grid-flow-col auto-cols-[calc((100%-14px)/2)] gap-3.5 overflow-x-auto snap-x snap-mandatory sm:auto-cols-[calc((100%-40px)/3)] sm:gap-5 lg:auto-cols-[calc((100%-80px)/5)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-busy={state === "loading"}
      >
        {state === "loading"
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <div key={idx} className="product-card animate-pulse" aria-hidden="true">
                <div className="product-image bg-[#f1f2ef]" />
                <div className="product-info">
                  <div className="min-h-[3.2em] space-y-1.5 pt-0.5">
                    <div className="h-3.5 w-11/12 rounded bg-[#eef3ef]" />
                    <div className="h-3.5 w-2/3 rounded bg-[#eef3ef]" />
                  </div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-[#f1f2ef]" />
                </div>
              </div>
            ))
          : items.map((product) => <ProductCard key={product.item_id} p={product} />)}
      </div>
    </section>
  );
}
