import { prisma } from "@/lib/prisma";

export async function registerReferral(sponsorId: number, newMemberId: number) {
  await prisma.referral.create({
    data: {
      sponsorMemberId: sponsorId,
      referredMemberId: newMemberId,
      status: "active",
    },
  });
}