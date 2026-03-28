import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();

    const branchIdValue = String(formData.get("branchId") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const code = String(formData.get("code") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const leaderName = String(formData.get("leaderName") || "").trim();
    const contactPhone = String(formData.get("contactPhone") || "").trim();

    if (!branchIdValue || !name) {
      return NextResponse.json(
        { success: false, message: "Branch ID and name are required." },
        { status: 400 }
      );
    }

    await prisma.branch.update({
      where: {
        id: BigInt(branchIdValue),
      },
      data: {
        name,
        code: code || null,
        location: location || null,
        leaderName: leaderName || null,
        contactPhone: contactPhone || null,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/settings", req.url));
  } catch (error: any) {
    console.error("UPDATE BRANCH ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update branch." },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}