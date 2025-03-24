import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import Response from '../dto/response.dto';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response<any>>() as { statusCode: number };
    const statusCode: number = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode,
        message: 'Success',
        success: true,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
