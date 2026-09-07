import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  ProjectNotFoundException,
  ProjectSlugConflictException,
} from '../common/exceptions/project.exceptions';

interface ProjectRow {
  id: string;
  title: string;
  category: string;
  description: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  thumbnailUrl: string | null;
  order: number;
  createdAt: Date;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // Must exactly match the frontend's client-side slug computation
  // (EditProjectForm.tsx / ProjectCard.tsx: `title.toLowerCase().replace(/\s+/g, "-")`)
  // — no punctuation stripping, no "proper" slugify library. Any deviation
  // makes PUT/DELETE by slug silently 404.
  private slugify(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  async list() {
    const projects = await this.prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return projects.map((p) => this.toResponse(p));
  }

  async create(dto: CreateProjectDto) {
    const slug = this.slugify(dto.title);
    const existing = await this.prisma.project.findUnique({ where: { slug } });
    if (existing) throw new ProjectSlugConflictException();

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description ?? '',
        category: dto.category,
        githubUrl: dto.github_url,
        liveUrl: dto.live_url,
        thumbnailUrl: dto.image_link,
        order: dto.rank ?? 0,
        techStack: dto.tech_stack ?? [],
      },
    });
    return this.toResponse(project);
  }

  async update(slug: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new ProjectNotFoundException();

    // Regenerate the slug from the new title so the *next* client-computed
    // slug (from the freshly refetched title after this save) still resolves.
    const newSlug = this.slugify(dto.title);
    const updated = await this.prisma.project.update({
      where: { id: project.id },
      data: {
        title: dto.title,
        slug: newSlug,
        description: dto.description ?? '',
        category: dto.category,
        githubUrl: dto.github_url,
        liveUrl: dto.live_url,
        thumbnailUrl: dto.image_link,
        order: dto.rank ?? 0,
        techStack: dto.tech_stack ?? [],
      },
    });
    return this.toResponse(updated);
  }

  async remove(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new ProjectNotFoundException();
    await this.prisma.project.delete({ where: { id: project.id } });
  }

  async setCover(slug: string, coverUrl: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new ProjectNotFoundException();
    const updated = await this.prisma.project.update({
      where: { id: project.id },
      data: { thumbnailUrl: coverUrl },
    });
    return this.toResponse(updated);
  }

  private toResponse(project: ProjectRow) {
    return {
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.description ?? '',
      tech_stack: project.techStack,
      github_url: project.githubUrl ?? undefined,
      live_url: project.liveUrl ?? undefined,
      image_link: project.thumbnailUrl ?? undefined,
      rank: project.order,
      // Projects.jsx sorts by `(b.created_at ?? 0) - (a.created_at ?? 0)` —
      // must be a numeric epoch, not an ISO string (else NaN, silently
      // breaking the tie-break sort).
      created_at: project.createdAt.getTime(),
    };
  }
}
