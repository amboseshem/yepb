import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const [
    totalMembers,
    totalContributions,
    totalProjects,
    totalWelfareRequests,
    totalTrainings,
    totalReferrals,
    totalCommissions,
  ] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.contribution.count(),
    prisma.project.count(),
    prisma.welfareRequest.count(),
    prisma.training.count(),
    prisma.referral.count(),
    prisma.commission.count(),
  ]);

  const contributionSum = await prisma.contribution.aggregate({
    _sum: { amount: true },
  });

  const projectBudgetSum = await prisma.project.aggregate({
    _sum: { budgetAmount: true },
  });

  const welfareAmountSum = await prisma.welfareRequest.aggregate({
    _sum: { amountRequested: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Reports</h2>
        <p className="mt-1 text-slate-500">
          High-level reporting across members, finances, projects, welfare,
          training, and MLM.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Members</p>
          <h3 className="mt-2 text-3xl font-bold">{totalMembers}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Contributions</p>
          <h3 className="mt-2 text-3xl font-bold">{totalContributions}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Projects</p>
          <h3 className="mt-2 text-3xl font-bold">{totalProjects}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Welfare Requests</p>
          <h3 className="mt-2 text-3xl font-bold">{totalWelfareRequests}</h3>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Financial Totals</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              <span className="font-semibold">Contribution Amount:</span> KES{" "}
              {Number(contributionSum._sum.amount || 0).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Project Budget:</span> KES{" "}
              {Number(projectBudgetSum._sum.budgetAmount || 0).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Welfare Requested:</span> KES{" "}
              {Number(welfareAmountSum._sum.amountRequested || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">Growth Metrics</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-semibold">Training Records:</span> {totalTrainings}</p>
            <p><span className="font-semibold">Referrals:</span> {totalReferrals}</p>
            <p><span className="font-semibold">Commissions:</span> {totalCommissions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}