import PDFDocument from "pdfkit";

export function generateReceipt(data: any) {
  const doc = new PDFDocument({ margin: 40 });

  // HEADER
  doc.rect(0, 0, 600, 80).fill("#1e40af");

  doc
    .fillColor("white")
    .fontSize(20)
    .text("YOUTH EMPOWERMENT PLATFORM", 50, 30);

  // LOGO (optional)
  try {
    doc.image("public/logo.png", 450, 20, { width: 50 });
  } catch {}

  doc.moveDown(3);

  // TITLE
  doc.fillColor("black").fontSize(16).text("Payment Receipt", {
    align: "center",
  });

  doc.moveDown();

  // CONTENT
  doc.fontSize(12);
  doc.text(`Name: ${data.name}`);
  doc.text(`Amount: KES ${data.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  doc.text("Thank you for your contribution!", {
    align: "center",
  });

  doc.end();

  return doc;
}