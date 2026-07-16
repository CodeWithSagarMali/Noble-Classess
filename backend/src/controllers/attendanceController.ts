import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';
import { parseAttendanceExcel, generateAttendanceTemplate } from '../services/excelService';
import logger from '../utils/logger';

/**
 * Download the Excel template structure for attendance uploads.
 */
export const downloadTemplate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const templateBuffer = generateAttendanceTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance_template.xlsx"');
    res.status(200).send(templateBuffer);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle attendance excel upload and process student registers.
 */
export const uploadAttendanceExcel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { batchId } = req.body;
    if (!batchId) return next(new AppError('Batch ID is required.', 400));

    if (!req.file) return next(new AppError('Please upload an Excel file.', 400));

    // Verify batch exists
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { students: true },
    });
    if (!batch) return next(new AppError('Selected batch does not exist.', 404));

    // Parse Excel Workbook
    const { records, errors: parsingErrors } = parseAttendanceExcel(req.file.buffer);

    // If there are initial parser/format errors, return immediately
    if (parsingErrors.length > 0) {
      res.status(400).json({
        status: 'fail',
        message: 'Formatting errors found in the spreadsheet.',
        errors: parsingErrors,
      });
      return;
    }

    const teacherUserId = req.user?.id || 'SYSTEM';

    let successCount = 0;
    let duplicateCount = 0;
    const rowErrors: string[] = [];

    // Map batch students by roll number
    const studentRollMap = new Map(
      batch.students
        .filter((s) => s.rollNumber)
        .map((s) => [s.rollNumber!.toLowerCase(), s.id])
    );

    // Process attendance row-by-row
    for (const record of records) {
      const rollLower = record.rollNumber.toLowerCase();
      const studentId = studentRollMap.get(rollLower);

      if (!studentId) {
        rowErrors.push(
          `Row ${record.row}: Student with roll number "${record.rollNumber}" does not belong to this batch.`
        );
        continue;
      }

      // Check if attendance already exists for this student on this day
      // Normalize Date to midnight for accurate day tracking
      const recordDate = new Date(record.date);
      recordDate.setUTCHours(0, 0, 0, 0);

      const existingRecord = await prisma.attendance.findFirst({
        where: {
          studentId,
          batchId,
          date: recordDate,
        },
      });

      if (existingRecord) {
        duplicateCount++;
        continue; // Skip duplicates silently or increment counter
      }

      try {
        await prisma.attendance.create({
          data: {
            date: recordDate,
            studentId,
            batchId,
            status: record.status,
            uploadedBy: teacherUserId,
          },
        });
        successCount++;
      } catch (dbErr: any) {
        logger.error(`Database error on row ${record.row}`, dbErr);
        rowErrors.push(`Row ${record.row}: Failed to insert database record.`);
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Attendance processing complete.',
      summary: {
        totalParsed: records.length,
        inserted: successCount,
        skippedDuplicates: duplicateCount,
        failed: rowErrors.length,
      },
      errors: rowErrors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate attendance metrics and analytics reports.
 */
export const getAttendanceReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentProfileId = req.query.studentId as string || req.user?.studentProfileId;
    const batchId = req.query.batchId as string;

    if (!studentProfileId && !batchId) {
      return next(new AppError('Please specify studentId or batchId.', 400));
    }

    // Student specific attendance details
    if (studentProfileId) {
      const attendanceRecords = await prisma.attendance.findMany({
        where: { studentId: studentProfileId },
        orderBy: { date: 'desc' },
      });

      const total = attendanceRecords.length;
      const present = attendanceRecords.filter((r) => r.status === 'PRESENT').length;
      const absent = attendanceRecords.filter((r) => r.status === 'ABSENT').length;
      const late = attendanceRecords.filter((r) => r.status === 'LATE').length;

      const percentage = total > 0 ? ((present + late * 0.5) / total) * 100 : 100;

      res.status(200).json({
        status: 'success',
        reportType: 'student',
        analytics: {
          totalDays: total,
          presentCount: present,
          absentCount: absent,
          lateCount: late,
          attendancePercentage: Math.round(percentage),
        },
        records: attendanceRecords,
      });
      return;
    }

    // Batch specific attendance statistics (for admin/teacher)
    const attendanceRecords = await prisma.attendance.findMany({
      where: { batchId },
      include: {
        student: {
          select: { firstName: true, lastName: true, rollNumber: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      reportType: 'batch',
      results: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
};
