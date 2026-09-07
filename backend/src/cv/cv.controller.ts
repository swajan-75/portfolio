import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CvService } from './cv.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadCvDto } from './dto/upload-cv.dto';

// Interceptor-level cap is a generous hard backstop only — the explicit
// 5MB check in CvService.upload() is what normally fires.
const MULTER_HARD_LIMIT_BYTES = 10 * 1024 * 1024;

@ApiTags('cv')
@Controller()
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get('admin/cv')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all CV records' })
  list() {
    return this.cvService.list();
  }

  @Post('admin/cv')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new CV (PDF)' })
  @UseInterceptors(
    FileInterceptor('cv', { limits: { fileSize: MULTER_HARD_LIMIT_BYTES } }),
  )
  upload(@Body() dto: UploadCvDto, @UploadedFile() file?: Express.Multer.File) {
    return this.cvService.upload(dto.name, file);
  }

  @Put('admin/cv/:id/active')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set a CV as the active one' })
  setActive(@Param('id') id: string) {
    return this.cvService.setActive(id);
  }

  @Delete('admin/cv/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a CV' })
  remove(@Param('id') id: string) {
    return this.cvService.remove(id);
  }

  @Get('cv/active')
  @ApiOperation({ summary: 'Get the currently active CV URL (public)' })
  getActive() {
    return this.cvService.getActiveUrl();
  }
}
