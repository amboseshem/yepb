import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const triggerType = String(formData.get("triggerType") || "").trim();
    const levelValue = String(formData.get("level") || "").trim();
    const percentageValue = String(formData.get("percentage") || "").trim();
    const fixedAmountValue = String(formData.get("fixedAmount") || "").trim();
    const status = String(formData.get("status") || "approved").trim();

    if (!name || !triggerType) {
      return NextResponse.json(
        { success: false, message: "Name and trigger type are required." },
        { status: 400 }
      );
    }

    await prisma.commissionPlan.create({
      data: {
        name,
        description: description || null,
        triggerType: triggerType as any,
        level: levelValue ? Number(levelValue) : null,
        percentage: percentageValue ? Number(percentageValue) : null,
        fixedAmount: fixedAmountValue ? Number(fixedAmountValue) : null,
        status: status as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Commission plan created successfully.",
    });
  } catch (error) {
    console.error("CREATE COMMISSION PLAN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create commission plan." },
      { status: 500 }
    );
  }
}