import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class SocialLinkNotFoundException extends AppException {
  constructor() {
    super(
      ErrorCode.PROFILE_SOCIAL_LINK_NOT_FOUND,
      'Social link not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class SkillCategoryNotFoundException extends AppException {
  constructor() {
    super(
      ErrorCode.PROFILE_SKILL_CATEGORY_NOT_FOUND,
      'Skill category not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class SkillNotFoundException extends AppException {
  constructor() {
    super(
      ErrorCode.PROFILE_SKILL_NOT_FOUND,
      'Skill not found',
      HttpStatus.NOT_FOUND,
    );
  }
}
