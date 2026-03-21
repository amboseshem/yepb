import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const withdrawals = await prisma.withdrawalRequest.findMany({
      include: {
        member: {
          include: {
            user: true,
          },
        },
        wallet: true,
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: withdrawals.length,
      data: withdrawals,
    });
  } catch (error) {
    console.error("LIST WITHDRAWALS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawal requests." },
      { status: 500 }
    );
  }
}