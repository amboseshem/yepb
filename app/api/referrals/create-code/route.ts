import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function makeReferralCode(memberNumber: string, phone: string) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-4);
  const cleanMember = memberNumber.replace(/\s/g, "").toUpperCase();
  return `${cleanMember}-${cleanPhone}`;
}

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin"]);

    const formData = await req.formData();
    const memberIdValue = String(formData.get("memberId") || "").trim();

    if (!memberIdValue) {
      return NextResponse.redirect(new URL("/dashboard/referrals/generate?error=missing-member", req.url));
    }

    const member = await prisma.memberProfile.findUnique({
      where: {
        id: BigInt(memberIdValue),
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      return NextResponse.redirect(new URL("/dashboard/referrals/generate?error=member-not-found", req.url));
    }

    const referralCode = makeReferralCode(member.memberNumber, member.user.phone);
    const referralLink = `/join?ref=${referralCode}`;

    await prisma.referralCode.upsert({
      where: {
        memberId: member.id,
      },
      update: {
        referralCode,
        referralLink,
      },
      create: {
        memberId: member.id,
        referralCode,
        referralLink,
        status: "approved",
      },
    });

    return NextResponse.redirect(new URL("/dashboard/referrals/codes?success=1", req.url));
  } catch (error) {
    console.error("CREATE REFERRAL CODE ERROR:", error);
    return NextResponse.redirect(new URL("/dashboard/referrals/generate?error=failed", req.url));
  }
}