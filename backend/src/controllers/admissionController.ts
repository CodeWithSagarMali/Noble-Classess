import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';
import { uploadFile } from '../services/storageService';
import { generateAdmissionFormPdf } from '../services/pdfService';
import logger from '../utils/logger';

export const submitAdmissionForm = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized access.', 401));

    const { parentName, parentPhone, address, dateOfBirth, gender, courseId } = req.body;

    if (!parentName || !parentPhone || !address || !dateOfBirth || !gender || !courseId) {
      return next(new AppError('All details (parent name/phone, address, DOB, gender, course) are required.', 400));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (!files || !files['passportPhoto'] || !files['aadhaar'] || !files['marksheet']) {
      return next(new AppError('Please upload all required files (passportPhoto, aadhaar, marksheet).', 400));
    }

    // Verify course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return next(new AppError('Selected course does not exist.', 404));

    // Upload files
    const photoUrl = await uploadFile(files['passportPhoto'][0], 'passportPhotos');
    const aadhaarUrl = await uploadFile(files['aadhaar'][0], 'aadhaars');
    const marksheetUrl = await uploadFile(files['marksheet'][0], 'marksheets');

    // Generate unique Admission No
    const count = await prisma.studentProfile.count();
    const currentYear = new Date().getFullYear();
    const admissionNo = `ADM-${currentYear}-${(count + 1001)}`;

    // Update student profile
    const student = await prisma.studentProfile.update({
      where: { userId },
      data: {
        parentName,
        parentPhone,
        address,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        admissionNo,
        passportPhotoUrl: photoUrl,
        aadhaarUrl,
        marksheetUrl,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    // Create admission fee payment record
    const baseAdmissionFee = 5000; // Standard nominal admission registration fee
    const feePayment = await prisma.feePayment.create({
      data: {
        studentId: student.id,
        amount: baseAdmissionFee,
        type: 'ADMISSION',
        mode: 'ONLINE',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    // Generate provisional admission confirmation PDF buffer & link
    const pdfBuffer = await generateAdmissionFormPdf(student, course.name, 'Assigning Batch...');
    // We store this pdf locally/S3
    const pdfUrl = await uploadFile({
      buffer: pdfBuffer,
      originalname: `${admissionNo}-Form.pdf`,
      mimetype: 'application/pdf',
      size: pdfBuffer.length
    }, 'admission-receipts');

    logger.info(`Admission form PDF generated: ${pdfUrl}`);

    res.status(200).json({
      status: 'success',
      message: 'Admission form submitted successfully. Please complete the admission fee payment.',
      admissionNo,
      pdfUrl,
      admissionFee: {
        id: feePayment.id,
        amount: feePayment.amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const status = req.query.status as string;

    const queryOptions: any = {
      include: {
        user: { select: { email: true } },
        batch: { select: { name: true } },
      },
    };

    if (status) {
      queryOptions.where = { status: status as any };
    }

    const applications = await prisma.studentProfile.findMany(queryOptions);

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, batchId } = req.body; // APPROVED, REJECTED

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return next(new AppError('Invalid status update. Specify APPROVED or REJECTED.', 400));
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) return next(new AppError('Application profile not found.', 404));

    let rollNumber = student.rollNumber;
    let updateData: any = { status };

    if (status === 'APPROVED') {
      if (!batchId) {
        return next(new AppError('Please select a batch to assign to the student.', 400));
      }
      
      const batch = await prisma.batch.findUnique({ where: { id: batchId } });
      if (!batch) return next(new AppError('Assigned batch does not exist.', 404));
      
      updateData.batchId = batchId;

      if (!rollNumber) {
        const count = await prisma.studentProfile.count({
          where: { rollNumber: { not: null } },
        });
        rollNumber = `STU-${(count + 1001)}`;
        updateData.rollNumber = rollNumber;
      }
    }

    const updatedStudent = await prisma.studentProfile.update({
      where: { id },
      data: updateData,
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'ADMISSION_DECISION',
        details: `Application ${student.admissionNo} updated to ${status}. Assigned Roll: ${rollNumber || 'None'}.`,
        userId: req.user?.id,
      },
    });

    res.status(200).json({
      status: 'success',
      message: `Admission application updated to ${status}.`,
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};
