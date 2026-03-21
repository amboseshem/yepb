import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.commissionPlan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error("LIST COMMISSION PLANS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch commission plans." },
      { status: 500 }
    );
  }
}