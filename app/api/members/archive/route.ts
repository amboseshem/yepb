import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const userId = String(formData.get("userId") || "").trim();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    const member = await prisma.memberProfile.findUnique({
      where: { userId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "archived",
      },
    });

    if (member) {
      await prisma.memberProfile.update({
        where: { id: member.id },
        data: {
          membershipStatus: "exited",
        },
      });
    }

    return NextResponse.redirect(new URL("/dashboard/users-access", req.url));
  } catch (error: any) {
    console.error("ARCHIVE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to archive member.",
      },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}