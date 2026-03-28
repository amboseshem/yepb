import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getAllocations(amount: number) {
  const savings = amount * 0.6;
  const welfare = amount * 0.25;
  const rotationalSupport = amount * 0.15;

  return {
    savings,
    welfare,
    rotationalSupport,
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const memberIdValue = String(formData.get("memberId") || "").trim();
    const categoryIdValue = String(formData.get("categoryId") || "").trim();
    const amountValue = String(formData.get("amount") || "").trim();
    const paymentMethod = String(formData.get("paymentMethod") || "").trim();
    const transactionReference = String(
      formData.get("transactionReference") || ""
    ).trim();
    const status = String(formData.get("status") || "confirmed").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!memberIdValue || !categoryIdValue || !amountValue || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const amount = Number(amountValue);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount." },
        { status: 400 }
      );
    }

    const memberId = BigInt(memberIdValue);
    const categoryId = BigInt(categoryIdValue);

    const contribution = await prisma.contribution.create({
      data: {
        memberId,
        categoryId,
        amount,
        paymentMethod: paymentMethod as any,
        transactionReference: transactionReference || null,
        paymentDate: new Date(),
        status: status as any,
        notes: notes || null,
      },
    });

    if (status === "confirmed") {
      const { savings, welfare, rotationalSupport } = getAllocations(amount);

      await prisma.contributionAllocation.createMany({
        data: [
          {
            contributionId: contribution.id,
            allocationType: "savings",
            percentage: 60,
            amount: savings,
            destinationReference: "contribution_wallet",
          },
          {
            contributionId: contribution.id,
            allocationType: "welfare",
            percentage: 25,
            amount: welfare,
            destinationReference: "project_wallet",
          },
          {
            contributionId: contribution.id,
            allocationType: "rotational_support",
            percentage: 15,
            amount: rotationalSupport,
            destinationReference: "contribution_wallet",
          },
        ],
      });

      const contributionWallet = await prisma.wallet.upsert({
        where: {
          memberId_walletType: {
            memberId,
            walletType: "contribution_wallet",
          },
        },
        update: {
          balance: {
            increment: savings + rotationalSupport,
          },
        },
        create: {
          memberId,
          walletType: "contribution_wallet",
          balance: savings + rotationalSupport,
          currency: "KES",
          status: "active",
        },
      });

      await prisma.walletTransaction.create({
        data: {
          walletId: contributionWallet.id,
          transactionType: "contribution",
          amount: savings + rotationalSupport,
          direction: "credit",
          referenceType: "contribution",
          referenceId: contribution.id.toString(),
          description: `Contribution allocation for contribution #${contribution.id.toString()}`,
          status: "approved",
        },
      });
    }

    return NextResponse.redirect(new URL("/dashboard/contributions", req.url));
  } catch (error) {
    console.error("CREATE CONTRIBUTION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create contribution." },
      { status: 500 }
    );
  }
}