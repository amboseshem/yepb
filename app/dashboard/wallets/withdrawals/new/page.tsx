import { prisma } from "@/lib/prisma";

export default async function NewWithdrawalPage() {
  const wallets = await prisma.wallet.findMany({
    where: {
      walletType: "earnings_wallet",
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
        <h2 className="text-3xl font-bold text-slate-800">Create Withdrawal Request</h2>
        <p className="mt-1 text-slate-500">
          Create a withdrawal request from a member earnings wallet.
        </p>
      </div>

      <form
        action="/api/wallets/withdrawals/create"
        method="POST"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Member Wallet</label>
            <select
              name="walletId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select wallet</option>
              {wallets.map((wallet) => (
                <option key={wallet.id.toString()} value={wallet.id.toString()}>
                  {wallet.member.user.fullName} - {wallet.member.user.phone} - KES {Number(wallet.balance).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select method</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Account Details</label>
          <textarea
            name="accountDetails"
            rows={4}
            placeholder='{"phone":"0712345678","name":"Member Name"}'
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Withdrawal Request
          </button>
        </div>
      </form>
    </div>
  );
}