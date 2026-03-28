import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.walletTransaction.findMany({
      include: {
        wallet: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("LIST WALLET TRANSACTIONS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch wallet transactions." },
      { status: 500 }
    );
  }
}