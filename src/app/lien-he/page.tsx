import { POLICIES } from "@/content/policies";
import { PolicyPageView } from "@/components/policy/PolicyPageView";
import { ContactDetailsAndMap } from "@/components/policy/ContactDetailsAndMap";
import { buildPolicyJsonLdList, buildPolicyMetadata } from "@/components/policy/policySeo";

export function generateMetadata() {
  return buildPolicyMetadata("lien-he");
}

export default function LienHePage() {
  return (
    <PolicyPageView
      doc={POLICIES["lien-he"]}
      jsonLdList={buildPolicyJsonLdList("lien-he")}
      extraBeforeRelated={<ContactDetailsAndMap />}
    />
  );
}
