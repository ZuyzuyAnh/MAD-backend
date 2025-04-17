import { PartialType } from '@nestjs/mapped-types';
import { CreateExamSingleQuestionDto } from './create-exam_single_question.dto';

export class UpdateExamSingleQuestionDto extends PartialType(
  CreateExamSingleQuestionDto,
) {}
