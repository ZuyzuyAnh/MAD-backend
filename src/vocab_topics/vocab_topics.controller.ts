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
  HttpStatus,
  ParseFilePipeBuilder,
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
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { VocabLevel } from './entities/vocab_topic.entity';
import AppResponse from '../common/dto/api-response.dto';

/**
 * Controller xử lý các thao tác liên quan đến chủ đề từ vựng
 */
@ApiTags('Chủ đề từ vựng')
@Controller('vocab-topics')
export class VocabTopicsController {
  constructor(private readonly vocabTopicsService: VocabTopicsService) {}

  /**
   * Tạo chủ đề từ vựng mới
   */
  @Post()
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Tạo chủ đề từ vựng mới',
    description:
      'Tạo chủ đề từ vựng mới với thông tin cơ bản và hình ảnh minh họa. Yêu cầu quyền ADMIN.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Thông tin chi tiết của chủ đề từ vựng và hình ảnh minh họa',
    schema: {
      type: 'object',
      required: ['topic', 'languageId'],
      properties: {
        topic: {
          type: 'string',
          description: 'Tên chủ đề từ vựng',
          example: 'Động vật',
          minLength: 3,
          maxLength: 100,
        },
        languageId: {
          type: 'number',
          description: 'ID của ngôn ngữ mà chủ đề này thuộc về',
          example: 1,
        },
        level: {
          type: 'string',
          enum: Object.values(VocabLevel),
          description: 'Cấp độ của chủ đề từ vựng',
          example: VocabLevel.BEGINNER,
          default: VocabLevel.BEGINNER,
        },
        imageUrl: {
          type: 'string',
          description: 'URL hình ảnh (nếu không upload file)',
          example: 'https://example.com/images/animals.jpg',
          nullable: true,
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'File hình ảnh minh họa cho chủ đề',
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo chủ đề từ vựng thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                topic: { type: 'string', example: 'Động vật' },
                languageId: { type: 'number', example: 1 },
                imageUrl: {
                  type: 'string',
                  example: 'https://example.com/images/animals.jpg',
                },
                level: {
                  type: 'string',
                  enum: Object.values(VocabLevel),
                  example: VocabLevel.BEGINNER,
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-08-01T12:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-08-01T12:00:00.000Z',
                },
              },
            },
            statusCode: { type: 'number', example: 201 },
            message: {
              type: 'string',
              example: 'Tạo chủ đề từ vựng thành công',
            },
            success: { type: 'boolean', example: true },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi dữ liệu đầu vào hoặc chủ đề đã tồn tại',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 400 },
            message: {
              type: 'string',
              example: 'Chủ đề từ vựng "Động vật" đã tồn tại',
            },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập - Token không hợp lệ hoặc hết hạn',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không đủ quyền - Yêu cầu quyền ADMIN',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Forbidden resource' },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  async create(
    @Body() createVocabTopicDto: CreateVocabTopicDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    image?: Express.Multer.File,
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

  /**
   * Lấy danh sách chủ đề từ vựng
   */
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách chủ đề từ vựng',
    description:
      'Trả về danh sách các chủ đề từ vựng có phân trang và các tùy chọn lọc',
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
    name: 'topic',
    required: false,
    description: 'Tìm kiếm theo tên chủ đề (tìm kiếm mờ)',
    type: String,
    example: 'động vật',
  })
  @ApiQuery({
    name: 'languageId',
    required: false,
    description: 'Lọc theo ID ngôn ngữ',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách chủ đề từ vựng thành công',
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
                      topic: { type: 'string', example: 'Động vật' },
                      languageId: { type: 'number', example: 1 },
                      imageUrl: {
                        type: 'string',
                        example: 'https://example.com/images/animals.jpg',
                      },
                      level: {
                        type: 'string',
                        enum: Object.values(VocabLevel),
                        example: VocabLevel.BEGINNER,
                      },
                      vocabCount: {
                        type: 'number',
                        description: 'Số lượng từ vựng trong chủ đề',
                        example: 20,
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-08-01T12:00:00.000Z',
                      },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-08-01T12:00:00.000Z',
                      },
                    },
                  },
                },
                meta: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'number',
                      description: 'Tổng số bản ghi',
                      example: 30,
                    },
                    page: {
                      type: 'number',
                      description: 'Trang hiện tại',
                      example: 1,
                    },
                    limit: {
                      type: 'number',
                      description: 'Số bản ghi mỗi trang',
                      example: 10,
                    },
                    totalPages: {
                      type: 'number',
                      description: 'Tổng số trang',
                      example: 3,
                    },
                    hasNextPage: {
                      type: 'boolean',
                      description: 'Có trang tiếp theo không',
                      example: true,
                    },
                    hasPreviousPage: {
                      type: 'boolean',
                      description: 'Có trang trước đó không',
                      example: false,
                    },
                  },
                },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Success' },
            success: { type: 'boolean', example: true },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
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

  /**
   * Lấy thông tin chi tiết một chủ đề từ vựng
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết một chủ đề từ vựng',
    description: 'Trả về thông tin chi tiết về một chủ đề từ vựng dựa trên ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của chủ đề từ vựng',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin chủ đề từ vựng thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                topic: { type: 'string', example: 'Động vật' },
                languageId: { type: 'number', example: 1 },
                imageUrl: {
                  type: 'string',
                  example: 'https://example.com/images/animals.jpg',
                },
                level: {
                  type: 'string',
                  enum: Object.values(VocabLevel),
                  example: VocabLevel.BEGINNER,
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-08-01T12:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-08-01T12:00:00.000Z',
                },
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
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Success' },
            success: { type: 'boolean', example: true },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng với ID đã cung cấp',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'Không tìm thấy chủ đề từ vựng với id 999',
            },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-01T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const topic = await this.vocabTopicsService.findOne(id);
    return AppResponse.success({
      data: topic,
    });
  }

  /**
   * Cập nhật thông tin chủ đề từ vựng
   */
  @Patch(':id')
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin chủ đề từ vựng',
    description:
      'Cập nhật thông tin cho một chủ đề từ vựng hiện có. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của chủ đề từ vựng cần cập nhật',
    type: Number,
    example: 1,
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
          description: 'ID của ngôn ngữ mà chủ đề này thuộc về',
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
          nullable: true,
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'File hình ảnh minh họa mới cho chủ đề',
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật chủ đề từ vựng thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                topic: { type: 'string', example: 'Động vật hoang dã' },
                languageId: { type: 'number', example: 1 },
                imageUrl: {
                  type: 'string',
                  example: 'https://example.com/images/wild_animals.jpg',
                },
                level: {
                  type: 'string',
                  enum: Object.values(VocabLevel),
                  example: VocabLevel.MEDIUM,
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-08-01T12:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-08-02T12:00:00.000Z',
                },
              },
            },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Cập nhật chủ đề từ vựng thành công',
            },
            success: { type: 'boolean', example: true },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-02T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi dữ liệu đầu vào hoặc chủ đề đã tồn tại',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 400 },
            message: {
              type: 'string',
              example: 'Chủ đề từ vựng "Động vật hoang dã" đã tồn tại',
            },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-02T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng với ID đã cung cấp',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'Không tìm thấy chủ đề từ vựng với id 999',
            },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-02T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập - Token không hợp lệ hoặc hết hạn',
  })
  @ApiResponse({
    status: 403,
    description: 'Không đủ quyền - Yêu cầu quyền ADMIN',
  })
  @ApiResponse({
    status: 422,
    description: 'File không hợp lệ (kích thước, định dạng)',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 422 },
            message: {
              type: 'string',
              example: 'Validation failed (expected size is less than 5MB)',
            },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-02T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabTopicDto: UpdateVocabTopicDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    image?: Express.Multer.File,
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

  /**
   * Xóa chủ đề từ vựng
   */
  @Delete(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa chủ đề từ vựng',
    description: 'Xóa một chủ đề từ vựng dựa trên ID. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của chủ đề từ vựng cần xóa',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa chủ đề từ vựng thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Xóa chủ đề từ vựng thành công',
            },
            success: { type: 'boolean', example: true },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-02T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng với ID đã cung cấp',
  })
  @ApiResponse({
    status: 401,
    description: 'Không có quyền truy cập - Token không hợp lệ hoặc hết hạn',
  })
  @ApiResponse({
    status: 403,
    description: 'Không đủ quyền - Yêu cầu quyền ADMIN',
  })
  @ApiResponse({
    status: 409,
    description:
      'Không thể xóa vì chủ đề này đang được sử dụng bởi từ vựng hoặc bài tập',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 409 },
            message: {
              type: 'string',
              example:
                'Không thể xóa chủ đề này vì đang được sử dụng bởi từ vựng khác',
            },
            success: { type: 'boolean', example: false },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-02T12:00:00.000Z',
            },
          },
        },
      ],
    },
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vocabTopicsService.remove(id);
    return AppResponse.success({
      data: null,
      message: 'Xóa chủ đề từ vựng thành công',
    });
  }
}
