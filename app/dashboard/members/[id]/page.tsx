import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUserToken } from "@/lib/auth";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getCurrentUserToken();
  const canManage = ["super_admin", "admin"].includes(token?.role || "");

  const { id } = await params;

  const [member, roles, branches, directReferrals, sponsorRecord] = await Promise.all([
    prisma.memberProfile.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        branch: true,
        contributions: {
          include: {
            category: true,
          },
          orderBy: {
            paymentDate: "desc",
          },
        },
        welfareRequests: {
          orderBy: {
            createdAt: "desc",
          },
        },
        referralCode: true,
      },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.referral.findMany({
      where: { sponsorMemberId: BigInt(id) },
      include: {
        referred: {
          include: { user: true },
        },
      },
      orderBy: { joinedAt: "desc" },
    }),
    prisma.referral.findFirst({
      where: { referredMemberId: BigInt(id) },
      include: {
        sponsor: {
          include: { user: true },
        },
      },
    }),
  ]);

  if (!member) {
    notFound();
  }

  const totalContributions = member.contributions.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {member.user.fullName}
          </h2>
          <p className="mt-1 text-slate-500">Member Profile Details</p>
        </div>

        <Link
          href="/dashboard/members"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Members
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Member Number</p>
          <h3 className="mt-2 text-2xl font-bold">{member.memberNumber}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Total Contributions</p>
          <h3 className="mt-2 text-2xl font-bold">
            KES {totalContributions.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Branch</p>
          <h3 className="mt-2 text-2xl font-bold">{member.branch?.name ?? "-"}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Role</p>
          <h3 className="mt-2 text-2xl font-bold">{member.user.role.name}</h3>
        </div>
      </div>

      {canManage && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">Admin Update</h3>

            <form action="/api/members/update" method="POST" className="mt-4 space-y-4">
              <input type="hidden" name="memberId" value={member.id.toString()} />

              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select
                  name="roleId"
                  defaultValue={member.user.roleId.toString()}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  {roles.map((role) => (
                    <option key={role.id.toString()} value={role.id.toString()}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Branch</label>
                <select
                  name="branchId"
                  defaultValue={member.churchBranchId?.toString() ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  {branches.map((branch) => (
                    <option key={branch.id.toString()} value={branch.id.toString()}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Occupation</label>
                <input
                  name="occupation"
                  defaultValue={member.occupation ?? ""}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-red-700">Danger Zone</h3>

            <form action="/api/members/delete" method="POST" className="mt-4">
              <input type="hidden" name="userId" value={member.userId} />
              <button
                type="submit"
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
              >
                Delete Member
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Member Information</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Full Name:</span> {member.user.fullName}</p>
            <p><span className="font-semibold">Phone:</span> {member.user.phone}</p>
            <p><span className="font-semibold">Email:</span> {member.user.email ?? "-"}</p>
            <p><span className="font-semibold">Username:</span> {member.user.username ?? "-"}</p>
            <p><span className="font-semibold">Occupation:</span> {member.occupation ?? "-"}</p>
            <p><span className="font-semibold">Join Date:</span> {new Date(member.joinDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Referral Code:</span> {member.referralCode?.referralCode ?? "-"}</p>
            <p><span className="font-semibold">Invited By:</span> {sponsorRecord?.sponsor.user.fullName ?? "-"}</p>
            <p><span className="font-semibold">Direct Referrals:</span> {directReferrals.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Direct Referral Tree</h3>
          <div className="mt-4 space-y-3 text-sm">
            {directReferrals.length === 0 ? (
              <p className="text-slate-500">No direct referrals yet.</p>
            ) : (
              directReferrals.map((ref) => (
                <div key={ref.id.toString()} className="rounded-xl bg-slate-50 px-4 py-3">
                  {member.user.fullName} → {ref.referred.user.fullName}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">Recent Contributions</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {member.contributions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No contributions recorded.
                  </td>
                </tr>
              ) : (
                member.contributions.map((item) => (
                  <tr key={item.id.toString()} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.category.name}</td>
                    <td className="px-4 py-3">KES {Number(item.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.paymentMethod}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">
                      {new Date(item.paymentDate).toLocaleDateString()}
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