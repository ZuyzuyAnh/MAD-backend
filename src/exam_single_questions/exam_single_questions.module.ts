import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSingleQuestionsService } from './exam_single_questions.service';
import { ExamSingleQuestionsController } from './exam_single_questions.controller';
import { ExamSingleQuestion } from './entities/exam_single_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSingleQuestion])],
  controllers: [ExamSingleQuestionsController],
  providers: [ExamSingleQuestionsService],
  exports: [ExamSingleQuestionsService],
})
export class ExamSingleQuestionsModule {}
