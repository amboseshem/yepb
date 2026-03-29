import { prisma } from "@/lib/prisma";

export async function processReferral(newMemberId: number, refCode: string) {
  const ref = await prisma.referralCode.findUnique({
    where: { referralCode: refCode },
  });

  if (!ref) return;

  // ✅ GET DEFAULT COMMISSION PLAN
  const plan = await prisma.commissionPlan.findFirst();

  if (!plan) {
    console.error("No commission plan found");
    return;
  }

  // LEVEL 1 (100)
  await prisma.commission.create({
    data: {
      memberId: ref.memberId,
      amount: 100,
      status: "pending",
      commissionPlanId: plan.id, // ✅ FIXED
    },
  });

  // LEVEL 2 (50)
  const parent = await prisma.referral.findFirst({
    where: { referredMemberId: ref.memberId },
  });

  if (parent) {
    await prisma.commission.create({
      data: {
        memberId: parent.sponsorMemberId,
        amount: 50,
        status: "pending",
        commissionPlanId: plan.id, // ✅ FIXED
      },
    });
  }

  // SAVE RELATION
  await prisma.referral.create({
    data: {
      sponsorMemberId: ref.memberId,
      referredMemberId: newMemberId,
      status: "pending",
    },
  });
}