import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.memberProfile.findMany({
      include: {
        user: true,
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("LIST MEMBERS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch members." },
      { status: 500 }
    );
  }
}