import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ContributionsPage() {
  const contributions = await prisma.contribution.findMany({
    include: {
      member: {
        include: {
          user: true,
        },
      },
      category: true,
    },
    orderBy: {
      paymentDate: "desc",
    },
  });

  const totalAmount = contributions.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const confirmedCount = contributions.filter(
    (item) => item.status === "confirmed"
  ).length;

  const pendingCount = contributions.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Contributions</h2>
          <p className="mt-1 text-slate-500">
            Track member contributions and financial records.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/contributions/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Contribution
          </Link>

          <div className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow">
            Total Amount: KES {totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Records</p>
          <h3 className="mt-2 text-3xl font-bold">{contributions.length}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Confirmed</p>
          <h3 className="mt-2 text-3xl font-bold">{confirmedCount}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Pending</p>
          <h3 className="mt-2 text-3xl font-bold">{pendingCount}</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Contribution Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {contributions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No contributions found yet.
                  </td>
                </tr>
              ) : (
                contributions.map((item) => (
                  <tr
                    key={item.id.toString()}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{item.member.user.fullName}</td>
                    <td className="px-4 py-3">{item.member.user.phone}</td>
                    <td className="px-4 py-3">{item.category.name}</td>
                    <td className="px-4 py-3 font-medium">
                      KES {Number(item.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.paymentMethod}</td>
                    <td className="px-4 py-3">
                      {new Date(item.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/contributions/${item.id.toString()}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        View
                      </Link>
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