import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('files')
  @ApiOperation({ summary: 'List all available log files' })
  getLogFiles() {
    return this.logsService.getLogFiles();
  }

  @Get('content/:filename')
  @ApiOperation({ summary: 'Get content of a specific log file' })
  getLogContent(@Param('filename') filename: string) {
    return { content: this.logsService.getLogContent(filename) };
  }
}
