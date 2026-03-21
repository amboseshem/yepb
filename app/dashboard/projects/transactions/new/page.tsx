import { prisma } from "@/lib/prisma";

export default async function NewProjectTransactionPage() {
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Add Project Transaction
        </h2>
        <p className="mt-1 text-slate-500">
          Record income, expense, capital, or profit entries for a project.
        </p>
      </div>

      <form
        action="/api/projects/transactions/create"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Project</label>
            <select
              name="projectId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id.toString()} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Transaction Type</label>
            <select
              name="transactionType"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select type</option>
              <option value="capital">Capital</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="profit_share">Profit Share</option>
              <option value="maintenance">Maintenance</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Payment Method</label>
            <select
              name="paymentMethod"
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
            <label className="mb-1 block text-sm font-medium">Reference No</label>
            <input
              name="referenceNo"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
}