// Client-side mock auth (localStorage). Swap for real sessions in production
// (see app/api/auth/* and db/schema.sql). Key is shared with InvoiceEditor.

export function getUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("bc_user")); } catch { return null; }
}
export function setUser(u) {
  if (typeof window !== "undefined") localStorage.setItem("bc_user", JSON.stringify(u));
}
export function clearUser() {
  if (typeof window !== "undefined") localStorage.removeItem("bc_user");
}
