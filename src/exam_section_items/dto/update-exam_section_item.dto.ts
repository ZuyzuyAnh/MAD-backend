import { PartialType } from '@nestjs/mapped-types';
import { CreateExamSectionItemDto } from './create-exam_section_item.dto';

export class UpdateExamSectionItemDto extends PartialType(
  CreateExamSectionItemDto,
) {}
