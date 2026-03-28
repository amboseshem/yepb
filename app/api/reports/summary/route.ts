import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalMembers,
      activeMembers,
      totalContributions,
      totalProjects,
      activeProjects,
      totalWelfareRequests,
      totalTrainings,
      totalWallets,
      totalReferrals,
      totalCommissions,
    ] = await Promise.all([
      prisma.memberProfile.count(),
      prisma.memberProfile.count({
        where: { membershipStatus: "active" },
      }),
      prisma.contribution.count(),
      prisma.project.count(),
      prisma.project.count({
        where: { status: "active" },
      }),
      prisma.welfareRequest.count(),
      prisma.training.count(),
      prisma.wallet.count(),
      prisma.referral.count(),
      prisma.commission.count(),
    ]);

    const contributionSum = await prisma.contribution.aggregate({
      _sum: {
        amount: true,
      },
    });

    const welfareSum = await prisma.welfareRequest.aggregate({
      _sum: {
        amountRequested: true,
      },
    });

    const projectBudgetSum = await prisma.project.aggregate({
      _sum: {
        budgetAmount: true,
      },
    });

    const commissionSum = await prisma.commission.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalContributions,
        totalContributionAmount: Number(contributionSum._sum.amount || 0),
        totalProjects,
        activeProjects,
        totalProjectBudget: Number(projectBudgetSum._sum.budgetAmount || 0),
        totalWelfareRequests,
        totalWelfareAmountRequested: Number(
          welfareSum._sum.amountRequested || 0
        ),
        totalTrainings,
        totalWallets,
        totalReferrals,
        totalCommissions,
        totalCommissionAmount: Number(commissionSum._sum.amount || 0),
      },
    });
  } catch (error) {
    console.error("REPORT SUMMARY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch summary report." },
      { status: 500 }
    );
  }
}