import { prisma } from "@/lib/prisma";

export default async function ReferralsPage() {
  const referrals = await prisma.referral.findMany({
    include: {
      sponsor: {
        include: {
          user: true,
        },
      },
      referred: {
        include: {
          user: true,
        },
      },
      referralCode: true,
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Referrals</h2>
        <p className="mt-1 text-slate-500">
          Track who invited who across the referral tree.
        </p>
      </div>

      <div className="space-y-4">
        {referrals.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No referrals found yet.
          </div>
        ) : (
          referrals.map((item) => (
            <div
              key={item.id.toString()}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-800">
                {item.referred.user.fullName}
              </h3>
              <p className="mt-2 text-slate-600">
                Invited by <span className="font-semibold">{item.sponsor.user.fullName}</span>
              </p>
              <p className="mt-1 text-slate-500">
                Referral Code: {item.referralCode?.referralCode ?? "-"} • Level: {item.level}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}