import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveProfileDto } from './dto/save-profile.dto';
import { SocialLinkDto } from './dto/social-link.dto';
import { SkillCategoryDto } from './dto/skill-category.dto';
import { SkillItemDto } from './dto/skill-item.dto';

@ApiTags('profile')
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get the public profile document' })
  getProfile() {
    return this.profileService.getPublicProfile();
  }

  @Post('admin/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Save the profile document (bio, education info, tech tags, stats, highlights)',
  })
  saveProfile(@Body() dto: SaveProfileDto) {
    return this.profileService.saveDocument(dto);
  }

  @Post('admin/profile/contacts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a social/contact link' })
  addContact(@Body() dto: SocialLinkDto) {
    return this.profileService.addContact(dto);
  }

  @Put('admin/profile/contacts/:index')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a social/contact link by position' })
  updateContact(
    @Param('index', ParseIntPipe) index: number,
    @Body() dto: SocialLinkDto,
  ) {
    return this.profileService.updateContactByIndex(index, dto);
  }

  @Delete('admin/profile/contacts/:index')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a social/contact link by position' })
  removeContact(@Param('index', ParseIntPipe) index: number) {
    return this.profileService.removeContactByIndex(index);
  }

  @Post('admin/profile/skill-categories')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a skills showcase category' })
  addCategory(@Body() dto: SkillCategoryDto) {
    return this.profileService.addCategory(dto);
  }

  @Put('admin/profile/skill-categories/:catIndex')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a skills showcase category by position' })
  updateCategory(
    @Param('catIndex', ParseIntPipe) catIndex: number,
    @Body() dto: SkillCategoryDto,
  ) {
    return this.profileService.updateCategoryByIndex(catIndex, dto);
  }

  @Delete('admin/profile/skill-categories/:catIndex')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a skills showcase category by position' })
  removeCategory(@Param('catIndex', ParseIntPipe) catIndex: number) {
    return this.profileService.removeCategoryByIndex(catIndex);
  }

  @Post('admin/profile/skill-categories/:catIndex/skills')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a skill to a showcase category' })
  addSkill(
    @Param('catIndex', ParseIntPipe) catIndex: number,
    @Body() dto: SkillItemDto,
  ) {
    return this.profileService.addSkillToCategory(catIndex, dto);
  }

  @Put('admin/profile/skill-categories/:catIndex/skills/:skillIndex')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a skill within a showcase category by position',
  })
  updateSkill(
    @Param('catIndex', ParseIntPipe) catIndex: number,
    @Param('skillIndex', ParseIntPipe) skillIndex: number,
    @Body() dto: SkillItemDto,
  ) {
    return this.profileService.updateSkillInCategory(catIndex, skillIndex, dto);
  }

  @Delete('admin/profile/skill-categories/:catIndex/skills/:skillIndex')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Remove a skill from a showcase category by position',
  })
  removeSkill(
    @Param('catIndex', ParseIntPipe) catIndex: number,
    @Param('skillIndex', ParseIntPipe) skillIndex: number,
  ) {
    return this.profileService.removeSkillFromCategory(catIndex, skillIndex);
  }
}
