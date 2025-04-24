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
  NotFoundException,
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

    return AppResponse.successWithData({
      data: updatedUser,
      message: 'Cập nhật thông tin thành công',
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  
  async getProfile(@GetUser('sub') userId: number) {
    const data = await this.usersService.getUserProfile(userId);

    if (!data) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với id: ${userId}`,
      );
    }

    return AppResponse.successWithData({
      data,
    });
  }
}
