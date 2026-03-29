import { prisma } from "@/lib/prisma";

export async function processReferral(newMemberId: number, refCode: string) {
  const ref = await prisma.referralCode.findUnique({
    where: { referralCode: refCode },
  });

  if (!ref) return;

  // LEVEL 1 (100)
  await prisma.commission.create({
    data: {
      memberId: ref.memberId,
      amount: 100,
      status: "pending",
    },
  });

  // LEVEL 2 (50)
  const parentRef = await prisma.referral.findFirst({
    where: { referredMemberId: ref.memberId },
  });

  if (parentRef) {
    await prisma.commission.create({
      data: {
        memberId: parentRef.sponsorMemberId,
        amount: 50,
        status: "pending",
      },
    });
  }

  // SYSTEM RETAINS 350 (no DB needed unless you want ledger)

  // SAVE REFERRAL RELATION
  await prisma.referral.create({
    data: {
      sponsorMemberId: ref.memberId,
      referredMemberId: newMemberId,
      status: "pending",
    },
  });
}