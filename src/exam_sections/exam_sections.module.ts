import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSectionsService } from './exam_sections.service';
import { ExamSectionsController } from './exam_sections.controller';
import { ExamSection } from './entities/exam_section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSection])],
  controllers: [ExamSectionsController],
  providers: [ExamSectionsService],
})
export class ExamSectionsModule {}
