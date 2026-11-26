import Client from "@/components/LookupClient";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
export function generateMetadata() { return createMetadata({ title: "Tra cứu đơn hàng và theo dõi trạng thái", description: "Tra cứu đơn Freshbag bằng mã đơn hàng và số điện thoại đã đặt. Kiểm tra trạng thái xử lý, các sản phẩm đã chọn và tổng tiền trong thông tin đơn hàng.", path: "/tra-cuu-don", noindex: true }); }
export default function Page() { return <><Breadcrumb label="Tra cứu đơn hàng"/><JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", href: "/" }, { name: "Tra cứu đơn hàng", href: "/tra-cuu-don" }])}/><Client/></>; }
