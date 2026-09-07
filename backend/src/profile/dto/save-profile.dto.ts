import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class EducationInfoDto {
  @ApiProperty()
  @IsString()
  degree: string;

  @ApiProperty()
  @IsString()
  institution: string;
}

class StatDto {
  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsString()
  label: string;
}

class HighlightDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtext?: string;
}

// AdminAbout.tsx's handleSave() POSTs the entire spread `GET /profile`
// response (`{...data, education_info, tech_tags, stats, highlights}`), so
// this DTO must declare every field that response can contain. Fields with
// their own dedicated CRUD endpoints (`socials`, `skill_categories`) and the
// legacy flat `skills`/`education` fields are accepted-but-ignored here —
// with the global ValidationPipe's `forbidNonWhitelisted: true`, omitting
// them would 400 on every "Save Changes" click.
export class SaveProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ type: EducationInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EducationInfoDto)
  education_info?: EducationInfoDto;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_tags?: string[];

  @ApiPropertyOptional({ type: [StatDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats?: StatDto[];

  @ApiPropertyOptional({ type: [HighlightDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HighlightDto)
  highlights?: HighlightDto[];

  // Accepted-but-ignored — see class comment.
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  socials?: unknown[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  skill_categories?: unknown[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  skills?: unknown[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;
}
