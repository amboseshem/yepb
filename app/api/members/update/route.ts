import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const memberIdValue = String(formData.get("memberId") || "").trim();
    const roleIdValue = String(formData.get("roleId") || "").trim();
    const branchIdValue = String(formData.get("branchId") || "").trim();
    const occupation = String(formData.get("occupation") || "").trim();

    if (!memberIdValue || !roleIdValue || !branchIdValue) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const memberId = BigInt(memberIdValue);
    const roleId = BigInt(roleIdValue);
    const branchId = BigInt(branchIdValue);

    const member = await prisma.memberProfile.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: member.userId },
      data: {
        roleId,
      },
    });

    await prisma.memberProfile.update({
      where: { id: memberId },
      data: {
        churchBranchId: branchId,
        occupation: occupation || null,
      },
    });

    return NextResponse.redirect(
      new URL(`/dashboard/members/${memberIdValue}`, req.url)
    );
  } catch (error: any) {
    console.error("UPDATE MEMBER ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update member." },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}