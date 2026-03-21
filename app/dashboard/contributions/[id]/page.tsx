import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUserToken } from "@/lib/auth";

export default async function ContributionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getCurrentUserToken();
  const canManage = ["super_admin", "admin"].includes(token?.role || "");

  const { id } = await params;

  const contribution = await prisma.contribution.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      member: {
        include: {
          user: true,
          branch: true,
        },
      },
      category: true,
      allocations: true,
    },
  });

  if (!contribution) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Contribution Details
          </h2>
          <p className="mt-1 text-slate-500">
            Financial record information
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/contributions"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← Back to Contributions
          </Link>

          <a
            href={`/dashboard/contributions/receipt/${contribution.id.toString()}`}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Download Receipt
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Amount</p>
          <h3 className="mt-2 text-2xl font-bold">
            KES {Number(contribution.amount).toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Status</p>
          <h3 className="mt-2 text-2xl font-bold">{contribution.status}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Category</p>
          <h3 className="mt-2 text-2xl font-bold">{contribution.category.name}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Method</p>
          <h3 className="mt-2 text-2xl font-bold">{contribution.paymentMethod}</h3>
        </div>
      </div>

      {canManage && (
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-red-700">Admin Actions</h3>
          <form action="/api/contributions/cancel" method="POST" className="mt-4">
            <input
              type="hidden"
              name="contributionId"
              value={contribution.id.toString()}
            />
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Cancel / Unapprove Contribution
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Contribution Info</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Reference:</span> {contribution.transactionReference ?? "-"}</p>
            <p><span className="font-semibold">Date:</span> {new Date(contribution.paymentDate).toLocaleString()}</p>
            <p><span className="font-semibold">Receipt Number:</span> {contribution.receiptNumber ?? "-"}</p>
            <p><span className="font-semibold">Notes:</span> {contribution.notes ?? "-"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Member Info</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Name:</span> {contribution.member.user.fullName}</p>
            <p><span className="font-semibold">Phone:</span> {contribution.member.user.phone}</p>
            <p><span className="font-semibold">Email:</span> {contribution.member.user.email ?? "-"}</p>
            <p><span className="font-semibold">Branch:</span> {contribution.member.branch?.name ?? "-"}</p>
            <p><span className="font-semibold">Member Number:</span> {contribution.member.memberNumber}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">Allocations</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Destination</th>
              </tr>
            </thead>
            <tbody>
              {contribution.allocations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No allocations recorded.
                  </td>
                </tr>
              ) : (
                contribution.allocations.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.allocationType}</td>
                    <td className="px-4 py-3">{item.percentage?.toString() ?? "-"}</td>
                    <td className="px-4 py-3">KES {Number(item.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.destinationReference ?? "-"}</td>
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