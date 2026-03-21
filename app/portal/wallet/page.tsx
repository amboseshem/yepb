import { prisma } from "@/lib/prisma";

export default async function PortalWalletPage() {
  const wallets = await prisma.wallet.findMany({
    include: {
      member: {
        include: {
          user: true,
          branch: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Member Wallets</h1>
          <p className="mt-2 text-slate-500">
            Wallet balance view for member-side access.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-800">Wallet Overview</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-700">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Wallet Type</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {wallets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No wallets found yet.
                    </td>
                  </tr>
                ) : (
                  wallets.map((wallet) => (
                    <tr key={wallet.id.toString()} className="border-t border-slate-100">
                      <td className="px-4 py-3">{wallet.member.user.fullName}</td>
                      <td className="px-4 py-3">{wallet.member.branch?.name ?? "-"}</td>
                      <td className="px-4 py-3">{wallet.walletType}</td>
                      <td className="px-4 py-3">
                        KES {Number(wallet.balance).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{wallet.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}