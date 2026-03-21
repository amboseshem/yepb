import { prisma } from "@/lib/prisma";

export default async function NewContributionPage() {
  const members = await prisma.memberProfile.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.contributionCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Add Contribution</h2>
        <p className="mt-1 text-slate-500">
          Record a member contribution into the platform.
        </p>
      </div>

      <form
        action="/api/contributions/create"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Member</label>
            <select
              name="memberId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id.toString()} value={member.id.toString()}>
                  {member.user.fullName} - {member.user.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              name="categoryId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option
                  key={category.id.toString()}
                  value={category.id.toString()}
                >
                  {category.name}
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

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              defaultValue="confirmed"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
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
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Contribution
          </button>
        </div>
      </form>
    </div>
  );
}