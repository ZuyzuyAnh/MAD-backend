import { Module } from '@nestjs/common';
import { VocabTopicsService } from './vocab_topics.service';
import { VocabTopicsController } from './vocab_topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabTopic } from './entities/vocab_topic.entity';
import { LanguagesModule } from 'src/languages/languages.module';
import { ProgressModule } from 'src/progress/progress.module';
import { VocabTopicProgressModule } from 'src/vocab_topic_progress/vocab_topic_progress.module';
import { VocabsModule } from 'src/vocabs/vocabs.module';
import { VocabGameResultsModule } from 'src/vocab_game_results/vocab_game_results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VocabTopic]),
    LanguagesModule,
    ProgressModule,
    VocabTopicProgressModule,
    VocabsModule,
    VocabGameResultsModule,
  ],
  controllers: [VocabTopicsController],
  providers: [VocabTopicsService],
  exports: [VocabTopicsService],
})
export class VocabTopicsModule {}
