import { redirect } from "next/navigation";
import { siteConfig } from "@/data/site";

export default function RootPage() {
  redirect(`/${siteConfig.localeDefault}`);
}
