import type { Category } from "./data";

export type MenuCategory = Category & { count: number };
export function mainCategories<T extends Category>(categories: T[]): T[] {
  return categories.filter((c) => /túi|ba\s*lô|balo|vali|ví|cặp|phụ kiện du lịch|móc khóa/i.test(c.name) && !/máy ảnh|trang điểm|bỉm|khác/i.test(c.name));
}
/** Eight actual shopping categories, ordered like the reference's compact menu. */
export function navigationCategories(categories: MenuCategory[]) {
  return [100095, 100094, 100089, 100096, 100090, 100086, 100085, 100087]
    .flatMap(id => categories.filter(c => c.id === id && c.count > 0));
}
export const sortOptions = [
  ["featured", "Nổi bật"], ["price_asc", "Giá tăng dần"], ["price_desc", "Giá giảm dần"],
  ["name_asc", "Tên A–Z"], ["name_desc", "Tên Z–A"], ["newest", "Mới nhất"],
] as const;
// Half-open intervals prevent overlaps at 50k, 200k, 500k and 1m.
export const priceOptions = [
  { value: "under50", label: "Dưới 50.000đ", min: 0, max: 50000 },
  { value: "50to200", label: "50.000 – dưới 200.000đ", min: 50000, max: 200000 },
  { value: "200to500", label: "200.000 – dưới 500.000đ", min: 200000, max: 500000 },
  { value: "500to1000", label: "500.000 – 1.000.000đ", min: 500000, max: 1000001 },
  { value: "over1000", label: "Trên 1.000.000đ", min: 1000001, max: undefined },
];
