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
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Thông tin đăng nhập không hợp lệ',
    schema: {
      example: {
        data: null,
        statusCode: 401,
        message: 'Thông tin đăng nhập không hợp lệ',
        success: false,
      },
    },
  })
  login(@Request() req: any) {
    try {
      const token = this.authService.login(req.user);
      return AppResponse.successWithData({
        data: {
          token: token,
        },
        message: 'Đăng nhập thành công',
      });
    } catch {
      return AppResponse.error('Thông tin đăng nhập không hợp lệ', 401);
    }
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
        data: null,
        statusCode: 200,
        message: 'Đăng ký người dùng thành công',
        success: true,
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
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.authService.register(createUserDto);

    return AppResponse.success('Đăng ký người dùng thành công');
  }
}
