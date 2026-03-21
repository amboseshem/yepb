import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.projectTransaction.findMany({
      include: {
        project: true,
      },
      orderBy: {
        transactionDate: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("LIST PROJECT TRANSACTIONS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch project transactions." },
      { status: 500 }
    );
  }
}