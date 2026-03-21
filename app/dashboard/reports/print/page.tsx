import { prisma } from "@/lib/prisma";
import PrintButton from "@/components/PrintButton";

export default async function PrintReportsPage() {
  const [members, contributions, projects, welfare, referrals, commissions, settings] =
    await Promise.all([
      prisma.memberProfile.count(),
      prisma.contribution.count(),
      prisma.project.count(),
      prisma.welfareRequest.count(),
      prisma.referral.count(),
      prisma.commission.count(),
      prisma.systemSetting.findMany(),
    ]);

  const contributionSum = await prisma.contribution.aggregate({
    _sum: { amount: true },
  });

  const projectBudgetSum = await prisma.project.aggregate({
    _sum: { budgetAmount: true },
  });

  const getSetting = (key: string) =>
    settings.find((s) => s.settingKey === key)?.settingValue || "";

  return (
    <main className="mx-auto max-w-5xl space-y-8 bg-white p-8 text-slate-900">
      <div className="mb-6 flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-4xl font-black text-white shadow-xl">
            Y
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {getSetting("platform_name") || "Youth Empowerment Platform"}
            </h1>
            <p className="text-slate-500">
              P.O. Box: {getSetting("po_box") || "-"} • KRA PIN: {getSetting("kra_pin") || "-"}
            </p>
            <p className="text-slate-500">
              Phone: {getSetting("company_phone") || "-"} • Email: {getSetting("company_email") || "-"}
            </p>
            <p className="text-slate-500">
              Bank: {getSetting("bank_name") || "-"} • Acc: {getSetting("bank_account_number") || "-"}
            </p>
          </div>
        </div>

        <PrintButton />
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-purple-700 to-red-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">Youth Empowerment Platform Report</h1>
        <p className="mt-2 text-white/90">
          Official printable colored summary report
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Members</h3>
          <p className="mt-2 text-3xl font-bold">{members}</p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Contributions</h3>
          <p className="mt-2 text-3xl font-bold">{contributions}</p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Projects</h3>
          <p className="mt-2 text-3xl font-bold">{projects}</p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Welfare Requests</h3>
          <p className="mt-2 text-3xl font-bold">{welfare}</p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Referrals</h3>
          <p className="mt-2 text-3xl font-bold">{referrals}</p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Commissions</h3>
          <p className="mt-2 text-3xl font-bold">{commissions}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Total Contribution Amount</h3>
          <p className="mt-2 text-3xl font-bold">
            KES {Number(contributionSum._sum.amount || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Total Project Budget</h3>
          <p className="mt-2 text-3xl font-bold">
            KES {Number(projectBudgetSum._sum.budgetAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border p-5">
        <h3 className="text-xl font-semibold">Prepared By</h3>
        <p className="mt-3 text-slate-600">
          Generated from Youth Empowerment Platform records for administration and printing.
        </p>
      </div>
    </main>
  );
}