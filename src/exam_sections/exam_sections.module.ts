import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSectionsService } from './exam_sections.service';
import { ExamSectionsController } from './exam_sections.controller';
import { ExamSection } from './entities/exam_section.entity';
import { ExamSectionItemsModule } from 'src/exam_section_items/exam_section_items.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSection]), ExamSectionItemsModule],
  controllers: [ExamSectionsController],
  providers: [ExamSectionsService],
  exports: [ExamSectionsService],
})
export class ExamSectionsModule {}
