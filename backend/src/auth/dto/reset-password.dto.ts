import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'otp must be a 6-digit code' })
  otp: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
