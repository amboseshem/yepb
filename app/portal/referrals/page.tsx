import { prisma } from "@/lib/prisma";

export default async function PortalReferralsPage() {
  const codes = await prisma.referralCode.findMany({
    include: {
      member: {
        include: {
          user: true,
        },
      },
      referrals: {
        include: {
          referred: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Member Referrals</h1>
          <p className="mt-2 text-slate-500">
            Referral codes and direct network summary.
          </p>
        </div>

        <div className="space-y-6">
          {codes.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              No referral codes found yet.
            </div>
          ) : (
            codes.map((item) => (
              <div
                key={item.id.toString()}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-800">
                  {item.member.user.fullName}
                </h2>
                <p className="mt-2 text-slate-600">
                  Code: <span className="font-semibold">{item.referralCode}</span>
                </p>
                <p className="mt-1 text-slate-500">
                  Link: {item.referralLink ?? "-"}
                </p>

                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Direct Referrals
                  </h3>

                  <div className="mt-3 space-y-2">
                    {item.referrals.length === 0 ? (
                      <p className="text-slate-500">No direct referrals yet.</p>
                    ) : (
                      item.referrals.map((ref) => (
                        <div
                          key={ref.id.toString()}
                          className="rounded-xl bg-slate-50 px-4 py-3"
                        >
                          {ref.referred.user.fullName}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}