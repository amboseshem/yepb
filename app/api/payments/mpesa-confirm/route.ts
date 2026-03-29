import { prisma } from "@/lib/prisma";
import { getToken } from "@/lib/core";

export async function POST(req: Request) {
  try {
    const user = await getToken();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { transactionCode } = await req.json();

    if (!transactionCode) {
      return new Response("Transaction code required", { status: 400 });
    }

    // ✅ ACTIVATE USER
    await prisma.user.update({
      where: { id: user.userId },
      data: { status: "active" },
    });

    return new Response("Payment received. Account activated.");
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}