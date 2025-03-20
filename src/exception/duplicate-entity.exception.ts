import { HttpException } from '@nestjs/common';

export default class DuplicateEntityException extends HttpException {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} với ${field} ${value} đã tồn tại`, 409);
  }
}
