import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "").trim();
    const code = String(formData.get("code") || "").trim();
    const projectType = String(formData.get("projectType") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const budgetAmountValue = String(formData.get("budgetAmount") || "").trim();
    const capitalAmountValue = String(formData.get("capitalAmount") || "").trim();
    const startDateValue = String(formData.get("startDate") || "").trim();
    const expectedEndDateValue = String(
      formData.get("expectedEndDate") || ""
    ).trim();
    const status = String(formData.get("status") || "active").trim();
    const description = String(formData.get("description") || "").trim();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Project name is required." },
        { status: 400 }
      );
    }

    await prisma.project.create({
      data: {
        name,
        code: code || null,
        projectType: projectType || null,
        location: location || null,
        budgetAmount: budgetAmountValue ? Number(budgetAmountValue) : null,
        capitalAmount: capitalAmountValue ? Number(capitalAmountValue) : null,
        startDate: startDateValue ? new Date(startDateValue) : null,
        expectedEndDate: expectedEndDateValue
          ? new Date(expectedEndDateValue)
          : null,
        status: status as any,
        description: description || null,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/projects", req.url));
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create project." },
      { status: 500 }
    );
  }
}