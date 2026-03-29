import { prisma } from "@/lib/prisma";

export async function processReferral(newMemberId: number, refCode: string) {
  const ref = await prisma.referralCode.findUnique({
    where: { referralCode: refCode },
  });

  if (!ref) return;

  // LEVEL 1
  await prisma.commission.create({
    data: {
      memberId: ref.memberId,
      amount: 100,
      status: "pending",
    },
  });

  // LEVEL 2
  const parent = await prisma.referral.findFirst({
    where: { referredMemberId: ref.memberId },
  });

  if (parent) {
    await prisma.commission.create({
      data: {
        memberId: parent.sponsorMemberId,
        amount: 50,
        status: "pending",
      },
    });
  }

  await prisma.referral.create({
    data: {
      sponsorMemberId: ref.memberId,
      referredMemberId: newMemberId,
      status: "pending",
    },
  });
}