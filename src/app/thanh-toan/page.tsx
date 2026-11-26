import Client from "@/components/CheckoutClient";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
export function generateMetadata() { return createMetadata({ title: "Thanh toán đơn hàng và thông tin nhận hàng", description: "Hoàn tất đơn Freshbag với thông tin nhận hàng rõ ràng. Chọn thanh toán khi nhận hàng hoặc chuyển khoản, kiểm tra sản phẩm và tổng tiền trước khi đặt.", path: "/thanh-toan", noindex: true }); }
export default function Page() { return <><Breadcrumb label="Thanh toán đơn hàng"/><JsonLd data={breadcrumbJsonLd([{ name: "Trang chủ", href: "/" }, { name: "Thanh toán đơn hàng", href: "/thanh-toan" }])}/><Client/></>; }
