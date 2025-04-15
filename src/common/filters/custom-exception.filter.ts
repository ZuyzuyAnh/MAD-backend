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

@Catch(DuplicateEntityException, EntityNotFoundException, UnauthorizedException)
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

    response.status(status).json({
      statusCode: status,
      message,
      success: false,
    });
  }
}
