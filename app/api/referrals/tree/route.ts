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

    const directReferrals = await prisma.referral.findMany({
      where: {
        sponsorMemberId: memberId,
      },
      include: {
        referred: {
          include: {
            user: true,
          },
        },
        referralCode: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: directReferrals.length,
      data: directReferrals,
    });
  } catch (error) {
    console.error("REFERRAL TREE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch referral tree." },
      { status: 500 }
    );
  }
}