import { prisma } from "@/lib/prisma";

export default async function WelfareDisbursementPage() {
  const requests = await prisma.welfareRequest.findMany({
    where: {
      status: {
        in: ["approved"],
      },
    },
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Welfare Disbursement
        </h2>
        <p className="mt-1 text-slate-500">
          Disburse approved welfare requests to members.
        </p>
      </div>

      <form
        action="/api/welfare/disburse"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Approved Request
            </label>
            <select
              name="welfareRequestId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select approved request</option>
              {requests.map((item) => (
                <option key={item.id.toString()} value={item.id.toString()}>
                  {item.member.user.fullName} - {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount Approved
            </label>
            <input
              name="amountApproved"
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select method</option>
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank</option>
              <option value="wallet">Wallet</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Transaction Reference
            </label>
            <input
              name="transactionReference"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Disburse Welfare
          </button>
        </div>
      </form>
    </div>
  );
}