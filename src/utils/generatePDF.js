import { jsPDF } from 'jspdf';
import { STATE_CODES } from './stateCodes';

/**
 * Generate Audit Shield PDF - Consolidated Invoice Report
 * @param {array} invoices - Array of invoice objects
 * @returns {jsPDF} - PDF document
 */
export function generateAuditShieldPDF(invoices) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Generate unique document ID
  const timestamp = new Date();
  const docId = `TG-${timestamp.getFullYear()}${String(timestamp.getMonth()+1).padStart(2,'0')}${String(timestamp.getDate()).padStart(2,'0')}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

  // Calculate summary stats
  const totalInvoices = invoices.length;
  const verifiedCount = invoices.filter(inv => inv.validationResult?.valid).length;
  const flaggedCount = totalInvoices - verifiedCount;
  const giAlertCount = invoices.filter(inv => inv.giAlerts && inv.giAlerts.length > 0).length;
  const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.extractedData?.amount) || 0), 0);
  const verifiedAmount = invoices.filter(inv => inv.validationResult?.valid).reduce((sum, inv) => sum + (parseFloat(inv.extractedData?.amount) || 0), 0);

  // Risk assessment stats
  const lowRiskCount = invoices.filter(inv => inv.risk?.level === 'LOW').length;
  const mediumRiskCount = invoices.filter(inv => inv.risk?.level === 'MEDIUM').length;
  const highRiskCount = invoices.filter(inv => inv.risk?.level === 'HIGH').length;
  const criticalRiskCount = invoices.filter(inv => inv.risk?.level === 'CRITICAL').length;

  // ========== HEADER ==========
  doc.setFillColor(31, 78, 121);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TAXGRID', 15, 18);

  doc.setFontSize(16);
  doc.text('AUDIT SHIELD', 15, 28);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Verification Report', 15, 36);

  // Document ID on right
  doc.setFontSize(9);
  doc.text(`Doc ID: ${docId}`, pageWidth - 15, 18, { align: 'right' });
  doc.text(`Generated: ${timestamp.toLocaleString('en-IN')}`, pageWidth - 15, 26, { align: 'right' });

  // ========== SUMMARY SECTION ==========
  let yPos = 50;

  doc.setTextColor(31, 78, 121);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFICATION SUMMARY', 15, yPos);

  yPos += 10;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, yPos, pageWidth - 30, 44, 'F');

  yPos += 8;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Summary stats in columns
  doc.text(`Total Invoices: ${totalInvoices}`, 20, yPos);
  doc.text(`Total Amount: Rs. ${totalAmount.toLocaleString('en-IN')}`, 100, yPos);

  yPos += 7;
  doc.setTextColor(34, 197, 94);
  doc.text(`Verified: ${verifiedCount}`, 20, yPos);
  doc.setTextColor(60, 60, 60);
  doc.text(`Verified Amount: Rs. ${verifiedAmount.toLocaleString('en-IN')}`, 100, yPos);

  yPos += 7;
  if (flaggedCount > 0) {
    doc.setTextColor(239, 68, 68);
  } else {
    doc.setTextColor(60, 60, 60);
  }
  doc.text(`Flagged (Invalid GSTIN): ${flaggedCount}`, 20, yPos);

  if (giAlertCount > 0) {
    doc.setTextColor(245, 158, 11);
    doc.text(`GI Origin Alerts: ${giAlertCount}`, 100, yPos);
  }

  // Risk Assessment Stats
  yPos += 7;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Assessment:', 20, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'normal');

  doc.setTextColor(34, 197, 94);
  doc.text(`Low: ${lowRiskCount}`, 25, yPos);

  doc.setTextColor(245, 158, 11);
  doc.text(`Medium: ${mediumRiskCount}`, 60, yPos);

  doc.setTextColor(239, 68, 68);
  doc.text(`High: ${highRiskCount}`, 95, yPos);

  doc.setTextColor(139, 0, 0);
  doc.text(`Critical: ${criticalRiskCount}`, 130, yPos);

  // ========== INVOICE TABLE ==========
  yPos += 20;
  doc.setTextColor(31, 78, 121);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DETAILS', 15, yPos);

  yPos += 8;

  // Table header
  doc.setFillColor(31, 78, 121);
  doc.rect(15, yPos, pageWidth - 30, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  const colX = [17, 28, 68, 100, 125, 152, 175];
  doc.text('#', colX[0], yPos + 7);
  doc.text('GSTIN', colX[1], yPos + 7);
  doc.text('Vendor', colX[2], yPos + 7);
  doc.text('State', colX[3], yPos + 7);
  doc.text('Amount', colX[4], yPos + 7);
  doc.text('Risk', colX[5], yPos + 7);
  doc.text('Status', colX[6], yPos + 7);

  yPos += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  invoices.forEach((inv, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos, pageWidth - 30, 10, 'F');
    }

    doc.setTextColor(60, 60, 60);
    doc.text(String(index + 1), colX[0], yPos + 7);
    doc.text((inv.extractedData?.gstin || 'N/A').substring(0, 15), colX[1], yPos + 7);
    doc.text((inv.extractedData?.vendor || 'Unknown').substring(0, 12), colX[2], yPos + 7);
    doc.text((inv.validationResult?.stateName || inv.validationResult?.stateCode || '--').substring(0, 10), colX[3], yPos + 7);
    doc.text(`${(parseFloat(inv.extractedData?.amount) || 0).toLocaleString('en-IN')}`, colX[4], yPos + 7);

    // Risk level with color
    if (inv.risk) {
      const riskLevel = inv.risk.level;
      switch(riskLevel) {
        case 'LOW':
          doc.setTextColor(34, 197, 94);
          break;
        case 'MEDIUM':
          doc.setTextColor(245, 158, 11);
          break;
        case 'HIGH':
          doc.setTextColor(239, 68, 68);
          break;
        case 'CRITICAL':
          doc.setTextColor(139, 0, 0);
          break;
        default:
          doc.setTextColor(120, 120, 120);
      }
      doc.text(riskLevel, colX[5], yPos + 7);
    } else {
      doc.setTextColor(120, 120, 120);
      doc.text('--', colX[5], yPos + 7);
    }

    // Status with color
    if (inv.validationResult?.valid) {
      if (inv.giAlerts && inv.giAlerts.length > 0) {
        doc.setTextColor(245, 158, 11);
        doc.text('GI Alert', colX[6], yPos + 7);
      } else {
        doc.setTextColor(34, 197, 94);
        doc.text('Verified', colX[6], yPos + 7);
      }
    } else {
      doc.setTextColor(239, 68, 68);
      doc.text('Invalid', colX[6], yPos + 7);
    }

    yPos += 10;
  });

  // ========== RISK ASSESSMENT SECTION ==========
  const highRiskInvoices = invoices.filter(inv =>
    inv.risk && (inv.risk.level === 'HIGH' || inv.risk.level === 'CRITICAL')
  );

  if (highRiskInvoices.length > 0) {
    yPos += 10;

    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(239, 68, 68);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️ HIGH RISK INVOICES', 15, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    highRiskInvoices.forEach((inv, idx) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      const riskColor = inv.risk.level === 'CRITICAL' ? [139, 0, 0] : [239, 68, 68];
      const bgColor = inv.risk.level === 'CRITICAL' ? [255, 240, 240] : [255, 245, 245];

      doc.setFillColor(...bgColor);
      const boxHeight = 18 + (inv.risk.reasons?.length || 0) * 5;
      doc.rect(15, yPos, pageWidth - 30, boxHeight, 'F');

      doc.setTextColor(...riskColor);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${inv.extractedData?.gstin || 'N/A'} - ${inv.risk.level} RISK (Score: ${inv.risk.score})`, 20, yPos + 6);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`Vendor: ${inv.extractedData?.vendor || 'Unknown'} | Amount: Rs. ${(parseFloat(inv.extractedData?.amount) || 0).toLocaleString('en-IN')}`, 20, yPos + 11);

      if (inv.risk.reasons && inv.risk.reasons.length > 0) {
        yPos += 15;
        doc.setFontSize(8);
        inv.risk.reasons.forEach((reason, ridx) => {
          doc.text(`  • ${reason}`, 22, yPos + (ridx * 5));
        });
        yPos += (inv.risk.reasons.length - 1) * 5;
        doc.setFontSize(9);
      }

      if (inv.recommendation) {
        yPos += 5;
        doc.setTextColor(...riskColor);
        doc.setFont('helvetica', 'bold');
        doc.text(`Recommendation: ${inv.recommendation.canClaimITC ? '✓' : '✗'} ${inv.recommendation.message}`, 20, yPos);
        doc.setFont('helvetica', 'normal');
      }

      yPos += boxHeight - 13;
    });
  }

  // ========== GI ALERTS SECTION (if any) ==========
  const invoicesWithGI = invoices.filter(inv => inv.giAlerts && inv.giAlerts.length > 0);

  if (invoicesWithGI.length > 0) {
    yPos += 10;

    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️ GI ORIGIN ALERTS', 15, yPos);

    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    invoicesWithGI.forEach(inv => {
      inv.giAlerts.forEach(alert => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFillColor(255, 250, 240);
        doc.rect(15, yPos, pageWidth - 30, 12, 'F');

        doc.text(`• ${alert.product}: Expected from ${alert.expectedRegion}, but seller is from State ${alert.actualState}`, 20, yPos + 8);
        yPos += 14;
      });
    });
  }

  // ========== DISCLAIMER ==========
  yPos = Math.max(yPos + 15, 250);

  if (yPos > 260) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(255, 248, 220);
  doc.rect(15, yPos, pageWidth - 30, 30, 'F');

  doc.setTextColor(120, 100, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DISCLAIMER', 20, yPos + 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This document provides GSTIN format validation using Luhn Mod 36 checksum algorithm.', 20, yPos + 16);
  doc.text('TaxGrid is NOT an official GST provider. For complete verification, visit: https://services.gst.gov.in', 20, yPos + 22);

  // ========== FOOTER ==========
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    doc.text('Generated by TaxGrid | Open Source | MIT License', pageWidth / 2, 295, { align: 'center' });
  }

  return doc;
}

/**
 * Download the PDF
 */
export function downloadAuditShieldPDF(invoices) {
  try {
    const doc = generateAuditShieldPDF(invoices);
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`TaxGrid_AuditShield_${timestamp}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

export default { generateAuditShieldPDF, downloadAuditShieldPDF };
