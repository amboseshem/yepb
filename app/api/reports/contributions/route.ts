import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contributions = await prisma.contribution.findMany({
      include: {
        member: {
          include: {
            user: true,
            branch: true,
          },
        },
        category: true,
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    const totalAmount = contributions.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    return NextResponse.json({
      success: true,
      count: contributions.length,
      totalAmount,
      data: contributions,
    });
  } catch (error) {
    console.error("CONTRIBUTION REPORT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch contribution report." },
      { status: 500 }
    );
  }
}
