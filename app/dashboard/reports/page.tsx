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
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Reports</h2>
          <p className="mt-1 text-slate-500">
            Full system analytics overview
          </p>
        </div>

        {/* ✅ PRINT BUTTON (CORRECT PLACE) */}
        <a
          href="/api/receipt"
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
        >
          Print PDF
        </a>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          Members
          <h3 className="text-3xl font-bold">{totalMembers}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          Contributions
          <h3 className="text-3xl font-bold">{totalContributions}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          Projects
          <h3 className="text-3xl font-bold">{totalProjects}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          Welfare
          <h3 className="text-3xl font-bold">{totalWelfareRequests}</h3>
        </div>
      </div>

      {/* FINANCIAL */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h3 className="font-bold mb-3">Financial Summary</h3>

        <p>
          Contributions: KES{" "}
          {Number(contributionSum._sum.amount || 0).toLocaleString()}
        </p>

        <p>
          Project Budget: KES{" "}
          {Number(projectBudgetSum._sum.budgetAmount || 0).toLocaleString()}
        </p>

        <p>
          Welfare: KES{" "}
          {Number(welfareAmountSum._sum.amountRequested || 0).toLocaleString()}
        </p>
      </div>

      {/* MLM */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h3 className="font-bold mb-3">Growth Metrics</h3>

        <p>Trainings: {totalTrainings}</p>
        <p>Referrals: {totalReferrals}</p>
        <p>Commissions: {totalCommissions}</p>
      </div>
    </div>
  );
}