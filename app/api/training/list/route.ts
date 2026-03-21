import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        category: true,
        trainer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: trainings.length,
      data: trainings,
    });
  } catch (error) {
    console.error("LIST TRAINING ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch training records." },
      { status: 500 }
    );
  }
}