import { PartialType } from '@nestjs/mapped-types';
import { CreateExamSectionDto } from './create-exam_section.dto';

export class UpdateExamSectionDto extends PartialType(CreateExamSectionDto) {}
