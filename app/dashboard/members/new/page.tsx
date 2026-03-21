import { prisma } from "@/lib/prisma";

export default async function NewMemberPage() {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
  });

  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Add Member</h2>
        <p className="mt-1 text-slate-500">
          Register a new member and create a login-ready account.
        </p>
      </div>

      <form
        action="/api/members/create"
        method="POST"
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              name="fullName"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              name="phone"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              name="username"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Temporary Password</label>
            <input
              name="password"
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Occupation</label>
            <input
              name="occupation"
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Branch</label>
            <select
              name="branchId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch.id.toString()} value={branch.id.toString()}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select
              name="roleId"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id.toString()} value={role.id.toString()}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Member
          </button>
        </div>
      </form>
    </div>
  );
}