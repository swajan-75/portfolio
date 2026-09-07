import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CloudinaryService } from '../upload/cloudinary.service';
import { CvNotFoundException } from '../common/exceptions/cv.exceptions';
import {
  FileTooLargeException,
  UnsupportedFileTypeException,
} from '../common/exceptions/upload.exceptions';

const ALLOWED_CV_MIME_TYPES = ['application/pdf'];
const MAX_CV_BYTES = 5 * 1024 * 1024;

interface CvRow {
  id: string;
  name: string;
  url: string;
  active: boolean;
  createdAt: Date;
}

@Injectable()
export class CvService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async list() {
    const cvs = await this.prisma.cv.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return cvs.map((cv) => this.toResponse(cv));
  }

  async upload(name: string, file?: Express.Multer.File) {
    // Never trust client-side validation — re-check mimetype/size here.
    if (!file || !ALLOWED_CV_MIME_TYPES.includes(file.mimetype)) {
      throw new UnsupportedFileTypeException(ALLOWED_CV_MIME_TYPES);
    }
    if (file.size > MAX_CV_BYTES) {
      throw new FileTooLargeException(MAX_CV_BYTES);
    }

    const { url, publicId } = await this.cloudinary.uploadRaw(
      file.buffer,
      'portfolio/cv',
    );
    const cv = await this.prisma.cv.create({
      data: { name, url, cloudinaryPublicId: publicId, active: false },
    });
    return this.toResponse(cv);
  }

  async setActive(id: string) {
    const cv = await this.prisma.cv.findUnique({ where: { id } });
    if (!cv) throw new CvNotFoundException();

    // Only one CV active at a time — not a DB constraint, enforced here.
    await this.prisma.$transaction([
      this.prisma.cv.updateMany({
        where: { active: true },
        data: { active: false },
      }),
      this.prisma.cv.update({ where: { id }, data: { active: true } }),
    ]);
    return { message: 'CV set as active' };
  }

  async remove(id: string) {
    const cv = await this.prisma.cv.findUnique({ where: { id } });
    if (!cv) throw new CvNotFoundException();

    if (cv.cloudinaryPublicId) {
      // Best-effort — cloudinary.destroy() logs and swallows its own errors.
      await this.cloudinary.destroy(cv.cloudinaryPublicId, 'raw');
    }
    await this.prisma.cv.delete({ where: { id } });
  }

  async getActiveUrl(): Promise<{ url: string | null }> {
    const active = await this.prisma.cv.findFirst({ where: { active: true } });
    return { url: active?.url ?? null };
  }

  private toResponse(cv: CvRow) {
    return {
      id: cv.id,
      name: cv.name,
      url: cv.url,
      active: cv.active,
      created_at: cv.createdAt.getTime(),
    };
  }
}
