import { Module } from '@nestjs/common';
import { ExamSectionItemsService } from './exam_section_items.service';
import { ExamSectionItemsController } from './exam_section_items.controller';

@Module({
  controllers: [ExamSectionItemsController],
  providers: [ExamSectionItemsService],
})
export class ExamSectionItemsModule {}
