export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // =========================
    // 📊 FETCH DATA
    // =========================
    let totalMembers = 0;
    let totalContributions = 0;
    let totalProjects = 0;
    let totalAmount = 0;
    let transactions: any[] = [];

    try {
      totalMembers = await prisma.memberProfile.count();
      totalContributions = await prisma.contribution.count();
      totalProjects = await prisma.project.count();

      const sum = await prisma.contribution.aggregate({
        _sum: { amount: true },
      });

      totalAmount = Number(sum._sum.amount || 0);

      transactions = await prisma.contribution.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        include: {
          member: {
            include: { user: true },
          },
        },
      });
    } catch (e) {
      console.log("DB error:", e);
    }

    // =========================
    // 📄 CREATE PDF
    // =========================
    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // =========================
    // 🖼 LOAD LOGO
    // =========================
    let logoImage: any = null;
    try {
      const logoPath = path.join(process.cwd(), "public/logo.png");
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch (e) {
      console.log("Logo not found, skipping...");
    }

    // =========================
    // 🧾 PAGE 1 (SUMMARY)
    // =========================
    let page = pdfDoc.addPage([600, 800]);
    let { width, height } = page.getSize();

    // 🔵 HEADER
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width,
      height: 100,
      color: rgb(0, 0.3, 0.8),
    });

    // 🖼 LOGO
    if (logoImage) {
      page.drawImage(logoImage, {
        x: 30,
        y: height - 90,
        width: 70,
        height: 70,
      });

      // watermark
      page.drawImage(logoImage, {
        x: 150,
        y: 200,
        width: 300,
        height: 300,
        opacity: 0.08,
      });
    }

    // TITLE
    page.drawText("YEP PLATFORM REPORT", {
      x: 120,
      y: height - 55,
      size: 18,
      font: bold,
      color: rgb(1, 1, 1),
    });

    // DATE
    page.drawText(new Date().toLocaleString(), {
      x: 50,
      y: height - 120,
      size: 10,
      font,
    });

    // =========================
// 📊 SYSTEM SUMMARY TABLE
// =========================

// Extra stats
let activeMembers = 0;
let pendingMembers = 0;
let archivedMembers = 0;
let totalTrainings = 0;
let totalCommissions = 0;

try {
 activeMembers = await prisma.memberProfile.count({
  where: { membershipStatus: "active" },
});

pendingMembers = await prisma.memberProfile.count({
  where: { membershipStatus: "pending" },
});

  totalTrainings = await prisma.training.count();
  totalCommissions = await prisma.commission.count();

} catch (e) {
  console.log("Extra stats error:", e);
}

// 🔴 TITLE
page.drawText("System Summary", {
  x: 50,
  y: height - 150,
  size: 14,
  font: bold,
  color: rgb(1, 0, 0),
});

let tableY = height - 180;

// HEADER
page.drawRectangle({
  x: 50,
  y: tableY,
  width: 500,
  height: 25,
  color: rgb(0, 0.3, 0.8),
});

page.drawText("Metric", { x: 60, y: tableY + 7, size: 11, font: bold, color: rgb(1,1,1) });
page.drawText("Value", { x: 400, y: tableY + 7, size: 11, font: bold, color: rgb(1,1,1) });

tableY -= 25;

// ROWS
const summaryRows = [
  ["Total Members", totalMembers],
  ["Active Members", activeMembers],
  ["Pending Members", pendingMembers],
  ["Archived Members", archivedMembers],
  ["Total Contributions", totalContributions],
  ["Total Projects", totalProjects],
  ["Total Trainings", totalTrainings],
  ["Total Commissions", totalCommissions],
];

summaryRows.forEach((row, i) => {
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: 500,
    height: 25,
    color: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1),
  });

  page.drawText(String(row[0]), {
    x: 60,
    y: tableY + 7,
    size: 10,
    font,
  });

  page.drawText(String(row[1]), {
    x: 400,
    y: tableY + 7,
    size: 10,
    font,
  });

  tableY -= 25;
});


// =========================
// 💰 FINANCIAL SUMMARY TABLE
// =========================

// Extra financial stats
let totalDisbursed = 0;

try {
  const welfare = await prisma.welfareRequest.aggregate({
    _sum: { amountRequested: true },
  });

  totalDisbursed = Number(welfare._sum.amountRequested || 0);

} catch (e) {
  console.log("Finance error:", e);
}

// TITLE
tableY -= 20;

page.drawText("Financial Summary", {
  x: 50,
  y: tableY,
  size: 14,
  font: bold,
  color: rgb(0, 0.6, 0),
});

tableY -= 25;

// HEADER
page.drawRectangle({
  x: 50,
  y: tableY,
  width: 500,
  height: 25,
  color: rgb(0, 0.3, 0.8),
});

page.drawText("Category", { x: 60, y: tableY + 7, size: 11, font: bold, color: rgb(1,1,1) });
page.drawText("Amount (KES)", { x: 350, y: tableY + 7, size: 11, font: bold, color: rgb(1,1,1) });

tableY -= 25;

// ROWS
const financeRows = [
  ["Total Contributions", totalAmount],
  ["Total Disbursed (Welfare)", totalDisbursed],
  ["Net Balance", totalAmount - totalDisbursed],
];

financeRows.forEach((row, i) => {
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: 500,
    height: 25,
    color: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1),
  });

  page.drawText(String(row[0]), {
    x: 60,
    y: tableY + 7,
    size: 10,
    font,
  });

  page.drawText(`KES ${Number(row[1]).toLocaleString()}`, {
    x: 350,
    y: tableY + 7,
    size: 10,
    font,
  });

  tableY -= 25;
});
   // =========================
// 🏢 COMPANY PROFILE
// =========================

let y = tableY; // ✅ FIX ADDED HERE

y -= 40;

page.drawText("About YEP Platform", {
  x: 50,
  y,
  size: 14,
  font: bold,
});

    y -= 20;

    page.drawText(
      "The Youth Empowerment Platform (YEP) is a community-driven system designed to empower young people through financial contributions, training, and projects. It promotes accountability, growth, and unity.",
      {
        x: 50,
        y,
        size: 10,
        font,
        maxWidth: 500,
      }
    );

    y -= 50;

    // 🎯 VISION
    page.drawText("Vision", {
      x: 50,
      y,
      size: 12,
      font: bold,
      color: rgb(0, 0.3, 0.8),
    });

    y -= 15;

    page.drawText(
      "To build a financially empowered and self-sustaining youth community.",
      { x: 50, y, size: 10, font }
    );

    y -= 25;

    // 🚀 MISSION
    page.drawText("Mission", {
      x: 50,
      y,
      size: 12,
      font: bold,
      color: rgb(0, 0.6, 0),
    });

    y -= 15;

    page.drawText(
      "To empower youths through structured systems of growth, leadership, and accountability.",
      { x: 50, y, size: 10, font, maxWidth: 500 }
    );

    y -= 30;

    // 💎 VALUES
    page.drawText("Core Values", {
      x: 50,
      y,
      size: 12,
      font: bold,
      color: rgb(1, 0, 0),
    });

    y -= 15;

    ["Integrity", "Unity", "Growth", "Accountability"].forEach((v) => {
      page.drawText(`• ${v}`, { x: 60, y, size: 10, font });
      y -= 15;
    });

    // =========================
    // ✍️ CHAIRMAN REMARK
    // =========================
    y -= 20;

    page.drawText("Chairman's Remark", {
      x: 50,
      y,
      size: 14,
      font: bold,
    });

    y -= 20;

    page.drawText(
      "As the Youth Chairman, I am proud of the unity and progress of this platform. This system represents empowerment, growth, and responsibility among youths.",
      {
        x: 50,
        y,
        size: 10,
        font,
        maxWidth: 500,
      }
    );

    // =========================
    // 📄 PAGE 2 (TRANSACTIONS)
    // =========================
    page = pdfDoc.addPage([600, 800]);
    ({ width, height } = page.getSize());

    page.drawRectangle({
      x: 0,
      y: height - 80,
      width,
      height: 80,
      color: rgb(0, 0.3, 0.8),
    });

    page.drawText("Transactions Report", {
      x: 200,
      y: height - 50,
      size: 16,
      font: bold,
      color: rgb(1, 1, 1),
    });

    let startY = height - 120;

    page.drawRectangle({
      x: 50,
      y: startY,
      width: 500,
      height: 20,
      color: rgb(0, 0.3, 0.8),
    });

    page.drawText("Name", { x: 60, y: startY + 5, size: 10, font: bold, color: rgb(1,1,1) });
    page.drawText("Amount", { x: 250, y: startY + 5, size: 10, font: bold, color: rgb(1,1,1) });
    page.drawText("Date", { x: 400, y: startY + 5, size: 10, font: bold, color: rgb(1,1,1) });

    let rowY = startY - 20;

    transactions.forEach((t, i) => {
      page.drawRectangle({
        x: 50,
        y: rowY,
        width: 500,
        height: 20,
        color: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1),
      });

      page.drawText(
        t.member?.user?.fullName || "N/A",
        { x: 60, y: rowY + 5, size: 10, font }
      );

      page.drawText(
        `KES ${Number(t.amount).toLocaleString()}`,
        { x: 250, y: rowY + 5, size: 10, font }
      );

      page.drawText(
        new Date(t.createdAt).toLocaleDateString(),
        { x: 400, y: rowY + 5, size: 10, font }
      );

      rowY -= 20;
    });

    // =========================
    // ✍️ SIGNATURES
    // =========================
    page.drawText("Chairman:", { x: 50, y: 100, size: 10, font });
    page.drawLine({ start: { x: 120, y: 100 }, end: { x: 250, y: 100 } });

    page.drawText("Treasurer:", { x: 300, y: 100, size: 10, font });
    page.drawLine({ start: { x: 380, y: 100 }, end: { x: 520, y: 100 } });

    page.drawText("Secretary:", { x: 50, y: 70, size: 10, font });
    page.drawLine({ start: { x: 120, y: 70 }, end: { x: 250, y: 70 } });

    // =========================
    // 📦 FINAL OUTPUT
    // =========================
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generating PDF" },
      { status: 500 }
    );
  }
}