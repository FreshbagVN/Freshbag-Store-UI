import Link from "next/link";
import { vnd, type Product } from "@/lib/data";
import { Badge } from "./ui/Badge";
import { SimilarSheet } from "./recommend/SimilarSheet";

export default function ProductCard({
  p,
  showSimilarAction = true,
}: {
  p: Product;
  showSimilarAction?: boolean;
}) {
  const range = p.min_price != null && p.max_price != null && p.min_price !== p.max_price;
  const discount = p.original_price && p.min_price != null && p.original_price > p.min_price ? Math.round((1 - p.min_price / p.original_price) * 100) : 0;
  return <div className="product-card group relative">
    <Link href={`/san-pham/${p.item_id}`} className="product-card-link">
      <div className="product-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.images?.[0] ? <img src={p.images[0]} alt={`${p.name.slice(0, 108)} – ảnh sản phẩm`} loading="lazy" width="480" height="480"/> : <span>Freshbag</span>}
        <div className="product-labels">{p.total_stock === 0 ? <Badge>Hết hàng</Badge> : p.is_new ? <Badge tone="new">New</Badge> : null}</div>
        {discount > 0 && <div className="product-discount"><Badge tone="sale">−{discount}%</Badge></div>}
      </div>
      <div className="product-info"><h3>{p.name}</h3><div className="product-prices"><span>{range ? `${vnd(p.min_price)} – ${vnd(p.max_price)}` : vnd(p.min_price)}</span>{discount > 0 && <del>{vnd(p.original_price)}</del>}</div></div>
    </Link>
    {showSimilarAction && (
      <SimilarSheet
        productId={p.item_id}
        productName={p.name}
        variant="card"
        label="Mẫu tương tự"
      />
    )}
  </div>;
}
