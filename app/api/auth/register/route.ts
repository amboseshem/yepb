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

    const role = await prisma.role.findFirst({
      where: { code: "member" },
    });

    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone,
        passwordHash: hashedPassword,
        roleId: role?.id,
        status: "active",
      },
    });

    // ✅ GET REFERRAL CODE FROM URL
    const url = new URL(req.url);
    const refCode = url.searchParams.get("ref");

    if (refCode) {
      await processReferral(Number(newUser.id), refCode);
    }

    return NextResponse.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}