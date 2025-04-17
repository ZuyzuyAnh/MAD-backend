import { Module } from '@nestjs/common';
import { ExamSectionItemsService } from './exam_section_items.service';
import { ExamSectionItemsController } from './exam_section_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSectionItem } from './entities/exam_section_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSectionItem])],
  controllers: [ExamSectionItemsController],
  providers: [ExamSectionItemsService],
})
export class ExamSectionItemsModule {}
