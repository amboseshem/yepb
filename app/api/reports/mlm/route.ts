import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [referrals, commissions, referralCodes, wallets] = await Promise.all([
      prisma.referral.findMany({
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
        },
        orderBy: {
          joinedAt: "desc",
        },
      }),
      prisma.commission.findMany({
        include: {
          member: {
            include: {
              user: true,
            },
          },
          sourceMember: {
            include: {
              user: true,
            },
          },
          commissionPlan: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      }),
      prisma.referralCode.findMany({
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      }),
      prisma.wallet.findMany({
        where: {
          walletType: "earnings_wallet",
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        referrals,
        commissions,
        referralCodes,
        wallets,
      },
    });
  } catch (error) {
    console.error("MLM REPORT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch MLM report." },
      { status: 500 }
    );
  }
}