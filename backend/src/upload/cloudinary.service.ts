import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryUploadFailedException } from '../common/exceptions/upload.exceptions';

interface UploadResult {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadImage(buffer: Buffer): Promise<UploadResult> {
    return this.upload(buffer, {
      folder: 'portfolio/projects',
      resource_type: 'image',
    });
  }

  uploadRaw(buffer: Buffer, folder: string): Promise<UploadResult> {
    return this.upload(buffer, { folder, resource_type: 'raw' });
  }

  // Best-effort cleanup — callers should log and continue on failure rather
  // than fail the whole request over a stray orphaned asset.
  async destroy(
    publicId: string,
    resourceType: 'image' | 'raw' = 'image',
  ): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      this.logger.warn(
        `Failed to delete Cloudinary asset ${publicId}: ${(error as Error).message}`,
      );
    }
  }

  private upload(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            reject(new CloudinaryUploadFailedException());
            return;
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      Readable.from(buffer).pipe(uploadStream);
    });
  }
}
