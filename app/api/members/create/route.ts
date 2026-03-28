import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const branchIdValue = String(formData.get("branchId") || "").trim();
    const roleIdValue = String(formData.get("roleId") || "").trim();

    if (!fullName || !phone || !password || !branchIdValue || !roleIdValue) {
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
        {
          success: false,
          message: "A user with this phone, email, or username already exists.",
        },
        { status: 400 }
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
        roleId: BigInt(roleIdValue),
        status: "active",
        isVerified: true,
      },
    });

    await prisma.memberProfile.create({
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

    return NextResponse.redirect(new URL("/dashboard/members", req.url));
  } catch (error) {
    console.error("CREATE MEMBER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create member." },
      { status: 500 }
    );
  }
}