import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // TEMP: no reset token storage yet
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `<p>Hello ${user.fullName},</p>
             <p>Your password reset request was received.</p>
             <p>Contact admin to reset your password.</p>`,
    });

    return new Response("Email sent");
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}