import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// Standard local uploads directory path
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Uploads a file buffer to storage.
 * If AWS credentials are set, it uploads to S3. Otherwise, it stores it locally.
 * Returns the public URL / static path to the file.
 */
export const uploadFile = async (
  file: UploadedFile,
  folder: string = 'documents'
): Promise<string> => {
  const extension = path.extname(file.originalname);
  const fileName = `${folder}/${uuidv4()}${extension}`;

  const s3Enabled =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME;

  if (s3Enabled) {
    try {
      // In production, we import aws-sdk or @aws-sdk/client-s3 dynamically
      // To prevent import/install errors if not configured, we simulate it if SDK is missing
      // or if we want to run out of the box, we can do dynamic import.
      // For this system, we'll write a clean dynamic loader or fallback.
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
      
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || 'ap-south-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      const bucketName = process.env.AWS_S3_BUCKET_NAME!;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      logger.info(`File uploaded to S3: ${fileName}`);
      return `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${fileName}`;
    } catch (error) {
      logger.error('S3 upload error, falling back to local storage', error);
    }
  }

  // Local Storage Fallback
  try {
    const targetFolder = path.join(UPLOAD_DIR, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const localFileName = `${uuidv4()}${extension}`;
    const filePath = path.join(targetFolder, localFileName);
    fs.writeFileSync(filePath, file.buffer);

    logger.info(`File saved locally: ${folder}/${localFileName}`);
    return `/uploads/${folder}/${localFileName}`;
  } catch (error) {
    logger.error('Local file write error', error);
    throw new Error('Failed to save file to storage.');
  }
};

/**
 * Deletes a file from storage.
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  if (!fileUrl) return;

  if (fileUrl.startsWith('/uploads/')) {
    // Local delete
    const relativePath = fileUrl.replace('/uploads/', '');
    const fullPath = path.join(UPLOAD_DIR, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      logger.info(`Local file deleted: ${relativePath}`);
    }
  } else if (fileUrl.includes('amazonaws.com')) {
    // S3 delete
    const s3Enabled =
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET_NAME;

    if (s3Enabled) {
      try {
        const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
        const s3Client = new S3Client({
          region: process.env.AWS_REGION || 'ap-south-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });

        // Parse key from URL
        const bucketName = process.env.AWS_S3_BUCKET_NAME!;
        const urlParts = fileUrl.split(`${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/`);
        if (urlParts.length > 1) {
          const key = urlParts[1];
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: key,
            })
          );
          logger.info(`File deleted from S3: ${key}`);
        }
      } catch (error) {
        logger.error('S3 delete error', error);
      }
    }
  }
};
