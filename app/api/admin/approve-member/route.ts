import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/core";

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin", "admin", "treasurer"]);

    const { userId, transactionCode } = await req.json();

    if (!transactionCode) {
      return new Response("Transaction code required", { status: 400 });
    }

    // ACTIVATE USER
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "active",
      },
    });

    // APPROVE COMMISSIONS
    await prisma.commission.updateMany({
      where: { memberId: userId },
      data: { status: "approved" },
    });

    return new Response("Member activated");
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}