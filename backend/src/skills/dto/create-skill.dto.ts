import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SkillCategory } from '../../../generated/prisma/client';

// Mirrors CreateProjectDto's normalizeCategory: the admin form sends free
// text ("frontend", "AI/ML"), not the exact enum literal.
function normalizeCategory({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s/-]+/g, '_');
}

export class CreateSkillDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: SkillCategory })
  @Transform(normalizeCategory)
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  // Icon identifier, not a literal image URL — same convention as
  // SocialLink.icon / ProfileSkillCategorySkill.icon (a react-icons name
  // like "SiReact" or a human label resolved via resolveIconSmart).
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  proficiency?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
