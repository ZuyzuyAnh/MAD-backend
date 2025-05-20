import { ApiProperty } from '@nestjs/swagger';

export default class AppResponse<T> {
  @ApiProperty({ description: 'Dữ liệu trả về' })
  data: T;

  @ApiProperty({ description: 'Thông báo kết quả', default: 'Success' })
  message: string;

  constructor(message: string = 'Success', data: T) {
    this.message = message;
    this.data = data;
  }

  static success(message?: string): AppResponse<null> {
    return new AppResponse<null>(message, null);
  }

  static successWithData<T>(params: {
    data: T;
    message?: string;
  }): AppResponse<T> {
    return new AppResponse<T>(params.message, params.data);
  }

  static error(message: string): AppResponse<null> {
    return new AppResponse<null>(message, null);
  }
}
