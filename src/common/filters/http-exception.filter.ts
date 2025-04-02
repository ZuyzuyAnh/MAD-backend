import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import AppResponse from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const appResponse = AppResponse.error(
      'Lỗi hệ thống',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    response.status(appResponse.statusCode).json(appResponse);
  }
}
