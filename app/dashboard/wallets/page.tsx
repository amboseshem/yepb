import { prisma } from "@/lib/prisma";

export default async function WalletsPage() {
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
  });

  const totalBalance = wallets.reduce(
    (sum, item) => sum + Number(item.balance),
    0
  );

  const contributionWallets = wallets.filter(
    (item) => item.walletType === "contribution_wallet"
  ).length;

  const earningsWallets = wallets.filter(
    (item) => item.walletType === "earnings_wallet"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Wallets</h2>
        <p className="mt-1 text-slate-500">
          View member wallet balances and wallet structure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Wallets</p>
          <h3 className="mt-2 text-3xl font-bold">{wallets.length}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Total Balance</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalBalance.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Contribution Wallets</p>
          <h3 className="mt-2 text-3xl font-bold">{contributionWallets}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Earnings Wallets</p>
          <h3 className="mt-2 text-3xl font-bold">{earningsWallets}</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Wallet Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Branch</th>
                <th className="px-4 py-3 font-semibold">Wallet Type</th>
                <th className="px-4 py-3 font-semibold">Balance</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {wallets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No wallets found yet.
                  </td>
                </tr>
              ) : (
                wallets.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.member.user.fullName}</td>
                    <td className="px-4 py-3">{item.member.user.phone}</td>
                    <td className="px-4 py-3">{item.member.branch?.name ?? "-"}</td>
                    <td className="px-4 py-3">{item.walletType}</td>
                    <td className="px-4 py-3">
                      KES {Number(item.balance).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}