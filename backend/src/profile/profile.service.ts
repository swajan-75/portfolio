import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma.service';
import { SaveProfileDto } from './dto/save-profile.dto';
import { SocialLinkDto } from './dto/social-link.dto';
import { SkillCategoryDto } from './dto/skill-category.dto';
import { SkillItemDto } from './dto/skill-item.dto';
import {
  SkillCategoryNotFoundException,
  SkillNotFoundException,
  SocialLinkNotFoundException,
} from '../common/exceptions/profile.exceptions';

const PROFILE_INCLUDE = {
  socialLinks: { orderBy: { order: 'asc' as const } },
  skillCategories: {
    orderBy: { order: 'asc' as const },
    include: { skills: { orderBy: { order: 'asc' as const } } },
  },
};

type ProfileWithRelations = Prisma.ProfileGetPayload<{
  include: typeof PROFILE_INCLUDE;
}>;

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  // The site has exactly one Profile "document" — auto-create it the first
  // time it's needed, mirroring AuthService.sendOtp's admin auto-create.
  private async getOrCreateProfile(): Promise<ProfileWithRelations> {
    const existing = await this.prisma.profile.findFirst({
      include: PROFILE_INCLUDE,
    });
    if (existing) return existing;

    return this.prisma.profile.create({
      data: {
        fullName: '',
        headline: '',
        bio: '',
        email: process.env.SMTP_USER || '',
      },
      include: PROFILE_INCLUDE,
    });
  }

  async getPublicProfile() {
    const profile = await this.getOrCreateProfile();
    const educationInfo = (profile.educationInfo as {
      degree?: string;
      institution?: string;
    } | null) ?? {
      degree: '',
      institution: '',
    };

    return {
      name: profile.fullName,
      title: profile.headline,
      subtitle: profile.subtitle ?? '',
      bio: profile.bio,
      education: educationInfo.degree ?? '',
      location: profile.location ?? '',
      skills: profile.skillCategories.flatMap((category) =>
        category.skills.map((s) => s.name),
      ),
      socials: profile.socialLinks.map((link) => ({
        platform: link.platform,
        url: link.url,
        icon: link.icon ?? undefined,
      })),
      skill_categories: profile.skillCategories.map((category) => ({
        id: category.id,
        title: category.title,
        description: category.description ?? '',
        icon: category.icon ?? '',
        col_span: category.colSpan,
        skills: category.skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          icon: skill.icon ?? '',
        })),
      })),
      education_info: educationInfo,
      tech_tags: profile.techTags,
      stats: profile.stats,
      highlights: profile.highlights,
    };
  }

  // Whole-document save from AdminAbout.tsx's "Save Changes". Only updates
  // the scalar/JSON fields that section actually edits; `socials`,
  // `skill_categories`, `skills`, and `education` are present in the DTO
  // purely so the whitelist ValidationPipe doesn't reject the spread payload
  // — they are intentionally NOT applied here (each has its own CRUD route).
  async saveDocument(dto: SaveProfileDto) {
    const profile = await this.getOrCreateProfile();
    return this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        fullName: dto.name,
        headline: dto.title,
        subtitle: dto.subtitle,
        bio: dto.bio,
        location: dto.location,
        educationInfo: dto.education_info as unknown as
          Prisma.InputJsonValue | undefined,
        techTags: dto.tech_tags,
        stats: dto.stats as unknown as Prisma.InputJsonValue[] | undefined,
        highlights: dto.highlights as unknown as
          Prisma.InputJsonValue[] | undefined,
      },
    });
  }

  // ── Contacts (social links) — positional index against `order asc` ──
  // Known limitation: the frontend addresses these by array index, not a
  // stable ID, so a concurrent edit between a GET and this mutation could
  // target the wrong row. Not fixable without a frontend change.

  async addContact(dto: SocialLinkDto) {
    const profile = await this.getOrCreateProfile();
    const nextOrder = nextOrderAfter(profile.socialLinks);
    return this.prisma.socialLink.create({
      data: {
        platform: dto.platform,
        url: dto.url,
        icon: dto.icon,
        order: nextOrder,
        profileId: profile.id,
      },
    });
  }

  async updateContactByIndex(index: number, dto: SocialLinkDto) {
    const profile = await this.getOrCreateProfile();
    const link = profile.socialLinks[index];
    if (!link) throw new SocialLinkNotFoundException();
    return this.prisma.socialLink.update({
      where: { id: link.id },
      data: { platform: dto.platform, url: dto.url, icon: dto.icon },
    });
  }

  async removeContactByIndex(index: number) {
    const profile = await this.getOrCreateProfile();
    const link = profile.socialLinks[index];
    if (!link) throw new SocialLinkNotFoundException();
    await this.prisma.socialLink.delete({ where: { id: link.id } });
  }

  // ── Skill categories — positional index against `order asc` ──

  async addCategory(dto: SkillCategoryDto) {
    const profile = await this.getOrCreateProfile();
    const nextOrder = nextOrderAfter(profile.skillCategories);
    return this.prisma.profileSkillCategory.create({
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
        colSpan: dto.col_span ?? 1,
        order: nextOrder,
        profileId: profile.id,
        skills: {
          create: (dto.skills ?? []).map((skill, i) => ({
            name: skill.name,
            icon: skill.icon,
            order: i,
          })),
        },
      },
    });
  }

  async updateCategoryByIndex(catIndex: number, dto: SkillCategoryDto) {
    const profile = await this.getOrCreateProfile();
    const category = profile.skillCategories[catIndex];
    if (!category) throw new SkillCategoryNotFoundException();
    // Deliberately does not touch the `skills` relation — dto.skills is
    // accepted only for whitelist compatibility (see SkillCategoryDto).
    return this.prisma.profileSkillCategory.update({
      where: { id: category.id },
      data: {
        title: dto.title,
        description: dto.description,
        icon: dto.icon,
        colSpan: dto.col_span,
      },
    });
  }

  async removeCategoryByIndex(catIndex: number) {
    const profile = await this.getOrCreateProfile();
    const category = profile.skillCategories[catIndex];
    if (!category) throw new SkillCategoryNotFoundException();
    await this.prisma.profileSkillCategory.delete({
      where: { id: category.id },
    }); // cascades to skills
  }

  // ── Skills nested within a category — positional index one level deeper ──

  async addSkillToCategory(catIndex: number, dto: SkillItemDto) {
    const profile = await this.getOrCreateProfile();
    const category = profile.skillCategories[catIndex];
    if (!category) throw new SkillCategoryNotFoundException();
    const nextOrder = nextOrderAfter(category.skills);
    return this.prisma.profileSkillCategorySkill.create({
      data: {
        name: dto.name,
        icon: dto.icon,
        order: nextOrder,
        categoryId: category.id,
      },
    });
  }

  async updateSkillInCategory(
    catIndex: number,
    skillIndex: number,
    dto: SkillItemDto,
  ) {
    const profile = await this.getOrCreateProfile();
    const category = profile.skillCategories[catIndex];
    if (!category) throw new SkillCategoryNotFoundException();
    const skill = category.skills[skillIndex];
    if (!skill) throw new SkillNotFoundException();
    return this.prisma.profileSkillCategorySkill.update({
      where: { id: skill.id },
      data: { name: dto.name, icon: dto.icon },
    });
  }

  async removeSkillFromCategory(catIndex: number, skillIndex: number) {
    const profile = await this.getOrCreateProfile();
    const category = profile.skillCategories[catIndex];
    if (!category) throw new SkillCategoryNotFoundException();
    const skill = category.skills[skillIndex];
    if (!skill) throw new SkillNotFoundException();
    await this.prisma.profileSkillCategorySkill.delete({
      where: { id: skill.id },
    });
  }
}

function nextOrderAfter(items: { order: number }[]): number {
  return items.length ? Math.max(...items.map((i) => i.order)) + 1 : 0;
}
