import { prisma } from "@/lib/prisma";

export default async function CommissionsPage() {
  const commissions = await prisma.commission.findMany({
    include: {
      member: {
        include: {
          user: true,
        },
      },
      sourceMember: {
        include: {
          user: true,
        },
      },
      commissionPlan: true,
    },
    orderBy: {
      earnedAt: "desc",
    },
  });

  const totalAmount = commissions.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Commissions</h2>
        <p className="mt-1 text-slate-500">
          Monitor earned commissions and plan triggers.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Commissions</p>
          <h3 className="mt-2 text-3xl font-bold">{commissions.length}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Total Amount</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalAmount.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Approved</p>
          <h3 className="mt-2 text-3xl font-bold">
            {commissions.filter((item) => item.status === "approved").length}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Commission Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Source Member</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No commissions found yet.
                  </td>
                </tr>
              ) : (
                commissions.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.member.user.fullName}</td>
                    <td className="px-4 py-3">
                      {item.sourceMember?.user.fullName ?? "-"}
                    </td>
                    <td className="px-4 py-3">{item.commissionPlan.name}</td>
                    <td className="px-4 py-3">{item.level ?? "-"}</td>
                    <td className="px-4 py-3">
                      KES {Number(item.amount).toLocaleString()}
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