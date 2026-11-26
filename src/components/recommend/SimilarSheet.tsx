"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Icon } from "@/components/ui/Icon";
import type { Product } from "@/lib/data";

type SimilarSheetProps = {
  productId: number;
  productName?: string;
  limit?: number;
  label?: string;
  className?: string;
  variant?: "button" | "secondary" | "inline" | "card";
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * Nút "Tìm mẫu tương tự" mở bottom-sheet trên mobile / modal trên desktop.
 * Có focus trap, phím Esc, aria-modal và vùng bấm tối thiểu 44px.
 */
export function SimilarSheet({
  productId,
  productName,
  limit = 8,
  label = "Tìm mẫu tương tự",
  className = "",
  variant = "secondary",
}: SimilarSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Product[] | null>(null);
  const [fetchedForId, setFetchedForId] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const fetchSimilar = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/recommend/similar?id=${encodeURIComponent(String(productId))}&limit=${limit}`,
          { signal },
        );
        if (!res.ok) throw new Error("Không tải được mẫu tương tự");
        const data = (await res.json()) as { items?: Product[] };
        setItems(Array.isArray(data.items) ? data.items : []);
        setFetchedForId(productId);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setError("Không thể tải gợi ý lúc này. Vui lòng thử lại.");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [limit, productId],
  );

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previous = (document.activeElement as HTMLElement | null) ?? triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!dialog.open) dialog.showModal();
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
      if (dialog.open) dialog.close();
      document.body.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (fetchedForId === productId && items !== null) return;
    const controller = new AbortController();
    queueMicrotask(() => { if (!controller.signal.aborted) void fetchSimilar(controller.signal); });
    return () => controller.abort();
  }, [open, productId, fetchedForId, items, fetchSimilar]);

  const triggerClasses =
    variant === "card"
      ? "product-card-similar"
      : variant === "inline"
        ? "inline-flex min-h-[44px] items-center gap-1.5 px-2 py-2 text-xs font-semibold text-[#00504a] underline underline-offset-4 hover:text-[#003d38]"
        : variant === "button"
          ? "fb-button min-h-[44px]"
          : "fb-button secondary min-h-[44px]";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${triggerClasses} ${className}`.trim()}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={variant === "card" ? `Tìm mẫu tương tự cho ${productName ?? "sản phẩm"}` : undefined}
        title={variant === "card" ? label : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Icon name={variant === "card" ? "similar" : "search"} width="16" height="16" />
        <span className={variant === "card" ? "product-card-similar-label" : undefined}>{label}</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none max-h-[86dvh] rounded-t-2xl border-0 bg-white p-0 text-[#263532] shadow-2xl open:flex open:flex-col sm:inset-0 sm:m-auto sm:w-[min(920px,92vw)] sm:max-h-[85dvh] sm:rounded-lg backdrop:bg-[#112b26]/50"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#d9dfdb] bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-[#263532] sm:text-lg">
              Mẫu tương tự
            </h2>
            {productName && (
              <p className="truncate text-xs text-[#5c6662]">Dựa trên: {productName}</p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="icon-button min-h-[44px] min-w-[44px]"
            aria-label="Đóng danh sách mẫu tương tự"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" />
          </button>
        </header>

        <div
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a[href]")) {
              setOpen(false);
            }
          }}
        >
          {loading && (
            <div
              className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4"
              aria-busy="true"
              aria-label="Đang tải mẫu tương tự"
            >
              {Array.from({ length: Math.min(limit, 8) }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="aspect-square w-full rounded-[2px] bg-[#f1f2ef]" />
                  <div className="mt-3 h-4 w-11/12 rounded bg-[#eef3ef]" />
                  <div className="mt-1.5 h-4 w-2/3 rounded bg-[#eef3ef]" />
                  <div className="mt-2.5 h-4 w-1/2 rounded bg-[#f1f2ef]" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded bg-[#f5f3ee] px-4 py-8 text-center">
              <p className="text-sm text-[#263532]">{error}</p>
              <button
                type="button"
                className="fb-button mt-4 min-h-[44px]"
                onClick={() => void fetchSimilar()}
              >
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && items && items.length === 0 && (
            <p className="py-10 text-center text-sm text-[#5c6662]">
              Chưa tìm thấy mẫu tương tự phù hợp cho sản phẩm này.
            </p>
          )}

          {!loading && !error && items && items.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.item_id} p={product} showSimilarAction={false} />
              ))}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
