import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import AppResponse from 'src/common/dto/api-response.dto';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác thực người dùng và trả về token JWT' })
  @ApiBody({
    description: 'Thông tin đăng nhập người dùng',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          example: 'nguyenvana@example.com',
          description: 'Địa chỉ email đăng nhập',
        },
        password: {
          type: 'string',
          example: 'Password123',
          description: 'Mật khẩu đăng nhập',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT token để xác thực các yêu cầu tiếp theo',
            },
          },
        },
        statusCode: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Success',
        },
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Thông tin đăng nhập không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'null',
          example: null,
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Thông tin đăng nhập không hợp lệ',
        },
        success: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  login(@Request() req: any) {
    const token = this.authService.login(req.user);

    return AppResponse.successWithData({
      data: {
        token: token,
      },
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiBody({
    description: 'Thông tin đăng ký người dùng mới',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký người dùng thành công',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'null',
          example: null,
        },
        statusCode: {
          type: 'number',
          example: 201,
        },
        message: {
          type: 'string',
          example: 'Success',
        },
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi xác thực hoặc email đã tồn tại',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'null',
          example: null,
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example:
            "Giá trị 'nguyenvana@example.com' cho trường 'email' đã tồn tại",
        },
        success: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Dữ liệu đầu vào không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'null',
          example: null,
        },
        statusCode: {
          type: 'number',
          example: 422,
        },
        message: {
          type: 'string',
          example: 'firstName không được để trống',
        },
        success: {
          type: 'boolean',
          example: false,
        },
        errors: {
          type: 'object',
          example: {
            firstName: 'không được để trống',
            password: 'phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
          },
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);

    return AppResponse.success(undefined, HttpStatus.CREATED);
  }
}
