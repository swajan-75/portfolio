import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from 'class-validator';

export class ReorderProjectsDto {
  @ApiProperty({
    type: [String],
    description: 'Every project id, in the desired display order (first = top)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  ids: string[];
}
