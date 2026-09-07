import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class CvNotFoundException extends AppException {
  constructor() {
    super(ErrorCode.CV_NOT_FOUND, 'CV not found', HttpStatus.NOT_FOUND);
  }
}
