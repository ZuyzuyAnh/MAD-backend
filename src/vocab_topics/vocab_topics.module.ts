import { Module } from '@nestjs/common';
import { VocabTopicsService } from './vocab_topics.service';
import { VocabTopicsController } from './vocab_topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabTopic } from './entities/vocab_topic.entity';
import { LanguagesModule } from 'src/languages/languages.module';
import { ProgressModule } from 'src/progress/progress.module';
import { VocabTopicProgressModule } from 'src/vocab_topic_progress/vocab_topic_progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VocabTopic]),
    LanguagesModule,
    ProgressModule,
    VocabTopicProgressModule,
  ],
  controllers: [VocabTopicsController],
  providers: [VocabTopicsService],
})
export class VocabTopicsModule {}
