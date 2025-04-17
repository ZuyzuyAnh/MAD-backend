import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseQuestionDto } from './create-exercise_question.dto';

export class UpdateExerciseQuestionDto extends PartialType(
  CreateExerciseQuestionDto,
) {}
