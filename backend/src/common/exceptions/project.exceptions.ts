import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class ProjectNotFoundException extends AppException {
  constructor() {
    super(
      ErrorCode.PROJECT_NOT_FOUND,
      'Project not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ProjectSlugConflictException extends AppException {
  constructor() {
    super(
      ErrorCode.PROJECT_SLUG_CONFLICT,
      'A project with this title already exists',
      HttpStatus.CONFLICT,
    );
  }
}
