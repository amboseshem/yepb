import PDFDocument from "pdfkit";

export async function GET() {
  try {
    const doc = new PDFDocument();

    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {});

    // HEADER
    doc.fontSize(20).text("YOUTH EMPOWERMENT PLATFORM", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).text("Payment Receipt", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12).text("Name: Sample User");
    doc.text("Amount: KES 500");
    doc.text("Date: " + new Date().toLocaleDateString());

    doc.moveDown();
    doc.text("Thank you!", { align: "center" });

    doc.end();

    await new Promise((resolve) => doc.on("end", resolve));

    const pdfBuffer = Buffer.concat(chunks);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating PDF", { status: 500 });
  }
}