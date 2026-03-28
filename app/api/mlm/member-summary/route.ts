import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const memberIdValue = url.searchParams.get("memberId") || "";

    if (!memberIdValue) {
      return NextResponse.json(
        { success: false, message: "memberId query param is required." },
        { status: 400 }
      );
    }

    const memberId = BigInt(memberIdValue);

    const [member, directReferrals, commissions, code, wallets] = await Promise.all([
      prisma.memberProfile.findUnique({
        where: { id: memberId },
        include: {
          user: true,
        },
      }),
      prisma.referral.count({
        where: {
          sponsorMemberId: memberId,
        },
      }),
      prisma.commission.findMany({
        where: {
          memberId,
        },
        orderBy: {
          earnedAt: "desc",
        },
      }),
      prisma.referralCode.findUnique({
        where: {
          memberId,
        },
      }),
      prisma.wallet.findMany({
        where: {
          memberId,
        },
      }),
    ]);

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found." },
        { status: 404 }
      );
    }

    const totalCommissionAmount = commissions.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        member,
        referralCode: code,
        directReferrals,
        commissionsCount: commissions.length,
        totalCommissionAmount,
        wallets,
      },
    });
  } catch (error) {
    console.error("MLM MEMBER SUMMARY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch MLM member summary." },
      { status: 500 }
    );
  }
}