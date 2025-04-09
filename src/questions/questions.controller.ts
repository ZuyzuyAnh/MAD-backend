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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
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

@ApiTags('Câu hỏi')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo câu hỏi mới',
    description:
      'Tạo một câu hỏi mới cho bài tập hoặc bài kiểm tra. Yêu cầu quyền ADMIN.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo câu hỏi thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
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
                languageId: { type: 'number', example: 1 },
                exerciseId: { type: 'number', example: 1, nullable: true },
                examId: { type: 'number', example: null, nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
            statusCode: { type: 'number', example: 201 },
            message: { type: 'string', example: 'Tạo câu hỏi thành công' },
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
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    const question = await this.questionsService.create(createQuestionDto);
    return AppResponse.successWithData({
      data: question,
      message: 'Tạo câu hỏi thành công',
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách câu hỏi',
    description:
      'Trả về danh sách các câu hỏi có phân trang, có thể lọc theo bài tập hoặc bài kiểm tra.',
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
    name: 'exerciseId',
    required: false,
    description: 'ID của bài tập cần lọc',
    type: Number,
  })
  @ApiQuery({
    name: 'examId',
    required: false,
    description: 'ID của bài kiểm tra cần lọc',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi',
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
                      language: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          name: { type: 'string', example: 'Tiếng Anh' },
                        },
                      },
                      exercise: {
                        type: 'object',
                        nullable: true,
                        properties: {
                          id: { type: 'number', example: 1 },
                          title: {
                            type: 'string',
                            example: 'Bài tập ngữ pháp cơ bản',
                          },
                        },
                      },
                      exam: {
                        type: 'object',
                        nullable: true,
                        properties: {
                          id: { type: 'number', example: null },
                          title: { type: 'string', example: null },
                        },
                      },
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
  async findAll(
    @Query() paginateDto: PaginateDto,
    @Query('exerciseId') exerciseId?: number,
    @Query('examId') examId?: number,
  ) {
    const result = await this.questionsService.findAll(
      paginateDto,
      exerciseId,
      examId,
    );
    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin một câu hỏi',
    description: 'Trả về thông tin chi tiết của một câu hỏi dựa trên ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của câu hỏi',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin câu hỏi',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
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
                language: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Tiếng Anh' },
                  },
                },
                exercise: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'number', example: 1 },
                    title: {
                      type: 'string',
                      example: 'Bài tập ngữ pháp cơ bản',
                    },
                  },
                },
                exam: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'number', example: null },
                    title: { type: 'string', example: null },
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
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const question = await this.questionsService.findOne(id);
    return AppResponse.successWithData({
      data: question,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin câu hỏi',
    description:
      'Cập nhật thông tin cho một câu hỏi hiện có. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của câu hỏi cần cập nhật',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật câu hỏi thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
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
                score: { type: 'number', example: 1.5 },
                languageId: { type: 'number', example: 1 },
                exerciseId: { type: 'number', example: 1, nullable: true },
                examId: { type: 'number', example: null, nullable: true },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Cập nhật câu hỏi thành công' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.questionsService.update(id, updateQuestionDto);
    return AppResponse.successWithData({
      data: question,
      message: 'Cập nhật câu hỏi thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa câu hỏi',
    description: 'Xóa một câu hỏi dựa trên ID. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của câu hỏi cần xóa',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa câu hỏi thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Xóa câu hỏi thành công' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.questionsService.remove(id);
    return AppResponse.successWithData({
      data: null,
      message: 'Xóa câu hỏi thành công',
    });
  }
}
