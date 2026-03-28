import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const userId = String(formData.get("userId") || "").trim();
    const newPassword = String(formData.get("newPassword") || "").trim();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { success: false, message: "User ID and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 4 characters." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/users-access?reset=1", req.url));
  } catch (error: any) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to reset password.",
      },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}