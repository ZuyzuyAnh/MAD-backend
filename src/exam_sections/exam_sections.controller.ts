import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamSectionsService } from './exam_sections.service';
import { CreateExamSectionDto } from './dto/create-exam_section.dto';
import { UpdateExamSectionDto } from './dto/update-exam_section.dto';

@Controller('exam-sections')
export class ExamSectionsController {
  constructor(private readonly examSectionsService: ExamSectionsService) {}

  @Post()
  create(@Body() createExamSectionDto: CreateExamSectionDto) {
    return this.examSectionsService.create(createExamSectionDto);
  }

  @Get()
  findAll() {
    return this.examSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examSectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamSectionDto: UpdateExamSectionDto,
  ) {
    return this.examSectionsService.update(+id, updateExamSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examSectionsService.remove(+id);
  }
}
