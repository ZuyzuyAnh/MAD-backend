import { PartialType } from '@nestjs/swagger';
import { CreateExamSectionItemDto } from './create-exam_section_item.dto';

export class UpdateExamSectionItemDto extends PartialType(CreateExamSectionItemDto) {}
