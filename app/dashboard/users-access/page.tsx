import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function UsersAccessPage() {
  await requireRole(["super_admin", "admin"]);

  const users = await prisma.user.findMany({
    include: {
      role: true,
      appAccess: true,
      memberProfile: {
        include: {
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
        <h2 className="text-3xl font-bold text-slate-800">Users & Access</h2>
        <p className="mt-1 text-slate-500">
          View users, roles, archive members, delete members, and reset passwords.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">User Access Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Branch</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Access Count</th>
                <th className="px-4 py-3 font-semibold">Reset Password</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">{user.role.name}</td>
                    <td className="px-4 py-3">
                      {user.memberProfile?.branch?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3">{user.status}</td>
                    <td className="px-4 py-3">{user.appAccess.length}</td>

                    <td className="px-4 py-3">
                      <form
                        action="/api/users/reset-password"
                        method="POST"
                        className="space-y-2"
                      >
                        <input type="hidden" name="userId" value={user.id} />
                        <input
                          name="newPassword"
                          placeholder="New password"
                          className="w-40 rounded-lg border border-slate-300 px-3 py-2"
                          required
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                        >
                          Reset Password
                        </button>
                      </form>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {user.memberProfile && (
                          <a
                            href={`/dashboard/members/${user.memberProfile.id.toString()}`}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            View
                          </a>
                        )}

                        <form action="/api/members/archive" method="POST">
                          <input type="hidden" name="userId" value={user.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-yellow-600 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-700"
                          >
                            Archive
                          </button>
                        </form>

                        <form action="/api/members/delete" method="POST">
                          <input type="hidden" name="userId" value={user.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
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