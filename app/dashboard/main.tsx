import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardMain() {
  const [
    totalMembers,
    totalContributions,
    totalProjects,
    totalCategories,
    activeMembers,
    activeProjects,
    pendingContributions,
    recentMembers,
    recentContributions,
    recentProjects,
  ] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.contribution.count(),
    prisma.project.count(),
    prisma.contributionCategory.count(),
    prisma.memberProfile.count({
      where: { membershipStatus: "active" },
    }),
    prisma.project.count({
      where: { status: "active" },
    }),
    prisma.contribution.count({
      where: { status: "pending" },
    }),
    prisma.memberProfile.findMany({
      include: { user: true, branch: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contribution.findMany({
      include: {
        member: {
          include: { user: true },
        },
        category: true,
      },
      orderBy: { paymentDate: "desc" },
      take: 5,
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const contributionSum = await prisma.contribution.aggregate({
    _sum: { amount: true },
  });

  const totalContributionAmount = Number(
    contributionSum._sum.amount || 0
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-purple-700 to-red-600 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
              Welcome Back
            </p>
            <h2 className="text-4xl font-bold leading-tight">
              Youth Empowerment Platform Dashboard
            </h2>
            <p className="mt-4 text-white/90">
              Monitor members, contributions, projects, welfare support, and
              training systems from one central administration portal.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/members/new"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-slate-100"
            >
              + Add Member
            </Link>

            <Link
              href="/dashboard/contributions/new"
              className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-green-700"
            >
              + Add Contribution
            </Link>

            <Link
              href="/dashboard/projects/new"
              className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-purple-700"
            >
              + Add Project
            </Link>

            {/* ✅ PRINT BUTTON ADDED */}
            <a
              href="/api/receipt"
              target="_blank"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Print Report
            </a>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg">
          <p className="text-sm text-blue-100">Total Members</p>
          <h3 className="mt-3 text-4xl font-bold">{totalMembers}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-6 text-white shadow-lg">
          <p className="text-sm text-green-100">Total Contributions</p>
          <h3 className="mt-3 text-4xl font-bold">
            {totalContributions}
          </h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-6 text-white shadow-lg">
          <p className="text-sm text-purple-100">Active Projects</p>
          <h3 className="mt-3 text-4xl font-bold">
            {activeProjects}
          </h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-6 text-white shadow-lg">
          <p className="text-sm text-red-100">
            Pending Contributions
          </p>
          <h3 className="mt-3 text-4xl font-bold">
            {pendingContributions}
          </h3>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-semibold">Platform Summary</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="bg-slate-50 p-5 rounded-2xl">
              <p>Active Members</p>
              <h4 className="text-3xl font-bold">{activeMembers}</h4>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p>Total Contribution Amount</p>
              <h4 className="text-3xl font-bold">
                KES {totalContributionAmount.toLocaleString()}
              </h4>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p>Projects</p>
              <h4 className="text-3xl font-bold">{totalProjects}</h4>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p>Categories</p>
              <h4 className="text-3xl font-bold">{totalCategories}</h4>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Quick Links</h3>

          <div className="mt-5 space-y-3">
            <Link href="/dashboard/members">Members</Link>
            <Link href="/dashboard/contributions">Contributions</Link>
            <Link href="/dashboard/projects">Projects</Link>
            <Link href="/dashboard/training">Training</Link>
          </div>
        </div>
      </div>

      {/* RECENT */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold">Recent Members</h3>
          {recentMembers.map((m) => (
            <div key={m.id.toString()}>
              {m.user.fullName}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold">Recent Contributions</h3>
          {recentContributions.map((c) => (
            <div key={c.id.toString()}>
              {c.member.user.fullName} - KES{" "}
              {Number(c.amount).toLocaleString()}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold">Recent Projects</h3>
          {recentProjects.map((p) => (
            <div key={p.id.toString()}>{p.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}