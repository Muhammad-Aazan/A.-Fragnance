// Server Component — no "use client" directive.
// This ensures Next.js can always see {children} during instant-navigation
// validation (Turbopack insight: "page dropped from rendering").
// All interactive chrome (auth gate, sidebar) lives in AdminShell (client).

import AdminShell from "./AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AdminShell always renders {children} in the DOM (hidden behind the auth
  // overlay when not authenticated), so Next.js instant-nav validation passes.
  return <AdminShell>{children}</AdminShell>;
}
