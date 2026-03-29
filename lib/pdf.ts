import PDFDocument from "pdfkit";

export function generateReceipt(data: any) {
  const doc = new PDFDocument();

  doc.fontSize(20).text("YEP RECEIPT", { align: "center" });

  doc.moveDown();
  doc.fontSize(12).text(`Member: ${data.name}`);
  doc.text(`Amount: KES ${data.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();

  return doc;
}