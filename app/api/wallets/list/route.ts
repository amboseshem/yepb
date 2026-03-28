import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        member: {
          include: {
            user: true,
            branch: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: wallets.length,
      data: wallets,
    });
  } catch (error) {
    console.error("LIST WALLETS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch wallets." },
      { status: 500 }
    );
  }
}