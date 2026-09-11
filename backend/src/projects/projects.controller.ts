import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
  @Header('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400')
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

  @Put('admin/projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a project by id' })
  update(@Param('id') id: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete('admin/projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a project by id' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch('admin/projects/:id/cover')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Set the cover photo for a project from an existing image URL',
  })
  setCover(@Param('id') id: string, @Body() dto: SetCoverDto) {
    return this.projectsService.setCover(id, dto.coverUrl);
  }
}
