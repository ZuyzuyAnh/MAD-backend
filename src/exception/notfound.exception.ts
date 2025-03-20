import { HttpException } from '@nestjs/common';

export default class NotfoundException extends HttpException {
  constructor(entity: string, field: string, value: any) {
    super(`${entity} với ${field} ${value} không tồn tại`, 404);
  }
}
