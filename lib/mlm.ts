import { prisma } from "@/lib/prisma";

export async function processReferral(newMemberId: number, refCode: string) {
  const ref = await prisma.referralCode.findUnique({
    where: { code: refCode },
  });

  if (!ref) return;

  await prisma.referral.create({
    data: {
      sponsorMemberId: ref.memberId,
      referredMemberId: newMemberId,
    },
  });

  await prisma.commission.create({
    data: {
      memberId: ref.memberId,
      amount: 100,
      status: "approved",
    },
  });
}