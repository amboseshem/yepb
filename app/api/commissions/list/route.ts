import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const commissions = await prisma.commission.findMany({
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
    });

    return NextResponse.json({
      success: true,
      count: commissions.length,
      data: commissions,
    });
  } catch (error) {
    console.error("LIST COMMISSIONS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch commissions." },
      { status: 500 }
    );
  }
}