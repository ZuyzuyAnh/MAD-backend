import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
  DefaultValuePipe,
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
  ApiQuery,
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

  @Get('review/:topicId')

  async getVocabsToReview(
    @GetUser('sub') userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    const vocabs = await this.vocabRepetitionsService.getVocabsToReview(
      userId,
      topicId,
      limit,
    );
    return AppResponse.successWithData({ data: vocabs });
  }

  @Get('by-status/:topicId')

  async getVocabsByStatus(
    @GetUser('sub') userId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
    @Query('status')
    status: 'mastered' | 'learning' | 'not_started' | 'all' = 'all',
  ) {
    const vocabs = await this.vocabRepetitionsService.getVocabsByStatus(
      userId,
      topicId,
      status,
    );
    return AppResponse.successWithData({ data: vocabs });
  }

  @Post('initialize/:topicId')

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

  async updateRepetition(
    @GetUser('sub') userId: number,
    @Body() updateRepetitionDto: UpdateRepetitionDto,
  ) {
    await this.vocabRepetitionsService.updateRepetition(
      userId,
      updateRepetitionDto.topicId,
      updateRepetitionDto.vocabId,
      updateRepetitionDto.difficulty,
    );

    return AppResponse.success('Cập nhật thành công');
  }

  @Get('stats/:topicId')

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
