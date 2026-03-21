import { prisma } from "@/lib/prisma";

export default async function MlmPage() {
  const [referralCodes, referrals, commissionPlans, commissions, earningsWallets] =
    await Promise.all([
      prisma.referralCode.count(),
      prisma.referral.count(),
      prisma.commissionPlan.count(),
      prisma.commission.findMany(),
      prisma.wallet.findMany({
        where: {
          walletType: "earnings_wallet",
        },
      }),
    ]);

  const totalCommissionAmount = commissions.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalEarningsBalance = earningsWallets.reduce(
    (sum, item) => sum + Number(item.balance),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">MLM Summary</h2>
        <p className="mt-1 text-slate-500">
          Referral, commission, and earnings overview for future MLM growth.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl bg-blue-600 p-5 text-white shadow">
          <p className="text-sm text-blue-100">Referral Codes</p>
          <h3 className="mt-2 text-3xl font-bold">{referralCodes}</h3>
        </div>

        <div className="rounded-2xl bg-green-600 p-5 text-white shadow">
          <p className="text-sm text-green-100">Referrals</p>
          <h3 className="mt-2 text-3xl font-bold">{referrals}</h3>
        </div>

        <div className="rounded-2xl bg-purple-600 p-5 text-white shadow">
          <p className="text-sm text-purple-100">Commission Plans</p>
          <h3 className="mt-2 text-3xl font-bold">{commissionPlans}</h3>
        </div>

        <div className="rounded-2xl bg-red-600 p-5 text-white shadow">
          <p className="text-sm text-red-100">Total Commissions</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalCommissionAmount.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-800 p-5 text-white shadow">
          <p className="text-sm text-slate-300">Earnings Wallet Balance</p>
          <h3 className="mt-2 text-3xl font-bold">
            KES {totalEarningsBalance.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800">MLM Readiness</h3>
        <p className="mt-3 text-slate-600">
          The backend foundation for MLM is now ready: referral codes, referral
          links, commission plans, commissions, earnings wallets, and API
          support are in place. What remains is deeper automation and front-end
          management workflows.
        </p>
      </div>
    </div>
  );
}