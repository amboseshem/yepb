import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { processReferral } from "@/lib/mlm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, password } = body;

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { phone },
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ GET MEMBER ROLE
    const role = await prisma.role.findFirst({
      where: { code: "member" },
    });

    // ✅ CREATE USER AS PENDING
    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone,
        passwordHash: hashedPassword,
        role: {
          connect: { id: role?.id }, // ✅ FIXED
        },
        status: "pending", // 🔥 NEW LOGIC
      },
    });

    // ✅ CREATE MEMBER PROFILE
    await prisma.memberProfile.create({
      data: {
        userId: newUser.id,
      },
    });

    // ✅ REFERRAL (IF EXISTS)
    const url = new URL(req.url);
    const refCode = url.searchParams.get("ref");

    if (refCode) {
      await processReferral(Number(newUser.id), refCode);
    }

    return NextResponse.json({
      message: "Registered successfully. Await approval after payment.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}