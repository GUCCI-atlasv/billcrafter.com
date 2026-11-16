import { redirect } from "next/navigation";

// The dashboard was renamed to /invoicemanager. Keep this permanent redirect so
// old links, bookmarks and any previously-issued OAuth/checkout URLs still work.
export const dynamic = "force-static";

export default function DashboardRedirect() {
  redirect("/invoicemanager");
}
