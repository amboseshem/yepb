import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const projectIdValue = String(formData.get("projectId") || "").trim();
    const status = String(formData.get("status") || "").trim();

    if (!projectIdValue || !status) {
      return NextResponse.json(
        { success: false, message: "Project ID and status are required." },
        { status: 400 }
      );
    }

    await prisma.project.update({
      where: { id: BigInt(projectIdValue) },
      data: {
        status: status as any,
      },
    });

    return NextResponse.redirect(
      new URL(`/dashboard/projects/${projectIdValue}`, req.url)
    );
  } catch (error: any) {
    console.error("PROJECT STATUS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update project status." },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}