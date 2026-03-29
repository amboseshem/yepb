import PDFDocument from "pdfkit";

export function generateReceipt(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffers: any[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      // HEADER
      doc
        .fontSize(20)
        .fillColor("#1e3a8a")
        .text("YOUTH EMPOWERMENT PLATFORM", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(14)
        .fillColor("black")
        .text("OFFICIAL RECEIPT", { align: "center" });

      doc.moveDown();

      // DETAILS
      doc.fontSize(12);
      doc.text(`Name: ${data.name}`);
      doc.text(`Amount: KES ${data.amount}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);

      doc.moveDown();
      doc.text("Thank you for your contribution!", {
        align: "center",
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}