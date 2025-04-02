import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import AppResponse from '../dto/api-response.dto';
import DuplicateEntityException from 'src/exception/duplicate-entity.exception';
import EntityNotFoundException from 'src/exception/notfound.exception';

@Catch(Error)
export class CustomException implements ExceptionFilter {
  catch(
    exception: DuplicateEntityException | EntityNotFoundException,
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

    response.status(status).json({
      statusCode: status,
      message,
      success: false,
    });
  }
}
