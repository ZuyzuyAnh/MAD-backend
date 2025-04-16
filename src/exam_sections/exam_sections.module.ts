import { Module } from '@nestjs/common';
import { ExamSectionsService } from './exam_sections.service';
import { ExamSectionsController } from './exam_sections.controller';

@Module({
  controllers: [ExamSectionsController],
  providers: [ExamSectionsService],
})
export class ExamSectionsModule {}
