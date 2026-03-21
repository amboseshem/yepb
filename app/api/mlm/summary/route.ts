import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalReferralCodes,
      totalReferrals,
      totalCommissionPlans,
      totalCommissions,
      approvedCommissions,
    ] = await Promise.all([
      prisma.referralCode.count(),
      prisma.referral.count(),
      prisma.commissionPlan.count(),
      prisma.commission.count(),
      prisma.commission.count({
        where: {
          status: "approved",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalReferralCodes,
        totalReferrals,
        totalCommissionPlans,
        totalCommissions,
        approvedCommissions,
      },
    });
  } catch (error) {
    console.error("MLM SUMMARY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch MLM summary." },
      { status: 500 }
    );
  }
}