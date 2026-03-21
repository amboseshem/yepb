import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserToken } from "@/lib/auth";

export default async function WelfarePage() {
  const token = await getCurrentUserToken();
  const canManage = ["super_admin", "admin", "treasurer"].includes(token?.role || "");

  const requests = await prisma.welfareRequest.findMany({
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

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(
    (item) => item.status === "pending" || item.status === "under_review"
  ).length;
  const approvedRequests = requests.filter(
    (item) => item.status === "approved" || item.status === "disbursed"
  ).length;
  const totalRequestedAmount = requests.reduce(
    (sum, item) => sum + Number(item.amountRequested || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Welfare</h2>
          <p className="mt-1 text-slate-500">
            Manage welfare and support requests from members.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/welfare/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Welfare Request
          </Link>

          <Link
            href="/dashboard/welfare/disburse"
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
          >
            Disburse Approved
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Total Requests</p>
          <h3 className="mt-2 text-3xl font-bold">{totalRequests}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Pending Review</p>
          <h3 className="mt-2 text-3xl font-bold">{pendingRequests}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Approved</p>
          <h3 className="mt-2 text-3xl font-bold">{approvedRequests}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Requested Amount</p>
          <h3 className="mt-2 text-3xl font-bold">
            {totalRequestedAmount.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Welfare Requests
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Branch</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                {canManage && <th className="px-4 py-3 font-semibold">Action</th>}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No welfare requests found yet.
                  </td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">{item.member.user.fullName}</td>
                    <td className="px-4 py-3">{item.member.branch?.name ?? "-"}</td>
                    <td className="px-4 py-3">{item.requestType}</td>
                    <td className="px-4 py-3">{item.title}</td>
                    <td className="px-4 py-3 font-medium">
                      KES {Number(item.amountRequested || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{item.status}</td>
                    {canManage && (
                      <td className="px-4 py-3">
                        {item.status === "under_review" || item.status === "pending" ? (
                          <div className="flex gap-2">
                            <form action="/api/welfare/status" method="POST">
                              <input type="hidden" name="welfareRequestId" value={item.id.toString()} />
                              <input type="hidden" name="status" value="approved" />
                              <button className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">
                                Approve
                              </button>
                            </form>

                            <form action="/api/welfare/status" method="POST">
                              <input type="hidden" name="welfareRequestId" value={item.id.toString()} />
                              <input type="hidden" name="status" value="cancelled" />
                              <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
                                Cancel
                              </button>
                            </form>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
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