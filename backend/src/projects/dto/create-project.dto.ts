import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProjectCategory } from '../../../generated/prisma/client';

// AddProjectForm/EditProjectForm render category as free-text, not a
// dropdown — normalize common admin input ("web app", "Full Stack",
// "ai-ml") to the enum literal before validating, instead of 400ing on
// anything that isn't typed as the exact enum value.
function normalizeCategory({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: ProjectCategory })
  @Transform(normalizeCategory)
  @IsEnum(ProjectCategory)
  category: ProjectCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  // Deliberately @IsString(), not @IsUrl() — the form always sends "" for
  // untouched optional fields, and @IsOptional() alone does not skip
  // validation on an empty string (only on undefined/null).
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  github_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  live_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  rank?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_stack?: string[];
}
