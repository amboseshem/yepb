import Link from "next/link";
import { ReactNode } from "react";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-2xl font-black text-white shadow-xl">
              Y
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">YEP Member Portal</h1>
              <p className="text-sm text-slate-500">Youth Empowerment Platform</p>
            </div>
          </div>

          <nav className="flex gap-3">
            <Link href="/portal" className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200">
              Home
            </Link>
            <Link href="/portal/wallet" className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200">
              Wallet
            </Link>
            <Link href="/portal/referrals" className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200">
              Referrals
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}