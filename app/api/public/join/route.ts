import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName = String(formData.get("fullName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const occupation = String(formData.get("occupation") || "").trim();
    const referralCodeValue = String(formData.get("referralCode") || "").trim();
    const branchIdValue = String(formData.get("branchId") || "").trim();

    if (!fullName || !phone || !password || !branchIdValue) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "A user already exists with these details." },
        { status: 400 }
      );
    }

    const memberRole = await prisma.role.findFirst({
      where: { code: "member" },
    });

    if (!memberRole) {
      return NextResponse.json(
        { success: false, message: "Default member role not found." },
        { status: 500 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const latestMember = await prisma.memberProfile.findFirst({
      orderBy: { id: "desc" },
    });

    const nextNumber = Number(latestMember?.id || 0) + 1;
    const memberNumber = `YEP-${String(nextNumber).padStart(4, "0")}`;

    const user = await prisma.user.create({
      data: {
        fullName,
        username: username || null,
        email: email || null,
        phone,
        passwordHash,
        roleId: memberRole.id,
        status: "active",
        isVerified: true,
      },
    });

    const member = await prisma.memberProfile.create({
      data: {
        userId: user.id,
        memberNumber,
        churchBranchId: BigInt(branchIdValue),
        occupation: occupation || null,
        membershipStatus: "active",
        joinDate: new Date(),
      },
    });

    await prisma.userAppAccess.createMany({
      data: [
        { userId: user.id, appName: "website", isEnabled: true },
        { userId: user.id, appName: "member_portal", isEnabled: true },
      ],
      skipDuplicates: true,
    });

    await prisma.wallet.createMany({
      data: [
        {
          memberId: member.id,
          walletType: "contribution_wallet",
          balance: 0,
          currency: "KES",
          status: "active",
        },
        {
          memberId: member.id,
          walletType: "earnings_wallet",
          balance: 0,
          currency: "KES",
          status: "active",
        },
      ],
      skipDuplicates: true,
    });

    if (referralCodeValue) {
      const sponsorCode = await prisma.referralCode.findUnique({
        where: {
          referralCode: referralCodeValue,
        },
      });

      if (sponsorCode) {
        await prisma.referral.create({
          data: {
            sponsorMemberId: sponsorCode.memberId,
            referredMemberId: member.id,
            referralCodeId: sponsorCode.id,
            level: 1,
            status: "active",
            joinedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("PUBLIC JOIN ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to complete join process." },
      { status: 500 }
    );
  }
}