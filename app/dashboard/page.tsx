import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
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
          include: {
            user: true,
          },
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
    _sum: {
      amount: true,
    },
  });

  const totalContributionAmount = Number(contributionSum._sum.amount || 0);

  return (
    <div className="space-y-8">
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
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg">
          <p className="text-sm text-blue-100">Total Members</p>
          <h3 className="mt-3 text-4xl font-bold">{totalMembers}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-6 text-white shadow-lg">
          <p className="text-sm text-green-100">Total Contributions</p>
          <h3 className="mt-3 text-4xl font-bold">{totalContributions}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-6 text-white shadow-lg">
          <p className="text-sm text-purple-100">Active Projects</p>
          <h3 className="mt-3 text-4xl font-bold">{activeProjects}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-6 text-white shadow-lg">
          <p className="text-sm text-red-100">Pending Contributions</p>
          <h3 className="mt-3 text-4xl font-bold">{pendingContributions}</h3>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-semibold text-slate-800">Platform Summary</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Active Members</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-800">
                {activeMembers}
              </h4>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total Contribution Amount</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-800">
                KES {totalContributionAmount.toLocaleString()}
              </h4>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Projects Recorded</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-800">
                {totalProjects}
              </h4>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Contribution Categories</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-800">
                {totalCategories}
              </h4>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Quick Links</h3>

          <div className="mt-5 space-y-3">
            <Link
              href="/dashboard/members"
              className="block rounded-xl bg-blue-50 px-4 py-3 font-medium text-blue-700 hover:bg-blue-100"
            >
              Manage Members
            </Link>

            <Link
              href="/dashboard/contributions"
              className="block rounded-xl bg-green-50 px-4 py-3 font-medium text-green-700 hover:bg-green-100"
            >
              View Contributions
            </Link>

            <Link
              href="/dashboard/projects"
              className="block rounded-xl bg-purple-50 px-4 py-3 font-medium text-purple-700 hover:bg-purple-100"
            >
              Manage Projects
            </Link>

            <Link
              href="/dashboard/welfare"
              className="block rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100"
            >
              Welfare Section
            </Link>

            <Link
              href="/dashboard/training"
              className="block rounded-xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700 hover:bg-indigo-100"
            >
              Training Section
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Recent Members</h3>
          <div className="mt-4 space-y-4">
            {recentMembers.length === 0 ? (
              <p className="text-slate-500">No recent members yet.</p>
            ) : (
              recentMembers.map((member) => (
                <div key={member.id.toString()} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {member.user.fullName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {member.user.phone} • {member.branch?.name ?? "-"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">
            Recent Contributions
          </h3>
          <div className="mt-4 space-y-4">
            {recentContributions.length === 0 ? (
              <p className="text-slate-500">No recent contributions yet.</p>
            ) : (
              recentContributions.map((item) => (
                <div key={item.id.toString()} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {item.member.user.fullName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.category.name} • KES {Number(item.amount).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Recent Projects</h3>
          <div className="mt-4 space-y-4">
            {recentProjects.length === 0 ? (
              <p className="text-slate-500">No recent projects yet.</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id.toString()} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">{project.name}</p>
                  <p className="text-sm text-slate-500">
                    {project.projectType ?? "-"} • {project.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}