import { prisma } from "@/lib/prisma";

export default async function WalletTransactionsPage() {
  const transactions = await prisma.walletTransaction.findMany({
    include: {
      wallet: {
        include: {
          member: {
            include: {
              user: true,
              branch: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Wallet Transactions</h2>
        <p className="mt-1 text-slate-500">
          View all wallet credits and debits across the platform.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Transaction Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Wallet Type</th>
                <th className="px-4 py-3">Txn Type</th>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No wallet transactions found yet.
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.wallet.member.user.fullName}</td>
                    <td className="px-4 py-3">{item.wallet.member.branch?.name ?? "-"}</td>
                    <td className="px-4 py-3">{item.wallet.walletType}</td>
                    <td className="px-4 py-3">{item.transactionType}</td>
                    <td className="px-4 py-3">{item.direction}</td>
                    <td className="px-4 py-3">
                      KES {Number(item.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.referenceType ?? "-"}</td>
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