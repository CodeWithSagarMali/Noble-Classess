import PDFDocument from 'pdfkit';
import logger from '../utils/logger';

/**
 * Helper to construct a PDF document inside a buffer.
 */
const getPdfBuffer = (buildDoc: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      buildDoc(doc);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a clean, professional PDF Admission Form for students.
 */
export const generateAdmissionFormPdf = (
  student: any,
  courseName: string,
  batchName: string
): Promise<Buffer> => {
  return getPdfBuffer((doc) => {
    // Header styling
    doc.fillColor('#1e3a8a').fontSize(24).text('NOBLE CLASSES', { align: 'center', bold: true } as any);
    doc.fontSize(10).fillColor('#4b5563').text('Premium Coaching Management System | Admission Receipt', { align: 'center' });
    doc.moveDown(1.5);

    // Header divider
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);

    // Application Title
    doc.fillColor('#111827').fontSize(14).text('ONLINE ADMISSION CONFIRMATION', { align: 'center', underline: true });
    doc.moveDown(1);

    // Left Column info
    const leftColumnX = 60;
    const rightColumnX = 320;
    let startY = doc.y;

    doc.fontSize(11).fillColor('#1f2937');
    doc.text(`Application No: ${student.admissionNo || 'N/A'}`, leftColumnX, startY);
    doc.text(`Date Submitted: ${new Date(student.createdAt).toLocaleDateString()}`, rightColumnX, startY);
    
    doc.moveDown(1);
    startY = doc.y;
    doc.text(`Student Name: ${student.firstName} ${student.lastName}`, leftColumnX, startY);
    doc.text(`Gender: ${student.gender}`, rightColumnX, startY);

    doc.moveDown(0.8);
    startY = doc.y;
    doc.text(`Date of Birth: ${new Date(student.dateOfBirth).toLocaleDateString()}`, leftColumnX, startY);
    doc.text(`Phone: ${student.phone}`, rightColumnX, startY);

    doc.moveDown(0.8);
    startY = doc.y;
    doc.text(`Parent Name: ${student.parentName}`, leftColumnX, startY);
    doc.text(`Parent Phone: ${student.parentPhone}`, rightColumnX, startY);

    doc.moveDown(0.8);
    startY = doc.y;
    doc.text(`Course Chosen: ${courseName}`, leftColumnX, startY);
    doc.text(`Batch Allocated: ${batchName}`, rightColumnX, startY);

    doc.moveDown(0.8);
    doc.text(`Residential Address: ${student.address}`, leftColumnX);

    doc.moveDown(1.5);
    
    // Status box
    doc.rect(50, doc.y, 495, 50).fill('#f3f4f6').stroke('#e5e7eb');
    doc.fillColor('#1e3a8a').fontSize(11).text('ADMISSION STATUS DETAILS', 70, doc.y - 42, { bold: true } as any);
    doc.fillColor('#1f2937').fontSize(10)
      .text(`Application Status: ${student.status} | Payment Verification Status: ${student.paymentStatus}`, 70, doc.y - 25);
    
    doc.moveDown(2);

    // Instructions
    doc.fillColor('#9ca3af').fontSize(9).text('Declaration: The information supplied by the applicant is verified against original records. This admission is provisional subject to regular fee payment compliance.', 50, doc.y + 40, { width: 495, align: 'justify' });
    
    // Signatures
    doc.moveDown(4);
    const signatureY = doc.y;
    doc.strokeColor('#9ca3af').lineWidth(0.5).moveTo(70, signatureY).lineTo(200, signatureY).stroke();
    doc.strokeColor('#9ca3af').lineWidth(0.5).moveTo(395, signatureY).lineTo(525, signatureY).stroke();
    
    doc.fillColor('#4b5563').fontSize(9)
      .text("Applicant's Signature", 70, signatureY + 5)
      .text('Authorized Signatory', 395, signatureY + 5);
  });
};

/**
 * Generates a beautiful PDF Payment Invoice/Receipt for student payments.
 */
export const generateReceiptPdf = (
  payment: any,
  student: any,
  courseName: string
): Promise<Buffer> => {
  return getPdfBuffer((doc) => {
    // Header
    doc.fillColor('#0f766e').fontSize(22).text('NOBLE CLASSES RECEIPT', { align: 'center', bold: true } as any);
    doc.fontSize(10).fillColor('#6b7280').text('GSTIN: 27AAAAA1111A1Z1 | Support: support@nobleclasses.com', { align: 'center' });
    doc.moveDown(1.5);

    // Border line
    doc.strokeColor('#cbd5e1').lineWidth(1.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);

    // Bill To & Invoice Info Columns
    const leftColumnX = 60;
    const rightColumnX = 320;
    let startY = doc.y;

    doc.fillColor('#1e293b').fontSize(12).text('BILL TO:', leftColumnX, startY, { bold: true } as any);
    doc.text('INVOICE DETAILS:', rightColumnX, startY, { bold: true } as any);

    doc.fontSize(10).fillColor('#334155');
    
    // Details rows
    doc.text(`Student: ${student.firstName} ${student.lastName}`, leftColumnX, startY + 20);
    doc.text(`Receipt ID: ${payment.id.split('-')[0].toUpperCase()}`, rightColumnX, startY + 20);

    doc.text(`Roll No: ${student.rollNumber || 'N/A'}`, leftColumnX, startY + 35);
    doc.text(`Payment Date: ${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Pending'}`, rightColumnX, startY + 35);

    doc.text(`Course: ${courseName}`, leftColumnX, startY + 50);
    doc.text(`Payment Mode: ${payment.mode}`, rightColumnX, startY + 50);

    doc.moveDown(4.5);

    // Table Header
    const tableY = doc.y;
    doc.rect(50, tableY, 495, 20).fill('#0f766e');
    doc.fillColor('#ffffff').fontSize(9)
      .text('Fee Description', 60, tableY + 5)
      .text('Installment / Type', 220, tableY + 5)
      .text('Payment Gateway ID', 350, tableY + 5)
      .text('Amount (INR)', 470, tableY + 5, { align: 'right' });

    // Table Row
    const rowY = tableY + 25;
    doc.fillColor('#1e293b').fontSize(9)
      .text(`Coaching Tuition / Service Fee - ${courseName}`, 60, rowY)
      .text(payment.type, 220, rowY)
      .text(payment.razorpayPaymentId || payment.transactionRef || 'N/A', 350, rowY)
      .text(`Rs. ${payment.amount.toFixed(2)}`, 470, rowY, { align: 'right' });

    // Table Footer / Total
    const footerY = rowY + 30;
    doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(50, footerY).lineTo(545, footerY).stroke();
    
    doc.fontSize(10).fillColor('#1e293b')
      .text('Total Paid Amount:', 350, footerY + 10, { bold: true } as any)
      .text(`INR ${payment.amount.toFixed(2)}`, 470, footerY + 10, { align: 'right', bold: true } as any);

    // Payment Status Stamp
    doc.rect(50, footerY + 40, 200, 35).fill(payment.status === 'PAID' ? '#dcfce7' : '#fee2e2');
    doc.fillColor(payment.status === 'PAID' ? '#15803d' : '#b91c1c').fontSize(12)
      .text(`STATUS: ${payment.status}`, 70, footerY + 52, { bold: true } as any);

    // Footer signature
    doc.fontSize(9).fillColor('#94a3b8').text('This is a computer generated receipt and does not require a physical signature.', 50, doc.y + 120, { align: 'center' });
  });
};
