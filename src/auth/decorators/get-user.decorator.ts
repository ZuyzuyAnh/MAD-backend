import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadDto } from '../dto/token-payload.dto';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: TokenPayloadDto }>();

    const user = request.user;

    if (data) {
      if (data in user) {
        return user[data as keyof TokenPayloadDto];
      }
      throw new Error(`Property ${data} does not exist on user object`);
    }

    return user;
  },
);
