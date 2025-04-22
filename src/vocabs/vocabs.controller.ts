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
  ParseFilePipeBuilder,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VocabsService } from './vocabs.service';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import AppResponse from '../common/dto/api-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Từ vựng')
@Controller('vocabs')
export class VocabsController {
  constructor(private readonly vocabsService: VocabsService) {}

  @Get('random')
  @UseGuards(JwtAuthGuard)
  async findRandomVocabsForUser(@GetUser('sub') userId: number) {
    const vocabs = await this.vocabsService.findRandomVocabsForUser(userId);
    return AppResponse.successWithData({
      data: vocabs,
    });
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchForKeyword(
    @GetUser('sub') userId: number,
    @Query('keyword') keyword: string,
  ) {
    const vocabs = await this.vocabsService.findVocabsByKeyword(
      userId,
      keyword,
    );

    return AppResponse.successWithData({
      data: vocabs,
    });
  }
  @Post()
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo từ vựng mới' })
  @ApiBody({
    description: 'Thông tin từ vựng và hình ảnh minh họa',
    schema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'Từ vựng',
          example: 'cat',
        },
        definition: {
          type: 'string',
          description: 'Định nghĩa của từ',
          example:
            'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
        },
        example: {
          type: 'string',
          description: 'Ví dụ sử dụng từ',
          example: 'I have a pet cat at home.',
        },
        exampleTranslation: {
          type: 'string',
          description: 'Bản dịch của ví dụ',
          example: 'Tôi có một con mèo cưng ở nhà.',
        },

        topicId: {
          type: 'integer',
          description: 'ID của chủ đề từ vựng',
          example: 1,
        },
        imageUrl: {
          type: 'string',
          description: 'URL hình ảnh minh họa (nếu không upload file)',
          example: 'https://example.com/images/cat.jpg',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Hình ảnh minh họa cho từ vựng',
        },
      },
      required: ['word', 'definition', 'difficulty', 'topicId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo từ vựng thành công',
    schema: {
      example: {
        data: {
          id: 1,
          word: 'cat',
          definition:
            'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
          example: 'I have a pet cat at home.',
          exampleTranslation: 'Tôi có một con mèo cưng ở nhà.',
          topicId: 1,
          imageUrl: 'https://example.com/images/cat.jpg',
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo từ vựng thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Lỗi dữ liệu đầu vào',
  })
  @ApiResponse({
    status: 422,
    description: 'File không hợp lệ (kích thước, định dạng)',
  })
  async create(@Body() createVocabDto: CreateVocabDto) {
    const vocab = await this.vocabsService.create(createVocabDto);
    return AppResponse.successWithData({
      data: vocab,
      message: 'Tạo từ vựng thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách từ vựng' })
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
    name: 'word',
    required: false,
    description: 'Tìm kiếm theo từ vựng',
    type: String,
  })
  @ApiQuery({
    name: 'topicId',
    required: false,
    description: 'Lọc theo ID chủ đề',
    type: Number,
  })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    description: 'Lọc theo độ khó',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách từ vựng',
    schema: {
      example: {
        data: {
          data: [
            {
              id: 1,
              word: 'cat',
              definition:
                'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
              example: 'I have a pet cat at home.',
              exampleTranslation: 'Tôi có một con mèo cưng ở nhà.',
              topicId: 1,
              imageUrl: 'https://example.com/images/cat.jpg',
              createdAt: '2023-08-01T12:00:00.000Z',
              updatedAt: '2023-08-01T12:00:00.000Z',
              topic: {
                id: 1,
                topic: 'Động vật',
                languageId: 1,
              },
            },
          ],
          meta: {
            total: 15,
            page: 1,
            limit: 10,
            totalPages: 2,
            hasNextPage: true,
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
    @Query('word') word?: string,
    @Query('topicId') topicId?: number,
  ) {
    const result = await this.vocabsService.findAll(paginateDto, word, topicId);
    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một từ vựng' })
  @ApiParam({
    name: 'id',
    description: 'ID của từ vựng',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết từ vựng',
    schema: {
      example: {
        data: {
          id: 1,
          word: 'cat',
          definition:
            'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
          example: 'I have a pet cat at home.',
          exampleTranslation: 'Tôi có một con mèo cưng ở nhà.',
          topicId: 1,
          imageUrl: 'https://example.com/images/cat.jpg',
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
          topic: {
            id: 1,
            topic: 'Động vật',
            languageId: 1,
            language: {
              id: 1,
              name: 'Tiếng Anh',
            },
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
    description: 'Không tìm thấy từ vựng',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const vocab = await this.vocabsService.findOne(id);
    return AppResponse.successWithData({
      data: vocab,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin từ vựng' })
  @ApiParam({
    name: 'id',
    description: 'ID của từ vựng cần cập nhật',
    type: Number,
  })
  @ApiBody({
    description: 'Thông tin cập nhật cho từ vựng',
    schema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'Từ vựng',
          example: 'cat',
        },
        definition: {
          type: 'string',
          description: 'Định nghĩa của từ',
          example:
            'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
        },
        example: {
          type: 'string',
          description: 'Ví dụ sử dụng từ',
          example: 'The cat is sleeping on the sofa.',
        },
        exampleTranslation: {
          type: 'string',
          description: 'Bản dịch của ví dụ',
          example: 'Con mèo đang ngủ trên ghế sofa.',
        },
        topicId: {
          type: 'integer',
          description: 'ID của chủ đề từ vựng',
          example: 1,
        },
        imageUrl: {
          type: 'string',
          description: 'URL hình ảnh minh họa (nếu không upload file)',
          example: 'https://example.com/images/cat_updated.jpg',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Hình ảnh minh họa mới cho từ vựng',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật từ vựng thành công',
    schema: {
      example: {
        data: {
          id: 1,
          word: 'cat',
          definition:
            'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
          example: 'The cat is sleeping on the sofa.',
          exampleTranslation: 'Con mèo đang ngủ trên ghế sofa.',
          topicId: 1,
          imageUrl: 'https://example.com/images/cat_updated.jpg',
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-02T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật từ vựng thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy từ vựng',
  })
  @ApiResponse({
    status: 422,
    description: 'File không hợp lệ (kích thước, định dạng)',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabDto: UpdateVocabDto,
  ) {
    const vocab = await this.vocabsService.update(id, updateVocabDto);
    return AppResponse.successWithData({
      data: vocab,
      message: 'Cập nhật từ vựng thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa từ vựng' })
  @ApiParam({
    name: 'id',
    description: 'ID của từ vựng cần xóa',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa từ vựng thành công',
    schema: {
      example: {
        data: null,
        statusCode: 200,
        message: 'Xóa từ vựng thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy từ vựng',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vocabsService.remove(id);
    return AppResponse.successWithData({
      data: null,
      message: 'Xóa từ vựng thành công',
    });
  }
}
