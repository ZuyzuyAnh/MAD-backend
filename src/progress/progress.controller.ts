import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Tiến độ học tập')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo tiến độ học tập mới cho người dùng' })
  @ApiBody({
    description: 'Thông tin tiến độ học tập',
    type: CreateProgressDto,
    schema: {
      example: {
        languageId: 1,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo tiến độ thành công',
    schema: {
      example: {
        data: {
          id: 1,
          userId: 1,
          courseId: 1,
          lessonId: 1,
          languageId: 1,
          isCurrentActive: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo tiến độ thành công',
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
    schema: {
      example: {
        data: null,
        statusCode: 400,
        message: 'courseId là trường bắt buộc',
        success: false,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
    schema: {
      example: {
        data: null,
        statusCode: 401,
        message: 'Chưa xác thực',
        success: false,
      },
    },
  })
  create(
    @Body() createProgressDto: CreateProgressDto,
    @GetUser('sub') id: number,
  ) {
    return this.progressService.create(id, createProgressDto);
  }

  @Get('user/:userId/language/:languageId')
  @ApiOperation({ summary: 'Lấy tiến độ học tập theo người dùng và ngôn ngữ' })
  @ApiParam({
    name: 'userId',
    description: 'ID của người dùng',
    type: 'number',
  })
  @ApiParam({
    name: 'languageId',
    description: 'ID của ngôn ngữ',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy tiến độ thành công',
    schema: {
      example: {
        data: [
          {
            id: 1,
            userId: 1,
            courseId: 1,
            lessonId: 3,
            languageId: 1,
            isCurrentActive: true,
            createdAt: '2023-08-01T12:00:00.000Z',
            updatedAt: '2023-08-01T12:00:00.000Z',
          },
        ],
        statusCode: 200,
        message: 'Success',
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ',
    schema: {
      example: {
        data: null,
        statusCode: 404,
        message: 'Không tìm thấy tiến độ học tập',
        success: false,
      },
    },
  })
  findByUserAndLanguage(
    @Param('userId') userId: string,
    @Param('languageId') languageId: string,
  ) {
    return this.progressService.findByUserAndLanguage(+userId, +languageId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tiến độ học tập' })
  @ApiParam({
    name: 'id',
    description: 'ID của tiến độ học tập',
    type: 'number',
  })
  @ApiBody({
    description: 'Thông tin cập nhật tiến độ học tập',
    type: UpdateProgressDto,
    schema: {
      example: {
        lessonId: 4,
        isCurrentActive: true,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật tiến độ thành công',
    schema: {
      example: {
        data: {
          id: 1,
          userId: 1,
          courseId: 1,
          lessonId: 4,
          languageId: 1,
          isCurrentActive: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T14:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật tiến độ thành công',
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ',
    schema: {
      example: {
        data: null,
        statusCode: 404,
        message: 'Không tìm thấy tiến độ học tập với id: 1',
        success: false,
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update(+id, updateProgressDto);
  }
}
