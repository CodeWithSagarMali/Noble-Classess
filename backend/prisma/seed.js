"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const enums_1 = require("../src/config/enums");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Noble Classes Database...');
    // Hash standard passwords
    const adminPasswordHash = await bcryptjs_1.default.hash('admin123', 10);
    const teacherPasswordHash = await bcryptjs_1.default.hash('teacher123', 10);
    const studentPasswordHash = await bcryptjs_1.default.hash('student123', 10);
    // 1. Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@nobleclasses.com' },
        update: {},
        create: {
            email: 'admin@nobleclasses.com',
            passwordHash: adminPasswordHash,
            role: enums_1.Role.ADMIN,
            isVerified: true,
        },
    });
    console.log('Admin user seeded:', adminUser.email);
    // 2. Create courses
    const jeeCourse = await prisma.course.create({
        data: {
            name: 'IIT-JEE Ultimate Prep',
            description: 'Comprehensive preparation course for JEE Main and Advanced, covering Physics, Chemistry, and Mathematics.',
            durationMonths: 24,
            baseFee: 120000.00,
            syllabusLink: 'https://nobleclasses.com/syllabus/jee-ultimate.pdf',
            isActive: true,
        },
    });
    const neetCourse = await prisma.course.create({
        data: {
            name: 'NEET Excellence Course',
            description: 'Medical entrance exam focused training covering Biology (Botany & Zoology), Chemistry, and Physics.',
            durationMonths: 24,
            baseFee: 110000.00,
            syllabusLink: 'https://nobleclasses.com/syllabus/neet-excellence.pdf',
            isActive: true,
        },
    });
    const foundationCourse = await prisma.course.create({
        data: {
            name: 'Class 10th Board Foundation',
            description: 'Foundation courses for high school board exams combined with NTSE and Olympiad level mathematics and science.',
            durationMonths: 12,
            baseFee: 45000.00,
            syllabusLink: 'https://nobleclasses.com/syllabus/foundation-10.pdf',
            isActive: true,
        },
    });
    console.log('Courses seeded.');
    // 3. Create teacher user and TeacherProfile
    const teacherUser = await prisma.user.upsert({
        where: { email: 'teacher@nobleclasses.com' },
        update: {},
        create: {
            email: 'teacher@nobleclasses.com',
            passwordHash: teacherPasswordHash,
            role: enums_1.Role.TEACHER,
            isVerified: true,
        },
    });
    const teacherProfile = await prisma.teacherProfile.create({
        data: {
            userId: teacherUser.id,
            name: 'Dr. Ramesh Kumar',
            phone: '+919876543210',
            specialization: 'Physics & Applied Mathematics',
            qualifications: 'Ph.D. in Physics from IIT Bombay',
            experience: '12+ Years teaching JEE aspirants',
            bio: 'Dr. Ramesh Kumar is a pioneer in physics education, helping over 500+ students secure ranks under AIR 1000 in IIT-JEE.',
        },
    });
    console.log('Teacher profile seeded.');
    // 4. Create batches
    const jeeMorningBatch = await prisma.batch.create({
        data: {
            name: 'JEE 2027 Morning Batch A',
            startTime: '07:00 AM',
            endTime: '11:00 AM',
            courseId: jeeCourse.id,
            teacherId: teacherProfile.id,
        },
    });
    const neetBatch = await prisma.batch.create({
        data: {
            name: 'NEET 2027 Evening Batch B',
            startTime: '04:00 PM',
            endTime: '08:00 PM',
            courseId: neetCourse.id,
            teacherId: teacherProfile.id,
        },
    });
    console.log('Batches seeded.');
    // 5. Create student user and StudentProfile (linked to JEE morning batch)
    const studentUser = await prisma.user.upsert({
        where: { email: 'student@nobleclasses.com' },
        update: {},
        create: {
            email: 'student@nobleclasses.com',
            passwordHash: studentPasswordHash,
            role: enums_1.Role.STUDENT,
            isVerified: true,
        },
    });
    const studentProfile = await prisma.studentProfile.create({
        data: {
            userId: studentUser.id,
            firstName: 'Rahul',
            lastName: 'Sharma',
            phone: '+919988776655',
            parentName: 'Sanjay Sharma',
            parentPhone: '+919988776600',
            address: 'Flat 402, Royal Residency, Pune, Maharashtra',
            dateOfBirth: new Date('2009-08-15'),
            gender: 'Male',
            rollNumber: 'STU-001',
            admissionNo: 'ADM-2026-0001',
            batchId: jeeMorningBatch.id,
            status: enums_1.AdmissionStatus.APPROVED,
            paymentStatus: enums_1.PaymentStatus.PAID,
        },
    });
    console.log('Student profile seeded.');
    // 6. Create some sample attendance records
    await prisma.attendance.createMany({
        data: [
            {
                date: new Date('2026-07-10T00:00:00.000Z'),
                studentId: studentProfile.id,
                batchId: jeeMorningBatch.id,
                status: enums_1.AttendanceStatus.PRESENT,
                uploadedBy: teacherUser.id,
            },
            {
                date: new Date('2026-07-11T00:00:00.000Z'),
                studentId: studentProfile.id,
                batchId: jeeMorningBatch.id,
                status: enums_1.AttendanceStatus.PRESENT,
                uploadedBy: teacherUser.id,
            },
            {
                date: new Date('2026-07-12T00:00:00.000Z'),
                studentId: studentProfile.id,
                batchId: jeeMorningBatch.id,
                status: enums_1.AttendanceStatus.ABSENT,
                uploadedBy: teacherUser.id,
            },
        ],
    });
    // 7. Create Fee Payments
    await prisma.feePayment.createMany({
        data: [
            {
                studentId: studentProfile.id,
                amount: 30000.00,
                type: enums_1.FeeType.ADMISSION,
                mode: enums_1.PaymentMode.ONLINE,
                status: enums_1.PaymentStatus.PAID,
                razorpayOrderId: 'order_mock_seed123',
                razorpayPaymentId: 'pay_mock_seed123',
                dueDate: new Date('2026-06-01'),
                paidAt: new Date('2026-06-01T10:00:00Z'),
                invoiceUrl: '/uploads/invoices/mock_invoice_1.pdf',
            },
            {
                studentId: studentProfile.id,
                amount: 45000.00,
                type: enums_1.FeeType.TUITION,
                mode: enums_1.PaymentMode.ONLINE,
                status: enums_1.PaymentStatus.PAID,
                razorpayOrderId: 'order_mock_seed456',
                razorpayPaymentId: 'pay_mock_seed456',
                dueDate: new Date('2026-07-01'),
                paidAt: new Date('2026-07-02T11:30:00Z'),
                invoiceUrl: '/uploads/invoices/mock_invoice_2.pdf',
            },
            {
                studentId: studentProfile.id,
                amount: 45000.00,
                type: enums_1.FeeType.TUITION,
                mode: enums_1.PaymentMode.ONLINE,
                status: enums_1.PaymentStatus.PENDING,
                dueDate: new Date('2026-12-01'),
            },
        ],
    });
    // 8. Create an MCQ test exam
    const exam = await prisma.exam.create({
        data: {
            title: 'JEE Physics - Kinematics & Mechanics Mock',
            description: 'Online test assessing Newton Laws of Motion, Projectile Motion and Circular Motion. Includes negative marking.',
            durationMinutes: 45,
            totalMarks: 20,
            negativeMarking: 1.0,
            batchId: jeeMorningBatch.id,
            scheduledAt: new Date('2026-07-01T09:00:00Z'),
            expiresAt: new Date('2026-08-31T23:59:59Z'),
        },
    });
    // Create questions
    await prisma.question.createMany({
        data: [
            {
                examId: exam.id,
                questionText: 'A ball is thrown vertically upwards with a velocity of 20 m/s. What is the maximum height attained by the ball? (Take g = 10 m/s²)',
                optionA: '10 meters',
                optionB: '15 meters',
                optionC: '20 meters',
                optionD: '25 meters',
                correctAnswer: 'C',
                positiveMarks: 4.0,
                negativeMarks: 1.0,
            },
            {
                examId: exam.id,
                questionText: 'A particle moves along a circle of radius R with a constant speed v. What is the magnitude of average acceleration during half a revolution?',
                optionA: 'v²/R',
                optionB: '2v²/πR',
                optionC: 'v²/πR',
                optionD: 'Zero',
                correctAnswer: 'B',
                positiveMarks: 4.0,
                negativeMarks: 1.0,
            },
            {
                examId: exam.id,
                questionText: 'If the net external force acting on a body is zero, then its acceleration is:',
                optionA: 'Constantly changing',
                optionB: 'Zero',
                optionC: 'Infinity',
                optionD: 'Depends on friction coefficient',
                correctAnswer: 'B',
                positiveMarks: 4.0,
                negativeMarks: 1.0,
            },
            {
                examId: exam.id,
                questionText: 'Which of the following forces is a non-conservative force?',
                optionA: 'Gravitational Force',
                optionB: 'Electrostatic Force',
                optionC: 'Frictional Force',
                optionD: 'Elastic Spring Force',
                correctAnswer: 'C',
                positiveMarks: 4.0,
                negativeMarks: 1.0,
            },
            {
                examId: exam.id,
                questionText: 'The work-energy theorem states that the work done by all forces on a system equals the change in its:',
                optionA: 'Potential Energy',
                optionB: 'Kinetic Energy',
                optionC: 'Mechanical Energy',
                optionD: 'Momentum',
                correctAnswer: 'B',
                positiveMarks: 4.0,
                negativeMarks: 1.0,
            },
        ],
    });
    // Create student exam result
    await prisma.examResult.create({
        data: {
            examId: exam.id,
            studentId: studentProfile.id,
            totalQuestions: 5,
            attemptedQuestions: 5,
            correctAnswers: 4,
            wrongAnswers: 1,
            marksObtained: 15.0, // (4 * 4) - (1 * 1) = 15
        },
    });
    // 9. Gallery Items
    await prisma.galleryItem.createMany({
        data: [
            { imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600', albumName: 'Classrooms', caption: 'State-of-the-art interactive smart boards.' },
            { imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600', albumName: 'Campus', caption: 'High-school research labs and study hall.' },
            { imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600', albumName: 'Events', caption: '2025 Academic Achievers felicitation ceremony.' },
        ],
    });
    // 10. Testimonials
    await prisma.testimonial.createMany({
        data: [
            { studentName: 'Aditya Sen', courseName: 'IIT-JEE prep', rating: 5, text: 'The guidance here is top-notch. Dr. Ramesh Kumar explains complex physics concepts in a visual and intuitive way. Highly recommended!', batchYear: 'JEE AIR 142 (2025)' },
            { studentName: 'Priya Patel', courseName: 'NEET Prep', rating: 5, text: 'Mock test series and individual student analysis maps helped me trace my weak areas and score 680+ in NEET.', batchYear: 'NEET AIR 235 (2025)' },
        ],
    });
    // 11. Blog Posts
    await prisma.blogPost.create({
        data: {
            title: 'How to Crack JEE Advanced Physics in 6 Months',
            slug: 'crack-jee-advanced-physics-6-months',
            excerpt: 'Struggling with advanced physics problems? Here are the 5 core methodologies recommended by top rankers and expert faculty.',
            content: '<p>JEE Advanced requires a deep visual understanding of mechanics and electromagnetism. Instead of memorizing formulas, students must practice deriving equations from fundamental axioms. Work out at least 20 multi-concept problems daily and analyze errors.</p>',
            coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
            category: 'Academic Tips',
            published: true,
            authorId: adminUser.id,
        },
    });
    // 12. Support tickets
    const ticket = await prisma.supportTicket.create({
        data: {
            studentId: studentProfile.id,
            subject: 'Issue downloading Physics syllabus PDF',
            description: 'Getting a 404 error when clicking on the download syllabus link inside the dashboard.',
            priority: enums_1.TicketPriority.MEDIUM,
            status: enums_1.TicketStatus.OPEN,
        },
    });
    await prisma.supportReply.create({
        data: {
            ticketId: ticket.id,
            senderId: adminUser.id,
            message: 'Hello Rahul, we are updating the servers. It will be online in 10 minutes. Please check again soon.',
        },
    });
    // 13. Audit logs
    await prisma.auditLog.create({
        data: {
            action: 'DATABASE_SEED',
            details: 'System initial seed executed successfully.',
            ipAddress: '127.0.0.1',
            userId: adminUser.id,
        },
    });
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map