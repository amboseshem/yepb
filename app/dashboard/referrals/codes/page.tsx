import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ReferralCodesPage() {
  const codes = await prisma.referralCode.findMany({
    include: {
      member: {
        include: {
          user: true,
          branch: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Referral Codes</h2>
          <p className="mt-1 text-slate-500">
            View QR, join link, and profile link for each referral code.
          </p>
        </div>

        <Link
          href="/dashboard/referrals/generate"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Generate Code
        </Link>
      </div>

      <div className="space-y-6">
        {codes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No referral codes found yet.
          </div>
        ) : (
          codes.map((item) => {
            const joinLink = item.referralLink || `/join?ref=${item.referralCode}`;
            const profileLink = `/dashboard/members/${item.memberId.toString()}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(joinLink)}`;

            return (
              <div
                key={item.id.toString()}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_180px]">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800">
                      {item.member.user.fullName}
                    </h3>
                    <p className="text-slate-500">
                      Branch: {item.member.branch?.name ?? "-"}
                    </p>
                    <p><span className="font-semibold">Code:</span> {item.referralCode}</p>
                    <p><span className="font-semibold">Join Link:</span> {joinLink}</p>
                    <p><span className="font-semibold">Profile Link:</span> {profileLink}</p>
                  </div>

                  <div className="rounded-2xl border p-4 text-center">
                    <img src={qrUrl} alt="Referral QR" className="mx-auto h-36 w-36" />
                    <p className="mt-3 text-sm text-slate-500">QR for join link</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}