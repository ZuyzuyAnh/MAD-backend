import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseQuestionsService } from './exercise_questions.service';
import { ExerciseQuestionsController } from './exercise_questions.controller';
import { ExerciseQuestion } from './entities/exercise_question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseQuestion])],
  controllers: [ExerciseQuestionsController],
  providers: [ExerciseQuestionsService],
})
export class ExerciseQuestionsModule {}
