import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("chinh-sach-doi-tra");
}

export default function ChinhSachDoiTraPage() {
  return (
    <PolicyPageView
      doc={POLICIES["chinh-sach-doi-tra"]}
      jsonLdList={buildPolicyJsonLdList("chinh-sach-doi-tra")}
    />
  );
}
