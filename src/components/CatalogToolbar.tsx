"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mainCategories, priceOptions, sortOptions, type MenuCategory } from "@/lib/catalog";
import { Drawer } from "./ui/Drawer";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
export function CatalogToolbar({ categories, params, title, total }: { categories: MenuCategory[]; params: Record<string, string>; title: string; total: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const main = mainCategories(categories).filter(c => c.count);
  const other = categories.filter(c => c.count && !main.some(m => m.id === c.id));
  const updateSort = (value: string) => {
    const qs = new URLSearchParams(params); qs.set("sort", value); qs.delete("page");
    router.push(`/san-pham?${qs}`);
  };
  return <><div className="catalog-toolbar"><Button className="filter-button" onClick={() => setOpen(true)}><Icon name="filter"/>Bộ lọc{params.cat || params.price ? <span className="filter-indicator" aria-label="Đang áp dụng bộ lọc"/> : null}</Button><div className="catalog-title"><h2>{title}</h2><p>{total} sản phẩm</p></div><label className="sort-select"><span className="sr-only">Sắp xếp sản phẩm</span><select value={params.sort || "featured"} onChange={(e) => updateSort(e.target.value)}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <Drawer title="Bộ lọc sản phẩm" open={open} onClose={() => setOpen(false)}><form action="/san-pham" className="filter-form" onSubmit={() => setOpen(false)}>
      {Object.entries(params).filter(([key]) => !["cat", "price", "page"].includes(key)).map(([key, value]) => <input type="hidden" name={key} value={value} key={key}/>)}
      <fieldset><legend>Danh mục sản phẩm</legend><label className="radio-label"><input type="radio" name="cat" value="" defaultChecked={!params.cat}/>Tất cả sản phẩm</label><details><summary>{categories.find(c => String(c.id) === params.cat)?.name ?? "Chọn danh mục"}</summary>{main.map(c => <label className="radio-label" key={c.id}><input type="radio" name="cat" value={c.id} defaultChecked={params.cat === String(c.id)}/><span>{c.name} <small>({c.count})</small></span></label>)}<details open={other.some(c => String(c.id) === params.cat)}><summary>Danh mục khác</summary>{other.map(c => <label className="radio-label" key={c.id}><input type="radio" name="cat" value={c.id} defaultChecked={params.cat === String(c.id)}/><span>{c.name} <small>({c.count})</small></span></label>)}</details></details></fieldset>
      <fieldset><legend>Giá sản phẩm</legend><label className="radio-label"><input type="radio" name="price" value="" defaultChecked={!params.price}/>Tất cả mức giá</label>{priceOptions.map(p => <label className="radio-label" key={p.value}><input type="radio" name="price" value={p.value} defaultChecked={params.price === p.value}/>{p.label}</label>)}<p className="filter-hint">Lọc theo giá thấp nhất của sản phẩm.</p></fieldset><div className="filter-actions"><button type="submit" className="fb-button">ÁP DỤNG BỘ LỌC</button><Link href="/san-pham" className="text-link" onClick={() => setOpen(false)}>Xóa bộ lọc</Link></div>
    </form></Drawer>
  </>;
}
