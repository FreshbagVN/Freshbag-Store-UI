import Client from "@/components/CartPageClient";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
export function generateMetadata() { return createMetadata({ title: "Giỏ hàng của bạn và sản phẩm đã chọn", description: "Kiểm tra sản phẩm, phân loại và số lượng trong giỏ Freshbag. Thêm ghi chú, xem tổng tiền và chuyển sang bước điền thông tin nhận hàng để đặt mua.", path: "/gio-hang", noindex: true }); }
export default function Page() { return <><Breadcrumb label="Giỏ hàng của bạn"/><JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", href: "/" }, { name: "Giỏ hàng của bạn", href: "/gio-hang" }])}/><Client/></>; }
