import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSkillDto } from './dto/create-skill.dto';

@ApiTags('skills')
@Controller()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get('skills')
  @ApiOperation({
    summary: 'List all skills (public; powers the /skills page)',
  })
  list() {
    return this.skillsService.list();
  }

  @Post('admin/skills')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a skill' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Put('admin/skills/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a skill by id' })
  update(@Param('id') id: string, @Body() dto: CreateSkillDto) {
    return this.skillsService.update(id, dto);
  }

  @Delete('admin/skills/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a skill by id' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
