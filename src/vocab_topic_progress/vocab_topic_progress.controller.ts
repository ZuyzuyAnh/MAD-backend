import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VocabTopicProgressService } from './vocab_topic_progress.service';
import { CreateVocabTopicProgressDto } from './dto/create-vocab_topic_progress.dto';
import { UpdateVocabTopicProgressDto } from './dto/update-vocab_topic_progress.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import AppResponse from 'src/common/dto/api-response.dto';

@Controller('vocab-topic-progress')
export class VocabTopicProgressController {
  constructor(
    private readonly vocabTopicProgressService: VocabTopicProgressService,
  ) {}

  @Post()
  create(@Body() createVocabTopicProgressDto: CreateVocabTopicProgressDto) {
    return this.vocabTopicProgressService.create(createVocabTopicProgressDto);
  }

  @Get('learned')
  @UseGuards(JwtAuthGuard)
  findLearnedTopics(@GetUser('sub') userId: number) {
    const data = this.vocabTopicProgressService.findUserLearnedTopics(userId);

    return AppResponse.successWithData({ data });
  }

  @Get()
  findAll() {
    return this.vocabTopicProgressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabTopicProgressService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVocabTopicProgressDto: UpdateVocabTopicProgressDto,
  ) {
    return this.vocabTopicProgressService.update(
      +id,
      updateVocabTopicProgressDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabTopicProgressService.remove(+id);
  }
}
