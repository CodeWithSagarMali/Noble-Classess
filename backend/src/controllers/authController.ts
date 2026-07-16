import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db';
import AppError from '../utils/appError';
import logger from '../utils/logger';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// `sameSite: 'none'` is required for cross-origin auth (Vercel frontend -> Railway backend)
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
};

const getAccessToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret_key_123456',
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const getRefreshToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_7891011',
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName || !phone) {
      return next(new AppError('Please fill out all basic details.', 400));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email already registered.', 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'STUDENT',
        verificationToken,
        studentProfile: {
          create: {
            firstName,
            lastName,
            phone,
            parentName: '',
            parentPhone: '',
            address: '',
            dateOfBirth: new Date(),
            gender: 'Not Specified',
            status: 'PENDING',
          },
        },
      },
    });

    // Simulate sending email
    logger.info(`[MAIL SIMULATOR] Registration Verification Token for ${email}: ${verificationToken}`);

    res.status(201).json({
      status: 'success',
      message: 'Student registered successfully. Please verify your email using the token in logs.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Generate tokens
    const accessToken = getAccessToken(user.id, user.role);
    const refreshToken = getRefreshToken(user.id, user.role);

    // Save refresh token to db
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Send tokens inside cookies and response
    // `sameSite: 'none'` is required for cross-origin auth (Vercel frontend -> Railway backend)
    res.cookie('accessToken', accessToken, {
      ...cookieOpts,
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOpts,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.role === 'STUDENT' ? user.studentProfile : user.role === 'TEACHER' ? user.teacherProfile : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;

    if (!token) {
      return next(new AppError('Refresh token missing.', 401));
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key_7891011'
    ) as { id: string; role: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== token) {
      return next(new AppError('Invalid refresh token.', 401));
    }

    // Sign new access token
    const newAccessToken = getAccessToken(user.id, user.role);
    res.cookie('accessToken', newAccessToken, {
      ...cookieOpts,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(new AppError('Invalid or expired refresh token. Please login again.', 401));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.decode(token) as { id: string } | null;
      if (decoded?.id) {
        await prisma.user.update({
          where: { id: decoded.id },
          data: { refreshToken: null },
        });
      }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification token.', 400));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new AppError('No user found with that email address.', 404));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Simulate email send
    logger.info(`[MAIL SIMULATOR] Reset Password Token for ${email}: ${resetToken}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email. Check server log output.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired.', 400));
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};
