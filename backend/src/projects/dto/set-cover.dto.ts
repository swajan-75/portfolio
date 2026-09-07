import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class SetCoverDto {
  @ApiProperty({ description: 'URL of the image to use as the project cover photo' })
  @IsString()
  @IsUrl({}, { message: 'coverUrl must be a valid URL' })
  coverUrl: string;
}
