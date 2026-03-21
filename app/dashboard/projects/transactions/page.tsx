import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectTransactionsPage() {
  const transactions = await prisma.projectTransaction.findMany({
    include: {
      project: true,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });

  const totalIncome = transactions
    .filter((item) => item.transactionType === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Project Transactions
          </h2>
          <p className="mt-1 text-slate-500">
            Record and monitor income, expenses, and capital for projects.
          </p>
        </div>

        <Link
          href="/dashboard/projects/transactions/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          + Add Transaction
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Total Income</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalIncome.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Total Expense</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalExpense.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Net Balance</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {(totalIncome - totalExpense).toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Transaction Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr
                    key={item.id.toString()}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{item.project.name}</td>
                    <td className="px-4 py-3">{item.transactionType}</td>
                    <td className="px-4 py-3 font-medium">
                      KES {Number(item.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.paymentMethod ?? "-"}</td>
                    <td className="px-4 py-3">{item.referenceNo ?? "-"}</td>
                    <td className="px-4 py-3">
                      {new Date(item.transactionDate).toLocaleDateString()}
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