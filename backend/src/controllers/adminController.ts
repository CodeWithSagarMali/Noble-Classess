import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';
import bcrypt from 'bcryptjs';

/**
 * Compile analytics dashboard cards, billing totals, and performance charts.
 */
export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalStudents = await prisma.studentProfile.count({ where: { status: 'APPROVED' } });
    const totalTeachers = await prisma.teacherProfile.count();
    const totalCourses = await prisma.course.count({ where: { isActive: true } });
    const totalBatches = await prisma.batch.count();
    const pendingAdmissions = await prisma.studentProfile.count({ where: { status: 'PENDING' } });

    // Financial calculations
    const paidFeesSum = await prisma.feePayment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });

    const pendingFeesSum = await prisma.feePayment.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
    });

    const totalCollected = paidFeesSum._sum.amount || 0;
    const totalOutstanding = pendingFeesSum._sum.amount || 0;

    // Course distribution count
    const courses = await prisma.course.findMany({
      select: {
        name: true,
        _count: { select: { batches: true } },
      },
    });

    // Recent registrations
    const recentStudents = await prisma.studentProfile.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNo: true,
        status: true,
        createdAt: true,
      },
    });

    // Recent support tickets
    const recentTickets = await prisma.supportTicket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { firstName: true, lastName: true } },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        cards: {
          totalStudents,
          totalTeachers,
          totalCourses,
          totalBatches,
          pendingAdmissions,
          revenueCollected: totalCollected,
          revenueOutstanding: totalOutstanding,
        },
        charts: {
          courseDistribution: courses.map((c) => ({ name: c.name, batchesCount: c._count.batches })),
          revenueOverview: [
            { name: 'Collected', value: totalCollected },
            { name: 'Outstanding', value: totalOutstanding },
          ],
        },
        recentStudents,
        recentTickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Query Audit logs
 */
export const getAuditLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // limit to latest 100 activities
    });

    res.status(200).json({
      status: 'success',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// --- COURSE MANAGEMENT ---

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, durationMonths, baseFee, syllabusLink } = req.body;
    if (!name || !durationMonths || !baseFee) {
      return next(new AppError('Course name, duration, and fee are required.', 400));
    }

    const course = await prisma.course.create({
      data: {
        name,
        description: description || '',
        durationMonths: parseInt(durationMonths),
        baseFee: parseFloat(baseFee),
        syllabusLink,
      },
    });

    res.status(201).json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ status: 'success', data: courses });
  } catch (error) {
    next(error);
  }
};

// --- BATCH MANAGEMENT ---

export const createBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, startTime, endTime, courseId, teacherId } = req.body;
    if (!name || !startTime || !endTime || !courseId) {
      return next(new AppError('Batch name, schedules, and course ID are required.', 400));
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        startTime,
        endTime,
        courseId,
        teacherId: teacherId || null,
      },
    });

    res.status(201).json({ status: 'success', data: batch });
  } catch (error) {
    next(error);
  }
};

export const getBatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        course: { select: { name: true } },
        teacher: { select: { name: true } },
        _count: { select: { students: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ status: 'success', data: batches });
  } catch (error) {
    next(error);
  }
};

// --- TEACHER MANAGEMENT ---

export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, specialization, qualifications, experience, bio } = req.body;

    if (!email || !password || !name || !phone) {
      return next(new AppError('Email, password, name, and phone are mandatory fields.', 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return next(new AppError('Email is already registered.', 400));

    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: 'TEACHER',
          isVerified: true,
        },
      });

      const profile = await tx.teacherProfile.create({
        data: {
          userId: user.id,
          name,
          phone,
          specialization: specialization || '',
          qualifications: qualifications || '',
          experience: experience || '',
          bio: bio || '',
        },
      });

      return { user, profile };
    });

    res.status(201).json({ status: 'success', data: teacher });
  } catch (error) {
    next(error);
  }
};

export const getTeachersList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ status: 'success', data: teachers });
  } catch (error) {
    next(error);
  }
};

// --- SYSTEM BACKUP (DRAFT JSON) ---

export const triggerSystemBackup = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await prisma.course.findMany();
    const batches = await prisma.batch.findMany();
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
    const students = await prisma.studentProfile.findMany();
    const payments = await prisma.feePayment.findMany();

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        courses,
        batches,
        users,
        students,
        payments,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="noble_classes_backup.json"');
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    next(error);
  }
};
