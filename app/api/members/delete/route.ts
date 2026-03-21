import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const userId = String(formData.get("userId") || "").trim();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    const member = await prisma.memberProfile.findUnique({
      where: { userId },
      include: {
        wallets: true,
        referralCode: true,
      },
    });

    if (!member) {
      await prisma.user.delete({
        where: { id: userId },
      });

      return NextResponse.redirect(new URL("/dashboard/users-access", req.url));
    }

    const memberId = member.id;

    await prisma.$transaction(async (tx) => {
      await tx.referral.deleteMany({
        where: {
          OR: [
            { sponsorMemberId: memberId },
            { referredMemberId: memberId },
          ],
        },
      });

      await tx.mlmTreeCache.deleteMany({
        where: {
          OR: [
            { ancestorMemberId: memberId },
            { descendantMemberId: memberId },
          ],
        },
      });

      await tx.commission.deleteMany({
        where: {
          OR: [
            { memberId },
            { sourceMemberId: memberId },
          ],
        },
      });

      await tx.withdrawalRequest.deleteMany({
        where: { memberId },
      });

      const walletIds = member.wallets.map((w) => w.id);

      if (walletIds.length > 0) {
        await tx.walletTransaction.deleteMany({
          where: {
            walletId: { in: walletIds },
          },
        });

        await tx.wallet.deleteMany({
          where: {
            id: { in: walletIds },
          },
        });
      }

      await tx.welfareDisbursement.deleteMany({
        where: { memberId },
      });

      await tx.welfareRequest.deleteMany({
        where: { memberId },
      });

      await tx.receipt.deleteMany({
        where: { memberId },
      });

      await tx.contributionAllocation.deleteMany({
        where: {
          contribution: {
            memberId,
          },
        },
      });

      await tx.contribution.deleteMany({
        where: { memberId },
      });

      await tx.projectMember.deleteMany({
        where: { memberId },
      });

      await tx.trainingEnrollment.deleteMany({
        where: { memberId },
      });

      await tx.meetingAttendance.deleteMany({
        where: { memberId },
      });

      await tx.testimonial.deleteMany({
        where: { memberId },
      });

      await tx.order.deleteMany({
        where: { memberId },
      });

      if (member.referralCode) {
        await tx.referralCode.delete({
          where: { id: member.referralCode.id },
        });
      }

      await tx.memberGroupMember.deleteMany({
        where: { memberId },
      });

      await tx.memberProfile.delete({
        where: { id: memberId },
      });

      await tx.userAppAccess.deleteMany({
        where: { userId },
      });

      await tx.notification.deleteMany({
        where: { userId },
      });

      await tx.auditLog.deleteMany({
        where: { userId },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.redirect(new URL("/dashboard/users-access", req.url));
  } catch (error: any) {
    console.error("DELETE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to delete member.",
      },
      { status: error?.message === "Forbidden" ? 403 : 500 }
    );
  }
}