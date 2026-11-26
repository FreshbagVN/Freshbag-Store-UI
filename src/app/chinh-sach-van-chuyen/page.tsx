import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("chinh-sach-van-chuyen");
}

export default function ChinhSachVanChuyenPage() {
  return (
    <PolicyPageView
      doc={POLICIES["chinh-sach-van-chuyen"]}
      jsonLdList={buildPolicyJsonLdList("chinh-sach-van-chuyen")}
    />
  );
}
