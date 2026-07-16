import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';
import { uploadFile } from '../services/storageService';
import logger from '../utils/logger';

/**
 * Teacher/Admin uploads a study material PDF for a course.
 */
export const uploadStudyMaterial = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized access.', 401));

    const { title, description, courseId } = req.body;
    if (!title || !courseId) {
      return next(new AppError('Title and course ID are required.', 400));
    }

    const file = req.file;
    if (!file) {
      return next(new AppError('Please upload a PDF file.', 400));
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) return next(new AppError('Selected course does not exist.', 404));

    // Upload file
    const fileUrl = await uploadFile(file, 'study-materials');

    const material = await prisma.studyMaterial.create({
      data: {
        title,
        description: description || '',
        fileUrl,
        courseId,
        uploadedBy: userId,
      },
    });

    logger.info(`Study material uploaded: ${material.id} by user ${userId}`);

    res.status(201).json({
      status: 'success',
      message: 'Study material uploaded successfully.',
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Student/Teacher/Admin fetches study materials.
 * Students see materials for their batch's course.
 * Teachers/Admins see all materials.
 */
export const getStudyMaterials = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) return next(new AppError('Unauthorized access.', 401));

    let where: any = {};

    if (user.role === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
        include: { batch: { select: { courseId: true } } },
      });

      if (!studentProfile?.batch?.courseId) {
        res.status(200).json({
          status: 'success',
          results: 0,
          data: [],
        });
        return;
      }

      where.courseId = studentProfile.batch.courseId;
    }

    const materials = await prisma.studyMaterial.findMany({
      where,
      include: {
        course: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};
