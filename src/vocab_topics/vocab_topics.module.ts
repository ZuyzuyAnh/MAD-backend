import { Module } from '@nestjs/common';
import { VocabTopicsService } from './vocab_topics.service';
import { VocabTopicsController } from './vocab_topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabTopic } from './entities/vocab_topic.entity';
import { LanguagesModule } from 'src/languages/languages.module';

@Module({
  imports: [TypeOrmModule.forFeature([VocabTopic]), LanguagesModule],
  controllers: [VocabTopicsController],
  providers: [VocabTopicsService],
})
export class VocabTopicsModule {}
