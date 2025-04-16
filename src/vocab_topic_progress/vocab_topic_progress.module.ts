import { Module } from '@nestjs/common';
import { VocabTopicProgressService } from './vocab_topic_progress.service';
import { VocabTopicProgressController } from './vocab_topic_progress.controller';
import { VocabTopicProgress } from './entities/vocab_topic_progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VocabTopicProgress])],
  controllers: [VocabTopicProgressController],
  providers: [VocabTopicProgressService],
})
export class VocabTopicProgressModule {}
