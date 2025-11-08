import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ForecastAnalysis } from "../sharedTypes";
import { splitIntoPoints } from "./text";

const PAGE_MARGIN_X = 56;
const PAGE_MARGIN_Y = 64;
const LINE_HEIGHT = 18;

type Cursor = { value: number };

type Chip = { label: string; value: string };

function ensureSpace(doc: jsPDF, cursor: Cursor, required: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (cursor.value + required > pageHeight - PAGE_MARGIN_Y) {
    doc.addPage();
    cursor.value = PAGE_MARGIN_Y;
  }
}

function drawDivider(doc: jsPDF, cursor: Cursor) {
  ensureSpace(doc, cursor, 24);
  doc.setDrawColor(225, 230, 245);
  doc.setLineWidth(1);
  doc.line(
    PAGE_MARGIN_X,
    cursor.value,
    doc.internal.pageSize.getWidth() - PAGE_MARGIN_X,
    cursor.value
  );
  cursor.value += LINE_HEIGHT / 2;
  doc.setDrawColor(0, 0, 0);
}

function renderHeading(doc: jsPDF, text: string, cursor: Cursor) {
  ensureSpace(doc, cursor, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(text, PAGE_MARGIN_X, cursor.value);
  cursor.value += LINE_HEIGHT + 6;
}

function renderSectionTitle(doc: jsPDF, text: string, cursor: Cursor) {
  ensureSpace(doc, cursor, 30);
  doc.setFillColor(243, 246, 255);
  doc.setDrawColor(218, 226, 255);
  const width = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2;
  doc.roundedRect(PAGE_MARGIN_X, cursor.value - 14, width, 32, 6, 6, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(33, 45, 85);
  doc.text(text, PAGE_MARGIN_X + 12, cursor.value + 6);
  doc.setTextColor(0, 0, 0);
  cursor.value += LINE_HEIGHT + 10;
}

function renderChips(doc: jsPDF, chips: Chip[], cursor: Cursor) {
  if (!chips.length) return;

  const pageWidth = doc.internal.pageSize.getWidth();
  const availableWidth = pageWidth - PAGE_MARGIN_X * 2;
  const columnWidth = availableWidth / 2;
  const rows: string[][] = [];

  for (let i = 0; i < chips.length; i += 2) {
    const first = chips[i];
    const second = chips[i + 1];
    rows.push([
      first ? `${first.label.toUpperCase()}\n${first.value}` : "",
      second ? `${second.label.toUpperCase()}\n${second.value}` : "",
    ]);
  }

  ensureSpace(doc, cursor, 60);
  autoTable(doc, {
    startY: cursor.value,
    margin: { left: PAGE_MARGIN_X, right: PAGE_MARGIN_X },
    body: rows,
    theme: "plain",
    tableWidth: availableWidth,
    styles: {
      font: "helvetica",
      fontSize: 11,
      cellPadding: { top: 12, bottom: 12, left: 14, right: 14 },
      fillColor: [247, 249, 255],
      textColor: [24, 33, 62],
      lineColor: [218, 226, 255],
      lineWidth: 0.6,
      halign: "center",
      valign: "middle",
      overflow: "linebreak",
      minCellHeight: 44,
    },
    alternateRowStyles: {
      fillColor: [251, 252, 255],
    },
    columnStyles: {
      0: { cellWidth: columnWidth },
      1: { cellWidth: columnWidth },
    },
  });
  // @ts-expect-error jspdf-autotable augmentation
  const finalY: number = doc.lastAutoTable?.finalY ?? cursor.value;
  cursor.value = finalY + LINE_HEIGHT;
}

function renderParagraphs(
  doc: jsPDF,
  text: string | null | undefined,
  cursor: Cursor
) {
  if (!text) return;
  const points = splitIntoPoints(text);
  if (points.length) {
    renderBullets(doc, points, cursor);
  } else {
    renderWrappedText(doc, text, cursor);
  }
}

function renderWrappedText(doc: jsPDF, text: string, cursor: Cursor) {
  const maxWidth = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2;
  const lines = doc.splitTextToSize(text, maxWidth);
  ensureSpace(doc, cursor, lines.length * LINE_HEIGHT + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(lines, PAGE_MARGIN_X, cursor.value, {
    align: "justify",
    maxWidth,
  });
  cursor.value += lines.length * LINE_HEIGHT + 6;
}

function renderBullets(doc: jsPDF, items: string[], cursor: Cursor) {
  const maxWidth = doc.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  items.forEach((item) => {
    const bulletText = `• ${item}`;
    const lines = doc.splitTextToSize(bulletText, maxWidth);
    ensureSpace(doc, cursor, lines.length * LINE_HEIGHT + 8);
    doc.text(lines, PAGE_MARGIN_X, cursor.value, {
      align: "justify",
      maxWidth,
    });
    cursor.value += lines.length * LINE_HEIGHT;
  });
  cursor.value += 6;
}

function renderTable(
  doc: jsPDF,
  cursor: Cursor,
  options: {
    head: string[];
    rows: string[][];
    columnStyles?: Record<
      number,
      { cellWidth?: number; minCellWidth?: number }
    >;
  }
) {
  if (!options.rows.length) return;
  ensureSpace(doc, cursor, 40);
  autoTable(doc, {
    startY: cursor.value,
    margin: {
      left: PAGE_MARGIN_X,
      right: PAGE_MARGIN_X,
      top: PAGE_MARGIN_Y,
      bottom: PAGE_MARGIN_Y,
    },
    head: [options.head],
    body: options.rows,
    styles: {
      font: "helvetica",
      fontSize: 11,
      cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
      lineColor: [220, 224, 235],
      textColor: [26, 32, 54],
      valign: "top",
    },
    headStyles: {
      fillColor: [76, 98, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    alternateRowStyles: {
      fillColor: [247, 249, 255],
    },
    columnStyles: options.columnStyles,
  });
  // @ts-expect-error jspdf-autotable augments the doc instance
  const finalY: number = doc.lastAutoTable?.finalY ?? cursor.value;
  cursor.value = finalY + LINE_HEIGHT;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "forecast-analysis"
  );
}

export function exportAnalysisPdf(analysis: ForecastAnalysis) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const cursor: Cursor = { value: PAGE_MARGIN_Y };
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Forecast Question Analysis", PAGE_MARGIN_X, cursor.value);
  cursor.value += LINE_HEIGHT + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  renderWrappedText(doc, analysis.question, cursor);

  const chips: Chip[] = [
    { label: "Verdict", value: analysis.likelihood.verdict },
    { label: "Confidence", value: analysis.likelihood.confidence },
    { label: "Time horizon", value: analysis.timeHorizon },
    { label: "Updated", value: analysis.updatedAt },
  ];
  renderChips(doc, chips, cursor);
  drawDivider(doc, cursor);

  renderSectionTitle(doc, "Summary", cursor);
  renderParagraphs(doc, analysis.shortSummary, cursor);
  renderParagraphs(doc, analysis.likelihood.narrative, cursor);
  drawDivider(doc, cursor);

  if (analysis.keyDrivers.length) {
    renderSectionTitle(doc, "Primary Drivers", cursor);
    renderTable(doc, cursor, {
      head: ["Signal", "Direction", "Detail"],
      rows: analysis.keyDrivers.map((driver) => [
        driver.title,
        driver.direction === "increase"
          ? "Strengthens true"
          : driver.direction === "decrease"
          ? "Pushes false"
          : "Mixed effect",
        driver.detail,
      ]),
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 110 },
        2: { cellWidth: pageWidth - PAGE_MARGIN_X * 2 - 230 },
      },
    });
    drawDivider(doc, cursor);
  }

  if (analysis.counterSignals.length) {
    renderSectionTitle(doc, "Counter Signals", cursor);
    renderBullets(
      doc,
      analysis.counterSignals.map(
        (signal) => `${signal.title}: ${signal.detail}`
      ),
      cursor
    );
    drawDivider(doc, cursor);
  }

  if (analysis.scenarios.length) {
    renderSectionTitle(doc, "Scenario Outlook", cursor);
    renderTable(doc, cursor, {
      head: ["Scenario", "Probability", "Summary"],
      rows: analysis.scenarios.map((scenario) => [
        scenario.name,
        `${scenario.probabilityPercent.toFixed(1)}%`,
        scenario.summary,
      ]),
      columnStyles: {
        0: { cellWidth: 160 },
        1: { cellWidth: 110 },
        2: { cellWidth: pageWidth - PAGE_MARGIN_X * 2 - 270 },
      },
    });
    drawDivider(doc, cursor);
  }

  if (analysis.monitoring.length) {
    renderSectionTitle(doc, "Signals to Monitor", cursor);
    renderTable(doc, cursor, {
      head: ["Signal", "Why it matters", "Suggested action"],
      rows: analysis.monitoring.map((item) => [
        item.item,
        item.why,
        item.action,
      ]),
      columnStyles: {
        0: { cellWidth: 160 },
        1: { cellWidth: 200 },
        2: { cellWidth: pageWidth - PAGE_MARGIN_X * 2 - 360 },
      },
    });
    drawDivider(doc, cursor);
  }

  if (analysis.recommendedSources.length) {
    renderSectionTitle(doc, "Suggested Sources", cursor);
    analysis.recommendedSources.forEach((source, index) => {
      ensureSpace(doc, cursor, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${source.title}`, PAGE_MARGIN_X, cursor.value);
      cursor.value += LINE_HEIGHT;
      renderWrappedText(doc, source.insight, cursor);
      if (source.url) {
        doc.setTextColor(69, 110, 255);
        doc.textWithLink(source.url, PAGE_MARGIN_X, cursor.value, {
          url: source.url,
        });
        cursor.value += LINE_HEIGHT;
        doc.setTextColor(0, 0, 0);
      }
      cursor.value += 6;
    });
    drawDivider(doc, cursor);
  }

  const filename = `${slugify(analysis.question)}.pdf`;
  doc.save(filename);
}
