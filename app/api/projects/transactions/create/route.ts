import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const projectIdValue = String(formData.get("projectId") || "").trim();
    const transactionType = String(formData.get("transactionType") || "").trim();
    const amountValue = String(formData.get("amount") || "").trim();
    const paymentMethod = String(formData.get("paymentMethod") || "").trim();
    const referenceNo = String(formData.get("referenceNo") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!projectIdValue || !transactionType || !amountValue) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const amount = Number(amountValue);

    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount." },
        { status: 400 }
      );
    }

    await prisma.projectTransaction.create({
      data: {
        projectId: BigInt(projectIdValue),
        transactionType: transactionType as any,
        amount,
        description: description || null,
        transactionDate: new Date(),
        paymentMethod: paymentMethod ? (paymentMethod as any) : null,
        referenceNo: referenceNo || null,
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard/projects/transactions", req.url)
    );
  } catch (error) {
    console.error("CREATE PROJECT TRANSACTION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create project transaction." },
      { status: 500 }
    );
  }
}