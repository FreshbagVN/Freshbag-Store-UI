import Client from "@/components/OrderSuccessClient";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
export function generateMetadata() { return createMetadata({ title: "Xác nhận đặt hàng và chi tiết đơn của bạn", description: "Xem mã đơn Freshbag, thông tin người nhận, sản phẩm và tổng thanh toán sau khi đặt hàng. Lưu mã đơn cùng số điện thoại để tra cứu trạng thái khi cần.", path: "/dat-hang-thanh-cong", noindex: true }); }
export default function Page() { return <><Breadcrumb label="Xác nhận đặt hàng"/><JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", href: "/" }, { name: "Xác nhận đặt hàng", href: "/dat-hang-thanh-cong" }])}/><Client/></>; }
