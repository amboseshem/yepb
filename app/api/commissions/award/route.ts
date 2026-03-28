import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const memberIdValue = String(formData.get("memberId") || "").trim();
    const sourceMemberIdValue = String(
      formData.get("sourceMemberId") || ""
    ).trim();
    const commissionPlanIdValue = String(
      formData.get("commissionPlanId") || ""
    ).trim();
    const referenceType = String(formData.get("referenceType") || "").trim();
    const referenceId = String(formData.get("referenceId") || "").trim();
    const levelValue = String(formData.get("level") || "").trim();
    const amountValue = String(formData.get("amount") || "").trim();
    const status = String(formData.get("status") || "approved").trim();

    if (!memberIdValue || !commissionPlanIdValue || !amountValue) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const memberId = BigInt(memberIdValue);
    const commissionPlanId = BigInt(commissionPlanIdValue);
    const amount = Number(amountValue);

    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid commission amount." },
        { status: 400 }
      );
    }

    const commission = await prisma.commission.create({
      data: {
        memberId,
        sourceMemberId: sourceMemberIdValue
          ? BigInt(sourceMemberIdValue)
          : null,
        commissionPlanId,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        level: levelValue ? Number(levelValue) : null,
        amount,
        status: status as any,
        earnedAt: new Date(),
        approvedAt: status === "approved" ? new Date() : null,
      },
    });

    if (status === "approved") {
      const earningsWallet = await prisma.wallet.upsert({
        where: {
          memberId_walletType: {
            memberId,
            walletType: "earnings_wallet",
          },
        },
        update: {
          balance: {
            increment: amount,
          },
        },
        create: {
          memberId,
          walletType: "earnings_wallet",
          balance: amount,
          currency: "KES",
          status: "active",
        },
      });

      const walletTxn = await prisma.walletTransaction.create({
        data: {
          walletId: earningsWallet.id,
          transactionType: "commission",
          amount,
          direction: "credit",
          referenceType: "commission",
          referenceId: commission.id.toString(),
          description: `Commission award for member ${memberId.toString()}`,
          status: "approved",
        },
      });

      await prisma.commission.update({
        where: {
          id: commission.id,
        },
        data: {
          paidWalletTransactionId: walletTxn.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Commission awarded successfully.",
    });
  } catch (error) {
    console.error("AWARD COMMISSION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to award commission." },
      { status: 500 }
    );
  }
}