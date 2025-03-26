import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { VocabTopicsService } from './vocab_topics.service';
import { CreateVocabTopicDto } from './dto/create-vocab_topic.dto';
import { UpdateVocabTopicDto } from './dto/update-vocab_topic.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { VocabLevel } from './entities/vocab_topic.entity';
import AppResponse from '../common/dto/api-response.dto';

@ApiTags('Chủ đề từ vựng')
@Controller('vocab-topics')
export class VocabTopicsController {
  constructor(private readonly vocabTopicsService: VocabTopicsService) {}

  @Post()
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Tạo chủ đề từ vựng mới' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Thông tin chủ đề từ vựng và hình ảnh',
    schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Tên chủ đề từ vựng',
          example: 'Động vật',
        },
        languageId: {
          type: 'number',
          description: 'ID của ngôn ngữ',
          example: 1,
        },
        level: {
          type: 'string',
          enum: Object.values(VocabLevel),
          description: 'Cấp độ của chủ đề từ vựng',
          example: VocabLevel.BEGINNER,
        },
        imageUrl: {
          type: 'string',
          description: 'URL hình ảnh (nếu không upload file)',
          example: 'https://example.com/images/animals.jpg',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Hình ảnh minh họa cho chủ đề',
        },
      },
      required: ['topic', 'languageId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo chủ đề từ vựng thành công',
    schema: {
      example: {
        data: {
          id: 1,
          topic: 'Động vật',
          languageId: 1,
          imageUrl: 'https://example.com/images/animals.jpg',
          level: VocabLevel.BEGINNER,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo chủ đề từ vựng thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi dữ liệu đầu vào hoặc chủ đề đã tồn tại',
  })
  async create(
    @Body() createVocabTopicDto: CreateVocabTopicDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const topic = await this.vocabTopicsService.create(
      createVocabTopicDto,
      image,
    );
    return AppResponse.success({
      data: topic,
      message: 'Tạo chủ đề từ vựng thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chủ đề từ vựng' })
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
    name: 'topic',
    required: false,
    description: 'Tìm kiếm theo tên chủ đề',
    type: String,
  })
  @ApiQuery({
    name: 'languageId',
    required: false,
    description: 'Lọc theo ID ngôn ngữ',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách chủ đề từ vựng',
    schema: {
      example: {
        data: {
          data: [
            {
              id: 1,
              topic: 'Động vật',
              languageId: 1,
              imageUrl: 'https://example.com/images/animals.jpg',
              level: VocabLevel.BEGINNER,
              createdAt: '2023-08-01T12:00:00.000Z',
              updatedAt: '2023-08-01T12:00:00.000Z',
            },
            {
              id: 2,
              topic: 'Thức ăn',
              languageId: 1,
              imageUrl: 'https://example.com/images/food.jpg',
              level: VocabLevel.MEDIUM,
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
    @Query('topic') topic?: string,
    @Query('languageId') languageId?: number,
  ) {
    const result = await this.vocabTopicsService.findAll(
      paginateDto,
      topic,
      languageId,
    );
    return AppResponse.success({
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một chủ đề từ vựng' })
  @ApiParam({
    name: 'id',
    description: 'ID của chủ đề từ vựng',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết chủ đề từ vựng',
    schema: {
      example: {
        data: {
          id: 1,
          topic: 'Động vật',
          languageId: 1,
          imageUrl: 'https://example.com/images/animals.jpg',
          level: VocabLevel.BEGINNER,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
          language: {
            id: 1,
            name: 'Tiếng Anh',
            flagUrl: 'https://example.com/flags/en.png',
          },
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const topic = await this.vocabTopicsService.findOne(id);
    return AppResponse.success({
      data: topic,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin chủ đề từ vựng' })
  @ApiParam({
    name: 'id',
    description: 'ID của chủ đề từ vựng cần cập nhật',
    type: Number,
  })
  @ApiBody({
    description: 'Thông tin cập nhật cho chủ đề từ vựng',
    schema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Tên chủ đề từ vựng',
          example: 'Động vật hoang dã',
        },
        languageId: {
          type: 'number',
          description: 'ID của ngôn ngữ',
          example: 1,
        },
        level: {
          type: 'string',
          enum: Object.values(VocabLevel),
          description: 'Cấp độ của chủ đề từ vựng',
          example: VocabLevel.MEDIUM,
        },
        imageUrl: {
          type: 'string',
          description: 'URL hình ảnh (nếu không upload file)',
          example: 'https://example.com/images/wild_animals.jpg',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Hình ảnh minh họa mới cho chủ đề',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật chủ đề từ vựng thành công',
    schema: {
      example: {
        data: {
          id: 1,
          topic: 'Động vật hoang dã',
          languageId: 1,
          imageUrl: 'https://example.com/images/wild_animals.jpg',
          level: VocabLevel.MEDIUM,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-02T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật chủ đề từ vựng thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng',
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi dữ liệu đầu vào hoặc chủ đề đã tồn tại',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabTopicDto: UpdateVocabTopicDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const topic = await this.vocabTopicsService.update(
      id,
      updateVocabTopicDto,
      image,
    );
    return AppResponse.success({
      data: topic,
      message: 'Cập nhật chủ đề từ vựng thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa chủ đề từ vựng' })
  @ApiParam({
    name: 'id',
    description: 'ID của chủ đề từ vựng cần xóa',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa chủ đề từ vựng thành công',
    schema: {
      example: {
        data: null,
        statusCode: 200,
        message: 'Xóa chủ đề từ vựng thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vocabTopicsService.remove(id);
    return AppResponse.success({
      data: null,
      message: 'Xóa chủ đề từ vựng thành công',
    });
  }
}
