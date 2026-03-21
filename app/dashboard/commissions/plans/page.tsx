import { prisma } from "@/lib/prisma";

export default async function CommissionPlansPage() {
  const plans = await prisma.commissionPlan.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Commission Plans</h2>
        <p className="mt-1 text-slate-500">
          Create and monitor commission structures for MLM and referrals.
        </p>
      </div>

      <form
        action="/api/commissions/plans/create"
        method="POST"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="name"
            placeholder="Plan Name"
            required
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <select
            name="triggerType"
            required
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Trigger Type</option>
            <option value="signup">Signup</option>
            <option value="product_purchase">Product Purchase</option>
            <option value="subscription">Subscription</option>
            <option value="renewal">Renewal</option>
            <option value="manual_bonus">Manual Bonus</option>
          </select>
          <input
            name="level"
            type="number"
            placeholder="Level"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            name="percentage"
            type="number"
            step="0.0001"
            placeholder="Percentage"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            name="fixedAmount"
            type="number"
            step="0.01"
            placeholder="Fixed Amount"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <select
            name="status"
            defaultValue="approved"
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <textarea
          name="description"
          rows={3}
          placeholder="Description"
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        <div className="mt-4">
          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Save Commission Plan
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Saved Plans</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Fixed Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No commission plans found yet.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{plan.name}</td>
                    <td className="px-4 py-3">{plan.triggerType}</td>
                    <td className="px-4 py-3">{plan.level ?? "-"}</td>
                    <td className="px-4 py-3">{plan.percentage?.toString() ?? "-"}</td>
                    <td className="px-4 py-3">
                      {plan.fixedAmount ? `KES ${Number(plan.fixedAmount).toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3">{plan.status}</td>
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