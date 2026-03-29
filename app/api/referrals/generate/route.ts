import { prisma } from "@/lib/prisma";
import { getToken } from "@/lib/core";

export async function GET() {
  const user = await getToken();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const code = Math.random().toString(36).substring(2, 8);

  const newCode = await prisma.referralCode.create({
    data: {
      referralCode: code,
      memberId: Number(user.userId),
    },
  });

  return Response.json({
    link: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${newCode.referralCode}`,
  });
}