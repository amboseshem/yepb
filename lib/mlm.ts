import { prisma } from "@/lib/prisma";

export async function processReferral(newMemberId: number, refCode: string) {
  const ref = await prisma.referralCode.findUnique({
    where: { referralCode: refCode }, // ✅ FIXED
  });

  if (!ref) return;

  // create referral record
  await prisma.referral.create({
    data: {
      sponsorMemberId: ref.memberId,
      referredMemberId: newMemberId,
      status: "active",
    },
  });

  // give commission
  await prisma.commission.create({
    data: {
      memberId: ref.memberId,
      amount: 100,
      status: "approved",
    },
  });
}