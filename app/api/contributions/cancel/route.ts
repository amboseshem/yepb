import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const contributionIdValue = String(formData.get("contributionId") || "").trim();

    if (!contributionIdValue) {
      return NextResponse.json(
        { success: false, message: "Contribution ID is required." },
        { status: 400 }
      );
    }

    const contributionId = BigInt(contributionIdValue);

    const contribution = await prisma.contribution.findUnique({
      where: { id: contributionId },
      include: {
        allocations: true,
      },
    });

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: "Contribution not found." },
        { status: 404 }
      );
    }

    if (contribution.status === "rejected") {
      return NextResponse.redirect(
        new URL(`/dashboard/contributions/${contributionIdValue}`, req.url)
      );
    }

    if (contribution.status === "confirmed") {
      const reverseAmount = contribution.allocations
        .filter((a) => a.destinationReference === "contribution_wallet")
        .reduce((sum, a) => sum + Number(a.amount), 0);

      const wallet = await prisma.wallet.findUnique({
        where: {
          memberId_walletType: {
            memberId: contribution.memberId,
            walletType: "contribution_wallet",
          },
        },
      });

      if (wallet && reverseAmount > 0) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: {
              decrement: reverseAmount,
            },
          },
        });

        await prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            transactionType: "adjustment",
            amount: reverseAmount,
            direction: "debit",
            referenceType: "contribution_cancel",
            referenceId: contribution.id.toString(),
            description: `Reversal of cancelled contribution #${contribution.id.toString()}`,
            status: "approved",
          },
        });
      }
    }

    await prisma.contribution.update({
      where: { id: contributionId },
      data: { status: "rejected" },
    });

    return NextResponse.redirect(
      new URL(`/dashboard/contributions/${contributionIdValue}`, req.url)
    );
  } catch (error: any) {
    console.error("CANCEL CONTRIBUTION ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to cancel contribution." },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}