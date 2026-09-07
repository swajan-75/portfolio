import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { SetCoverDto } from './dto/set-cover.dto';

@ApiTags('projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects')
  @ApiOperation({
    summary: 'List all projects (public; also used by the admin dashboard)',
  })
  list() {
    return this.projectsService.list();
  }

  @Post('admin/projects')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a project' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Put('admin/projects/:slug')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a project by slug' })
  update(@Param('slug') slug: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.update(slug, dto);
  }

  @Delete('admin/projects/:slug')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a project by slug' })
  remove(@Param('slug') slug: string) {
    return this.projectsService.remove(slug);
  }

  @Patch('admin/projects/:slug/cover')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Set the cover photo for a project from an existing image URL',
  })
  setCover(@Param('slug') slug: string, @Body() dto: SetCoverDto) {
    return this.projectsService.setCover(slug, dto.coverUrl);
  }
}
