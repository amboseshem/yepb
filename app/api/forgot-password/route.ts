import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return new Response("User not found", { status: 404 });

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `<a href="https://yourapp/reset?token=${token}">Reset Password</a>`,
  });

  return new Response("Email sent");
}