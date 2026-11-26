/** Chỉ chuyển thông số DB thành văn bản; không suy đoán chất liệu/kích thước. */
export function productSpecs(p: { sku?: string | null; brand?: string | null; weight?: number | null; dimension?: unknown; attributes?: unknown }) {
  const rows: [string, string][] = [];
  if(p.sku) rows.push(["Mã sản phẩm (SKU)", p.sku]);
  if(p.brand && p.brand !== "NoBrand") rows.push(["Thương hiệu", p.brand]);
  if(p.weight != null) rows.push(["Trọng lượng", `${p.weight} kg`]);
  if(p.dimension && typeof p.dimension === "object") {
    const d = p.dimension as Record<string, unknown>;
    const parts = [["package_length", "Dài"], ["package_width", "Rộng"], ["package_height", "Cao"]].flatMap(([key,label]) => d[key] != null ? [`${label}: ${d[key]} cm`] : []);
    if(parts.length) rows.push(["Kích thước đóng gói", parts.join(" × ")]);
  }
  if(Array.isArray(p.attributes)) for(const attr of p.attributes) {
    const name = attr.original_attribute_name || attr.attribute_name || attr.name;
    const values = Array.isArray(attr.attribute_value_list) ? attr.attribute_value_list.map((v: { original_value_name?: string; value_name?: string }) => v.original_value_name || v.value_name).filter(Boolean) : [];
    const labels: Record<string,string> = { Material: "Chất liệu", "Bag Set": "Bộ sản phẩm", "Bag Size": "Kích cỡ", "Warranty Type": "Loại bảo hành", "Warranty Duration": "Thời hạn bảo hành", "Country of Origin": "Xuất xứ", "Pattern": "Họa tiết", "Style": "Phong cách", "Gender": "Dành cho", "Laptop Size": "Kích cỡ laptop" };
    const translated: Record<string,string> = { "Yes": "Có", "No": "Không", "Others": "Khác", "Supplier Warranty": "Bảo hành nhà cung cấp", "6 Months": "6 tháng", "12 Months": "12 tháng", "Vietnam": "Việt Nam" };
    if(typeof name === "string" && values.length) rows.push([labels[name] || name, values.map((v: string) => translated[v] || v).join(", ")]);
  }
  return rows;
}
