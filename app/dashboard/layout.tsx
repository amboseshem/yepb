import Link from "next/link";
import { ReactNode } from "react";
import { getCurrentUserToken, getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getCurrentUserToken();
  const user = await getCurrentUser();

  // ✅ Ensure role is always string
  const role = token?.role ? String(token.role) : "";

  const navItems = [
    { href: "/dashboard", label: "Dashboard", roles: ["super_admin", "admin", "leader", "member", "trainer", "treasurer"] },
    { href: "/dashboard/members", label: "Members", roles: ["super_admin", "admin", "leader"] },
    { href: "/dashboard/contributions", label: "Contributions", roles: ["super_admin", "admin", "treasurer", "leader"] },
    { href: "/dashboard/projects", label: "Projects", roles: ["super_admin", "admin", "leader"] },
    { href: "/dashboard/projects/transactions", label: "Project Transactions", roles: ["super_admin", "admin", "leader"] },
    { href: "/dashboard/welfare", label: "Welfare", roles: ["super_admin", "admin", "treasurer", "leader"] },
    { href: "/dashboard/welfare/disburse", label: "Welfare Disbursement", roles: ["super_admin", "admin", "treasurer"] },
    { href: "/dashboard/training", label: "Training", roles: ["super_admin", "admin", "trainer", "leader"] },
    { href: "/dashboard/wallets", label: "Wallets", roles: ["super_admin", "admin", "treasurer"] },
    { href: "/dashboard/wallets/transactions", label: "Wallet Transactions", roles: ["super_admin", "admin", "treasurer"] },
    { href: "/dashboard/wallets/withdrawals", label: "Withdrawals", roles: ["super_admin", "admin", "treasurer"] },
    { href: "/dashboard/referrals", label: "Referrals", roles: ["super_admin", "admin"] },
    { href: "/dashboard/referrals/codes", label: "Referral Codes", roles: ["super_admin", "admin"] },
    { href: "/dashboard/referrals/generate", label: "Generate Code", roles: ["super_admin", "admin"] },
    { href: "/dashboard/commissions", label: "Commissions", roles: ["super_admin", "admin"] },
    { href: "/dashboard/commissions/plans", label: "Commission Plans", roles: ["super_admin", "admin"] },
    { href: "/dashboard/mlm", label: "MLM Summary", roles: ["super_admin", "admin"] },
    { href: "/dashboard/reports", label: "Reports", roles: ["super_admin", "admin", "leader"] },
    { href: "/dashboard/reports/print", label: "Printable Reports", roles: ["super_admin", "admin", "leader"] },
    { href: "/dashboard/users-access", label: "Users & Access", roles: ["super_admin", "admin"] },
    { href: "/dashboard/settings", label: "Settings", roles: ["super_admin", "admin"] },
  ];

  // ✅ Safe filtering
  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gradient-to-b from-blue-700 via-purple-700 to-blue-900 text-white p-5 shadow-xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black text-white shadow-lg">
              Y
            </div>
            <div>
              <h2 className="text-2xl font-bold">YEP Admin</h2>
              <p className="text-sm text-blue-100">
                Youth Empowerment Platform
              </p>
            </div>
          </div>

          {/* USER INFO */}
          <div className="rounded-2xl bg-white/10 p-3 text-sm">
            <p className="font-semibold">
              Logged in as: {user?.fullName ?? "Unknown User"}
            </p>

            <p className="text-blue-100">
              Role: {role || "-"}
            </p>

            {/* ❌ Removed broken relation */}
            <p className="text-blue-100">
              Branch: {"-"}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2 max-h-[78vh] overflow-y-auto pr-1">
          {visibleNavItems.length === 0 ? (
            <p className="text-sm text-blue-100 px-2">
              No access available
            </p>
          ) : (
            visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium bg-white/10 hover:bg-white/20 transition"
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Youth Empowerment Platform
            </h1>
            <p className="text-sm text-slate-500">
              Administration Portal
            </p>
          </div>

          <a
            href="/api/auth/logout"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Logout
          </a>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}