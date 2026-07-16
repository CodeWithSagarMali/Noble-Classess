import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';

/**
 * Teacher/Admin creates an online MCQ test.
 */
export const createExam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, durationMinutes, totalMarks, negativeMarking, batchId, scheduledAt, expiresAt, questions } = req.body;

    if (!title || !durationMinutes || !totalMarks || !batchId || !scheduledAt || !expiresAt || !questions || !Array.isArray(questions)) {
      return next(new AppError('Required parameters or questions list missing.', 400));
    }

    // Verify batch exists
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    if (!batch) return next(new AppError('Selected batch does not exist.', 404));

    // Save in transaction
    const newExam = await prisma.$transaction(async (tx) => {
      const exam = await tx.exam.create({
        data: {
          title,
          description,
          durationMinutes: parseInt(durationMinutes),
          totalMarks: parseFloat(totalMarks),
          negativeMarking: parseFloat(negativeMarking || 0),
          batchId,
          scheduledAt: new Date(scheduledAt),
          expiresAt: new Date(expiresAt),
        },
      });

      // Create Questions
      const questionsData = questions.map((q: any) => ({
        examId: exam.id,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer.toUpperCase(),
        positiveMarks: parseFloat(q.positiveMarks || 4),
        negativeMarks: parseFloat(q.negativeMarks || 1),
      }));

      await tx.question.createMany({ data: questionsData });

      return exam;
    });

    res.status(201).json({
      status: 'success',
      message: 'MCQ Exam created and published successfully.',
      data: newExam,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch exams matching the student's batch or list all for teacher/admin.
 */
export const getExams = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isStudent = req.user?.role === 'STUDENT';
    const studentProfileId = req.user?.studentProfileId;

    if (isStudent) {
      if (!studentProfileId) return next(new AppError('Student profile not loaded.', 400));

      const student = await prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
        select: { batchId: true },
      });

      if (!student || !student.batchId) {
        res.status(200).json({ status: 'success', results: 0, data: [] });
        return;
      }

      // Find exams for this student's batch
      const exams = await prisma.exam.findMany({
        where: {
          batchId: student.batchId,
          scheduledAt: { lte: new Date() }, // Only show exams that have started
        },
        include: {
          results: {
            where: { studentId: studentProfileId },
          },
        },
        orderBy: { scheduledAt: 'desc' },
      });

      res.status(200).json({
        status: 'success',
        results: exams.length,
        data: exams,
      });
      return;
    }

    // Teacher / Admin list of all exams
    const exams = await prisma.exam.findMany({
      include: {
        batch: { select: { name: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch questions for a test (Hides correctAnswer for Students).
 */
export const getExamQuestions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const isStudent = req.user?.role === 'STUDENT';
    const studentId = req.user?.studentProfileId;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!exam) return next(new AppError('Exam test not found.', 404));

    // If student, check if they have already taken it
    if (isStudent && studentId) {
      const existingResult = await prisma.examResult.findUnique({
        where: {
          examId_studentId: { examId: id, studentId },
        },
      });

      if (existingResult) {
        return next(new AppError('You have already submitted answers for this exam. Re-attempts restricted.', 400));
      }
    }

    // Strip out correctAnswer for students
    const sanitizedQuestions = exam.questions.map((q) => {
      const { correctAnswer, ...rest } = q;
      return isStudent ? rest : q;
    });

    res.status(200).json({
      status: 'success',
      exam: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        totalMarks: exam.totalMarks,
        negativeMarking: exam.negativeMarking,
      },
      questions: sanitizedQuestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Evaluate submitted student answer scripts.
 */
export const submitExamAnswers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // examId
    const { answers } = req.body; // Map format: { [questionId: string]: 'A' | 'B' | 'C' | 'D' | null }
    const studentId = req.user?.studentProfileId;

    if (!studentId) return next(new AppError('Only students can submit exam sheets.', 403));
    if (!answers) return next(new AppError('Submission contains no answer fields.', 400));

    // Verify student has not already completed the test
    const existingResult = await prisma.examResult.findUnique({
      where: {
        examId_studentId: { examId: id, studentId },
      },
    });

    if (existingResult) {
      return next(new AppError('Answers already registered for this exam.', 400));
    }

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!exam) return next(new AppError('Exam not found.', 404));

    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let marksObtained = 0.0;

    exam.questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (studentAns !== undefined && studentAns !== null && studentAns !== '') {
        attempted++;
        if (studentAns === q.correctAnswer) {
          correct++;
          marksObtained += q.positiveMarks;
        } else {
          wrong++;
          marksObtained -= q.negativeMarks;
        }
      }
    });

    // Ensure score doesn't fall below zero if configured
    if (marksObtained < 0) {
      marksObtained = 0.0;
    }

    const result = await prisma.examResult.create({
      data: {
        examId: id,
        studentId,
        totalQuestions: exam.questions.length,
        attemptedQuestions: attempted,
        correctAnswers: correct,
        wrongAnswers: wrong,
        marksObtained,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Exam evaluated successfully.',
      result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch rank scoreboard leaderboards.
 */
export const getLeaderboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // examId

    const leaderboard = await prisma.examResult.findMany({
      where: { examId: id },
      include: {
        student: {
          select: { firstName: true, lastName: true, rollNumber: true },
        },
      },
      orderBy: { marksObtained: 'desc' },
      take: 20, // top 20 rankings
    });

    res.status(200).json({
      status: 'success',
      results: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};
