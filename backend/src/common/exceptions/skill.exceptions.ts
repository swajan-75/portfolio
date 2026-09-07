import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class SkillNotFoundException extends AppException {
  constructor() {
    super(ErrorCode.SKILL_NOT_FOUND, 'Skill not found', HttpStatus.NOT_FOUND);
  }
}

export class SkillNameConflictException extends AppException {
  constructor() {
    super(
      ErrorCode.SKILL_NAME_CONFLICT,
      'A skill with this name already exists',
      HttpStatus.CONFLICT,
    );
  }
}
