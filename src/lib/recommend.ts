import { unstable_cache } from "next/cache";
import { getCategories, type Category, type Product } from "./data";
import { supabase } from "./supabase";

type VariantPriceRow = {
  price: number | null;
  original_price: number | null;
};

type ProductQueryRow = {
  item_id: number;
  name: string;
  images: string[] | null;
  min_price: number | null;
  max_price: number | null;
  category_id: number;
  total_stock: number | null;
  shopee_created_at: string | null;
  product_variants: VariantPriceRow[] | null;
};

const PRODUCT_SELECT =
  "item_id,name,images,min_price,max_price,category_id,total_stock,shopee_created_at,product_variants(price,original_price)";

const STOPWORDS = new Set([
  "va",
  "cho",
  "cua",
  "voi",
  "cac",
  "nhung",
  "mot",
  "theo",
  "kem",
  "cung",
  "trong",
  "ngay",
  "moi",
  "nhat",
  "cao",
  "cap",
  "dep",
  "xinh",
  "gia",
  "re",
  "ben",
  "tot",
  "thoi",
  "trang",
  "hang",
  "chinh",
  "freshbag",
  "the",
  "he",
  "tien",
  "loi",
  "dung",
  "nhieu",
  "ngan",
  "phong",
  "cach",
  "mau",
  "sac",
  "chat",
  "lieu",
  "vua",
  "sieu",
  "dang",
  "yeu",
  "kieu",
]);

/** Cụm từ đặc trưng ngành balo/túi xách để tăng độ chính xác khi so tên tiếng Việt không dấu. */
const DOMAIN_PHRASES = [
  "deo cheo",
  "deo vai",
  "deo hong",
  "deo nguc",
  "quai xach",
  "tay cam",
  "hoc sinh",
  "sinh vien",
  "tieu hoc",
  "mau giao",
  "mam non",
  "trung nien",
  "du lich",
  "cong so",
  "di hoc",
  "di lam",
  "di choi",
  "du tiec",
  "chong nuoc",
  "tham nuoc",
  "chong soc",
  "chong tray",
  "vai du",
  "vai bo",
  "vai bo denim",
  "vai canvas",
  "vai nylon",
  "da pu",
  "mau tron",
  "form ngang",
  "form dung",
  "form hop",
  "co lon",
  "gap gon",
  "day rut",
  "tui trong",
  "tui tote",
  "tui xach",
  "cap sach",
  "cap laptop",
  "may tinh bang",
  "dien thoai",
  "bim sua",
  "trang diem",
  "may anh",
  "hop but",
  "moc khoa",
  "han quoc",
  "nhat ban",
  "ulzzang",
  "unisex",
  "pastel",
  "capybara",
  "15.6",
  "16in",
  "15in",
  "14in",
  "13in",
  "11in",
] as const;

const HIGH_SIGNAL_TOKENS = new Set([
  "balo",
  "tui",
  "vali",
  "vi",
  "bop",
  "cap",
  "tote",
  "laptop",
  "chong nuoc",
  "chong soc",
  "deo cheo",
  "deo vai",
  "du lich",
  "hoc sinh",
  "sinh vien",
  "tieu hoc",
  "mau giao",
  "mam non",
  "cong so",
  "trung nien",
  "nam",
  "nu",
  "be",
  "unisex",
  "pastel",
  "den",
  "trang",
  "xam",
  "xanh",
  "hong",
  "nau",
  "kem",
  "do",
  "vang",
  "tim",
  "linh",
  "denim",
  "nylon",
  "canvas",
  "vai du",
  "da",
  "mini",
  "usb",
  "3d",
  "15.6",
  "16in",
  "15in",
  "14in",
]);

/** Chuẩn hóa tiếng Việt có dấu thành chữ thường không dấu. */
export function normalizeVietnamese(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\bba\s+lo\b/g, "balo")
    .replace(/\b(\d+)\s*inch\b/g, "$1in")
    .replace(/[^a-z0-9.]+/g, " ")
    .trim();
}

function extractTokens(name: string): Set<string> {
  const normalized = normalizeVietnamese(name);
  const tokens = new Set<string>();
  if (!normalized) return tokens;

  for (const phrase of DOMAIN_PHRASES) {
    if (normalized.includes(phrase)) tokens.add(phrase);
  }

  for (const raw of normalized.split(/\s+/)) {
    const word = raw.replace(/^\.+|\.+$/g, "");
    if (word.length < 2) continue;
    // Bỏ qua mã SKU số thuần 4+ chữ số (vd: 9098, 34213) để không làm nhiễu điểm giống tên.
    if (/^\d{4,}$/.test(word)) continue;
    if (STOPWORDS.has(word)) continue;
    tokens.add(word);
  }

  return tokens;
}

function computeNameSimilarity(targetTokens: Set<string>, candidateName: string): number {
  if (targetTokens.size === 0) return 0;
  const candTokens = extractTokens(candidateName);
  if (candTokens.size === 0) return 0;

  let matchedWeight = 0;
  let unionWeight = 0;

  const all = new Set([...targetTokens, ...candTokens]);
  for (const token of all) {
    const weight = HIGH_SIGNAL_TOKENS.has(token) || token.includes(" ") ? 2.2 : 1;
    unionWeight += weight;
    if (targetTokens.has(token) && candTokens.has(token)) {
      matchedWeight += weight;
    }
  }

  if (unionWeight === 0) return 0;
  return Math.round((matchedWeight / unionWeight) * 200);
}

function mapRowToProduct(row: ProductQueryRow, nowMs: number): Product {
  const variants = row.product_variants ?? [];
  const originalPrice =
    variants.find(
      (v) =>
        v.price === row.min_price &&
        v.original_price != null &&
        v.price != null &&
        v.original_price > v.price,
    )?.original_price ?? null;
  const createdMs = row.shopee_created_at ? Date.parse(row.shopee_created_at) : NaN;
  const isNew =
    Number.isFinite(createdMs) && createdMs > nowMs - 30 * 86_400_000 && createdMs <= nowMs;

  return {
    item_id: row.item_id,
    name: row.name,
    images: Array.isArray(row.images) ? row.images : [],
    min_price: row.min_price,
    max_price: row.max_price,
    category_id: row.category_id,
    total_stock: row.total_stock,
    shopee_created_at: row.shopee_created_at,
    original_price: originalPrice,
    is_new: isNew,
  };
}

function collectDescendants(rootId: number, categories: Category[]): Set<number> {
  const set = new Set<number>([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) {
      if (c.parent_id != null && set.has(c.parent_id) && !set.has(c.id)) {
        set.add(c.id);
        grew = true;
      }
    }
  }
  return set;
}

function findRootId(categoryId: number, byId: Map<number, Category>): number {
  let current = byId.get(categoryId);
  const visited = new Set<number>();
  while (current?.parent_id != null && byId.has(current.parent_id) && !visited.has(current.id)) {
    visited.add(current.id);
    current = byId.get(current.parent_id);
  }
  return current?.id ?? categoryId;
}

async function computeSimilarProducts(productId: number, limit: number): Promise<Product[]> {
  const [{ data: target, error: targetErr }, categories] = await Promise.all([
    supabase
      .from("products")
      .select("item_id,name,category_id,min_price,max_price,total_stock,status")
      .eq("item_id", productId)
      .eq("status", "NORMAL")
      .maybeSingle(),
    getCategories(),
  ]);

  if (targetErr) throw targetErr;
  if (!target) return [];

  const byId = new Map(categories.map((c) => [c.id, c]));
  const targetCat = byId.get(target.category_id);
  const parentId = targetCat?.parent_id ?? null;
  const rootId = findRootId(target.category_id, byId);

  const parentSubtree = parentId != null ? collectDescendants(parentId, categories) : new Set<number>();
  const rootSubtree = collectDescendants(rootId, categories);

  // 1. Truy vấn ứng viên trong cùng cây danh mục gốc (tối đa 500 mẫu đang bán).
  const { data: rootRows, error: rootErr } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "NORMAL")
    .neq("item_id", productId)
    .in("category_id", [...rootSubtree])
    .limit(500);

  if (rootErr) throw rootErr;

  const candidateMap = new Map<number, ProductQueryRow>();
  for (const row of (rootRows ?? []) as ProductQueryRow[]) {
    candidateMap.set(row.item_id, row);
  }

  const basePrice = target.min_price != null && target.min_price > 0 ? target.min_price : null;
  const minBand = basePrice != null ? Math.floor(basePrice * 0.65) : null;
  const maxBand = basePrice != null ? Math.ceil(basePrice * 1.35) : null;

  const hasEnoughInRoot =
    [...candidateMap.values()].filter((r) => (r.total_stock ?? 0) > 0).length >= limit;

  // 2. Chỉ mở rộng ra ngoài cây danh mục gốc khi toàn bộ danh mục gốc có ít hơn `limit` mẫu còn hàng.
  if (!hasEnoughInRoot) {
    let fallbackQuery = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "NORMAL")
      .neq("item_id", productId);

    if (minBand != null && maxBand != null) {
      fallbackQuery = fallbackQuery.gte("min_price", minBand).lte("min_price", maxBand);
    }

    const { data: fallbackRows, error: fallbackErr } = await fallbackQuery.limit(120);
    if (fallbackErr) throw fallbackErr;

    for (const row of (fallbackRows ?? []) as ProductQueryRow[]) {
      if (!candidateMap.has(row.item_id)) {
        candidateMap.set(row.item_id, row);
      }
    }
  }

  const targetTokens = extractTokens(target.name);
  const nowMs = Date.now();

  const scored = [...candidateMap.values()].map((row) => {
    const inStock = (row.total_stock ?? 0) > 0;
    const isLeaf = row.category_id === target.category_id;
    const isParentSibling = !isLeaf && parentSubtree.has(row.category_id);
    const isRootSibling = !isLeaf && !isParentSibling && rootSubtree.has(row.category_id);

    const diffRatio =
      basePrice != null && row.min_price != null && row.min_price > 0
        ? Math.abs(row.min_price - basePrice) / basePrice
        : null;
    const inPriceBand = diffRatio == null || diffRatio <= 0.35;

    let tierScore = 0;
    if (isLeaf) tierScore = inPriceBand ? 3000 : 1400;
    else if (isParentSibling) tierScore = inPriceBand ? 2400 : 1000;
    else if (isRootSibling) tierScore = inPriceBand ? 1800 : 600;
    else tierScore = inPriceBand ? 400 : 0;

    const priceCloseness =
      diffRatio == null
        ? 50
        : diffRatio <= 0.35
          ? Math.round((1 - diffRatio / 0.35) * 100)
          : Math.max(0, 30 - Math.round(diffRatio * 30));

    const nameScore = computeNameSimilarity(targetTokens, row.name);
    const stockScore = inStock ? 10000 : 0;
    const totalScore = stockScore + tierScore + nameScore + priceCloseness;

    return { row, totalScore };
  });

  scored.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.row.item_id - a.row.item_id;
  });

  return scored.slice(0, limit).map((item) => mapRowToProduct(item.row, nowMs));
}

const getCachedSimilar = unstable_cache(
  async (productId: number, limit: number) => computeSimilarProducts(productId, limit),
  ["freshbag-similar-products-v1"],
  { revalidate: 300, tags: ["products", "recommend"] },
);

/**
 * Lấy danh sách mẫu tương tự theo danh mục (ưu tiên lá -> cha -> gốc),
 * giá ±35%, độ tương đồng tên tiếng Việt và ưu tiên còn hàng.
 * Có cache revalidate 300s; trả về mảng rỗng nếu có lỗi hoặc id không hợp lệ.
 */
export async function getSimilarProducts(productId: number, limit = 12): Promise<Product[]> {
  if (!Number.isSafeInteger(productId) || productId <= 0) return [];
  const safeLimit = Number.isSafeInteger(limit) ? Math.max(1, Math.min(24, limit)) : 12;

  try {
    return await getCachedSimilar(productId, safeLimit);
  } catch {
    return [];
  }
}

/**
 * Lấy thông tin sản phẩm MỚI NHẤT từ DB theo danh sách id (tối đa 20),
 * giữ đúng thứ tự truyền vào và loại bỏ sản phẩm ngừng bán.
 */
export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  const uniqueIds: number[] = [];
  const seen = new Set<number>();
  for (const id of ids) {
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) continue;
    seen.add(id);
    uniqueIds.push(id);
    if (uniqueIds.length >= 20) break;
  }

  if (uniqueIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .in("item_id", uniqueIds)
      .eq("status", "NORMAL");

    if (error) return [];

    const nowMs = Date.now();
    const byId = new Map<number, Product>();
    for (const row of (data ?? []) as ProductQueryRow[]) {
      byId.set(row.item_id, mapRowToProduct(row, nowMs));
    }

    const ordered: Product[] = [];
    for (const id of uniqueIds) {
      const item = byId.get(id);
      if (item) ordered.push(item);
    }
    return ordered;
  } catch {
    return [];
  }
}
