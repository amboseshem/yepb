import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUserToken } from "@/lib/auth";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getCurrentUserToken();
  const canManage = ["super_admin", "admin"].includes(token?.role || "");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      transactions: {
        orderBy: {
          transactionDate: "desc",
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const totalIncome = project.transactions
    .filter((item) => item.transactionType === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = project.transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{project.name}</h2>
          <p className="mt-1 text-slate-500">Project Details and Transactions</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/projects"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← Back to Projects
          </Link>

          <Link
            href="/dashboard/projects/transactions/new"
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            + Add Transaction
          </Link>
        </div>
      </div>

      {canManage && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Admin Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {project.status === "pending_approval" && (
              <form action="/api/projects/status" method="POST">
                <input type="hidden" name="projectId" value={project.id.toString()} />
                <input type="hidden" name="status" value="active" />
                <button className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700">
                  Approve Project
                </button>
              </form>
            )}

            {project.status !== "archived" && (
              <form action="/api/projects/status" method="POST">
                <input type="hidden" name="projectId" value={project.id.toString()} />
                <input type="hidden" name="status" value="cancelled" />
                <button className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">
                  Archive Project
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Budget</p>
          <h3 className="mt-2 text-2xl font-bold">
            KES {Number(project.budgetAmount || 0).toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Total Income</p>
          <h3 className="mt-2 text-2xl font-bold">
            KES {totalIncome.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Total Expense</p>
          <h3 className="mt-2 text-2xl font-bold">
            KES {totalExpense.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Status</p>
          <h3 className="mt-2 text-2xl font-bold">{project.status}</h3>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Project Info</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Code:</span> {project.code ?? "-"}</p>
            <p><span className="font-semibold">Type:</span> {project.projectType ?? "-"}</p>
            <p><span className="font-semibold">Location:</span> {project.location ?? "-"}</p>
            <p><span className="font-semibold">Capital:</span> KES {Number(project.capitalAmount || 0).toLocaleString()}</p>
            <p><span className="font-semibold">Start Date:</span> {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</p>
            <p><span className="font-semibold">Expected End Date:</span> {project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : "-"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Description</h3>
          <p className="mt-4 text-sm text-slate-600">
            {project.description ?? "No description provided."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">Recent Transactions</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {project.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                project.transactions.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.transactionType}</td>
                    <td className="px-4 py-3">KES {Number(item.amount).toLocaleString()}</td>
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