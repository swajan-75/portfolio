import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import {
  SkillNameConflictException,
  SkillNotFoundException,
} from '../common/exceptions/skill.exceptions';

interface SkillRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  iconUrl: string | null;
  url: string | null;
  proficiency: number;
  featured: boolean;
  order: number;
}

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const skills = await this.prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
    return skills.map((s) => this.toResponse(s));
  }

  async create(dto: CreateSkillDto) {
    const existing = await this.prisma.skill.findUnique({
      where: { name: dto.name },
    });
    if (existing) throw new SkillNameConflictException();

    const order = dto.order ?? (await this.nextOrder());
    const skill = await this.prisma.skill.create({
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        iconUrl: dto.icon,
        url: dto.url,
        proficiency: dto.proficiency ?? 3,
        featured: dto.featured ?? false,
        order,
      },
    });
    return this.toResponse(skill);
  }

  async update(id: string, dto: CreateSkillDto) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new SkillNotFoundException();

    const updated = await this.prisma.skill.update({
      where: { id },
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        iconUrl: dto.icon,
        url: dto.url,
        proficiency: dto.proficiency,
        featured: dto.featured,
        order: dto.order,
      },
    });
    return this.toResponse(updated);
  }

  async remove(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new SkillNotFoundException();
    await this.prisma.skill.delete({ where: { id } });
  }

  private async nextOrder(): Promise<number> {
    const last = await this.prisma.skill.findFirst({
      orderBy: { order: 'desc' },
    });
    return last ? last.order + 1 : 0;
  }

  private toResponse(skill: SkillRow) {
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? '',
      icon: skill.iconUrl ?? '',
      url: skill.url ?? undefined,
      proficiency: skill.proficiency,
      featured: skill.featured,
      order: skill.order,
    };
  }
}
