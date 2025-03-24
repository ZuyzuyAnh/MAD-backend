import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Xác thực người dùng và trả về token JWT' })
  @ApiBody({
    description: 'Thông tin đăng nhập người dùng',
    schema: {
      example: {
        username: 'exampleUser',
        password: 'examplePassword',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        statusCode: 200,
        message: 'Đăng nhập thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Thông tin đăng nhập không hợp lệ' })
  login(@Request() req: any) {
    const token = this.authService.login(req.user);

    return AppResponse.success({
      data: {
        token: token,
      },
      message: 'Đăng nhập thành công',
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiBody({
    description: 'Thông tin đăng ký người dùng mới',
    schema: {
      example: {
        first_name: 'Nguyen',
        last_name: 'Van A',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        password: 'Password123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký người dùng thành công',
    schema: {
      example: {
        data: {
          id: 1,
          firstName: 'Nguyen',
          lastName: 'Van A',
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
          role: 'user',
          isFirstTime: true,
        },
        statusCode: 200,
        message: 'Đăng ký người dùng thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi xác thực hoặc thiếu thông tin',
    schema: {
      example: {
        data: null,
        statusCode: 400,
        message: 'Xác thực thất bại',
        success: false,
        timestamp: '2023-08-01T12:00:00.000Z',
        errors: {
          username: 'Tên người dùng là bắt buộc',
          email: 'Email không hợp lệ',
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.authService.register(createUserDto);

    return AppResponse.success({
      data: createdUser,
      message: 'Đăng ký người dùng thành công',
    });
  }
}
