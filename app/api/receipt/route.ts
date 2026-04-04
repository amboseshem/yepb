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

    let activeMembers = 0;
    let pendingMembers = 0;
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

    const summaryRows = [
      ["Total Members", totalMembers],
      ["Active Members", activeMembers],
      ["Pending Members", pendingMembers],
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
    // 💰 FINANCIAL SUMMARY
    // =========================
    let totalDisbursed = 0;

    try {
      const welfare = await prisma.welfareRequest.aggregate({
        _sum: { amountRequested: true },
      });

      totalDisbursed = Number(welfare._sum.amountRequested || 0);
    } catch (e) {
      console.log("Finance error:", e);
    }

    tableY -= 20;

    page.drawText("Financial Summary", {
      x: 50,
      y: tableY,
      size: 14,
      font: bold,
      color: rgb(0, 0.6, 0),
    });

    tableY -= 25;

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

    const financeRows = [
      ["Total Contributions", totalAmount],
      ["Total Disbursed", totalDisbursed],
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

      page.drawText(row[0], {
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