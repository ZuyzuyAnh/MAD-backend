import { Module } from '@nestjs/common';
import { VocabRepetitionsService } from './vocab_repetitions.service';
import { VocabRepetitionsController } from './vocab_repetitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabRepetition } from './entities/vocab_repetition.entity';
import { VocabTopicProgress } from 'src/vocab_topic_progress/entities/vocab_topic_progress.entity';
import { Vocab } from 'src/vocabs/entities/vocab.entity';
import { Progress } from 'src/progress/entities/progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VocabRepetition,
      VocabTopicProgress,
      Vocab,
      Progress,
    ]),
  ],
  controllers: [VocabRepetitionsController],
  providers: [VocabRepetitionsService],
  exports: [VocabRepetitionsService],
})
export class VocabRepetitionsModule {}
