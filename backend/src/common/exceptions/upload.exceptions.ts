import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from '../constants/error-code.enum';

export class UnsupportedFileTypeException extends AppException {
  constructor(allowed: string[]) {
    super(
      ErrorCode.UPLOAD_UNSUPPORTED_FILE_TYPE,
      `Unsupported file type. Allowed: ${allowed.join(', ')}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class FileTooLargeException extends AppException {
  constructor(maxBytes: number) {
    super(
      ErrorCode.UPLOAD_FILE_TOO_LARGE,
      `File exceeds the maximum allowed size of ${Math.floor(maxBytes / (1024 * 1024))}MB`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CloudinaryUploadFailedException extends AppException {
  constructor() {
    super(
      ErrorCode.UPLOAD_FAILED,
      'Failed to upload file',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
