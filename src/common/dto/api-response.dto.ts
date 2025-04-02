import { ApiProperty } from '@nestjs/swagger';

export default class AppResponse<T> {
  @ApiProperty({ description: 'Dữ liệu trả về' })
  data: T;

  @ApiProperty({ description: 'Mã trạng thái HTTP', default: 200 })
  statusCode: number;

  @ApiProperty({ description: 'Thông báo kết quả', default: 'Success' })
  message: string;

  @ApiProperty({ description: 'Trạng thái thành công', default: true })
  success: boolean;

  constructor(
    data: T,
    statusCode: number = 200,
    message: string = 'Success',
    success: boolean = true,
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.success = success;
  }

  static success(message?: string): AppResponse<null> {
    return new AppResponse<null>(null, 200, message || 'Success');
  }

  static successWithData<T>(params: {
    data: T;
    message?: string;
  }): AppResponse<T> {
    return new AppResponse<T>(params.data, 200, params.message || 'Success');
  }

  static error(message: string, statusCode: number = 400): AppResponse<null> {
    return new AppResponse<null>(null, statusCode, message, false);
  }
}
