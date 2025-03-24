import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import AppResponse from '../common/dto/api-response.dto';

@ApiTags('Ví dụ')
@Controller('example')
export class ExampleController {
  @Get('admin-only')
  @AdminOnly()
  @ApiOperation({ summary: 'API chỉ dành cho quản trị viên' })
  @ApiResponse({
    status: 200,
    description: 'Thao tác thành công',
    schema: {
      example: {
        data: {
          message: 'Bạn đã truy cập thành công với quyền admin',
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  adminOnlyEndpoint() {
    return AppResponse.success({
      data: {
        message: 'Bạn đã truy cập thành công với quyền admin',
      },
    });
  }
}
