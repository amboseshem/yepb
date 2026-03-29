import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ================= AUTH ================= */

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as any;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");
  return token;
}

export async function requireRole(roles: string[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) throw new Error("Forbidden");
  return user;
}

/* ================= USER ================= */

export async function getFullUser() {
  const token = await getToken();
  if (!token) return null;

  return prisma.user.findUnique({
    where: { id: token.userId },
    include: {
      role: true,
      memberProfile: {
        include: { branch: true },
      },
    },
  });
}

/* ================= MLM ================= */

export async function registerReferral(sponsorId: number, newMemberId: number) {
  await prisma.referral.create({
    data: {
      sponsorMemberId: sponsorId,
      referredMemberId: newMemberId,
      status: "active",
    },
  });
}

export async function giveCommission(memberId: number, amount: number) {
  await prisma.commission.create({
    data: {
      memberId,
      amount,
      status: "approved",
    },
  });
}

/* ================= WALLET ================= */

export async function creditWallet(memberId: number, amount: number) {
  const wallet = await prisma.wallet.findFirst({
    where: { memberId },
  });

  if (!wallet) return;

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: { increment: amount },
    },
  });
}

/* ================= ANALYTICS ================= */

export async function getDashboardStats() {
  const users = await prisma.user.count();
  const contributions = await prisma.contribution.aggregate({
    _sum: { amount: true },
  });

  return {
    users,
    totalContributions: contributions._sum.amount || 0,
  };
}
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* AUTH */

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as any;
  } catch {
    return null;
  }
}

export async function requireRole(roles: string[]) {
  const user = await getToken();
  if (!user) throw new Error("Unauthorized");

  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

/* USER */

export async function getFullUser() {
  const token = await getToken();
  if (!token) return null;

  return prisma.user.findUnique({
    where: { id: token.userId },
    include: {
      role: true,
      memberProfile: {
        include: { branch: true },
      },
    },
  });
}