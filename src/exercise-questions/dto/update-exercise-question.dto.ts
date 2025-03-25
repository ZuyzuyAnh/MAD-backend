import { PartialType } from '@nestjs/swagger';
import { CreateExerciseQuestionDto } from './create-exercise-question.dto';

export class UpdateExerciseQuestionDto extends PartialType(
  CreateExerciseQuestionDto,
) {}
