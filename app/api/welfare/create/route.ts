import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const memberIdValue = String(formData.get("memberId") || "").trim();
    const requestType = String(formData.get("requestType") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const amountRequestedValue = String(
      formData.get("amountRequested") || ""
    ).trim();
    const status = String(formData.get("status") || "pending").trim();
    const description = String(formData.get("description") || "").trim();

    if (!memberIdValue || !requestType || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    await prisma.welfareRequest.create({
      data: {
        memberId: BigInt(memberIdValue),
        requestType: requestType as any,
        title,
        description,
        amountRequested: amountRequestedValue
          ? Number(amountRequestedValue)
          : null,
        status: status as any,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/welfare", req.url));
  } catch (error) {
    console.error("CREATE WELFARE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create welfare request." },
      { status: 500 }
    );
  }
}