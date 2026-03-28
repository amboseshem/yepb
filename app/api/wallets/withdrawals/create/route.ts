import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const walletIdValue = String(formData.get("walletId") || "").trim();
    const amountValue = String(formData.get("amount") || "").trim();
    const paymentMethod = String(formData.get("paymentMethod") || "").trim();
    const accountDetails = String(formData.get("accountDetails") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!walletIdValue || !amountValue || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const walletId = BigInt(walletIdValue);
    const amount = Number(amountValue);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal amount." },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet not found." },
        { status: 404 }
      );
    }

    if (Number(wallet.balance) < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient wallet balance." },
        { status: 400 }
      );
    }

    await prisma.withdrawalRequest.create({
      data: {
        memberId: wallet.memberId,
        walletId,
        amount,
        paymentMethod: paymentMethod as any,
        accountDetails: accountDetails ? JSON.parse(accountDetails) : null,
        status: "pending",
        requestedAt: new Date(),
        notes: notes || null,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/wallets/withdrawals", req.url));
  } catch (error) {
    console.error("CREATE WITHDRAWAL ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create withdrawal request." },
      { status: 500 }
    );
  }
}