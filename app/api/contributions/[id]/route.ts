import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const contribution = await prisma.contribution.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        member: {
          include: {
            user: true,
            branch: true,
          },
        },
        category: true,
      },
    });

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: "Contribution not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contribution,
    });
  } catch (error) {
    console.error("CONTRIBUTION DETAIL ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch contribution." },
      { status: 500 }
    );
  }
}