import { PartialType } from '@nestjs/swagger';
import { CreateExamSectionDto } from './create-exam_section.dto';

export class UpdateExamSectionDto extends PartialType(CreateExamSectionDto) {}
