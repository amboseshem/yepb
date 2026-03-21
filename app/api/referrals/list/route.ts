import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const referrals = await prisma.referral.findMany({
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
        referralCode: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: referrals.length,
      data: referrals,
    });
  } catch (error) {
    console.error("LIST REFERRALS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch referrals." },
      { status: 500 }
    );
  }
}