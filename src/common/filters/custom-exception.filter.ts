import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import DuplicateEntityException from 'src/exception/duplicate-entity.exception';
import EntityNotFoundException from 'src/exception/notfound.exception';
import { QueryFailedError } from 'typeorm';

@Catch(
  DuplicateEntityException,
  EntityNotFoundException,
  UnauthorizedException,
  QueryFailedError,
)
export class CustomException implements ExceptionFilter {
  catch(
    exception:
      | DuplicateEntityException
      | EntityNotFoundException
      | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Lỗi không xác định';

    if (exception instanceof DuplicateEntityException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }
    if (exception instanceof EntityNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }
    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Thông tin xác thực không hợp lệ';
    }
    if (exception instanceof QueryFailedError) {
      const errorCode = 'code' in exception ? exception.code : undefined;

      if (errorCode === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Dữ liệu đã tồn tại';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      success: false,
    });
  }
}
