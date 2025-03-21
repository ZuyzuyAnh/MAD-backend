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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { VocabTopicsService } from './vocab_topics.service';
import { CreateVocabTopicDto } from './dto/create-vocab_topic.dto';
import { UpdateVocabTopicDto } from './dto/update-vocab_topic.dto';
import { PaginateDto } from '../utils/dto/paginate.dto';

@Controller('vocab-topics')
export class VocabTopicsController {
  constructor(private readonly vocabTopicsService: VocabTopicsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createVocabTopicDto: CreateVocabTopicDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.vocabTopicsService.create(createVocabTopicDto, image);
  }

  @Get()
  findAll(
    @Query() paginateDto: PaginateDto,
    @Query('topic') topic?: string,
    @Query('languageId') languageId?: number,
  ) {
    return this.vocabTopicsService.findAll(paginateDto, topic, languageId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabTopicsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateVocabTopicDto: UpdateVocabTopicDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.vocabTopicsService.update(+id, updateVocabTopicDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabTopicsService.remove(+id);
  }
}
