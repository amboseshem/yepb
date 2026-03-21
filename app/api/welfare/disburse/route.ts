import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const welfareRequestIdValue = String(
      formData.get("welfareRequestId") || ""
    ).trim();
    const amountApprovedValue = String(
      formData.get("amountApproved") || ""
    ).trim();
    const paymentMethod = String(formData.get("paymentMethod") || "").trim();
    const transactionReference = String(
      formData.get("transactionReference") || ""
    ).trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!welfareRequestIdValue || !amountApprovedValue || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const welfareRequestId = BigInt(welfareRequestIdValue);
    const amountApproved = Number(amountApprovedValue);

    if (isNaN(amountApproved) || amountApproved < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount approved." },
        { status: 400 }
      );
    }

    const requestRecord = await prisma.welfareRequest.findUnique({
      where: {
        id: welfareRequestId,
      },
    });

    if (!requestRecord) {
      return NextResponse.json(
        { success: false, message: "Welfare request not found." },
        { status: 404 }
      );
    }

    if (requestRecord.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Only approved requests can be disbursed." },
        { status: 400 }
      );
    }

    await prisma.welfareDisbursement.create({
      data: {
        welfareRequestId,
        memberId: requestRecord.memberId,
        amountApproved,
        paymentMethod: paymentMethod as any,
        transactionReference: transactionReference || null,
        disbursedAt: new Date(),
        notes: notes || null,
      },
    });

    await prisma.welfareRequest.update({
      where: {
        id: welfareRequestId,
      },
      data: {
        status: "disbursed",
      },
    });

    return NextResponse.redirect(new URL("/dashboard/welfare", req.url));
  } catch (error) {
    console.error("DISBURSE WELFARE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to disburse welfare." },
      { status: 500 }
    );
  }
}