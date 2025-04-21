import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenPayloadDto } from '../dto/token-payload.dto';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: TokenPayloadDto }>();

    const user = request.user;

    console.log(user);

    if (data) {
      if (data in user) {
        return user[data as keyof TokenPayloadDto];
      }
      throw new UnauthorizedException('Yêu cầu đăng nhập vào hệ thống');
    }

    return user;
  },
);
