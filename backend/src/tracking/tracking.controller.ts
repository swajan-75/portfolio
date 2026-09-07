import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tracking')
@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('track/visit')
  @ApiOperation({ summary: 'Record an anonymous page visit (fire-and-forget)' })
  async recordVisit(@Req() req: Request) {
    await this.trackingService.recordVisit(req.ip || '');
    return { message: 'ok' };
  }

  @Post('track/downloads')
  @ApiOperation({ summary: 'Record a CV download (fire-and-forget)' })
  async recordDownload() {
    await this.trackingService.recordDownload();
    return { message: 'ok' };
  }

  @Get('admin/track/stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get visitor/download analytics' })
  getStats() {
    return this.trackingService.getStats();
  }
}
