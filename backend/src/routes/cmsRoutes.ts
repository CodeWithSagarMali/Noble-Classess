import { Router } from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getTestimonials,
  createTestimonial,
  getGalleryItems,
  createGalleryItem,
  submitContactEnquiry,
  getContactEnquiries,
  updateContactEnquiryStatus,
} from '../controllers/cmsController';
import { protect, restrictTo } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

// Blogs
router.get('/blogs', getBlogPosts);
router.get('/blogs/:slug', getBlogPostBySlug);
router.post('/blogs', protect, restrictTo('ADMIN'), upload.single('coverImage'), createBlogPost);
router.patch('/blogs/:id', protect, restrictTo('ADMIN'), upload.single('coverImage'), updateBlogPost);
router.delete('/blogs/:id', protect, restrictTo('ADMIN'), deleteBlogPost);

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', protect, restrictTo('ADMIN'), upload.single('studentImage'), createTestimonial);

// Gallery
router.get('/gallery', getGalleryItems);
router.post('/gallery', protect, restrictTo('ADMIN'), upload.single('image'), createGalleryItem);

// Contact enquiries
router.post('/contact', submitContactEnquiry);
router.get('/enquiries', protect, restrictTo('ADMIN'), getContactEnquiries);
router.patch('/enquiries/:id', protect, restrictTo('ADMIN'), updateContactEnquiryStatus);

export default router;
