import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data";
import { getSimilarProducts } from "@/lib/recommend";

type SimilarProductsProps = {
  productId: number;
  limit?: number;
  title?: string;
  subtitle?: string;
  className?: string;
  items?: Product[];
};

/** Khối gợi ý mẫu tương tự (Server Component), tự ẩn nếu không có sản phẩm phù hợp. */
export async function SimilarProducts({
  productId,
  limit = 12,
  title = "Mẫu tương tự",
  subtitle = "Gợi ý theo danh mục, tầm giá và kiểu dáng gần nhất.",
  className = "",
  items: preloadedItems,
}: SimilarProductsProps) {
  const items = preloadedItems ?? (await getSimilarProducts(productId, limit));
  if (items.length === 0) return null;

  return (
    <section
      className={`related-products ${className}`.trim()}
      aria-labelledby="similar-products-heading"
    >
      <div className="section-heading">
        <span className="eyebrow">GỢI Ý CHO BẠN</span>
        <h2 id="similar-products-heading">{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((product) => (
          <ProductCard key={product.item_id} p={product} />
        ))}
      </div>
    </section>
  );
}
