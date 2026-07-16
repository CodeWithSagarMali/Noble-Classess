import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService';
import { generateReceiptPdf } from '../services/pdfService';
import { uploadFile } from '../services/storageService';
import logger from '../utils/logger';

/**
 * Initiates an online fee payment order via Razorpay.
 */
export const createPaymentOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return next(new AppError('Payment ID is required.', 400));

    const payment = await prisma.feePayment.findUnique({
      where: { id: paymentId },
      include: { student: true },
    });

    if (!payment) return next(new AppError('Payment record not found.', 404));
    if (payment.status === 'PAID') return next(new AppError('This fee has already been paid.', 400));

    // Create Razorpay Order
    const rzpOrder = await createRazorpayOrder(payment.amount, payment.id);

    // Save order details to payment log
    await prisma.feePayment.update({
      where: { id: paymentId },
      data: { razorpayOrderId: rzpOrder.id },
    });

    res.status(200).json({
      status: 'success',
      order: rzpOrder,
      studentDetails: {
        email: req.user?.email,
        phone: payment.student.phone,
        name: `${payment.student.firstName} ${payment.student.lastName}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verifies Razorpay payment signature and releases printable PDF receipt.
 */
export const verifyPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !paymentId) {
      return next(new AppError('Missing payment verification credentials.', 400));
    }

    const payment = await prisma.feePayment.findUnique({
      where: { id: paymentId },
      include: {
        student: {
          include: {
            batch: { select: { course: { select: { name: true } } } },
          },
        },
      },
    });

    if (!payment) return next(new AppError('Payment record not found.', 404));

    // Verify payment signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature || '');
    if (!isValid) return next(new AppError('Payment signature verification failed. Secure rejection.', 400));

    // Generate Invoice PDF
    const courseName = payment.student.batch?.course.name || 'Noble Classes Program';
    
    // Update payment record in database
    const paidPayment = await prisma.feePayment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        razorpayPaymentId,
        paidAt: new Date(),
      },
    });

    // Update Student admission payment status if it was ADMISSION fee
    if (payment.type === 'ADMISSION') {
      await prisma.studentProfile.update({
        where: { id: payment.studentId },
        data: { paymentStatus: 'PAID' },
      });
    }

    const pdfBuffer = await generateReceiptPdf(paidPayment, payment.student, courseName);
    
    // Upload invoice
    const invoiceUrl = await uploadFile({
      buffer: pdfBuffer,
      originalname: `invoice-${paidPayment.id.split('-')[0]}.pdf`,
      mimetype: 'application/pdf',
      size: pdfBuffer.length
    }, 'invoices');

    // Save invoice URL
    await prisma.feePayment.update({
      where: { id: paymentId },
      data: { invoiceUrl },
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and confirmed successfully.',
      invoiceUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Manual offline payment entry by administrator.
 */
export const addOfflinePayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId, amount, type, transactionRef, dueDate } = req.body;

    if (!studentId || !amount || !type) {
      return next(new AppError('Student ID, amount, and fee type are required.', 400));
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        batch: { select: { course: { select: { name: true } } } },
      },
    });

    if (!student) return next(new AppError('Student profile not found.', 404));

    // Create payment entry
    const payment = await prisma.feePayment.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        type,
        mode: 'OFFLINE',
        status: 'PAID',
        transactionRef: transactionRef || 'Cash Deposit',
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        paidAt: new Date(),
      },
    });

    // Generate Invoice PDF
    const courseName = student.batch?.course.name || 'General Batch';
    const pdfBuffer = await generateReceiptPdf(payment, student, courseName);
    const invoiceUrl = await uploadFile({
      buffer: pdfBuffer,
      originalname: `invoice-offline-${payment.id.split('-')[0]}.pdf`,
      mimetype: 'application/pdf',
      size: pdfBuffer.length
    }, 'invoices');

    // Update with invoice URL
    const updatedPayment = await prisma.feePayment.update({
      where: { id: payment.id },
      data: { invoiceUrl },
    });

    // Audit Log offline collections
    await prisma.auditLog.create({
      data: {
        action: 'OFFLINE_PAYMENT_ENTRY',
        details: `Offline fee registered for student ${student.firstName} ${student.lastName}. Amount: Rs.${amount}.`,
        userId: req.user?.id,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Offline payment recorded and receipt created.',
      data: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve list of outstanding/due fees.
 */
export const getPaymentsList = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentProfileId = req.query.studentId as string || req.user?.studentProfileId;

    const queryOptions: any = {
      orderBy: { dueDate: 'asc' },
    };

    if (studentProfileId) {
      queryOptions.where = { studentId: studentProfileId };
    } else {
      // Admin list of all payments
      queryOptions.include = {
        student: { select: { firstName: true, lastName: true, rollNumber: true } },
      };
    }

    const payments = await prisma.feePayment.findMany(queryOptions);

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};
