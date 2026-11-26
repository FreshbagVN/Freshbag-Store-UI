import { supabase } from "./supabase";

export const SHOP_ID = 65211662;

export type Category = { id: number; name: string; parent_id: number | null };
export type Product = {
  item_id: number;
  name: string;
  images: string[];
  sku_image?: string | null;
  min_price: number | null;
  max_price: number | null;
  category_id: number;
  total_stock: number | null;
  shopee_created_at?: string | null;
  original_price?: number | null;
  is_new?: boolean;
};

type TierVariation = { option_list?: { image?: { image_url?: string } }[] };
export function extractSkuImage(tierVariation: unknown): string | null {
  if (!Array.isArray(tierVariation)) return null;
  for (const tier of tierVariation as TierVariation[]) {
    for (const opt of tier?.option_list ?? []) {
      const url = opt?.image?.image_url;
      if (typeof url === "string" && url.startsWith("http")) return url;
    }
  }
  return null;
}
export type Variant = {
  model_id: number;
  name: string | null;
  sku: string | null;
  price: number | null;
  original_price: number | null;
  stock: number | null;
  tier_index: number[] | null;
};

export const PAGE_SIZE = 24;
export const vnd = (n: number | null | undefined) =>
  n == null ? "Liên hệ" : new Intl.NumberFormat("vi-VN").format(n) + "₫";
export const shopeeUrl = (itemId: number) => `https://shopee.vn/product/${SHOP_ID}/${itemId}`;
export const thumb = (url?: string) => url ?? "";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("id,name,parent_id").limit(500);
  if (error) throw error;
  return data ?? [];
}

/** Danh mục gốc kèm số sản phẩm (gộp cả danh mục con). */
export async function getRootCategories() {
  const [cats, { data: prods, error }] = await Promise.all([
    getCategories(),
    supabase.from("products").select("category_id").limit(5000),
  ]);
  if (error) throw error;
  const byId = new Map(cats.map((c) => [c.id, c]));
  const rootOf = (id: number) => {
    let c = byId.get(id);
    while (c?.parent_id && byId.get(c.parent_id)) c = byId.get(c.parent_id);
    return c;
  };
  const counts = new Map<number, number>();
  for (const p of prods ?? []) {
    const r = rootOf(p.category_id);
    if (r) counts.set(r.id, (counts.get(r.id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ ...byId.get(id)!, count }))
    .sort((a, b) => b.count - a.count);
}

/** Id danh mục + toàn bộ danh mục con. */
export async function descendantIds(rootId: number): Promise<number[]> {
  const cats = await getCategories();
  const out = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of cats) {
      if (c.parent_id && out.has(c.parent_id) && !out.has(c.id)) {
        out.add(c.id);
        grew = true;
      }
    }
  }
  return [...out];
}

export async function listProducts(opts: { cat?: number; q?: string; page?: number; sort?: string; min?: number; max?: number; sale?: boolean; limit?: number }) {
  const page = Number.isSafeInteger(opts.page) ? Math.max(1, Math.min(10000, opts.page!)) : 1;
  const pageSize = opts.limit && Number.isSafeInteger(opts.limit) ? Math.max(1, Math.min(60, opts.limit)) : PAGE_SIZE;
  let query = supabase
    .from("products")
    .select("item_id,name,images,tier_variation,min_price,max_price,category_id,total_stock,shopee_created_at,product_variants(price,original_price)", { count: "exact" });
  if (opts.cat) query = query.in("category_id", await descendantIds(opts.cat));
  if (opts.q) query = query.ilike("name", `%${opts.q.replace(/[%,()]/g, " ")}%`);
  if (opts.min != null && Number.isFinite(opts.min)) query = query.gte("min_price", opts.min);
  if (opts.max != null && Number.isFinite(opts.max)) query = query.lt("min_price", opts.max);
  if (opts.sale) {
    const saleIds = new Set<number>();
    // Paginate reads because PostgREST can cap each response at 1,000 rows.
    for (let offset = 0; ; offset += 1000) {
      const { data: variants, error: variantError } = await supabase.from("product_variants").select("item_id,price,original_price").order("model_id").range(offset, offset + 999);
      if (variantError) throw variantError;
      for (const v of variants ?? []) if (v.price != null && v.original_price != null && v.original_price > v.price) saleIds.add(v.item_id);
      if ((variants?.length ?? 0) < 1000) break;
    }
    const ids = [...saleIds];
    if (!ids.length) return { items: [] as Product[], total: 0, page, pages: 1 };
    query = query.in("item_id", ids);
  }
  if (opts.sort === "price_asc") query = query.order("min_price", { ascending: true, nullsFirst: false });
  else if (opts.sort === "price_desc") query = query.order("min_price", { ascending: false, nullsFirst: false });
  else if (opts.sort === "name_asc") query = query.order("name", { ascending: true });
  else if (opts.sort === "name_desc") query = query.order("name", { ascending: false });
  else if (opts.sort === "newest") query = query.order("shopee_created_at", { ascending: false, nullsFirst: false });
  else query = query.order("shopee_updated_at", { ascending: false });
  query = query.order("item_id", { ascending: false });
  const from = (page - 1) * pageSize;
  const { data, count, error } = await query.range(from, from + pageSize - 1);
  if (error) throw error;
  const now = Date.now();
  const items: Product[] = (data ?? []).map(({ product_variants, tier_variation, ...p }) => ({ ...p,
    sku_image: extractSkuImage(tier_variation),
    is_new: !!p.shopee_created_at && Date.parse(p.shopee_created_at) > now - 30 * 86400000 && Date.parse(p.shopee_created_at) <= now,
    original_price: product_variants.find((v) => v.price === p.min_price && v.original_price != null && v.price != null && v.original_price > v.price)?.original_price ?? null,
  }));
  return { items, total: count ?? 0, page, pages: Math.max(1, Math.ceil((count ?? 0) / pageSize)) };
}

export async function getCatalogCategories() {
  const [cats, { data, error }] = await Promise.all([getCategories(), supabase.from("products").select("category_id").limit(5000)]);
  if (error) throw error;
  const counts = new Map<number, number>();
  const byId = new Map(cats.map((c) => [c.id, c]));
  for (const p of data ?? []) {
    let id: number | null = p.category_id;
    const visited = new Set<number>();
    while (id != null && !visited.has(id)) {
      visited.add(id); counts.set(id, (counts.get(id) ?? 0) + 1);
      id = byId.get(id)?.parent_id ?? null;
    }
  }
  return cats.map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }));
}

export async function getProduct(id: number) {
  const { data: p, error } = await supabase.from("products").select("*").eq("item_id", id).maybeSingle();
  if (error) throw error;
  if (!p) return null;
  const { data: variants } = await supabase
    .from("product_variants")
    .select("model_id,name,sku,price,original_price,stock,tier_index")
    .eq("item_id", id)
    .order("model_id");
  const { data: cat } = await supabase.from("categories").select("id,name,parent_id").eq("id", p.category_id).maybeSingle();
  return { product: p, variants: (variants ?? []) as Variant[], category: cat as Category | null };
}
