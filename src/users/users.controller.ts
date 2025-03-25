import {
  Body,
  Controller,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import AppResponse from 'src/common/dto/api-response.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân người dùng' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Thông tin cập nhật và hình ảnh đại diện',
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          description: 'Tên của người dùng',
        },
        lastName: {
          type: 'string',
          description: 'Họ của người dùng',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Hình ảnh đại diện',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin thành công',
    schema: {
      example: {
        data: {
          id: 1,
          firstName: 'Nguyen',
          lastName: 'Van A',
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
          profile_image_url: 'https://example.com/images/avatar.jpg',
          role: 'user',
          isFirstTime: false,
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy người dùng',
  })
  async updateUserProfile(
    @GetUser('sub') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedUser = await this.usersService.updateUser(
      id,
      updateUserDto,
      file,
    );

    return AppResponse.success({
      data: updatedUser,
      message: 'Cập nhật thông tin thành công',
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiQuery({
    name: 'activeProgressOnly',
    required: false,
    type: Boolean,
    description:
      'Chỉ lấy tiến độ đang hoạt động (true) hoặc tất cả (false/không cung cấp)',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng',
  })
  async getProfile(@GetUser('sub') userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      return AppResponse.error('Không tìm thấy người dùng', 404);
    }

    return AppResponse.success({
      data: user,
    });
  }
}
