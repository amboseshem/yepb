import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = String(formData.get("title") || "").trim();
    const categoryIdValue = String(formData.get("categoryId") || "").trim();
    const trainerUserId = String(formData.get("trainerUserId") || "").trim();
    const contentType = String(formData.get("contentType") || "").trim();
    const contentUrl = String(formData.get("contentUrl") || "").trim();
    const durationMinutesValue = String(
      formData.get("durationMinutes") || ""
    ).trim();
    const status = String(formData.get("status") || "published").trim();
    const description = String(formData.get("description") || "").trim();

    if (!title || !contentType) {
      return NextResponse.json(
        { success: false, message: "Title and content type are required." },
        { status: 400 }
      );
    }

    await prisma.training.create({
      data: {
        title,
        categoryId: categoryIdValue ? BigInt(categoryIdValue) : null,
        trainerUserId: trainerUserId || null,
        contentType: contentType as any,
        contentUrl: contentUrl || null,
        durationMinutes: durationMinutesValue
          ? Number(durationMinutesValue)
          : null,
        status: status as any,
        description: description || null,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/training", req.url));
  } catch (error) {
    console.error("CREATE TRAINING ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create training." },
      { status: 500 }
    );
  }
}