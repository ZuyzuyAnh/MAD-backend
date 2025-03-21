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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { VocabsService } from './vocabs.service';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { PaginateDto } from '../utils/dto/paginate.dto';
import { VocabDifficulty } from './entities/vocab.entity';

@ApiTags('vocabs')
@Controller('vocabs')
export class VocabsController {
  constructor(private readonly vocabsService: VocabsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        word: { type: 'string' },
        definition: { type: 'string' },
        example: { type: 'string' },
        exampleTranslation: { type: 'string' },
        difficulty: {
          type: 'string',
          enum: Object.values(VocabDifficulty),
        },
        topicId: { type: 'integer' },
        imageUrl: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @Body() createVocabDto: CreateVocabDto,
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
    return this.vocabsService.create(createVocabDto, image);
  }

  @Get()
  findAll(
    @Query() paginateDto: PaginateDto,
    @Query('word') word?: string,
    @Query('topicId') topicId?: number,
    @Query('difficulty') difficulty?: VocabDifficulty,
  ) {
    return this.vocabsService.findAll(paginateDto, word, topicId, difficulty);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        word: { type: 'string' },
        definition: { type: 'string' },
        example: { type: 'string' },
        exampleTranslation: { type: 'string' },
        difficulty: { type: 'string', enum: Object.values(VocabDifficulty) },
        topicId: { type: 'integer' },
        imageUrl: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateVocabDto: UpdateVocabDto,
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
    if (updateVocabDto.topicId && typeof updateVocabDto.topicId === 'string') {
      updateVocabDto.topicId = parseInt(updateVocabDto.topicId, 10);
    }

    return this.vocabsService.update(+id, updateVocabDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabsService.remove(+id);
  }
}
