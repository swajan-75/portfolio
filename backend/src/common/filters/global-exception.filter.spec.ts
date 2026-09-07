import { ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { InvalidOtpException } from '../exceptions/auth.exceptions';
import { ErrorCode } from '../constants/error-code.enum';

function createHost(): {
  host: ArgumentsHost;
  json: jest.Mock;
  status: jest.Mock;
} {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status };
  const request = { method: 'POST', url: '/api/v1/auth/verify-otp' };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;

  return { host, json, status };
}

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('reshapes an AppException into the standard envelope', () => {
    const { host, json, status } = createHost();

    filter.catch(new InvalidOtpException(), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: ErrorCode.AUTH_INVALID_OTP,
        message: 'Invalid OTP',
        path: '/api/v1/auth/verify-otp',
      }),
    );
  });

  it('maps a plain Nest HttpException to a generic code', () => {
    const { host, json, status } = createHost();

    filter.catch(new NotFoundException(), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        code: ErrorCode.NOT_FOUND,
      }),
    );
  });

  it('sanitizes an unrecognized error into a generic 500 with no internal details', () => {
    const { host, json, status } = createHost();

    filter.catch(new Error('raw db connection string leaked here'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }),
    );
  });

  it('maps a Prisma-shaped unique-constraint error to 409 without importing the Prisma client', () => {
    const { host, json, status } = createHost();
    const prismaError = Object.assign(new Error('Unique constraint failed'), {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
      clientVersion: '7.0.0',
    });

    filter.catch(prismaError, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ code: ErrorCode.CONFLICT }),
    );
  });
});
