import Link from "next/link";
import { Container } from "./Container";
export function Breadcrumb({ label }: { label: string }) {
  return <nav aria-label="Đường dẫn" className="breadcrumb"><Container><ol><li><Link href="/">Trang chủ</Link></li><li aria-hidden="true">/</li><li aria-current="page">{label}</li></ol></Container></nav>;
}
