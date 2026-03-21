import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const group = String(formData.get("group") || "").trim();

    if (group === "company") {
      const keys = [
        "platform_name",
        "company_phone",
        "company_email",
        "po_box",
        "kra_pin",
        "bank_name",
        "bank_account_name",
        "bank_account_number",
        "paybill_number",
        "website_url",
      ];

      for (const key of keys) {
        const value = String(formData.get(key) || "").trim();

        await prisma.systemSetting.upsert({
          where: { settingKey: key },
          update: {
            settingValue: value || null,
            updatedAt: new Date(),
          },
          create: {
            settingKey: key,
            settingValue: value || null,
            description: `Company setting: ${key}`,
          },
        });
      }

      return NextResponse.redirect(new URL("/dashboard/settings", req.url));
    }

    const settingKey = String(formData.get("settingKey") || "").trim();
    const settingValue = String(formData.get("settingValue") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!settingKey) {
      return NextResponse.json(
        { success: false, message: "Setting key is required." },
        { status: 400 }
      );
    }

    await prisma.systemSetting.upsert({
      where: { settingKey },
      update: {
        settingValue: settingValue || null,
        description: description || null,
        updatedAt: new Date(),
      },
      create: {
        settingKey,
        settingValue: settingValue || null,
        description: description || null,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/settings", req.url));
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update setting." },
      { status: 500 }
    );
  }
}