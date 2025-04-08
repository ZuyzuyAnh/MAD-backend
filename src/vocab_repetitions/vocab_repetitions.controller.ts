import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { VocabRepetitionsService } from './vocab_repetitions.service';
import AppResponse from 'src/common/dto/api-response.dto';
import { VocabDifficulty } from 'src/vocabs/entities/vocab.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger';
import { UpdateRepetitionDto } from './dto/vocab-repitition.dto';

@ApiTags('Ôn tập từ vựng')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vocab-repetitions')
export class VocabRepetitionsController {
  constructor(
    private readonly vocabRepetitionsService: VocabRepetitionsService,
  ) {}

  @Get('review/:progressId/:topicId')
  @ApiOperation({
    summary: 'Lấy danh sách từ vựng cần ôn tập',
    description:
      'Trả về danh sách các từ vựng cần ôn tập cho một chủ đề cụ thể dựa trên thuật toán khoảng cách thời gian.',
  })
  @ApiParam({
    name: 'progressId',
    type: 'number',
    description: 'ID của tiến độ học tập',
    example: 1,
  })
  @ApiParam({
    name: 'topicId',
    type: 'number',
    description: 'ID của chủ đề từ vựng',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách từ vựng cần ôn tập',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  word: { type: 'string', example: 'cat' },
                  meaning: { type: 'string', example: 'con mèo' },
                  pronunciation: { type: 'string', example: '/kæt/' },
                  image_url: {
                    type: 'string',
                    example: 'https://example.com/images/cat.jpg',
                    nullable: true,
                  },
                  audio_url: {
                    type: 'string',
                    example: 'https://example.com/audio/cat.mp3',
                    nullable: true,
                  },
                  example_sentence: {
                    type: 'string',
                    example: 'The cat is sleeping on the couch.',
                    nullable: true,
                  },
                  difficulty: {
                    type: 'string',
                    enum: Object.values(VocabDifficulty),
                    example: VocabDifficulty.BEGINNER,
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
    description: 'Không tìm thấy tiến độ hoặc chủ đề',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'Không tìm thấy tiến độ chủ đề',
            },
            success: { type: 'boolean', example: false },
          },
        },
      ],
    },
  })
  async getVocabsToReview(
    @GetUser('sub') userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    return this.vocabRepetitionsService.getVocabsToReview(userId, topicId);
  }

  @Post('initialize/:progressId/:topicId')
  @ApiOperation({
    summary: 'Khởi tạo dữ liệu ôn tập cho một chủ đề',
    description:
      'Tạo dữ liệu ban đầu để theo dõi việc ôn tập các từ vựng trong một chủ đề cụ thể.',
  })
  @ApiParam({
    name: 'progressId',
    type: 'number',
    description: 'ID của tiến độ học tập',
    example: 1,
  })
  @ApiParam({
    name: 'topicId',
    type: 'number',
    description: 'ID của chủ đề từ vựng',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Khởi tạo thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 200 },
            message: {
              type: 'string',
              example: 'Khởi tạo thành công các từ vựng cho chủ đề này',
            },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ hoặc chủ đề',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'Không tìm thấy tiến độ chủ đề',
            },
            success: { type: 'boolean', example: false },
          },
        },
      ],
    },
  })
  async initializeRepetitionsForTopic(
    @GetUser('sub') userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    await this.vocabRepetitionsService.initializeRepetitionsForTopic(
      userId,
      topicId,
    );

    return AppResponse.success(
      'Khởi tạo thành công các từ vựng cho chủ đề này',
    );
  }

  @Post('update')
  @ApiOperation({
    summary: 'Cập nhật kết quả ôn tập từ vựng',
    description:
      'Cập nhật thông tin ôn tập của một từ vựng dựa trên độ khó đánh giá của người dùng, để tính toán lịch ôn tập tiếp theo.',
  })
  @ApiBody({
    type: UpdateRepetitionDto,
    description: 'Thông tin cập nhật ôn tập từ vựng',
    examples: {
      example1: {
        value: {
          topicId: 2,
          vocabId: 3,
          difficulty: VocabDifficulty.BEGINNER,
        },
        summary: 'Ví dụ cập nhật ôn tập từ vựng',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Cập nhật thành công' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy từ vựng hoặc tiến độ',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'Không tìm thấy từ vựng với id: 3',
            },
            success: { type: 'boolean', example: false },
          },
        },
      ],
    },
  })
  async updateRepetition(
    @GetUser('sub') userId: number,

    @Body()
    updateRepetitionDto: {
      topicId: number;
      vocabId: number;
      difficulty: VocabDifficulty;
    },
  ) {
    await this.vocabRepetitionsService.updateRepetition(
      userId,
      updateRepetitionDto.topicId,
      updateRepetitionDto.vocabId,
      updateRepetitionDto.difficulty,
    );

    return AppResponse.success('Cập nhật thành công');
  }

  @Get('stats/:progressId/:topicId')
  @ApiOperation({
    summary: 'Lấy thống kê ôn tập từ vựng',
    description:
      'Trả về thống kê về việc ôn tập từ vựng cho một chủ đề cụ thể, bao gồm số lượng từ đã thành thạo, đang học và chưa học.',
  })
  @ApiParam({
    name: 'progressId',
    type: 'number',
    description: 'ID của tiến độ học tập',
    example: 1,
  })
  @ApiParam({
    name: 'topicId',
    type: 'number',
    description: 'ID của chủ đề từ vựng',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Thống kê ôn tập từ vựng',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                totalVocabs: {
                  type: 'number',
                  description: 'Tổng số từ vựng trong chủ đề',
                  example: 30,
                },
                mastered: {
                  type: 'number',
                  description: 'Số từ vựng đã thành thạo (lặp lại ≥ 3 lần)',
                  example: 10,
                },
                learning: {
                  type: 'number',
                  description:
                    'Số từ vựng đang trong quá trình học (lặp lại 1-2 lần)',
                  example: 15,
                },
                notStarted: {
                  type: 'number',
                  description: 'Số từ vựng chưa bắt đầu học (lặp lại 0 lần)',
                  example: 5,
                },
                dueToday: {
                  type: 'number',
                  description: 'Số từ vựng cần ôn tập trong hôm nay',
                  example: 8,
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
    description: 'Không tìm thấy tiến độ hoặc chủ đề',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 404 },
            message: {
              type: 'string',
              example: 'Không tìm thấy tiến độ chủ đề',
            },
            success: { type: 'boolean', example: false },
          },
        },
      ],
    },
  })
  async getRepetitionStats(
    @GetUser('sub') userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    const stats = await this.vocabRepetitionsService.getRepetitionStats(
      userId,
      topicId,
    );

    return AppResponse.successWithData({ data: stats });
  }
}
