import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class UnauthorizedEmailException extends AppException {
  constructor() {
    super(
      ErrorCode.AUTH_UNAUTHORIZED_EMAIL,
      'Unauthorized email',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidOtpRequestException extends AppException {
  constructor(message = 'Invalid OTP request') {
    super(ErrorCode.AUTH_INVALID_OTP_REQUEST, message, HttpStatus.UNAUTHORIZED);
  }
}

export class OtpExpiredException extends AppException {
  constructor() {
    super(
      ErrorCode.AUTH_OTP_EXPIRED,
      'OTP has expired',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidOtpException extends AppException {
  constructor() {
    super(ErrorCode.AUTH_INVALID_OTP, 'Invalid OTP', HttpStatus.UNAUTHORIZED);
  }
}

export class GoogleNoUserException extends AppException {
  constructor() {
    super(
      ErrorCode.AUTH_GOOGLE_NO_USER,
      'No user from Google',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class GoogleProfileInvalidException extends AppException {
  constructor() {
    super(
      ErrorCode.AUTH_GOOGLE_PROFILE_INVALID,
      'Google profile did not include a usable email',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
