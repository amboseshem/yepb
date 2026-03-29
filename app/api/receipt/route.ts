import { generateReceipt } from "@/lib/pdf";

export async function GET() {
  try {
    const pdfBuffer = await generateReceipt({
      name: "System User",
      amount: 500,
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=receipt.pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating PDF", { status: 500 });
  }
}