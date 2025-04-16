import { Module } from '@nestjs/common';
import { ExamSingleQuestionsService } from './exam_single_questions.service';
import { ExamSingleQuestionsController } from './exam_single_questions.controller';

@Module({
  controllers: [ExamSingleQuestionsController],
  providers: [ExamSingleQuestionsService],
})
export class ExamSingleQuestionsModule {}
