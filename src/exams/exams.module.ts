import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './entities/exam.entity';
import { LanguagesModule } from 'src/languages/languages.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ExamResultsModule } from 'src/exam_results/exam_results.module';
import { VocabTopicsModule } from 'src/vocab_topics/vocab_topics.module';
import { ExamSectionsModule } from 'src/exam_sections/exam_sections.module';
import { ExamSingleQuestionsModule } from 'src/exam_single_questions/exam_single_questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam]),
    LanguagesModule,
    ProgressModule,
    ExamResultsModule,
    VocabTopicsModule,
    ExamSectionsModule,
    ExamSingleQuestionsModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
