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
 
  async create(@Body() createVocabDto: CreateVocabDto) {
    const vocab = await this.vocabsService.create(createVocabDto);
    return AppResponse.successWithData({
      data: vocab,
      message: 'Tạo từ vựng thành công',
    });
  }

  @Get()

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
