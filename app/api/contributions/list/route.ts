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

    return NextResponse.json({
      success: true,
      count: contributions.length,
      data: contributions,
    });
  } catch (error) {
    console.error("LIST CONTRIBUTIONS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch contributions." },
      { status: 500 }
    );
  }
}