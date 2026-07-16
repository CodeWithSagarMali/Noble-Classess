import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import AppError from '../utils/appError';
import { uploadFile } from '../services/storageService';
import logger from '../utils/logger';

// --- BLOG CMS ---

export const getBlogPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const publishedOnly = req.query.publishedOnly === 'true';

    const posts = await prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : {},
      include: {
        author: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', results: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getBlogPostBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { email: true } } },
    });

    if (!post) return next(new AppError('Blog post not found.', 404));

    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, excerpt, content, category, published } = req.body;
    if (!title || !excerpt || !content || !category) {
      return next(new AppError('Required content parameters missing.', 400));
    }

    let coverImageUrl = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800';
    if (req.file) {
      coverImageUrl = await uploadFile(req.file, 'blogs');
    }

    // Slug generation
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        category,
        coverImage: coverImageUrl,
        published: published === 'true' || published === true,
        authorId: req.user!.id,
      },
    });

    res.status(201).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, published } = req.body;

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) return next(new AppError('Post not found.', 404));

    const updateData: any = {
      title,
      excerpt,
      content,
      category,
      published: published !== undefined ? (published === 'true' || published === true) : undefined,
    };

    if (req.file) {
      updateData.coverImage = await uploadFile(req.file, 'blogs');
    }

    if (title && title !== existingPost.title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const uniqueCheck = await prisma.blogPost.findUnique({ where: { slug } });
      updateData.slug = uniqueCheck ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return next(new AppError('Post not found.', 404));

    await prisma.blogPost.delete({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Post deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- TESTIMONIAL CMS ---

export const getTestimonials = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentName, courseName, text, rating, batchYear } = req.body;
    if (!studentName || !courseName || !text) {
      return next(new AppError('Required content parameters missing.', 400));
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadFile(req.file, 'testimonials');
    }

    const review = await prisma.testimonial.create({
      data: {
        studentName,
        courseName,
        text,
        rating: rating ? parseInt(rating) : 5,
        batchYear: batchYear || 'Aspirant',
        studentImage: imageUrl,
      },
    });

    res.status(201).json({ status: 'success', data: review });
  } catch (error) {
    next(error);
  }
};

// --- GALLERY CMS ---

export const getGalleryItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { albumName, caption } = req.body;
    if (!albumName || !req.file) {
      return next(new AppError('Album name and picture file are required.', 400));
    }

    const imageUrl = await uploadFile(req.file, 'gallery');

    const item = await prisma.galleryItem.create({
      data: {
        albumName,
        caption,
        imageUrl,
      },
    });

    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

// --- CONTACT FORM MODULE ---

export const submitContactEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return next(new AppError('All details name, email, phone, subject, and message are required.', 400));
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: { name, email, phone, subject, message },
    });

    // Email alert simulation
    logger.info(`[MAIL SIMULATOR] New Contact Enquiry registered from ${name}: "${subject}"`);

    res.status(201).json({
      status: 'success',
      message: 'Your enquiry has been received. Our team will get back to you shortly.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactEnquiries = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const enquiries = await prisma.contactEnquiry.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const updateContactEnquiryStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // PENDING, RESOLVED

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { status, notes },
    });

    res.status(200).json({ status: 'success', message: 'Enquiry updated successfully.', data: updated });
  } catch (error) {
    next(error);
  }
};
