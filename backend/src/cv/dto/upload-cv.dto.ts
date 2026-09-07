import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadCvDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
