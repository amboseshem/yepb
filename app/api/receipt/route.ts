import { NextResponse } from "next/server";
import { generateReceipt } from "@/lib/pdf";

export async function GET() {
  const doc = generateReceipt({
    name: "Test User",
    amount: 500,
  });

  return new Response(doc as any, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}