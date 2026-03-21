import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: {
        settingKey: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    console.error("LIST SETTINGS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}