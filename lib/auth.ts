import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type TokenPayload = {
  userId: string;
  phone: string;
  role: string;
};

export async function getCurrentUserToken(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    return decoded;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const token = await getCurrentUserToken();
  if (!token) return null;

  return prisma.user.findUnique({
    where: { id: token.userId },
    include: {
      role: true,
      memberProfile: {
        include: {
          branch: true,
        },
      },
    },
  });
}

export async function requireRole(allowedRoles: string[]) {
  const token = await getCurrentUserToken();

  if (!token) {
    throw new Error("Unauthorized");
  }

  if (!allowedRoles.includes(token.role)) {
    throw new Error("Forbidden");
  }

  return token;
}