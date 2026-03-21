import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const status = params.status?.trim() || "";

  const members = await prisma.memberProfile.findMany({
    where: {
      user: {
        status: {
          not: "archived",
        },
      },
      ...(status ? { membershipStatus: status as any } : {}),
      ...(q
        ? {
            OR: [
              { memberNumber: { contains: q, mode: "insensitive" } },
              { occupation: { contains: q, mode: "insensitive" } },
              { user: { fullName: { contains: q, mode: "insensitive" } } },
              { user: { phone: { contains: q, mode: "insensitive" } } },
              { user: { email: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      user: true,
      branch: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalMembers = members.length;
  const activeMembers = members.filter(
    (member) => member.membershipStatus === "active"
  ).length;
  const pendingMembers = members.filter(
    (member) => member.membershipStatus === "pending"
  ).length;
  const totalBranches = new Set(
    members.map((member) => member.branch?.name).filter(Boolean)
  ).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Members</h2>
          <p className="mt-1 text-slate-500">
            Manage registered members in the platform.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/members/new"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add New Member
          </Link>

          <div className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow">
            Total Members: {totalMembers}
          </div>
        </div>
      </div>

      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone, email, member no..."
          className="rounded-xl border border-slate-300 px-4 py-3"
        />

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="exited">Exited</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
        >
          Filter Members
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Registered Members</p>
          <h3 className="mt-2 text-3xl font-bold">{totalMembers}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Active Members</p>
          <h3 className="mt-2 text-3xl font-bold">{activeMembers}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Branches Covered</p>
          <h3 className="mt-2 text-3xl font-bold">{totalBranches}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Pending Approval</p>
          <h3 className="mt-2 text-3xl font-bold">{pendingMembers}</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Member Directory
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Member No.</th>
                <th className="px-4 py-3 font-semibold">Full Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Branch</th>
                <th className="px-4 py-3 font-semibold">Occupation</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No members found yet.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id.toString()}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {member.memberNumber}
                    </td>
                    <td className="px-4 py-3">{member.user.fullName}</td>
                    <td className="px-4 py-3">{member.user.phone}</td>
                    <td className="px-4 py-3">{member.user.email ?? "-"}</td>
                    <td className="px-4 py-3">{member.branch?.name ?? "-"}</td>
                    <td className="px-4 py-3">{member.occupation ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          member.membershipStatus === "active"
                            ? "bg-green-100 text-green-700"
                            : member.membershipStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/members/${member.id.toString()}`}
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