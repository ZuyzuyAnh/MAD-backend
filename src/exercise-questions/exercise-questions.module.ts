import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseQuestionsService } from './exercise-questions.service';
import { ExerciseQuestionsController } from './exercise-questions.controller';
import { ExerciseQuestion } from './entities/exercise-question.entity';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseQuestion]), AwsModule],
  controllers: [ExerciseQuestionsController],
  providers: [ExerciseQuestionsService],
  exports: [ExerciseQuestionsService],
})
export class ExerciseQuestionsModule {}
