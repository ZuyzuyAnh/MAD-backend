import { PartialType } from '@nestjs/swagger';
import { CreateExamSingleQuestionDto } from './create-exam_single_question.dto';

export class UpdateExamSingleQuestionDto extends PartialType(CreateExamSingleQuestionDto) {}
