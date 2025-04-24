// src/exams/exams.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginateDto } from '../common/dto/paginate.dto';
import AppResponse from '../common/dto/api-response.dto';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ExamType } from './entities/exam.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Bài kiểm tra')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get('completed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy số lượng bài kiểm tra đã hoàn thành',
    description: 'Trả về số lượng bài kiểm tra mà người dùng đã hoàn thành',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                count: { type: 'number', example: 5 },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Success' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  async countCompletedExams(@GetUser('sub') userId: number) {
    const data = await this.examsService.getCompletedAmount(userId);

    return AppResponse.successWithData({
      data,
    });
  }

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy tổng quan về bài kiểm tra',
    description:
      'Trả về thông tin tổng quan về bài kiểm tra của người dùng bao gồm tiến độ và kết quả',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin tổng quan thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                totalExams: { type: 'number', example: 10 },
                completedExams: { type: 'number', example: 5 },
                averageScore: { type: 'number', example: 85.5 },
                highestScore: { type: 'number', example: 98 },
                recentExams: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      title: {
                        type: 'string',
                        example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
                      },
                      score: { type: 'number', example: 85 },
                      completedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Success' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  async getExamsOverview(@GetUser('sub') userId: number) {
    const overview = await this.examsService.getExamsOverview(userId);
    return AppResponse.successWithData({
      data: overview,
    });
  }

  @Post()
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo bài kiểm tra mới',
    description: 'Tạo một bài kiểm tra mới. Yêu cầu quyền ADMIN.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo bài kiểm tra thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                title: {
                  type: 'string',
                  example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
                },
                type: {
                  type: 'string',
                  enum: Object.values(ExamType),
                  example: ExamType.WEEKLY,
                },
                week: { type: 'number', example: 3, nullable: true },
                languageId: { type: 'number', example: 1 },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            statusCode: { type: 'number', example: 201 },
            message: { type: 'string', example: 'Tạo bài kiểm tra thành công' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách bài kiểm tra',
    description:
      'Trả về danh sách các bài kiểm tra có phân trang, có thể lọc theo loại, ngôn ngữ hoặc tuần.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng kết quả tối đa mỗi trang',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Loại bài kiểm tra',
    enum: ExamType,
  })
  @ApiQuery({
    name: 'languageId',
    required: false,
    description: 'ID của ngôn ngữ',
    type: Number,
  })
  @ApiQuery({
    name: 'week',
    required: false,
    description: 'Tuần của bài kiểm tra (chỉ có ý nghĩa với loại weekly)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài kiểm tra',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      title: {
                        type: 'string',
                        example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
                      },
                      type: {
                        type: 'string',
                        enum: Object.values(ExamType),
                        example: ExamType.WEEKLY,
                      },
                      week: { type: 'number', example: 3, nullable: true },
                      language: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          name: { type: 'string', example: 'Tiếng Anh' },
                          flagUrl: {
                            type: 'string',
                            example: 'https://example.com/flags/en.png',
                          },
                        },
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                meta: {
                  type: 'object',
                  properties: {
                    total: { type: 'number', example: 30 },
                    page: { type: 'number', example: 1 },
                    limit: { type: 'number', example: 10 },
                    totalPages: { type: 'number', example: 3 },
                    hasNextPage: { type: 'boolean', example: true },
                    hasPreviousPage: { type: 'boolean', example: false },
                  },
                },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Success' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() paginateDto: PaginateDto,
    @Query('type') type: ExamType,
    @GetUser('sub') userId: number,
  ) {
    return this.examsService.findAll(paginateDto, userId, type);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết bài kiểm tra',
    description:
      'Trả về thông tin chi tiết của một bài kiểm tra dựa trên ID, bao gồm cả danh sách câu hỏi.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài kiểm tra',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết bài kiểm tra',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                title: {
                  type: 'string',
                  example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
                },
                type: {
                  type: 'string',
                  enum: Object.values(ExamType),
                  example: ExamType.WEEKLY,
                },
                week: { type: 'number', example: 3, nullable: true },
                language: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Tiếng Anh' },
                    flagUrl: {
                      type: 'string',
                      example: 'https://example.com/flags/en.png',
                    },
                  },
                },
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      type: { type: 'string', example: 'multiple_choice' },
                      question: {
                        type: 'string',
                        example: 'What is the capital of France?',
                      },
                      options: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Paris', 'London', 'Berlin', 'Rome'],
                      },
                      answer: { type: 'string', example: 'Paris' },
                      score: { type: 'number', example: 1.0 },
                    },
                  },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Success' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài kiểm tra',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(+id);
  }

  @Patch(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin bài kiểm tra',
    description:
      'Cập nhật thông tin cho một bài kiểm tra hiện có. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài kiểm tra cần cập nhật',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật bài kiểm tra thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                title: {
                  type: 'string',
                  example: 'Kiểm tra ngữ pháp tiếng Anh tuần 4 (Đã cập nhật)',
                },
                type: {
                  type: 'string',
                  enum: Object.values(ExamType),
                  example: ExamType.WEEKLY,
                },
                week: { type: 'number', example: 4, nullable: true },
                languageId: { type: 'number', example: 1 },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Cập nhật bài kiểm tra thành công',
            },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài kiểm tra',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @Delete(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa bài kiểm tra',
    description:
      'Xóa một bài kiểm tra dựa trên ID, nhưng không xóa các câu hỏi liên quan. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài kiểm tra cần xóa',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa bài kiểm tra thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Xóa bài kiểm tra thành công' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài kiểm tra',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  remove(@Param('id') id: string) {
    return this.examsService.remove(+id);
  }
}
