import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const member = await prisma.memberProfile.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        user: true,
        branch: true,
        contributions: {
          include: {
            category: true,
          },
          orderBy: {
            paymentDate: "desc",
          },
        },
        welfareRequests: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("MEMBER DETAIL ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch member." },
      { status: 500 }
    );
  }
}