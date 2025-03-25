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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExerciseQuestionsService } from './exercise-questions.service';
import { CreateExerciseQuestionDto } from './dto/create-exercise-question.dto';
import { UpdateExerciseQuestionDto } from './dto/update-exercise-question.dto';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PaginateDto } from '../common/dto/paginate.dto';
import AppResponse from '../common/dto/api-response.dto';

@ApiTags('Câu hỏi bài tập')
@Controller('exercise-questions')
export class ExerciseQuestionsController {
  constructor(
    private readonly exerciseQuestionsService: ExerciseQuestionsService,
  ) {}

  @Post()
  @AdminOnly()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Tạo câu hỏi mới cho bài tập' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Thông tin câu hỏi và file media',
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string', example: 'Đâu là thủ đô của Việt Nam?' },
        options: {
          type: 'array',
          items: { type: 'string' },
          example: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
        },
        answer: { type: 'string', example: 'Hà Nội' },
        mediaURL: {
          type: 'string',
          example: 'https://example.com/images/hanoi.jpg',
        },
        exerciseId: { type: 'number', example: 1 },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File media cho câu hỏi (hình ảnh, âm thanh, video)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo câu hỏi thành công',
    schema: {
      example: {
        data: {
          id: 1,
          question: 'Đâu là thủ đô của Việt Nam?',
          options: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
          answer: 'Hà Nội',
          mediaURL: 'https://example.com/images/hanoi.jpg',
          exercise: {
            id: 1,
            title: 'Bài tập về địa lý Việt Nam',
          },
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo câu hỏi thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  async create(
    @Body() createDto: CreateExerciseQuestionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const question = await this.exerciseQuestionsService.create(
      createDto,
      file,
    );
    return AppResponse.success({
      data: question,
      message: 'Tạo câu hỏi thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách câu hỏi' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng kết quả mỗi trang',
    type: Number,
  })
  @ApiQuery({
    name: 'exerciseId',
    required: false,
    description: 'ID của bài tập',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi',
    schema: {
      example: {
        data: {
          data: [
            {
              id: 1,
              question: 'Đâu là thủ đô của Việt Nam?',
              options: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
              answer: 'Hà Nội',
              mediaURL: 'https://example.com/images/hanoi.jpg',
              exercise: {
                id: 1,
                title: 'Bài tập về địa lý Việt Nam',
              },
              createdAt: '2023-08-01T12:00:00.000Z',
              updatedAt: '2023-08-01T12:00:00.000Z',
            },
          ],
          meta: {
            total: 10,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  async findAll(
    @Query() paginateDto: PaginateDto,
    @Query('exerciseId') exerciseId?: number,
  ) {
    const result = await this.exerciseQuestionsService.findAll(
      paginateDto,
      exerciseId,
    );
    return AppResponse.success({
      data: result,
    });
  }

  @Get('exercise/:exerciseId')
  @ApiOperation({ summary: 'Lấy tất cả câu hỏi của một bài tập' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi của bài tập',
    schema: {
      example: {
        data: [
          {
            id: 1,
            question: 'Đâu là thủ đô của Việt Nam?',
            options: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
            answer: 'Hà Nội',
            mediaURL: 'https://example.com/images/hanoi.jpg',
            exercise: {
              id: 1,
              title: 'Bài tập về địa lý Việt Nam',
            },
            createdAt: '2023-08-01T12:00:00.000Z',
            updatedAt: '2023-08-01T12:00:00.000Z',
          },
        ],
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  async findByExerciseId(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    const questions =
      await this.exerciseQuestionsService.findAllByExerciseId(exerciseId);
    return AppResponse.success({
      data: questions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin câu hỏi',
    schema: {
      example: {
        data: {
          id: 1,
          question: 'Đâu là thủ đô của Việt Nam?',
          options: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
          answer: 'Hà Nội',
          mediaURL: 'https://example.com/images/hanoi.jpg',
          exercise: {
            id: 1,
            title: 'Bài tập về địa lý Việt Nam',
          },
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const question = await this.exerciseQuestionsService.findOne(id);
    return AppResponse.success({
      data: question,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cập nhật thông tin câu hỏi' })
  @ApiBody({
    description: 'Thông tin cập nhật câu hỏi và file media',
    schema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          example: 'Thành phố nào là thủ đô của Việt Nam?',
        },
        options: {
          type: 'array',
          items: { type: 'string' },
          example: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
        },
        answer: { type: 'string', example: 'Hà Nội' },
        mediaURL: {
          type: 'string',
          example: 'https://example.com/images/hanoi.jpg',
        },
        exerciseId: { type: 'number', example: 1 },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File media mới cho câu hỏi (hình ảnh, âm thanh, video)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật câu hỏi thành công',
    schema: {
      example: {
        data: {
          id: 1,
          question: 'Thành phố nào là thủ đô của Việt Nam?',
          options: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
          answer: 'Hà Nội',
          mediaURL: 'https://example.com/images/hanoi_updated.jpg',
          exercise: {
            id: 1,
            title: 'Bài tập về địa lý Việt Nam',
          },
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-02T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật câu hỏi thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateExerciseQuestionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const question = await this.exerciseQuestionsService.update(
      id,
      updateDto,
      file,
    );
    return AppResponse.success({
      data: question,
      message: 'Cập nhật câu hỏi thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Xóa câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Xóa câu hỏi thành công',
    schema: {
      example: {
        data: null,
        statusCode: 200,
        message: 'Xóa câu hỏi thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.exerciseQuestionsService.remove(id);
    return AppResponse.success({
      data: null,
      message: 'Xóa câu hỏi thành công',
    });
  }
}
