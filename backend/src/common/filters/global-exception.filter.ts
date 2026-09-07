import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../constants/error-code.enum';

interface ErrorEnvelope {
  statusCode: number;
  code: ErrorCode | string;
  message: string | string[];
  path: string;
  timestamp: string;
}

const STATUS_TO_CODE: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_ERROR,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
};

const PRISMA_ERROR_MAP: Record<
  string,
  { status: HttpStatus; code: ErrorCode }
> = {
  P2002: { status: HttpStatus.CONFLICT, code: ErrorCode.CONFLICT },
  P2025: { status: HttpStatus.NOT_FOUND, code: ErrorCode.NOT_FOUND },
};

interface PrismaKnownRequestErrorLike {
  name: 'PrismaClientKnownRequestError';
  code: string;
  clientVersion: string;
}

/**
 * Duck-types Prisma.PrismaClientKnownRequestError instead of importing the
 * generated client (which is ESM and would drag import.meta into this
 * cross-cutting filter, breaking CJS test runners).
 */
function isPrismaKnownRequestError(
  exception: unknown,
): exception is PrismaKnownRequestErrorLike {
  return (
    exception instanceof Error &&
    exception.name === 'PrismaClientKnownRequestError' &&
    typeof (exception as { code?: unknown }).code === 'string' &&
    typeof (exception as { clientVersion?: unknown }).clientVersion === 'string'
  );
}

interface MulterErrorLike {
  name: 'MulterError';
  code: string;
}

// A raw Multer size-limit rejection (interceptor-level `limits`) isn't an
// HttpException — without this it would fall through to a bare 500.
function isMulterError(exception: unknown): exception is MulterErrorLike {
  return (
    exception instanceof Error &&
    exception.name === 'MulterError' &&
    typeof (exception as { code?: unknown }).code === 'string'
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message } = this.resolve(exception);

    const envelope: ErrorEnvelope = {
      statusCode: status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status} ${code}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} -> ${status} ${code}`);
    }

    response.status(status).json(envelope);
  }

  private resolve(exception: unknown): {
    status: HttpStatus;
    code: ErrorCode | string;
    message: string | string[];
  } {
    if (exception instanceof AppException) {
      return {
        status: exception.getStatus(),
        code: exception.code,
        message: this.messageOf(exception),
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return {
        status,
        code: STATUS_TO_CODE[status] ?? ErrorCode.INTERNAL_SERVER_ERROR,
        message: this.messageOf(exception),
      };
    }

    if (isPrismaKnownRequestError(exception)) {
      const mapped = PRISMA_ERROR_MAP[exception.code];
      if (mapped) {
        return {
          status: mapped.status,
          code: mapped.code,
          message: 'A database constraint was violated',
        };
      }
    }

    if (isMulterError(exception) && exception.code === 'LIMIT_FILE_SIZE') {
      return {
        status: HttpStatus.PAYLOAD_TOO_LARGE,
        code: ErrorCode.UPLOAD_FILE_TOO_LARGE,
        message: 'Uploaded file is too large',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private messageOf(exception: HttpException): string | string[] {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      (typeof response.message === 'string' || Array.isArray(response.message))
    ) {
      return (response as { message: string | string[] }).message;
    }
    return exception.message;
  }
}
