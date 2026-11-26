export const RECENTLY_VIEWED_KEY = "fb_recently_viewed";
export const MAX_RECENTLY_VIEWED = 20;
export const RECENTLY_VIEWED_EVENT = "fb:recently-viewed";

export type RecentlyViewedItem = {
  id: number;
  viewedAt: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeList(raw: unknown): RecentlyViewedItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<number>();
  const out: RecentlyViewedItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const id = Number((entry as { id?: unknown }).id);
    const viewedAt = Number((entry as { viewedAt?: unknown }).viewedAt);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      viewedAt: Number.isFinite(viewedAt) && viewedAt > 0 ? viewedAt : Date.now(),
    });
    if (out.length >= MAX_RECENTLY_VIEWED) break;
  }

  return out;
}

function notifyChange(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(RECENTLY_VIEWED_EVENT));
  } catch {
    // Bỏ qua nếu môi trường không hỗ trợ CustomEvent/Event.
  }
}

/** Đọc danh sách sản phẩm đã xem (mới nhất trước, tối đa 20, không dữ liệu cá nhân). */
export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    return sanitizeList(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** Ghi nhận một sản phẩm vừa xem lên đầu danh sách (bỏ trùng, tối đa 20). */
export function addRecentlyViewed(productId: number): RecentlyViewedItem[] {
  if (!Number.isSafeInteger(productId) || productId <= 0) return getRecentlyViewed();
  if (!canUseStorage()) return [];

  const existing = getRecentlyViewed().filter((item) => item.id !== productId);
  const next: RecentlyViewedItem[] = [
    { id: productId, viewedAt: Date.now() },
    ...existing,
  ].slice(0, MAX_RECENTLY_VIEWED);

  try {
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    notifyChange();
  } catch {
    // Bỏ qua lỗi quota hoặc chế độ riêng tư chặn localStorage.
  }
  return next;
}

/** Xóa toàn bộ lịch sử sản phẩm đã xem. */
export function clearRecentlyViewed(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(RECENTLY_VIEWED_KEY);
    notifyChange();
  } catch {
    // Bỏ qua nếu localStorage không khả dụng.
  }
}

export {
  addRecentlyViewed as add,
  clearRecentlyViewed as clear,
  getRecentlyViewed as get,
};
