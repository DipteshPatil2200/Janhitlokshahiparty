import type { OrgNode } from "@/types";
import { getOrgTree } from "@/lib/api";

export const orgLevels = [
  { id: "state", label: { en: "Maharashtra", mr: "महाराष्ट्र" } },
  { id: "division", label: { en: "Division", mr: "विभाग" } },
  { id: "district", label: { en: "District", mr: "जिल्हा" } },
  { id: "assembly", label: { en: "Assembly Constituency", mr: "विधानसभा मतदारसंघ" } },
  { id: "taluka", label: { en: "Taluka", mr: "तालुका" } },
  { id: "local", label: { en: "Local Unit", mr: "स्थानिक एकक" } },
] as const;

export async function getOrgRoot(): Promise<OrgNode> {
  const nodes = await getOrgTree();
  return (
    nodes[0] || {
      name: { en: "Maharashtra", mr: "महाराष्ट्र" },
      level: "state",
    }
  );
}