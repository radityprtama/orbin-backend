import { redirect } from "next/navigation";
import { mockOrganizations } from "@/lib/mock-data";

export default function Home() {
  const defaultOrg = mockOrganizations[0];
  redirect(`/${defaultOrg.slug}`);
}
