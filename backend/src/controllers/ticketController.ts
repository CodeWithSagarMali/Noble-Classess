import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';

export const createTicket = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) return next(new AppError('Only students can open support tickets.', 403));

    const { subject, description, priority } = req.body;
    if (!subject || !description) {
      return next(new AppError('Subject and description are required.', 400));
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        studentId: studentProfileId,
        subject,
        description,
        priority: priority || 'MEDIUM',
        status: 'OPEN',
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Support ticket registered successfully.',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isStudent = req.user?.role === 'STUDENT';
    const studentProfileId = req.user?.studentProfileId;

    const queryOptions: any = {
      include: {
        student: { select: { firstName: true, lastName: true, rollNumber: true } },
        replies: {
          include: { sender: { select: { email: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    };

    if (isStudent) {
      if (!studentProfileId) return next(new AppError('Student profile not found.', 400));
      queryOptions.where = { studentId: studentProfileId };
    }

    const tickets = await prisma.supportTicket.findMany(queryOptions);

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const replyToTicket = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // ticketId
    const { message } = req.body;
    const userId = req.user!.id;

    if (!message) return next(new AppError('Reply message is empty.', 400));

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) return next(new AppError('Support ticket not found.', 404));

    // Save reply and mark ticket update
    const reply = await prisma.$transaction(async (tx) => {
      const ticketReply = await tx.supportReply.create({
        data: {
          ticketId: id,
          senderId: userId,
          message,
        },
      });

      // Update status if it's admin replying
      const newStatus = req.user?.role !== 'STUDENT' ? 'IN_PROGRESS' : 'OPEN';
      await tx.supportTicket.update({
        where: { id },
        data: { status: newStatus, updatedAt: new Date() },
      });

      return ticketReply;
    });

    res.status(201).json({
      status: 'success',
      message: 'Reply posted successfully.',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

export const closeTicket = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) return next(new AppError('Ticket not found.', 404));

    const closedTicket = await prisma.supportTicket.update({
      where: { id },
      data: { status: 'CLOSED', updatedAt: new Date() },
    });

    res.status(200).json({
      status: 'success',
      message: 'Support ticket closed successfully.',
      data: closedTicket,
    });
  } catch (error) {
    next(error);
  }
};
