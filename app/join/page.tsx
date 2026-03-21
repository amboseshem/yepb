import { prisma } from "@/lib/prisma";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref || "";

  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">Join the Platform</h1>
          <p className="mt-2 text-slate-500">
            Register as a new member and connect to the empowerment network.
          </p>
        </div>

        <form
          action="/api/public/join"
          method="POST"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="referralCode" value={ref} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input
                name="fullName"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                name="phone"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Occupation</label>
              <input
                name="occupation"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Choose Branch</label>
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

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Referral Code</label>
              <input
                value={ref}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Submit Join Request
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}