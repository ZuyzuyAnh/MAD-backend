import { PartialType } from '@nestjs/swagger';
import { CreateExerciseQuestionDto } from './create-exercise_question.dto';

export class UpdateExerciseQuestionDto extends PartialType(CreateExerciseQuestionDto) {}
