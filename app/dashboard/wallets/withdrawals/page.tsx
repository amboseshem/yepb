import { prisma } from "@/lib/prisma";

export default async function WithdrawalsPage() {
  const withdrawals = await prisma.withdrawalRequest.findMany({
    include: {
      member: {
        include: {
          user: true,
          branch: true,
        },
      },
      wallet: true,
    },
    orderBy: {
      requestedAt: "desc",
    },
  });

  const totalRequested = withdrawals.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Withdrawal Requests</h2>
        <p className="mt-1 text-slate-500">
          Review and monitor wallet withdrawal activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Requests</p>
          <h3 className="mt-2 text-3xl font-bold">{withdrawals.length}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Total Requested</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalRequested.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Pending</p>
          <h3 className="mt-2 text-3xl font-bold">
            {withdrawals.filter((item) => item.status === "pending").length}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Withdrawal Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Wallet</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requested At</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No withdrawal requests found yet.
                  </td>
                </tr>
              ) : (
                withdrawals.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.member.user.fullName}</td>
                    <td className="px-4 py-3">{item.member.branch?.name ?? "-"}</td>
                    <td className="px-4 py-3">{item.wallet.walletType}</td>
                    <td className="px-4 py-3">
                      KES {Number(item.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.paymentMethod}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">
                      {new Date(item.requestedAt).toLocaleString()}
                    </td>
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