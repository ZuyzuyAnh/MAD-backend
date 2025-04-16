import { Module } from '@nestjs/common';
import { ExerciseQuestionsService } from './exercise_questions.service';
import { ExerciseQuestionsController } from './exercise_questions.controller';

@Module({
  controllers: [ExerciseQuestionsController],
  providers: [ExerciseQuestionsService],
})
export class ExerciseQuestionsModule {}
