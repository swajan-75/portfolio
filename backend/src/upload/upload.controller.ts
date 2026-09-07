import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';
import {
  FileTooLargeException,
  UnsupportedFileTypeException,
} from '../common/exceptions/upload.exceptions';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
// Interceptor-level cap is a generous hard backstop against memory abuse
// only — the explicit checks below (matching the real 2MB product
// requirement) are what normally fire and produce a clean AppException.
const MULTER_HARD_LIMIT_BYTES = 10 * 1024 * 1024;

@ApiTags('upload')
@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a project thumbnail image' })
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: MULTER_HARD_LIMIT_BYTES } }),
  )
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    // Never trust client-side validation — re-check mimetype/size here.
    if (!file || !ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      throw new UnsupportedFileTypeException(ALLOWED_IMAGE_MIME_TYPES);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new FileTooLargeException(MAX_IMAGE_BYTES);
    }

    const { url } = await this.cloudinary.uploadImage(file.buffer);
    return { url };
  }
}
