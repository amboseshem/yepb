import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin", "treasurer"]);

    const formData = await req.formData();
    const welfareRequestIdValue = String(formData.get("welfareRequestId") || "").trim();
    const status = String(formData.get("status") || "").trim();

    if (!welfareRequestIdValue || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    await prisma.welfareRequest.update({
      where: { id: BigInt(welfareRequestIdValue) },
      data: { status: status as any },
    });

    return NextResponse.redirect(new URL("/dashboard/welfare", req.url));
  } catch (error: any) {
    console.error("WELFARE STATUS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update welfare status." },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}