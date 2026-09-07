import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class EmailDeliveryException extends AppException {
  constructor() {
    super(
      ErrorCode.EMAIL_DELIVERY_FAILED,
      'Failed to send email',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
