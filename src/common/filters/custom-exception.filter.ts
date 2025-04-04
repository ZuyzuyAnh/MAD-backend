import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import AppResponse from '../dto/api-response.dto';
import DuplicateEntityException from 'src/exception/duplicate-entity.exception';
import EntityNotFoundException from 'src/exception/notfound.exception';

@Catch(Error)
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

    let status: number = HttpStatus.BAD_REQUEST;
    let message: string = 'Bad Request';

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
