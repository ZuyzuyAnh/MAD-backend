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
  ParseEnumPipe,
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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Chủ đề từ vựng')
@Controller('vocab-topics')
export class VocabTopicsController {
  constructor(private readonly vocabTopicsService: VocabTopicsService) {}

  @Get(':id/vocab-games/word-link')
  @UseGuards(JwtAuthGuard)
  async getWordLinkGame(@Param('id', ParseIntPipe) id: number) {
    const data = await this.vocabTopicsService.getWordLinkByTopic(id);

    return AppResponse.successWithData({
      data,
    });
  }

  @Get(':id/vocab-games/scramble')
  @UseGuards(JwtAuthGuard)
  async getScrambleGame(@Param('id', ParseIntPipe) id: number) {
    const data = await this.vocabTopicsService.getScrambleByTopic(id);

    return AppResponse.successWithData({
      data,
    });
  }

  @Get(':id/vocab-games/listening')
  @UseGuards(JwtAuthGuard)
  async getListeningGame(@Param('id', ParseIntPipe) id: number) {
    const data = await this.vocabTopicsService.getListeningByTopic(id);

    return AppResponse.successWithData({
      data,
    });
  }

  @Get('completed')
  @UseGuards(JwtAuthGuard)
  async getCompletedVocabTopics(@GetUser('sub') userId: number) {
    const data =
      await this.vocabTopicsService.countCompletedVocabTopics(userId);

    return AppResponse.successWithData({
      data,
    });
  }

  @Get('for-user')
  @UseGuards(JwtAuthGuard)
  async getVocabTopicsForUser(
    @Query() paginateDto: PaginateDto,
    @GetUser('sub') userId: number,
    @Query('level') level?: VocabLevel,
    @Query('topic') topic?: string,
  ) {
    const topics = await this.vocabTopicsService.findAllForUser(
      userId,
      paginateDto,
      topic,
      level,
    );

    return AppResponse.successWithData({
      data: topics,
      message: 'Lấy danh sách chủ đề từ vựng cho người dùng thành công',
    });
  }

  @Post()
  @AdminOnly()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
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
    return AppResponse.successWithData({
      data: topic,
      message: 'Tạo chủ đề từ vựng thành công',
    });
  }

  /**
   * Lấy danh sách chủ đề từ vựng
   */
  @Get()
  async findAll(
    @Query() paginateDto: PaginateDto,
    @Query('topic') topic?: string,
    @Query('languageId') languageId?: number,
    @Query('level') level?: VocabLevel,
    @Query('isRandom') isRandom?: boolean,
  ) {
    try {
      const parsedLanguageId = languageId ? Number(languageId) : undefined;

      const parsedIsRandom =
        typeof isRandom === 'string' ? isRandom === 'true' : isRandom === true;

      const result = await this.vocabTopicsService.findAll(
        paginateDto,
        1,
        topic,
        parsedLanguageId,
        level,
        parsedIsRandom,
      );

      return AppResponse.successWithData({
        data: result,
        message: 'Lấy danh sách chủ đề từ vựng thành công',
      });
    } catch (error) {
      return AppResponse.error(
        error.message || 'Lỗi khi lấy danh sách chủ đề từ vựng',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const topic = await this.vocabTopicsService.findOne(id);
    return AppResponse.successWithData({
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
    return AppResponse.successWithData({
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vocabTopicsService.remove(id);
    return AppResponse.successWithData({
      data: null,
      message: 'Xóa chủ đề từ vựng thành công',
    });
  }

  @Get('learning')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findLearningTopics(
    @Query() paginateDto: PaginateDto,
    @GetUser('sub') userId: number,
  ) {
    try {
      const topics = await this.vocabTopicsService.findLearningTopics(
        userId,
        paginateDto,
      );
      return AppResponse.successWithData({
        data: topics,
        message: 'Lấy danh sách chủ đề từ vựng đang học thành công',
      });
    } catch (error) {
      return AppResponse.error(
        error.message || 'Không tìm thấy chủ đề từ vựng đang học',
      );
    }
  }
}
